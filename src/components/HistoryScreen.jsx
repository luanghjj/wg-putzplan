import { F, C, btnS } from "../styles";
import { gwk, fd, ft } from "../utils/helpers";

// Read flow: .agents/workflows/wg-putzplan-flow.md
// Only show: status IN ('auto', 'verified') — NOT pending

export default function HistoryScreen({ t, st, hp, ph, vp, user }) {
  const lang = st.lang || "de";
  const wk = gwk(new Date());

  // Per flow: history = only auto (daily) + verified (weekly manager-approved)
  const confirmed = (st.history || [])
    .filter(h => h.status === "auto" || h.status === "verified")
    .sort((a, b) => b.timestamp - a.timestamp);

  const doE = () => {
    if (!hp("export_data")) return;
    const h = "Datum,Uhrzeit,KW,Person,Zimmer,Bereich,Aufgabe,Punkte,Status\n";
    const rows = confirmed.map(h =>
      `${fd(h.timestamp)},${ft(h.timestamp)},${h.week},${h.person},${h.room || ""},${h.areaId},${h.taskKey},${h.pts || 1},${h.status}`
    ).join("\n");
    const b = new Blob([h + rows], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(b);
    a.download = `wg_KW${wk}.csv`; a.click();
  };

  const findTask = (taskKey, areaId) => {
    if (areaId === "daily") return st.dailyTasks.find(t => t.de === taskKey);
    const area = st.weeklyAreas.find(a => a.id === areaId);
    return area?.tasks?.find(t => t.de === taskKey);
  };

  if (confirmed.length === 0) return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1C1C1E", margin: 0, fontFamily: F, letterSpacing: "-0.022em" }}>{t.history}</h2>
        {hp("export_data") && <button style={{ ...btnS, fontSize: 12 }} onClick={doE}>📥 CSV</button>}
      </div>
      <div style={{ textAlign: "center", padding: "40px 20px", color: "#8E8E93", fontSize: 14 }}>
        {lang === "de" ? "Noch keine bestätigten Aufgaben." : "Chưa có nhiệm vụ nào được xác nhận."}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1C1C1E", margin: 0, fontFamily: F, letterSpacing: "-0.022em" }}>{t.history}</h2>
        {hp("export_data") && <button style={{ ...btnS, fontSize: 12 }} onClick={doE}>📥 CSV</button>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {confirmed.map((h, i) => {
          const task = findTask(h.taskKey, h.areaId);
          const isDaily = h.areaId === "daily";
          const area = !isDaily ? st.weeklyAreas.find(a => a.id === h.areaId) : null;
          const photoUrl = ph[h.photoKey];
          const areaLabel = isDaily ? (lang === "de" ? "Täglich" : "Hàng ngày") : (t[h.areaId] || h.areaId);
          const areaColor = area?.color || (isDaily ? C.accent : C.purple);
          const isAuto = h.status === "auto";

          return (
            <div key={h.id || i} style={{
              background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)",
              borderRadius: 16, padding: 14, boxShadow: C.shadowSm,
              border: `1px solid ${C.border}`, animation: "fadeUp 0.2s ease"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                {/* Avatar */}
                <div style={{
                  width: 36, height: 36, borderRadius: 12, flexShrink: 0,
                  background: `linear-gradient(135deg, ${areaColor}, ${C.purple})`,
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 15, fontFamily: F
                }}>
                  {h.person?.[0]?.toUpperCase() || "?"}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{h.person}</div>
                  <div style={{ fontSize: 12, color: C.textSecondary }}>
                    {fd(h.timestamp)} {ft(h.timestamp)} · KW{h.week}
                  </div>
                </div>

                {/* Area badge */}
                <span style={{ fontSize: 11, fontWeight: 700, color: areaColor, background: `${areaColor}12`, padding: "3px 10px", borderRadius: 8 }}>
                  {areaLabel}
                </span>
              </div>

              {/* Task name */}
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, padding: "8px 10px", background: "rgba(0,0,0,0.02)", borderRadius: 10, marginBottom: 8 }}>
                {lang === "de" ? h.taskKey : (task?.vi || h.taskKey)}
                {task && <span style={{ fontSize: 11, color: C.textSecondary, marginLeft: 6 }}>({lang === "de" ? task.vi : task.de})</span>}
              </div>

              {/* Footer */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.green, background: "rgba(52,199,89,0.08)", padding: "3px 10px", borderRadius: 8 }}>
                  +{h.pts || 1}⭐
                </span>
                {/* Status badge */}
                {isAuto
                  ? <span style={{ fontSize: 11, fontWeight: 600, color: C.green, background: "rgba(52,199,89,0.06)", padding: "2px 8px", borderRadius: 6 }}>
                    ✅ {lang === "de" ? "Auto" : "Tự động"}
                  </span>
                  : <span style={{ fontSize: 11, fontWeight: 600, color: C.green, background: "rgba(52,199,89,0.06)", padding: "2px 8px", borderRadius: 6 }}>
                    ✅ {lang === "de" ? "Bestätigt" : "Đã xác nhận"} · {h.verifiedBy}
                  </span>
                }
                {/* Photo */}
                {photoUrl && (
                  <button style={{ fontSize: 11, padding: "2px 8px", borderRadius: 6, border: "none", background: "rgba(0,113,227,0.08)", color: C.accent, cursor: "pointer", fontFamily: F, fontWeight: 600 }}
                    onClick={() => vp(photoUrl)}>📷</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
