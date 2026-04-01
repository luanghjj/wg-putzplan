import { supabase } from "./supabase";
import { DEF } from "./constants";

export const SK = { data: "wg4", photos: "wg4p", refPhotos: "wg4r" };

const sanitizeKey = (k) => k.replace(/[.#$\/\[\]]/g, "_");

// ---- Load full state from normalized tables ----
async function loadState() {
  const [
    { data: users },
    { data: rooms },
    { data: completions },
    { data: verifications },
    { data: tutorials },
    { data: configRows },
    { data: announcements },
    { data: reports },
  ] = await Promise.all([
    supabase.from("users").select("*"),
    supabase.from("rooms").select("*"),
    supabase.from("completions").select("*").order("id"),
    supabase.from("verifications").select("*"),
    supabase.from("tutorials").select("*"),
    supabase.from("config").select("*"),
    supabase.from("announcements").select("*"),
    supabase.from("reports").select("*"),
  ]);

  const verifObj = {};
  (verifications || []).forEach((v) => {
    verifObj[v.vkey] = { status: v.status, by: v.by_user, reason: v.reason, at: v.at_time };
  });

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
    completions: (completions || []).map((c) => ({
      taskKey: c.task_key, areaId: c.area_id, person: c.person, room: c.room,
      week: c.week, day: c.day, month: c.month, timestamp: c.timestamp,
      pts: c.pts, verified: c.verified, verifiedBy: c.verified_by, verifiedAt: c.verified_at,
    })),
    verifications: verifObj,
    tutorials: { ...DEF.tutorials, ...tutObj },
    announcements: (announcements || []).map((a) => ({
      id: a.id, title: a.title, body: a.message, createdBy: a.author, createdAt: a.ts, level: a.level || "normal", readBy: a.read_by || [],
    })),
    reports: (reports || []).map((r) => ({
      id: r.id, category: r.category, text: r.text, target: r.target,
      reporter: r.reporter, ts: r.ts, week: r.week, status: r.status,
    })),
    masterPin: cfg.masterPin ?? DEF.masterPin,
    lang: cfg.lang ?? DEF.lang,
    penalty: cfg.penalty ?? DEF.penalty,
    reward: cfg.reward ?? DEF.reward,
    sheetsUrl: cfg.sheetsUrl ?? DEF.sheetsUrl,
    rotation: cfg.rotation ?? DEF.rotation,
    dailyTasks: cfg.dailyTasks ?? DEF.dailyTasks,
    weeklyAreas: cfg.weeklyAreas ?? DEF.weeklyAreas,
    rolePerms: cfg.rolePerms ?? DEF.rolePerms,
    fairness: cfg.fairness ?? DEF.fairness,
    managerPhoto1: cfg.managerPhoto1 ?? null,
    managerPhoto2: cfg.managerPhoto2 ?? null,
  };
}

// ---- Optimized save: only write changed parts ----
let _lastSaved = null;

async function saveState(ns) {
  const prev = _lastSaved || {};
  const promises = [];

  // Users — only if changed
  if (JSON.stringify(ns.users) !== JSON.stringify(prev.users)) {
    promises.push(
      (async () => {
        const prevIds = (prev.users || []).map((u) => u.id);
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
      })()
    );
  }

  // Rooms — only if changed
  if (JSON.stringify(ns.rooms) !== JSON.stringify(prev.rooms)) {
    promises.push(
      (async () => {
        const prevIds = (prev.rooms || []).map((r) => r.id);
        const newIds = ns.rooms.map((r) => r.id);
        const removed = prevIds.filter((id) => !newIds.includes(id));
        if (removed.length) await supabase.from("rooms").delete().in("id", removed);
        if (ns.rooms.length) {
          await supabase.from("rooms").upsert(
            ns.rooms.map((r) => ({ id: r.id, name: r.name, residents: r.residents || [] }))
          );
        }
      })()
    );
  }

  // Completions — safe upsert + delete removed (NEVER delete all first)
  if (JSON.stringify(ns.completions) !== JSON.stringify(prev.completions)) {
    promises.push(
      (async () => {
        if (ns.completions.length > 0) {
          // Upsert in batches of 100 — uses timestamp as unique conflict key
          for (let i = 0; i < ns.completions.length; i += 100) {
            const batch = ns.completions.slice(i, i + 100);
            await supabase.from("completions").upsert(
              batch.map((c) => ({
                task_key: c.taskKey, area_id: c.areaId || "daily", person: c.person,
                room: c.room || null, week: c.week, day: c.day || null,
                month: c.month || null, timestamp: c.timestamp, pts: c.pts || 1,
                verified: c.verified || false, verified_by: c.verifiedBy || null,
                verified_at: c.verifiedAt || null,
              })),
              { onConflict: "timestamp" }
            );
          }
        }
        // Only delete records that were explicitly removed (present in prev but not in ns)
        const prevTs = (prev.completions || []).map((c) => c.timestamp);
        const newTs = new Set(ns.completions.map((c) => c.timestamp));
        const removed = prevTs.filter((ts) => !newTs.has(ts));
        if (removed.length) {
          await supabase.from("completions").delete().in("timestamp", removed);
        }
      })()
    );
  }

  // Verifications — only if changed
  if (JSON.stringify(ns.verifications) !== JSON.stringify(prev.verifications)) {
    promises.push(
      (async () => {
        const vEntries = Object.entries(ns.verifications || {});
        // Upsert all current verifications
        if (vEntries.length > 0) {
          await supabase.from("verifications").upsert(
            vEntries.map(([k, v]) => ({
              vkey: k, status: v.status, by_user: v.by, reason: v.reason || null, at_time: v.at,
            }))
          );
        }
        // Delete removed
        const prevKeys = Object.keys(prev.verifications || {});
        const newKeys = Object.keys(ns.verifications || {});
        const removed = prevKeys.filter((k) => !newKeys.includes(k));
        if (removed.length) await supabase.from("verifications").delete().in("vkey", removed);
      })()
    );
  }

  // Tutorials — only if changed
  if (JSON.stringify(ns.tutorials) !== JSON.stringify(prev.tutorials)) {
    promises.push(
      supabase.from("tutorials").upsert(
        Object.entries(ns.tutorials || {}).map(([k, v]) => ({
          task_key: sanitizeKey(k), steps: v.steps || [], video_url: v.videoUrl || null,
        }))
      )
    );
  }

  // Config — always save (cheap, small data)
  const configFields = {
    masterPin: ns.masterPin, lang: ns.lang, penalty: ns.penalty,
    reward: ns.reward, sheetsUrl: ns.sheetsUrl, rotation: ns.rotation,
    dailyTasks: ns.dailyTasks, weeklyAreas: ns.weeklyAreas,
    rolePerms: ns.rolePerms, fairness: ns.fairness,
    managerPhoto1: ns.managerPhoto1, managerPhoto2: ns.managerPhoto2,
  };
  const configEntries = Object.entries(configFields);
  const toUpsert = configEntries.filter(([, v]) => v != null).map(([k, v]) => ({ key: k, value: v, updated_at: new Date().toISOString() }));
  const toDelete = configEntries.filter(([, v]) => v === null).map(([k]) => k);
  if (toUpsert.length) promises.push(supabase.from("config").upsert(toUpsert));
  if (toDelete.length) promises.push(supabase.from("config").delete().in("key", toDelete));

  // Announcements — only if changed
  if (JSON.stringify(ns.announcements) !== JSON.stringify(prev.announcements)) {
    promises.push(
      (async () => {
        const anns = ns.announcements || [];
        if (anns.length > 0) {
          await supabase.from("announcements").upsert(
            anns.map((a) => ({
              id: a.id, title: a.title || null, message: a.body || null,
              author: a.createdBy || null, ts: a.createdAt || null, read_by: a.readBy || [],
            }))
          );
        }
        // Delete removed
        const prevIds = (prev.announcements || []).map((a) => a.id);
        const newIds = anns.map((a) => a.id);
        const removed = prevIds.filter((id) => !newIds.includes(id));
        if (removed.length) await supabase.from("announcements").delete().in("id", removed);
      })()
    );
  }

  // Reports — only if changed
  if (JSON.stringify(ns.reports) !== JSON.stringify(prev.reports)) {
    promises.push(
      (async () => {
        const reps = ns.reports || [];
        if (reps.length > 0) {
          await supabase.from("reports").upsert(
            reps.map((r) => ({
              id: r.id, category: r.category || null, text: r.text || null,
              target: r.target || null, reporter: r.reporter || null,
              ts: r.ts || null, week: r.week || null, status: r.status || "new",
            }))
          );
        }
        const prevIds = (prev.reports || []).map((r) => r.id);
        const newIds = reps.map((r) => r.id);
        const removed = prevIds.filter((id) => !newIds.includes(id));
        if (removed.length) await supabase.from("reports").delete().in("id", removed);
      })()
    );
  }

  const results = await Promise.allSettled(promises);
  results.forEach((r, i) => {
    if (r.status === 'rejected') console.error(`saveState promise ${i} failed:`, r.reason);
    if (r.value?.error) console.error(`saveState promise ${i} error:`, r.value.error);
  });
  _lastSaved = JSON.parse(JSON.stringify(ns)); // deep clone for next diff
}

// ---- Public API ----
export const storage = {
  async get(key) {
    if (key === SK.data) {
      const state = await loadState();
      _lastSaved = JSON.parse(JSON.stringify(state)); // cache for diff
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
      // Upsert changed photos, delete removed
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
      task_key: sanitizeKey(taskKey), data: base64Data, updated_at: new Date().toISOString(),
    });
  },
  async deleteOne(taskKey) {
    await supabase.from("ref_photos").delete().eq("task_key", sanitizeKey(taskKey));
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

  // Main data — debounced: multiple table changes trigger single reload
  const tables = ["users", "rooms", "completions", "verifications", "tutorials", "config", "announcements", "reports"];
  const debouncedReload = () => {
    clearTimeout(_realtimeDebounce);
    _realtimeDebounce = setTimeout(async () => {
      const state = await loadState();
      _lastSaved = JSON.parse(JSON.stringify(state));
      callback(state);
    }, 300); // 300ms debounce — combines multiple rapid changes
  };

  const channels = tables.map((table) =>
    supabase.channel(`${table}_${ts}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, debouncedReload)
      .subscribe()
  );

  return () => channels.forEach((ch) => supabase.removeChannel(ch));
}
