import { useState, useEffect, useRef } from "react";
import { T } from "./data/i18n";
import { OWNER, DEF } from "./data/constants";
import { storage, SK, onDataChange, refPhotoStorage } from "./data/storage";
import { gwk, grot, fd, ft, gmo, getToday, getTimeLeft } from "./utils/helpers";
import { F, C, btnG, ov, mod, globalCSS } from "./styles";

// Register service worker
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
  // Sanitize state: ensure arrays are never null
  const safeSt = (d) => ({
    ...d,
    users: d.users || [],
    rooms: d.rooms || [],
    completions: d.completions || [],
    weeklyAreas: d.weeklyAreas || DEF.weeklyAreas,
    dailyTasks: d.dailyTasks || DEF.dailyTasks,
    announcements: d.announcements || [],
    reports: d.reports || [],
    verifications: d.verifications || {},
    tutorials: d.tutorials || {},
    rolePerms: d.rolePerms || DEF.rolePerms,
  });
  const skipSync = useRef(false);
  useEffect(() => {
    (async () => {
      try {
        const [r, p] = await Promise.all([storage.get(SK.data).catch(() => null), storage.get(SK.photos).catch(() => null)]);
        const rpData = await refPhotoStorage.getAll();
        if (Object.keys(rpData).length > 0) setRp(rpData);
        if (r?.value) {
          const d = JSON.parse(r.value);
          if (!d.users?.some(u => u.id === "owner-1")) d.users = [{ ...OWNER }, ...(d.users || [])];
          const s = safeSt({ ...DEF, ...d });
          setSt(s);
          // Auto-login from saved PIN
          const savedPin = localStorage.getItem('wg_pin');
          if (savedPin) {
            const found = s.users.find(u => u.password === savedPin);
            if (found) { setUser({...found}); setScr('plan'); }
            else { localStorage.removeItem('wg_pin'); }
          }
        } else setSt(safeSt({ ...DEF }));
        if (p?.value) setPh(JSON.parse(p.value));
      } catch (e) { console.error('Load error:', e); setSt({ ...DEF }); } setLd(false);
    })();
  }, []);

  useEffect(() => {
    const unsub1 = onDataChange(SK.data, (val) => {
      if (skipSync.current) { skipSync.current = false; return; }
      const d = safeSt({ ...DEF, ...val });
      if (!d.users?.some(u => u.id === "owner-1")) d.users = [{ ...OWNER }, ...(d.users || [])];
      setSt(d);
    });
    const unsub2 = onDataChange(SK.photos, (val) => {
      if (skipSync.current) return;
      setPh(val || {});
    });
    const unsub3 = onDataChange(SK.refPhotos, (val) => {
      if (skipSync.current) return;
      if (val && typeof val === "object") setRp(val);
    });
    return () => { unsub1(); unsub2(); unsub3(); };
  }, []);

  const sv = async ns => { setSt(ns); try { await storage.set(SK.data, JSON.stringify(ns)); } catch { } };
  const sp = async np => { setPh(np); try { await storage.set(SK.photos, JSON.stringify(np)); } catch { } };
  const show = (m, ty = "success") => { setToast({ m, ty }); setTimeout(() => setToast(null), 2500); };
  const hp = p => { if (!user) return false; if (user.role === "owner") return true; return (st.rolePerms?.[user.role] || []).includes(p); };
  const rpin = () => new Promise(r => setPinM({ resolve: r }));
  const t = st ? T[st.lang || "de"] : T.de;

  // srp: save/delete a single refPhoto by key (avoids Firebase 10MB limit)
  const srp = async (newRp, changedKey, deleted) => {
    if (changedKey) {
      if (deleted) {
        await refPhotoStorage.deleteOne(changedKey);
      } else if (newRp[changedKey]) {
        await refPhotoStorage.setOne(changedKey, newRp[changedKey]);
      }
    } else {
      // Fallback: save all (e.g. migration or bulk update)
      for (const [k, v] of Object.entries(newRp)) {
        await refPhotoStorage.setOne(k, v);
      }
    }
    setRp(newRp);
  };

  const doDone = async (tk, ai, photo) => {
    if (!user) return; const now = Date.now(), wk = gwk(new Date()), today = getToday();
    const all = [...st.dailyTasks, ...st.weeklyAreas.flatMap(a => a.tasks)];
    const taskPts = all.find(x => x.de === tk)?.pts || 1;
    const isDaily = (ai || "daily") === "daily";
    const e = { taskKey: tk, areaId: ai || "daily", person: user.name, room: user.room, timestamp: now, week: wk, month: gmo(), pts: taskPts };
    if (isDaily) e.day = today;
    // Clear old rejected status so re-done task shows as fresh pending
    const vKey = isDaily ? `${today}-daily-${tk}` : `${wk}-${ai}-${tk}`;
    const updatedVerif = { ...(st.verifications || {}) };
    if (updatedVerif[vKey]?.status === "rejected") delete updatedVerif[vKey];
    await sv({ ...st, completions: [...st.completions, e], verifications: updatedVerif });
    if (photo) {
      const photoKey = isDaily ? `${today}-daily-${tk}-${user.name}` : `${wk}-${ai}-${tk}-${user.name}`;
      await sp({ ...ph, [photoKey]: photo });
    }
    show(st.lang === "de" ? `✓ Erledigt - warten auf Bestätigung` : `✓ Hoàn thành - chờ xác nhận`);
    if (st.sheetsUrl) { try { await fetch(st.sheetsUrl, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ person: user.name, room: user.room, task: tk, area: ai || "daily", date: fd(now), time: ft(now), week: wk, points: taskPts }) }); } catch { } }
  };
  const doUndo = async (tk, ai, wkOrDay) => {
    const isDaily = (ai || "daily") === "daily";
    await sv({
      ...st, completions: st.completions.filter(c => {
        if (c.taskKey !== tk || (c.areaId || "daily") !== (ai || "daily") || c.person !== user.name) return true;
        if (isDaily) return (c.day || "") === "" ? c.week !== wkOrDay : c.day !== wkOrDay; // match by day for daily, fallback to week for legacy
        return c.week !== wkOrDay;
      })
    });
    const np = { ...ph };
    const photoKey = isDaily ? `${wkOrDay}-daily-${tk}-${user.name}` : `${wkOrDay}-${ai}-${tk}-${user.name}`;
    delete np[photoKey];
    await sp(np);
  };
  const isC = (tk, ai, wk) => st.completions.find(c => c.taskKey === tk && (c.areaId || "daily") === (ai || "daily") && c.week === wk);
  // Daily task completion check — uses day (German timezone) instead of week
  const isDailyC = (tk, person) => { const today = getToday(); return st.completions.find(c => c.taskKey === tk && c.areaId === "daily" && (c.day === today || ((!c.day) && c.week === gwk(new Date()))) && (!person || c.person === person)); };

  const doVerify = async (params) => {
    const { tk, ai, by, person, compDay, compWeek } = params;
    const isDaily = (ai || "daily") === "daily";
    // Consistent key: daily uses day, weekly uses week
    const key = isDaily ? `${compDay || compWeek}-daily-${tk}` : `${compWeek}-${ai}-${tk}`;
    const all = [...st.dailyTasks, ...st.weeklyAreas.flatMap(a => a.tasks)];
    const pts = all.find(x => x.de === tk)?.pts || 1;
    const updatedCompletions = st.completions.map(c => {
      if (c.taskKey !== tk || (c.areaId || "daily") !== (ai || "daily")) return c;
      if (isDaily) {
        if (compDay && c.day && c.day !== compDay) return c;
        if (!compDay && c.week !== compWeek) return c;
        if (person && c.person !== person) return c;
      } else {
        if (c.week !== compWeek) return c;
        if (person && c.person !== person) return c;
      }
      return { ...c, pts, verified: true, verifiedBy: by, verifiedAt: Date.now() };
    });
    await sv({ ...st, completions: updatedCompletions, verifications: { ...(st.verifications || {}), [key]: { status: "verified", by, at: Date.now() } } });
    show(st.lang === "de" ? `✓ Bestätigt! +${pts}⭐` : `✓ Xác nhận! +${pts}⭐`);
  };
  const doReject = async (params) => {
    const { tk, ai, by, reason, person, compDay, compWeek } = params;
    const isDaily = (ai || "daily") === "daily";
    // Consistent key: same format as doVerify
    const key = isDaily ? `${compDay || compWeek}-daily-${tk}` : `${compWeek}-${ai}-${tk}`;
    const ns = {
      ...st,
      // Remove the rejected completion so resident must redo
      completions: st.completions.filter(c => {
        if (c.taskKey !== tk || (c.areaId || "daily") !== (ai || "daily")) return true;
        if (isDaily) {
          if (compDay && c.day && c.day !== compDay) return true;
          if (!compDay && c.week !== compWeek) return true;
          if (person && c.person !== person) return true;
        } else {
          if (c.week !== compWeek) return true;
          if (person && c.person !== person) return true;
        }
        return false;
      }),
      verifications: { ...(st.verifications || {}), [key]: { status: "rejected", by, reason, at: Date.now() } }
    };
    await sv(ns);
    show(st.lang === "de" ? "✗ Abgelehnt — bitte nochmal erledigen" : "✗ Từ chối — vui lòng làm lại", "error");
  };
  const getVerif = (tk, ai, compDay, compWeek) => {
    const isDaily = (ai || "daily") === "daily";
    // Same consistent key format as doVerify/doReject
    const key = isDaily ? `${compDay || compWeek}-daily-${tk}` : `${compWeek}-${ai}-${tk}`;
    return (st.verifications || {})[key];
  };

  if (ld || !st) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}><div style={{ width: 36, height: 36, border: "3px solid #E2E8F0", borderTopColor: "#3B82F6", borderRadius: "50%", animation: "spin .8s linear infinite" }} /></div>;

  return (
    <div style={{ fontFamily: F, minHeight: "100vh", background: C.bg, maxWidth: 520, margin: "0 auto", position: "relative" }}>
      <style>{globalCSS}</style>
      {toast && <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", color: "#fff", padding: "10px 22px", borderRadius: 980, fontSize: 14, fontWeight: 500, zIndex: 1000, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontFamily: F, animation: "fadeUp .3s cubic-bezier(0.25,0.1,0.25,1)", background: toast.ty === "success" ? C.green : C.red, letterSpacing: 0 }}>{toast.m}</div>}
      {pinM && <PinModal t={t} st={st} pm={pinM} set={setPinM} />}
      {phView && <div style={ov} onClick={() => setPhView(null)}><div style={{ ...mod, maxWidth: 420, padding: 8 }} onClick={e => e.stopPropagation()}><img src={phView} style={{ width: "100%", borderRadius: 12 }} alt="proof" /><button style={{ ...btnG, width: "100%", marginTop: 8 }} onClick={() => setPhView(null)}>{t.closePhoto}</button></div></div>}
      {tutView && <TutorialPopup t={t} lang={st.lang} tut={tutView} onClose={() => setTutView(null)} />}
      {scr === "login" ? <LoginScreen t={t} st={st} sv={sv} onLogin={u => {
        setUser(u); setScr("plan");
        localStorage.setItem('wg_pin', u.password);
        // Request notification permission & start deadline check
        if ('Notification' in window && Notification.permission === 'default') { Notification.requestPermission(); }
        const checkDeadline = () => {
          if (!st) return; const wk = gwk(new Date()), tl = getTimeLeft(wk);
          let open = 0; st.weeklyAreas.forEach(a => a.tasks.forEach(ta => { if (!st.completions.find(c => c.taskKey === ta.de && c.areaId === a.id && c.week === wk)) open++; }));
          if (navigator.serviceWorker?.controller) { navigator.serviceWorker.controller.postMessage({ type: 'DEADLINE_CHECK', hoursLeft: tl.hours, tasksOpen: open, lang: st.lang }); }
        };
        checkDeadline(); setInterval(checkDeadline, 3600000);
        // 2-day inactivity check
        const today = getToday();
        const yesterday = (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().split('T')[0]; })();
        const hasTodayDaily = st.completions.some(c => c.areaId === 'daily' && c.person === u.name && c.day === today);
        const hasYesterdayDaily = st.completions.some(c => c.areaId === 'daily' && c.person === u.name && c.day === yesterday);
        if (!hasTodayDaily && !hasYesterdayDaily) {
          setTimeout(() => show(st.lang === 'de' ? '⚠️ Du hast seit 2 Tagen keine tägliche Aufgabe erledigt!' : '⚠️ Bạn chưa thực hiện nhiệm vụ hàng ngày 2 ngày rồi!', 'error'), 1500);
        }
      }} /> :
        <div style={{ padding: "14px 14px 40px", maxWidth: 520, margin: "0 auto" }}>
          <NavBar t={t} scr={scr} set={setScr} user={user} hp={hp} st={st} isC={isC} onLogout={() => { localStorage.removeItem('wg_pin'); setUser(null); setScr("login") }} />
          {scr === "plan" && <PlanScreen t={t} st={{ ...st, refPhotos: rp }} user={user} hp={hp} doDone={doDone} doUndo={doUndo} isC={isC} isDailyC={isDailyC} ph={ph} vp={setPhView} openTut={setTutView} doVerify={doVerify} doReject={doReject} getVerif={getVerif} />}
          {scr === "leaderboard" && <LeaderScreen t={t} st={st} user={user} />}
          {scr === "rules" && <RulesScreen t={t} lang={st.lang} st={st} />}
          {scr === "history" && <HistoryScreen t={t} st={st} hp={hp} ph={ph} vp={setPhView} user={user} />}
          {scr === "reports" && <ReportScreen t={t} st={st} sv={sv} user={user} show={show} />}
          {scr === "admin" && <AdminScreen t={t} st={{ ...st, refPhotos: rp }} sv={sv} hp={hp} rpin={rpin} show={show} user={user} srp={srp} />}
        </div>}
      {/* Announcement modal — shows after login for unread messages */}
      {user && scr !== "login" && <AnnouncementModal announcements={st.announcements || []} user={user} st={st} onDismiss={(id) => {
        const updated = (st.announcements || []).map(a => a.id === id ? { ...a, readBy: [...(a.readBy || []), user.name] } : a);
        sv({ ...st, announcements: updated });
      }} />}
    </div>
  );
}
