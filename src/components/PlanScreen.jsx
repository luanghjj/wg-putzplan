import { useState } from "react";
import { gwk, grot, ft, getToday, getTimeLeft, getWeekRange, getDeadlineStr } from "../utils/helpers";
import { F, C, inpS, dBdg, aCard } from "../styles";
import PhotoCapture from "./PhotoCapture";

// Read flow: .agents/workflows/wg-putzplan-flow.md

export default function PlanScreen({ t, st, user, hp, doDone, doUndo, isC, isDailyC, isWeeklyC, ph, vp, openTut, doVerify, doReject }) {
  const [tp, setTP] = useState({});
  const [err, setErr] = useState("");
  const [showRef, setShowRef] = useState({});
  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const lang = st.lang, wk = gwk(new Date()), today = getToday();
  const rot = grot(wk, st.rooms, st.weeklyAreas);
  const day = new Date().toLocaleDateString(lang === "de" ? "de-DE" : "vi-VN", { weekday: "long" });
  const wr = getWeekRange(wk);
  const dlStr = getDeadlineStr(wk, lang);
  const tl = getTimeLeft(wk);

  // Ref photo helpers
  const normTaskKey = (tk) => `task-${(tk || "").trim().replace(/[.#$\/\[\]]/g, "_")}`;
  const normRefKey = (tk) => {
    const exact = normTaskKey(tk);
    if (st.refPhotos?.[exact]) return exact;
    const norm = `task-${(tk || "").trim().toLowerCase()}`;
    if (st.refPhotos?.[norm]) return norm;
    return Object.keys(st.refPhotos || {}).find(k => k.toLowerCase() === exact.toLowerCase()) || exact;
  };

  // Can this user complete tasks in this area?
  const canC = (ai) => {
    if (hp("check_all")) return true;
    if (!hp("check_own_area")) return false;
    return user.roomId === rot[ai];
  };

  // Submit task (requires photo)
  const doT = (tk, ai) => {
    const k = `${ai}-${tk}`;
    if (!tp[k]) { setErr(k); return; }
    doDone(tk, ai, tp[k]);
    setTP(p => { const n = { ...p }; delete n[k]; return n; });
    setErr("");
  };

  // Weekly progress bar
  let tot = 0, dn = 0;
  st.weeklyAreas.forEach(a => a.tasks.forEach(ta => {
    tot++;
    if (isWeeklyC(ta.de, a.id, wk, user.name)) dn++;
  }));
  const pct = tot > 0 ? Math.round(dn / tot * 100) : 0;

  // Pending weekly tasks for manager/owner panel
  // history entries with status='pending' this week, not by this user
  const pendingWeekly = (st.history || []).filter(h =>
    h.status === "pending" &&
    h.week === wk &&
    h.areaId !== "daily" &&
    h.person !== user.name
  );

  // Daily undone tasks for this user
  const myUndoneDailyTasks = st.dailyTasks.filter(task => !isDailyC(task.de, user.name));

  // Status badge for a history entry
  const statusBadge = (h) => {
    if (!h) return null;
    if (h.status === "verified") return <span style={{ fontSize: 10, fontWeight: 700, color: C.green, background: "rgba(52,199,89,0.08)", padding: "2px 8px", borderRadius: 6 }}>✅ {t.verified} ({h.verifiedBy})</span>;
    if (h.status === "auto") return <span style={{ fontSize: 10, fontWeight: 700, color: C.green, background: "rgba(52,199,89,0.08)", padding: "2px 8px", borderRadius: 6 }}>✅ {lang === "de" ? "Automatisch" : "Tự động"}</span>;
    if (h.status === "pending") return <span style={{ fontSize: 10, fontWeight: 600, color: C.orange, background: "rgba(255,149,0,0.08)", padding: "2px 8px", borderRadius: 6 }}>⏳ {lang === "de" ? "Warten" : "Chờ xác nhận"}</span>;
    return null;
  };

  // ── Task Row ──────────────────────────────────────────────────────────────
  const TR = ({ task, areaId, area }) => {
    const isDaily = areaId === "daily";
    // Check completion for THIS user only (per flow spec)
    const histEntry = isDaily
      ? isDailyC(task.de, user.name)
      : isWeeklyC(task.de, areaId, wk, user.name);
    const done = !!histEntry;
    const k = `${areaId}-${task.de}`;
    const ok = isDaily || canC(areaId);
    const photoKey = histEntry?.photoKey || (isDaily
      ? `${today}-daily-${task.de}-${user.name}`
      : `${wk}-${areaId}-${task.de}-${user.name}`);
    const photoUrl = ph[photoKey];
    const refKey = normRefKey(task.de);
    const hasRef = !!st.refPhotos?.[refKey];
    const tutKey = normTaskKey(task.de);
    const hasTut = st.tutorials?.[tutKey]?.steps?.length > 0;
    const refOpen = !!showRef[k];
    const tutOpen = !!showRef[`tut-${k}`];

    const cb = { width: 24, height: 24, borderRadius: 8, border: `2px solid rgba(0,0,0,0.15)`, background: C.surfaceElevated, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", flexShrink: 0, fontFamily: F, marginTop: 2, transition: "all 0.15s ease" };
    const cbD = { background: C.accent, borderColor: C.accent };

    return (
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px", borderRadius: 14, marginBottom: 4, background: done ? (area?.bg || "rgba(52,199,89,0.06)") : "transparent", transition: "background 0.2s", animation: "fadeUp 0.25s ease" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {done
              ? <span style={{ ...cb, ...cbD, ...(area ? { background: area.color, borderColor: area.color } : {}) }}
                onClick={() => doUndo(task.de, areaId, isDaily ? today : wk)}>✓</span>
              : ok
                ? <span style={cb} onClick={() => doT(task.de, areaId)} />
                : <span style={{ ...cb, opacity: .3, cursor: "not-allowed" }} />
            }
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: C.text, textDecoration: done ? "line-through" : "none", fontWeight: 500, letterSpacing: "-0.01em" }}>
                {lang === "de" ? task.de : task.vi}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, color: C.textSecondary }}>{lang === "de" ? task.vi : task.de}</span>
                {hasRef && <button style={{ background: "rgba(0,122,255,0.08)", border: "none", padding: "3px 10px", borderRadius: 980, fontSize: 11, color: C.accent, cursor: "pointer", fontFamily: F, fontWeight: 600 }}
                  onClick={() => setShowRef(p => ({ ...p, [k]: !p[k] }))}>
                  {lang === "de" ? "Referenzfoto" : "Ảnh tham chiếu"} {refOpen ? "↑" : "↓"}
                </button>}
                {hasTut && <button style={{ background: "none", border: "none", padding: 0, fontSize: 11, color: C.purple, cursor: "pointer", fontFamily: F, fontWeight: 600 }}
                  onClick={() => setShowRef(p => ({ ...p, [`tut-${k}`]: !p[`tut-${k}`] }))}>
                  {tutOpen ? "✕" : t.tutorialShort}
                </button>}
              </div>
            </div>
          </div>

          {refOpen && hasRef && (
            <div style={{ marginLeft: 32, marginTop: 8, borderRadius: 14, overflow: "hidden", boxShadow: C.shadowMd }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.textSecondary, padding: "8px 10px 4px", background: "rgba(0,0,0,0.02)", letterSpacing: "0.02em", textTransform: "uppercase" }}>
                {lang === "de" ? "Referenzfoto" : "Ảnh tham chiếu"}
              </div>
              <img src={st.refPhotos[refKey]} style={{ width: "100%", maxHeight: 180, objectFit: "cover", display: "block", cursor: "pointer" }} alt="ref" onClick={() => vp(st.refPhotos[refKey])} />
            </div>
          )}

          {tutOpen && hasTut && (
            <div style={{ marginLeft: 32, marginTop: 6, padding: 8, background: "rgba(175,82,222,0.04)", borderRadius: 12, border: "1px solid rgba(175,82,222,0.12)" }}>
              {st.tutorials[tutKey].steps.slice(0, 2).map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                  <span style={{ width: 18, height: 18, borderRadius: 6, background: C.purple, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                  <div style={{ fontSize: 12, color: "#5B2C8A" }}>{lang === "de" ? s.textDe : s.textVi}</div>
                </div>
              ))}
              {st.tutorials[tutKey].steps.length > 2 && <div style={{ fontSize: 11, color: C.purple, marginBottom: 4 }}>+{st.tutorials[tutKey].steps.length - 2} {t.steps}...</div>}
              <button style={{ background: C.purple, color: "#fff", border: "none", borderRadius: 10, padding: "6px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: F, width: "100%" }}
                onClick={() => openTut({ ...st.tutorials[tutKey], taskDe: task.de, taskVi: task.vi })}>
                {t.openTutorial}
              </button>
            </div>
          )}

          {done && histEntry && (
            <div style={{ marginTop: 4, marginLeft: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={dBdg}>{histEntry.person} · {ft(histEntry.timestamp)} · +{histEntry.pts || task.pts}⭐</span>
                {photoUrl && <button style={{ ...dBdg, cursor: "pointer", background: "rgba(0,113,227,0.08)", color: C.accent }} onClick={() => vp(photoUrl)}>📷</button>}
                {statusBadge(histEntry)}
              </div>
            </div>
          )}

          {!done && ok && (
            <>
              <PhotoCapture t={t} photo={tp[k]} onCap={d => setTP(p => ({ ...p, [k]: d }))} />
              {err === k && !tp[k] && <p style={{ color: C.red, fontSize: 12, margin: "4px 0 0 32px" }}>{t.noPhoto}</p>}
            </>
          )}
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: area?.color || C.accent, background: area?.bg || "rgba(0,113,227,0.06)", padding: "3px 10px", borderRadius: 8, flexShrink: 0, alignSelf: "flex-start" }}>+{task.pts}⭐</div>
      </div>
    );
  };

  // ── Pending Card (manager panel) ──────────────────────────────────────────
  const PendingCard = ({ h }) => {
    const area = st.weeklyAreas.find(a => a.id === h.areaId);
    const task = area?.tasks?.find(ta => ta.de === h.taskKey);
    const areaLabel = t[h.areaId] || h.areaId;
    const areaColor = area?.color || C.accent;
    const cPhoto = ph[h.photoKey];
    const refKey = task ? normRefKey(task.de) : null;
    const refPhoto = refKey ? st.refPhotos?.[refKey] : null;
    const timeStr = new Date(h.timestamp).toLocaleString(lang === "de" ? "de-DE" : "vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
    const isRejecting = rejectId === h.id;

    return (
      <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", borderRadius: 16, padding: 14, boxShadow: C.shadowSm, border: `1px solid ${C.border}`, animation: "fadeUp 0.2s ease" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: `linear-gradient(135deg,${areaColor},${C.purple})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, fontFamily: F, flexShrink: 0 }}>
            {h.person[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{h.person}</div>
            <div style={{ fontSize: 12, color: C.textSecondary }}>{timeStr}</div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: areaColor, background: `${areaColor}12`, padding: "3px 10px", borderRadius: 8 }}>{areaLabel}</span>
        </div>

        {/* Task name */}
        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, padding: "8px 10px", background: "rgba(0,0,0,0.02)", borderRadius: 10, marginBottom: 10 }}>
          {lang === "de" ? h.taskKey : (task?.vi || h.taskKey)}
          {task && <span style={{ fontSize: 11, color: C.textSecondary, marginLeft: 6 }}>({lang === "de" ? task.vi : task.de})</span>}
        </div>

        {/* Photos */}
        {(cPhoto || refPhoto) && (
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            {cPhoto && (
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, marginBottom: 4, textTransform: "uppercase" }}>📸 {lang === "de" ? "Beweis" : "Ảnh chụp"}</div>
                <img src={cPhoto} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 10, cursor: "pointer", border: `2px solid ${C.accent}30` }} alt="proof" onClick={() => vp(cPhoto)} />
              </div>
            )}
            {refPhoto && (
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.purple, marginBottom: 4, textTransform: "uppercase" }}>📋 {lang === "de" ? "Vorgabe" : "Ảnh mẫu"}</div>
                <img src={refPhoto} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 10, cursor: "pointer", border: `2px solid ${C.purple}30` }} alt="ref" onClick={() => vp(refPhoto)} />
              </div>
            )}
          </div>
        )}
        {!cPhoto && <div style={{ padding: "8px 10px", background: "rgba(255,149,0,0.06)", borderRadius: 10, marginBottom: 10, fontSize: 12, color: C.orange, fontWeight: 600 }}>⚠️ {lang === "de" ? "Kein Foto" : "Không có ảnh"}</div>}

        {/* Actions */}
        {!isRejecting && (
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ flex: 1, padding: "10px 16px", background: `linear-gradient(135deg,${C.green},#2DD4BF)`, color: "#fff", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: F }}
              onClick={() => doVerify(h.id)}>
              ✓ {lang === "de" ? "Bestätigen" : "Xác nhận"}
            </button>
            <button style={{ flex: 1, padding: "10px 16px", background: "rgba(255,59,48,0.08)", color: C.red, border: `1.5px solid ${C.red}30`, borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: F }}
              onClick={() => { setRejectId(h.id); setRejectReason(""); }}>
              ✗ {lang === "de" ? "Ablehnen" : "Từ chối"}
            </button>
          </div>
        )}
        {isRejecting && (
          <div style={{ display: "flex", gap: 6, alignItems: "center", background: "rgba(255,59,48,0.04)", padding: 8, borderRadius: 12, border: `1px solid ${C.red}20` }}>
            <input style={{ ...inpS, flex: 1, fontSize: 12 }}
              placeholder={lang === "de" ? "Grund der Ablehnung..." : "Lý do từ chối..."}
              value={rejectReason} autoFocus
              onChange={e => setRejectReason(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && rejectReason.trim()) { doReject(h.id, rejectReason); setRejectId(null); } }} />
            <button style={{ padding: "8px 14px", background: C.red, color: "#fff", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: F }}
              onClick={() => { if (rejectReason.trim()) { doReject(h.id, rejectReason); setRejectId(null); } }}>✗</button>
            <button style={{ padding: "8px 10px", background: "rgba(0,0,0,0.04)", color: C.textSecondary, border: "none", borderRadius: 10, fontSize: 12, cursor: "pointer", fontFamily: F }}
              onClick={() => setRejectId(null)}>×</button>
          </div>
        )}
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.72)", backdropFilter: "blur(20px) saturate(180%)", WebkitBackdropFilter: "blur(20px) saturate(180%)", borderRadius: 18, padding: 16, marginBottom: 14, boxShadow: C.shadowSm, border: `1px solid ${C.border}` }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, color: C.text, fontFamily: F, fontWeight: 700, letterSpacing: "-0.022em" }}>{t.plan}</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: C.textSecondary }}>{t.kwNum} {wk} · {wr.range} · {day}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
            <span style={{ fontSize: 11, color: tl.overdue ? C.red : C.textSecondary }}>⏰ {t.deadline}: {dlStr}</span>
            {tl.overdue
              ? <span style={{ fontSize: 11, fontWeight: 700, color: C.red, background: "rgba(255,59,48,0.08)", padding: "2px 8px", borderRadius: 6 }}>⚠️ {t.overdue}</span>
              : <span style={{ fontSize: 11, fontWeight: 600, color: tl.hours < 24 ? C.orange : C.green, background: tl.hours < 24 ? "rgba(255,149,0,0.08)" : "rgba(52,199,89,0.08)", padding: "2px 8px", borderRadius: 6 }}>{t.timeLeft} {tl.text}</span>
            }
          </div>
        </div>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="52" height="52" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="4" />
            <circle cx="26" cy="26" r="22" fill="none" stroke={C.accent} strokeWidth="4" strokeDasharray={`${pct * 1.382} 138.2`} strokeLinecap="round" transform="rotate(-90 26 26)" style={{ transition: "stroke-dasharray 0.5s ease" }} />
          </svg>
          <span style={{ position: "absolute", fontSize: 12, fontWeight: 700, color: C.accent, fontFamily: F }}>{pct}%</span>
        </div>
      </div>

      {/* ── DAILY TASKS (resident/manager only, not owner) ── */}
      {user?.role !== "owner" && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0, fontFamily: F, letterSpacing: "-0.022em" }}>☀️ {t.daily}</h3>
            <span style={{ fontSize: 11, color: C.textSecondary }}>{t.dailySub}</span>
          </div>
          {myUndoneDailyTasks.length > 0 && (
            <div style={{ background: "rgba(255,255,255,0.72)", backdropFilter: "blur(20px)", borderRadius: 14, padding: 4, marginBottom: 10, boxShadow: C.shadowSm, border: `1px solid ${C.border}` }}>
              {myUndoneDailyTasks.map((task, i) => <TR key={i} task={task} areaId="daily" />)}
            </div>
          )}
          {myUndoneDailyTasks.length === 0 && (
            <div style={{ textAlign: "center", padding: "12px 16px", background: "rgba(52,199,89,0.06)", borderRadius: 12, marginBottom: 10, fontSize: 13, fontWeight: 600, color: C.green }}>
              ✅ {lang === "de" ? "Alle erledigt!" : "Bạn đã làm xong tất cả hôm nay!"}
            </div>
          )}
        </div>
      )}

      {/* ── MANAGER PENDING PANEL (owner/manager only) ── */}
      {(user.role === "owner" || user.role === "manager") && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.orange, margin: 0, fontFamily: F }}>🔔 {lang === "de" ? "Warten auf Bestätigung" : "Chờ xác nhận"}</h3>
            {pendingWeekly.length > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: C.red, borderRadius: 10, padding: "1px 8px" }}>{pendingWeekly.length}</span>}
          </div>
          {pendingWeekly.length === 0 && (
            <div style={{ textAlign: "center", padding: "20px 16px", background: "rgba(52,199,89,0.06)", borderRadius: 12, fontSize: 13, fontWeight: 600, color: C.green }}>
              ✅ {lang === "de" ? "Keine ausstehenden Aufgaben" : "Không có nhiệm vụ chờ xác nhận"}
            </div>
          )}
          {pendingWeekly.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {pendingWeekly.sort((a, b) => b.timestamp - a.timestamp).map(h => <PendingCard key={h.id} h={h} />)}
            </div>
          )}
        </div>
      )}

      {/* ── WEEKLY TASKS ── */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0, fontFamily: F, letterSpacing: "-0.022em" }}>🔄 {t.weekly}</h3>
          <span style={{ fontSize: 11, color: C.textSecondary }}>{t.weeklySub}</span>
        </div>
        {st.weeklyAreas
          .filter(a => user.role === "owner" || user.role === "manager" || rot[a.id] === user.roomId)
          .map(area => {
            const room = st.rooms.find(r => r.id === rot[area.id]);
            const allDone = area.tasks.every(ta => isWeeklyC(ta.de, area.id, wk, user.name));
            return (
              <div key={area.id} style={{ ...aCard, borderLeftColor: area.color }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div>
                    <strong style={{ fontSize: 15, color: C.text, letterSpacing: "-0.01em" }}>{t[area.id]}</strong>
                    <span style={{ display: "inline-block", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 8, marginLeft: 6, background: area.bg, color: area.color }}>
                      {t.responsible}: {room?.name || "—"}
                    </span>
                  </div>
                  {allDone && <span style={{ fontSize: 11, fontWeight: 600, color: C.green, background: "rgba(52,199,89,0.08)", padding: "4px 10px", borderRadius: 8 }}>{t.allDone}</span>}
                </div>
                {area.tasks.map((task, ti) => <TR key={ti} task={task} areaId={area.id} area={area} />)}
              </div>
            );
          })}
      </div>
    </div>
  );
}
