import { useState } from "react";
import { F, C, inp, btnP, lbl } from "../styles";

export default function LoginScreen({t,st,sv,onLogin}){
  const[pin,setPin]=useState("");const[err,setErr]=useState("");const[shake,setShake]=useState(false);
  const RC={owner:C.purple,manager:C.orange,resident:C.accent};
  const RI={owner:"👑",manager:"🔧",resident:"👤"};

  const go=()=>{
    if(!pin.trim())return;
    const found=st.users.find(u=>u.password===pin);
    if(!found){setErr(st.lang==="de"?"Falscher PIN":"Sai PIN");setShake(true);setTimeout(()=>setShake(false),500);setPin("");return;}
    onLogin({...found});
  };

  return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,background:`linear-gradient(180deg, ${C.bg} 0%, #E8E8ED 100%)`}}>
    <style>{`
      @keyframes shakeX{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
      .shake{animation:shakeX 0.4s ease}
    `}</style>
    <div style={{
      background:"rgba(255,255,255,0.72)",
      backdropFilter:"blur(20px) saturate(180%)",
      WebkitBackdropFilter:"blur(20px) saturate(180%)",
      borderRadius:22,padding:"36px 28px",width:"100%",maxWidth:400,
      boxShadow:"0 8px 40px rgba(0,0,0,0.08)",
      border:`1px solid ${C.border}`,
    }}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{width:64,height:64,borderRadius:16,background:`linear-gradient(135deg,${C.accent},${C.purple})`,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:12}}>
          <span style={{fontSize:32}}>🏠</span>
        </div>
        <h1 style={{fontSize:22,fontWeight:700,color:C.text,margin:"8px 0 4px",fontFamily:F,letterSpacing:"-0.022em"}}>{t.appTitle}</h1>
        <p style={{fontSize:14,color:C.textSecondary,margin:0,letterSpacing:"-0.01em"}}>{t.appSub}</p>
      </div>

      <label style={{...lbl,textAlign:"center",marginBottom:10}}>🔑 PIN</label>
      <div className={shake?"shake":""}>
        <input type="password" style={{...inp,textAlign:"center",fontSize:28,letterSpacing:12,borderRadius:14,padding:"14px 16px",fontWeight:600}} value={pin} autoFocus placeholder="••••" onChange={e=>{setPin(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&go()}/>
      </div>
      {err&&<p style={{color:C.red,fontSize:13,marginTop:8,textAlign:"center",fontWeight:500}}>{err}</p>}
      <button style={{...btnP,width:"100%",marginTop:14,padding:"13px 20px",borderRadius:14,fontSize:16}} onClick={go}>{t.login}</button>

      <div style={{textAlign:"center",marginTop:20,paddingTop:16,borderTop:`1px solid ${C.border}`}}>
        <button style={{background:"none",border:"none",color:C.textSecondary,fontSize:13,cursor:"pointer",fontFamily:F,fontWeight:500}} onClick={()=>sv({...st,lang:st.lang==="de"?"vi":"de"})}>🌐 {st.lang==="de"?"Tiếng Việt":"Deutsch"}</button>
      </div>
    </div>
  </div>;
}
