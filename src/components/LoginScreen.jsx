import { useState } from "react";
import { F, C, inp, btnP, lbl } from "../styles";

export default function LoginScreen({t,st,sv,onLogin}){
  const[pin,setPin]=useState("");const[err,setErr]=useState("");const[shake,setShake]=useState(false);

  const go=()=>{
    if(!pin.trim())return;
    const found=st.users.find(u=>u.password===pin);
    if(!found){setErr(st.lang==="de"?"Falscher PIN":"Sai PIN");setShake(true);setTimeout(()=>setShake(false),500);setPin("");return;}
    onLogin({...found});
  };

  return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24,background:C.bg}}>
    <style>{`
      @keyframes shakeX{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
      .shake{animation:shakeX 0.3s cubic-bezier(0.25,0.1,0.25,1)}
    `}</style>
    <div style={{
      background:C.white,
      borderRadius:18,padding:"40px 32px",width:"100%",maxWidth:380,
      boxShadow:"0 2px 20px rgba(0,0,0,0.04)",
      /* Apple: KHÔNG border rõ, KHÔNG shadow nặng */
    }}>
      {/* Logo */}
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{fontSize:48,marginBottom:16}}>🏠</div>
        <h1 style={{fontSize:28,fontWeight:700,color:C.text,margin:"0 0 8px",fontFamily:F,letterSpacing:"-0.02em",lineHeight:1.1}}>{t.appTitle}</h1>
        <p style={{fontSize:17,color:C.textSecondary,margin:0,lineHeight:1.5}}>{t.appSub}</p>
      </div>

      {/* PIN input */}
      <div style={{marginBottom:20}}>
        <label style={{...lbl,textAlign:"center",marginBottom:8}}>PIN</label>
        <div className={shake?"shake":""}>
          <input type="password" style={{
            ...inp,textAlign:"center",fontSize:28,letterSpacing:12,
            borderRadius:12,padding:"16px",fontWeight:600,
            background:C.bg,border:"none",
          }} value={pin} autoFocus placeholder="••••" onChange={e=>{setPin(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&go()}/>
        </div>
        {err&&<p style={{color:C.red,fontSize:14,marginTop:8,textAlign:"center",fontWeight:400}}>{err}</p>}
      </div>

      {/* CTA — pill shape */}
      <button style={{...btnP,width:"100%",padding:"14px 22px",fontSize:17}} onClick={go}>{t.login}</button>
    </div>
  </div>;
}
