/* Apple Design System — WG Putzplan
 * Based on: apple-brand-design.skill
 * Philosophy: "Simplicity is the ultimate sophistication."
 */

export const F = "-apple-system, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";

/* Colors — tối đa 2 accent, nền trắng/off-white */
export const C = {
  bg: "#F5F5F7",
  white: "#FFFFFF",
  surface: "rgba(255,255,255,0.72)",
  surfaceElevated: "#FFFFFF",
  text: "#1D1D1F",
  textSecondary: "#86868B",
  accent: "#0071E3",
  accentHover: "#0077ED",
  green: "#34C759",
  red: "#FF3B30",
  orange: "#FF9500",
  yellow: "#FFCC00",
  purple: "#AF52DE",
  border: "rgba(0,0,0,0.06)",
  /* Apple shadows — nhẹ, tinh tế */
  shadowSm: "0 2px 12px rgba(0,0,0,0.04)",
  shadowMd: "0 4px 24px rgba(0,0,0,0.06)",
  shadowLg: "0 12px 40px rgba(0,0,0,0.08)",
};

/* Inputs — clean, minimal border */
export const inp = {
  width:"100%", padding:"12px 16px",
  border:"1px solid rgba(0,0,0,0.06)", borderRadius:12, fontSize:17,
  fontFamily:F, outline:"none", boxSizing:"border-box",
  background:C.white, color:C.text,
  transition:"border-color 0.2s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.2s cubic-bezier(0.25,0.1,0.25,1)",
};
export const inpS = {
  padding:"8px 12px",
  border:"1px solid rgba(0,0,0,0.06)", borderRadius:10, fontSize:14,
  fontFamily:F, outline:"none", boxSizing:"border-box", width:"100%",
  background:C.white, color:C.text,
  transition:"border-color 0.2s cubic-bezier(0.25,0.1,0.25,1)",
};

/* Buttons — pill shape (Apple signature) */
export const btnP = {
  padding:"12px 22px", background:C.accent, color:"#fff",
  border:"none", borderRadius:980, fontSize:17, fontWeight:400,
  cursor:"pointer", fontFamily:F, whiteSpace:"nowrap",
  transition:"background 0.2s cubic-bezier(0.25,0.1,0.25,1)",
  letterSpacing:0,
};
export const btnG = {
  padding:"12px 22px", background:"transparent", color:C.accent,
  border:"none", borderRadius:980, fontSize:17, fontWeight:400,
  cursor:"pointer", fontFamily:F,
  transition:"opacity 0.2s cubic-bezier(0.25,0.1,0.25,1)",
};
export const btnS = {
  padding:"8px 18px", background:C.accent, color:"#fff",
  border:"none", borderRadius:980, fontSize:14, fontWeight:500,
  cursor:"pointer", fontFamily:F,
  transition:"background 0.2s cubic-bezier(0.25,0.1,0.25,1)",
};
export const lbl = { display:"block", fontSize:12, fontWeight:400, color:C.textSecondary, marginBottom:6, letterSpacing:"0.01em" };

/* Modal overlay — glassmorphism tinh tế */
export const ov = {
  position:"fixed", inset:0,
  background:"rgba(0,0,0,0.35)",
  display:"flex", alignItems:"center", justifyContent:"center",
  zIndex:999, padding:20,
  backdropFilter:"blur(20px) saturate(180%)",
  WebkitBackdropFilter:"blur(20px) saturate(180%)",
};
export const mod = {
  background:C.white, borderRadius:18, padding:28, width:"100%", maxWidth:340,
  boxShadow:"0 20px 60px rgba(0,0,0,0.12)",
  animation:"slideIn .3s cubic-bezier(0.25,0.1,0.25,1)",
};

/* Tabs — pill style, không border nặng */
export const tabB = {
  padding:"7px 14px",
  border:"none", borderRadius:980,
  background:"rgba(0,0,0,0.03)", fontSize:12, fontWeight:500,
  color:C.textSecondary, cursor:"pointer", fontFamily:F,
  transition:"all 0.2s cubic-bezier(0.25,0.1,0.25,1)",
};
export const tabA = { background:"rgba(0,113,227,0.08)", color:C.accent, fontWeight:600 };

/* Cards — KHÔNG có border rõ, nền nhạt thay thế */
export const aCard = {
  background:C.white, borderRadius:18, borderLeft:"3px solid",
  padding:14, marginBottom:10,
  boxShadow:C.shadowSm,
  transition:"transform 0.2s cubic-bezier(0.25,0.1,0.25,1)",
};
export const dBdg = { fontSize:11, color:C.textSecondary, background:"rgba(0,0,0,0.03)", padding:"3px 8px", borderRadius:6, whiteSpace:"nowrap" };
export const delB = { background:"none", border:"none", color:C.red, fontSize:18, cursor:"pointer", padding:"0 4px", transition:"transform 0.15s" };

/* Global CSS — Apple easing */
export const globalCSS = `
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fillBar{from{width:0}to{width:100%}}
@keyframes slideIn{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
input:focus,select:focus{border-color:rgba(0,113,227,0.35)!important;box-shadow:0 0 0 4px rgba(0,113,227,0.06)!important}
button{transition:all .2s cubic-bezier(0.25,0.1,0.25,1)}
button:active{transform:scale(.98)!important;opacity:.85!important}
::selection{background:rgba(0,113,227,0.15)}
`;
