/**
 * Export all data from Firebase Realtime Database
 * Run: node scripts/export-firebase.mjs
 */
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCIdFBrSl6yEuPb8CNyXZEdQLf-sDvuluQ",
  authDomain: "wg-putzplan-8f373.firebaseapp.com",
  databaseURL: "https://wg-putzplan-8f373-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wg-putzplan-8f373",
  storageBucket: "wg-putzplan-8f373.firebasestorage.app",
  messagingSenderId: "546563600292",
  appId: "1:546563600292:web:a11ba5871a5774e357db31",
  measurementId: "G-0H979NWGTV"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const WG_ID = "default";

async function exportAll() {
  console.log("📦 Exporting Firebase data...\n");
  
  const keys = ["wg4", "wg4p", "wg4r"];
  const result = {};
  
  for (const key of keys) {
    try {
      const snap = await get(ref(db, `wg/${WG_ID}/${key}`));
      if (snap.exists()) {
        result[key] = snap.val();
        const size = JSON.stringify(result[key]).length;
        console.log(`✅ ${key}: ${size} bytes`);
      } else {
        console.log(`⚠️  ${key}: no data`);
        result[key] = null;
      }
    } catch (e) {
      console.error(`❌ ${key}: ${e.message}`);
      result[key] = null;
    }
  }
  
  // Write to file
  const fs = await import("fs");
  const outPath = new URL("./firebase-export.json", import.meta.url).pathname;
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
  console.log(`\n💾 Saved to ${outPath}`);
  
  // Summary
  if (result.wg4) {
    const d = result.wg4;
    const completions = Array.isArray(d.completions) ? d.completions : Object.values(d.completions || {});
    const users = Array.isArray(d.users) ? d.users : Object.values(d.users || {});
    const rooms = Array.isArray(d.rooms) ? d.rooms : Object.values(d.rooms || {});
    console.log(`\n📊 Summary:`);
    console.log(`   Users: ${users.length}`);
    console.log(`   Rooms: ${rooms.length}`);
    console.log(`   Completions: ${completions.length}`);
    console.log(`   Verifications: ${Object.keys(d.verifications || {}).length}`);
    console.log(`   Tutorials: ${Object.keys(d.tutorials || {}).length}`);
    console.log(`   Announcements: ${(Array.isArray(d.announcements) ? d.announcements : Object.values(d.announcements || {})).length}`);
    console.log(`   Reports: ${(Array.isArray(d.reports) ? d.reports : Object.values(d.reports || {})).length}`);
  }
  
  if (result.wg4p) {
    const photos = result.wg4p;
    console.log(`   Photos: ${Object.keys(photos).length}`);
  }
  
  if (result.wg4r) {
    const refPhotos = result.wg4r;
    console.log(`   RefPhotos: ${Object.keys(refPhotos).length}`);
  }
  
  process.exit(0);
}

exportAll();
