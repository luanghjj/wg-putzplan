export function gwk(d){const dt=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));dt.setUTCDate(dt.getUTCDate()+4-(dt.getUTCDay()||7));const y=new Date(Date.UTC(dt.getUTCFullYear(),0,1));return String(Math.ceil(((dt-y)/864e5+1)/7));}
export function grot(wk,rooms,areas){if(!rooms.length)return {};const w=Number(wk);const r={};areas.forEach((a,i)=>{r[a.id]=rooms[(w+i)%rooms.length]?.id});return r;}
export function fd(ts){return new Date(ts).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit",year:"numeric"});}
export function ft(ts){return new Date(ts).toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"});}
export function gmo(){return String(new Date().getMonth()+1);}
// Get today's date string in German timezone (Europe/Berlin) — format: "YYYY-MM-DD"
export function getToday(){
  const fmt=new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Berlin",year:"numeric",month:"2-digit",day:"2-digit"});
  return fmt.format(new Date());
}
export function compImg(file,mw=400,q=0.5){return new Promise(res=>{const r=new FileReader();r.onload=e=>{const img=new Image();img.onload=()=>{const c=document.createElement("canvas");const rt=Math.min(mw/img.width,mw/img.height,1);c.width=img.width*rt;c.height=img.height*rt;c.getContext("2d").drawImage(img,0,0,c.width,c.height);res(c.toDataURL("image/jpeg",q));};img.src=e.target.result;};r.readAsDataURL(file);});}

export function getDeadline(wk){
  const w=Number(wk);
  // ISO week date: find the Thursday of the target week, then get Sunday
  // Jan 4 is always in ISO week 1
  const jan4=new Date(Date.UTC(new Date().getFullYear(),0,4));
  const jan4Day=jan4.getUTCDay()||7; // Mon=1..Sun=7
  // Monday of week 1
  const mon1=new Date(jan4);
  mon1.setUTCDate(mon1.getUTCDate()-(jan4Day-1));
  // Monday of target week
  const monW=new Date(mon1);
  monW.setUTCDate(monW.getUTCDate()+(w-1)*7);
  // Sunday of target week = Monday + 6
  const sun=new Date(monW);
  sun.setUTCDate(sun.getUTCDate()+6);
  sun.setUTCHours(23,59,59);
  return sun;
}
export function getTimeLeft(wk){
  const dl=getDeadline(wk),now=new Date(),diff=dl-now;
  if(diff<=0)return{overdue:true,hours:0,text:""};
  const h=Math.floor(diff/36e5),m=Math.floor((diff%36e5)/6e4);
  return{overdue:false,hours:h,text:`${h}h ${m}m`};
}

// Get Monday-Sunday date range for a given ISO week
export function getWeekRange(wk){
  const sun=getDeadline(wk); // Sunday 23:59:59
  const mon=new Date(sun);
  mon.setUTCDate(mon.getUTCDate()-6); // Monday = Sunday - 6
  const fmt=(d)=>`${String(d.getUTCDate()).padStart(2,"0")}.${String(d.getUTCMonth()+1).padStart(2,"0")}`;
  return{
    mon,sun,
    range:`${fmt(mon)} – ${fmt(sun)}`
  };
}

// Format deadline with full date
export function getDeadlineStr(wk,lang){
  const dl=getDeadline(wk);
  const dayNames={de:["So","Mo","Di","Mi","Do","Fr","Sa"],vi:["CN","T2","T3","T4","T5","T6","T7"]};
  const dn=dayNames[lang||"de"][dl.getUTCDay()];
  const dd=String(dl.getUTCDate()).padStart(2,"0");
  const mm=String(dl.getUTCMonth()+1).padStart(2,"0");
  return `${dn}, ${dd}.${mm} · 23:59`;
}
