import { supabase } from "./supabase";
import { DEF } from "./constants";

export const SK = { data: "wg4", photos: "wg4p", refPhotos: "wg4r" };

// ---- Helpers ----
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

  // Build verifications object from rows
  const verifObj = {};
  (verifications || []).forEach((v) => {
    verifObj[v.vkey] = { status: v.status, by: v.by_user, reason: v.reason, at: v.at_time };
  });

  // Build tutorials object from rows
  const tutObj = {};
  (tutorials || []).forEach((t) => {
    tutObj[t.task_key] = { steps: t.steps || [], videoUrl: t.video_url || "" };
  });

  // Build config object from rows
  const cfg = {};
  (configRows || []).forEach((c) => {
    cfg[c.key] = c.value;
  });

  // Map completions from DB rows
  const compArr = (completions || []).map((c) => ({
    taskKey: c.task_key,
    areaId: c.area_id,
    person: c.person,
    room: c.room,
    week: c.week,
    day: c.day,
    month: c.month,
    timestamp: c.timestamp,
    pts: c.pts,
    verified: c.verified,
    verifiedBy: c.verified_by,
    verifiedAt: c.verified_at,
  }));

  // Map users from DB rows
  const usersArr = (users || []).map((u) => ({
    id: u.id,
    name: u.name,
    role: u.role,
    room: u.room,
    roomId: u.room_id,
    password: u.password,
  }));

  // Map rooms from DB rows
  const roomsArr = (rooms || []).map((r) => ({
    id: r.id,
    name: r.name,
    residents: r.residents || [],
  }));

  // Map announcements from DB rows
  const annArr = (announcements || []).map((a) => ({
    id: a.id,
    title: a.title,
    message: a.message,
    author: a.author,
    ts: a.ts,
    readBy: a.read_by || [],
  }));

  // Map reports from DB rows
  const repArr = (reports || []).map((r) => ({
    id: r.id,
    category: r.category,
    text: r.text,
    target: r.target,
    reporter: r.reporter,
    ts: r.ts,
    week: r.week,
    status: r.status,
  }));

  return {
    ...DEF,
    users: usersArr,
    rooms: roomsArr,
    completions: compArr,
    verifications: verifObj,
    tutorials: { ...DEF.tutorials, ...tutObj },
    announcements: annArr,
    reports: repArr,
    // Config fields
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
  };
}

// ---- Save full state: diff & write to normalized tables ----
async function saveState(ns) {
  const promises = [];

  // Save users — upsert all, delete removed
  promises.push(
    supabase.from("users").upsert(
      ns.users.map((u) => ({
        id: u.id,
        name: u.name,
        role: u.role,
        room: u.room || null,
        room_id: u.roomId || null,
        password: u.password,
      }))
    )
  );

  // Save rooms
  promises.push(
    supabase.from("rooms").upsert(
      ns.rooms.map((r) => ({
        id: r.id,
        name: r.name,
        residents: r.residents || [],
      }))
    )
  );

  // Save completions: delete all, then insert fresh
  promises.push(
    (async () => {
      await supabase.from("completions").delete().neq("id", 0);
      if (ns.completions.length > 0) {
        await supabase.from("completions").insert(
          ns.completions.map((c) => ({
            task_key: c.taskKey,
            area_id: c.areaId || "daily",
            person: c.person,
            room: c.room,
            week: c.week,
            day: c.day || null,
            month: c.month || null,
            timestamp: c.timestamp,
            pts: c.pts || 1,
            verified: c.verified || false,
            verified_by: c.verifiedBy || null,
            verified_at: c.verifiedAt || null,
          }))
        );
      }
    })()
  );

  // Save verifications: delete all, then insert fresh
  promises.push(
    (async () => {
      await supabase.from("verifications").delete().neq("vkey", "");
      const vEntries = Object.entries(ns.verifications || {});
      if (vEntries.length > 0) {
        await supabase.from("verifications").insert(
          vEntries.map(([k, v]) => ({
            vkey: k,
            status: v.status,
            by_user: v.by,
            reason: v.reason || null,
            at_time: v.at,
          }))
        );
      }
    })()
  );

  // Save tutorials
  promises.push(
    (async () => {
      const tutEntries = Object.entries(ns.tutorials || {});
      if (tutEntries.length > 0) {
        await supabase.from("tutorials").upsert(
          tutEntries.map(([k, v]) => ({
            task_key: sanitizeKey(k),
            steps: v.steps || [],
            video_url: v.videoUrl || null,
          }))
        );
      }
    })()
  );

  // Save config fields
  const configFields = {
    masterPin: ns.masterPin,
    lang: ns.lang,
    penalty: ns.penalty,
    reward: ns.reward,
    sheetsUrl: ns.sheetsUrl,
    rotation: ns.rotation,
    dailyTasks: ns.dailyTasks,
    weeklyAreas: ns.weeklyAreas,
    rolePerms: ns.rolePerms,
    fairness: ns.fairness,
  };
  promises.push(
    supabase.from("config").upsert(
      Object.entries(configFields).map(([k, v]) => ({
        key: k,
        value: v,
        updated_at: new Date().toISOString(),
      }))
    )
  );

  // Save announcements
  promises.push(
    (async () => {
      await supabase.from("announcements").delete().neq("id", "");
      const anns = ns.announcements || [];
      if (anns.length > 0) {
        await supabase.from("announcements").insert(
          anns.map((a) => ({
            id: a.id,
            title: a.title || null,
            message: a.message || null,
            author: a.author || null,
            ts: a.ts || null,
            read_by: a.readBy || [],
          }))
        );
      }
    })()
  );

  // Save reports
  promises.push(
    (async () => {
      await supabase.from("reports").delete().neq("id", "");
      const reps = ns.reports || [];
      if (reps.length > 0) {
        await supabase.from("reports").insert(
          reps.map((r) => ({
            id: r.id,
            category: r.category || null,
            text: r.text || null,
            target: r.target || null,
            reporter: r.reporter || null,
            ts: r.ts || null,
            week: r.week || null,
            status: r.status || "new",
          }))
        );
      }
    })()
  );

  await Promise.all(promises);
}

