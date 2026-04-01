-- WG Putzplan — Normalized Supabase Schema
-- Run this in the Supabase SQL Editor

-- Drop old tables if migrating
DROP TABLE IF EXISTS kv_store CASCADE;
-- Keep ref_photos as-is

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'resident',
  room TEXT,
  room_id TEXT,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Rooms
CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  residents JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Completions
CREATE TABLE IF NOT EXISTS completions (
  id SERIAL PRIMARY KEY,
  task_key TEXT NOT NULL,
  area_id TEXT NOT NULL DEFAULT 'daily',
  person TEXT NOT NULL,
  room TEXT,
  week TEXT NOT NULL,
  day TEXT,
  month TEXT,
  pts INTEGER DEFAULT 1,
  verified BOOLEAN DEFAULT FALSE,
  verified_by TEXT,
  verified_at BIGINT,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Verifications
CREATE TABLE IF NOT EXISTS verifications (
  vkey TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  by_user TEXT NOT NULL,
  reason TEXT,
  at_time BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Photos (completion proof photos)
CREATE TABLE IF NOT EXISTS photos (
  key TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tutorials
CREATE TABLE IF NOT EXISTS tutorials (
  task_key TEXT PRIMARY KEY,
  steps JSONB DEFAULT '[]',
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Config (settings, tasks definitions, etc.)
CREATE TABLE IF NOT EXISTS config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Announcements
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT,
  message TEXT,
  author TEXT,
  ts BIGINT,
  read_by JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Reports
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  category TEXT,
  text TEXT,
  target TEXT,
  reporter TEXT,
  ts BIGINT,
  week TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ref_photos already exists from previous migration

-- Enable RLS with open access (app uses PIN auth)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "open_users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_rooms" ON rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_completions" ON completions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_verifications" ON verifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_photos" ON photos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_tutorials" ON tutorials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_config" ON config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_announcements" ON announcements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_reports" ON reports FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE completions;
ALTER PUBLICATION supabase_realtime ADD TABLE verifications;
ALTER PUBLICATION supabase_realtime ADD TABLE photos;
ALTER PUBLICATION supabase_realtime ADD TABLE tutorials;
ALTER PUBLICATION supabase_realtime ADD TABLE config;
ALTER PUBLICATION supabase_realtime ADD TABLE announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE reports;
