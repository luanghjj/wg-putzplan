import { supabase } from "./supabase";

export const SK = { data: "wg4", photos: "wg4p", refPhotos: "wg4r" };

// ---- Supabase-only storage (no localStorage) ----
export const storage = {
  async get(key) {
    const { data, error } = await supabase
      .from("kv_store")
      .select("value")
      .eq("key", key)
      .single();

    if (error && error.code !== "PGRST116") {
      console.warn("Supabase read error:", error.message);
    }

    if (data?.value) {
      return { value: JSON.stringify(data.value) };
    }
    return { value: null };
  },

  async set(key, value) {
    const parsed = JSON.parse(value);
    const { error } = await supabase.from("kv_store").upsert({
      key,
      value: parsed,
      updated_at: new Date().toISOString(),
    });
    if (error) console.warn("Supabase write error:", error.message);
  },
};

// ---- RefPhoto per-key helpers (Supabase only) ----
export const refPhotoStorage = {
  async setOne(taskKey, base64Data) {
    const safeKey = taskKey.replace(/[.#$\/\[\]]/g, "_");
    const { error } = await supabase.from("ref_photos").upsert({
      task_key: safeKey,
      data: base64Data,
      updated_at: new Date().toISOString(),
    });
    if (error) console.warn("Supabase refPhoto write error:", error.message);
  },

  async deleteOne(taskKey) {
    const safeKey = taskKey.replace(/[.#$\/\[\]]/g, "_");
    const { error } = await supabase.from("ref_photos").delete().eq("task_key", safeKey);
    if (error) console.warn("Supabase refPhoto delete error:", error.message);
  },

  async getAll() {
    const { data, error } = await supabase
      .from("ref_photos")
      .select("task_key, data");

    if (error) {
      console.warn("Supabase refPhoto read error:", error.message);
      return {};
    }

    if (data && data.length > 0) {
      const result = {};
      data.forEach((row) => {
        result[row.task_key] = row.data;
      });
      return result;
    }
    return {};
  },
};

// ---- Realtime listener (Supabase only) ----
export function onDataChange(key, callback) {
  const channelName = `kv_${key}_${Date.now()}`;

  if (key === SK.refPhotos) {
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ref_photos" },
        async () => {
          const allPhotos = await refPhotoStorage.getAll();
          callback(allPhotos);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }

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

  return () => supabase.removeChannel(channel);
}
