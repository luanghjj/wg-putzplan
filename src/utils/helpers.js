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
// iPhone photos are often HEIC/HEIF, which browsers can't draw to a <canvas>.
// Detect by MIME type or extension (iOS sometimes reports an empty type).
function isHeic(file){
  const type=(file.type||"").toLowerCase();
  if(type==="image/heic"||type==="image/heif")return true;
  const name=(file.name||"").toLowerCase();
  return name.endsWith(".heic")||name.endsWith(".heif");
}

// Convert a HEIC/HEIF file to a JPEG blob. heic2any is loaded lazily so it
// only adds to the bundle download when an iPhone user actually picks a HEIC.
async function heicToJpeg(file){
  const { default: heic2any }=await import("heic2any");
  const out=await heic2any({ blob:file, toType:"image/jpeg", quality:0.8 });
  const blob=Array.isArray(out)?out[0]:out;
  return new File([blob],(file.name||"photo").replace(/\.[^.]+$/,"")+".jpg",{type:"image/jpeg"});
}

export async function compImg(file,mw=400,q=0.5){
  // HEIC can't be decoded by <img>; convert to JPEG first.
  if(isHeic(file)){
    try{ file=await heicToJpeg(file); }
    catch(err){ throw new Error("HEIC conversion failed: "+(err?.message||err)); }
  }
  return new Promise((res,rej)=>{
    // Safety net: if an image still never decodes, neither onload nor onerror
    // may fire on some browsers — reject after a timeout so callers don't hang.
    const timer=setTimeout(()=>rej(new Error("compImg timeout")),15000);
    const done=v=>{clearTimeout(timer);res(v);};
    const fail=e=>{clearTimeout(timer);rej(e instanceof Error?e:new Error("compImg failed"));};
    const r=new FileReader();
    r.onerror=()=>fail(new Error("FileReader error"));
    r.onload=e=>{
      const img=new Image();
      img.onerror=()=>fail(new Error("Image decode error"));
      img.onload=()=>{
        try{
          const c=document.createElement("canvas");
          const rt=Math.min(mw/img.width,mw/img.height,1);
          c.width=img.width*rt;c.height=img.height*rt;
          c.getContext("2d").drawImage(img,0,0,c.width,c.height);
          done(c.toDataURL("image/jpeg",q));
        }catch(err){fail(err);}
      };
      img.src=e.target.result;
    };
    r.readAsDataURL(file);
  });
}

export function getDeadline(wk){
  const w=Number(wk);
  // Use ISO week year based on today — handles week 52/53 spanning year boundary
  const now=new Date();
  // Find the ISO year: if current week > w by a lot, we might be in the next year's week 1
  // Simple: use the year that makes the week closest to now
  const tryYear=(y)=>{
    const jan4=new Date(Date.UTC(y,0,4));
    const jan4Day=jan4.getUTCDay()||7;
    const mon1=new Date(jan4);
    mon1.setUTCDate(mon1.getUTCDate()-(jan4Day-1));
    const monW=new Date(mon1);
    monW.setUTCDate(monW.getUTCDate()+(w-1)*7);
    const sun=new Date(monW);
    sun.setUTCDate(sun.getUTCDate()+6);
    sun.setUTCHours(23,59,59);
    return sun;
  };
  const y=now.getFullYear();
  // Pick the year whose deadline is closest to today (handles year-end edge cases)
  const d0=tryYear(y-1),d1=tryYear(y),d2=tryYear(y+1);
  const best=[d0,d1,d2].reduce((a,b)=>Math.abs(b-now)<Math.abs(a-now)?b:a);
  return best;
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
