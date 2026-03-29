import { useState, useEffect, useRef } from "react";
import { T } from "./data/i18n";
import { OWNER, DEF } from "./data/constants";
import { storage, SK, onDataChange } from "./data/storage";
import { gwk, grot, fd, ft, gmo, getTimeLeft } from "./utils/helpers";
import { F, C, btnG, ov, mod, globalCSS } from "./styles";

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

import PinModal from "./components/PinModal";
import TutorialPopup from "./components/TutorialPopup";
import LoginScreen from "./components/LoginScreen";
import NavBar from "./components/NavBar";
import PlanScreen from "./components/PlanScreen";
import LeaderScreen from "./components/LeaderScreen";
import RulesScreen from "./components/RulesScreen";
import HistoryScreen from "./components/HistoryScreen";
import AdminScreen from "./components/AdminScreen";
import ReportScreen from "./components/ReportScreen";
import { AnnouncementModal } from "./components/Announcement";

export default function App(){
  const[st,setSt]=useState(null);
  const[ph,setPh]=useState({});
  const[rp,setRp]=useState({});
  const[user,setUser]=useState(null);
  const[scr,setScr]=useState("login");
  const[ld,setLd]=useState(true);
  const[toast,setToast]=useState(null);
  const[pinM,setPinM]=useState(null);
  const[phView,setPhView]=useState(null);
  const[tutView,setTutView]=useState(null);
  const skipSync = useRef(false);

  useEffect(()=>{(async()=>{try{
    const[r,p,rr]=await Promise.all([storage.get(SK.data).catch(()=>null),storage.get(SK.photos).catch(()=>null),storage.get(SK.refPhotos).catch(()=>null)]);
    if(r?.value){
      const d=JSON.parse(r.value);
      if(!d.users?.some(u=>u.id==="owner-1"))d.users=[{...OWNER},...(d.users||[])];
      // Migrate old refPhotos from wg4 to wg4r
      if(d.refPhotos && Object.keys(d.refPhotos).length>0 && (!rr?.value || rr.value==="{}")){
        await storage.set(SK.refPhotos,JSON.stringify(d.refPhotos));
        setRp(d.refPhotos);
      }
      // Strip refPhotos from main state to keep it small
      const {refPhotos:_,...clean}=d;
      setSt({...DEF,...clean});
    }else setSt({...DEF});
    if(p?.value)setPh(JSON.parse(p.value));
    if(rr?.value){const rpData=JSON.parse(rr.value);if(Object.keys(rpData).length>0)setRp(rpData);}
  }catch{setSt({...DEF});}setLd(false);})();},[]);

  useEffect(()=>{
    const unsub1 = onDataChange(SK.data, (val)=>{
      if(skipSync.current){skipSync.current=false;return;}
      const d={...DEF,...val};
      if(!d.users?.some(u=>u.id==="owner-1"))d.users=[{...OWNER},...(d.users||[])];
      setSt(d);
    });
    const unsub2 = onDataChange(SK.photos, (val)=>{
      if(skipSync.current)return;
      setPh(val||{});
    });
    const unsub3 = onDataChange(SK.refPhotos, (val)=>{
      if(skipSync.current)return;
      setRp(val||{});
    });
    return ()=>{unsub1();unsub2();unsub3();};
  },[]);

  const sv=async ns=>{const{refPhotos:_,...clean}=ns;setSt(clean);try{await storage.set(SK.data,JSON.stringify(clean));}catch{}};
  const sp=async np=>{setPh(np);try{await storage.set(SK.photos,JSON.stringify(np));}catch{}};
  const show=(m,ty="success")=>{setToast({m,ty});setTimeout(()=>setToast(null),2500);};
  const hp=p=>{if(!user)return false;if(user.role==="owner")return true;return(st.rolePerms?.[user.role]||[]).includes(p);};
  const rpin=()=>new Promise(r=>setPinM({resolve:r}));
  const t=st?T[st.lang||"de"]:T.de;

  const doDone=async(tk,ai,photo)=>{
    if(!user)return;const now=Date.now(),wk=gwk(new Date());
    const all=[...st.dailyTasks,...st.weeklyAreas.flatMap(a=>a.tasks)];
    const pts=all.find(x=>x.de===tk)?.pts||1;
    const e={taskKey:tk,areaId:ai||"daily",person:user.name,room:user.room,timestamp:now,week:wk,month:gmo(),pts};
    await sv({...st,completions:[...st.completions,e]});
    if(photo)await sp({...ph,[`${wk}-${ai}-${tk}`]:photo});
    show(st.lang==="de"?`✓ +${pts} Punkte!`:`✓ +${pts} Điểm!`);
    if(st.sheetsUrl){try{await fetch(st.sheetsUrl,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({person:user.name,room:user.room,task:tk,area:ai||"daily",date:fd(now),time:ft(now),week:wk,points:pts})});}catch{}}
  };
  const doUndo=async(tk,ai,wk)=>{
    await sv({...st,completions:st.completions.filter(c=>!(c.taskKey===tk&&(c.areaId||"daily")===(ai||"daily")&&c.week===wk))});
    const np={...ph};delete np[`${wk}-${ai}-${tk}`];await sp(np);
  };
  const isC=(tk,ai,wk)=>st.completions.find(c=>c.taskKey===tk&&(c.areaId||"daily")===(ai||"daily")&&c.week===wk);

  // v4.3: Verify/Reject
  const doVerify=async(tk,ai,wk,by)=>{
    const key=`${wk}-${ai}-${tk}`;
    await sv({...st,verifications:{...(st.verifications||{}),[key]:{status:"verified",by,at:Date.now()}}});
    show(st.lang==="de"?"✓ Bestätigt!":"✓ Đã xác nhận!");
  };
  const doReject=async(tk,ai,wk,by,reason)=>{
    const key=`${wk}-${ai}-${tk}`;
    const ns={...st,
      completions:st.completions.filter(c=>!(c.taskKey===tk&&(c.areaId||"daily")===(ai||"daily")&&c.week===wk)),
      verifications:{...(st.verifications||{}),[key]:{status:"rejected",by,reason,at:Date.now()}}
    };
    await sv(ns);
    show(st.lang==="de"?"✗ Abgelehnt — bitte nochmal erledigen":"✗ Từ chối — vui lòng làm lại","error");
  };
  const getVerif=(tk,ai,wk)=>(st.verifications||{})[`${wk}-${ai}-${tk}`];

  if(ld||!st) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}><div style={{width:36,height:36,border:"3px solid #E2E8F0",borderTopColor:"#3B82F6",borderRadius:"50%",animation:"spin .8s linear infinite"}}/></div>;

  return(
    <div style={{fontFamily:F,minHeight:"100vh",background:C.bg,maxWidth:520,margin:"0 auto",position:"relative"}}>
      <style>{globalCSS}</style>
      {toast&&<div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",color:"#fff",padding:"12px 24px",borderRadius:14,fontSize:14,fontWeight:600,zIndex:1000,boxShadow:C.shadowMd,fontFamily:F,animation:"fadeUp .25s cubic-bezier(0.34,1.56,0.64,1)",background:toast.ty==="success"?C.green:C.red,letterSpacing:"-0.01em"}}>{toast.m}</div>}
      {pinM&&<PinModal t={t} st={st} pm={pinM} set={setPinM}/>}
      {phView&&<div style={ov} onClick={()=>setPhView(null)}><div style={{...mod,maxWidth:420,padding:8}} onClick={e=>e.stopPropagation()}><img src={phView} style={{width:"100%",borderRadius:12}} alt="proof"/><button style={{...btnG,width:"100%",marginTop:8}} onClick={()=>setPhView(null)}>{t.closePhoto}</button></div></div>}
      {tutView&&<TutorialPopup t={t} lang={st.lang} tut={tutView} onClose={()=>setTutView(null)}/>}
      {scr==="login"?<LoginScreen t={t} st={st} sv={sv} onLogin={u=>{
        setUser(u);setScr("plan");
        // Request notification permission & start deadline check
        if('Notification' in window && Notification.permission==='default'){Notification.requestPermission();}
        const checkDeadline=()=>{
          if(!st)return;const wk=gwk(new Date()),tl=getTimeLeft(wk);
          let open=0;st.weeklyAreas.forEach(a=>a.tasks.forEach(ta=>{if(!st.completions.find(c=>c.taskKey===ta.de&&c.areaId===a.id&&c.week===wk))open++;}));
          if(navigator.serviceWorker?.controller){navigator.serviceWorker.controller.postMessage({type:'DEADLINE_CHECK',hoursLeft:tl.hours,tasksOpen:open,lang:st.lang});}
        };
        checkDeadline();setInterval(checkDeadline,3600000);
      }}/>:
        <div style={{padding:"14px 14px 32px",maxWidth:520,margin:"0 auto"}}>
          <NavBar t={t} scr={scr} set={setScr} user={user} hp={hp} st={st} isC={isC} onLogout={()=>{setUser(null);setScr("login")}}/>
          {scr==="plan"&&<PlanScreen t={t} st={{...st,refPhotos:rp}} user={user} hp={hp} doDone={doDone} doUndo={doUndo} isC={isC} ph={ph} vp={setPhView} openTut={setTutView} doVerify={doVerify} doReject={doReject} getVerif={getVerif}/>}
          {scr==="leaderboard"&&<LeaderScreen t={t} st={st} user={user}/>}
          {scr==="rules"&&<RulesScreen t={t}/>}
          {scr==="history"&&<HistoryScreen t={t} st={st} hp={hp} ph={ph} vp={setPhView}/>}
          {scr==="reports"&&<ReportScreen t={t} st={st} sv={sv} user={user} show={show}/>}
      {scr==="admin"&&<AdminScreen t={t} st={{...st,refPhotos:rp}} sv={sv} hp={hp} rpin={rpin} show={show} user={user} srp={async(v)=>{setRp(v);skipSync.current=true;await storage.set(SK.refPhotos,JSON.stringify(v));}}/>}
        </div>}
      {/* Announcement modal — shows after login for unread messages */}
      {user&&scr!=="login"&&<AnnouncementModal announcements={st.announcements||[]} user={user} st={st} onDismiss={(id)=>{
        const updated=(st.announcements||[]).map(a=>a.id===id?{...a,readBy:[...(a.readBy||[]),user.name]}:a);
        sv({...st,announcements:updated});
      }}/>}
    </div>
  );
}
