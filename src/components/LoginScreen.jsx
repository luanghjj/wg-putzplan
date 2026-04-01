import { useState } from "react";
import { F, C, btnP } from "../styles";

export default function LoginScreen({t,st,sv,onLogin}){
  const[pin,setPin]=useState("");const[err,setErr]=useState("");const[shake,setShake]=useState(false);

  const go=()=>{
    if(!pin.trim())return;
    const found=st.users.find(u=>u.password===pin);
    if(!found){setErr(st.lang==="de"?"Falscher PIN":"Sai PIN");setShake(true);setTimeout(()=>setShake(false),500);setPin("");return;}
    onLogin({...found});
  };

  return <div style={{
    minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
    padding:24,
    background:`linear-gradient(180deg, #1C1C1E 0%, #2C2C2E 50%, #1C1C1E 100%)`,
  }}>
    <style>{`
      @keyframes shakeX{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
      .shake{animation:shakeX 0.35s cubic-bezier(0.25,0.1,0.25,1)}
      @keyframes floatIn{from{opacity:0;transform:translateY(30px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}
      @keyframes glowPulse{0%,100%{box-shadow:0 0 30px rgba(0,122,255,0.15)}50%{box-shadow:0 0 60px rgba(0,122,255,0.25)}}
      .pin-dot{width:14px;height:14px;border-radius:50%;border:2px solid rgba(255,255,255,0.2);transition:all .2s;background:transparent}
      .pin-dot.filled{background:#007AFF;border-color:#007AFF;box-shadow:0 0 10px rgba(0,122,255,0.4)}
    `}</style>

    <div style={{
      width:"100%",maxWidth:360,textAlign:"center",
      animation:"floatIn 0.6s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      {/* Logo */}
      <div style={{
        width:80,height:80,borderRadius:24,margin:"0 auto 24px",
        background:"linear-gradient(135deg, #007AFF, #5856D6)",
        display:"flex",alignItems:"center",justifyContent:"center",
        boxShadow:"0 8px 30px rgba(0,122,255,0.3)",
        animation:"glowPulse 3s ease-in-out infinite",
      }}>
        <span style={{fontSize:36}}>🏠</span>
      </div>

      <h1 style={{fontSize:32,fontWeight:800,color:"#fff",margin:"0 0 8px",fontFamily:F,letterSpacing:"-0.03em"}}>{t.appTitle}</h1>
      <p style={{fontSize:17,color:"rgba(255,255,255,0.5)",margin:"0 0 40px",lineHeight:1.5}}>{t.appSub}</p>

      {/* PIN dots indicator */}
      <div style={{display:"flex",justifyContent:"center",gap:12,marginBottom:24}}>
        {[0,1,2,3].map(i=><div key={i} className={`pin-dot ${pin.length>i?"filled":""}`}/>)}
      </div>

      {/* Hidden input */}
      <div className={shake?"shake":""}>
        <input type="password" inputMode="numeric" pattern="[0-9]*" style={{
          width:"100%",textAlign:"center",fontSize:32,letterSpacing:16,
          fontWeight:700,padding:"16px",borderRadius:16,border:"none",
          background:"rgba(255,255,255,0.06)",color:"#fff",
          outline:"none",boxSizing:"border-box",fontFamily:F,
          caretColor:C.accent,
        }} value={pin} autoFocus placeholder="" maxLength={8}
        onChange={e=>{setPin(e.target.value);setErr("");}}
        onKeyDown={e=>e.key==="Enter"&&go()}/>
      </div>

      {err&&<p style={{color:C.red,fontSize:15,marginTop:12,fontWeight:600}}>{err}</p>}

      {/* CTA */}
      <button style={{
        ...btnP,width:"100%",marginTop:20,padding:"16px",fontSize:17,
        background:"linear-gradient(135deg, #007AFF, #5856D6)",
        boxShadow:"0 4px 20px rgba(0,122,255,0.3)",
      }} onClick={go}>{t.login}</button>
    </div>
  </div>;
}
