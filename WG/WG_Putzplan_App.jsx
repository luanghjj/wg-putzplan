import { useState, useEffect, useRef } from "react";

/* i18n */
const T = {
  de: {
    appTitle:"WG Putzplan", appSub:"Hausordnung & Wochenplan",
    login:"Anmelden", logout:"Abmelden", password:"Passwort", wrongPw:"Falsches Passwort",
    admin:"Verwaltung", plan:"Putzplan", rules:"Hausordnung", history:"Verlauf",
    rooms:"Zimmer", addRoom:"Zimmer hinzufügen", roomName:"Zimmername",
    addResident:"Bewohner hinzufügen", residentName:"Name", save:"Speichern",
    delete:"Löschen", cancel:"Abbrechen",
    daily:"Tägliche Aufgaben", dailySub:"Jeder für sich",
    weekly:"Wöchentliche Aufgaben", weeklySub:"Rotation",
    kitchen:"Küche", bathroom:"Bad / WC", common:"Gemeinschaftsbereiche",
    responsible:"Zuständig", allDone:"Alles erledigt! 🎉",
    noHistory:"Noch keine Einträge",
    sheetsUrl:"Google Sheets Webhook URL", sheetsHelp:"Apps Script Web App URL",
    sheetsConn:"Verbunden", sheetsNo:"Nicht verbunden",
    selectPerson:"Person auswählen", thisWeek:"Diese Woche",
    exportCsv:"CSV Export", kwNum:"KW", rulesTitle:"WG-Hausordnung",
    owner:"Inhaber", manager:"Verwalter", resident:"Bewohner",
    permissions:"Berechtigungen", roleManagement:"Rollenverwaltung",
    masterPin:"Master-PIN", wrongPin:"Falsche PIN", changePin:"PIN ändern",
    newPin:"Neue PIN", criticalAction:"Geschützte Aktion", pinRequired:"Master-PIN erforderlich",
    perm_manage_rooms:"Zimmer verwalten", perm_manage_residents:"Bewohner verwalten",
    perm_manage_roles:"Rollen zuweisen", perm_edit_rules:"Hausordnung bearbeiten",
    perm_config_sheets:"Google Sheets konfig.", perm_edit_tasks:"Aufgaben anpassen",
    perm_check_own_area:"Eigenen Bereich abhaken", perm_check_all:"Alle Bereiche abhaken",
    perm_view_history:"Verlauf einsehen", perm_export_data:"Daten exportieren",
    perm_reset_week:"Woche zurücksetzen",
    points:"Punkte", leaderboard:"Rangliste",
    monthlyPts:"Diesen Monat", strafkasse:"Strafkasse",
    penaltyPerTask:"€ pro verpasste Aufgabe", owes:"schuldet",
    monthlyWinner:"Monatsgewinner 🏆",
    rewardText:"Belohnungstext", defaultReward:"Wird von den anderen bekocht! 🍳",
    takePhoto:"Foto aufnehmen 📸", noPhoto:"Bitte Foto aufnehmen",
    closePhoto:"Schließen", refPhoto:"Referenzfoto", uploadRef:"Standard-Foto hochladen",
    customTasks:"Aufgaben verwalten", addTask:"Aufgabe hinzufügen",
    taskNameDe:"Aufgabe (DE)", taskNameVi:"Aufgabe (VI)",
    dailyTasks:"Tägliche Aufgaben", weeklyTasks:"Wöchentliche Aufgaben", bonus:"Bonus",
    showRef:"Vorgabe 📷", hideRef:"Ausblenden", noRef:"Kein Vorgabe-Foto",
    tutorial:"Anleitung", tutorialShort:"📖 Anleitung", steps:"Schritte",
    step:"Schritt", addStep:"Schritt hinzufügen", stepText:"Beschreibung (DE)",
    stepTextVi:"Beschreibung (VI)", stepPhoto:"Foto für Schritt",
    videoUrl:"Video-Link (optional)", openTutorial:"Alle Schritte anzeigen",
    closeTutorial:"Schließen", noTutorial:"Keine Anleitung hinterlegt",
    editTutorial:"Anleitung bearbeiten", deleteTutorial:"Anleitung löschen",
    deadline:"Deadline", deadlineDay:"Sonntag 23:59", timeLeft:"Noch",
    hours:"Std", overdue:"Überfällig!", missed:"Verpasst",
    openTasks:"offene Aufgaben", statusReport:"Wochenbericht",
    completed:"Erledigt", notCompleted:"Nicht erledigt",
    verify:"Bestätigen ✓", reject:"Ablehnen ✗", verified:"Bestätigt",
    rejected:"Abgelehnt", rejectedBy:"Abgelehnt von", verifiedBy:"Bestätigt von",
    rejectReason:"Grund der Ablehnung", redoTask:"Bitte nochmal erledigen",
    weekSummary:"Wochenzusammenfassung", allCompleted:"Alle Aufgaben erledigt",
    missedTasks:"Verpasste Aufgaben", penaltyTotal:"Strafe gesamt",
    // Fairness system
    fairness:"Fairness-Check", minPoints:"Mindestpunkte/Woche",
    minPointsAuto:"Auto-Vorschlag", minPointsManual:"Manuell",
    maxDiff:"Max. Differenz im Zimmer", perPersonCheck:"Pro Person",
    belowMin:"Unter Mindestpunktzahl!", diffTooHigh:"Zu große Differenz!",
    penaltyPerPoint:"€ pro fehlendem Punkt", makeupTasks:"Nachholpflicht",
    makeupInfo:"Fehlende Punkte nächste Woche zusätzlich",
    fairOk:"Fair verteilt ✓", unfair:"Ungleich verteilt ⚠️",
    personPoints:"Punkte pro Person", roomBalance:"Zimmer-Balance",
    reached:"Erreicht", notReached:"Nicht erreicht",
  },
  vi: {
    appTitle:"Lịch dọn WG", appSub:"Nội quy & Kế hoạch tuần",
    login:"Đăng nhập", logout:"Đăng xuất", password:"Mật khẩu", wrongPw:"Sai mật khẩu",
    admin:"Quản lý", plan:"Lịch dọn", rules:"Nội quy", history:"Lịch sử",
    rooms:"Phòng", addRoom:"Thêm phòng", roomName:"Tên phòng",
    addResident:"Thêm cư dân", residentName:"Tên", save:"Lưu",
    delete:"Xóa", cancel:"Hủy",
    daily:"Nhiệm vụ hàng ngày", dailySub:"Mỗi người tự làm",
    weekly:"Nhiệm vụ hàng tuần", weeklySub:"Luân phiên",
    kitchen:"Nhà bếp", bathroom:"Phòng tắm / WC", common:"Khu vực chung",
    responsible:"Phụ trách", allDone:"Hoàn thành tất cả! 🎉",
    noHistory:"Chưa có dữ liệu",
    sheetsUrl:"Google Sheets Webhook URL", sheetsHelp:"URL Apps Script",
    sheetsConn:"Đã kết nối", sheetsNo:"Chưa kết nối",
    selectPerson:"Chọn người", thisWeek:"Tuần này",
    exportCsv:"Xuất CSV", kwNum:"Tuần", rulesTitle:"Nội quy WG",
    owner:"Chủ sở hữu", manager:"Quản lý", resident:"Cư dân",
    permissions:"Quyền hạn", roleManagement:"Quản lý vai trò",
    masterPin:"Mã PIN", wrongPin:"Sai PIN", changePin:"Đổi PIN",
    newPin:"PIN mới", criticalAction:"Hành động bảo vệ", pinRequired:"Cần mã PIN",
    perm_manage_rooms:"Quản lý phòng", perm_manage_residents:"Quản lý cư dân",
    perm_manage_roles:"Phân vai trò", perm_edit_rules:"Sửa nội quy",
    perm_config_sheets:"Cấu hình Sheets", perm_edit_tasks:"Tùy chỉnh nhiệm vụ",
    perm_check_own_area:"Đánh dấu khu vực mình", perm_check_all:"Đánh dấu tất cả",
    perm_view_history:"Xem lịch sử", perm_export_data:"Xuất dữ liệu",
    perm_reset_week:"Reset tuần",
    points:"Điểm", leaderboard:"Bảng xếp hạng",
    monthlyPts:"Tháng này", strafkasse:"Quỹ phạt",
    penaltyPerTask:"€ mỗi nhiệm vụ bỏ lỡ", owes:"nợ",
    monthlyWinner:"Người thắng tháng 🏆",
    rewardText:"Nội dung thưởng", defaultReward:"Được nấu ăn cho! 🍳",
    takePhoto:"Chụp ảnh 📸", noPhoto:"Vui lòng chụp ảnh",
    closePhoto:"Đóng", refPhoto:"Ảnh tham chiếu", uploadRef:"Tải ảnh tiêu chuẩn",
    customTasks:"Quản lý nhiệm vụ", addTask:"Thêm nhiệm vụ",
    taskNameDe:"Nhiệm vụ (DE)", taskNameVi:"Nhiệm vụ (VI)",
    dailyTasks:"Nhiệm vụ hàng ngày", weeklyTasks:"Nhiệm vụ hàng tuần", bonus:"Bonus",
    showRef:"Vorgabe 📷", hideRef:"Ẩn", noRef:"Chưa có ảnh tham chiếu",
    tutorial:"Hướng dẫn", tutorialShort:"📖 Hướng dẫn", steps:"Các bước",
    step:"Bước", addStep:"Thêm bước", stepText:"Mô tả (DE)",
    stepTextVi:"Mô tả (VI)", stepPhoto:"Ảnh cho bước",
    videoUrl:"Link video (tùy chọn)", openTutorial:"Xem tất cả các bước",
    closeTutorial:"Đóng", noTutorial:"Chưa có hướng dẫn",
    editTutorial:"Sửa hướng dẫn", deleteTutorial:"Xóa hướng dẫn",
    deadline:"Hạn chót", deadlineDay:"Chủ nhật 23:59", timeLeft:"Còn",
    hours:"giờ", overdue:"Quá hạn!", missed:"Bỏ lỡ",
    openTasks:"nhiệm vụ chưa làm", statusReport:"Báo cáo tuần",
    completed:"Hoàn thành", notCompleted:"Chưa hoàn thành",
    verify:"Xác nhận ✓", reject:"Từ chối ✗", verified:"Đã xác nhận",
    rejected:"Bị từ chối", rejectedBy:"Từ chối bởi", verifiedBy:"Xác nhận bởi",
    rejectReason:"Lý do từ chối", redoTask:"Vui lòng làm lại",
    weekSummary:"Tổng kết tuần", allCompleted:"Hoàn thành tất cả",
    missedTasks:"Nhiệm vụ bỏ lỡ", penaltyTotal:"Tổng phạt",
    fairness:"Kiểm tra công bằng", minPoints:"Điểm tối thiểu/tuần",
    minPointsAuto:"Tự động", minPointsManual:"Thủ công",
    maxDiff:"Chênh lệch tối đa trong phòng", perPersonCheck:"Theo người",
    belowMin:"Dưới điểm tối thiểu!", diffTooHigh:"Chênh lệch quá lớn!",
    penaltyPerPoint:"€ mỗi điểm thiếu", makeupTasks:"Bù nhiệm vụ",
    makeupInfo:"Điểm thiếu phải bù tuần sau",
    fairOk:"Phân bổ công bằng ✓", unfair:"Phân bổ không đều ⚠️",
    personPoints:"Điểm theo người", roomBalance:"Cân bằng phòng",
    reached:"Đạt", notReached:"Chưa đạt",
  },
};

