-- ============================================================
-- WG Putzplan — Clean Schema for NEW Supabase Project
-- Run this ONCE in Supabase SQL Editor after creating project
-- ============================================================
-- Tables: users, rooms, history, photos, ref_photos,
--         tutorials, config, announcements, reports
-- (completions + verifications removed — history is the single source of truth)
-- ============================================================

-- ──────────────────────────────────────────────────────
-- 1. USERS — residents & admins
-- ──────────────────────────────────────────────────────
CREATE TABLE users (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'resident',
  room       TEXT,
  room_id    TEXT,
  password   TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────
-- 2. ROOMS
-- ──────────────────────────────────────────────────────
CREATE TABLE rooms (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  residents  JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────
-- 3. HISTORY — single source of truth for all task records
--    (replaces old completions + verifications tables)
-- ──────────────────────────────────────────────────────
CREATE TABLE history (
  id          SERIAL PRIMARY KEY,
  task_key    TEXT NOT NULL,
  area_id     TEXT NOT NULL DEFAULT 'daily',
  person      TEXT NOT NULL,
  room        TEXT,
  week        TEXT NOT NULL,
  day         TEXT,              -- YYYY-MM-DD (daily tasks only)
  month       TEXT,
  pts         INTEGER DEFAULT 1,
  status      TEXT NOT NULL DEFAULT 'pending',  -- 'auto' | 'pending' | 'verified'
  verified_by TEXT,
  verified_at BIGINT,
  photo_key   TEXT,              -- references photos.key
  timestamp   BIGINT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX idx_history_week ON history (week);
CREATE INDEX idx_history_person ON history (person);
CREATE INDEX idx_history_area ON history (area_id);

-- ──────────────────────────────────────────────────────
-- 4. PHOTOS — completion proof photos (base64)
-- ──────────────────────────────────────────────────────
CREATE TABLE photos (
  key        TEXT PRIMARY KEY,
  data       TEXT NOT NULL,       -- base64 encoded image
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────
-- 5. REF_PHOTOS — reference photos for tasks (base64)
-- ──────────────────────────────────────────────────────
CREATE TABLE ref_photos (
  task_key   TEXT PRIMARY KEY,
  data       TEXT NOT NULL,       -- base64 encoded image
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────
-- 6. TUTORIALS — task tutorial steps + video
-- ──────────────────────────────────────────────────────
CREATE TABLE tutorials (
  task_key   TEXT PRIMARY KEY,
  steps      JSONB DEFAULT '[]',
  video_url  TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────
-- 7. CONFIG — app settings (key-value store)
--    Keys: masterPin, lang, sheetsUrl, rotation,
--          dailyTasks, weeklyAreas, rolePerms,
--          managerPhoto1, managerPhoto2, trashPhotos
-- ──────────────────────────────────────────────────────
CREATE TABLE config (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────
-- 8. ANNOUNCEMENTS
-- ──────────────────────────────────────────────────────
CREATE TABLE announcements (
  id         TEXT PRIMARY KEY,
  title      TEXT,
  message    TEXT,
  author     TEXT,
  ts         BIGINT,
  level      TEXT DEFAULT 'normal',
  read_by    JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────
-- 9. REPORTS — issue reports
-- ──────────────────────────────────────────────────────
CREATE TABLE reports (
  id         TEXT PRIMARY KEY,
  category   TEXT,
  text       TEXT,
  target     TEXT,
  reporter   TEXT,
  ts         BIGINT,
  week       TEXT,
  status     TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- ROW LEVEL SECURITY (open access — app uses PIN auth)
-- ============================================================
ALTER TABLE users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms         ENABLE ROW LEVEL SECURITY;
ALTER TABLE history       ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos        ENABLE ROW LEVEL SECURITY;
ALTER TABLE ref_photos    ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutorials     ENABLE ROW LEVEL SECURITY;
ALTER TABLE config        ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports       ENABLE ROW LEVEL SECURITY;

CREATE POLICY "open_users"         ON users         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_rooms"         ON rooms         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_history"       ON history       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_photos"        ON photos        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_ref_photos"    ON ref_photos    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_tutorials"     ON tutorials     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_config"        ON config        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_announcements" ON announcements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_reports"       ON reports       FOR ALL USING (true) WITH CHECK (true);


-- ============================================================
-- REALTIME — only tables that need live sync
-- (photos + ref_photos excluded to reduce WAL bloat)
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE history;
ALTER PUBLICATION supabase_realtime ADD TABLE config;
ALTER PUBLICATION supabase_realtime ADD TABLE announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE tutorials;
ALTER PUBLICATION supabase_realtime ADD TABLE reports;

-- NOTE: photos + ref_photos are NOT added to Realtime
--       to prevent WAL log accumulation (disk bloat).
--       If you need realtime photo sync, uncomment below:
-- ALTER PUBLICATION supabase_realtime ADD TABLE photos;
-- ALTER PUBLICATION supabase_realtime ADD TABLE ref_photos;
