-- WG Putzplan — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. Key-Value store for app data
CREATE TABLE IF NOT EXISTS kv_store (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RefPhotos stored per-key (avoids large JSON blobs)
CREATE TABLE IF NOT EXISTS ref_photos (
  task_key TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (open access — app uses PIN-based auth, not Supabase Auth)
ALTER TABLE kv_store ENABLE ROW LEVEL SECURITY;
ALTER TABLE ref_photos ENABLE ROW LEVEL SECURITY;

-- 4. Allow all access policies (since we use PIN-based auth in the app itself)
CREATE POLICY "Allow all access on kv_store" ON kv_store
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access on ref_photos" ON ref_photos
  FOR ALL USING (true) WITH CHECK (true);

-- 5. Enable Realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE kv_store;
ALTER PUBLICATION supabase_realtime ADD TABLE ref_photos;
