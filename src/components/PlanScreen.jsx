import { useState } from "react";
import { gwk, grot, ft, getTimeLeft } from "../utils/helpers";
import { F, C, inpS, dBdg, aCard } from "../styles";
import PhotoCapture from "./PhotoCapture";

export default function PlanScreen({t,st,user,hp,doDone,doUndo,isC,ph,vp,openTut,doVerify,doReject,getVerif}){
  const[tp,setTP]=useState({});const[err,setErr]=useState("");const[showRef,setShowRef]=useState({});
  const[rejectKey,setRejectKey]=useState(null);const[rejectReason,setRejectReason]=useState("");
  const lang=st.lang,wk=gwk(new Date()),rot=grot(wk,st.rooms,st.weeklyAreas);
  const day=new Date().toLocaleDateString(lang==="de"?"de-DE":"vi-VN",{weekday:"long"});

  const normTaskKey = (taskDe) => {
    if(!taskDe || typeof taskDe !== "string") return null;
    const s = taskDe.trim();
    if(!s) return null;
    return `task-${s}`;
  };

  const normRefKey = (taskDe) => {
    if(!taskDe || typeof taskDe !== "string") return null;
    const s = taskDe.trim();
    if(!s) return null;
    const exact = normTaskKey(taskDe);
    if(st.refPhotos?.[exact]) return exact;
    const normalized = `task-${s.toLowerCase()}`;
    if(st.refPhotos?.[normalized]) return normalized;
    const fallback = Object.keys(st.refPhotos||{}).find(k=>k.toLowerCase()===exact.toLowerCase()||k.toLowerCase()===normalized.toLowerCase());
    return fallback || exact;
  };

  const canC=ai=>{if(hp("check_all"))return true;if(!hp("check_own_area"))return false;return user.roomId===rot[ai];};
  let tot=0,dn=0;st.weeklyAreas.forEach(a=>a.tasks.forEach(ta=>{tot++;if(isC(ta.de,a.id,wk))dn++;}));
  const pct=tot>0?Math.round(dn/tot*100):0;
  const doT=(tk,ai)=>{const k=`${ai}-${tk}`;if(!tp[k]){setErr(k);return;}doDone(tk,ai,tp[k]);setTP(p=>{const n={...p};delete n[k];return n;});setErr("");};
  const togRef=k=>setShowRef(p=>({...p,[k]:!p[k]}));

  const TR=({task,areaId,area})=>{
    const isDaily=areaId==="daily";
    const comp=isDaily?(user.role==="owner"?isC(task.de,areaId,wk):st.completions.find(c=>c.taskKey===task.de&&c.areaId==="daily"&&c.week===wk&&c.person===user.name)):isC(task.de,areaId,wk),k=`${areaId}-${task.de}`,pk=`${wk}-${areaId}-${task.de}`,ok=areaId==="daily"||canC(areaId);
    const refKey=normRefKey(task.de);
    const hasRef=!!st.refPhotos?.[refKey];
    const tutKey=normTaskKey(task.de)||`task-${task.de}`;
    const hasTut=st.tutorials?.[tutKey]?.steps?.length>0;
    const refOpen=!!showRef[k];
    const tutOpen=!!showRef[`tut-${k}`];
    const cb={width:24,height:24,borderRadius:8,border:`2px solid rgba(0,0,0,0.15)`,background:C.surfaceElevated,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#fff",cursor:"pointer",flexShrink:0,fontFamily:F,marginTop:2,transition:"all 0.15s ease"};
    const cbD={background:C.accent,borderColor:C.accent};
    return <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"12px",borderRadius:14,marginBottom:4,background:comp?(area?.bg||"rgba(52,199,89,0.06)"):"transparent",transition:"background 0.2s",animation:"fadeUp 0.25s ease"}}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {comp?<span style={{...cb,...cbD,...(area?{background:area.color,borderColor:area.color}:{})}} onClick={()=>doUndo(task.de,areaId,wk)}>✓</span>
          :ok?<span style={cb} onClick={()=>doT(task.de,areaId)}/>
          :<span style={{...cb,opacity:.3,cursor:"not-allowed"}}/>}
          <div style={{flex:1}}>
            <div style={{fontSize:14,color:C.text,textDecoration:comp?"line-through":"none",fontWeight:500,letterSpacing:"-0.01em",display:"flex",alignItems:"center",gap:6}}>{lang==="de"?task.de:task.vi}{hasRef&&<span style={{fontSize:13}} title={t.refPhoto}>📷</span>}</div>
            <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
              <span style={{fontSize:12,color:C.textSecondary}}>{lang==="de"?task.vi:task.de}</span>
              {hasRef&&<button style={{background:"none",border:"none",padding:0,fontSize:11,color:C.accent,cursor:"pointer",fontFamily:F,fontWeight:600}} onClick={()=>togRef(k)}>{refOpen?t.hideRef:t.showRef}</button>}
              {hasTut&&<button style={{background:"none",border:"none",padding:0,fontSize:11,color:C.purple,cursor:"pointer",fontFamily:F,fontWeight:600}} onClick={()=>togRef(`tut-${k}`)}>{tutOpen?"✕":t.tutorialShort}</button>}
            </div>
          </div>
        </div>
        {refOpen&&hasRef&&<div style={{marginLeft:32,marginTop:6,padding:6,background:"rgba(0,0,0,0.02)",borderRadius:12,border:`1px solid ${C.border}`}}>
          <img src={st.refPhotos[refKey]} style={{width:"100%",maxHeight:150,objectFit:"cover",borderRadius:10}} alt="ref"/>
          <div style={{fontSize:10,color:C.textSecondary,marginTop:2,textAlign:"center"}}>{t.refPhoto}: {lang==="de"?task.de:task.vi}</div>
        </div>}
        {tutOpen&&hasTut&&<div style={{marginLeft:32,marginTop:6,padding:8,background:"rgba(175,82,222,0.04)",borderRadius:12,border:"1px solid rgba(175,82,222,0.12)"}}>
          {st.tutorials[tutKey].steps.slice(0,2).map((s,i)=><div key={i} style={{display:"flex",gap:6,marginBottom:6}}>
            <span style={{width:18,height:18,borderRadius:6,background:C.purple,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0}}>{i+1}</span>
            <div style={{fontSize:12,color:"#5B2C8A"}}>{lang==="de"?s.textDe:s.textVi}</div>
          </div>)}
          {st.tutorials[tutKey].steps.length>2&&<div style={{fontSize:11,color:C.purple,marginBottom:4}}>+{st.tutorials[tutKey].steps.length-2} {t.steps}...</div>}
          <button style={{background:C.purple,color:"#fff",border:"none",borderRadius:10,padding:"6px 14px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:F,width:"100%"}} onClick={()=>openTut({...st.tutorials[tutKey],taskDe:task.de,taskVi:task.vi})}>{t.openTutorial}</button>
        </div>}
        {comp&&<div style={{marginTop:4,marginLeft:32}}>
          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            <span style={dBdg}>{comp.person} · {ft(comp.timestamp)} · +{comp.pts}⭐</span>
            {ph[pk]&&<button style={{...dBdg,cursor:"pointer",background:"rgba(0,113,227,0.08)",color:C.accent}} onClick={()=>vp(ph[pk])}>📷</button>}
            {(()=>{const v=getVerif(task.de,areaId,wk);
              if(v?.status==="verified")return <span style={{...dBdg,background:"rgba(52,199,89,0.08)",color:C.green}}>✓ {t.verified} ({v.by})</span>;
              if(v?.status==="rejected")return <span style={{...dBdg,background:"rgba(255,59,48,0.08)",color:C.red}}>✗ {t.rejected}: {v.reason}</span>;
              if((isDaily?user.role==="owner":(user.role==="owner"||user.role==="manager"))&&comp.person!==user.name)return <div style={{display:"flex",gap:4,marginTop:4}}>
                <button style={{padding:"4px 10px",background:C.green,color:"#fff",border:"none",borderRadius:8,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:F}} onClick={()=>doVerify(task.de,areaId,wk,user.name)}>{t.verify}</button>
                <button style={{padding:"4px 10px",background:C.red,color:"#fff",border:"none",borderRadius:8,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:F}} onClick={()=>{setRejectKey(`${wk}-${areaId}-${task.de}`);setRejectReason("")}}>{t.reject}</button>
              </div>;
              return null;
            })()}
          </div>
          {rejectKey===`${wk}-${areaId}-${task.de}`&&<div style={{display:"flex",gap:4,marginTop:4}}>
            <input style={{...inpS,flex:1,fontSize:11}} placeholder={t.rejectReason} value={rejectReason} autoFocus onChange={e=>setRejectReason(e.target.value)} onKeyDown={e=>e.key==="Enter"&&rejectReason.trim()&&(doReject(task.de,areaId,wk,user.name,rejectReason),setRejectKey(null))}/>
            <button style={{padding:"4px 8px",background:C.red,color:"#fff",border:"none",borderRadius:8,fontSize:11,cursor:"pointer",fontFamily:F}} onClick={()=>{if(rejectReason.trim()){doReject(task.de,areaId,wk,user.name,rejectReason);setRejectKey(null)}}}>✗</button>
            <button style={{padding:"4px 8px",background:"rgba(0,0,0,0.04)",color:C.textSecondary,border:"none",borderRadius:8,fontSize:11,cursor:"pointer",fontFamily:F}} onClick={()=>setRejectKey(null)}>×</button>
          </div>}
        </div>}
        {!comp&&ok&&<><PhotoCapture t={t} photo={tp[k]} onCap={d=>setTP(p=>({...p,[k]:d}))}/>{err===k&&!tp[k]&&<p style={{color:C.red,fontSize:12,margin:"4px 0 0 32px"}}>{t.noPhoto}</p>}</>}
      </div>
      <div style={{fontSize:12,fontWeight:700,color:area?.color||C.accent,background:area?.bg||"rgba(0,113,227,0.06)",padding:"3px 10px",borderRadius:8,flexShrink:0,alignSelf:"flex-start"}}>+{task.pts}⭐</div>
    </div>;
  };

  const tl=getTimeLeft(wk);

  return <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(255,255,255,0.72)",backdropFilter:"blur(20px) saturate(180%)",WebkitBackdropFilter:"blur(20px) saturate(180%)",borderRadius:18,padding:16,marginBottom:14,boxShadow:C.shadowSm,border:`1px solid ${C.border}`}}>
      <div>
        <h2 style={{margin:0,fontSize:20,color:C.text,fontFamily:F,fontWeight:700,letterSpacing:"-0.022em"}}>{t.plan}</h2>
        <p style={{margin:"4px 0 0",fontSize:13,color:C.textSecondary}}>{t.kwNum} {wk} · {day}</p>
        <div style={{display:"flex",alignItems:"center",gap:6,marginTop:6}}>
          <span style={{fontSize:11,color:tl.overdue?C.red:C.textSecondary}}>⏰ {t.deadline}: {t.deadlineDay}</span>
          {tl.overdue?<span style={{fontSize:11,fontWeight:700,color:C.red,background:"rgba(255,59,48,0.08)",padding:"2px 8px",borderRadius:6}}>⚠️ {t.overdue}</span>
          :<span style={{fontSize:11,fontWeight:600,color:tl.hours<24?C.orange:C.green,background:tl.hours<24?"rgba(255,149,0,0.08)":"rgba(52,199,89,0.08)",padding:"2px 8px",borderRadius:6}}>{t.timeLeft} {tl.text}</span>}
        </div>
      </div>
      <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="52" height="52" viewBox="0 0 52 52"><circle cx="26" cy="26" r="22" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="4"/><circle cx="26" cy="26" r="22" fill="none" stroke={C.accent} strokeWidth="4" strokeDasharray={`${pct*1.382} 138.2`} strokeLinecap="round" transform="rotate(-90 26 26)" style={{transition:"stroke-dasharray 0.5s ease"}}/></svg><span style={{position:"absolute",fontSize:12,fontWeight:700,color:C.accent,fontFamily:F}}>{pct}%</span></div>
    </div>
    <div style={{marginBottom:18}}><div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:8}}><h3 style={{fontSize:15,fontWeight:700,color:C.text,margin:0,fontFamily:F,letterSpacing:"-0.022em"}}>☀️ {t.daily}</h3><span style={{fontSize:11,color:C.textSecondary}}>{t.dailySub}</span></div>
      {st.dailyTasks.map((task,i)=><TR key={i} task={task} areaId="daily"/>)}</div>
    <div style={{marginBottom:18}}><div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:8}}><h3 style={{fontSize:15,fontWeight:700,color:C.text,margin:0,fontFamily:F,letterSpacing:"-0.022em"}}>🔄 {t.weekly}</h3><span style={{fontSize:11,color:C.textSecondary}}>{t.weeklySub}</span></div>
      {st.weeklyAreas.filter(a=>user.role==="owner"||user.role==="manager"||rot[a.id]===user.roomId).map(area=>{const room=st.rooms.find(r=>r.id===rot[area.id]);const allD=area.tasks.every(ta=>isC(ta.de,area.id,wk));
        return <div key={area.id} style={{...aCard,borderLeftColor:area.color}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><div><strong style={{fontSize:15,color:C.text,letterSpacing:"-0.01em"}}>{t[area.id]}</strong><span style={{display:"inline-block",fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:8,marginLeft:6,background:area.bg,color:area.color}}>{t.responsible}: {room?.name||"—"}</span></div>{allD&&<span style={{fontSize:11,fontWeight:600,color:C.green,background:"rgba(52,199,89,0.08)",padding:"4px 10px",borderRadius:8}}>{t.allDone}</span>}</div>
          {area.tasks.map((task,ti)=><TR key={ti} task={task} areaId={area.id} area={area}/>)}
        </div>;})}</div>
  </div>;
}
