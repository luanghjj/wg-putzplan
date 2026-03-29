import { F, btnG, ov, mod } from "../styles";

export default function TutorialPopup({t,lang,tut,onClose}){
  if(!tut)return null;
  const steps=tut.steps||[];
  return <div style={ov} onClick={onClose}><div style={{...mod,maxWidth:460,padding:0,maxHeight:"90vh",overflow:"auto"}} onClick={e=>e.stopPropagation()}>
    <div style={{padding:"20px 20px 12px",borderBottom:"1px solid #F1F5F9"}}>
      <h3 style={{margin:0,fontSize:18,fontFamily:F,color:"#1E293B"}}>📖 {lang==="de"?tut.taskDe:tut.taskVi}</h3>
      <p style={{margin:"4px 0 0",fontSize:13,color:"#94A3B8"}}>{lang==="de"?tut.taskVi:tut.taskDe}</p>
    </div>
    <div style={{padding:"12px 20px 20px"}}>
      {steps.map((s,i)=> <div key={i} style={{display:"flex",gap:12,marginBottom:16,paddingBottom:16,borderBottom:i<steps.length-1?"1px solid #F1F5F9":"none"}}>
        <div style={{width:28,height:28,borderRadius:"50%",background:"#3B82F6",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,fontFamily:F,flexShrink:0}}>{i+1}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:14,color:"#1E293B",fontWeight:500,marginBottom:4}}>{lang==="de"?s.textDe:s.textVi}</div>
          {s.textVi&&lang==="de"&&<div style={{fontSize:12,color:"#94A3B8",marginBottom:6}}>{s.textVi}</div>}
          {s.textDe&&lang==="vi"&&<div style={{fontSize:12,color:"#94A3B8",marginBottom:6}}>{s.textDe}</div>}
          {s.photo&&<img src={s.photo} style={{width:"100%",maxHeight:180,objectFit:"cover",borderRadius:8}} alt={`step ${i+1}`}/>}
        </div>
      </div>)}
      {tut.videoUrl&&<a href={tut.videoUrl} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:"#FEF2F2",borderRadius:10,textDecoration:"none",color:"#DC2626",fontSize:13,fontWeight:600}}>🎬 Video-Tutorial öffnen / Mở video hướng dẫn</a>}
      <button style={{...btnG,width:"100%",marginTop:12}} onClick={onClose}>{t.closeTutorial}</button>
    </div>
  </div></div>;
}
