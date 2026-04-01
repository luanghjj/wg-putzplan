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
    <h2 style={{fontSize:28,fontWeight:700,color:C.text,margin:"0 0 20px",fontFamily:F,letterSpacing:"-0.02em"}}>📜 {t.rulesTitle}</h2>

    {/* Manager Contact — Apple-style card */}
    {managers.length>0&&<div style={{background:C.white,borderRadius:18,padding:28,marginBottom:20,boxShadow:C.shadowSm}}>
      <div style={{display:"flex",justifyContent:"center",gap:28,marginBottom:16}}>
        {[{photo:mp1,mgr:m1},{photo:mp2,mgr:m2}].filter(x=>x.mgr).map((x,i)=>
          <div key={i} style={{textAlign:"center"}}>
            <div style={{width:80,height:80,borderRadius:40,overflow:"hidden",margin:"0 auto 10px",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
              {x.photo?<img src={x.photo} alt={x.mgr?.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              :<span style={{fontSize:28,fontWeight:600,color:C.textSecondary}}>{x.mgr?.name?.[0]||"?"}</span>}
            </div>
            <div style={{fontSize:15,fontWeight:600,color:C.text,letterSpacing:"-0.01em"}}>{x.mgr?.name}</div>
            <div style={{fontSize:12,color:C.textSecondary}}>{x.mgr?.room}</div>
          </div>
        )}
      </div>
      <div style={{textAlign:"center",fontSize:14,color:C.textSecondary,lineHeight:1.5}}>
        {isVi?"Mọi thắc mắc xin liên hệ với 2 quản lý":"Bei Fragen wenden Sie sich bitte an die 2 Manager"}
      </div>
    </div>}

    {/* Rules — Apple cards, no heavy borders */}
    {RULES.map((cat,ci)=><div key={ci} style={{background:C.white,borderRadius:18,padding:20,marginBottom:10,boxShadow:C.shadowSm}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,paddingBottom:8,borderBottom:"1px solid rgba(0,0,0,0.04)"}}>
        <span style={{fontSize:18}}>{cat.icon}</span>
        <strong style={{fontSize:15,fontWeight:600,color:C.text,letterSpacing:"-0.01em"}}>{isVi?cat.catVi:cat.catDe}</strong>
        <span style={{fontSize:12,color:C.textSecondary}}>{isVi?cat.catDe:cat.catVi}</span>
      </div>
      {cat.items.map((item,ii)=><div key={ii} style={{display:"flex",gap:8,padding:"6px 0",fontSize:14}}>
        <span style={{color:C.accent,fontWeight:500,fontSize:12,marginTop:2}}>●</span>
        <div>
          <div style={{fontSize:14,color:C.text,lineHeight:1.5}}>{isVi?item.vi:item.de}</div>
          <div style={{fontSize:12,color:C.textSecondary,lineHeight:1.4}}>{isVi?item.de:item.vi}</div>
        </div>
      </div>)}
    </div>)}
  </div>;
}
