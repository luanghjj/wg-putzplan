import { F, C } from "../styles";
import { RULES } from "../data/constants";

const categoryColors = [
  {gradient:"linear-gradient(135deg, #007AFF, #5856D6)", light:"rgba(0,122,255,0.06)"},
  {gradient:"linear-gradient(135deg, #5856D6, #BF5AF2)", light:"rgba(88,86,214,0.06)"},
  {gradient:"linear-gradient(135deg, #FF9F0A, #FF375F)", light:"rgba(255,159,10,0.06)"},
  {gradient:"linear-gradient(135deg, #30D158, #64D2FF)", light:"rgba(48,209,88,0.06)"},
  {gradient:"linear-gradient(135deg, #FF375F, #FF453A)", light:"rgba(255,55,95,0.06)"},
  {gradient:"linear-gradient(135deg, #64D2FF, #007AFF)", light:"rgba(100,210,255,0.06)"},
];

export default function RulesScreen({t,lang,st}){
  const isVi=lang==="vi";
  const managers=st.users.filter(u=>u.role==="manager");
  const mp1=st.managerPhoto1||null;
  const mp2=st.managerPhoto2||null;
  const m1=managers[0];
  const m2=managers[1];

  return <div>
    <h2 style={{fontSize:28,fontWeight:800,color:C.text,margin:"0 0 20px",fontFamily:F,letterSpacing:"-0.03em"}}>
      {t.rulesTitle}
    </h2>

    {/* Manager Contact */}
    {managers.length>0&&<div style={{
      background:C.white,borderRadius:20,padding:24,marginBottom:16,
      boxShadow:C.shadowSm,
    }}>
      <div style={{display:"flex",justifyContent:"center",gap:32,marginBottom:16}}>
        {[{photo:mp1,mgr:m1},{photo:mp2,mgr:m2}].filter(x=>x.mgr).map((x,i)=>
          <div key={i} style={{textAlign:"center"}}>
            <div style={{
              width:72,height:72,borderRadius:36,overflow:"hidden",
              margin:"0 auto 10px",
              background:`linear-gradient(135deg, ${C.accent}, ${C.purple})`,
              padding:2,
            }}>
              <div style={{width:"100%",height:"100%",borderRadius:35,overflow:"hidden",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {x.photo?<img src={x.photo} alt={x.mgr?.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                :<span style={{fontSize:24,fontWeight:700,color:C.textSecondary}}>{x.mgr?.name?.[0]||"?"}</span>}
              </div>
            </div>
            <div style={{fontSize:15,fontWeight:700,color:C.text}}>{x.mgr?.name}</div>
            <div style={{fontSize:12,color:C.textSecondary}}>{x.mgr?.room}</div>
          </div>
        )}
      </div>
      <div style={{textAlign:"center",fontSize:14,color:C.textSecondary,lineHeight:1.5}}>
        {isVi?"Mọi thắc mắc xin liên hệ với 2 quản lý":"Bei Fragen wenden Sie sich bitte an die 2 Manager"}
      </div>
    </div>}

    {/* Rules — gradient accent cards */}
    {RULES.map((cat,ci)=>{
      const clr=categoryColors[ci%categoryColors.length];
      return <div key={ci} style={{
        background:C.white,borderRadius:16,padding:0,marginBottom:10,
        boxShadow:C.shadowSm,overflow:"hidden",
      }}>
        {/* Category header with gradient bar */}
        <div style={{
          padding:"14px 16px",
          background:clr.light,
          display:"flex",alignItems:"center",gap:10,
          borderBottom:"1px solid rgba(0,0,0,0.03)",
        }}>
          <div style={{
            width:32,height:32,borderRadius:10,
            background:clr.gradient,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:16,
            boxShadow:"0 2px 8px rgba(0,0,0,0.1)",
          }}>{cat.icon}</div>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:C.text}}>{isVi?cat.catVi:cat.catDe}</div>
            <div style={{fontSize:11,color:C.textSecondary}}>{isVi?cat.catDe:cat.catVi}</div>
          </div>
        </div>
        {/* Items */}
        <div style={{padding:"8px 16px 12px"}}>
          {cat.items.map((item,ii)=><div key={ii} style={{
            display:"flex",gap:10,padding:"10px 0",
            borderBottom:ii<cat.items.length-1?"1px solid rgba(0,0,0,0.03)":"none",
          }}>
            <div style={{width:6,height:6,borderRadius:3,background:C.accent,marginTop:6,flexShrink:0}}/>
            <div>
              <div style={{fontSize:14,color:C.text,lineHeight:1.5,fontWeight:500}}>{isVi?item.vi:item.de}</div>
              <div style={{fontSize:12,color:C.textSecondary,lineHeight:1.4,marginTop:2}}>{isVi?item.de:item.vi}</div>
            </div>
          </div>)}
        </div>
      </div>;
    })}
  </div>;
}
