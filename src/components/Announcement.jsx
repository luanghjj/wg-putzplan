import { useState, useEffect } from "react";
import { F, C, ov } from "../styles";

const LEVELS = {
  normal: { bg: "linear-gradient(135deg,#0071E3,#34A5FF)", icon: "📢", label: { de: "Info", vi: "Thông tin" } },
  important: { bg: "linear-gradient(135deg,#FF9500,#FFB340)", icon: "⚠️", label: { de: "Wichtig", vi: "Quan trọng" } },
  urgent: { bg: "linear-gradient(135deg,#FF3B30,#FF6961)", icon: "🚨", label: { de: "Dringend", vi: "Khẩn cấp" } },
};

export function AnnouncementModal({ announcements, user, st, onDismiss }) {
  const [canClose, setCanClose] = useState(false);
  const unread = (announcements || []).filter(
    (a) => !(a.readBy || []).includes(user.name)
  );
  const current = unread[0];

  useEffect(() => {
    if (!current) return;
    setCanClose(false);
    const t = setTimeout(() => setCanClose(true), 3000);
    return () => clearTimeout(t);
  }, [current?.id]);

  if (!current) return null;

  const lvl = LEVELS[current.level] || LEVELS.normal;
  const lang = st.lang || "de";
  const date = new Date(current.createdAt);
  const fmt = date.toLocaleDateString(lang === "de" ? "de-DE" : "vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div style={{ ...ov, zIndex: 9999, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
      <div style={{ width: "100%", maxWidth: 420, margin: "auto", padding: 24, animation: "fadeUp .3s ease" }}>
        {/* Level badge */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ display: "inline-block", padding: "8px 20px", borderRadius: 14, background: lvl.bg, fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: F, letterSpacing: "-0.01em" }}>
            {lvl.icon} {lvl.label[lang]}
          </div>
        </div>

        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 22, padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.2)" }}>
          <div style={{ fontSize: 11, color: C.textSecondary, marginBottom: 8 }}>
            {current.createdBy} · {fmt}
          </div>
          <h2 style={{ margin: "0 0 12px", fontSize: 22, fontWeight: 800, color: C.text, fontFamily: F, letterSpacing: "-0.022em", lineHeight: 1.3 }}>
            {current.title}
          </h2>
          <p style={{ margin: 0, fontSize: 15, color: "#374151", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {current.body}
          </p>
        </div>

        {/* Dismiss button */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          {canClose ? (
            <button
              onClick={() => onDismiss(current.id)}
              style={{ padding: "14px 40px", borderRadius: 14, border: "none", background: "#fff", color: C.text, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: F, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", transition: "transform .15s", letterSpacing: "-0.01em" }}
            >
              ✓ {lang === "de" ? "Gelesen" : "Đã đọc"}
            </button>
          ) : (
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, fontFamily: F }}>
              {lang === "de" ? "Bitte lesen..." : "Vui lòng đọc..."}
              <div style={{ width: 120, height: 3, background: "rgba(255,255,255,0.15)", borderRadius: 2, margin: "8px auto 0", overflow: "hidden" }}>
                <div style={{ height: "100%", background: "#fff", borderRadius: 2, animation: "fillBar 3s linear forwards" }} />
              </div>
            </div>
          )}
        </div>

        {unread.length > 1 && (
          <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
            {unread.length - 1} {lang === "de" ? "weitere Nachricht(en)" : "thông báo khác"}
          </div>
        )}
      </div>
    </div>
  );
}

export function AnnouncementAdmin({ t, st, sv, user, show }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [level, setLevel] = useState("normal");
  const lang = st.lang || "de";

  const send = () => {
    if (!title.trim() || !body.trim()) return;
    const ann = {
      id: Date.now().toString(),
      title: title.trim(),
      body: body.trim(),
      level,
      createdBy: user.name,
      createdAt: Date.now(),
      readBy: [user.name],
    };
    sv({ ...st, announcements: [...(st.announcements || []), ann] });
    // Send browser notification
    if ("Notification" in window && Notification.permission === "granted") {
      const lvl = LEVELS[level] || LEVELS.normal;
      new Notification(`${lvl.icon} ${title.trim()}`, { body: body.trim(), icon: "/icon-512.png" });
    }
    // Also trigger SW notification for background
    if (navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "ANNOUNCEMENT",
        title: title.trim(),
        body: body.trim(),
        level,
      });
    }
    setTitle("");
    setBody("");
    setLevel("normal");
    show(lang === "de" ? "📢 Gesendet!" : "📢 Đã gửi!");
  };

  const del = (id) => {
    sv({ ...st, announcements: (st.announcements || []).filter((a) => a.id !== id) });
    show("✓");
  };

  const announcements = (st.announcements || []).slice().reverse();

  return (
    <div>
      {/* Create form */}
      <div style={{ background: "#fff", borderRadius: 14, padding: 16, marginBottom: 14, boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
        <h4 style={{ margin: "0 0 12px", fontSize: 14, fontFamily: F, color: C.text }}>
          📢 {lang === "de" ? "Neue Ankündigung" : "Tạo thông báo mới"}
        </h4>
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          {Object.entries(LEVELS).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setLevel(k)}
              style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: level === k ? "2px solid" : "2px solid transparent", borderColor: level === k ? (k === "urgent" ? C.red : k === "important" ? C.orange : C.accent) : "transparent", background: level === k ? (k === "urgent" ? "rgba(255,59,48,0.08)" : k === "important" ? "rgba(255,149,0,0.08)" : "rgba(0,113,227,0.08)") : "rgba(0,0,0,0.03)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: F, color: C.text, textAlign: "center" }}
            >
              {v.icon} {v.label[lang]}
            </button>
          ))}
        </div>
        <input
          style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: F, marginBottom: 8, boxSizing: "border-box", fontWeight: 600 }}
          placeholder={lang === "de" ? "Titel" : "Tiêu đề"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 13, fontFamily: F, marginBottom: 10, boxSizing: "border-box", minHeight: 80, resize: "vertical" }}
          placeholder={lang === "de" ? "Nachricht..." : "Nội dung..."}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button
          onClick={send}
          style={{ width: "100%", padding: "12px", borderRadius: 12, border: "none", background: C.accent, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: F }}
        >
          📢 {lang === "de" ? "An alle senden" : "Gửi cho tất cả"}
        </button>
      </div>

      {/* History */}
      <h4 style={{ fontSize: 13, fontFamily: F, color: C.textSecondary, margin: "0 0 8px" }}>
        {lang === "de" ? "Gesendete Nachrichten" : "Thông báo đã gửi"} ({announcements.length})
      </h4>
      {announcements.map((a) => {
        const lvl = LEVELS[a.level] || LEVELS.normal;
        const readCount = (a.readBy || []).length;
        const totalUsers = st.users.length;
        return (
          <div key={a.id} style={{ background: "#fff", borderRadius: 12, padding: 12, marginBottom: 6, boxShadow: "0 1px 2px rgba(0,0,0,.03)", borderLeft: `3px solid ${a.level === "urgent" ? C.red : a.level === "important" ? C.orange : C.accent}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 12 }}>{lvl.icon}</span>
              <strong style={{ flex: 1, fontSize: 13, color: C.text }}>{a.title}</strong>
              <button onClick={() => del(a.id)} style={{ background: "none", border: "none", fontSize: 16, color: "#CBD5E1", cursor: "pointer", padding: 0 }}>×</button>
            </div>
            <p style={{ margin: "0 0 4px", fontSize: 12, color: "#64748B", lineHeight: 1.4 }}>{a.body.length > 80 ? a.body.slice(0, 80) + "..." : a.body}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: C.textSecondary }}>
              <span>{new Date(a.createdAt).toLocaleDateString()}</span>
              <span style={{ background: readCount === totalUsers ? "rgba(52,199,89,0.08)" : "rgba(0,0,0,0.04)", color: readCount === totalUsers ? C.green : C.textSecondary, padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>
                👁 {readCount}/{totalUsers}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
