import { F, C, btnS } from "../styles";
import { gwk, fd, ft } from "../utils/helpers";

export default function HistoryScreen({t,st,hp,ph,vp,user}){
  const lang=st.lang||"de";
  const comps=Array.isArray(st.completions)?st.completions:Object.values(st.completions||{});
  const sorted=[...comps].sort((a,b)=>b.timestamp-a.timestamp);const wk=gwk(new Date());
  const doE=()=>{if(!hp("export_data"))return;const h="Datum,Uhrzeit,KW,Person,Zimmer,Bereich,Aufgabe,Punkte\n";const rows=sorted.map(c=>`${fd(c.timestamp)},${ft(c.timestamp)},${c.week},${c.person},${c.room},${c.areaId},${c.taskKey},${c.pts||1}`).join("\n");const b=new Blob([h+rows],{type:"text/csv"});const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=`wg_KW${wk}.csv`;a.click();};

  // Find task definition for translation
  const findTask=(taskKey,areaId)=>{
    if(areaId==="daily") return st.dailyTasks.find(t=>t.de===taskKey);
    const area=st.weeklyAreas.find(a=>a.id===areaId);
    return area?.tasks?.find(t=>t.de===taskKey);
  };

  return <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><h2 style={{fontSize:20,color:C.text,margin:0,fontFamily:F,letterSpacing:"-0.022em"}}>📊 {t.history}</h2>{hp("export_data")&&<button style={btnS} onClick={doE}>📥 {t.exportCsv}</button>}</div>

    {/* Room stats */}
    <div style={{display:"flex",gap:8,marginBottom:14}}>{st.rooms.map(r=>{const c=comps.filter(c=>c.room===r.name&&c.week===wk).reduce((s,c)=>s+(c.pts||1),0);return <div key={r.id} style={{flex:1,background:"rgba(255,255,255,0.85)",backdropFilter:"blur(20px)",borderRadius:14,padding:12,textAlign:"center",boxShadow:C.shadowSm,border:`1px solid ${C.border}`}}><div style={{fontSize:22,fontWeight:700,color:C.accent}}>{c}⭐</div><div style={{fontSize:11,color:C.textSecondary}}>{r.name}</div></div>;})}</div>

    {/* History list */}
    {!sorted.length?<div style={{textAlign:"center",padding:40,color:C.textSecondary}}><div style={{fontSize:40,marginBottom:8}}>📭</div>{t.noHistory}</div>
    :<div style={{display:"flex",flexDirection:"column",gap:8}}>{(()=>{
      const seen=new Set();
      return sorted.filter(c=>{
        const timeRef=c.areaId==="daily"?(c.day||c.week):c.week;
        const uid=`${timeRef}-${c.areaId}-${c.taskKey}-${c.person}`;
        if(seen.has(uid))return false;seen.add(uid);return true;
      }).slice(0,60).map((c,i)=>{
        const area=st.weeklyAreas.find(a=>a.id===c.areaId);
        const task=findTask(c.taskKey,c.areaId);
        const timeRef=c.areaId==="daily"?(c.day||c.week):c.week;
        const pk=`${timeRef}-${c.areaId}-${c.taskKey}-${c.person}`;
        const pkFallback=`${c.week}-${c.areaId}-${c.taskKey}-${c.person}`;
        const pkLegacy=`${c.week}-${c.areaId}-${c.taskKey}`;
        const photo=ph[pk]||ph[pkFallback]||ph[pkLegacy];
        const areaColor=area?.color||(c.areaId==="daily"?C.accent:"#94A3B8");
        const areaLabel=c.areaId==="daily"?(lang==="de"?"Täglich":"Hàng ngày"):(t[c.areaId]||c.areaId);
        const timeLabel=c.areaId==="daily"?(c.day||`KW${c.week}`):`KW${c.week}`;

        return <div key={`${pk}-${c.timestamp}`} style={{background:"rgba(255,255,255,0.85)",backdropFilter:"blur(20px)",borderRadius:16,overflow:"hidden",boxShadow:C.shadowSm,border:`1px solid ${C.border}`,animation:"fadeUp 0.2s ease"}}>
          {/* Photo inline */}
          {photo&&<img src={photo} style={{width:"100%",height:160,objectFit:"cover",cursor:"pointer",borderBottom:`3px solid ${areaColor}`}} alt="proof" onClick={()=>vp(photo)}/>}

          <div style={{padding:"10px 14px"}}>
            {/* Task name */}
            <div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
              {lang==="de"?c.taskKey:(task?.vi||c.taskKey)}
            </div>

            {/* Info row */}
            <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
              <div style={{width:22,height:22,borderRadius:7,background:`linear-gradient(135deg,${areaColor},${C.purple})`,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:10,fontFamily:F,flexShrink:0}}>{c.person[0].toUpperCase()}</div>
              <span style={{fontSize:12,fontWeight:600,color:C.text}}>{c.person}</span>
              <span style={{fontSize:11,color:C.textSecondary}}>·</span>
              <span style={{fontSize:11,color:C.textSecondary}}>{fd(c.timestamp)} {ft(c.timestamp)}</span>
              <span style={{fontSize:11,color:C.textSecondary}}>·</span>
              <span style={{fontSize:11,fontWeight:700,color:areaColor,background:`${areaColor}12`,padding:"1px 8px",borderRadius:6}}>{areaLabel}</span>
              <span style={{fontSize:11,color:C.textSecondary}}>·</span>
              <span style={{fontSize:11,color:C.textSecondary}}>{timeLabel}</span>
            </div>

            {/* Points + verified badge */}
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:6}}>
              <span style={{fontSize:12,fontWeight:700,color:C.orange}}>+{c.pts||1}⭐</span>
              {c.verified&&<span style={{fontSize:10,fontWeight:700,color:C.green,background:"rgba(52,199,89,0.08)",padding:"2px 8px",borderRadius:6}}>✅ {lang==="de"?"Bestätigt":"Đã xác nhận"} {c.verifiedBy?`(${c.verifiedBy})`:""}</span>}
              {!c.verified&&<span style={{fontSize:10,fontWeight:600,color:C.orange,background:"rgba(255,149,0,0.08)",padding:"2px 8px",borderRadius:6}}>⏳ {lang==="de"?"Offen":"Chờ xác nhận"}</span>}
              {!photo&&<span style={{fontSize:10,color:C.textSecondary}}>📷✗</span>}
            </div>
          </div>
        </div>;
      });
    })()}</div>}
  </div>;
}
