import { F } from "../styles";
import { RULES } from "../data/constants";

export default function RulesScreen({t,lang}){
  const isVi=lang==="vi";
  return <div><h2 style={{fontSize:20,color:"#1E293B",margin:"0 0 14px",fontFamily:F}}>📜 {t.rulesTitle}</h2>
    {RULES.map((cat,ci)=><div key={ci} style={{background:"#fff",borderRadius:12,padding:12,marginBottom:8,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,paddingBottom:6,borderBottom:"1px solid #F1F5F9"}}><span style={{fontSize:18}}>{cat.icon}</span><strong style={{fontSize:14,color:"#1E293B"}}>{isVi?cat.catVi:cat.catDe}</strong><span style={{fontSize:12,color:"#64748B"}}>{isVi?cat.catDe:cat.catVi}</span></div>
      {cat.items.map((item,ii)=><div key={ii} style={{display:"flex",gap:8,padding:"5px 0",fontSize:13}}><span style={{color:"#3B82F6",fontWeight:700}}>•</span><div><div style={{fontSize:13,color:"#334155"}}>{isVi?item.vi:item.de}</div><div style={{fontSize:11,color:"#94A3B8"}}>{isVi?item.de:item.vi}</div></div></div>)}
    </div>)}</div>;
}
