import { db } from "./firebase";
import { ref, set, get, onValue } from "firebase/database";

const WG_ID = "default"; // single WG instance

export const SK = { data: "wg4", photos: "wg4p", refPhotos: "wg4r" };

// ---- Firebase helpers ----
const dbRef = (key) => ref(db, `wg/${WG_ID}/${key}`);

export const storage = {
  async get(key) {
    try {
      const snap = await get(dbRef(key));
      const local = localStorage.getItem(key);
      if (snap.exists()) {
        const fbVal = snap.val();
        // If Firebase has data but localStorage also has data, merge localStorage into Firebase
        // This handles the case where photos were saved locally but not yet synced
        if (local && key === "wg4p") {
          const localVal = JSON.parse(local);
          const merged = { ...localVal, ...fbVal };
          if (Object.keys(merged).length > Object.keys(fbVal).length) {
            await set(dbRef(key), merged);
            return { value: JSON.stringify(merged) };
          }
        }
        return { value: JSON.stringify(fbVal) };
      }
      // fallback: try localStorage for migration
      if (local) {
        // migrate localStorage data to Firebase
        await set(dbRef(key), JSON.parse(local));
        return { value: local };
      }
      return { value: null };
    } catch (e) {
      console.warn("Firebase read failed, falling back to localStorage:", e);
      return { value: localStorage.getItem(key) };
    }
  },

  async set(key, value) {
    try {
      await set(dbRef(key), JSON.parse(value));
      // also save local backup
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("Firebase write failed, saving to localStorage:", e);
      localStorage.setItem(key, value);
    }
  },
};

// ---- Realtime listener ----
export function onDataChange(key, callback) {
  return onValue(dbRef(key), (snap) => {
    if (snap.exists()) callback(snap.val());
  });
}
