/* Apple Design System for WG Putzplan */

export const F = "-apple-system, 'SF Pro Display', 'SF Pro Text', BlinkMacSystemFont, 'Segoe UI', sans-serif";

/* Colors */
export const C = {
  bg: "#F5F5F7",
  surface: "rgba(255,255,255,0.72)",
  surfaceElevated: "#FFFFFF",
  text: "#1D1D1F",
  textSecondary: "#6E6E73",
  accent: "#0071E3",
  accentHover: "#0077ED",
  green: "#34C759",
  red: "#FF3B30",
  orange: "#FF9500",
  yellow: "#FFCC00",
  purple: "#AF52DE",
  border: "rgba(0,0,0,0.08)",
  shadowSm: "0 1px 3px rgba(0,0,0,0.08)",
  shadowMd: "0 4px 24px rgba(0,0,0,0.10)",
};

/* Shared styles */
export const inp = {
  width:"100%", padding:"12px 16px",
  border:`1px solid ${C.border}`, borderRadius:14, fontSize:15,
  fontFamily:F, outline:"none", boxSizing:"border-box",
  background:C.surfaceElevated, color:C.text,
  transition:"border-color 0.2s, box-shadow 0.2s",
};
export const inpS = {
  padding:"8px 12px",
  border:`1px solid ${C.border}`, borderRadius:10, fontSize:13,
  fontFamily:F, outline:"none", boxSizing:"border-box", width:"100%",
  background:C.surfaceElevated, color:C.text,
};
export const btnP = {
  padding:"11px 20px", background:C.accent, color:"#fff",
  border:"none", borderRadius:14, fontSize:15, fontWeight:600,
  cursor:"pointer", fontFamily:F, whiteSpace:"nowrap",
  transition:"all 0.15s ease",
};
export const btnG = {
  padding:"11px 20px", background:"rgba(0,0,0,0.05)", color:C.textSecondary,
  border:"none", borderRadius:14, fontSize:15, fontWeight:600,
  cursor:"pointer", fontFamily:F,
  transition:"all 0.15s ease",
};
export const btnS = {
  padding:"7px 16px", background:C.accent, color:"#fff",
  border:"none", borderRadius:10, fontSize:13, fontWeight:600,
  cursor:"pointer", fontFamily:F,
  transition:"all 0.15s ease",
};
export const lbl = { display:"block", fontSize:13, fontWeight:600, color:C.textSecondary, marginBottom:6, letterSpacing:"-0.01em" };
export const ov = {
  position:"fixed", inset:0,
  background:"rgba(0,0,0,0.4)",
  display:"flex", alignItems:"center", justifyContent:"center",
  zIndex:999, padding:20,
  backdropFilter:"blur(20px) saturate(180%)",
  WebkitBackdropFilter:"blur(20px) saturate(180%)",
};
export const mod = {
  background:C.surfaceElevated, borderRadius:22, padding:28, width:"100%", maxWidth:340,
  boxShadow:"0 20px 60px rgba(0,0,0,0.18)",
  animation:"slideIn .25s cubic-bezier(0.34,1.56,0.64,1)",
};
export const tabB = {
  padding:"7px 14px",
  border:`1px solid ${C.border}`, borderRadius:10,
  background:C.surfaceElevated, fontSize:11, fontWeight:500,
  color:C.textSecondary, cursor:"pointer", fontFamily:F,
  transition:"all 0.15s ease",
};
export const tabA = { background:"rgba(0,113,227,0.08)", borderColor:"rgba(0,113,227,0.2)", color:C.accent, fontWeight:700 };
export const aCard = {
  background:C.surfaceElevated, borderRadius:18, borderLeft:"4px solid",
  padding:14, marginBottom:10,
  boxShadow:C.shadowSm,
  backdropFilter:"blur(20px)",
  transition:"transform 0.15s ease, box-shadow 0.15s ease",
};
export const dBdg = { fontSize:10, color:C.textSecondary, background:"rgba(0,0,0,0.04)", padding:"3px 8px", borderRadius:6, whiteSpace:"nowrap" };
export const delB = { background:"none", border:"none", color:C.red, fontSize:18, cursor:"pointer", padding:"0 4px", transition:"transform 0.1s" };

/* Global CSS string for animations */
export const globalCSS = `
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes fillBar{from{width:0}to{width:100%}}
@keyframes slideIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
input:focus,select:focus{border-color:rgba(0,113,227,0.4)!important;box-shadow:0 0 0 4px rgba(0,113,227,0.08)!important}
button{transition:all .15s ease}
button:active{transform:scale(.97)!important}
`;
