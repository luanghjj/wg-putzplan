import { useState, useRef } from "react";
import { F, inp, inpS, btnP, btnG, btnS, lbl, tabB, tabA, aCard, delB, ov, mod } from "../styles";
import { ALL_PERMS, CRIT_PERMS } from "../data/constants";
import { compImg } from "../utils/helpers";
import { AnnouncementAdmin } from "./Announcement";
import { C } from "../styles";

// Generate unique 4-digit PIN
const genPin=(users)=>{const used=new Set(users.map(u=>u.password).filter(Boolean));let pin;do{pin=String(Math.floor(1000+Math.random()*9000));}while(used.has(pin));return pin;};

function RoomMgr({t,st,sv,hp,rpin,show}){
  const[nr,setNr]=useState("");const[addTo,setAddTo]=useState(null);const[nn,setNn]=useState("");const[np,setNp]=useState("");const[nrl,setNrl]=useState("resident");
  const RI={owner:"👑",manager:"🔧",resident:"👤"};
  const aR=async()=>{if(!nr.trim()||!hp("manage_rooms"))return;const ok=await rpin();if(!ok)return;sv({...st,rooms:[...st.rooms,{id:Date.now().toString(),name:nr.trim(),residents:[]}]});setNr("");show(st.lang==="de"?"Zimmer erstellt":"Đã tạo phòng");};
  const dR=async id=>{if(!hp("manage_rooms"))return;const ok=await rpin();if(!ok)return;const room=st.rooms.find(r=>r.id===id);const ns=(room?.residents||[]).map(r=>r.name);sv({...st,rooms:st.rooms.filter(r=>r.id!==id),users:st.users.filter(u=>!ns.includes(u.name)||u.role==="owner")});};
  const aP=rid=>{if(!nn.trim())return;const room=st.rooms.find(r=>r.id===rid);sv({...st,rooms:st.rooms.map(r=>r.id===rid?{...r,residents:[...(r.residents||[]),{name:nn.trim(),password:np}]}:r),users:[...st.users,{id:Date.now().toString(),name:nn.trim(),password:np,role:nrl,room:room.name,roomId:rid}]});setNn("");setNp("");setNrl("resident");setAddTo(null);show(st.lang==="de"?"Bewohner hinzugefügt":"Đã thêm cư dân");};
  const dP=(rid,ri,name)=>{sv({...st,rooms:st.rooms.map(r=>r.id===rid?{...r,residents:r.residents.filter((_,i)=>i!==ri)}:r),users:st.users.filter(u=>!(u.name===name&&u.roomId===rid&&u.role!=="owner"))});};
  return <div>
    {st.rooms.map(room=><div key={room.id} style={{background:"#fff",borderRadius:14,padding:14,marginBottom:10,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span>🚪</span><strong style={{flex:1,fontSize:15}}>{room.name}</strong>{hp("manage_rooms")&&<button style={delB} onClick={()=>dR(room.id)}>×</button>}</div>
      {(room.residents||[]).map((res,ri)=>{const uo=st.users.find(u=>u.name===res.name&&u.roomId===room.id);return <div key={ri} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",fontSize:13,borderBottom:"1px solid #F8FAFC"}}><span style={{fontSize:14}}>{RI[uo?.role||"resident"]}</span><span style={{flex:1,fontSize:13}}>{res.name}</span><span style={{fontSize:11,color:"#94A3B8"}}>{t[uo?.role||"resident"]}</span><span>{res.password?"🔒":"🔓"}</span>{hp("manage_residents")&&<button style={delB} onClick={()=>dP(room.id,ri,res.name)}>×</button>}</div>;})}
      {addTo===room.id?<div style={{display:"flex",flexDirection:"column",gap:6,marginTop:8,padding:10,background:"#F8FAFC",borderRadius:10}}><input style={inpS} placeholder={t.residentName} value={nn} onChange={e=>setNn(e.target.value)}/><div style={{display:"flex",gap:6,alignItems:"center"}}><input style={{...inpS,flex:1}} placeholder="PIN" value={np} onChange={e=>setNp(e.target.value)}/><button style={{background:"none",border:"1px solid #CBD5E1",borderRadius:8,padding:"6px 10px",fontSize:11,color:"#3B82F6",cursor:"pointer",fontFamily:F,whiteSpace:"nowrap"}} onClick={()=>setNp(genPin(st.users))}>🎲 Auto</button></div><select style={inpS} value={nrl} onChange={e=>setNrl(e.target.value)}><option value="resident">👤 {t.resident}</option><option value="manager">🔧 {t.manager}</option></select><div style={{display:"flex",gap:6}}><button style={{...btnS,flex:1}} onClick={()=>aP(room.id)}>+ {t.save}</button><button style={{...btnG,flex:1,padding:"6px 12px",fontSize:13}} onClick={()=>setAddTo(null)}>{t.cancel}</button></div></div>
      :hp("manage_residents")&&<button style={{background:"none",border:"1px dashed #CBD5E1",borderRadius:8,padding:"6px 14px",fontSize:12,color:"#3B82F6",cursor:"pointer",width:"100%",fontFamily:F,marginTop:8}} onClick={()=>{setAddTo(room.id);setNn("");setNp(genPin(st.users));setNrl("resident");}}>+ {t.addResident}</button>}
    </div>)}
    {hp("manage_rooms")&&<div style={{display:"flex",gap:8,marginTop:12}}><input style={{...inp,flex:1}} placeholder={t.roomName} value={nr} onChange={e=>setNr(e.target.value)} onKeyDown={e=>e.key==="Enter"&&aR()}/><button style={btnP} onClick={aR}>+ {t.addRoom}</button></div>}
  </div>;
}

function TaskMgr({t,st,sv,show,srp}){
  const[mode,setMode]=useState("daily");const[nd,setNd]=useState("");const[nv,setNv]=useState("");const[npts,setNpts]=useState(1);const[aid,setAid]=useState("kitchen");
  const normRefKey=(taskDe)=>{if(!taskDe||typeof taskDe!="string")return null;const s=taskDe.trim();if(!s)return null;const exact=`task-${s}`; if(st.refPhotos?.[exact]) return exact; const normalized=`task-${s.toLowerCase()}`; if(st.refPhotos?.[normalized]) return normalized; const fallback=Object.keys(st.refPhotos||{}).find(k=>k.toLowerCase()===exact.toLowerCase()||k.toLowerCase()===normalized.toLowerCase()); return fallback||exact;};
  const[editTut,setEditTut]=useState(null);const[tutSteps,setTutSteps]=useState([]);const[tutVideo,setTutVideo]=useState("");
  const aD=()=>{if(!nd.trim())return;sv({...st,dailyTasks:[...st.dailyTasks,{de:nd.trim(),vi:nv.trim()||nd.trim(),pts:Number(npts)||1}]});setNd("");setNv("");setNpts(1);show("✓");};
  const dD=i=>{sv({...st,dailyTasks:st.dailyTasks.filter((_,idx)=>idx!==i)});};
  const aW=()=>{if(!nd.trim())return;sv({...st,weeklyAreas:st.weeklyAreas.map(a=>a.id===aid?{...a,tasks:[...a.tasks,{de:nd.trim(),vi:nv.trim()||nd.trim(),pts:Number(npts)||3}]}:a)});setNd("");setNv("");setNpts(3);show("✓");};
  const dW=(ai,ti)=>{sv({...st,weeklyAreas:st.weeklyAreas.map(a=>a.id===ai?{...a,tasks:a.tasks.filter((_,i)=>i!==ti)}:a)});};
  const uRef=async(taskDe,e)=>{const f=e.target.files?.[0];if(!f)return;const img=await compImg(f,600,.6);const key=normRefKey(taskDe)||`task-${taskDe.trim()}`;srp({...(st.refPhotos||{}),[key]:img});show("📸 ✓");};
  const dRef=(taskDe)=>{const r={...(st.refPhotos||{})};const key=normRefKey(taskDe)||`task-${taskDe.trim()}`;delete r[key];srp(r);};
  const openTutEdit=(taskDe)=>{const key=`task-${taskDe}`;const existing=st.tutorials?.[key];setEditTut(taskDe);setTutSteps(existing?.steps?existing.steps.map(s=>({...s})):[{textDe:"",textVi:"",photo:null}]);setTutVideo(existing?.videoUrl||"");};
  const saveTut=()=>{const key=`task-${editTut}`;const validSteps=tutSteps.filter(s=>s.textDe.trim()||s.textVi.trim()||s.photo);sv({...st,tutorials:{...(st.tutorials||{}),[key]:{steps:validSteps,videoUrl:tutVideo.trim()}}});setEditTut(null);show("📖 ✓");};
  const delTut=(taskDe)=>{const tuts={...(st.tutorials||{})};delete tuts[`task-${taskDe}`];sv({...st,tutorials:tuts});show("✓");};
  const addTutStep=()=>setTutSteps(s=>[...s,{textDe:"",textVi:"",photo:null}]);
  const rmTutStep=i=>setTutSteps(s=>s.filter((_,idx)=>idx!==i));
  const updStep=(i,field,val)=>setTutSteps(s=>s.map((x,idx)=>idx===i?{...x,[field]:val}:x));
  const stepPhoto=async(i,e)=>{const f=e.target.files?.[0];if(!f)return;const img=await compImg(f,500,.5);updStep(i,"photo",img);};

  const TaskItem=({task,onDel})=>{
    const refKey=normRefKey(task.de);const hasRef=!!st.refPhotos?.[refKey];const hasTut=st.tutorials?.[refKey]?.steps?.length>0;
    return <div style={{background:"#fff",borderRadius:8,marginBottom:6,padding:"8px 10px",boxShadow:"0 1px 2px rgba(0,0,0,.03)"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{flex:1,fontSize:13}}>{task.de} <span style={{color:"#94A3B8",fontSize:11}}>({task.vi})</span></span><span style={{fontSize:12,color:"#F59E0B",fontWeight:700}}>+{task.pts}⭐</span><button style={delB} onClick={onDel}>×</button></div>
      <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4,flexWrap:"wrap"}}>
        {hasRef?<><img src={st.refPhotos[refKey]} style={{height:36,width:52,objectFit:"cover",borderRadius:6}} alt="ref"/><span style={{fontSize:10,color:"#10B981"}}>✓ {t.refPhoto}</span><button style={{...delB,fontSize:14}} onClick={()=>dRef(task.de)}>×</button></>:<label style={{fontSize:11,color:"#3B82F6",cursor:"pointer",display:"flex",alignItems:"center",gap:3}}>📷 {t.uploadRef}<input type="file" accept="image/*" style={{display:"none"}} onChange={e=>uRef(task.de,e)}/></label>}
        <span style={{color:"#E2E8F0"}}>|</span>
        {hasTut?<><span style={{fontSize:10,color:"#8B5CF6",fontWeight:600}}>📖 {st.tutorials[refKey].steps.length} {t.steps}</span><button style={{background:"none",border:"none",fontSize:11,color:"#8B5CF6",cursor:"pointer",fontFamily:F,padding:0}} onClick={()=>openTutEdit(task.de)}>✏️</button><button style={{...delB,fontSize:14}} onClick={()=>delTut(task.de)}>×</button></>:<button style={{background:"none",border:"none",fontSize:11,color:"#8B5CF6",cursor:"pointer",fontFamily:F,padding:0}} onClick={()=>openTutEdit(task.de)}>📖 {t.editTutorial}</button>}
      </div>
    </div>;
  };

  // Tutorial edit modal - inline JSX to prevent focus loss (v4.2 fix)
  const tutEditJSX = editTut ? <div style={ov} onClick={()=>setEditTut(null)}><div style={{...mod,maxWidth:460,padding:0,maxHeight:"90vh",overflow:"auto"}} onClick={e=>e.stopPropagation()}>
    <div style={{padding:"16px 20px 10px",borderBottom:"1px solid #F1F5F9"}}><h3 style={{margin:0,fontSize:16,fontFamily:F,color:"#1E293B"}}>📖 {t.editTutorial}: {editTut}</h3></div>
    <div style={{padding:"12px 20px 20px"}}>
      {tutSteps.map((s,i)=> <div key={`step-${i}`} style={{padding:10,background:"#F8FAFC",borderRadius:10,marginBottom:8,border:"1px solid #E2E8F0"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><span style={{width:22,height:22,borderRadius:"50%",background:"#8B5CF6",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</span><strong style={{flex:1,fontSize:13,color:"#1E293B"}}>{t.step} {i+1}</strong>{tutSteps.length>1&&<button style={delB} onClick={()=>rmTutStep(i)}>×</button>}</div>
        <input style={{...inpS,marginBottom:4}} placeholder={t.stepText} value={s.textDe} onChange={e=>updStep(i,"textDe",e.target.value)}/>
        <input style={{...inpS,marginBottom:4}} placeholder={t.stepTextVi} value={s.textVi} onChange={e=>updStep(i,"textVi",e.target.value)}/>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          {s.photo?<div style={{position:"relative",display:"inline-block"}}><img src={s.photo} style={{height:40,borderRadius:6}} alt="step"/><button style={{position:"absolute",top:-4,right:-4,background:"rgba(0,0,0,.6)",color:"#fff",border:"none",borderRadius:"50%",width:16,height:16,fontSize:10,cursor:"pointer",lineHeight:"16px"}} onClick={()=>updStep(i,"photo",null)}>×</button></div>
          :<label style={{fontSize:11,color:"#3B82F6",cursor:"pointer"}}>📷 {t.stepPhoto}<input type="file" accept="image/*" style={{display:"none"}} onChange={e=>stepPhoto(i,e)}/></label>}
        </div>
      </div>)}
      <button style={{background:"none",border:"1px dashed #8B5CF6",borderRadius:8,padding:"6px 14px",fontSize:12,color:"#8B5CF6",cursor:"pointer",width:"100%",fontFamily:F,marginBottom:10}} onClick={addTutStep}>+ {t.addStep}</button>
      <input style={{...inpS,marginBottom:10}} placeholder={t.videoUrl} value={tutVideo} onChange={e=>setTutVideo(e.target.value)}/>
      <div style={{display:"flex",gap:8}}><button style={{...btnG,flex:1}} onClick={()=>setEditTut(null)}>{t.cancel}</button><button style={{...btnP,flex:1}} onClick={saveTut}>{t.save}</button></div>
    </div>
  </div></div> : null;

  return <div>
    {tutEditJSX}
    <div style={{display:"flex",gap:6,marginBottom:14}}><button style={{...tabB,...(mode==="daily"?tabA:{})}} onClick={()=>setMode("daily")}>☀️ {t.dailyTasks}</button><button style={{...tabB,...(mode==="weekly"?tabA:{})}} onClick={()=>setMode("weekly")}>🔄 {t.weeklyTasks}</button></div>
    {mode==="daily"&&<div>{st.dailyTasks.map((task,i)=><TaskItem key={i} task={task} onDel={()=>dD(i)}/>)}
      <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:12,padding:12,background:"#F8FAFC",borderRadius:10}}><input style={inpS} placeholder={t.taskNameDe} value={nd} onChange={e=>setNd(e.target.value)}/><input style={inpS} placeholder={t.taskNameVi} value={nv} onChange={e=>setNv(e.target.value)}/><div style={{display:"flex",gap:6,alignItems:"center"}}><label style={{fontSize:12,color:"#64748B"}}>⭐</label><input style={{...inpS,width:60}} type="number" min="1" max="10" value={npts} onChange={e=>setNpts(e.target.value)}/><button style={{...btnS,flex:1}} onClick={aD}>+ {t.addTask}</button></div></div></div>}
    {mode==="weekly"&&<div>{st.weeklyAreas.map(area=><div key={area.id} style={{...aCard,borderLeftColor:area.color,marginBottom:10}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><strong style={{flex:1,fontSize:14,color:"#1E293B"}}>{t[area.id]}</strong></div>
      {area.tasks.map((task,ti)=><TaskItem key={ti} task={task} onDel={()=>dW(area.id,ti)}/>)}
    </div>)}
    <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:8,padding:12,background:"#F8FAFC",borderRadius:10}}><select style={inpS} value={aid} onChange={e=>setAid(e.target.value)}>{st.weeklyAreas.map(a=><option key={a.id} value={a.id}>{t[a.id]}</option>)}</select><input style={inpS} placeholder={t.taskNameDe} value={nd} onChange={e=>setNd(e.target.value)}/><input style={inpS} placeholder={t.taskNameVi} value={nv} onChange={e=>setNv(e.target.value)}/><div style={{display:"flex",gap:6,alignItems:"center"}}><label style={{fontSize:12,color:"#64748B"}}>⭐</label><input style={{...inpS,width:60}} type="number" min="1" max="10" value={npts} onChange={e=>setNpts(e.target.value)}/><button style={{...btnS,flex:1}} onClick={aW}>+ {t.addTask}</button></div></div></div>}
  </div>;
}

function RoleMgr({t,st,sv,rpin,show}){
  const RI={owner:"👑",manager:"🔧",resident:"👤"};
  const ch=async(uid,nr)=>{const ok=await rpin();if(!ok)return;sv({...st,users:st.users.map(u=>u.id===uid?{...u,role:nr}:u)});show("✓");};
  return <div>{st.users.map(u=><div key={u.id} style={{display:"flex",alignItems:"center",gap:8,padding:12,marginBottom:6,background:"#fff",borderRadius:10,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}><span style={{fontSize:16}}>{RI[u.role]}</span><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:"#1E293B"}}>{u.name}</div><div style={{fontSize:11,color:"#94A3B8"}}>{u.room}</div></div>{u.role==="owner"?<span style={{fontSize:12,color:"#8B5CF6",fontWeight:600}}>{t.owner}</span>:<select style={{...inpS,width:"auto",fontSize:12}} value={u.role} onChange={e=>ch(u.id,e.target.value)}><option value="manager">🔧 {t.manager}</option><option value="resident">👤 {t.resident}</option></select>}</div>)}</div>;
}

function AccountMgr({t,st,sv,rpin,show}){
  const[showPin,setShowPin]=useState({});
  const[editId,setEditId]=useState(null);
  const[editNameId,setEditNameId]=useState(null);
  const[addMode,setAddMode]=useState(false);
  const[nn,setNn]=useState("");const[nRoom,setNRoom]=useState("");const[nRole,setNRole]=useState("resident");
  const lang=st.lang||"de";
  const RI={owner:"👑",manager:"🔧",resident:"👤"};
  const RC={owner:C.purple,manager:C.orange,resident:C.accent};

  const changeRoom=(uid,roomId)=>{
    const room=st.rooms.find(r=>r.id===roomId);
    if(!room)return;
    const user=st.users.find(u=>u.id===uid);
    // Remove from old room residents
    let rooms=st.rooms.map(r=>({...r,residents:(r.residents||[]).filter(re=>re.name!==user.name)}));
    // Add to new room residents
    rooms=rooms.map(r=>r.id===roomId?{...r,residents:[...(r.residents||[]),{name:user.name,password:user.password}]}:r);
    sv({...st,rooms,users:st.users.map(u=>u.id===uid?{...u,room:room.name,roomId}:u)});
    show("✓");
  };
  const changeRole=async(uid,role)=>{const ok=await rpin();if(!ok)return;sv({...st,users:st.users.map(u=>u.id===uid?{...u,role}:u)});show("✓");};
  const changeName=(uid,newName)=>{
    if(!newName.trim())return;
    const oldUser=st.users.find(u=>u.id===uid);
    sv({...st,
      users:st.users.map(u=>u.id===uid?{...u,name:newName.trim()}:u),
      rooms:st.rooms.map(r=>({...r,residents:(r.residents||[]).map(re=>re.name===oldUser.name?{...re,name:newName.trim()}:re)})),
      completions:(st.completions||[]).map(c=>c.person===oldUser.name?{...c,person:newName.trim()}:c)
    });
    setEditNameId(null);show("✓");
  };
  const changePin=(uid,pin)=>{
    if(pin&&st.users.some(u=>u.id!==uid&&u.password===pin)){show(lang==="de"?"⚠️ PIN bereits vergeben!":"⚠️ PIN đã được sử dụng!","error");return;}
    sv({...st,users:st.users.map(u=>u.id===uid?{...u,password:pin}:u),rooms:st.rooms.map(r=>({...r,residents:(r.residents||[]).map(re=>{const match=st.users.find(u=>u.id===uid);return re.name===match?.name?{...re,password:pin}:re;})}))});
    setEditId(null);show("✓");
  };
  const newPin=(uid)=>{const pin=genPin(st.users);changePin(uid,pin);};
  const delUser=async(uid)=>{const ok=await rpin();if(!ok)return;const u=st.users.find(x=>x.id===uid);sv({...st,users:st.users.filter(x=>x.id!==uid),rooms:st.rooms.map(r=>({...r,residents:(r.residents||[]).filter(re=>re.name!==u.name)}))});show("✓");};
  const addUser=()=>{
    if(!nn.trim())return;
    const pin=genPin(st.users);
    const room=st.rooms.find(r=>r.id===nRoom);
    const u={id:Date.now().toString(),name:nn.trim(),password:pin,role:nRole,room:room?.name||"—",roomId:nRoom||""};
    let rooms=st.rooms;
    if(nRoom&&room){rooms=rooms.map(r=>r.id===nRoom?{...r,residents:[...(r.residents||[]),{name:nn.trim(),password:pin}]}:r);}
    sv({...st,users:[...st.users,u],rooms});
    setNn("");setNRoom("");setNRole("resident");setAddMode(false);
    show(lang==="de"?`✓ Erstellt — PIN: ${pin}`:`✓ Đã tạo — PIN: ${pin}`);
  };

  return <div>
    {st.users.map(u=><div key={u.id} style={{background:"#fff",borderRadius:14,padding:14,marginBottom:8,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
        <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${RC[u.role]},${RC[u.role]}88)`,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:15,fontFamily:F}}>{u.name[0].toUpperCase()}</div>
        <div style={{flex:1}}>
          {editNameId===u.id
            ?<div style={{display:"flex",gap:4,alignItems:"center"}}>
              <input style={{...inpS,fontSize:13,fontWeight:600,flex:1}} defaultValue={u.name} autoFocus onKeyDown={e=>{if(e.key==="Enter")changeName(u.id,e.target.value);if(e.key==="Escape")setEditNameId(null);}}/>
              <button style={{background:"none",border:"none",fontSize:12,color:C.green,cursor:"pointer"}} onClick={e=>{const inp=e.target.closest("div").querySelector("input");changeName(u.id,inp.value);}}>✓</button>
              <button style={{background:"none",border:"none",fontSize:12,color:C.textSecondary,cursor:"pointer"}} onClick={()=>setEditNameId(null)}>✕</button>
            </div>
            :<div style={{fontSize:14,fontWeight:700,color:"#1E293B",cursor:"pointer"}} onClick={()=>setEditNameId(u.id)}>{u.name} <span style={{fontSize:10,color:C.textSecondary}}>✏️</span></div>
          }
        </div>
        {u.role!=="owner"&&<button style={{...delB,fontSize:18}} onClick={()=>delUser(u.id)}>×</button>}
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
        {/* Role */}
        {u.role==="owner"?<span style={{fontSize:11,fontWeight:700,color:C.purple,background:"rgba(139,92,246,0.08)",padding:"4px 10px",borderRadius:8}}>👑 {t.owner}</span>
        :<select style={{...inpS,width:"auto",fontSize:11,padding:"4px 8px"}} value={u.role} onChange={e=>changeRole(u.id,e.target.value)}><option value="manager">🔧 {t.manager}</option><option value="resident">👤 {t.resident}</option></select>}
        {/* Room */}
        <select style={{...inpS,width:"auto",fontSize:11,padding:"4px 8px"}} value={u.roomId||""} onChange={e=>changeRoom(u.id,e.target.value)}>
          <option value="">— {lang==="de"?"Kein Zimmer":"Chưa có phòng"}</option>
          {st.rooms.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        {/* PIN */}
        <div style={{display:"flex",alignItems:"center",gap:4,marginLeft:"auto"}}>
          {editId===u.id?<div style={{display:"flex",gap:4,alignItems:"center"}}>
            <input style={{...inpS,width:70,fontSize:12,textAlign:"center",letterSpacing:4}} maxLength={4} defaultValue={u.password} onKeyDown={e=>{if(e.key==="Enter")changePin(u.id,e.target.value);}}/>
            <button style={{background:"none",border:"none",fontSize:12,color:C.green,cursor:"pointer"}} onClick={e=>{const inp=e.target.closest("div").querySelector("input");changePin(u.id,inp.value);}}>✓</button>
            <button style={{background:"none",border:"none",fontSize:12,color:C.textSecondary,cursor:"pointer"}} onClick={()=>setEditId(null)}>✕</button>
          </div>
          :<>
            <span style={{fontSize:12,fontFamily:"monospace",color:u.password?"#1E293B":C.red,fontWeight:600,background:"rgba(0,0,0,0.03)",padding:"3px 8px",borderRadius:6,letterSpacing:2}}>
              {u.password?(showPin[u.id]?u.password:"••••"):(lang==="de"?"Kein PIN":"Chưa có")}
            </span>
            {u.password&&<button style={{background:"none",border:"none",fontSize:12,cursor:"pointer",color:C.textSecondary,padding:0}} onClick={()=>setShowPin(p=>({...p,[u.id]:!p[u.id]}))}>{showPin[u.id]?"🙈":"👁"}</button>}
            <button style={{background:"none",border:"none",fontSize:11,cursor:"pointer",color:C.accent,padding:0,fontFamily:F}} onClick={()=>setEditId(u.id)}>✏️</button>
            <button style={{background:"none",border:"none",fontSize:11,cursor:"pointer",color:C.orange,padding:0,fontFamily:F}} onClick={()=>newPin(u.id)}>🎲</button>
          </>}
        </div>
      </div>
    </div>)}

    {/* Add user */}
    {addMode?<div style={{background:"#fff",borderRadius:14,padding:14,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
      <h4 style={{margin:"0 0 10px",fontSize:13,fontFamily:F,color:"#1E293B"}}>+ {lang==="de"?"Neuer Benutzer":"Thêm tài khoản"}</h4>
      <input style={{...inpS,marginBottom:6}} placeholder={lang==="de"?"Name":"Tên"} value={nn} onChange={e=>setNn(e.target.value)}/>
      <div style={{display:"flex",gap:6,marginBottom:6}}>
        <select style={{...inpS,flex:1}} value={nRoom} onChange={e=>setNRoom(e.target.value)}>
          <option value="">— {lang==="de"?"Zimmer wählen":"Chọn phòng"}</option>
          {st.rooms.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <select style={{...inpS,flex:1}} value={nRole} onChange={e=>setNRole(e.target.value)}>
          <option value="resident">👤 {t.resident}</option>
          <option value="manager">🔧 {t.manager}</option>
        </select>
      </div>
      <div style={{display:"flex",gap:6}}>
        <button style={{...btnS,flex:1}} onClick={addUser}>+ {t.save}</button>
        <button style={{...btnG,flex:1,padding:"6px 12px",fontSize:13}} onClick={()=>setAddMode(false)}>{t.cancel}</button>
      </div>
    </div>
    :<button style={{background:"none",border:"1px dashed #CBD5E1",borderRadius:12,padding:"10px 14px",fontSize:13,color:C.accent,cursor:"pointer",width:"100%",fontFamily:F,fontWeight:600}} onClick={()=>setAddMode(true)}>+ {lang==="de"?"Neuer Benutzer":"Thêm tài khoản"}</button>}
  </div>;
}

function PermEdit({t,st,sv,rpin,show}){
  const[er,setEr]=useState("manager");
  const tog=async perm=>{if(er==="owner")return;if(CRIT_PERMS.includes(perm)){const ok=await rpin();if(!ok)return;}const cur=st.rolePerms[er]||[];sv({...st,rolePerms:{...st.rolePerms,[er]:cur.includes(perm)?cur.filter(p=>p!==perm):[...cur,perm]}});show("✓");};
  const perms=st.rolePerms[er]||[];
  return <div>
    <div style={{display:"flex",gap:6,marginBottom:16}}>{["manager","resident"].map(r=><button key={r} style={{...tabB,...(er===r?tabA:{})}} onClick={()=>setEr(r)}>{r==="manager"?"🔧":"👤"} {t[r]}</button>)}</div>
    <div style={{background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
      {ALL_PERMS.map((perm,i)=>{const on=perms.includes(perm);return <div key={perm} style={{display:"flex",alignItems:"center",padding:"10px 14px",borderBottom:i<ALL_PERMS.length-1?"1px solid #F1F5F9":"none",gap:10}}>
        <button style={{width:38,height:22,borderRadius:11,border:"none",background:on?"#3B82F6":"#E2E8F0",cursor:"pointer",position:"relative",flexShrink:0}} onClick={()=>tog(perm)}><div style={{width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:on?19:3,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.15)"}}/></button>
        <div style={{flex:1,fontSize:13,color:"#1E293B",fontWeight:500}}>{CRIT_PERMS.includes(perm)&&"🔐 "}{t[`perm_${perm}`]}</div>
      </div>;})}
    </div>
  </div>;
}

function BonusCfg({t,st,sv,rpin,show}){
  const[rate,setRate]=useState(st.penaltyRate||5);const[rew,setRew]=useState(st.rewardText||t.defaultReward);
  const[maxDiff,setMaxDiff]=useState(st.maxDiffPercent||30);
  const[ppPen,setPpPen]=useState(st.penaltyPerMissingPoint||2);
  const[catchUp,setCatchUp]=useState(st.catchUpEnabled!==false);
  const go=async()=>{const ok=await rpin();if(!ok)return;sv({...st,penaltyRate:Number(rate),rewardText:rew,maxDiffPercent:Number(maxDiff),penaltyPerMissingPoint:Number(ppPen),catchUpEnabled:catchUp});show("✓");};
  return <div>
    <div style={{background:"#fff",borderRadius:12,padding:16,marginBottom:12,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
      <h4 style={{margin:"0 0 12px",fontSize:14,fontWeight:700,color:"#1E293B",fontFamily:F}}>🏆 {t.rewardText}</h4>
      <div style={{marginBottom:14}}><label style={lbl}>💰 {t.penaltyPerTask}</label><input style={inp} type="number" min="0" step="0.5" value={rate} onChange={e=>setRate(e.target.value)}/></div>
      <div style={{marginBottom:14}}><label style={lbl}>🎁 {t.rewardText}</label><input style={inp} value={rew} onChange={e=>setRew(e.target.value)}/></div>
    </div>
    <div style={{background:"#fff",borderRadius:12,padding:16,marginBottom:12,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
      <h4 style={{margin:"0 0 4px",fontSize:14,fontWeight:700,color:"#1E293B",fontFamily:F}}>👥 {t.fairness}</h4>
      <p style={{margin:"0 0 12px",fontSize:12,color:"#64748B"}}>{t.minPointsAuto}: {st.lang==="de"?"Zimmerpunkte ÷ Bewohner = Soll pro Person":"Điểm phòng ÷ Cư dân = Soll mỗi người"}</p>
      <div style={{marginBottom:14}}>
        <label style={lbl}>📊 {t.maxDiff} (%)</label>
        <input style={inp} type="number" min="0" max="100" value={maxDiff} onChange={e=>setMaxDiff(e.target.value)}/>
        <p style={{margin:"4px 0 0",fontSize:11,color:"#94A3B8"}}>{st.lang==="de"?"Erlaubter Unterschied zwischen Mitbewohnern im gleichen Zimmer":"Chênh lệch cho phép giữa các bạn cùng phòng"}</p>
      </div>
      <div style={{marginBottom:14}}>
        <label style={lbl}>💸 {t.penaltyPerPoint}</label>
        <input style={inp} type="number" min="0" step="0.5" value={ppPen} onChange={e=>setPpPen(e.target.value)}/>
        <p style={{margin:"4px 0 0",fontSize:11,color:"#94A3B8"}}>{st.lang==="de"?"Strafe pro fehlendem Punkt unter Mindestpunktzahl":"Phạt mỗi điểm thiếu dưới mức tối thiểu"}</p>
      </div>
      <div style={{marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
        <button style={{width:38,height:22,borderRadius:11,border:"none",background:catchUp?"#3B82F6":"#E2E8F0",cursor:"pointer",position:"relative",flexShrink:0}} onClick={()=>setCatchUp(!catchUp)}>
          <div style={{width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:catchUp?19:3,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.15)"}}/>
        </button>
        <div><div style={{fontSize:13,fontWeight:600,color:"#1E293B"}}>📋 {t.makeupTasks}</div><div style={{fontSize:11,color:"#94A3B8"}}>{t.makeupInfo}</div></div>
      </div>
    </div>
    <button style={{...btnP,width:"100%"}} onClick={go}>{t.save}</button>
  </div>;
}

function PinChg({t,st,sv,rpin,show}){
  const[np,setNp]=useState("");
  const go=async()=>{if(np.length<4)return;const ok=await rpin();if(!ok)return;sv({...st,masterPin:np});setNp("");show(st.lang==="de"?"PIN geändert!":"Đã đổi PIN!");};
  return <div style={{background:"#fff",borderRadius:12,padding:16,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
    <label style={lbl}>🔐 {t.changePin}</label>
    <p style={{fontSize:12,color:"#94A3B8",margin:"0 0 12px"}}>{st.lang==="de"?`Aktuelle PIN: ${"•".repeat(st.masterPin.length)} (${st.masterPin.length} Zeichen)`:`PIN hiện tại: ${"•".repeat(st.masterPin.length)} (${st.masterPin.length} ký tự)`}</p>
    <input style={inp} type="password" placeholder={t.newPin} value={np} onChange={e=>setNp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}/>
    <button style={{...btnP,marginTop:12,width:"100%"}} onClick={go}>{t.save}</button>
  </div>;
}

function SheetsCfg({t,st,sv,rpin}){
  const[url,setUrl]=useState(st.sheetsUrl||"");
  const go=async()=>{const ok=await rpin();if(!ok)return;sv({...st,sheetsUrl:url});};
  return <div>
    <div style={{background:"#fff",borderRadius:12,padding:16,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
      <label style={lbl}>📊 {t.sheetsUrl}</label><input style={inp} placeholder={t.sheetsHelp} value={url} onChange={e=>setUrl(e.target.value)}/>
      <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8}}><div style={{width:8,height:8,borderRadius:"50%",background:st.sheetsUrl?"#10B981":"#EF4444"}}/><span style={{fontSize:12,color:"#64748B"}}>{st.sheetsUrl?t.sheetsConn:t.sheetsNo}</span></div>
      <button style={{...btnP,marginTop:12}} onClick={go}>{t.save}</button>
    </div>
    <div style={{background:"#F8FAFC",borderRadius:10,padding:14,marginTop:14}}>
      <p style={{fontSize:13,fontWeight:600,color:"#475569",margin:"0 0 8px"}}>Google Apps Script:</p>
      <code style={{display:"block",background:"#1E293B",color:"#A5F3FC",padding:12,borderRadius:8,fontSize:11,lineHeight:1.5,whiteSpace:"pre-wrap",fontFamily:"'Fira Code',monospace"}}>{`function doPost(e) {\n  var sheet = SpreadsheetApp\n    .getActiveSpreadsheet()\n    .getActiveSheet();\n  var data = JSON.parse(\n    e.postData.contents);\n  sheet.appendRow([\n    data.date, data.time, data.week,\n    data.person, data.room,\n    data.area, data.task, data.points\n  ]);\n  return ContentService\n    .createTextOutput("OK");\n}`}</code>
    </div>
  </div>;
}

export default function AdminScreen({t,st,sv,hp,rpin,show,user,srp}){
  const[tab,setTab]=useState("rooms");
  const tabs=[{id:"accounts",l:`👥 ${st.lang==="de"?"Konten":"Tài khoản"}`,s:user?.role==="owner"},{id:"rooms",l:`🚪 ${t.rooms}`,s:hp("manage_rooms")||hp("manage_residents")},{id:"tasks",l:`✏️ ${t.customTasks}`,s:hp("edit_tasks")},{id:"roles",l:`👥 ${t.roleManagement}`,s:hp("manage_roles")},{id:"perms",l:`🔒 ${t.permissions}`,s:hp("manage_roles")},{id:"bonus",l:`⭐ ${t.bonus}`,s:hp("manage_rooms")},{id:"sheets",l:"📊 Sheets",s:hp("config_sheets")},{id:"pin",l:"🔐 PIN",s:hp("manage_roles")},{id:"announce",l:"📢 "+({de:"Thông báo",vi:"Thông báo"}[st.lang]||"Ankündigungen"),s:user?.role==="owner"}];
  return <div>
    <h2 style={{fontSize:20,color:"#1E293B",margin:"0 0 14px",fontFamily:F}}>⚙️ {t.admin}</h2>
    <div style={{display:"flex",gap:4,marginBottom:16,flexWrap:"wrap"}}>{tabs.filter(x=>x.s).map(x=><button key={x.id} style={{...tabB,...(tab===x.id?tabA:{})}} onClick={()=>setTab(x.id)}>{x.l}</button>)}</div>
    {tab==="accounts"&&<AccountMgr t={t} st={st} sv={sv} rpin={rpin} show={show}/>}
    {tab==="rooms"&&<RoomMgr t={t} st={st} sv={sv} hp={hp} rpin={rpin} show={show}/>}
    {tab==="tasks"&&<TaskMgr t={t} st={st} sv={sv} show={show} srp={srp}/>}
    {tab==="roles"&&<RoleMgr t={t} st={st} sv={sv} rpin={rpin} show={show}/>}
    {tab==="perms"&&<PermEdit t={t} st={st} sv={sv} rpin={rpin} show={show}/>}
    {tab==="bonus"&&<BonusCfg t={t} st={st} sv={sv} rpin={rpin} show={show}/>}
    {tab==="sheets"&&<SheetsCfg t={t} st={st} sv={sv} rpin={rpin}/>}
    {tab==="pin"&&<PinChg t={t} st={st} sv={sv} rpin={rpin} show={show}/>}
    {tab==="announce"&&<AnnouncementAdmin t={t} st={st} sv={sv} user={user} show={show}/>}
  </div>;
}
