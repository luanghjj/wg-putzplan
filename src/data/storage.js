import { supabase } from "./supabase";

const WG_ID = "default"; // single WG instance

export const SK = { data: "wg4", photos: "wg4p", refPhotos: "wg4r" };

// ---- Supabase helpers ----
export const storage = {
  async get(key) {
    try {
      const { data, error } = await supabase
        .from("kv_store")
        .select("value")
        .eq("key", key)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows found (not a real error)
        console.warn("Supabase read error:", error.message);
      }

      if (data?.value) {
        return { value: JSON.stringify(data.value) };
      }

      // Fallback: try localStorage for offline/migration
      const local = localStorage.getItem(key);
      if (local) {
        // Migrate localStorage to Supabase
        try {
          await supabase.from("kv_store").upsert({
            key,
            value: JSON.parse(local),
            updated_at: new Date().toISOString(),
          });
        } catch {}
        return { value: local };
      }

      return { value: null };
    } catch (e) {
      console.warn("Supabase read failed, falling back to localStorage:", e);
      return { value: localStorage.getItem(key) };
    }
  },

  async set(key, value) {
    try {
      const parsed = JSON.parse(value);
      const { error } = await supabase.from("kv_store").upsert({
        key,
        value: parsed,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      // Also save local backup
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("Supabase write failed, saving to localStorage:", e);
      localStorage.setItem(key, value);
    }
  },
};

// ---- RefPhoto per-key helpers ----
export const refPhotoStorage = {
  async setOne(taskKey, base64Data) {
    const safeKey = taskKey.replace(/[.#$\/\[\]]/g, "_");
    try {
      const { error } = await supabase.from("ref_photos").upsert({
        task_key: safeKey,
        data: base64Data,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      // Local cache
      const local = JSON.parse(localStorage.getItem(SK.refPhotos) || "{}");
      local[taskKey] = base64Data;
      localStorage.setItem(SK.refPhotos, JSON.stringify(local));
    } catch (e) {
      console.warn("Supabase refPhoto write failed, saving locally:", e);
      const local = JSON.parse(localStorage.getItem(SK.refPhotos) || "{}");
      local[taskKey] = base64Data;
      localStorage.setItem(SK.refPhotos, JSON.stringify(local));
    }
  },

  async deleteOne(taskKey) {
    const safeKey = taskKey.replace(/[.#$\/\[\]]/g, "_");
    try {
      await supabase.from("ref_photos").delete().eq("task_key", safeKey);
      const local = JSON.parse(localStorage.getItem(SK.refPhotos) || "{}");
      delete local[taskKey];
      localStorage.setItem(SK.refPhotos, JSON.stringify(local));
    } catch (e) {
      console.warn("Supabase refPhoto delete failed:", e);
      const local = JSON.parse(localStorage.getItem(SK.refPhotos) || "{}");
      delete local[taskKey];
      localStorage.setItem(SK.refPhotos, JSON.stringify(local));
    }
  },

  async getAll() {
    try {
      const { data, error } = await supabase
        .from("ref_photos")
        .select("task_key, data");

      if (error) throw error;

      if (data && data.length > 0) {
        const result = {};
        data.forEach((row) => {
          result[row.task_key] = row.data;
        });
        return result;
      }

      // Fallback localStorage
      const local = localStorage.getItem(SK.refPhotos);
      if (local) return JSON.parse(local);
      return {};
    } catch (e) {
      console.warn("Supabase refPhoto read failed:", e);
      const local = localStorage.getItem(SK.refPhotos);
      return local ? JSON.parse(local) : {};
    }
  },
};

// ---- Realtime listener ----
export function onDataChange(key, callback) {
  // Subscribe to changes on kv_store for this key
  const channelName = `kv_${key}_${Date.now()}`;

  if (key === SK.refPhotos) {
    // For refPhotos, listen to the ref_photos table
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ref_photos" },
        async () => {
          // Re-fetch all ref photos on any change
          const allPhotos = await refPhotoStorage.getAll();
          callback(allPhotos);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  // For kv_store keys (wg4, wg4p)
  const channel = supabase
    .channel(channelName)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "kv_store",
        filter: `key=eq.${key}`,
      },
      (payload) => {
        if (payload.new?.value) {
          callback(payload.new.value);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
