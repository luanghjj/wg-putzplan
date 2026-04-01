/**
 * Import Firebase export data into normalized Supabase tables
 * Run: VITE_SUPABASE_URL=xxx VITE_SUPABASE_ANON_KEY=yyy node scripts/migrate-to-normalized.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
  process.exit(1);
}
const sb = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log("📦 Importing data to normalized tables...\n");

  const exportPath = new URL("./firebase-export.json", import.meta.url).pathname;
  let exported;
  try {
    exported = JSON.parse(readFileSync(exportPath, "utf8"));
  } catch (e) {
    console.error("❌ Cannot read firebase-export.json");
    process.exit(1);
  }

  const d = exported.wg4;
  if (!d) { console.error("❌ No wg4 data"); process.exit(1); }

  // 1. Users
  const users = Array.isArray(d.users) ? d.users : Object.values(d.users || {});
  if (users.length > 0) {
    const { error } = await sb.from("users").upsert(
      users.map((u) => ({
        id: u.id, name: u.name, role: u.role,
        room: u.room || null, room_id: u.roomId || null, password: u.password,
      }))
    );
    console.log(error ? `❌ Users: ${error.message}` : `✅ Users: ${users.length}`);
  }

  // 2. Rooms
  const rooms = Array.isArray(d.rooms) ? d.rooms : Object.values(d.rooms || {});
  if (rooms.length > 0) {
    const { error } = await sb.from("rooms").upsert(
      rooms.map((r) => ({ id: r.id, name: r.name, residents: r.residents || [] }))
    );
    console.log(error ? `❌ Rooms: ${error.message}` : `✅ Rooms: ${rooms.length}`);
  }

  // 3. Completions
  const completions = Array.isArray(d.completions) ? d.completions : Object.values(d.completions || {});
  if (completions.length > 0) {
    const { error } = await sb.from("completions").insert(
      completions.map((c) => ({
        task_key: c.taskKey, area_id: c.areaId || "daily", person: c.person,
        room: c.room || null, week: c.week, day: c.day || null,
        month: c.month || null, timestamp: c.timestamp,
        pts: c.pts || 1, verified: c.verified || false,
        verified_by: c.verifiedBy || null, verified_at: c.verifiedAt || null,
      }))
    );
    console.log(error ? `❌ Completions: ${error.message}` : `✅ Completions: ${completions.length}`);
  }

  // 4. Verifications
  const verifs = Object.entries(d.verifications || {});
  if (verifs.length > 0) {
    const { error } = await sb.from("verifications").upsert(
      verifs.map(([k, v]) => ({
        vkey: k, status: v.status, by_user: v.by, reason: v.reason || null, at_time: v.at,
      }))
    );
    console.log(error ? `❌ Verifications: ${error.message}` : `✅ Verifications: ${verifs.length}`);
  }

  // 5. Tutorials
  const safeKey = (k) => k.replace(/[.#$\/\[\]]/g, "_");
  const tuts = Object.entries(d.tutorials || {});
  if (tuts.length > 0) {
    const { error } = await sb.from("tutorials").upsert(
      tuts.map(([k, v]) => ({
        task_key: safeKey(k), steps: v.steps || [], video_url: v.videoUrl || null,
      }))
    );
    console.log(error ? `❌ Tutorials: ${error.message}` : `✅ Tutorials: ${tuts.length}`);
  }

  // 6. Config
  const configFields = ["masterPin","lang","penalty","reward","sheetsUrl","rotation","dailyTasks","weeklyAreas","rolePerms","fairness"];
  const configRows = configFields.filter((k) => d[k] !== undefined)
    .map((k) => ({ key: k, value: d[k], updated_at: new Date().toISOString() }));
  if (configRows.length > 0) {
    const { error } = await sb.from("config").upsert(configRows);
    console.log(error ? `❌ Config: ${error.message}` : `✅ Config: ${configRows.length} fields`);
  }

  // 7. Announcements
  const anns = Array.isArray(d.announcements) ? d.announcements : Object.values(d.announcements || {});
  if (anns.length > 0) {
    const { error } = await sb.from("announcements").upsert(
      anns.map((a) => ({
        id: a.id, title: a.title || null, message: a.message || null,
        author: a.author || null, ts: a.ts || null, read_by: a.readBy || [],
      }))
    );
    console.log(error ? `❌ Announcements: ${error.message}` : `✅ Announcements: ${anns.length}`);
  }

  // 8. Reports
  const reps = Array.isArray(d.reports) ? d.reports : Object.values(d.reports || {});
  if (reps.length > 0) {
    const { error } = await sb.from("reports").upsert(
      reps.map((r) => ({
        id: r.id, category: r.category || null, text: r.text || null,
        target: r.target || null, reporter: r.reporter || null,
        ts: r.ts || null, week: r.week || null, status: r.status || "new",
      }))
    );
    console.log(error ? `❌ Reports: ${error.message}` : `✅ Reports: ${reps.length}`);
  }

  // 9. Photos
  if (exported.wg4p) {
    const photoEntries = Object.entries(exported.wg4p);
    for (let i = 0; i < photoEntries.length; i += 50) {
      const batch = photoEntries.slice(i, i + 50);
      await sb.from("photos").upsert(batch.map(([k, v]) => ({ key: k, data: v })));
    }
    console.log(`✅ Photos: ${photoEntries.length}`);
  }

  // Verify
  console.log("\n📊 Verification:");
  const checks = ["users","rooms","completions","verifications","tutorials","config","photos","announcements","reports","ref_photos"];
  for (const t of checks) {
    const { count } = await sb.from(t).select("*", { count: "exact", head: true });
    console.log(`   ${t}: ${count} rows`);
  }

  console.log("\n🎉 Done!");
  process.exit(0);
}

migrate();
