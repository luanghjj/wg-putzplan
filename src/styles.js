/* Premium Design System — WG Putzplan
 * Inspired by: Apple HIG + iOS 18 + Notion aesthetic
 * Ultra-clean, vibrant gradients, bold typography
 */

export const F = "-apple-system, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";

/* Colors — refined palette */
export const C = {
  bg: "#F2F2F7",
  white: "#FFFFFF",
  surface: "rgba(255,255,255,0.82)",
  surfaceElevated: "#FFFFFF",
  text: "#1C1C1E",
  textSecondary: "#8E8E93",
  accent: "#007AFF",
  accentHover: "#0A84FF",
  green: "#30D158",
  red: "#FF453A",
  orange: "#FF9F0A",
  yellow: "#FFD60A",
  purple: "#BF5AF2",
  teal: "#64D2FF",
  pink: "#FF375F",
  border: "rgba(0,0,0,0.04)",
  /* Apple-grade shadows */
  shadowSm: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
  shadowMd: "0 4px 16px rgba(0,0,0,0.06), 0 12px 32px rgba(0,0,0,0.04)",
  shadowLg: "0 8px 30px rgba(0,0,0,0.08), 0 20px 60px rgba(0,0,0,0.06)",
};

/* Inputs */
export const inp = {
  width:"100%", padding:"14px 16px",
  border:"none", borderRadius:12, fontSize:17,
  fontFamily:F, outline:"none", boxSizing:"border-box",
  background:"rgba(120,120,128,0.08)", color:C.text,
  transition:"all 0.25s cubic-bezier(0.25,0.1,0.25,1)",
};
export const inpS = {
  padding:"10px 14px",
  border:"none", borderRadius:10, fontSize:14,
  fontFamily:F, outline:"none", boxSizing:"border-box", width:"100%",
  background:"rgba(120,120,128,0.08)", color:C.text,
  transition:"all 0.25s cubic-bezier(0.25,0.1,0.25,1)",
};

/* Buttons — pill shape, vibrant fills */
export const btnP = {
  padding:"14px 28px", background:C.accent, color:"#fff",
  border:"none", borderRadius:980, fontSize:17, fontWeight:600,
  cursor:"pointer", fontFamily:F, whiteSpace:"nowrap",
  transition:"all 0.25s cubic-bezier(0.25,0.1,0.25,1)",
  letterSpacing:"-0.01em",
};
export const btnG = {
  padding:"14px 28px", background:"rgba(0,122,255,0.08)", color:C.accent,
  border:"none", borderRadius:980, fontSize:17, fontWeight:600,
  cursor:"pointer", fontFamily:F,
  transition:"all 0.25s cubic-bezier(0.25,0.1,0.25,1)",
};
export const btnS = {
  padding:"8px 18px", background:C.accent, color:"#fff",
  border:"none", borderRadius:980, fontSize:14, fontWeight:600,
  cursor:"pointer", fontFamily:F,
  transition:"all 0.25s cubic-bezier(0.25,0.1,0.25,1)",
};
export const lbl = { display:"block", fontSize:13, fontWeight:500, color:C.textSecondary, marginBottom:8, letterSpacing:"0.01em" };

/* Modal overlay */
export const ov = {
  position:"fixed", inset:0,
  background:"rgba(0,0,0,0.4)",
  display:"flex", alignItems:"center", justifyContent:"center",
  zIndex:999, padding:20,
  backdropFilter:"blur(40px) saturate(180%)",
  WebkitBackdropFilter:"blur(40px) saturate(180%)",
};
export const mod = {
  background:C.white, borderRadius:20, padding:28, width:"100%", maxWidth:340,
  boxShadow:C.shadowLg,
  animation:"modalIn .35s cubic-bezier(0.34,1.56,0.64,1)",
};

/* Tabs — segmented control style */
export const tabB = {
  padding:"8px 16px",
  border:"none", borderRadius:980,
  background:"transparent", fontSize:13, fontWeight:500,
  color:C.textSecondary, cursor:"pointer", fontFamily:F,
  transition:"all 0.2s cubic-bezier(0.25,0.1,0.25,1)",
};
export const tabA = { background:C.white, color:C.text, fontWeight:600, boxShadow:"0 1px 4px rgba(0,0,0,0.08)" };

/* Cards */
export const aCard = {
  background:C.white, borderRadius:16, borderLeft:"none",
  padding:16, marginBottom:10,
  boxShadow:C.shadowSm,
  transition:"transform 0.2s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.2s cubic-bezier(0.25,0.1,0.25,1)",
};
export const dBdg = { fontSize:11, color:C.textSecondary, background:"rgba(120,120,128,0.08)", padding:"4px 10px", borderRadius:980, whiteSpace:"nowrap", fontWeight:500 };
export const delB = { background:"none", border:"none", color:C.red, fontSize:18, cursor:"pointer", padding:"0 4px", transition:"transform 0.15s" };

/* Global CSS — premium animations */
export const globalCSS = `
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fillBar{from{width:0}to{width:100%}}
@keyframes modalIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
@keyframes slideUp{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
@keyframes gradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
input:focus,select:focus,textarea:focus{background:rgba(0,122,255,0.06)!important;box-shadow:0 0 0 3px rgba(0,122,255,0.12)!important}
button{transition:all .2s cubic-bezier(0.25,0.1,0.25,1)}
button:active{transform:scale(.97)!important;opacity:.9!important}
::selection{background:rgba(0,122,255,0.18)}
*{-webkit-tap-highlight-color:transparent}
`;
