import { useRef } from "react";
import { F } from "../styles";
import { compImg } from "../utils/helpers";

export default function PhotoCapture({t,onCap,photo}){
  const ref=useRef();
  const h=async e=>{const f=e.target.files?.[0];if(!f)return;onCap(await compImg(f,400,.5));};
  return <div style={{marginTop:6,marginLeft:32}}>
    {photo?<div style={{position:"relative",display:"inline-block"}}><img src={photo} style={{height:60,borderRadius:8}} alt="p"/><button style={{position:"absolute",top:-4,right:-4,background:"rgba(0,0,0,.6)",color:"#fff",border:"none",borderRadius:"50%",width:20,height:20,fontSize:12,cursor:"pointer",lineHeight:"20px"}} onClick={()=>onCap(null)}>×</button></div>
    :<button style={{width:"calc(100% - 32px)",padding:8,background:"#EFF6FF",border:"2px dashed #93C5FD",borderRadius:10,color:"#3B82F6",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:F}} onClick={()=>ref.current?.click()}>📸 {t.takePhoto}<input ref={ref} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={h}/></button>}
  </div>;
}