const ALL_PERMS=["manage_rooms","manage_residents","manage_roles","edit_rules","config_sheets","edit_tasks","check_own_area","check_all","view_history","export_data","reset_week"];
const CRIT_PERMS=["manage_rooms","manage_roles","config_sheets","reset_week"];
const OWNER={id:"owner-1",name:"Origami",password:"origami",role:"owner",room:"—",roomId:null};

const DEF={
  lang:"de", masterPin:"1234", users:[{...OWNER}], rooms:[], completions:[], sheetsUrl:"",
  penaltyRate:5, rewardText:"Wird von den anderen bekocht! 🍳", refPhotos:{}, tutorials:{},
  verifications:{}, deadlineDay:0, deadlineHour:23, deadlineMin:59,
  maxDiffPercent:30, penaltyPerMissingPoint:2, catchUpEnabled:true,
  rolePerms:{owner:[...ALL_PERMS],manager:["manage_residents","check_own_area","check_all","view_history","export_data","reset_week","edit_tasks"],resident:["check_own_area","view_history"]},
  dailyTasks:[
    {de:"Geschirr spülen / abräumen",vi:"Rửa bát / dọn bàn",pts:1},
    {de:"Herd & Arbeitsflächen wischen",vi:"Lau bếp & mặt bàn",pts:1},
    {de:"Müll rausbringen (wenn voll)",vi:"Đổ rác (khi đầy)",pts:1},
    {de:"Schuhe ordentlich aufstellen",vi:"Xếp giày gọn gàng",pts:1},
    {de:"Toilette nach Benutzung säubern",vi:"Vệ sinh toilet sau khi dùng",pts:1},
    {de:"Spüle trockenwischen",vi:"Lau khô bồn rửa",pts:1},
  ],
  weeklyAreas:[
    {id:"kitchen",color:"#3B82F6",bg:"#EFF6FF",tasks:[{de:"Boden feucht wischen",vi:"Lau sàn ướt",pts:3},{de:"Spüle & Armaturen reinigen",vi:"Vệ sinh bồn rửa & vòi",pts:3},{de:"Herdplatten gründlich putzen",vi:"Chà bếp kỹ",pts:3},{de:"Kühlschrank außen wischen",vi:"Lau tủ lạnh ngoài",pts:2},{de:"Mülleimer reinigen",vi:"Rửa thùng rác",pts:2}]},
    {id:"bathroom",color:"#F59E0B",bg:"#FFFBEB",tasks:[{de:"Toilette putzen (innen & außen)",vi:"Vệ sinh toilet",pts:3},{de:"Waschbecken & Spiegel reinigen",vi:"Lau bồn rửa & gương",pts:3},{de:"Dusche / Badewanne reinigen",vi:"Vệ sinh vòi sen / bồn tắm",pts:3},{de:"Boden wischen",vi:"Lau sàn",pts:3},{de:"Handtücher wechseln",vi:"Thay khăn tắm",pts:2}]},
    {id:"common",color:"#10B981",bg:"#ECFDF5",tasks:[{de:"Flur saugen & wischen",vi:"Hút bụi & lau hành lang",pts:3},{de:"Wohnzimmer saugen",vi:"Hút bụi phòng khách",pts:3},{de:"Oberflächen abstauben",vi:"Lau bụi bề mặt",pts:2},{de:"Fenster reinigen",vi:"Lau cửa sổ",pts:3},{de:"Waschmaschine reinigen",vi:"Vệ sinh máy giặt",pts:2}]},
  ],
};

const RULES=[
  {catDe:"Allgemeines",catVi:"Tổng quát",icon:"📋",items:[{de:"Gegenseitiger Respekt.",vi:"Tôn trọng lẫn nhau."},{de:"Probleme direkt ansprechen.",vi:"Nói trực tiếp."},{de:"Monatliches WG-Meeting.",vi:"Họp WG hàng tháng."}]},
  {catDe:"Ruhezeiten",catVi:"Giờ yên tĩnh",icon:"🌙",items:[{de:"22:00–07:00 (Mo–Fr), 23:00–09:00 (Sa–So).",vi:"22:00–07:00 (T2–T6), 23:00–09:00 (T7–CN)."},{de:"Musik auf Zimmerlautstärke nach 22 Uhr.",vi:"Nhạc mức phòng sau 22h."}]},
  {catDe:"Küche",catVi:"Nhà bếp",icon:"🍳",items:[{de:"Geschirr sofort spülen.",vi:"Rửa bát ngay."},{de:"Herd nach Benutzung reinigen.",vi:"Lau bếp sau khi dùng."},{de:"Müll trennen.",vi:"Phân loại rác."}]},
  {catDe:"Bad & WC",catVi:"Phòng tắm",icon:"🚿",items:[{de:"Nach dem Duschen lüften.",vi:"Thông gió sau khi tắm."},{de:"Haare aus Abfluss entfernen.",vi:"Lấy tóc khỏi ống thoát."}]},
  {catDe:"Besuch",catVi:"Khách",icon:"👥",items:[{de:"Mitbewohner informieren.",vi:"Thông báo bạn phòng."},{de:"Gäste max. 3 Nächte/Woche.",vi:"Khách tối đa 3 đêm/tuần."}]},
  {catDe:"Rauchen",catVi:"Hút thuốc",icon:"🚭",items:[{de:"Nur auf Balkon / vor der Tür.",vi:"Chỉ ở ban công / trước cửa."}]},
];

