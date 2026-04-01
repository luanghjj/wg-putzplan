export function gwk(d){const dt=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));dt.setUTCDate(dt.getUTCDate()+4-(dt.getUTCDay()||7));const y=new Date(Date.UTC(dt.getUTCFullYear(),0,1));return Math.ceil(((dt-y)/864e5+1)/7);}
export function grot(wk,rooms,areas){if(!rooms.length)return {};const r={};areas.forEach((a,i)=>{r[a.id]=rooms[(wk+i)%rooms.length]?.id});return r;}
export function fd(ts){return new Date(ts).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit",year:"numeric"});}
export function ft(ts){return new Date(ts).toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"});}
export function gmo(){return new Date().getMonth()+1;}
// Get today's date string in German timezone (Europe/Berlin) — format: "YYYY-MM-DD"
export function getToday(){
  const fmt=new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Berlin",year:"numeric",month:"2-digit",day:"2-digit"});
  return fmt.format(new Date());
}
export function compImg(file,mw=400,q=0.5){return new Promise(res=>{const r=new FileReader();r.onload=e=>{const img=new Image();img.onload=()=>{const c=document.createElement("canvas");const rt=Math.min(mw/img.width,mw/img.height,1);c.width=img.width*rt;c.height=img.height*rt;c.getContext("2d").drawImage(img,0,0,c.width,c.height);res(c.toDataURL("image/jpeg",q));};img.src=e.target.result;};r.readAsDataURL(file);});}

export function getDeadline(wk){
  const jan4=new Date(Date.UTC(new Date().getFullYear(),0,4));
  const d=new Date(jan4.getTime()+((wk-1)*7-(jan4.getUTCDay()-1))*864e5);
  d.setUTCDate(d.getUTCDate()+(7-d.getUTCDay()));
  d.setUTCHours(23,59,59);return d;
}
export function getTimeLeft(wk){
  const dl=getDeadline(wk),now=new Date(),diff=dl-now;
  if(diff<=0)return{overdue:true,hours:0,text:""};
  const h=Math.floor(diff/36e5),m=Math.floor((diff%36e5)/6e4);
  return{overdue:false,hours:h,text:`${h}h ${m}m`};
}
