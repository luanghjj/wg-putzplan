import { gwk, grot, getTimeLeft } from "../utils/helpers";
import { F, C } from "../styles";

export default function NavBar({t,scr,set,user,hp,st,isC,onLogout}){
  const RI={owner:"👑",manager:"🔧",resident:"👤"};
  const RC={owner:C.purple,manager:C.orange,resident:C.accent};
  const showA=hp("manage_rooms")||hp("manage_residents")||hp("manage_roles")||hp("config_sheets")||hp("edit_tasks");
  const wk=gwk(new Date());
  let openCount=0;
  st.weeklyAreas.forEach(a=>a.tasks.forEach(ta=>{if(!isC(ta.de,a.id,wk))openCount++;}));
  const tl=getTimeLeft(wk);
  const newReports=(st.reports||[]).filter(r=>r.status==="new").length;
  const items=[
    {id:"plan",icon:"📋",l:t.plan,s:true,badge:openCount>0?openCount:null},
    {id:"leaderboard",icon:"🏆",l:t.leaderboard,s:true},
    {id:"reports",icon:"🚨",l:t.reports,s:true,badge:newReports>0&&(user?.role==="owner"||user?.role==="manager")?newReports:null},
    {id:"rules",icon:"📜",l:t.rules,s:true},
    {id:"history",icon:"📊",l:t.history,s:user?.role==="owner"||user?.role==="manager"},
    {id:"admin",icon:"⚙️",l:t.admin,s:showA},
  ];
  const ni={flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:4,padding:"8px 4px",border:"none",borderRadius:12,background:"transparent",fontSize:11,fontWeight:500,color:C.textSecondary,cursor:"pointer",fontFamily:F,position:"relative",transition:"all 0.15s ease",letterSpacing:"-0.01em"};
  const nia={background:"rgba(0,113,227,0.08)",color:C.accent,fontWeight:700};
  return <div style={{
    background:"rgba(255,255,255,0.72)",
    backdropFilter:"blur(20px) saturate(180%)",
    WebkitBackdropFilter:"blur(20px) saturate(180%)",
    borderRadius:18,padding:14,marginBottom:14,
    boxShadow:C.shadowSm,
    border:`1px solid ${C.border}`,
  }}>
    <div style={{display:"flex",alignItems:"center",gap:10,paddingBottom:10,marginBottom:10,borderBottom:`1px solid ${C.border}`}}>
      <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${RC[user?.role]||C.accent},${C.purple})`,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:15,fontFamily:F,flexShrink:0,boxShadow:`0 2px 8px ${RC[user?.role]||C.accent}40`}}>{user?.name?.[0]}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:14,fontWeight:700,color:C.text,letterSpacing:"-0.022em"}}>{user?.name} <span style={{fontSize:12}}>{RI[user?.role]}</span></div>
        <div style={{fontSize:11,color:C.textSecondary}}>{user?.room!=="—"?user?.room:t[user?.role]}</div>
      </div>
      {openCount>0&&<div style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:10,background:tl.overdue?"rgba(255,59,48,0.1)":"rgba(255,149,0,0.1)",fontSize:11,fontWeight:600,color:tl.overdue?C.red:C.orange,animation:tl.overdue?"pulse 1.5s infinite":"none"}}>
        {tl.overdue?"⚠️ "+t.overdue:`⏰ ${tl.text}`}
      </div>}
      <button style={{background:"rgba(0,0,0,0.04)",border:"none",borderRadius:10,padding:"6px 14px",fontSize:12,color:C.textSecondary,cursor:"pointer",fontFamily:F,fontWeight:500,transition:"all 0.15s"}} onClick={onLogout}>{t.logout}</button>
    </div>
    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{items.filter(i=>i.s).map(i=><button key={i.id} style={{...ni,...(scr===i.id?nia:{})}} onClick={()=>set(i.id)}>
      <span style={{fontSize:14}}>{i.icon}</span><span>{i.l}</span>
      {i.badge&&<span style={{position:"absolute",top:-3,right:0,minWidth:16,height:16,borderRadius:8,background:C.red,color:"#fff",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px",animation:"pulse 1.5s infinite",boxShadow:`0 1px 4px ${C.red}60`}}>{i.badge}</span>}
    </button>)}</div>
  </div>;
}
