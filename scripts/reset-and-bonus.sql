-- WG Putzplan — Reset all tasks + give 5⭐ bonus to each user
-- Run this in Supabase SQL Editor

-- 1. Clear all history (tasks + verifications)
DELETE FROM history;

-- 2. Clear all task photos
DELETE FROM photos;

-- 3. Give each user 5⭐ bonus
INSERT INTO history (task_key, area_id, person, room, week, month, pts, status, verified_by, verified_at, timestamp)
SELECT
  '🎁 Willkommensbonus' as task_key,
  'daily' as area_id,
  u.name as person,
  u.room as room,
  to_char(NOW(), 'IW') as week,
  to_char(NOW(), 'YYYY-MM') as month,
  5 as pts,
  'auto' as status,
  'system' as verified_by,
  EXTRACT(EPOCH FROM NOW())::BIGINT * 1000 as verified_at,
  EXTRACT(EPOCH FROM NOW())::BIGINT * 1000 as timestamp
FROM users u
WHERE u.room != '—' AND u.role != 'owner';
