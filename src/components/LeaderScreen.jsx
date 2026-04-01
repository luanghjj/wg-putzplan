import { gwk, grot, gmo, getTimeLeft } from "../utils/helpers";
import { F, C } from "../styles";

const sanitizeTaskKey = (tk) => tk.replace(/[.#$\/\[\]]/g, "_");

export default function LeaderScreen({t,st,user}){
  const canSeeAll=user?.role==="owner"||user?.role==="manager";
  const wk=gwk(new Date()),mo=gmo(),tl=getTimeLeft(wk);
  const users=st.users.filter(u=>u.room!=="—");
  // Calculate points: sum pts from completions (pts is set on completion, fallback to 1 for legacy entries)
  const gP=(u,f)=>st.completions.filter(c=>c.person===u.name&&(f==="week"?c.week===wk:f==="month"?c.month===mo:true)).reduce((s,c)=>s+(c.pts||1),0);
  const ranked=users.map(u=>({...u,week:gP(u,"week"),month:gP(u,"month")})).sort((a,b)=>b.month-a.month);
  const w=ranked[0];const medals=["🥇","🥈","🥉"];
  const rot=grot(wk,st.rooms,st.weeklyAreas);

  const roomReports=st.rooms.map(room=>{
    const assignedAreas=st.weeklyAreas.filter(a=>rot[a.id]===room.id);
    let totalTasks=0,doneTasks=0,verifiedTasks=0,rejectedTasks=0,missedTasks=0;
    const taskDetails=[];
    assignedAreas.forEach(area=>{
      area.tasks.forEach(task=>{
        totalTasks++;
        const comp=st.completions.find(c=>c.taskKey===task.de&&c.areaId===area.id&&c.week===wk);
        const verif=(st.verifications||{})[`${wk}-${area.id}-${sanitizeTaskKey(task.de)}`];
        const status=comp?(verif?.status==="rejected"?"rejected":verif?.status==="verified"?"verified":"done"):(tl.overdue?"missed":"open");
        if(comp)doneTasks++;
        if(verif?.status==="verified")verifiedTasks++;
        if(verif?.status==="rejected")rejectedTasks++;
        if(!comp&&tl.overdue)missedTasks++;
        taskDetails.push({task,area,status,comp,verif});
      });
    });
    const penalty=missedTasks*(st.penaltyRate||5);
    return{room,assignedAreas,totalTasks,doneTasks,verifiedTasks,rejectedTasks,missedTasks,penalty,taskDetails};
  });

  let totalAll=0,doneAll=0;
  st.weeklyAreas.forEach(a=>a.tasks.forEach(ta=>{totalAll++;if(st.completions.find(c=>c.taskKey===ta.de&&c.areaId===a.id&&c.week===wk))doneAll++;}));
  const pctAll=totalAll>0?Math.round(doneAll/totalAll*100):0;

  const statusColors={done:C.accent,verified:C.green,rejected:C.red,missed:C.red,open:C.textSecondary};
  const statusIcons={done:"⏳",verified:"✅",rejected:"❌",missed:"⚠️",open:"○"};
  const statusLabels={de:{done:"Erledigt",verified:"Bestätigt",rejected:"Abgelehnt",missed:"Verpasst",open:"Offen"},vi:{done:"Xong",verified:"Đã xác nhận",rejected:"Bị từ chối",missed:"Bỏ lỡ",open:"Chưa làm"}};

  return <div>
    {w&&w.month>0&&<div style={{background:"linear-gradient(135deg,#FFF8E1,#FFE082)",borderRadius:18,padding:22,marginBottom:16,textAlign:"center",boxShadow:"0 4px 20px rgba(255,204,0,0.15)",border:"1px solid rgba(255,204,0,0.2)"}}><div style={{fontSize:44}}>🏆</div><h3 style={{margin:"8px 0 4px",fontFamily:F,color:"#7B6B00",fontSize:18,fontWeight:700,letterSpacing:"-0.022em"}}>{t.monthlyWinner}</h3><div style={{fontSize:24,fontWeight:800,color:"#5D4E00",fontFamily:F}}>{w.name}</div><div style={{fontSize:14,color:"#8B7500"}}>{w.month} {t.points} · {st.rewardText||t.defaultReward}</div></div>}

    <h3 style={{fontSize:15,fontWeight:700,color:C.text,margin:"0 0 12px",fontFamily:F,letterSpacing:"-0.022em"}}>📋 {t.statusReport} — {t.kwNum} {wk}</h3>
    <div style={{background:"rgba(255,255,255,0.72)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderRadius:18,padding:16,marginBottom:16,boxShadow:C.shadowSm,border:`1px solid ${C.border}`}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
        <div style={{flex:1,height:8,background:"rgba(0,0,0,0.04)",borderRadius:4,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${pctAll}%`,background:pctAll===100?C.green:`linear-gradient(90deg,${C.accent},${C.purple})`,borderRadius:4,transition:"width .5s ease"}}/>
        </div>
        <span style={{fontSize:13,fontWeight:700,color:pctAll===100?C.green:C.accent}}>{pctAll}%</span>
        <span style={{fontSize:11,color:C.textSecondary}}>{doneAll}/{totalAll}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",borderRadius:12,background:tl.overdue?"rgba(255,59,48,0.06)":"rgba(0,0,0,0.02)",marginBottom:12}}>
        <span style={{fontSize:13}}>{tl.overdue?"⚠️":"⏰"}</span>
        <span style={{fontSize:12,fontWeight:600,color:tl.overdue?C.red:C.text}}>{t.deadline}: {t.deadlineDay}</span>
        <span style={{marginLeft:"auto",fontSize:12,fontWeight:700,color:tl.overdue?C.red:tl.hours<24?C.orange:C.green}}>{tl.overdue?t.overdue:`${t.timeLeft} ${tl.text}`}</span>
      </div>
      {roomReports.filter(rr=>canSeeAll||rr.room.id===user?.roomId).map(rr=> <div key={rr.room.id} style={{marginBottom:12,padding:12,background:"rgba(0,0,0,0.02)",borderRadius:14,border:`1px solid ${C.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <strong style={{fontSize:14,color:C.text,letterSpacing:"-0.01em"}}>{rr.room.name}</strong>
          <span style={{marginLeft:"auto",fontSize:12,fontWeight:700,color:rr.doneTasks===rr.totalTasks?C.green:C.textSecondary}}>{rr.doneTasks}/{rr.totalTasks}</span>
          {rr.missedTasks>0&&<span style={{fontSize:11,fontWeight:700,color:C.red,background:"rgba(255,59,48,0.08)",padding:"2px 8px",borderRadius:6}}>⚠️ {rr.missedTasks} {t.missed}</span>}
          {rr.penalty>0&&<span style={{fontSize:11,fontWeight:700,color:C.red}}>💰 {rr.penalty.toFixed(2)}€</span>}
        </div>
        {rr.taskDetails.map((td,i)=> <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 0",borderTop:i>0?`1px solid ${C.border}`:"none"}}>
          <span style={{fontSize:12,color:statusColors[td.status]}}>{statusIcons[td.status]}</span>
          <span style={{flex:1,fontSize:12,color:C.text,textDecoration:td.status==="done"||td.status==="verified"?"line-through":"none"}}>{st.lang==="de"?td.task.de:td.task.vi}</span>
          <span style={{fontSize:10,fontWeight:600,color:statusColors[td.status],background:td.status==="verified"?"rgba(52,199,89,0.08)":td.status==="rejected"||td.status==="missed"?"rgba(255,59,48,0.08)":"transparent",padding:"2px 8px",borderRadius:6}}>{statusLabels[st.lang||"de"][td.status]}</span>
          {td.comp&&<span style={{fontSize:10,color:C.textSecondary}}>{td.comp.person}</span>}
        </div>)}
      </div>)}
      {pctAll===100&&<div style={{textAlign:"center",padding:"10px",background:"rgba(52,199,89,0.06)",borderRadius:12,fontSize:14,fontWeight:700,color:C.green}}>🎉 {t.allCompleted}!</div>}
    </div>

    <h3 style={{fontSize:15,fontWeight:700,color:C.text,margin:"0 0 12px",fontFamily:F,letterSpacing:"-0.022em"}}>🏆 {t.leaderboard}</h3>
    {ranked.map((u,i)=> <div key={u.id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:"rgba(255,255,255,0.72)",backdropFilter:"blur(20px)",borderRadius:14,marginBottom:6,boxShadow:C.shadowSm,border:`1px solid ${C.border}`,animation:"fadeUp 0.25s ease"}}>
      <span style={{fontSize:20,width:28,textAlign:"center"}}>{medals[i]||`#${i+1}`}</span>
      <div style={{width:34,height:34,borderRadius:10,background:`linear-gradient(135deg,${i===0?C.yellow:i===1?"#C0C0C0":"#CD7F32"},${i===0?"#FFD700":"#D4D4D4"})`,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,fontFamily:F,boxShadow:`0 2px 8px ${i===0?"rgba(255,204,0,0.3)":"rgba(0,0,0,0.1)"}`}}>{u.name[0]}</div>
      <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:C.text,letterSpacing:"-0.01em"}}>{u.name}</div><div style={{fontSize:11,color:C.textSecondary}}>{u.room}</div></div>
      <div style={{textAlign:"right"}}><div style={{fontSize:18,fontWeight:800,color:C.orange}}>{u.month}⭐</div><div style={{fontSize:10,color:C.textSecondary}}>{t.thisWeek}: {u.week}</div></div>
    </div>)}

    <h3 style={{fontSize:15,fontWeight:700,color:C.text,margin:"20px 0 12px",fontFamily:F,letterSpacing:"-0.022em"}}>💰 {t.strafkasse}</h3>
    <div style={{background:"rgba(255,255,255,0.72)",backdropFilter:"blur(20px)",borderRadius:14,padding:16,boxShadow:C.shadowSm,border:`1px solid ${C.border}`}}>
      <div style={{fontSize:12,color:C.textSecondary,marginBottom:8}}>{t.penaltyPerTask}: {st.penaltyRate||5}€</div>
      {roomReports.filter(rr=>canSeeAll||rr.room.id===user?.roomId).map(rr=> <div key={rr.room.id} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
        <span style={{flex:1,fontSize:14,fontWeight:500,color:C.text}}>{rr.room.name}</span>
        {rr.missedTasks>0?<span style={{fontSize:12,color:C.textSecondary}}>{rr.missedTasks} {t.missed}</span>:null}
        {rr.penalty>0?<span style={{fontSize:14,fontWeight:700,color:C.red}}>{t.owes}: {rr.penalty.toFixed(2)}€</span>
        :<span style={{fontSize:13,color:C.green,fontWeight:600}}>✓ OK</span>}
      </div>)}
      {(()=>{const totalPen=roomReports.reduce((s,r)=>s+r.penalty,0);return totalPen>0?<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0 0",marginTop:8,borderTop:`2px solid ${C.border}`}}><strong style={{fontSize:14,color:C.text}}>{t.penaltyTotal}</strong><strong style={{fontSize:16,color:C.red}}>{totalPen.toFixed(2)}€</strong></div>:null;})()}
    </div>

    {/* Person Fairness Check */}
    <h3 style={{fontSize:15,fontWeight:700,color:C.text,margin:"20px 0 12px",fontFamily:F,letterSpacing:"-0.022em"}}>👥 {t.fairness}</h3>
    <div style={{background:"rgba(255,255,255,0.72)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderRadius:14,padding:16,boxShadow:C.shadowSm,border:`1px solid ${C.border}`}}>
      {st.rooms.map(room=>{
        const residents=(room.residents||[]).map(r=>{
          const u=st.users.find(u=>u.name===r.name&&u.roomId===room.id);
          const pts=st.completions.filter(c=>c.person===r.name&&c.week===wk).reduce((s,c)=>s+(c.pts||1),0);
          return{...r,pts,userId:u?.id};
        });
        if(residents.length<2)return null;
        // Calc min points: total room points assigned ÷ residents
        const rr=roomReports.find(x=>x.room.id===room.id);
        const totalRoomPts=rr?rr.taskDetails.reduce((s,td)=>s+td.task.pts,0):0;
        const minPts=Math.ceil(totalRoomPts/residents.length);
        const maxDiff=st.maxDiffPercent||30;
        const maxPts=Math.max(...residents.map(r=>r.pts));
        const minEarned=Math.min(...residents.map(r=>r.pts));
        const diffPct=maxPts>0?Math.round((maxPts-minEarned)/maxPts*100):0;
        const isFair=diffPct<=maxDiff;

        return <div key={room.id} style={{marginBottom:14,padding:12,background:"rgba(0,0,0,0.02)",borderRadius:14,border:`1px solid ${isFair?"rgba(52,199,89,0.2)":"rgba(255,59,48,0.2)"}`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <strong style={{fontSize:14,color:C.text}}>{room.name}</strong>
            <span style={{marginLeft:"auto",fontSize:11,fontWeight:700,color:isFair?C.green:C.red,background:isFair?"rgba(52,199,89,0.08)":"rgba(255,59,48,0.08)",padding:"2px 8px",borderRadius:6}}>{isFair?t.fairOk:t.unfair}</span>
          </div>
          <div style={{fontSize:11,color:C.textSecondary,marginBottom:6}}>
            {t.minPoints}: {minPts}⭐ · {t.maxDiff}: {maxDiff}% · {st.lang==="de"?"Differenz":"Chênh lệch"}: {diffPct}%
          </div>
          {/* Progress bars per person */}
          {residents.map((r,i)=>{
            const below=r.pts<minPts;
            const missing=below?minPts-r.pts:0;
            const penalty=missing*(st.penaltyPerMissingPoint||2);
            const pct=minPts>0?Math.min(Math.round(r.pts/minPts*100),100):100;
            return <div key={i} style={{marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                <span style={{fontSize:13,fontWeight:600,color:C.text,minWidth:70}}>{r.name}</span>
                <div style={{flex:1,height:8,background:"rgba(0,0,0,0.04)",borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:below?C.red:pct>=100?C.green:`linear-gradient(90deg,${C.accent},${C.purple})`,borderRadius:4,transition:"width .3s"}}/>
                </div>
                <span style={{fontSize:12,fontWeight:700,color:below?C.red:C.green,minWidth:50,textAlign:"right"}}>{r.pts}/{minPts}⭐</span>
              </div>
              {below&&<div style={{marginLeft:76,display:"flex",gap:6,flexWrap:"wrap"}}>
                <span style={{fontSize:10,fontWeight:600,color:C.red,background:"rgba(255,59,48,0.08)",padding:"1px 6px",borderRadius:4}}>⚠️ -{missing} {t.belowMin}</span>
                <span style={{fontSize:10,fontWeight:600,color:C.red}}>💰 +{penalty.toFixed(2)}€</span>
                {st.catchUpEnabled&&<span style={{fontSize:10,fontWeight:600,color:C.orange,background:"rgba(255,149,0,0.08)",padding:"1px 6px",borderRadius:4}}>📋 {missing}× {t.makeupTasks}</span>}
              </div>}
            </div>;
          })}
        </div>;
      })}
      {/* Total person penalties */}
      {(()=>{
        let totalPersonPen=0;
        st.rooms.forEach(room=>{
          const residents=(room.residents||[]).map(r=>({...r,pts:st.completions.filter(c=>c.person===r.name&&c.week===wk).reduce((s,c)=>s+(c.pts||1),0)}));
          if(residents.length<2)return;
          const rr=roomReports.find(x=>x.room.id===room.id);
          const totalRoomPts=rr?rr.taskDetails.reduce((s,td)=>s+td.task.pts,0):0;
          const minPts=Math.ceil(totalRoomPts/residents.length);
          residents.forEach(r=>{if(r.pts<minPts)totalPersonPen+=(minPts-r.pts)*(st.penaltyPerMissingPoint||2);});
        });
        return totalPersonPen>0?<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0 0",marginTop:4,borderTop:`2px solid ${C.border}`}}><strong style={{fontSize:13,color:C.text}}>{t.penaltyTotal} ({t.fairness})</strong><strong style={{fontSize:15,color:C.red}}>{totalPersonPen.toFixed(2)}€</strong></div>:
        <div style={{textAlign:"center",padding:8,fontSize:13,color:C.green,fontWeight:600}}>✓ {t.fairOk}</div>;
      })()}
    </div>
  </div>;
}
