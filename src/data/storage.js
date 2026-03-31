import { db } from "./firebase";
import { ref, set, get, remove, onValue } from "firebase/database";

const WG_ID = "default"; // single WG instance

export const SK = { data: "wg4", photos: "wg4p", refPhotos: "wg4r" };

// ---- Firebase helpers ----
const dbRef = (key) => ref(db, `wg/${WG_ID}/${key}`);
const dbRefPath = (path) => ref(db, `wg/${WG_ID}/${path}`);

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

// ---- RefPhoto per-key helpers (avoids 10MB Firebase limit) ----
export const refPhotoStorage = {
  // Save a single refPhoto by task key
  async setOne(taskKey, base64Data) {
    // sanitize key: Firebase keys can't contain . # $ [ ]
    const safeKey = taskKey.replace(/[.#$\[\]]/g, "_");
    try {
      await set(dbRefPath(`${SK.refPhotos}/${safeKey}`), base64Data);
      // local cache: update the whole map in localStorage
      const local = JSON.parse(localStorage.getItem(SK.refPhotos) || "{}");
      local[taskKey] = base64Data;
      localStorage.setItem(SK.refPhotos, JSON.stringify(local));
    } catch (e) {
      console.warn("Firebase refPhoto write failed, saving locally:", e);
      const local = JSON.parse(localStorage.getItem(SK.refPhotos) || "{}");
      local[taskKey] = base64Data;
      localStorage.setItem(SK.refPhotos, JSON.stringify(local));
    }
  },

  // Delete a single refPhoto by task key
  async deleteOne(taskKey) {
    const safeKey = taskKey.replace(/[.#$\[\]]/g, "_");
    try {
      await remove(dbRefPath(`${SK.refPhotos}/${safeKey}`));
      const local = JSON.parse(localStorage.getItem(SK.refPhotos) || "{}");
      delete local[taskKey];
      localStorage.setItem(SK.refPhotos, JSON.stringify(local));
    } catch (e) {
      console.warn("Firebase refPhoto delete failed:", e);
      const local = JSON.parse(localStorage.getItem(SK.refPhotos) || "{}");
      delete local[taskKey];
      localStorage.setItem(SK.refPhotos, JSON.stringify(local));
    }
  },

  // Get all refPhotos (returns object map)
  async getAll() {
    try {
      const snap = await get(dbRef(SK.refPhotos));
      if (snap.exists()) {
        const data = snap.val();
        // data keys may be sanitized (dots replaced with _), restore them
        return data;
      }
      // fallback localStorage
      const local = localStorage.getItem(SK.refPhotos);
      if (local) return JSON.parse(local);
      return {};
    } catch (e) {
      console.warn("Firebase refPhoto read failed:", e);
      const local = localStorage.getItem(SK.refPhotos);
      return local ? JSON.parse(local) : {};
    }
  },
};

// ---- Realtime listener ----
export function onDataChange(key, callback) {
  return onValue(dbRef(key), (snap) => {
    if (snap.exists()) callback(snap.val());
  });
}
