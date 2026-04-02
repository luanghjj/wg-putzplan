import { supabase } from "./supabase";
import { DEF } from "./constants";

export const SK = { data: "wg4", photos: "wg4p", refPhotos: "wg4r" };

// ---- Load full state from normalized tables ----
async function loadState() {
  const [
    { data: users },
    { data: rooms },
    { data: historyRows },
    { data: tutorials },
    { data: configRows },
    { data: announcements },
    { data: reports },
  ] = await Promise.all([
    supabase.from("users").select("*"),
    supabase.from("rooms").select("*"),
    supabase.from("history").select("*").order("id"),
    supabase.from("tutorials").select("*"),
    supabase.from("config").select("*"),
    supabase.from("announcements").select("*"),
    supabase.from("reports").select("*"),
  ]);

  const tutObj = {};
  (tutorials || []).forEach((t) => {
    tutObj[t.task_key] = { steps: t.steps || [], videoUrl: t.video_url || "" };
  });

  const cfg = {};
  (configRows || []).forEach((c) => (cfg[c.key] = c.value));

  return {
    ...DEF,
    users: (users || []).map((u) => ({
      id: u.id, name: u.name, role: u.role, room: u.room, roomId: u.room_id, password: u.password,
    })),
    rooms: (rooms || []).map((r) => ({ id: r.id, name: r.name, residents: r.residents || [] })),
    // history = single source of truth (replaces completions + verifications)
    history: (historyRows || []).map((h) => ({
      id: h.id,
      taskKey: h.task_key, areaId: h.area_id, person: h.person, room: h.room,
      week: h.week, day: h.day, month: h.month, timestamp: h.timestamp,
      pts: h.pts, status: h.status,
      verifiedBy: h.verified_by, verifiedAt: h.verified_at,
      photoKey: h.photo_key,
    })),
    tutorials: { ...DEF.tutorials, ...tutObj },
    announcements: (announcements || []).map((a) => ({
      id: a.id, title: a.title, body: a.message, createdBy: a.author,
      createdAt: a.ts, level: a.level || "normal", readBy: a.read_by || [],
    })),
    reports: (reports || []).map((r) => ({
      id: r.id, category: r.category, text: r.text, target: r.target,
      reporter: r.reporter, ts: r.ts, week: r.week, status: r.status,
    })),
    masterPin: cfg.masterPin ?? DEF.masterPin,
    lang: cfg.lang ?? DEF.lang,
    sheetsUrl: cfg.sheetsUrl ?? DEF.sheetsUrl,
    rotation: cfg.rotation ?? DEF.rotation,
    dailyTasks: cfg.dailyTasks ?? DEF.dailyTasks,
    weeklyAreas: cfg.weeklyAreas ?? DEF.weeklyAreas,
    rolePerms: cfg.rolePerms ?? DEF.rolePerms,
    managerPhoto1: cfg.managerPhoto1 ?? null,
    managerPhoto2: cfg.managerPhoto2 ?? null,
    trashPhotos: cfg.trashPhotos ? (typeof cfg.trashPhotos === 'string' ? JSON.parse(cfg.trashPhotos) : cfg.trashPhotos) : [],
  };
}

// ---- Config save (settings only, not history) ----
let _lastSavedCfg = null;

async function saveConfig(ns) {
  const configFields = {
    masterPin: ns.masterPin, lang: ns.lang, sheetsUrl: ns.sheetsUrl,
    rotation: ns.rotation, dailyTasks: ns.dailyTasks, weeklyAreas: ns.weeklyAreas,
    rolePerms: ns.rolePerms, managerPhoto1: ns.managerPhoto1, managerPhoto2: ns.managerPhoto2,
    trashPhotos: ns.trashPhotos || [],
  };
  const toUpsert = Object.entries(configFields)
    .filter(([, v]) => v != null)
    .map(([k, v]) => ({ key: k, value: v, updated_at: new Date().toISOString() }));
  if (toUpsert.length) await supabase.from("config").upsert(toUpsert);
}