// ---- Public API (same interface as before) ----
export const storage = {
  async get(key) {
    if (key === SK.data) {
      const state = await loadState();
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
      // Delete all photos, then insert fresh
      await supabase.from("photos").delete().neq("key", "");
      const entries = Object.entries(parsed);
      if (entries.length > 0) {
        // Insert in batches of 50 to avoid payload limits
        for (let i = 0; i < entries.length; i += 50) {
          const batch = entries.slice(i, i + 50);
          await supabase.from("photos").upsert(
            batch.map(([k, v]) => ({ key: k, data: v }))
          );
        }
      }
      return;
    }
  },
};

// ---- RefPhoto per-key helpers ----
export const refPhotoStorage = {
  async setOne(taskKey, base64Data) {
    const safeKey = sanitizeKey(taskKey);
    await supabase.from("ref_photos").upsert({
      task_key: safeKey,
      data: base64Data,
      updated_at: new Date().toISOString(),
    });
  },

  async deleteOne(taskKey) {
    const safeKey = sanitizeKey(taskKey);
    await supabase.from("ref_photos").delete().eq("task_key", safeKey);
  },

  async getAll() {
    const { data } = await supabase.from("ref_photos").select("task_key, data");
    const result = {};
    (data || []).forEach((row) => (result[row.task_key] = row.data));
    return result;
  },
};

// ---- Realtime listener ----
export function onDataChange(key, callback) {
  const ts = Date.now();

  if (key === SK.refPhotos) {
    const ch = supabase
      .channel(`rp_${ts}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "ref_photos" }, async () => {
        callback(await refPhotoStorage.getAll());
      })
      .subscribe();
    return () => supabase.removeChannel(ch);
  }

  if (key === SK.photos) {
    const ch = supabase
      .channel(`ph_${ts}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "photos" }, async () => {
        const { data } = await supabase.from("photos").select("key, data");
        const obj = {};
        (data || []).forEach((p) => (obj[p.key] = p.data));
        callback(obj);
      })
      .subscribe();
    return () => supabase.removeChannel(ch);
  }

  // For main data — listen to all relevant tables
  const tables = ["users", "rooms", "completions", "verifications", "tutorials", "config", "announcements", "reports"];
  const channels = tables.map((table) =>
    supabase
      .channel(`${table}_${ts}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, async () => {
        const state = await loadState();
        callback(state);
      })
      .subscribe()
  );

  return () => channels.forEach((ch) => supabase.removeChannel(ch));
}
