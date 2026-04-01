-- WG Putzplan — Migration: Add history table
-- Run this in Supabase SQL Editor

-- Create history table (single source of truth for all task records)
CREATE TABLE IF NOT EXISTS history (
  id          SERIAL PRIMARY KEY,
  task_key    TEXT NOT NULL,
  area_id     TEXT NOT NULL DEFAULT 'daily',
  person      TEXT NOT NULL,
  room        TEXT,
  week        TEXT NOT NULL,
  day         TEXT,          -- YYYY-MM-DD, only for daily tasks
  month       TEXT,
  pts         INTEGER DEFAULT 1,
  status      TEXT NOT NULL DEFAULT 'pending', -- 'auto' | 'pending' | 'verified'
  verified_by TEXT,
  verified_at BIGINT,
  photo_key   TEXT,          -- key in photos table
  timestamp   BIGINT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open_history" ON history FOR ALL USING (true) WITH CHECK (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE history;

-- Migrate existing completions data to history
-- Daily (verified or not → treat as 'auto')
INSERT INTO history (task_key, area_id, person, room, week, day, month, pts, status, verified_by, verified_at, timestamp)
SELECT
  task_key,
  area_id,
  person,
  room,
  week,
  day,
  month,
  pts,
  CASE
    WHEN area_id = 'daily' THEN 'auto'
    WHEN verified = true THEN 'verified'
    ELSE 'pending'
  END as status,
  verified_by,
  verified_at,
  timestamp
FROM completions
WHERE task_key NOT LIKE '_penalty_%'
ON CONFLICT DO NOTHING;
