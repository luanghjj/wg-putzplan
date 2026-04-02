import { useState, useEffect, useRef } from "react";
import { T } from "./data/i18n";
import { OWNER, DEF } from "./data/constants";
import { storage, SK, onDataChange, refPhotoStorage, historyDB } from "./data/storage";
import { gwk, grot, fd, ft, gmo, getToday, getTimeLeft } from "./utils/helpers";
import { F, C, btnG, ov, mod, globalCSS } from "./styles";
import { supabase } from "./data/supabase";

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => { });
  });
}

import PinModal from "./components/PinModal";
import TutorialPopup from "./components/TutorialPopup";
import LoginScreen from "./components/LoginScreen";
import NavBar from "./components/NavBar";
import PlanScreen from "./components/PlanScreen";
import LeaderScreen from "./components/LeaderScreen";
import RulesScreen from "./components/RulesScreen";
import HistoryScreen from "./components/HistoryScreen";
import AdminScreen from "./components/AdminScreen";
import ReportScreen from "./components/ReportScreen";
import { AnnouncementModal } from "./components/Announcement";

export default function App() {
  const [st, setSt] = useState(null);
  const [ph, setPh] = useState({});
  const [rp, setRp] = useState({});
  const [user, setUser] = useState(null);
  const [scr, setScr] = useState("login");
  const [ld, setLd] = useState(true);
  const [toast, setToast] = useState(null);
  const [pinM, setPinM] = useState(null);
  const [phView, setPhView] = useState(null);
  const [tutView, setTutView] = useState(null);

  const safeSt = (d) => ({
    ...d,
    users: d.users || [],
    rooms: d.rooms || [],
    history: d.history || [],           // ← source of truth
    weeklyAreas: d.weeklyAreas || DEF.weeklyAreas,
    dailyTasks: d.dailyTasks || DEF.dailyTasks,
    announcements: d.announcements || [],
    reports: d.reports || [],
    tutorials: d.tutorials || {},
    rolePerms: d.rolePerms || DEF.rolePerms,
  });

  const skipSync = useRef(0);

  useEffect(() => {
    (async () => {
      try {
        const [r, p] = await Promise.all([
          storage.get(SK.data).catch(() => null),
          storage.get(SK.photos).catch(() => null),
        ]);
        const rpData = await refPhotoStorage.getAll();
        if (Object.keys(rpData).length > 0) setRp(rpData);
        if (r?.value) {
          const d = JSON.parse(r.value);
          if (!d.users?.some(u => u.id === "owner-1")) d.users = [{ ...OWNER }, ...(d.users || [])];
          const s = safeSt({ ...DEF, ...d });
          setSt(s);
          const savedPin = localStorage.getItem('wg_pin');
          if (savedPin) {
            const found = s.users.find(u => u.password === savedPin);
            if (found) { setUser({ ...found }); setScr('plan'); }
            else { localStorage.removeItem('wg_pin'); }
          }
        } else setSt(safeSt({ ...DEF }));
        if (p?.value) setPh(JSON.parse(p.value));
      } catch (e) { console.error('Load error:', e); setSt({ ...DEF }); }
      setLd(false);
    })();
  }, []);

  useEffect(() => {
    const unsub1 = onDataChange(SK.data, (val) => {
      if (skipSync.current > 0) { skipSync.current--; return; }
      const d = safeSt({ ...DEF, ...val });
      if (!d.users?.some(u => u.id === "owner-1")) d.users = [{ ...OWNER }, ...(d.users || [])];
      setSt(d);
    });
    const unsub2 = onDataChange(SK.photos, (val) => {
      if (skipSync.current > 0) { skipSync.current--; return; }
      setPh(val || {});
    });
    const unsub3 = onDataChange(SK.refPhotos, (val) => {
      if (skipSync.current > 0) { skipSync.current--; return; }
      if (val && typeof val === "object") setRp(val);
    });
    return () => { unsub1(); unsub2(); unsub3(); };
  }, []);

  // sv: save non-history state (config, users, rooms, etc.)
  const sv = async ns => {
    setSt(ns);
    skipSync.current++;
    try { await storage.set(SK.data, JSON.stringify(ns)); }
    catch { skipSync.current = Math.max(0, skipSync.current - 1); }
  };
  const sp = async np => {
    setPh(np);
    skipSync.current++;
    try { await storage.set(SK.photos, JSON.stringify(np)); }
    catch { skipSync.current = Math.max(0, skipSync.current - 1); }
  };

  const show = (m, ty = "success") => { setToast({ m, ty }); setTimeout(() => setToast(null), 2500); };
  const hp = p => { if (!user) return false; if (user.role === "owner") return true; return (st.rolePerms?.[user.role] || []).includes(p); };
  const rpin = () => new Promise(r => setPinM({ resolve: r }));
  const t = st ? T[st.lang || "de"] : T.de;

  const srp = async (newRp, changedKey, deleted) => {
    if (changedKey) {
      if (deleted) await refPhotoStorage.deleteOne(changedKey);
      else if (newRp[changedKey]) await refPhotoStorage.setOne(changedKey, newRp[changedKey]);
    } else {
      for (const [k, v] of Object.entries(newRp)) await refPhotoStorage.setOne(k, v);
    }
    setRp(newRp);
  };

  // ─── HISTORY HELPERS ───────────────────────────────────────────────────────

  // Daily task: done today by this person? (status: 'auto')
  const isDailyC = (tk, person) => {
    const today = getToday();
    return (st.history || []).find(h =>
      h.areaId === "daily" && h.taskKey === tk &&
      h.person === person && h.day === today
    );
  };

  // Weekly task: submitted this week by this person? (any status)
  const isWeeklyC = (tk, areaId, wk, person) =>
    (st.history || []).find(h =>
      h.taskKey === tk && h.areaId === areaId &&
      h.week === wk && h.person === person
    );

  // Generic check (for backward compat with PlanScreen)
  const isC = (tk, ai, wk) =>
    (st.history || []).find(h =>
      h.taskKey === tk && h.areaId === (ai || "daily") && h.week === wk
    );

  // ─── TASK DONE ──────────────────────────────────────────────────────────────
  // Flow (from wg-putzplan-flow.md):
  //   Daily  → status='auto', saved to history immediately
  //   Weekly → status='pending', waits for manager approval
  const doDone = async (tk, ai, photo) => {
    if (!user) return;
    const now = Date.now(), wk = gwk(new Date()), today = getToday();
    const isDaily = (ai || "daily") === "daily";
    const all = [...st.dailyTasks, ...st.weeklyAreas.flatMap(a => a.tasks)];
    const pts = all.find(x => x.de === tk)?.pts || 1;
    const photoKey = isDaily
      ? `${today}-daily-${tk}-${user.name}`
      : `${wk}-${ai}-${tk}-${user.name}`;

    const entry = {
      taskKey: tk, areaId: ai || "daily",
      person: user.name, room: user.room,
      week: wk, month: gmo(), timestamp: now, pts,
      status: isDaily ? "auto" : "pending",
      verifiedBy: isDaily ? "auto" : null,
      verifiedAt: isDaily ? now : null,
      photoKey: photo ? photoKey : null,
      ...(isDaily ? { day: today } : {}),
    };

    // Insert to DB, get back the id
    const saved = await historyDB.insert(entry);
    if (!saved) { show(t.errorGeneric || "Fehler", "error"); return; }

    // Update local state (optimistic)
    setSt(prev => ({ ...prev, history: [...(prev.history || []), saved] }));

    // Save photo if provided
    if (photo) {
      skipSync.current++;
      await storage.set(SK.photos, JSON.stringify({ ...ph, [photoKey]: photo })).catch(() => {});
      setPh(prev => ({ ...prev, [photoKey]: photo }));
    }

    show(isDaily
      ? (st.lang === "de" ? "✓ Erledigt & gespeichert!" : "✓ Hoàn thành & đã lưu!")
      : (st.lang === "de" ? "✓ Gesendet — warten auf Bestätigung" : "✓ Đã gửi — chờ xác nhận")
    );

    if (st.sheetsUrl) {
      try {
        await fetch(st.sheetsUrl, {
          method: "POST", mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ person: user.name, room: user.room, task: tk, area: ai || "daily", date: fd(now), time: ft(now), week: wk, points: pts, status: entry.status }),
        });
      } catch { }
    }
  };

  // ─── UNDO ──────────────────────────────────────────────────────────────────
  // Only allowed if NOT yet verified by manager
  const doUndo = async (tk, ai, wkOrDay) => {
    if (!user) return;
    const isDaily = (ai || "daily") === "daily";
    const entry = (st.history || []).find(h =>
      h.taskKey === tk && h.areaId === (ai || "daily") &&
      h.person === user.name && h.status !== "verified" &&
      (isDaily ? h.day === wkOrDay : h.week === wkOrDay)
    );
    if (!entry) return;

    await historyDB.remove(entry.id);
    setSt(prev => ({ ...prev, history: (prev.history || []).filter(h => h.id !== entry.id) }));

    // Remove photo
    if (entry.photoKey && ph[entry.photoKey]) {
      const np = { ...ph };
      delete np[entry.photoKey];
      await sp(np);
    }
  };

  // ─── VERIFY (Manager only, weekly only) ────────────────────────────────────
  // Flow: UPDATE history status='verified'
  const doVerify = async (historyId) => {
    if (!user) return;
    const result = await historyDB.verify(historyId, user.name);
    if (!result) return;
    setSt(prev => ({
      ...prev,
      history: (prev.history || []).map(h =>
        h.id === historyId
          ? { ...h, status: "verified", verifiedBy: result.verifiedBy, verifiedAt: result.verifiedAt }
          : h
      ),
    }));
    show(st.lang === "de" ? "✓ Bestätigt!" : "✓ Xác nhận!");
  };

  // ─── REJECT (Manager only, weekly only) ────────────────────────────────────
  // Flow: DELETE from history → resident must redo
  const doReject = async (historyId, reason) => {
    if (!user) return;
    const entry = (st.history || []).find(h => h.id === historyId);
    if (!entry) return;

    await historyDB.remove(historyId);
    setSt(prev => ({ ...prev, history: (prev.history || []).filter(h => h.id !== historyId) }));

    // Remove photo
    if (entry.photoKey && ph[entry.photoKey]) {
      const np = { ...ph };
      delete np[entry.photoKey];
      await sp(np);
    }

    show(st.lang === "de" ? "✗ Abgelehnt — bitte nochmal erledigen" : "✗ Từ chối — vui lòng làm lại", "error");
  };

  if (ld || !st) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div style={{ width: 36, height: 36, border: "3px solid #E2E8F0", borderTopColor: "#3B82F6", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
    </div>
  );

  return (
    <div style={{ fontFamily: F, minHeight: "100vh", background: C.bg, maxWidth: 520, margin: "0 auto", position: "relative" }}>
      <style>{globalCSS}</style>
      {toast && <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", color: "#fff", padding: "10px 22px", borderRadius: 980, fontSize: 14, fontWeight: 500, zIndex: 1000, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontFamily: F, animation: "fadeUp .3s cubic-bezier(0.25,0.1,0.25,1)", background: toast.ty === "success" ? C.green : C.red }}>{toast.m}</div>}
      {pinM && <PinModal t={t} st={st} pm={pinM} set={setPinM} />}
      {phView && <div style={ov} onClick={() => setPhView(null)}><div style={{ ...mod, maxWidth: 420, padding: 8 }} onClick={e => e.stopPropagation()}><img src={phView} style={{ width: "100%", borderRadius: 12 }} alt="proof" /><button style={{ ...btnG, width: "100%", marginTop: 8 }} onClick={() => setPhView(null)}>{t.closePhoto}</button></div></div>}
      {tutView && <TutorialPopup t={t} lang={st.lang} tut={tutView} onClose={() => setTutView(null)} />}
      {scr === "login" ? <LoginScreen t={t} st={st} sv={sv} onLogin={u => {
        setUser(u); setScr("plan");
        localStorage.setItem('wg_pin', u.password);
        if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
        // 2-day inactivity check
        const today = getToday();
        const yesterday = (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().split('T')[0]; })();
        const hasTodayDaily = (st.history || []).some(h => h.areaId === 'daily' && h.person === u.name && h.day === today);
        const hasYesterdayDaily = (st.history || []).some(h => h.areaId === 'daily' && h.person === u.name && h.day === yesterday);
        if (!hasTodayDaily && !hasYesterdayDaily) {
          setTimeout(() => show(st.lang === 'de' ? '⚠️ Du hast seit 2 Tagen keine tägliche Aufgabe erledigt!' : '⚠️ Bạn chưa thực hiện nhiệm vụ hàng ngày 2 ngày rồi!', 'error'), 1500);
        }
      }} /> :
        <div style={{ padding: "14px 14px 40px", maxWidth: 520, margin: "0 auto" }}>
          <NavBar t={t} scr={scr} set={setScr} user={user} hp={hp} st={st} isC={isC} onLogout={() => { localStorage.removeItem('wg_pin'); setUser(null); setScr("login"); }} />
          {scr === "plan" && <PlanScreen t={t} st={{ ...st, refPhotos: rp }} user={user} hp={hp} doDone={doDone} doUndo={doUndo} isC={isC} isDailyC={isDailyC} isWeeklyC={isWeeklyC} ph={ph} vp={setPhView} openTut={setTutView} doVerify={doVerify} doReject={doReject} />}
          {scr === "leaderboard" && <LeaderScreen t={t} st={st} user={user} />}
          {scr === "rules" && <RulesScreen t={t} lang={st.lang} st={st} user={user} sv={sv} show={show} />}
          {scr === "history" && <HistoryScreen t={t} st={st} hp={hp} ph={ph} vp={setPhView} user={user} />}
          {scr === "reports" && <ReportScreen t={t} st={st} sv={sv} user={user} show={show} />}
          {scr === "admin" && <AdminScreen t={t} st={{ ...st, refPhotos: rp }} sv={sv} hp={hp} rpin={rpin} show={show} user={user} srp={srp} />}
        </div>}
      {user && scr !== "login" && <AnnouncementModal announcements={st.announcements || []} user={user} st={st} onDismiss={(id) => {
        const updated = (st.announcements || []).map(a => a.id === id ? { ...a, readBy: [...(a.readBy || []), user.name] } : a);
        sv({ ...st, announcements: updated });
      }} />}
    </div>
  );
}
