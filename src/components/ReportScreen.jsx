import { useState } from "react";
import { gwk } from "../utils/helpers";
import { F, C, inp, inpS, btnP, btnG, btnS, lbl, ov, mod } from "../styles";

const CATS=["messy","noise","bathroom","rules","other"];
const STATUS_COLORS={new:"#3B82F6",seen:"#F59E0B",resolved:"#10B981",dismissed:"#94A3B8"};
const STATUS_ICONS={new:"🔴",seen:"👀",resolved:"✅",dismissed:"—"};

export default function ReportScreen({t,st,sv,user,show}){
  const[form,setForm]=useState(false);
  const[cat,setCat]=useState("messy");
  const[text,setText]=useState("");
  const[target,setTarget]=useState("");
  const isAdmin=user?.role==="owner"||user?.role==="manager";
  const wk=gwk(new Date());
  const reports=(st.reports||[]).sort((a,b)=>b.timestamp-a.timestamp);

  // Rate limit: max 3 per week per user
  const myCount=reports.filter(r=>r.reporter===user?.name&&r.week===wk).length;
  const canSend=myCount<3;

  const send=()=>{
    if(!canSend){show(t.reportLimit,"error");return;}
    const r={
      id:Date.now().toString(),
      category:cat,
      text:text.trim(),
      target:target||null,
      reporter:user.name,
      timestamp:Date.now(),
      week:wk,
      status:"new",
    };
    sv({...st,reports:[...(st.reports||[]),r]});
    setCat("messy");setText("");setTarget("");setForm(false);
    show(t.reportSent);
  };

  const setStatus=(id,status)=>{
    sv({...st,reports:(st.reports||[]).map(r=>r.id===id?{...r,status,resolvedBy:user.name,resolvedAt:Date.now()}:r)});
    show("✓");
  };
  const del=(id)=>{
    sv({...st,reports:(st.reports||[]).filter(r=>r.id!==id)});
    show("✓");
  };

  const catLabel=(c)=>t[`cat_${c}`]||c;
  const statusLabel=(s)=>t[`report${s.charAt(0).toUpperCase()+s.slice(1)}`]||s;
  const fd=(ts)=>new Date(ts).toLocaleDateString(st.lang==="de"?"de-DE":"vi-VN",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"});

  // New report count for badge
  const newCount=reports.filter(r=>r.status==="new").length;

  return <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <h2 style={{fontSize:20,color:C.text,margin:0,fontFamily:F,letterSpacing:"-0.022em"}}>🚨 {t.reports}</h2>
      <button style={{...btnP,fontSize:13,padding:"8px 16px"}} onClick={()=>setForm(!form)}>+ {t.newReport}</button>
    </div>

    {/* New report form */}
    {form&&<div style={{background:"rgba(255,255,255,0.85)",backdropFilter:"blur(20px)",borderRadius:18,padding:18,marginBottom:16,boxShadow:C.shadowSm,border:`1px solid ${C.border}`,animation:"fadeUp .25s ease"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
        <span style={{fontSize:20}}>📝</span>
        <h3 style={{margin:0,fontSize:16,fontFamily:F,color:C.text,fontWeight:700}}>{t.newReport}</h3>
        <span style={{marginLeft:"auto",fontSize:11,color:C.textSecondary,background:"rgba(0,0,0,0.03)",padding:"3px 8px",borderRadius:6}}>🔒 {t.reportAnon}</span>
      </div>

      {/* Category */}
      <label style={lbl}>{t.reportCategory}</label>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
        {CATS.map(c=><button key={c} style={{padding:"6px 12px",border:`1.5px solid ${cat===c?C.accent:C.border}`,borderRadius:10,background:cat===c?"rgba(0,122,255,0.06)":"rgba(255,255,255,0.6)",fontSize:12,fontWeight:cat===c?700:500,color:cat===c?C.accent:C.text,cursor:"pointer",fontFamily:F}} onClick={()=>setCat(c)}>{catLabel(c)}</button>)}
      </div>

      {/* Target person (optional) */}
      <label style={lbl}>{t.reportTarget}</label>
      <select style={{...inpS,marginBottom:12}} value={target} onChange={e=>setTarget(e.target.value)}>
        <option value="">— {t.reportNoOne}</option>
        {st.users.filter(u=>u.name!==user?.name&&u.room!=="—").map(u=><option key={u.id} value={u.name}>{u.name}</option>)}
      </select>

      {/* Description */}
      <label style={lbl}>{t.reportText}</label>
      <textarea style={{...inp,minHeight:60,resize:"vertical",fontSize:13}} value={text} onChange={e=>setText(e.target.value)} placeholder={st.lang==="de"?"Was ist passiert?":"Chuyện gì đã xảy ra?"}/>

      {!canSend&&<p style={{color:C.red,fontSize:12,marginTop:6}}>⚠️ {t.reportLimit}</p>}

      <div style={{display:"flex",gap:8,marginTop:12}}>
        <button style={{...btnG,flex:1}} onClick={()=>setForm(false)}>{t.cancel}</button>
        <button style={{...btnP,flex:1,opacity:canSend?1:0.5}} onClick={canSend?send:undefined}>{t.sendReport}</button>
      </div>
    </div>}

    {/* Report list */}
    {!reports.length?<div style={{textAlign:"center",padding:40,color:C.textSecondary,fontSize:14}}>
      <div style={{fontSize:40,marginBottom:8}}>📭</div>
      {t.reportEmpty}
    </div>:
    <div>
      {reports.map(r=>{
        const showReporter=isAdmin;
        return <div key={r.id} style={{background:"rgba(255,255,255,0.72)",backdropFilter:"blur(20px)",borderRadius:14,padding:14,marginBottom:8,boxShadow:C.shadowSm,border:`1px solid ${r.status==="new"?"rgba(59,130,246,0.2)":C.border}`,animation:"fadeUp 0.2s ease"}}>
          {/* Header */}
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <span style={{fontSize:11,fontWeight:700,color:STATUS_COLORS[r.status],background:`${STATUS_COLORS[r.status]}15`,padding:"3px 8px",borderRadius:6}}>{STATUS_ICONS[r.status]} {statusLabel(r.status)}</span>
            <span style={{fontSize:12,fontWeight:600,color:C.text}}>{catLabel(r.category)}</span>
            <span style={{marginLeft:"auto",fontSize:10,color:C.textSecondary}}>{fd(r.timestamp)}</span>
          </div>

          {/* Target */}
          {r.target&&<div style={{fontSize:12,color:C.text,marginBottom:4}}>
            <span style={{color:C.textSecondary}}>{t.reportTarget}:</span> <strong>{r.target}</strong>
          </div>}

          {/* Text */}
          {r.text&&<div style={{fontSize:13,color:C.text,padding:"8px 10px",background:"rgba(0,0,0,0.02)",borderRadius:8,marginBottom:8,lineHeight:1.4}}>{r.text}</div>}

          {/* Reporter (admin only) */}
          {showReporter&&<div style={{fontSize:11,color:C.orange,fontWeight:600,marginBottom:6}}>
            👤 {t.reportBy}: {r.reporter}
          </div>}

          {/* Resolved info */}
          {r.resolvedBy&&<div style={{fontSize:10,color:C.textSecondary,marginBottom:6}}>
            {statusLabel(r.status)} — {r.resolvedBy} · {fd(r.resolvedAt)}
          </div>}

          {/* Actions (admin only) */}
          {isAdmin&&<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {r.status==="new"&&<button style={{padding:"4px 10px",background:"rgba(255,149,0,0.08)",border:"none",borderRadius:6,fontSize:10,fontWeight:600,color:C.orange,cursor:"pointer",fontFamily:F}} onClick={()=>setStatus(r.id,"seen")}>👀 {t.markSeen}</button>}
            {r.status!=="resolved"&&<button style={{padding:"4px 10px",background:"rgba(52,199,89,0.08)",border:"none",borderRadius:6,fontSize:10,fontWeight:600,color:C.green,cursor:"pointer",fontFamily:F}} onClick={()=>setStatus(r.id,"resolved")}>✅ {t.markResolved}</button>}
            {r.status!=="dismissed"&&r.status!=="resolved"&&<button style={{padding:"4px 10px",background:"rgba(0,0,0,0.03)",border:"none",borderRadius:6,fontSize:10,fontWeight:600,color:C.textSecondary,cursor:"pointer",fontFamily:F}} onClick={()=>setStatus(r.id,"dismissed")}>— {t.markDismissed}</button>}
            {user?.role==="owner"&&<button style={{padding:"4px 10px",background:"rgba(255,59,48,0.08)",border:"none",borderRadius:6,fontSize:10,fontWeight:600,color:C.red,cursor:"pointer",fontFamily:F,marginLeft:"auto"}} onClick={()=>del(r.id)}>🗑 {t.deleteReport}</button>}
          </div>}
        </div>;
      })}
    </div>}
  </div>;
}
