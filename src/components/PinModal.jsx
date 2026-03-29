import { useState } from "react";
import { F, inp, btnG, btnP, ov, mod } from "../styles";

export default function PinModal({t,st,pm,set}){
  const[pin,setPin]=useState("");const[err,setErr]=useState("");
  const go=()=>{if(pin===st.masterPin){pm.resolve(true);set(null);}else{setErr(t.wrongPin);setPin("");}};
  return <div style={ov} onClick={()=>{pm.resolve(false);set(null);}}>
    <div style={mod} onClick={e=>e.stopPropagation()}>
      <div style={{textAlign:"center",marginBottom:16}}><span style={{fontSize:36}}>🔐</span><h3 style={{margin:"8px 0 4px",fontFamily:F,fontSize:18,color:"#1E293B"}}>{t.criticalAction}</h3><p style={{margin:0,fontSize:13,color:"#64748B"}}>{t.pinRequired}</p></div>
      <input type="password" style={inp} placeholder="PIN" value={pin} autoFocus onChange={e=>{setPin(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&go()}/>
      {err&&<p style={{color:"#EF4444",fontSize:13,marginTop:6}}>{err}</p>}
      <div style={{display:"flex",gap:8,marginTop:12}}><button style={{...btnG,flex:1}} onClick={()=>{pm.resolve(false);set(null);}}>{t.cancel}</button><button style={{...btnP,flex:1}} onClick={go}>OK</button></div>
    </div>
  </div>;
}
