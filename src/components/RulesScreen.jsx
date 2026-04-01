import { F, C } from "../styles";
import { RULES } from "../data/constants";

export default function RulesScreen({t,lang,st}){
  const isVi=lang==="vi";
  const managers=st.users.filter(u=>u.role==="manager");
  const mp1=st.managerPhoto1||null;
  const mp2=st.managerPhoto2||null;
  const m1=managers[0];
  const m2=managers[1];

  return <div>
    <h2 style={{fontSize:20,color:"#1E293B",margin:"0 0 14px",fontFamily:F}}>📜 {t.rulesTitle}</h2>

    {/* Manager Contact Card */}
    {managers.length>0&&<div style={{background:"linear-gradient(135deg,#EEF2FF,#E0E7FF)",borderRadius:18,padding:20,marginBottom:16,boxShadow:"0 4px 20px rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.15)"}}>
      <div style={{display:"flex",justifyContent:"center",gap:24,marginBottom:14}}>
        {[{photo:mp1,mgr:m1},{photo:mp2,mgr:m2}].filter(x=>x.mgr).map((x,i)=>
          <div key={i} style={{textAlign:"center"}}>
            <div style={{width:90,height:90,borderRadius:18,overflow:"hidden",border:"3px solid #fff",boxShadow:"0 4px 16px rgba(99,102,241,0.2)",margin:"0 auto 8px",background:"linear-gradient(135deg,#C7D2FE,#A5B4FC)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {x.photo?<img src={x.photo} alt={x.mgr?.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              :<span style={{fontSize:36,color:"#6366F1",fontWeight:700}}>{x.mgr?.name?.[0]||"?"}</span>}
            </div>
            <div style={{fontSize:14,fontWeight:700,color:"#3730A3"}}>{x.mgr?.name}</div>
            <div style={{fontSize:11,color:"#6366F1",fontWeight:500}}>{x.mgr?.room} · 🔧 {isVi?"Quản lý":"Manager"}</div>
          </div>
        )}
      </div>
      <div style={{textAlign:"center",fontSize:13,color:"#4338CA",fontWeight:600,lineHeight:1.5}}>
        {isVi?"📞 Mọi thắc mắc xin liên hệ với 2 quản lý":"📞 Bei Fragen wenden Sie sich bitte an die 2 Manager"}
      </div>
    </div>}

    {RULES.map((cat,ci)=><div key={ci} style={{background:"#fff",borderRadius:12,padding:12,marginBottom:8,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,paddingBottom:6,borderBottom:"1px solid #F1F5F9"}}><span style={{fontSize:18}}>{cat.icon}</span><strong style={{fontSize:14,color:"#1E293B"}}>{isVi?cat.catVi:cat.catDe}</strong><span style={{fontSize:12,color:"#64748B"}}>{isVi?cat.catDe:cat.catVi}</span></div>
      {cat.items.map((item,ii)=><div key={ii} style={{display:"flex",gap:8,padding:"5px 0",fontSize:13}}><span style={{color:"#3B82F6",fontWeight:700}}>•</span><div><div style={{fontSize:13,color:"#334155"}}>{isVi?item.vi:item.de}</div><div style={{fontSize:11,color:"#94A3B8"}}>{isVi?item.de:item.vi}</div></div></div>)}
    </div>)}
  </div>;
}