function gwk(d){const dt=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));dt.setUTCDate(dt.getUTCDate()+4-(dt.getUTCDay()||7));const y=new Date(Date.UTC(dt.getUTCFullYear(),0,1));return Math.ceil(((dt-y)/864e5+1)/7);}
function grot(wk,rooms,areas){if(!rooms.length)return {};const r={};areas.forEach((a,i)=>{r[a.id]=rooms[(wk+i)%rooms.length]?.id});return r;}
function fd(ts){return new Date(ts).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit",year:"numeric"});}
function ft(ts){return new Date(ts).toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"});}
function gmo(){return new Date().getMonth()+1;}
function getDeadline(wk){
  // Sunday 23:59 of the given ISO week
  const jan4=new Date(Date.UTC(new Date().getFullYear(),0,4));
  const d=new Date(jan4.getTime()+((wk-1)*7-(jan4.getUTCDay()-1))*864e5);
  d.setUTCDate(d.getUTCDate()+(7-d.getUTCDay()));// Sunday
  d.setUTCHours(23,59,59);return d;
}
function getTimeLeft(wk){
  const dl=getDeadline(wk),now=new Date(),diff=dl-now;
  if(diff<=0)return{overdue:true,hours:0,text:""};
  const h=Math.floor(diff/36e5),m=Math.floor((diff%36e5)/6e4);
  return{overdue:false,hours:h,text:`${h}h ${m}m`};
}
function compImg(file,mw=400,q=0.5){return new Promise(res=>{const r=new FileReader();r.onload=e=>{const img=new Image();img.onload=()=>{const c=document.createElement("canvas");const rt=Math.min(mw/img.width,mw/img.height,1);c.width=img.width*rt;c.height=img.height*rt;c.getContext("2d").drawImage(img,0,0,c.width,c.height);res(c.toDataURL("image/jpeg",q));};img.src=e.target.result;};r.readAsDataURL(file);});}

const F="'Nunito','Segoe UI',sans-serif";

/* ── Main ── */
export default function App(){
  const[st,setSt]=useState(null);
  const[ph,setPh]=useState({});
  const[user,setUser]=useState(null);
  const[scr,setScr]=useState("login");
  const[ld,setLd]=useState(true);
  const[toast,setToast]=useState(null);
  const[pinM,setPinM]=useState(null);
  const[phView,setPhView]=useState(null);
  const[tutView,setTutView]=useState(null);

  useEffect(()=>{(async()=>{try{
    const[r,p]=await Promise.all([window.storage.get("wg4").catch(()=>null),window.storage.get("wg4p").catch(()=>null)]);
    if(r?.value){const d=JSON.parse(r.value);if(!d.users?.some(u=>u.id==="owner-1"))d.users=[{...OWNER},...(d.users||[])];setSt({...DEF,...d});}else setSt({...DEF});
    if(p?.value)setPh(JSON.parse(p.value));
  }catch{setSt({...DEF});}setLd(false);})();},[]);

  const sv=async ns=>{setSt(ns);try{await window.storage.set("wg4",JSON.stringify(ns));}catch{}};
  const sp=async np=>{setPh(np);try{await window.storage.set("wg4p",JSON.stringify(np));}catch{}};
  const show=(m,ty="success")=>{setToast({m,ty});setTimeout(()=>setToast(null),2500);};
  const hp=p=>user?(st.rolePerms?.[user.role]||[]).includes(p):false;
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
  const doVerify=async(tk,ai,wk,by)=>{
    const key=`${wk}-${ai}-${tk}`;
    await sv({...st,verifications:{...(st.verifications||{}),[key]:{status:"verified",by,at:Date.now()}}});
    show(st.lang==="de"?"✓ Bestätigt!":"✓ Đã xác nhận!");
  };
  const doReject=async(tk,ai,wk,by,reason)=>{
    const key=`${wk}-${ai}-${tk}`;
    // Remove from completions so task is open again
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
    <div style={{fontFamily:F,minHeight:"100vh",background:"#F8FAFC",maxWidth:520,margin:"0 auto",position:"relative"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes slideIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}input:focus,select:focus{border-color:#3B82F6!important;box-shadow:0 0 0 3px rgba(59,130,246,.12)}button{transition:all .12s}button:hover{opacity:.9}button:active{transform:scale(.97)}`}</style>
      {toast&&<div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",color:"#fff",padding:"10px 24px",borderRadius:10,fontSize:14,fontWeight:600,zIndex:1000,boxShadow:"0 4px 16px rgba(0,0,0,.15)",fontFamily:F,animation:"fadeIn .2s",background:toast.ty==="success"?"#10B981":"#EF4444"}}>{toast.m}</div>}
      {pinM&&<PinMod t={t} st={st} pm={pinM} set={setPinM}/>}
      {phView&&<div style={ov} onClick={()=>setPhView(null)}><div style={{...mod,maxWidth:420,padding:8}} onClick={e=>e.stopPropagation()}><img src={phView} style={{width:"100%",borderRadius:12}} alt="proof"/><button style={{...btnG,width:"100%",marginTop:8}} onClick={()=>setPhView(null)}>{t.closePhoto}</button></div></div>}
      {tutView&&<TutPopup t={t} lang={st.lang} tut={tutView} onClose={()=>setTutView(null)}/>}
      {scr==="login"?<LoginScr t={t} st={st} sv={sv} onLogin={u=>{setUser(u);setScr("plan")}}/>:
        <div style={{padding:"14px 14px 32px",maxWidth:520,margin:"0 auto"}}>
          <NavBar t={t} scr={scr} set={setScr} user={user} hp={hp} st={st} isC={isC} onLogout={()=>{setUser(null);setScr("login")}}/>
          {scr==="plan"&&<PlanScr t={t} st={st} user={user} hp={hp} doDone={doDone} doUndo={doUndo} isC={isC} ph={ph} vp={setPhView} openTut={setTutView} doVerify={doVerify} doReject={doReject} getVerif={getVerif}/>}
          {scr==="leaderboard"&&<LeaderScr t={t} st={st}/>}
          {scr==="rules"&&<RulesScr t={t}/>}
          {scr==="history"&&<HistScr t={t} st={st} hp={hp} ph={ph} vp={setPhView}/>}
          {scr==="admin"&&<AdminScr t={t} st={st} sv={sv} hp={hp} rpin={rpin} show={show}/>}
        </div>}
    </div>
  );
}

/* Shared styles */
const inp={width:"100%",padding:"10px 14px",border:"2px solid #E2E8F0",borderRadius:10,fontSize:15,fontFamily:F,outline:"none",boxSizing:"border-box"};
const inpS={padding:"7px 10px",border:"2px solid #E2E8F0",borderRadius:8,fontSize:13,fontFamily:F,outline:"none",boxSizing:"border-box",width:"100%"};
const btnP={padding:"10px 18px",background:"#3B82F6",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:F,whiteSpace:"nowrap"};
const btnG={padding:"10px 18px",background:"#F1F5F9",color:"#475569",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:F};
const btnS={padding:"6px 14px",background:"#3B82F6",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:F};
const lbl={display:"block",fontSize:13,fontWeight:600,color:"#475569",marginBottom:6};
const ov={position:"fixed",inset:0,background:"rgba(15,23,42,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,padding:20,backdropFilter:"blur(4px)"};
const mod={background:"#fff",borderRadius:20,padding:28,width:"100%",maxWidth:340,boxShadow:"0 20px 60px rgba(0,0,0,.15)",animation:"slideIn .2s"};
const tabB={padding:"7px 12px",border:"1px solid #E2E8F0",borderRadius:8,background:"#fff",fontSize:11,fontWeight:500,color:"#64748B",cursor:"pointer",fontFamily:F};
const tabA={background:"#EFF6FF",borderColor:"#3B82F6",color:"#3B82F6",fontWeight:700};
const aCard={background:"#fff",borderRadius:14,borderLeft:"4px solid",padding:12,marginBottom:10,boxShadow:"0 1px 3px rgba(0,0,0,.04)"};
const dBdg={fontSize:10,color:"#64748B",background:"#F1F5F9",padding:"2px 7px",borderRadius:5,whiteSpace:"nowrap"};
const delB={background:"none",border:"none",color:"#EF4444",fontSize:18,cursor:"pointer",padding:"0 4px"};

function PinMod({t,st,pm,set}){
  const[pin,setPin]=useState("");const[err,setErr]=useState("");
  const go=()=>{if(pin===st.masterPin){pm.resolve(true);set(null);}else{setErr(t.wrongPin);setPin("");}};
  return <div style={ov} onClick={()=>{pm.resolve(false);set(null);}}><div style={mod} onClick={e=>e.stopPropagation()}>
    <div style={{textAlign:"center",marginBottom:16}}><span style={{fontSize:36}}>🔐</span><h3 style={{margin:"8px 0 4px",fontFamily:F,fontSize:18,color:"#1E293B"}}>{t.criticalAction}</h3><p style={{margin:0,fontSize:13,color:"#64748B"}}>{t.pinRequired}</p></div>
    <input type="password" style={inp} placeholder="PIN" value={pin} autoFocus onChange={e=>{setPin(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&go()}/>
    {err&&<p style={{color:"#EF4444",fontSize:13,marginTop:6}}>{err}</p>}
    <div style={{display:"flex",gap:8,marginTop:12}}><button style={{...btnG,flex:1}} onClick={()=>{pm.resolve(false);set(null);}}>{t.cancel}</button><button style={{...btnP,flex:1}} onClick={go}>OK</button></div>
  </div></div>;
}

function LoginScr({t,st,sv,onLogin}){
  const[sel,setSel]=useState(null);const[pw,setPw]=useState("");const[err,setErr]=useState("");
  const RI={owner:"👑",manager:"🔧",resident:"👤"};const RC={owner:"#8B5CF6",manager:"#F59E0B",resident:"#3B82F6"};
  const go=()=>{if(!sel)return;if(sel.password&&sel.password!==pw)return setErr(t.wrongPw);onLogin({...sel});};
  return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,background:"linear-gradient(135deg,#EFF6FF 0%,#F0FDF4 100%)"}}>
    <div style={{background:"#fff",borderRadius:20,padding:28,width:"100%",maxWidth:420,boxShadow:"0 8px 32px rgba(0,0,0,.08)"}}>
      <div style={{textAlign:"center",marginBottom:24}}><span style={{fontSize:48}}>🏠</span><h1 style={{fontSize:24,fontWeight:800,color:"#1E293B",margin:"12px 0 4px",fontFamily:F}}>{t.appTitle}</h1><p style={{fontSize:14,color:"#64748B",margin:0}}>{t.appSub}</p></div>
      <label style={lbl}>{t.selectPerson}</label>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {st.users.map((u,i)=><button key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"12px 8px",border:"2px solid "+(sel?.id===u.id?"#3B82F6":"#E2E8F0"),borderRadius:14,background:sel?.id===u.id?"#EFF6FF":"#FAFBFC",cursor:"pointer",fontFamily:F,boxShadow:sel?.id===u.id?"0 0 0 3px rgba(59,130,246,.12)":"none"}} onClick={()=>{setSel(u);setErr("");setPw("");}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${RC[u.role]},${RC[u.role]}88)`,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:18,fontFamily:F}}>{u.name[0].toUpperCase()}</div>
          <span style={{fontSize:14,fontWeight:600,color:"#1E293B"}}>{u.name}</span>
          <span style={{fontSize:11,color:RC[u.role]}}>{RI[u.role]} {t[u.role]}</span>
          {u.room&&u.room!=="—"&&<span style={{fontSize:10,color:"#94A3B8"}}>{u.room}</span>}
        </button>)}
      </div>
      {sel&&<div style={{marginTop:16}}>
        <label style={lbl}>{t.password}</label>
        <input type="password" style={inp} value={pw} autoFocus placeholder="••••••" onChange={e=>{setPw(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&go()}/>
        {err&&<p style={{color:"#EF4444",fontSize:13,marginTop:6}}>{err}</p>}
        <button style={{...btnP,width:"100%",marginTop:12}} onClick={go}>{t.login}</button>
      </div>}
      <div style={{textAlign:"center",marginTop:20,paddingTop:16,borderTop:"1px solid #F1F5F9"}}>
        <button style={{background:"none",border:"none",color:"#64748B",fontSize:13,cursor:"pointer",fontFamily:F}} onClick={()=>sv({...st,lang:st.lang==="de"?"vi":"de"})}>🌐 {st.lang==="de"?"Tiếng Việt":"Deutsch"}</button>
      </div>
    </div>
  </div>;
}

function NavBar({t,scr,set,user,hp,st,isC,onLogout}){
  const RI={owner:"👑",manager:"🔧",resident:"👤"};
  const showA=hp("manage_rooms")||hp("manage_residents")||hp("manage_roles")||hp("config_sheets")||hp("edit_tasks");
  const wk=gwk(new Date());
  // Count open weekly tasks
  const rot=grot(wk,st.rooms,st.weeklyAreas);
  let openCount=0;
  st.weeklyAreas.forEach(a=>a.tasks.forEach(ta=>{if(!isC(ta.de,a.id,wk))openCount++;}));
  const tl=getTimeLeft(wk);
  const items=[
    {id:"plan",icon:"📋",l:t.plan,s:true,badge:openCount>0?openCount:null},
    {id:"leaderboard",icon:"🏆",l:t.leaderboard,s:true},
    {id:"rules",icon:"📜",l:t.rules,s:true},
    {id:"history",icon:"📊",l:t.history,s:hp("view_history")},
    {id:"admin",icon:"⚙️",l:t.admin,s:showA},
  ];
  const ni={flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:4,padding:"7px 4px",border:"none",borderRadius:10,background:"transparent",fontSize:11,fontWeight:500,color:"#64748B",cursor:"pointer",fontFamily:F,position:"relative"};
  const nia={background:"#EFF6FF",color:"#3B82F6",fontWeight:700};
  return <div style={{background:"#fff",borderRadius:16,padding:12,marginBottom:14,boxShadow:"0 1px 4px rgba(0,0,0,.06)"}}>
    <div style={{display:"flex",alignItems:"center",gap:10,paddingBottom:10,marginBottom:10,borderBottom:"1px solid #F1F5F9"}}>
      <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#3B82F6,#8B5CF6)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:15,fontFamily:F,flexShrink:0}}>{user?.name?.[0]}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:14,fontWeight:700,color:"#1E293B"}}>{user?.name} <span style={{fontSize:12}}>{RI[user?.role]}</span></div>
        <div style={{fontSize:11,color:"#94A3B8"}}>{user?.room!=="—"?user?.room:t[user?.role]}</div>
      </div>
      {openCount>0&&<div style={{display:"flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:8,background:tl.overdue?"#FEF2F2":"#FFFBEB",fontSize:11,fontWeight:600,color:tl.overdue?"#DC2626":"#D97706"}}>
        {tl.overdue?"⚠️ "+t.overdue:`⏰ ${tl.text}`}
      </div>}
      <button style={{background:"none",border:"1px solid #E2E8F0",borderRadius:8,padding:"4px 12px",fontSize:12,color:"#64748B",cursor:"pointer",fontFamily:F}} onClick={onLogout}>{t.logout}</button>
    </div>
    <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{items.filter(i=>i.s).map(i=><button key={i.id} style={{...ni,...(scr===i.id?nia:{})}} onClick={()=>set(i.id)}>
      <span style={{fontSize:13}}>{i.icon}</span><span>{i.l}</span>
      {i.badge&&<span style={{position:"absolute",top:-2,right:2,width:16,height:16,borderRadius:"50%",background:"#EF4444",color:"#fff",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{i.badge}</span>}
    </button>)}</div>
  </div>;
}

function PhotoCap({t,onCap,photo}){
  const ref=useRef();
  const h=async e=>{const f=e.target.files?.[0];if(!f)return;onCap(await compImg(f,400,.5));};
  return <div style={{marginTop:6,marginLeft:32}}>
    {photo?<div style={{position:"relative",display:"inline-block"}}><img src={photo} style={{height:60,borderRadius:8}} alt="p"/><button style={{position:"absolute",top:-4,right:-4,background:"rgba(0,0,0,.6)",color:"#fff",border:"none",borderRadius:"50%",width:20,height:20,fontSize:12,cursor:"pointer",lineHeight:"20px"}} onClick={()=>onCap(null)}>×</button></div>
    :<button style={{width:"calc(100% - 32px)",padding:8,background:"#EFF6FF",border:"2px dashed #93C5FD",borderRadius:10,color:"#3B82F6",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:F}} onClick={()=>ref.current?.click()}>📸 {t.takePhoto}<input ref={ref} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={h}/></button>}
  </div>;
}

function TutPopup({t,lang,tut,onClose}){
  if(!tut)return null;
  const steps=tut.steps||[];
  return <div style={ov} onClick={onClose}><div style={{...mod,maxWidth:460,padding:0,maxHeight:"90vh",overflow:"auto"}} onClick={e=>e.stopPropagation()}>
    <div style={{padding:"20px 20px 12px",borderBottom:"1px solid #F1F5F9"}}>
      <h3 style={{margin:0,fontSize:18,fontFamily:F,color:"#1E293B"}}>📖 {lang==="de"?tut.taskDe:tut.taskVi}</h3>
      <p style={{margin:"4px 0 0",fontSize:13,color:"#94A3B8"}}>{lang==="de"?tut.taskVi:tut.taskDe}</p>
    </div>
    <div style={{padding:"12px 20px 20px"}}>
      {steps.map((s,i)=> <div key={i} style={{display:"flex",gap:12,marginBottom:16,paddingBottom:16,borderBottom:i<steps.length-1?"1px solid #F1F5F9":"none"}}>
        <div style={{width:28,height:28,borderRadius:"50%",background:"#3B82F6",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,fontFamily:F,flexShrink:0}}>{i+1}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:14,color:"#1E293B",fontWeight:500,marginBottom:4}}>{lang==="de"?s.textDe:s.textVi}</div>
          {s.textVi&&lang==="de"&&<div style={{fontSize:12,color:"#94A3B8",marginBottom:6}}>{s.textVi}</div>}
          {s.textDe&&lang==="vi"&&<div style={{fontSize:12,color:"#94A3B8",marginBottom:6}}>{s.textDe}</div>}
          {s.photo&&<img src={s.photo} style={{width:"100%",maxHeight:180,objectFit:"cover",borderRadius:8}} alt={`step ${i+1}`}/>}
        </div>
      </div>)}
      {tut.videoUrl&&<a href={tut.videoUrl} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:"#FEF2F2",borderRadius:10,textDecoration:"none",color:"#DC2626",fontSize:13,fontWeight:600}}>🎬 Video-Tutorial öffnen / Mở video hướng dẫn</a>}
      <button style={{...btnG,width:"100%",marginTop:12}} onClick={onClose}>{t.closeTutorial}</button>
    </div>
  </div></div>;
}

function PlanScr({t,st,user,hp,doDone,doUndo,isC,ph,vp,openTut,doVerify,doReject,getVerif}){
  const[tp,setTP]=useState({});const[err,setErr]=useState("");const[showRef,setShowRef]=useState({});
  const[rejectKey,setRejectKey]=useState(null);const[rejectReason,setRejectReason]=useState("");
  const lang=st.lang,wk=gwk(new Date()),rot=grot(wk,st.rooms,st.weeklyAreas);
  const day=new Date().toLocaleDateString(lang==="de"?"de-DE":"vi-VN",{weekday:"long"});
  const canC=ai=>{if(hp("check_all"))return true;if(!hp("check_own_area"))return false;return user.roomId===rot[ai];};
  let tot=0,dn=0;st.weeklyAreas.forEach(a=>a.tasks.forEach(ta=>{tot++;if(isC(ta.de,a.id,wk))dn++;}));
  const pct=tot>0?Math.round(dn/tot*100):0;
  const doT=(tk,ai)=>{const k=`${ai}-${tk}`;if(!tp[k]){setErr(k);return;}doDone(tk,ai,tp[k]);setTP(p=>{const n={...p};delete n[k];return n;});setErr("");};
  const togRef=k=>setShowRef(p=>({...p,[k]:!p[k]}));

  const TR=({task,areaId,area})=>{
    const comp=isC(task.de,areaId,wk),k=`${areaId}-${task.de}`,pk=`${wk}-${areaId}-${task.de}`,ok=areaId==="daily"||canC(areaId);
    const refKey=`task-${task.de}`;
    const hasRef=!!st.refPhotos?.[refKey];
    const tutKey=`task-${task.de}`;
    const hasTut=st.tutorials?.[tutKey]?.steps?.length>0;
    const refOpen=!!showRef[k];
    const tutOpen=!!showRef[`tut-${k}`];
    const cb={width:24,height:24,borderRadius:7,border:"2px solid #CBD5E1",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#fff",cursor:"pointer",flexShrink:0,fontFamily:F,marginTop:2};
    const cbD={background:"#3B82F6",borderColor:"#3B82F6"};
    return <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px",borderRadius:10,marginBottom:4,background:comp?(area?.bg||"#F0FFF4"):"transparent"}}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {comp?<span style={{...cb,...cbD,...(area?{background:area.color,borderColor:area.color}:{})}} onClick={()=>doUndo(task.de,areaId,wk)}>✓</span>
          :ok?<span style={cb} onClick={()=>doT(task.de,areaId)}/>
          :<span style={{...cb,opacity:.3,cursor:"not-allowed"}}/>}
          <div style={{flex:1}}>
            <div style={{fontSize:14,color:"#1E293B",textDecoration:comp?"line-through":"none"}}>{lang==="de"?task.de:task.vi}</div>
            <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
              <span style={{fontSize:12,color:"#94A3B8"}}>{lang==="de"?task.vi:task.de}</span>
              {hasRef&&<button style={{background:"none",border:"none",padding:0,fontSize:11,color:"#3B82F6",cursor:"pointer",fontFamily:F,fontWeight:600}} onClick={()=>togRef(k)}>{refOpen?t.hideRef:t.showRef}</button>}
              {hasTut&&<button style={{background:"none",border:"none",padding:0,fontSize:11,color:"#8B5CF6",cursor:"pointer",fontFamily:F,fontWeight:600}} onClick={()=>togRef(`tut-${k}`)}>{tutOpen?"✕":t.tutorialShort}</button>}
            </div>
          </div>
        </div>
        {refOpen&&hasRef&&<div style={{marginLeft:32,marginTop:6,padding:6,background:"#F8FAFC",borderRadius:8,border:"1px solid #E2E8F0"}}>
          <img src={st.refPhotos[refKey]} style={{width:"100%",maxHeight:150,objectFit:"cover",borderRadius:6}} alt="ref"/>
          <div style={{fontSize:10,color:"#94A3B8",marginTop:2,textAlign:"center"}}>{t.refPhoto}: {lang==="de"?task.de:task.vi}</div>
        </div>}
        {tutOpen&&hasTut&&<div style={{marginLeft:32,marginTop:6,padding:8,background:"#F5F3FF",borderRadius:8,border:"1px solid #DDD6FE"}}>
          {st.tutorials[tutKey].steps.slice(0,2).map((s,i)=><div key={i} style={{display:"flex",gap:6,marginBottom:6}}>
            <span style={{width:18,height:18,borderRadius:"50%",background:"#8B5CF6",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0}}>{i+1}</span>
            <div style={{fontSize:12,color:"#4C1D95"}}>{lang==="de"?s.textDe:s.textVi}</div>
          </div>)}
          {st.tutorials[tutKey].steps.length>2&&<div style={{fontSize:11,color:"#8B5CF6",marginBottom:4}}>+{st.tutorials[tutKey].steps.length-2} {t.steps}...</div>}
          <button style={{background:"#8B5CF6",color:"#fff",border:"none",borderRadius:6,padding:"4px 12px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:F,width:"100%"}} onClick={()=>openTut({...st.tutorials[tutKey],taskDe:task.de,taskVi:task.vi})}>{t.openTutorial}</button>
        </div>}
        {comp&&<div style={{marginTop:4,marginLeft:32}}>
          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            <span style={dBdg}>{comp.person} · {ft(comp.timestamp)} · +{comp.pts}⭐</span>
            {ph[pk]&&<button style={{...dBdg,cursor:"pointer",background:"#DBEAFE",color:"#2563EB"}} onClick={()=>vp(ph[pk])}>📷</button>}
            {(()=>{const v=getVerif(task.de,areaId,wk);
              if(v?.status==="verified")return <span style={{...dBdg,background:"#ECFDF5",color:"#059669"}}>✓ {t.verified} ({v.by})</span>;
              if(v?.status==="rejected")return <span style={{...dBdg,background:"#FEF2F2",color:"#DC2626"}}>✗ {t.rejected}: {v.reason}</span>;
              if(comp.person!==user.name)return <div style={{display:"flex",gap:4,marginTop:4}}>
                <button style={{padding:"3px 8px",background:"#10B981",color:"#fff",border:"none",borderRadius:6,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:F}} onClick={()=>doVerify(task.de,areaId,wk,user.name)}>{t.verify}</button>
                <button style={{padding:"3px 8px",background:"#EF4444",color:"#fff",border:"none",borderRadius:6,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:F}} onClick={()=>{setRejectKey(`${wk}-${areaId}-${task.de}`);setRejectReason("")}}>{t.reject}</button>
              </div>;
              return null;
            })()}
          </div>
          {rejectKey===`${wk}-${areaId}-${task.de}`&&<div style={{display:"flex",gap:4,marginTop:4}}>
            <input style={{...inpS,flex:1,fontSize:11}} placeholder={t.rejectReason} value={rejectReason} autoFocus onChange={e=>setRejectReason(e.target.value)} onKeyDown={e=>e.key==="Enter"&&rejectReason.trim()&&(doReject(task.de,areaId,wk,user.name,rejectReason),setRejectKey(null))}/>
            <button style={{padding:"4px 8px",background:"#EF4444",color:"#fff",border:"none",borderRadius:6,fontSize:11,cursor:"pointer",fontFamily:F}} onClick={()=>{if(rejectReason.trim()){doReject(task.de,areaId,wk,user.name,rejectReason);setRejectKey(null)}}}>✗</button>
            <button style={{padding:"4px 8px",background:"#F1F5F9",color:"#64748B",border:"none",borderRadius:6,fontSize:11,cursor:"pointer",fontFamily:F}} onClick={()=>setRejectKey(null)}>×</button>
          </div>}
        </div>}
        {!comp&&ok&&<><PhotoCap t={t} photo={tp[k]} onCap={d=>setTP(p=>({...p,[k]:d}))}/>{err===k&&!tp[k]&&<p style={{color:"#EF4444",fontSize:12,margin:"4px 0 0 32px"}}>{t.noPhoto}</p>}</>}
      </div>
      <div style={{fontSize:12,fontWeight:700,color:area?.color||"#3B82F6",background:area?.bg||"#EFF6FF",padding:"2px 8px",borderRadius:6,flexShrink:0,alignSelf:"flex-start"}}>+{task.pts}⭐</div>
    </div>;
  };

  const tl=getTimeLeft(wk);

  return <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fff",borderRadius:16,padding:14,marginBottom:14,boxShadow:"0 1px 4px rgba(0,0,0,.06)"}}>
      <div>
        <h2 style={{margin:0,fontSize:20,color:"#1E293B",fontFamily:F}}>{t.plan}</h2>
        <p style={{margin:"4px 0 0",fontSize:13,color:"#64748B"}}>{t.kwNum} {wk} · {day}</p>
        <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
          <span style={{fontSize:11,color:tl.overdue?"#DC2626":"#64748B"}}>⏰ {t.deadline}: {t.deadlineDay}</span>
          {tl.overdue?<span style={{fontSize:11,fontWeight:700,color:"#DC2626",background:"#FEF2F2",padding:"1px 6px",borderRadius:4}}>⚠️ {t.overdue}</span>
          :<span style={{fontSize:11,fontWeight:600,color:tl.hours<24?"#D97706":"#10B981",background:tl.hours<24?"#FFFBEB":"#ECFDF5",padding:"1px 6px",borderRadius:4}}>{t.timeLeft} {tl.text}</span>}
        </div>
      </div>
      <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="52" height="52" viewBox="0 0 52 52"><circle cx="26" cy="26" r="22" fill="none" stroke="#E2E8F0" strokeWidth="4"/><circle cx="26" cy="26" r="22" fill="none" stroke="#3B82F6" strokeWidth="4" strokeDasharray={`${pct*1.382} 138.2`} strokeLinecap="round" transform="rotate(-90 26 26)"/></svg><span style={{position:"absolute",fontSize:12,fontWeight:700,color:"#3B82F6",fontFamily:F}}>{pct}%</span></div>
    </div>
    <div style={{marginBottom:18}}><div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:8}}><h3 style={{fontSize:15,fontWeight:700,color:"#1E293B",margin:0,fontFamily:F}}>☀️ {t.daily}</h3><span style={{fontSize:11,color:"#94A3B8"}}>{t.dailySub}</span></div>
      {st.dailyTasks.map((task,i)=><TR key={i} task={task} areaId="daily"/>)}</div>
    <div style={{marginBottom:18}}><div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:8}}><h3 style={{fontSize:15,fontWeight:700,color:"#1E293B",margin:0,fontFamily:F}}>🔄 {t.weekly}</h3><span style={{fontSize:11,color:"#94A3B8"}}>{t.weeklySub}</span></div>
      {st.weeklyAreas.map(area=>{const room=st.rooms.find(r=>r.id===rot[area.id]);const allD=area.tasks.every(ta=>isC(ta.de,area.id,wk));
        return <div key={area.id} style={{...aCard,borderLeftColor:area.color}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><div><strong style={{fontSize:15,color:"#1E293B"}}>{t[area.id]}</strong><span style={{display:"inline-block",fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:5,marginLeft:6,background:area.bg,color:area.color}}>{t.responsible}: {room?.name||"—"}</span></div>{allD&&<span style={{fontSize:11,fontWeight:600,color:"#10B981",background:"#ECFDF5",padding:"3px 8px",borderRadius:6}}>{t.allDone}</span>}</div>
          {area.tasks.map((task,ti)=><TR key={ti} task={task} areaId={area.id} area={area}/>)}
        </div>;})}</div>
  </div>;
}

function LeaderScr({t,st}){
  const wk=gwk(new Date()),mo=gmo(),tl=getTimeLeft(wk);
  const users=st.users.filter(u=>u.room!=="—");
  const gP=(u,f)=>st.completions.filter(c=>c.person===u.name&&(f==="week"?c.week===wk:f==="month"?c.month===mo:true)).reduce((s,c)=>s+(c.pts||1),0);
  const ranked=users.map(u=>({...u,week:gP(u,"week"),month:gP(u,"month")})).sort((a,b)=>b.month-a.month);
  const w=ranked[0];const medals=["🥇","🥈","🥉"];
  const rot=grot(wk,st.rooms,st.weeklyAreas);

  // Per-room weekly report
  const roomReports=st.rooms.map(room=>{
    const assignedAreas=st.weeklyAreas.filter(a=>rot[a.id]===room.id);
    let totalTasks=0,doneTasks=0,verifiedTasks=0,rejectedTasks=0,missedTasks=0;
    const taskDetails=[];
    assignedAreas.forEach(area=>{
      area.tasks.forEach(task=>{
        totalTasks++;
        const comp=st.completions.find(c=>c.taskKey===task.de&&c.areaId===area.id&&c.week===wk);
        const verif=(st.verifications||{})[`${wk}-${area.id}-${task.de}`];
        const status=comp?(verif?.status==="rejected"?"rejected":verif?.status==="verified"?"verified":"done"):(tl.overdue?"missed":"open");
        if(comp)doneTasks++;
        if(verif?.status==="verified")verifiedTasks++;
        if(verif?.status==="rejected")rejectedTasks++;
        if(!comp&&tl.overdue)missedTasks++;
        taskDetails.push({task,area,status,comp,verif});
      });
    });
    const penalty=missedTasks*(st.penaltyRate||5);
    return{room,assignedAreas,totalTasks,doneTasks,verifiedTasks,rejectedTasks,missedTasks,penalty,taskDetails};
  });

  // Overall stats
  let totalAll=0,doneAll=0;
  st.weeklyAreas.forEach(a=>a.tasks.forEach(ta=>{totalAll++;if(st.completions.find(c=>c.taskKey===ta.de&&c.areaId===a.id&&c.week===wk))doneAll++;}));
  const pctAll=totalAll>0?Math.round(doneAll/totalAll*100):0;

  const statusColors={done:"#3B82F6",verified:"#10B981",rejected:"#EF4444",missed:"#DC2626",open:"#94A3B8"};
  const statusIcons={done:"⏳",verified:"✅",rejected:"❌",missed:"⚠️",open:"○"};
  const statusLabels={de:{done:"Erledigt",verified:"Bestätigt",rejected:"Abgelehnt",missed:"Verpasst",open:"Offen"},vi:{done:"Xong",verified:"Đã xác nhận",rejected:"Bị từ chối",missed:"Bỏ lỡ",open:"Chưa làm"}};

  return <div>
    {/* Monthly Winner */}
    {w&&w.month>0&&<div style={{background:"linear-gradient(135deg,#FEF3C7,#FDE68A)",borderRadius:16,padding:20,marginBottom:16,textAlign:"center"}}><div style={{fontSize:40}}>🏆</div><h3 style={{margin:"8px 0 4px",fontFamily:F,color:"#92400E",fontSize:18}}>{t.monthlyWinner}</h3><div style={{fontSize:24,fontWeight:800,color:"#92400E",fontFamily:F}}>{w.name}</div><div style={{fontSize:14,color:"#B45309"}}>{w.month} {t.points} · {st.rewardText||t.defaultReward}</div></div>}

    {/* Weekly Status Report */}
    <h3 style={{fontSize:15,fontWeight:700,color:"#1E293B",margin:"0 0 12px",fontFamily:F}}>📋 {t.statusReport} — {t.kwNum} {wk}</h3>
    <div style={{background:"#fff",borderRadius:14,padding:14,marginBottom:16,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
      {/* Overall progress bar */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
        <div style={{flex:1,height:8,background:"#E2E8F0",borderRadius:4,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${pctAll}%`,background:pctAll===100?"#10B981":"#3B82F6",borderRadius:4,transition:"width .3s"}}/>
        </div>
        <span style={{fontSize:13,fontWeight:700,color:pctAll===100?"#10B981":"#3B82F6"}}>{pctAll}%</span>
        <span style={{fontSize:11,color:"#64748B"}}>{doneAll}/{totalAll}</span>
      </div>
      {/* Deadline info */}
      <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderRadius:8,background:tl.overdue?"#FEF2F2":"#F8FAFC",marginBottom:12}}>
        <span style={{fontSize:13}}>{tl.overdue?"⚠️":"⏰"}</span>
        <span style={{fontSize:12,fontWeight:600,color:tl.overdue?"#DC2626":"#475569"}}>{t.deadline}: {t.deadlineDay}</span>
        <span style={{marginLeft:"auto",fontSize:12,fontWeight:700,color:tl.overdue?"#DC2626":tl.hours<24?"#D97706":"#10B981"}}>{tl.overdue?t.overdue:`${t.timeLeft} ${tl.text}`}</span>
      </div>
      {/* Per room breakdown */}
      {roomReports.map(rr=> <div key={rr.room.id} style={{marginBottom:12,padding:10,background:"#F8FAFC",borderRadius:10,border:"1px solid #F1F5F9"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <strong style={{fontSize:14,color:"#1E293B"}}>{rr.room.name}</strong>
          <span style={{marginLeft:"auto",fontSize:12,fontWeight:700,color:rr.doneTasks===rr.totalTasks?"#10B981":"#64748B"}}>{rr.doneTasks}/{rr.totalTasks}</span>
          {rr.missedTasks>0&&<span style={{fontSize:11,fontWeight:700,color:"#DC2626",background:"#FEF2F2",padding:"2px 6px",borderRadius:4}}>⚠️ {rr.missedTasks} {t.missed}</span>}
          {rr.penalty>0&&<span style={{fontSize:11,fontWeight:700,color:"#DC2626"}}>💰 {rr.penalty.toFixed(2)}€</span>}
        </div>
        {rr.taskDetails.map((td,i)=> <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 0",borderTop:i>0?"1px solid #E2E8F0":"none"}}>
          <span style={{fontSize:12,color:statusColors[td.status]}}>{statusIcons[td.status]}</span>
          <span style={{flex:1,fontSize:12,color:"#334155",textDecoration:td.status==="done"||td.status==="verified"?"line-through":"none"}}>{st.lang==="de"?td.task.de:td.task.vi}</span>
          <span style={{fontSize:10,fontWeight:600,color:statusColors[td.status],background:td.status==="verified"?"#ECFDF5":td.status==="rejected"?"#FEF2F2":td.status==="missed"?"#FEF2F2":"transparent",padding:"1px 6px",borderRadius:4}}>{statusLabels[st.lang||"de"][td.status]}</span>
          {td.comp&&<span style={{fontSize:10,color:"#94A3B8"}}>{td.comp.person}</span>}
        </div>)}
      </div>)}
      {pctAll===100&&<div style={{textAlign:"center",padding:"8px",background:"#ECFDF5",borderRadius:8,fontSize:14,fontWeight:700,color:"#059669"}}>🎉 {t.allCompleted}!</div>}
    </div>

    {/* Leaderboard */}
    <h3 style={{fontSize:15,fontWeight:700,color:"#1E293B",margin:"0 0 12px",fontFamily:F}}>🏆 {t.leaderboard}</h3>
    {ranked.map((u,i)=> <div key={u.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"#fff",borderRadius:12,marginBottom:6,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
      <span style={{fontSize:20,width:28,textAlign:"center"}}>{medals[i]||`#${i+1}`}</span>
      <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${i===0?"#F59E0B":i===1?"#94A3B8":"#CD7F32"},${i===0?"#FCD34D":"#CBD5E1"})`,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,fontFamily:F}}>{u.name[0]}</div>
      <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:"#1E293B"}}>{u.name}</div><div style={{fontSize:11,color:"#94A3B8"}}>{u.room}</div></div>
      <div style={{textAlign:"right"}}><div style={{fontSize:18,fontWeight:800,color:"#F59E0B"}}>{u.month}⭐</div><div style={{fontSize:10,color:"#94A3B8"}}>{t.thisWeek}: {u.week}</div></div>
    </div>)}

    {/* Strafkasse */}
    <h3 style={{fontSize:15,fontWeight:700,color:"#1E293B",margin:"20px 0 12px",fontFamily:F}}>💰 {t.strafkasse}</h3>
    <div style={{background:"#fff",borderRadius:12,padding:14,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
      <div style={{fontSize:12,color:"#64748B",marginBottom:8}}>{t.penaltyPerTask}: {st.penaltyRate||5}€</div>
      {roomReports.map(rr=> <div key={rr.room.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:"1px solid #F1F5F9"}}>
        <span style={{flex:1,fontSize:14,fontWeight:500}}>{rr.room.name}</span>
        {rr.missedTasks>0?<span style={{fontSize:12,color:"#94A3B8"}}>{rr.missedTasks} {t.missed}</span>:null}
        {rr.penalty>0?<span style={{fontSize:14,fontWeight:700,color:"#EF4444"}}>{t.owes}: {rr.penalty.toFixed(2)}€</span>
        :<span style={{fontSize:13,color:"#10B981",fontWeight:600}}>✓ OK</span>}
      </div>)}
      {(()=>{const totalPen=roomReports.reduce((s,r)=>s+r.penalty,0);return totalPen>0?<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0 0",marginTop:8,borderTop:"2px solid #E2E8F0"}}><strong style={{fontSize:14,color:"#1E293B"}}>{t.penaltyTotal}</strong><strong style={{fontSize:16,color:"#DC2626"}}>{totalPen.toFixed(2)}€</strong></div>:null;})()}
    </div>

    {/* Person Fairness Check */}
    <h3 style={{fontSize:15,fontWeight:700,color:"#1E293B",margin:"20px 0 12px",fontFamily:F}}>👥 {t.fairness}</h3>
    <div style={{background:"#fff",borderRadius:12,padding:14,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
      {st.rooms.map(room=>{
        const residents=(room.residents||[]).map(r=>{
          const u=st.users.find(u=>u.name===r.name&&u.roomId===room.id);
          const pts=st.completions.filter(c=>c.person===r.name&&c.week===wk).reduce((s,c)=>s+(c.pts||1),0);
          return{...r,pts,userId:u?.id};
        });
        if(residents.length<2)return null;
        // Calc min points: total room points assigned ÷ residents
        const rr=roomReports.find(x=>x.room.id===room.id);
        const totalRoomPts=rr?rr.taskDetails.reduce((s,td)=>s+td.task.pts,0):0;
        const minPts=Math.ceil(totalRoomPts/residents.length);
        const maxDiff=st.maxDiffPercent||30;
        const totalEarned=residents.reduce((s,r)=>s+r.pts,0);
        const maxPts=Math.max(...residents.map(r=>r.pts));
        const minEarned=Math.min(...residents.map(r=>r.pts));
        const diffPct=maxPts>0?Math.round((maxPts-minEarned)/maxPts*100):0;
        const isFair=diffPct<=maxDiff;

        return <div key={room.id} style={{marginBottom:14,padding:10,background:"#F8FAFC",borderRadius:10,border:`1px solid ${isFair?"#D1FAE5":"#FECACA"}`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <strong style={{fontSize:14,color:"#1E293B"}}>{room.name}</strong>
            <span style={{marginLeft:"auto",fontSize:11,fontWeight:700,color:isFair?"#059669":"#DC2626",background:isFair?"#ECFDF5":"#FEF2F2",padding:"2px 8px",borderRadius:6}}>{isFair?t.fairOk:t.unfair}</span>
          </div>
          <div style={{fontSize:11,color:"#64748B",marginBottom:6}}>
            {t.minPoints}: {minPts}⭐ · {t.maxDiff}: {maxDiff}% · {st.lang==="de"?"Differenz":"Chênh lệch"}: {diffPct}%
          </div>
          {/* Progress bars per person */}
          {residents.map((r,i)=>{
            const below=r.pts<minPts;
            const missing=below?minPts-r.pts:0;
            const penalty=missing*(st.penaltyPerMissingPoint||2);
            const pct=minPts>0?Math.min(Math.round(r.pts/minPts*100),100):100;
            return <div key={i} style={{marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                <span style={{fontSize:13,fontWeight:600,color:"#1E293B",minWidth:70}}>{r.name}</span>
                <div style={{flex:1,height:8,background:"#E2E8F0",borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:below?"#EF4444":pct>=100?"#10B981":"#3B82F6",borderRadius:4,transition:"width .3s"}}/>
                </div>
                <span style={{fontSize:12,fontWeight:700,color:below?"#DC2626":"#10B981",minWidth:50,textAlign:"right"}}>{r.pts}/{minPts}⭐</span>
              </div>
              {below&&<div style={{marginLeft:76,display:"flex",gap:6,flexWrap:"wrap"}}>
                <span style={{fontSize:10,fontWeight:600,color:"#DC2626",background:"#FEF2F2",padding:"1px 6px",borderRadius:4}}>⚠️ -{missing} {t.belowMin}</span>
                <span style={{fontSize:10,fontWeight:600,color:"#DC2626"}}>💰 +{penalty.toFixed(2)}€</span>
                {st.catchUpEnabled&&<span style={{fontSize:10,fontWeight:600,color:"#D97706",background:"#FFFBEB",padding:"1px 6px",borderRadius:4}}>📋 {missing}× {t.makeupTasks}</span>}
              </div>}
            </div>;
          })}
        </div>;
      })}
      {/* Total person penalties */}
      {(()=>{
        let totalPersonPen=0;
        st.rooms.forEach(room=>{
          const residents=(room.residents||[]).map(r=>({...r,pts:st.completions.filter(c=>c.person===r.name&&c.week===wk).reduce((s,c)=>s+(c.pts||1),0)}));
          if(residents.length<2)return;
          const rr=roomReports.find(x=>x.room.id===room.id);
          const totalRoomPts=rr?rr.taskDetails.reduce((s,td)=>s+td.task.pts,0):0;
          const minPts=Math.ceil(totalRoomPts/residents.length);
          residents.forEach(r=>{if(r.pts<minPts)totalPersonPen+=(minPts-r.pts)*(st.penaltyPerMissingPoint||2);});
        });
        return totalPersonPen>0?<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0 0",marginTop:4,borderTop:"2px solid #E2E8F0"}}><strong style={{fontSize:13,color:"#1E293B"}}>{t.penaltyTotal} ({t.fairness})</strong><strong style={{fontSize:15,color:"#DC2626"}}>{totalPersonPen.toFixed(2)}€</strong></div>:
        <div style={{textAlign:"center",padding:8,fontSize:13,color:"#059669",fontWeight:600}}>✓ {t.fairOk}</div>;
      })()}
    </div>
  </div>;
}

function RulesScr({t}){
  return <div><h2 style={{fontSize:20,color:"#1E293B",margin:"0 0 14px",fontFamily:F}}>📜 {t.rulesTitle}</h2>
    {RULES.map((cat,ci)=><div key={ci} style={{background:"#fff",borderRadius:12,padding:12,marginBottom:8,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,paddingBottom:6,borderBottom:"1px solid #F1F5F9"}}><span style={{fontSize:18}}>{cat.icon}</span><strong style={{fontSize:14,color:"#1E293B"}}>{cat.catDe}</strong><span style={{fontSize:12,color:"#64748B"}}>{cat.catVi}</span></div>
      {cat.items.map((item,ii)=><div key={ii} style={{display:"flex",gap:8,padding:"5px 0",fontSize:13}}><span style={{color:"#3B82F6",fontWeight:700}}>•</span><div><div style={{fontSize:13,color:"#334155"}}>{item.de}</div><div style={{fontSize:11,color:"#94A3B8"}}>{item.vi}</div></div></div>)}
    </div>)}</div>;
}

function HistScr({t,st,hp,ph,vp}){
  const sorted=[...st.completions].sort((a,b)=>b.timestamp-a.timestamp);const wk=gwk(new Date());
  const doE=()=>{if(!hp("export_data"))return;const h="Datum,Uhrzeit,KW,Person,Zimmer,Bereich,Aufgabe,Punkte\n";const rows=sorted.map(c=>`${fd(c.timestamp)},${ft(c.timestamp)},${c.week},${c.person},${c.room},${c.areaId},${c.taskKey},${c.pts||1}`).join("\n");const b=new Blob([h+rows],{type:"text/csv"});const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=`wg_KW${wk}.csv`;a.click();};
  return <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><h2 style={{fontSize:20,color:"#1E293B",margin:0,fontFamily:F}}>📊 {t.history}</h2>{hp("export_data")&&<button style={btnS} onClick={doE}>📥 {t.exportCsv}</button>}</div>
    <div style={{display:"flex",gap:8,marginBottom:14}}>{st.rooms.map(r=>{const c=st.completions.filter(c=>c.room===r.name&&c.week===wk).reduce((s,c)=>s+(c.pts||1),0);return <div key={r.id} style={{flex:1,background:"#fff",borderRadius:12,padding:12,textAlign:"center",boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}><div style={{fontSize:22,fontWeight:700,color:"#3B82F6"}}>{c}⭐</div><div style={{fontSize:11,color:"#64748B"}}>{r.name}</div></div>;})}</div>
    {!sorted.length?<div style={{textAlign:"center",padding:32,color:"#94A3B8"}}>{t.noHistory}</div>:<div>{sorted.slice(0,60).map((c,i)=>{const area=st.weeklyAreas.find(a=>a.id===c.areaId);const pk=`${c.week}-${c.areaId}-${c.taskKey}`;return <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"#fff",borderRadius:8,marginBottom:3,boxShadow:"0 1px 2px rgba(0,0,0,.03)"}}><div style={{width:8,height:8,borderRadius:"50%",background:area?.color||"#94A3B8",flexShrink:0}}/><div style={{flex:1,minWidth:0}}><div style={{fontSize:13,color:"#1E293B",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.taskKey}</div><div style={{fontSize:11,color:"#94A3B8"}}>{c.person} · +{c.pts||1}⭐ · KW{c.week}</div></div><div style={{display:"flex",alignItems:"center",gap:6}}>{ph[pk]&&<button style={{background:"#DBEAFE",border:"none",borderRadius:6,padding:"3px 6px",fontSize:11,color:"#2563EB",cursor:"pointer"}} onClick={()=>vp(ph[pk])}>📷</button>}<div style={{fontSize:11,color:"#64748B",textAlign:"right"}}><div>{fd(c.timestamp)}</div><div>{ft(c.timestamp)}</div></div></div></div>;})}</div>}
  </div>;
}

function AdminScr({t,st,sv,hp,rpin,show}){
  const[tab,setTab]=useState("rooms");
  const tabs=[{id:"rooms",l:`🚪 ${t.rooms}`,s:hp("manage_rooms")||hp("manage_residents")},{id:"tasks",l:`✏️ ${t.customTasks}`,s:hp("edit_tasks")},{id:"roles",l:`👥 ${t.roleManagement}`,s:hp("manage_roles")},{id:"perms",l:`🔒 ${t.permissions}`,s:hp("manage_roles")},{id:"bonus",l:`⭐ ${t.bonus}`,s:hp("manage_rooms")},{id:"sheets",l:"📊 Sheets",s:hp("config_sheets")},{id:"pin",l:"🔐 PIN",s:hp("manage_roles")}];
  return <div>
    <h2 style={{fontSize:20,color:"#1E293B",margin:"0 0 14px",fontFamily:F}}>⚙️ {t.admin}</h2>
    <div style={{display:"flex",gap:4,marginBottom:16,flexWrap:"wrap"}}>{tabs.filter(x=>x.s).map(x=><button key={x.id} style={{...tabB,...(tab===x.id?tabA:{})}} onClick={()=>setTab(x.id)}>{x.l}</button>)}</div>
    {tab==="rooms"&&<RoomMgr t={t} st={st} sv={sv} hp={hp} rpin={rpin} show={show}/>}
    {tab==="tasks"&&<TaskMgr t={t} st={st} sv={sv} show={show}/>}
    {tab==="roles"&&<RoleMgr t={t} st={st} sv={sv} rpin={rpin} show={show}/>}
    {tab==="perms"&&<PermEdit t={t} st={st} sv={sv} rpin={rpin} show={show}/>}
    {tab==="bonus"&&<BonusCfg t={t} st={st} sv={sv} rpin={rpin} show={show}/>}
    {tab==="sheets"&&<SheetsCfg t={t} st={st} sv={sv} rpin={rpin}/>}
    {tab==="pin"&&<PinChg t={t} st={st} sv={sv} rpin={rpin} show={show}/>}
  </div>;
}

function RoomMgr({t,st,sv,hp,rpin,show}){
  const[nr,setNr]=useState("");const[addTo,setAddTo]=useState(null);const[nn,setNn]=useState("");const[np,setNp]=useState("");const[nrl,setNrl]=useState("resident");
  const RI={owner:"👑",manager:"🔧",resident:"👤"};
  const aR=async()=>{if(!nr.trim()||!hp("manage_rooms"))return;const ok=await rpin();if(!ok)return;sv({...st,rooms:[...st.rooms,{id:Date.now().toString(),name:nr.trim(),residents:[]}]});setNr("");show(st.lang==="de"?"Zimmer erstellt":"Đã tạo phòng");};
  const dR=async id=>{if(!hp("manage_rooms"))return;const ok=await rpin();if(!ok)return;const room=st.rooms.find(r=>r.id===id);const ns=(room?.residents||[]).map(r=>r.name);sv({...st,rooms:st.rooms.filter(r=>r.id!==id),users:st.users.filter(u=>!ns.includes(u.name)||u.role==="owner")});};
  const aP=rid=>{if(!nn.trim())return;const room=st.rooms.find(r=>r.id===rid);sv({...st,rooms:st.rooms.map(r=>r.id===rid?{...r,residents:[...(r.residents||[]),{name:nn.trim(),password:np}]}:r),users:[...st.users,{id:Date.now().toString(),name:nn.trim(),password:np,role:nrl,room:room.name,roomId:rid}]});setNn("");setNp("");setNrl("resident");setAddTo(null);show(st.lang==="de"?"Bewohner hinzugefügt":"Đã thêm cư dân");};
  const dP=(rid,ri,name)=>{sv({...st,rooms:st.rooms.map(r=>r.id===rid?{...r,residents:r.residents.filter((_,i)=>i!==ri)}:r),users:st.users.filter(u=>!(u.name===name&&u.roomId===rid&&u.role!=="owner"))});};
  return <div>
    {st.rooms.map(room=><div key={room.id} style={{background:"#fff",borderRadius:14,padding:14,marginBottom:10,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span>🚪</span><strong style={{flex:1,fontSize:15}}>{room.name}</strong>{hp("manage_rooms")&&<button style={delB} onClick={()=>dR(room.id)}>×</button>}</div>
      {(room.residents||[]).map((res,ri)=>{const uo=st.users.find(u=>u.name===res.name&&u.roomId===room.id);return <div key={ri} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",fontSize:13,borderBottom:"1px solid #F8FAFC"}}><span style={{fontSize:14}}>{RI[uo?.role||"resident"]}</span><span style={{flex:1,fontSize:13}}>{res.name}</span><span style={{fontSize:11,color:"#94A3B8"}}>{t[uo?.role||"resident"]}</span><span>{res.password?"🔒":"🔓"}</span>{hp("manage_residents")&&<button style={delB} onClick={()=>dP(room.id,ri,res.name)}>×</button>}</div>;})}
      {addTo===room.id?<div style={{display:"flex",flexDirection:"column",gap:6,marginTop:8,padding:10,background:"#F8FAFC",borderRadius:10}}><input style={inpS} placeholder={t.residentName} value={nn} onChange={e=>setNn(e.target.value)}/><input style={inpS} type="password" placeholder={t.password} value={np} onChange={e=>setNp(e.target.value)}/><select style={inpS} value={nrl} onChange={e=>setNrl(e.target.value)}><option value="resident">👤 {t.resident}</option><option value="manager">🔧 {t.manager}</option></select><div style={{display:"flex",gap:6}}><button style={{...btnS,flex:1}} onClick={()=>aP(room.id)}>+ {t.save}</button><button style={{...btnG,flex:1,padding:"6px 12px",fontSize:13}} onClick={()=>setAddTo(null)}>{t.cancel}</button></div></div>
      :hp("manage_residents")&&<button style={{background:"none",border:"1px dashed #CBD5E1",borderRadius:8,padding:"6px 14px",fontSize:12,color:"#3B82F6",cursor:"pointer",width:"100%",fontFamily:F,marginTop:8}} onClick={()=>{setAddTo(room.id);setNn("");setNp("");setNrl("resident");}}>+ {t.addResident}</button>}
    </div>)}
    {hp("manage_rooms")&&<div style={{display:"flex",gap:8,marginTop:12}}><input style={{...inp,flex:1}} placeholder={t.roomName} value={nr} onChange={e=>setNr(e.target.value)} onKeyDown={e=>e.key==="Enter"&&aR()}/><button style={btnP} onClick={aR}>+ {t.addRoom}</button></div>}
  </div>;
}

function TaskMgr({t,st,sv,show}){
  const[mode,setMode]=useState("daily");const[nd,setNd]=useState("");const[nv,setNv]=useState("");const[npts,setNpts]=useState(1);const[aid,setAid]=useState("kitchen");
  const[editTut,setEditTut]=useState(null); // task.de being edited
  const[tutSteps,setTutSteps]=useState([]);
  const[tutVideo,setTutVideo]=useState("");
  const aD=()=>{if(!nd.trim())return;sv({...st,dailyTasks:[...st.dailyTasks,{de:nd.trim(),vi:nv.trim()||nd.trim(),pts:Number(npts)||1}]});setNd("");setNv("");setNpts(1);show("✓");};
  const dD=i=>{sv({...st,dailyTasks:st.dailyTasks.filter((_,idx)=>idx!==i)});};
  const aW=()=>{if(!nd.trim())return;sv({...st,weeklyAreas:st.weeklyAreas.map(a=>a.id===aid?{...a,tasks:[...a.tasks,{de:nd.trim(),vi:nv.trim()||nd.trim(),pts:Number(npts)||3}]}:a)});setNd("");setNv("");setNpts(3);show("✓");};
  const dW=(ai,ti)=>{sv({...st,weeklyAreas:st.weeklyAreas.map(a=>a.id===ai?{...a,tasks:a.tasks.filter((_,i)=>i!==ti)}:a)});};
  const uRef=async(taskDe,e)=>{const f=e.target.files?.[0];if(!f)return;const img=await compImg(f,600,.6);sv({...st,refPhotos:{...st.refPhotos,[`task-${taskDe}`]:img}});show("📸 ✓");};
  const dRef=(taskDe)=>{const rp={...st.refPhotos};delete rp[`task-${taskDe}`];sv({...st,refPhotos:rp});};

  const openTutEdit=(taskDe)=>{
    const key=`task-${taskDe}`;
    const existing=st.tutorials?.[key];
    setEditTut(taskDe);
    setTutSteps(existing?.steps?existing.steps.map(s=>({...s})):[{textDe:"",textVi:"",photo:null}]);
    setTutVideo(existing?.videoUrl||"");
  };
  const saveTut=()=>{
    const key=`task-${editTut}`;
    const validSteps=tutSteps.filter(s=>s.textDe.trim()||s.textVi.trim()||s.photo);
    sv({...st,tutorials:{...(st.tutorials||{}),[key]:{steps:validSteps,videoUrl:tutVideo.trim()}}});
    setEditTut(null);show("📖 ✓");
  };
  const delTut=(taskDe)=>{
    const tuts={...(st.tutorials||{})};delete tuts[`task-${taskDe}`];
    sv({...st,tutorials:tuts});show("✓");
  };
  const addTutStep=()=>setTutSteps(s=>[...s,{textDe:"",textVi:"",photo:null}]);
  const rmTutStep=i=>setTutSteps(s=>s.filter((_,idx)=>idx!==i));
  const updStep=(i,field,val)=>setTutSteps(s=>s.map((x,idx)=>idx===i?{...x,[field]:val}:x));
  const stepPhoto=async(i,e)=>{const f=e.target.files?.[0];if(!f)return;const img=await compImg(f,500,.5);updStep(i,"photo",img);};

  const TaskItem=({task,onDel})=>{
    const refKey=`task-${task.de}`;
    const hasRef=!!st.refPhotos?.[refKey];
    const hasTut=st.tutorials?.[refKey]?.steps?.length>0;
    return <div style={{background:"#fff",borderRadius:8,marginBottom:6,padding:"8px 10px",boxShadow:"0 1px 2px rgba(0,0,0,.03)"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{flex:1,fontSize:13}}>{task.de} <span style={{color:"#94A3B8",fontSize:11}}>({task.vi})</span></span>
        <span style={{fontSize:12,color:"#F59E0B",fontWeight:700}}>+{task.pts}⭐</span>
        <button style={delB} onClick={onDel}>×</button>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4,flexWrap:"wrap"}}>
        {hasRef?<>
          <img src={st.refPhotos[refKey]} style={{height:36,width:52,objectFit:"cover",borderRadius:6}} alt="ref"/>
          <span style={{fontSize:10,color:"#10B981"}}>✓ {t.refPhoto}</span>
          <button style={{...delB,fontSize:14}} onClick={()=>dRef(task.de)}>×</button>
        </>:<label style={{fontSize:11,color:"#3B82F6",cursor:"pointer",display:"flex",alignItems:"center",gap:3}}>
          📷 {t.uploadRef}<input type="file" accept="image/*" style={{display:"none"}} onChange={e=>uRef(task.de,e)}/>
        </label>}
        <span style={{color:"#E2E8F0"}}>|</span>
        {hasTut?<>
          <span style={{fontSize:10,color:"#8B5CF6",fontWeight:600}}>📖 {st.tutorials[refKey].steps.length} {t.steps}</span>
          <button style={{background:"none",border:"none",fontSize:11,color:"#8B5CF6",cursor:"pointer",fontFamily:F,padding:0}} onClick={()=>openTutEdit(task.de)}>✏️</button>
          <button style={{...delB,fontSize:14}} onClick={()=>delTut(task.de)}>×</button>
        </>:<button style={{background:"none",border:"none",fontSize:11,color:"#8B5CF6",cursor:"pointer",fontFamily:F,padding:0}} onClick={()=>openTutEdit(task.de)}>📖 {t.editTutorial}</button>}
      </div>
    </div>;
  };

  // Tutorial edit modal - inline to prevent focus loss
  const tutEditJSX = editTut ? <div style={ov} onClick={()=>setEditTut(null)}><div style={{...mod,maxWidth:460,padding:0,maxHeight:"90vh",overflow:"auto"}} onClick={e=>e.stopPropagation()}>
    <div style={{padding:"16px 20px 10px",borderBottom:"1px solid #F1F5F9"}}>
      <h3 style={{margin:0,fontSize:16,fontFamily:F,color:"#1E293B"}}>📖 {t.editTutorial}: {editTut}</h3>
    </div>
    <div style={{padding:"12px 20px 20px"}}>
      {tutSteps.map((s,i)=> <div key={`step-${i}`} style={{padding:10,background:"#F8FAFC",borderRadius:10,marginBottom:8,border:"1px solid #E2E8F0"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
          <span style={{width:22,height:22,borderRadius:"50%",background:"#8B5CF6",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</span>
          <strong style={{flex:1,fontSize:13,color:"#1E293B"}}>{t.step} {i+1}</strong>
          {tutSteps.length>1&&<button style={delB} onClick={()=>rmTutStep(i)}>×</button>}
        </div>
        <input style={{...inpS,marginBottom:4}} placeholder={t.stepText} value={s.textDe} onChange={e=>updStep(i,"textDe",e.target.value)}/>
        <input style={{...inpS,marginBottom:4}} placeholder={t.stepTextVi} value={s.textVi} onChange={e=>updStep(i,"textVi",e.target.value)}/>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          {s.photo?<div style={{position:"relative",display:"inline-block"}}><img src={s.photo} style={{height:40,borderRadius:6}} alt="step"/><button style={{position:"absolute",top:-4,right:-4,background:"rgba(0,0,0,.6)",color:"#fff",border:"none",borderRadius:"50%",width:16,height:16,fontSize:10,cursor:"pointer",lineHeight:"16px"}} onClick={()=>updStep(i,"photo",null)}>×</button></div>
          :<label style={{fontSize:11,color:"#3B82F6",cursor:"pointer"}}>📷 {t.stepPhoto}<input type="file" accept="image/*" style={{display:"none"}} onChange={e=>stepPhoto(i,e)}/></label>}
        </div>
      </div>)}
      <button style={{background:"none",border:"1px dashed #8B5CF6",borderRadius:8,padding:"6px 14px",fontSize:12,color:"#8B5CF6",cursor:"pointer",width:"100%",fontFamily:F,marginBottom:10}} onClick={addTutStep}>+ {t.addStep}</button>
      <input style={{...inpS,marginBottom:10}} placeholder={t.videoUrl} value={tutVideo} onChange={e=>setTutVideo(e.target.value)}/>
      <div style={{display:"flex",gap:8}}>
        <button style={{...btnG,flex:1}} onClick={()=>setEditTut(null)}>{t.cancel}</button>
        <button style={{...btnP,flex:1}} onClick={saveTut}>{t.save}</button>
      </div>
    </div>
  </div></div> : null;

  return <div>
    {tutEditJSX}
    <div style={{display:"flex",gap:6,marginBottom:14}}><button style={{...tabB,...(mode==="daily"?tabA:{})}} onClick={()=>setMode("daily")}>☀️ {t.dailyTasks}</button><button style={{...tabB,...(mode==="weekly"?tabA:{})}} onClick={()=>setMode("weekly")}>🔄 {t.weeklyTasks}</button></div>
    {mode==="daily"&&<div>{st.dailyTasks.map((task,i)=><TaskItem key={i} task={task} onDel={()=>dD(i)}/>)}
      <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:12,padding:12,background:"#F8FAFC",borderRadius:10}}><input style={inpS} placeholder={t.taskNameDe} value={nd} onChange={e=>setNd(e.target.value)}/><input style={inpS} placeholder={t.taskNameVi} value={nv} onChange={e=>setNv(e.target.value)}/><div style={{display:"flex",gap:6,alignItems:"center"}}><label style={{fontSize:12,color:"#64748B"}}>⭐</label><input style={{...inpS,width:60}} type="number" min="1" max="10" value={npts} onChange={e=>setNpts(e.target.value)}/><button style={{...btnS,flex:1}} onClick={aD}>+ {t.addTask}</button></div></div></div>}
    {mode==="weekly"&&<div>{st.weeklyAreas.map(area=><div key={area.id} style={{...aCard,borderLeftColor:area.color,marginBottom:10}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><strong style={{flex:1,fontSize:14,color:"#1E293B"}}>{t[area.id]}</strong></div>
      {area.tasks.map((task,ti)=><TaskItem key={ti} task={task} onDel={()=>dW(area.id,ti)}/>)}
    </div>)}
    <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:8,padding:12,background:"#F8FAFC",borderRadius:10}}><select style={inpS} value={aid} onChange={e=>setAid(e.target.value)}>{st.weeklyAreas.map(a=><option key={a.id} value={a.id}>{t[a.id]}</option>)}</select><input style={inpS} placeholder={t.taskNameDe} value={nd} onChange={e=>setNd(e.target.value)}/><input style={inpS} placeholder={t.taskNameVi} value={nv} onChange={e=>setNv(e.target.value)}/><div style={{display:"flex",gap:6,alignItems:"center"}}><label style={{fontSize:12,color:"#64748B"}}>⭐</label><input style={{...inpS,width:60}} type="number" min="1" max="10" value={npts} onChange={e=>setNpts(e.target.value)}/><button style={{...btnS,flex:1}} onClick={aW}>+ {t.addTask}</button></div></div></div>}
  </div>;
}

function RoleMgr({t,st,sv,rpin,show}){
  const RI={owner:"👑",manager:"🔧",resident:"👤"};
  const ch=async(uid,nr)=>{const ok=await rpin();if(!ok)return;sv({...st,users:st.users.map(u=>u.id===uid?{...u,role:nr}:u)});show("✓");};
  return <div>{st.users.map(u=><div key={u.id} style={{display:"flex",alignItems:"center",gap:8,padding:12,marginBottom:6,background:"#fff",borderRadius:10,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}><span style={{fontSize:16}}>{RI[u.role]}</span><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:"#1E293B"}}>{u.name}</div><div style={{fontSize:11,color:"#94A3B8"}}>{u.room}</div></div>{u.role==="owner"?<span style={{fontSize:12,color:"#8B5CF6",fontWeight:600}}>{t.owner}</span>:<select style={{...inpS,width:"auto",fontSize:12}} value={u.role} onChange={e=>ch(u.id,e.target.value)}><option value="manager">🔧 {t.manager}</option><option value="resident">👤 {t.resident}</option></select>}</div>)}</div>;
}

function PermEdit({t,st,sv,rpin,show}){
  const[er,setEr]=useState("manager");
  const tog=async perm=>{if(er==="owner")return;if(CRIT_PERMS.includes(perm)){const ok=await rpin();if(!ok)return;}const cur=st.rolePerms[er]||[];sv({...st,rolePerms:{...st.rolePerms,[er]:cur.includes(perm)?cur.filter(p=>p!==perm):[...cur,perm]}});show("✓");};
  const perms=st.rolePerms[er]||[];
  return <div>
    <div style={{display:"flex",gap:6,marginBottom:16}}>{["manager","resident"].map(r=><button key={r} style={{...tabB,...(er===r?tabA:{})}} onClick={()=>setEr(r)}>{r==="manager"?"🔧":"👤"} {t[r]}</button>)}</div>
    <div style={{background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
      {ALL_PERMS.map((perm,i)=>{const on=perms.includes(perm);return <div key={perm} style={{display:"flex",alignItems:"center",padding:"10px 14px",borderBottom:i<ALL_PERMS.length-1?"1px solid #F1F5F9":"none",gap:10}}>
        <button style={{width:38,height:22,borderRadius:11,border:"none",background:on?"#3B82F6":"#E2E8F0",cursor:"pointer",position:"relative",flexShrink:0}} onClick={()=>tog(perm)}><div style={{width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:on?19:3,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.15)"}}/></button>
        <div style={{flex:1,fontSize:13,color:"#1E293B",fontWeight:500}}>{CRIT_PERMS.includes(perm)&&"🔐 "}{t[`perm_${perm}`]}</div>
      </div>;})}
    </div>
  </div>;
}

function BonusCfg({t,st,sv,rpin,show}){
  const[rate,setRate]=useState(st.penaltyRate||5);
  const[rew,setRew]=useState(st.rewardText||t.defaultReward);
  const[maxDiff,setMaxDiff]=useState(st.maxDiffPercent||30);
  const[ppPen,setPpPen]=useState(st.penaltyPerMissingPoint||2);
  const[catchUp,setCatchUp]=useState(st.catchUpEnabled!==false);
  const go=async()=>{const ok=await rpin();if(!ok)return;sv({...st,penaltyRate:Number(rate),rewardText:rew,maxDiffPercent:Number(maxDiff),penaltyPerMissingPoint:Number(ppPen),catchUpEnabled:catchUp});show("✓");};
  return <div>
    <div style={{background:"#fff",borderRadius:12,padding:16,marginBottom:12,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
      <h4 style={{margin:"0 0 12px",fontSize:14,fontWeight:700,color:"#1E293B",fontFamily:F}}>🏆 {t.rewardText}</h4>
      <div style={{marginBottom:14}}><label style={lbl}>💰 {t.penaltyPerTask}</label><input style={inp} type="number" min="0" step="0.5" value={rate} onChange={e=>setRate(e.target.value)}/></div>
      <div style={{marginBottom:14}}><label style={lbl}>🎁 {t.rewardText}</label><input style={inp} value={rew} onChange={e=>setRew(e.target.value)}/></div>
    </div>
    <div style={{background:"#fff",borderRadius:12,padding:16,marginBottom:12,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
      <h4 style={{margin:"0 0 4px",fontSize:14,fontWeight:700,color:"#1E293B",fontFamily:F}}>👥 {t.fairness}</h4>
      <p style={{margin:"0 0 12px",fontSize:12,color:"#64748B"}}>{t.minPointsAuto}: {st.lang==="de"?"Zimmerpunkte ÷ Bewohner = Soll pro Person":"Điểm phòng ÷ Cư dân = Soll mỗi người"}</p>
      <div style={{marginBottom:14}}>
        <label style={lbl}>📊 {t.maxDiff} (%)</label>
        <input style={inp} type="number" min="0" max="100" value={maxDiff} onChange={e=>setMaxDiff(e.target.value)}/>
        <p style={{margin:"4px 0 0",fontSize:11,color:"#94A3B8"}}>{st.lang==="de"?"Erlaubter Unterschied zwischen Mitbewohnern im gleichen Zimmer":"Chênh lệch cho phép giữa các bạn cùng phòng"}</p>
      </div>
      <div style={{marginBottom:14}}>
        <label style={lbl}>💸 {t.penaltyPerPoint}</label>
        <input style={inp} type="number" min="0" step="0.5" value={ppPen} onChange={e=>setPpPen(e.target.value)}/>
        <p style={{margin:"4px 0 0",fontSize:11,color:"#94A3B8"}}>{st.lang==="de"?"Strafe pro fehlendem Punkt unter Mindestpunktzahl":"Phạt mỗi điểm thiếu dưới mức tối thiểu"}</p>
      </div>
      <div style={{marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
        <button style={{width:38,height:22,borderRadius:11,border:"none",background:catchUp?"#3B82F6":"#E2E8F0",cursor:"pointer",position:"relative",flexShrink:0}} onClick={()=>setCatchUp(!catchUp)}>
          <div style={{width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:catchUp?19:3,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.15)"}}/>
        </button>
        <div><div style={{fontSize:13,fontWeight:600,color:"#1E293B"}}>📋 {t.makeupTasks}</div><div style={{fontSize:11,color:"#94A3B8"}}>{t.makeupInfo}</div></div>
      </div>
    </div>
    <button style={{...btnP,width:"100%"}} onClick={go}>{t.save}</button>
  </div>;
}

function PinChg({t,st,sv,rpin,show}){
  const[np,setNp]=useState("");
  const go=async()=>{if(np.length<4)return;const ok=await rpin();if(!ok)return;sv({...st,masterPin:np});setNp("");show(st.lang==="de"?"PIN geändert!":"Đã đổi PIN!");};
  return <div style={{background:"#fff",borderRadius:12,padding:16,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
    <label style={lbl}>🔐 {t.changePin}</label>
    <p style={{fontSize:12,color:"#94A3B8",margin:"0 0 12px"}}>{st.lang==="de"?`Aktuelle PIN: ${"•".repeat(st.masterPin.length)} (${st.masterPin.length} Zeichen)`:`PIN hiện tại: ${"•".repeat(st.masterPin.length)} (${st.masterPin.length} ký tự)`}</p>
    <input style={inp} type="password" placeholder={t.newPin} value={np} onChange={e=>setNp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}/>
    <button style={{...btnP,marginTop:12,width:"100%"}} onClick={go}>{t.save}</button>
  </div>;
}

function SheetsCfg({t,st,sv,rpin}){
  const[url,setUrl]=useState(st.sheetsUrl||"");
  const go=async()=>{const ok=await rpin();if(!ok)return;sv({...st,sheetsUrl:url});};
  return <div>
    <div style={{background:"#fff",borderRadius:12,padding:16,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
      <label style={lbl}>📊 {t.sheetsUrl}</label><input style={inp} placeholder={t.sheetsHelp} value={url} onChange={e=>setUrl(e.target.value)}/>
      <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8}}><div style={{width:8,height:8,borderRadius:"50%",background:st.sheetsUrl?"#10B981":"#EF4444"}}/><span style={{fontSize:12,color:"#64748B"}}>{st.sheetsUrl?t.sheetsConn:t.sheetsNo}</span></div>
      <button style={{...btnP,marginTop:12}} onClick={go}>{t.save}</button>
    </div>
    <div style={{background:"#F8FAFC",borderRadius:10,padding:14,marginTop:14}}>
      <p style={{fontSize:13,fontWeight:600,color:"#475569",margin:"0 0 8px"}}>Google Apps Script:</p>
      <code style={{display:"block",background:"#1E293B",color:"#A5F3FC",padding:12,borderRadius:8,fontSize:11,lineHeight:1.5,whiteSpace:"pre-wrap",fontFamily:"'Fira Code',monospace"}}>{`function doPost(e) {\n  var sheet = SpreadsheetApp\n    .getActiveSpreadsheet()\n    .getActiveSheet();\n  var data = JSON.parse(\n    e.postData.contents);\n  sheet.appendRow([\n    data.date, data.time, data.week,\n    data.person, data.room,\n    data.area, data.task, data.points\n  ]);\n  return ContentService\n    .createTextOutput("OK");\n}`}</code>
    </div>
  </div>;
}