async function saveUsers(ns, prev) {
  if (JSON.stringify(ns.users) === JSON.stringify(prev?.users)) return;
  const prevIds = (prev?.users || []).map((u) => u.id);
  const newIds = ns.users.map((u) => u.id);
  const removed = prevIds.filter((id) => !newIds.includes(id));
  if (removed.length) await supabase.from("users").delete().in("id", removed);
  if (ns.users.length) {
    await supabase.from("users").upsert(
      ns.users.map((u) => ({
        id: u.id, name: u.name, role: u.role,
        room: u.room || null, room_id: u.roomId || null, password: u.password,
      }))
    );
  }
}

async function saveRooms(ns, prev) {
  if (JSON.stringify(ns.rooms) === JSON.stringify(prev?.rooms)) return;
  const prevIds = (prev?.rooms || []).map((r) => r.id);
  const newIds = ns.rooms.map((r) => r.id);
  const removed = prevIds.filter((id) => !newIds.includes(id));
  if (removed.length) await supabase.from("rooms").delete().in("id", removed);
  if (ns.rooms.length) {
    await supabase.from("rooms").upsert(
      ns.rooms.map((r) => ({ id: r.id, name: r.name, residents: r.residents || [] }))
    );
  }
}

async function saveTutorials(ns, prev) {
  if (JSON.stringify(ns.tutorials) === JSON.stringify(prev?.tutorials)) return;
  await supabase.from("tutorials").upsert(
    Object.entries(ns.tutorials || {}).map(([k, v]) => ({
      task_key: k, steps: v.steps || [], video_url: v.videoUrl || null,
    }))
  );
}

async function saveAnnouncements(ns, prev) {
  if (JSON.stringify(ns.announcements) === JSON.stringify(prev?.announcements)) return;
  const anns = ns.announcements || [];
  if (anns.length) {
    await supabase.from("announcements").upsert(
      anns.map((a) => ({
        id: a.id, title: a.title || null, message: a.body || null,
        author: a.createdBy || null, ts: a.createdAt || null, read_by: a.readBy || [],
      }))
    );
  }
  const prevIds = (prev?.announcements || []).map((a) => a.id);
  const newIds = anns.map((a) => a.id);
  const removed = prevIds.filter((id) => !newIds.includes(id));
  if (removed.length) await supabase.from("announcements").delete().in("id", removed);
}

async function saveReports(ns, prev) {
  if (JSON.stringify(ns.reports) === JSON.stringify(prev?.reports)) return;
  const reps = ns.reports || [];
  if (reps.length) {
    await supabase.from("reports").upsert(
      reps.map((r) => ({
        id: r.id, category: r.category || null, text: r.text || null,
        target: r.target || null, reporter: r.reporter || null,
        ts: r.ts || null, week: r.week || null, status: r.status || "new",
      }))
    );
  }
  const prevIds = (prev?.reports || []).map((r) => r.id);
  const newIds = reps.map((r) => r.id);
  const removed = prevIds.filter((id) => !newIds.includes(id));
  if (removed.length) await supabase.from("reports").delete().in("id", removed);
}

// ---- Main save (config + users + rooms + etc — NOT history, history is direct) ----
let _lastSaved = null;

async function saveState(ns) {
  const prev = _lastSaved || {};
  await Promise.allSettled([
    saveConfig(ns),
    saveUsers(ns, prev),
    saveRooms(ns, prev),
    saveTutorials(ns, prev),
    saveAnnouncements(ns, prev),
    saveReports(ns, prev),
  ]);
  _lastSaved = JSON.parse(JSON.stringify(ns));
}

