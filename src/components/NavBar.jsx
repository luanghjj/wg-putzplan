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

  return <>
    {/* Top Header — User info */}
    <div style={{
      background:C.white, borderRadius:20, padding:16, marginBottom:12,
      boxShadow:C.shadowSm,
    }}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        {/* Avatar with gradient */}
        <div style={{
          width:44,height:44,borderRadius:22,flexShrink:0,
          background:`linear-gradient(135deg, ${C.accent}, ${C.purple})`,
          display:"flex",alignItems:"center",justifyContent:"center",
          color:"#fff",fontWeight:700,fontSize:18,fontFamily:F,
          boxShadow:`0 4px 12px rgba(0,122,255,0.25)`,
        }}>{user?.name?.[0]}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:17,fontWeight:700,color:C.text,letterSpacing:"-0.02em"}}>{user?.name}</div>
          <div style={{fontSize:13,color:C.textSecondary,marginTop:1}}>{user?.room!=="—"?user?.room:""}</div>
        </div>
        {/* Time badge */}
        {openCount>0&&<div style={{
          padding:"6px 12px",borderRadius:980,fontSize:13,fontWeight:600,
          background:tl.overdue?"rgba(255,69,58,0.1)":"rgba(255,159,10,0.1)",
          color:tl.overdue?C.red:C.orange,
        }}>
          {tl.overdue?t.overdue:tl.text}
        </div>}
        <button style={{
          background:"rgba(120,120,128,0.08)",border:"none",borderRadius:980,
          padding:"8px 16px",fontSize:13,color:C.textSecondary,cursor:"pointer",fontFamily:F,fontWeight:500,
        }} onClick={onLogout}>{t.logout}</button>
      </div>
    </div>

    {/* Tab Bar — iOS segmented control in card */}
    <div style={{
      background:"rgba(120,120,128,0.08)",
      borderRadius:14,padding:3,marginBottom:14,
      display:"flex",gap:2,
    }}>
      {items.filter(i=>i.s).map(i=>{
        const active=scr===i.id;
        return <button key={i.id} style={{
          flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          gap:2,padding:"8px 2px",border:"none",borderRadius:12,
          background:active?C.white:"transparent",
          color:active?C.accent:C.textSecondary,
          fontSize:10,fontWeight:active?600:500,
          cursor:"pointer",fontFamily:F,position:"relative",
          transition:"all 0.25s cubic-bezier(0.25,0.1,0.25,1)",
          boxShadow:active?"0 1px 4px rgba(0,0,0,0.08)":"none",
        }} onClick={()=>set(i.id)}>
          <Icon name={i.icon} size={20}/>
          <span>{i.l}</span>
          {i.badge&&<span style={{
            position:"absolute",top:2,right:"50%",marginRight:-16,
            minWidth:16,height:16,borderRadius:8,
            background:C.red,color:"#fff",fontSize:9,fontWeight:700,
            display:"flex",alignItems:"center",justifyContent:"center",
            padding:"0 4px",
          }}>{i.badge}</span>}
        </button>;
      })}
    </div>
  </>;
}
