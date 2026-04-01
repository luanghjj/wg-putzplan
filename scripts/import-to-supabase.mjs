/**
 * Import Firebase data into Supabase
 * Run: VITE_SUPABASE_URL=xxx VITE_SUPABASE_ANON_KEY=yyy node scripts/import-to-supabase.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importData() {
  console.log("📦 Importing Firebase data to Supabase...\n");

  // Read exported data
  const exportPath = new URL("./firebase-export.json", import.meta.url).pathname;
  let exported;
  try {
    exported = JSON.parse(readFileSync(exportPath, "utf8"));
  } catch (e) {
    console.error("❌ Cannot read firebase-export.json. Run export-firebase.mjs first.");
    process.exit(1);
  }

  // 1. Import wg4 (main app data)
  if (exported.wg4) {
    console.log("📝 Importing main app data (wg4)...");
    const { error } = await supabase.from("kv_store").upsert({
      key: "wg4",
      value: exported.wg4,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      console.error("❌ wg4 import failed:", error.message);
    } else {
      console.log("✅ wg4 imported successfully");
    }
  }

  // 2. Import wg4p (photos)
  if (exported.wg4p) {
    console.log("📸 Importing photos (wg4p)...");
    const { error } = await supabase.from("kv_store").upsert({
      key: "wg4p",
      value: exported.wg4p,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      console.error("❌ wg4p import failed:", error.message);
    } else {
      console.log(`✅ wg4p imported (${Object.keys(exported.wg4p).length} photos)`);
    }
  }

  // 3. Import wg4r (ref photos) — into ref_photos table, one row per key
  if (exported.wg4r) {
    const entries = Object.entries(exported.wg4r);
    console.log(`🖼️  Importing ref photos (${entries.length} entries)...`);
    
    let success = 0, failed = 0;
    for (const [taskKey, data] of entries) {
      const safeKey = taskKey.replace(/[.#$\/\[\]]/g, "_");
      const { error } = await supabase.from("ref_photos").upsert({
        task_key: safeKey,
        data: data,
        updated_at: new Date().toISOString(),
      });
      if (error) {
        console.error(`  ❌ ${safeKey}: ${error.message}`);
        failed++;
      } else {
        success++;
      }
    }
    console.log(`✅ RefPhotos: ${success} imported, ${failed} failed`);
  }

  console.log("\n🎉 Import complete!");
  process.exit(0);
}

importData();
