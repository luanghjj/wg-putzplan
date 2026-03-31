import { useRef, useState } from "react";
import { F, C } from "../styles";
import { compImg } from "../utils/helpers";

export default function PhotoCapture({t,onCap,photo}){
  const videoRef=useRef();
  const canvasRef=useRef();
  const streamRef=useRef();
  const[camera,setCamera]=useState(false);

  const openCam=async()=>{
    try{
      const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:false});
      streamRef.current=stream;
      setCamera(true);
      setTimeout(()=>{if(videoRef.current){videoRef.current.srcObject=stream;videoRef.current.play();}},100);
    }catch{
      // Fallback: if camera API fails, use file input with capture
      const inp=document.createElement("input");
      inp.type="file";inp.accept="image/*";inp.capture="environment";
      inp.onchange=async(e)=>{const f=e.target.files?.[0];if(f)onCap(await compImg(f,400,.5));};
      inp.click();
    }
  };

  const snap=async()=>{
    const v=videoRef.current,c=canvasRef.current;
    if(!v||!c)return;
    c.width=v.videoWidth;c.height=v.videoHeight;
    c.getContext("2d").drawImage(v,0,0);
    const dataUrl=c.toDataURL("image/jpeg",0.5);
    // Compress
    const blob=await(await fetch(dataUrl)).blob();
    const file=new File([blob],"photo.jpg",{type:"image/jpeg"});
    const compressed=await compImg(file,400,0.5);
    onCap(compressed);
    closeCam();
  };

  const closeCam=()=>{
    if(streamRef.current)streamRef.current.getTracks().forEach(t=>t.stop());
    streamRef.current=null;
    setCamera(false);
  };

  return <div style={{marginTop:6,marginLeft:32}}>
    {photo?<div style={{position:"relative",display:"inline-block"}}><img src={photo} style={{height:60,borderRadius:8}} alt="p"/><button style={{position:"absolute",top:-4,right:-4,background:"rgba(0,0,0,.6)",color:"#fff",border:"none",borderRadius:"50%",width:20,height:20,fontSize:12,cursor:"pointer",lineHeight:"20px"}} onClick={()=>onCap(null)}>×</button></div>
    :camera?<div style={{position:"relative",borderRadius:10,overflow:"hidden",background:"#000"}}>
      <video ref={videoRef} style={{width:"100%",borderRadius:10}} playsInline muted/>
      <canvas ref={canvasRef} style={{display:"none"}}/>
      <div style={{display:"flex",gap:8,padding:8,justifyContent:"center"}}>
        <button style={{padding:"8px 20px",background:"#3B82F6",color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:F}} onClick={snap}>📸 Chụp</button>
        <button style={{padding:"8px 14px",background:"rgba(0,0,0,0.3)",color:"#fff",border:"none",borderRadius:10,fontSize:13,cursor:"pointer",fontFamily:F}} onClick={closeCam}>✕</button>
      </div>
    </div>
    :<button style={{width:"calc(100% - 32px)",padding:8,background:"#EFF6FF",border:"2px dashed #93C5FD",borderRadius:10,color:"#3B82F6",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:F}} onClick={openCam}>📸 {t.takePhoto}</button>}
  </div>;
}