// ---- Direct history CRUD (called from App.jsx, bypass saveState) ----
export const historyDB = {
  // Insert new entry (daily auto or weekly pending)
  async insert(entry) {
    const row = {
      task_key: entry.taskKey, area_id: entry.areaId || "daily",
      person: entry.person, room: entry.room || null,
      week: entry.week, day: entry.day || null, month: entry.month || null,
      pts: entry.pts || 1, status: entry.status,
      verified_by: entry.verifiedBy || null, verified_at: entry.verifiedAt || null,
      photo_key: entry.photoKey || null, timestamp: entry.timestamp,
    };
    const { data, error } = await supabase.from("history").insert(row).select().single();
    if (error) { console.error("history.insert error:", error.message); return null; }
    return { ...entry, id: data.id };
  },

  // Verify: update status to 'verified'
  async verify(id, by) {
    const now = Date.now();
    const { error } = await supabase.from("history")
      .update({ status: "verified", verified_by: by, verified_at: now })
      .eq("id", id);
    if (error) console.error("history.verify error:", error.message);
    return { verifiedBy: by, verifiedAt: now };
  },

  // Reject/undo: delete the row
  async remove(id) {
    const { error } = await supabase.from("history").delete().eq("id", id);
    if (error) console.error("history.remove error:", error.message);
  },
};

// ---- Public API ----
export const storage = {
  async get(key) {
    if (key === SK.data) {
      const state = await loadState();
      _lastSaved = JSON.parse(JSON.stringify(state));
      return { value: JSON.stringify(state) };
    }
    if (key === SK.photos) {
      const { data } = await supabase.from("photos").select("key, data");
      const obj = {};
      (data || []).forEach((p) => (obj[p.key] = p.data));
      return { value: JSON.stringify(obj) };
    }
    return { value: null };
  },

  async set(key, value) {
    const parsed = JSON.parse(value);
    if (key === SK.data) {
      await saveState(parsed);
      return;
    }
    if (key === SK.photos) {
      const { data: existing } = await supabase.from("photos").select("key");
      const existingKeys = (existing || []).map((p) => p.key);
      const newKeys = Object.keys(parsed);
      const removed = existingKeys.filter((k) => !newKeys.includes(k));
      if (removed.length) await supabase.from("photos").delete().in("key", removed);
      const entries = Object.entries(parsed);
      if (entries.length > 0) {
        for (let i = 0; i < entries.length; i += 50) {
          const batch = entries.slice(i, i + 50);
          await supabase.from("photos").upsert(batch.map(([k, v]) => ({ key: k, data: v })));
        }
      }
      return;
    }
  },
};

// ---- RefPhoto helpers ----
export const refPhotoStorage = {
  async setOne(taskKey, base64Data) {
    await supabase.from("ref_photos").upsert({
      task_key: taskKey.replace(/[.#$\/\[\]]/g, "_"), data: base64Data,
      updated_at: new Date().toISOString(),
    });
  },
  async deleteOne(taskKey) {
    await supabase.from("ref_photos").delete().eq("task_key", taskKey.replace(/[.#$\/\[\]]/g, "_"));
  },
  async getAll() {
    const { data } = await supabase.from("ref_photos").select("task_key, data");
    const result = {};
    (data || []).forEach((row) => (result[row.task_key] = row.data));
    return result;
  },
};

// ---- Realtime listener ----
let _realtimeDebounce = null;

export function onDataChange(key, callback) {
  const ts = Date.now();

  if (key === SK.refPhotos) {
    const ch = supabase.channel(`rp_${ts}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "ref_photos" }, async () => {
        callback(await refPhotoStorage.getAll());
      }).subscribe();
    return () => supabase.removeChannel(ch);
  }

  if (key === SK.photos) {
    const ch = supabase.channel(`ph_${ts}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "photos" }, async () => {
        const { data } = await supabase.from("photos").select("key, data");
        const obj = {};
        (data || []).forEach((p) => (obj[p.key] = p.data));
        callback(obj);
      }).subscribe();
    return () => supabase.removeChannel(ch);
  }

  // Main data — listen to all relevant tables, debounce reload
  const tables = ["users", "rooms", "history", "tutorials", "config", "announcements", "reports"];
  const debouncedReload = () => {
    clearTimeout(_realtimeDebounce);
    _realtimeDebounce = setTimeout(async () => {
      const state = await loadState();
      _lastSaved = JSON.parse(JSON.stringify(state));
      callback(state);
    }, 400);
  };

  const channels = tables.map((table) =>
    supabase.channel(`${table}_${ts}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, debouncedReload)
      .subscribe()
  );

  return () => channels.forEach((ch) => supabase.removeChannel(ch));
}
