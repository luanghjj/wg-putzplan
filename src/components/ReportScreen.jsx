import { useState, useRef } from "react";
import { gwk, compImg } from "../utils/helpers";
import { F, C, inp, inpS, btnP, btnG, btnS, lbl, ov, mod } from "../styles";

const CATS=["messy","noise","bathroom","rules","other"];
const STATUS_COLORS={new:"#3B82F6",seen:"#F59E0B",resolved:"#10B981",dismissed:"#94A3B8"};
const STATUS_ICONS={new:"🔴",seen:"👀",resolved:"✅",dismissed:"—"};

export default function ReportScreen({t,st,sv,user,show}){
  const[form,setForm]=useState(false);
  const[cat,setCat]=useState("messy");
  const[text,setText]=useState("");
  const[target,setTarget]=useState("");
  const[photo,setPhoto]=useState(null);
  const[camOpen,setCamOpen]=useState(false);
  const[viewPhoto,setViewPhoto]=useState(null);
  const videoRef=useRef();
  const canvasRef=useRef();
  const streamRef=useRef();
  const isAdmin=user?.role==="owner"||user?.role==="manager";
  const wk=gwk(new Date());
  const reports=(st.reports||[]).sort((a,b)=>b.timestamp-a.timestamp);

  const myCount=reports.filter(r=>r.reporter===user?.name&&r.week===wk).length;
  const canSend=myCount<3;

  // Camera functions
  const openCam=async()=>{
    try{
      const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:false});
      streamRef.current=stream;
      setCamOpen(true);
      setTimeout(()=>{if(videoRef.current){videoRef.current.srcObject=stream;videoRef.current.play();}},100);
    }catch{
      const inp=document.createElement("input");
      inp.type="file";inp.accept="image/*";inp.capture="environment";
      inp.onchange=async(e)=>{const f=e.target.files?.[0];if(f)setPhoto(await compImg(f,600,.6));};
      inp.click();
    }
  };
  const snap=async()=>{
    const v=videoRef.current,c=canvasRef.current;
    if(!v||!c)return;
    c.width=v.videoWidth;c.height=v.videoHeight;
    c.getContext("2d").drawImage(v,0,0);
    const blob=await(await fetch(c.toDataURL("image/jpeg",0.6))).blob();
    const file=new File([blob],"report.jpg",{type:"image/jpeg"});
    setPhoto(await compImg(file,600,0.6));
    closeCam();
  };
  const closeCam=()=>{
    if(streamRef.current)streamRef.current.getTracks().forEach(t=>t.stop());
    streamRef.current=null;
    setCamOpen(false);
  };

  const send=()=>{
    if(!canSend){show(t.reportLimit,"error");return;}
    const r={
      id:Date.now().toString(),
      category:cat,
      text:text.trim(),
      photo:photo||null,
      target:target||null,
      reporter:user.name,
      timestamp:Date.now(),
      week:wk,
      status:"new",
    };
    sv({...st,reports:[...(st.reports||[]),r]});
    setCat("messy");setText("");setTarget("");setPhoto(null);setForm(false);
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

  return <div>
    {/* Header */}
    <div style={{marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <h2 style={{fontSize:22,fontWeight:800,color:C.text,margin:0,fontFamily:F,letterSpacing:"-0.02em"}}>{t.reports}</h2>
        <button style={{...btnP,fontSize:13,padding:"8px 18px",background:"linear-gradient(135deg,#1C1C1E,#3A3A3C)"}} onClick={()=>setForm(!form)}>🔒 {t.newReport}</button>
      </div>
      {/* Anonymous badge — always visible */}
      <div style={{
        display:"flex",alignItems:"center",gap:10,
        padding:"12px 16px",borderRadius:14,
        background:"linear-gradient(135deg,rgba(48,209,88,0.08),rgba(0,122,255,0.06))",
        border:"1px solid rgba(48,209,88,0.15)",
      }}>
        <div style={{
          width:36,height:36,borderRadius:10,flexShrink:0,
          background:"linear-gradient(135deg,#30D158,#007AFF)",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,
        }}>🔒</div>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:C.text}}>{t.reportAnonShort||"Ẩn danh"}</div>
          <div style={{fontSize:12,color:C.textSecondary,marginTop:1}}>{t.reportAnon}</div>
        </div>
      </div>
    </div>

    {/* New report form */}
    {form&&<div style={{background:C.white,borderRadius:18,padding:18,marginBottom:16,boxShadow:C.shadowMd,overflow:"hidden",animation:"fadeUp .25s ease"}}>
      {/* Privacy banner */}
      <div style={{margin:"-18px -18px 16px",padding:"14px 18px",background:"linear-gradient(135deg,#1C1C1E,#2C2C2E)",display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:24}}>🔒</span>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:"#fff",letterSpacing:"-0.01em"}}>{t.newReport}</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:2}}>{t.reportAnon}</div>
        </div>
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
      <textarea style={{...inp,minHeight:60,resize:"vertical",fontSize:13}} value={text} onChange={e=>setText(e.target.value)} placeholder="Chuyện gì đã xảy ra?"/>

      {/* Photo capture */}
      <label style={{...lbl,marginTop:10}}>📸 Ảnh bằng chứng</label>
      {camOpen?<div style={{borderRadius:12,overflow:"hidden",background:"#000",marginBottom:8}}>
        <video ref={videoRef} style={{width:"100%",borderRadius:12}} playsInline muted/>
        <canvas ref={canvasRef} style={{display:"none"}}/>
        <div style={{display:"flex",gap:8,padding:8,justifyContent:"center"}}>
          <button style={{padding:"8px 20px",background:C.accent,color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:F}} onClick={snap}>📸 Chụp</button>
          <button style={{padding:"8px 14px",background:"rgba(255,255,255,0.2)",color:"#fff",border:"none",borderRadius:10,fontSize:13,cursor:"pointer",fontFamily:F}} onClick={closeCam}>✕</button>
        </div>
      </div>
      :photo?<div style={{position:"relative",display:"inline-block",marginBottom:8}}>
        <img src={photo} style={{maxHeight:120,borderRadius:10,border:`1px solid ${C.border}`}} alt="evidence"/>
        <button style={{position:"absolute",top:-6,right:-6,background:"rgba(0,0,0,.7)",color:"#fff",border:"none",borderRadius:"50%",width:22,height:22,fontSize:13,cursor:"pointer",lineHeight:"22px"}} onClick={()=>setPhoto(null)}>×</button>
      </div>
      :<button style={{width:"100%",padding:10,background:"#FFF7ED",border:"2px dashed #FDBA74",borderRadius:10,color:"#EA580C",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:F,marginBottom:8}} onClick={openCam}>📷 Chụp ảnh bằng chứng</button>}

      {!canSend&&<p style={{color:C.red,fontSize:12,marginTop:6}}>⚠️ {t.reportLimit}</p>}

      <div style={{display:"flex",gap:8,marginTop:8}}>
        <button style={{...btnG,flex:1,background:"rgba(120,120,128,0.08)",color:C.textSecondary}} onClick={()=>{setForm(false);closeCam();}}>{t.cancel}</button>
        <button style={{...btnP,flex:1,opacity:canSend?1:0.5,background:"linear-gradient(135deg,#1C1C1E,#3A3A3C)"}} onClick={canSend?send:undefined}>🔒 {t.sendReport}</button>
      </div>
    </div>}

    {/* Photo viewer modal */}
    {viewPhoto&&<div style={{...ov,zIndex:9999}} onClick={()=>setViewPhoto(null)}>
      <div style={{...mod,padding:8,maxWidth:"90vw",background:"#000",borderRadius:16}} onClick={e=>e.stopPropagation()}>
        <img src={viewPhoto} style={{width:"100%",borderRadius:12}} alt="report"/>
        <button style={{width:"100%",marginTop:8,padding:10,background:"rgba(255,255,255,0.15)",border:"none",borderRadius:10,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:F}} onClick={()=>setViewPhoto(null)}>✕ Đóng</button>
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
        return <div key={r.id} style={{background:C.white,borderRadius:14,padding:14,marginBottom:8,boxShadow:C.shadowSm,borderLeft:`3px solid ${STATUS_COLORS[r.status]}`,animation:"fadeUp 0.2s ease"}}>
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

          {/* Photo evidence */}
          {r.photo&&<img src={r.photo} style={{maxHeight:100,borderRadius:10,marginBottom:8,cursor:"pointer",border:`1px solid ${C.border}`}} alt="evidence" onClick={()=>setViewPhoto(r.photo)}/>}

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
