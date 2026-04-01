import { gwk, getTimeLeft } from "../utils/helpers";
import { F, C } from "../styles";
import Icon from "./Icon";

export default function NavBar({t,scr,set,user,hp,st,isC,onLogout}){
  const showA=hp("manage_rooms")||hp("manage_residents")||hp("manage_roles")||hp("config_sheets")||hp("edit_tasks");
  const wk=gwk(new Date());
  let openCount=0;
  st.weeklyAreas.forEach(a=>a.tasks.forEach(ta=>{if(!isC(ta.de,a.id,wk))openCount++;}));
  const tl=getTimeLeft(wk);
  const newReports=(st.reports||[]).filter(r=>r.status==="new").length;
  const items=[
    {id:"plan",icon:"plan",l:t.plan,s:true,badge:openCount>0?openCount:null},
    {id:"leaderboard",icon:"trophy",l:t.leaderboard,s:true},
    {id:"reports",icon:"alert",l:t.reports,s:true,badge:newReports>0&&(user?.role==="owner"||user?.role==="manager")?newReports:null},
    {id:"rules",icon:"rules",l:t.rules,s:true},
    {id:"history",icon:"history",l:t.history,s:user?.role==="owner"||user?.role==="manager"},
    {id:"admin",icon:"settings",l:t.admin,s:showA},
  ];

  const ni={
    flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:4,
    padding:"8px 4px",border:"none",borderRadius:980,
    background:"transparent",fontSize:12,fontWeight:400,
    color:C.textSecondary,cursor:"pointer",fontFamily:F,
    position:"relative",transition:"all 0.2s cubic-bezier(0.25,0.1,0.25,1)",
  };
  const nia={background:"rgba(0,113,227,0.06)",color:C.accent,fontWeight:600};

  const roleLabel = user?.role==="owner"?"👑":user?.role==="manager"?"⚙":"";

  return <div style={{
    background:"rgba(255,255,255,0.85)",
    backdropFilter:"blur(20px) saturate(180%)",
    WebkitBackdropFilter:"blur(20px) saturate(180%)",
    borderRadius:18,padding:14,marginBottom:14,
    boxShadow:C.shadowSm,
  }}>
    <div style={{display:"flex",alignItems:"center",gap:10,paddingBottom:10,marginBottom:10,borderBottom:"1px solid rgba(0,0,0,0.04)"}}>
      <div style={{width:36,height:36,borderRadius:18,background:C.bg,color:C.text,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:600,fontSize:15,fontFamily:F,flexShrink:0}}>{user?.name?.[0]}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:15,fontWeight:600,color:C.text,letterSpacing:"-0.01em"}}>{user?.name} <span style={{fontSize:12,color:C.textSecondary}}>{roleLabel}</span></div>
        <div style={{fontSize:12,color:C.textSecondary}}>{user?.room!=="—"?user?.room:""}</div>
      </div>
      {openCount>0&&<div style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:980,background:tl.overdue?"rgba(255,59,48,0.06)":"rgba(255,149,0,0.06)",fontSize:12,fontWeight:500,color:tl.overdue?C.red:C.orange}}>
        {tl.overdue?t.overdue:tl.text}
      </div>}
      <button style={{background:"transparent",border:"none",borderRadius:980,padding:"6px 14px",fontSize:13,color:C.accent,cursor:"pointer",fontFamily:F,fontWeight:400}} onClick={onLogout}>{t.logout}</button>
    </div>
    <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{items.filter(i=>i.s).map(i=><button key={i.id} style={{...ni,...(scr===i.id?nia:{})}} onClick={()=>set(i.id)}>
      <Icon name={i.icon} size={16}/><span>{i.l}</span>
      {i.badge&&<span style={{position:"absolute",top:-3,right:0,minWidth:16,height:16,borderRadius:8,background:C.red,color:"#fff",fontSize:9,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px"}}>{i.badge}</span>}
    </button>)}</div>
  </div>;
}
