import { useState } from "react";
import { gwk, grot, ft, fd, getToday, getTimeLeft } from "../utils/helpers";
import { F, C, inpS, dBdg, aCard } from "../styles";
import PhotoCapture from "./PhotoCapture";

export default function PlanScreen({t,st,user,hp,doDone,doUndo,isC,isDailyC,ph,vp,openTut,doVerify,doReject,getVerif}){
  const[tp,setTP]=useState({});const[err,setErr]=useState("");const[showRef,setShowRef]=useState({});
  const[rejectKey,setRejectKey]=useState(null);const[rejectReason,setRejectReason]=useState("");
  const lang=st.lang,wk=gwk(new Date()),today=getToday(),rot=grot(wk,st.rooms,st.weeklyAreas);
  const day=new Date().toLocaleDateString(lang==="de"?"de-DE":"vi-VN",{weekday:"long"});

  const normTaskKey = (taskDe) => {
    if(!taskDe || typeof taskDe !== "string") return null;
    const s = taskDe.trim();
    if(!s) return null;
    const sanitized = s.replace(/[.#$\/\[\]]/g, "_");
    return `task-${sanitized}`;
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
  const allTaskDefs=[...st.dailyTasks,...st.weeklyAreas.flatMap(a=>a.tasks)];
  const getTaskPts=(taskDe)=>allTaskDefs.find(x=>x.de===taskDe)?.pts||1;
  let tot=0,dn=0;st.weeklyAreas.forEach(a=>a.tasks.forEach(ta=>{tot++;if(isC(ta.de,a.id,wk))dn++;}));
  const pct=tot>0?Math.round(dn/tot*100):0;
  const doT=(tk,ai)=>{const k=`${ai}-${tk}`;if(!tp[k]){setErr(k);return;}doDone(tk,ai,tp[k]);setTP(p=>{const n={...p};delete n[k];return n;});setErr("");};
  const togRef=k=>setShowRef(p=>({...p,[k]:!p[k]}));

  // ---- All completions for this week ----
  const allCompletions = Array.isArray(st.completions)?st.completions:Object.values(st.completions||{});
  const weekCompletions = allCompletions.filter(c=>c.week==wk);
  const todayDailyCompletions = allCompletions.filter(c=>c.areaId==="daily"&&(c.day===today||((!c.day)&&c.week==wk)));

  // ---- Pending tasks for owner/manager verification ----
  const sanitizeTK = (tk) => tk.replace(/[.#$\/\[\]]/g, "_");
  const allPendingTasks = [...weekCompletions.filter(c=>c.areaId!=="daily"), ...todayDailyCompletions].filter(c=>{
    if(c.person===user?.name) return false;
    if(c.verified) return false;
    const isDaily=c.areaId==="daily";
    const vKey = isDaily?`${c.day||today}-daily-${sanitizeTK(c.taskKey)}`:`${wk}-${c.areaId||"daily"}-${sanitizeTK(c.taskKey)}`;
    const v = (st.verifications||{})[vKey];
    if(v?.status==="verified") return false;
    return true;
  });

  // ---- Verification badge for inline task rows ----
  const verifBadge=(taskDe,areaId,comp)=>{
    if(!comp) return null;
    if(comp.verified) return <span style={{fontSize:10,fontWeight:700,color:C.green,background:"rgba(52,199,89,0.08)",padding:"2px 8px",borderRadius:6}}>✅ {t.verified} ({comp.verifiedBy||"?"})</span>;
    const v = getVerif(taskDe, areaId, comp.day, comp.week);
    if(v?.status==="verified") return <span style={{fontSize:10,fontWeight:700,color:C.green,background:"rgba(52,199,89,0.08)",padding:"2px 8px",borderRadius:6}}>✅ {t.verified} ({v.by})</span>;
    if(v?.status==="rejected") return <span style={{fontSize:10,fontWeight:700,color:C.red,background:"rgba(255,59,48,0.08)",padding:"2px 8px",borderRadius:6}}>❌ {t.rejected}: {v.reason}</span>;
    return <span style={{fontSize:10,fontWeight:600,color:C.orange,background:"rgba(255,149,0,0.08)",padding:"2px 8px",borderRadius:6}}>⏳ {lang==="de"?"Offen":"Chưa xác nhận"}</span>;
  };

  // ---- Task Row component ----
  const TR=({task,areaId,area})=>{
    const isDaily=areaId==="daily";
    // Each person sees ONLY their OWN daily completion
    const comp=isDaily?isDailyC(task.de,user.name):isC(task.de,areaId,wk);
    const dayOrWk=isDaily?today:wk;
    const k=`${areaId}-${task.de}`;
    const pk=comp?(`${dayOrWk}-${areaId}-${task.de}-${comp.person}`):(`${dayOrWk}-${areaId}-${task.de}-${user.name}`);
    const pkOld=`${wk}-${areaId}-${task.de}`;
    const ok=areaId==="daily"||canC(areaId);
    const photoUrl=ph[pk]||ph[pkOld];
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
          {comp?<span style={{...cb,...cbD,...(area?{background:area.color,borderColor:area.color}:{})}} onClick={()=>doUndo(task.de,areaId,dayOrWk)}>✓</span>
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
            <span style={dBdg}>{comp.person} · {ft(comp.timestamp)} · +{comp.pts||getTaskPts(task.de)}⭐</span>
            {photoUrl&&<button style={{...dBdg,cursor:"pointer",background:"rgba(0,113,227,0.08)",color:C.accent}} onClick={()=>vp(photoUrl)}>📷</button>}
            {verifBadge(task.de,areaId,comp)}
            {(user.role==="owner"||user.role==="manager")&&comp.person!==user.name&&!comp.verified&&<div style={{display:"flex",gap:4,marginTop:4}}>
              <button style={{padding:"4px 10px",background:C.green,color:"#fff",border:"none",borderRadius:8,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:F}} onClick={()=>doVerify({tk:task.de,ai:areaId,by:user.name,person:comp.person,compDay:comp.day,compWeek:comp.week})}>{t.verify}</button>
              <button style={{padding:"4px 10px",background:C.red,color:"#fff",border:"none",borderRadius:8,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:F}} onClick={()=>{setRejectKey({id:`${dayOrWk}-${areaId}-${task.de}-${comp.person}`,task:task.de,area:areaId,person:comp.person,compDay:comp.day,compWeek:comp.week});setRejectReason("")}}>{t.reject}</button>
            </div>}
          </div>
          {rejectKey?.id===`${dayOrWk}-${areaId}-${task.de}-${comp?.person||""}`&&<div style={{display:"flex",gap:4,marginTop:4}}>
            <input style={{...inpS,flex:1,fontSize:11}} placeholder={t.rejectReason} value={rejectReason} autoFocus onChange={e=>setRejectReason(e.target.value)} onKeyDown={e=>e.key==="Enter"&&rejectReason.trim()&&(doReject({tk:task.de,ai:areaId,by:user.name,reason:rejectReason,person:comp.person,compDay:comp.day,compWeek:comp.week}),setRejectKey(null))}/>
            <button style={{padding:"4px 8px",background:C.red,color:"#fff",border:"none",borderRadius:8,fontSize:11,cursor:"pointer",fontFamily:F}} onClick={()=>{if(rejectReason.trim()){doReject({tk:task.de,ai:areaId,by:user.name,reason:rejectReason,person:comp.person,compDay:comp.day,compWeek:comp.week});setRejectKey(null)}}}>✗</button>
            <button style={{padding:"4px 8px",background:"rgba(0,0,0,0.04)",color:C.textSecondary,border:"none",borderRadius:8,fontSize:11,cursor:"pointer",fontFamily:F}} onClick={()=>setRejectKey(null)}>×</button>
          </div>}
        </div>}
        {!comp&&ok&&<><PhotoCapture t={t} photo={tp[k]} onCap={d=>setTP(p=>({...p,[k]:d}))}/>{err===k&&!tp[k]&&<p style={{color:C.red,fontSize:12,margin:"4px 0 0 32px"}}>{t.noPhoto}</p>}</>}
      </div>
      <div style={{fontSize:12,fontWeight:700,color:area?.color||C.accent,background:area?.bg||"rgba(0,113,227,0.06)",padding:"3px 10px",borderRadius:8,flexShrink:0,alignSelf:"flex-start"}}>+{task.pts}⭐</div>
    </div>;
  };

  const tl=getTimeLeft(wk);
  const myUndoneTasks = st.dailyTasks.filter(task=>!isDailyC(task.de,user.name));

  return <div>
    {/* ---- Header ---- */}
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

    {/* ---- Daily Tasks: HIDE for owner ---- */}
    {user?.role!=="owner"&&<div style={{marginBottom:18}}>
      <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:8}}>
        <h3 style={{fontSize:15,fontWeight:700,color:C.text,margin:0,fontFamily:F,letterSpacing:"-0.022em"}}>☀️ {t.daily}</h3>
        <span style={{fontSize:11,color:C.textSecondary}}>{t.dailySub}</span>
      </div>
      {myUndoneTasks.length>0&&<div style={{background:"rgba(255,255,255,0.72)",backdropFilter:"blur(20px)",borderRadius:14,padding:4,marginBottom:10,boxShadow:C.shadowSm,border:`1px solid ${C.border}`}}>
        {myUndoneTasks.map((task,i)=><TR key={i} task={task} areaId="daily"/>)}
      </div>}
      {myUndoneTasks.length===0&&<div style={{textAlign:"center",padding:"12px 16px",background:"rgba(52,199,89,0.06)",borderRadius:12,marginBottom:10,fontSize:13,fontWeight:600,color:C.green}}>
        ✅ {lang==="de"?"Alle erledigt!":"Bạn đã làm xong tất cả hôm nay!"}
      </div>}

      {/* ---- Pending verification dashboard (owner/manager) ---- */}
      {(user.role==="owner"||user.role==="manager")&&allPendingTasks.length>0&&<div style={{marginTop:12}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <h3 style={{fontSize:14,fontWeight:700,color:C.orange,margin:0,fontFamily:F}}>🔔 {lang==="de"?"Warten auf Bestätigung":"Chờ xác nhận"}</h3>
          <span style={{fontSize:11,fontWeight:700,color:"#fff",background:C.red,borderRadius:10,padding:"1px 8px",minWidth:18,textAlign:"center"}}>{allPendingTasks.length}</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {allPendingTasks.sort((a,b)=>b.timestamp-a.timestamp).map((c,i)=>{
            const isDaily = c.areaId==="daily";
            const area = !isDaily ? st.weeklyAreas.find(a=>a.id===c.areaId) : null;
            const allTasks = isDaily ? st.dailyTasks : (area?.tasks||[]);
            const task = allTasks.find(ta=>ta.de===c.taskKey);
            const pendDayOrWk = isDaily ? (c.day||today) : wk;
            const pk = `${pendDayOrWk}-${c.areaId}-${c.taskKey}-${c.person}`;
            const pkOld = `${wk}-${c.areaId}-${c.taskKey}-${c.person}`;
            const pkLegacy = `${wk}-${c.areaId}-${c.taskKey}`;
            const cPhoto = ph[pk]||ph[pkOld]||ph[pkLegacy];
            const areaLabel = isDaily ? (lang==="de"?"Täglich":"Hàng ngày") : (t[c.areaId]||c.areaId);
            const areaColor = area?.color || C.accent;
            const refKey = task ? normRefKey(task.de) : null;
            const refPhoto = refKey ? st.refPhotos?.[refKey] : null;
            const timeStr = new Date(c.timestamp).toLocaleString(lang==="de"?"de-DE":"vi-VN",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"});
            const isRejecting = rejectKey?.id===`${pendDayOrWk}-${c.areaId}-${c.taskKey}-${c.person}`;

            return <div key={i} style={{background:"rgba(255,255,255,0.85)",backdropFilter:"blur(20px)",borderRadius:16,padding:14,boxShadow:C.shadowSm,border:`1px solid ${C.border}`,animation:"fadeUp 0.2s ease"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:36,height:36,borderRadius:12,background:`linear-gradient(135deg,${areaColor},${C.purple})`,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:15,fontFamily:F,flexShrink:0,boxShadow:`0 2px 8px ${areaColor}40`}}>{c.person[0].toUpperCase()}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:700,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.person}</div>
                  <div style={{fontSize:12,color:C.textSecondary,marginTop:1}}>{timeStr}</div>
                </div>
                <span style={{fontSize:11,fontWeight:700,color:areaColor,background:`${areaColor}12`,padding:"3px 10px",borderRadius:8}}>{areaLabel}</span>
              </div>
              <div style={{fontSize:13,fontWeight:600,color:C.text,padding:"8px 10px",background:"rgba(0,0,0,0.02)",borderRadius:10,marginBottom:10}}>
                {lang==="de"?c.taskKey:(task?.vi||c.taskKey)}
                {task&&<span style={{fontSize:11,color:C.textSecondary,marginLeft:6}}>({lang==="de"?task.vi:task.de})</span>}
              </div>
              {(cPhoto||refPhoto)&&<div style={{display:"flex",gap:8,marginBottom:10}}>
                {cPhoto&&<div style={{flex:1}}>
                  <div style={{fontSize:10,fontWeight:700,color:C.accent,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.5px"}}>📸 {lang==="de"?"Beweis":"Ảnh chụp"}</div>
                  <img src={cPhoto} style={{width:"100%",height:120,objectFit:"cover",borderRadius:10,cursor:"pointer",border:`2px solid ${C.accent}30`}} alt="proof" onClick={()=>vp(cPhoto)}/>
                </div>}
                {refPhoto&&<div style={{flex:1}}>
                  <div style={{fontSize:10,fontWeight:700,color:C.purple,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.5px"}}>📋 {lang==="de"?"Vorgabe":"Ảnh mẫu"}</div>
                  <img src={refPhoto} style={{width:"100%",height:120,objectFit:"cover",borderRadius:10,cursor:"pointer",border:`2px solid ${C.purple}30`}} alt="ref" onClick={()=>vp(refPhoto)}/>
                </div>}
              </div>}
              {!cPhoto&&<div style={{padding:"8px 10px",background:"rgba(255,149,0,0.06)",borderRadius:10,marginBottom:10,fontSize:12,color:C.orange,fontWeight:600}}>
                ⚠️ {lang==="de"?"Kein Foto eingereicht":"Không có ảnh"}
              </div>}
              {!isRejecting&&<div style={{display:"flex",gap:8}}>
                <button style={{flex:1,padding:"10px 16px",background:`linear-gradient(135deg,${C.green},#2DD4BF)`,color:"#fff",border:"none",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:F,boxShadow:`0 2px 8px ${C.green}40`,transition:"transform .1s"}} onClick={()=>doVerify({tk:c.taskKey,ai:c.areaId,by:user.name,person:c.person,compDay:c.day,compWeek:c.week})}>✓ {lang==="de"?"Bestätigen":"Xác nhận"}</button>
                <button style={{flex:1,padding:"10px 16px",background:"rgba(255,59,48,0.08)",color:C.red,border:`1.5px solid ${C.red}30`,borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:F,transition:"transform .1s"}} onClick={()=>{setRejectKey({id:`${pendDayOrWk}-${c.areaId}-${c.taskKey}-${c.person}`,task:c.taskKey,area:c.areaId,person:c.person,compDay:c.day,compWeek:c.week});setRejectReason("")}}>✗ {lang==="de"?"Ablehnen":"Từ chối"}</button>
              </div>}
              {isRejecting&&<div style={{display:"flex",gap:6,alignItems:"center",background:"rgba(255,59,48,0.04)",padding:8,borderRadius:12,border:`1px solid ${C.red}20`}}>
                <input style={{...inpS,flex:1,fontSize:12,border:`1px solid ${C.red}30`}} placeholder={lang==="de"?"Grund der Ablehnung...":"Lý do từ chối..."} value={rejectReason} autoFocus onChange={e=>setRejectReason(e.target.value)} onKeyDown={e=>{
                  if(e.key==="Enter"&&rejectReason.trim()){
                    doReject({tk:rejectKey.task,ai:rejectKey.area,by:user.name,reason:rejectReason,person:rejectKey.person,compDay:rejectKey.compDay,compWeek:rejectKey.compWeek});
                    setRejectKey(null);
                  }
                }}/>
                <button style={{padding:"8px 14px",background:C.red,color:"#fff",border:"none",borderRadius:10,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:F}} onClick={()=>{
                  if(rejectReason.trim()){
                    doReject({tk:rejectKey.task,ai:rejectKey.area,by:user.name,reason:rejectReason,person:rejectKey.person,compDay:rejectKey.compDay,compWeek:rejectKey.compWeek});
                    setRejectKey(null);
                  }
                }}>✗</button>
                <button style={{padding:"8px 10px",background:"rgba(0,0,0,0.04)",color:C.textSecondary,border:"none",borderRadius:10,fontSize:12,cursor:"pointer",fontFamily:F}} onClick={()=>setRejectKey(null)}>×</button>
              </div>}
            </div>;
          })}
        </div>
      </div>}
    </div>}

    {/* ---- Owner: only show pending verification (no daily tasks) ---- */}
    {user?.role==="owner"&&(user.role==="owner"||user.role==="manager")&&<div style={{marginBottom:18}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
        <h3 style={{fontSize:15,fontWeight:700,color:C.orange,margin:0,fontFamily:F}}>🔔 {lang==="de"?"Warten auf Bestätigung":"Chờ xác nhận"}</h3>
        {allPendingTasks.length>0&&<span style={{fontSize:11,fontWeight:700,color:"#fff",background:C.red,borderRadius:10,padding:"1px 8px",minWidth:18,textAlign:"center"}}>{allPendingTasks.length}</span>}
      </div>
      {allPendingTasks.length===0&&<div style={{textAlign:"center",padding:"20px 16px",background:"rgba(52,199,89,0.06)",borderRadius:12,fontSize:13,fontWeight:600,color:C.green}}>
        ✅ {lang==="de"?"Keine ausstehenden Aufgaben":"Không có nhiệm vụ chờ xác nhận"}
      </div>}
      {allPendingTasks.length>0&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
        {allPendingTasks.sort((a,b)=>b.timestamp-a.timestamp).map((c,i)=>{
          const isDaily = c.areaId==="daily";
          const area = !isDaily ? st.weeklyAreas.find(a=>a.id===c.areaId) : null;
          const allTasks = isDaily ? st.dailyTasks : (area?.tasks||[]);
          const task = allTasks.find(ta=>ta.de===c.taskKey);
          const pendDayOrWk = isDaily ? (c.day||today) : wk;
          const pk = `${pendDayOrWk}-${c.areaId}-${c.taskKey}-${c.person}`;
          const pkOld = `${wk}-${c.areaId}-${c.taskKey}-${c.person}`;
          const pkLegacy = `${wk}-${c.areaId}-${c.taskKey}`;
          const cPhoto = ph[pk]||ph[pkOld]||ph[pkLegacy];
          const areaLabel = isDaily ? (lang==="de"?"Täglich":"Hàng ngày") : (t[c.areaId]||c.areaId);
          const areaColor = area?.color || C.accent;
          const refKey = task ? normRefKey(task.de) : null;
          const refPhoto = refKey ? st.refPhotos?.[refKey] : null;
          const timeStr = new Date(c.timestamp).toLocaleString(lang==="de"?"de-DE":"vi-VN",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"});
          const isRejecting = rejectKey?.id===`${pendDayOrWk}-${c.areaId}-${c.taskKey}-${c.person}`;

          return <div key={i} style={{background:"rgba(255,255,255,0.85)",backdropFilter:"blur(20px)",borderRadius:16,padding:14,boxShadow:C.shadowSm,border:`1px solid ${C.border}`,animation:"fadeUp 0.2s ease"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <div style={{width:36,height:36,borderRadius:12,background:`linear-gradient(135deg,${areaColor},${C.purple})`,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:15,fontFamily:F,flexShrink:0,boxShadow:`0 2px 8px ${areaColor}40`}}>{c.person[0].toUpperCase()}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:700,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.person}</div>
                <div style={{fontSize:12,color:C.textSecondary,marginTop:1}}>{timeStr}</div>
              </div>
              <span style={{fontSize:11,fontWeight:700,color:areaColor,background:`${areaColor}12`,padding:"3px 10px",borderRadius:8}}>{areaLabel}</span>
            </div>
            <div style={{fontSize:13,fontWeight:600,color:C.text,padding:"8px 10px",background:"rgba(0,0,0,0.02)",borderRadius:10,marginBottom:10}}>
              {lang==="de"?c.taskKey:(task?.vi||c.taskKey)}
              {task&&<span style={{fontSize:11,color:C.textSecondary,marginLeft:6}}>({lang==="de"?task.vi:task.de})</span>}
            </div>
            {(cPhoto||refPhoto)&&<div style={{display:"flex",gap:8,marginBottom:10}}>
              {cPhoto&&<div style={{flex:1}}>
                <div style={{fontSize:10,fontWeight:700,color:C.accent,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.5px"}}>📸 {lang==="de"?"Beweis":"Ảnh chụp"}</div>
                <img src={cPhoto} style={{width:"100%",height:120,objectFit:"cover",borderRadius:10,cursor:"pointer",border:`2px solid ${C.accent}30`}} alt="proof" onClick={()=>vp(cPhoto)}/>
              </div>}
              {refPhoto&&<div style={{flex:1}}>
                <div style={{fontSize:10,fontWeight:700,color:C.purple,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.5px"}}>📋 {lang==="de"?"Vorgabe":"Ảnh mẫu"}</div>
                <img src={refPhoto} style={{width:"100%",height:120,objectFit:"cover",borderRadius:10,cursor:"pointer",border:`2px solid ${C.purple}30`}} alt="ref" onClick={()=>vp(refPhoto)}/>
              </div>}
            </div>}
            {!cPhoto&&<div style={{padding:"8px 10px",background:"rgba(255,149,0,0.06)",borderRadius:10,marginBottom:10,fontSize:12,color:C.orange,fontWeight:600}}>
              ⚠️ {lang==="de"?"Kein Foto eingereicht":"Không có ảnh"}
            </div>}
            {!isRejecting&&<div style={{display:"flex",gap:8}}>
              <button style={{flex:1,padding:"10px 16px",background:`linear-gradient(135deg,${C.green},#2DD4BF)`,color:"#fff",border:"none",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:F,boxShadow:`0 2px 8px ${C.green}40`}} onClick={()=>doVerify({tk:c.taskKey,ai:c.areaId,by:user.name,person:c.person,compDay:c.day,compWeek:c.week})}>✓ {lang==="de"?"Bestätigen":"Xác nhận"}</button>
              <button style={{flex:1,padding:"10px 16px",background:"rgba(255,59,48,0.08)",color:C.red,border:`1.5px solid ${C.red}30`,borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:F}} onClick={()=>{setRejectKey({id:`${pendDayOrWk}-${c.areaId}-${c.taskKey}-${c.person}`,task:c.taskKey,area:c.areaId,person:c.person,compDay:c.day,compWeek:c.week});setRejectReason("")}}>✗ {lang==="de"?"Ablehnen":"Từ chối"}</button>
            </div>}
            {isRejecting&&<div style={{display:"flex",gap:6,alignItems:"center",background:"rgba(255,59,48,0.04)",padding:8,borderRadius:12,border:`1px solid ${C.red}20`}}>
              <input style={{...inpS,flex:1,fontSize:12,border:`1px solid ${C.red}30`}} placeholder={lang==="de"?"Grund der Ablehnung...":"Lý do từ chối..."} value={rejectReason} autoFocus onChange={e=>setRejectReason(e.target.value)} onKeyDown={e=>{
                if(e.key==="Enter"&&rejectReason.trim()){
                  doReject({tk:rejectKey.task,ai:rejectKey.area,by:user.name,reason:rejectReason,person:rejectKey.person,compDay:rejectKey.compDay,compWeek:rejectKey.compWeek});
                  setRejectKey(null);
                }
              }}/>
              <button style={{padding:"8px 14px",background:C.red,color:"#fff",border:"none",borderRadius:10,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:F}} onClick={()=>{
                if(rejectReason.trim()){
                  doReject({tk:rejectKey.task,ai:rejectKey.area,by:user.name,reason:rejectReason,person:rejectKey.person,compDay:rejectKey.compDay,compWeek:rejectKey.compWeek});
                  setRejectKey(null);
                }
              }}>✗</button>
              <button style={{padding:"8px 10px",background:"rgba(0,0,0,0.04)",color:C.textSecondary,border:"none",borderRadius:10,fontSize:12,cursor:"pointer",fontFamily:F}} onClick={()=>setRejectKey(null)}>×</button>
            </div>}
          </div>;
        })}
      </div>}
    </div>}

    {/* ---- Weekly Areas: show for ALL roles ---- */}
    <div style={{marginBottom:18}}><div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:8}}><h3 style={{fontSize:15,fontWeight:700,color:C.text,margin:0,fontFamily:F,letterSpacing:"-0.022em"}}>🔄 {t.weekly}</h3><span style={{fontSize:11,color:C.textSecondary}}>{t.weeklySub}</span></div>
      {st.weeklyAreas.filter(a=>user.role==="owner"||user.role==="manager"||rot[a.id]===user.roomId).map(area=>{const room=st.rooms.find(r=>r.id===rot[area.id]);const allD=area.tasks.every(ta=>isC(ta.de,area.id,wk));
        return <div key={area.id} style={{...aCard,borderLeftColor:area.color}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><div><strong style={{fontSize:15,color:C.text,letterSpacing:"-0.01em"}}>{t[area.id]}</strong><span style={{display:"inline-block",fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:8,marginLeft:6,background:area.bg,color:area.color}}>{t.responsible}: {room?.name||"—"}</span></div>{allD&&<span style={{fontSize:11,fontWeight:600,color:C.green,background:"rgba(52,199,89,0.08)",padding:"4px 10px",borderRadius:8}}>{t.allDone}</span>}</div>
          {area.tasks.map((task,ti)=><TR key={ti} task={task} areaId={area.id} area={area}/>)}
        </div>;})}</div>
  </div>;
}
