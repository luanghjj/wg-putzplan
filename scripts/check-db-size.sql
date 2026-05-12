-- WG Putzplan — Database Size Analysis
-- Run this in Supabase SQL Editor to find what's eating 8GB

-- 1. Total database size
SELECT pg_size_pretty(pg_database_size(current_database())) AS total_db_size;

-- 2. Size of each table (data + indexes + toast)
SELECT
  schemaname || '.' || tablename AS table_name,
  pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) AS total_size,
  pg_size_pretty(pg_relation_size(schemaname || '.' || tablename)) AS data_size,
  pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename) - pg_relation_size(schemaname || '.' || tablename)) AS index_toast_size,
  pg_total_relation_size(schemaname || '.' || tablename) AS total_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname || '.' || tablename) DESC;

-- 3. Row count per table
SELECT 'photos' AS tbl, COUNT(*) AS row_count FROM photos
UNION ALL SELECT 'ref_photos', COUNT(*) FROM ref_photos
UNION ALL SELECT 'history', COUNT(*) FROM history
UNION ALL SELECT 'completions', COUNT(*) FROM completions
UNION ALL SELECT 'verifications', COUNT(*) FROM verifications
UNION ALL SELECT 'config', COUNT(*) FROM config
UNION ALL SELECT 'users', COUNT(*) FROM users
UNION ALL SELECT 'rooms', COUNT(*) FROM rooms
UNION ALL SELECT 'tutorials', COUNT(*) FROM tutorials
UNION ALL SELECT 'announcements', COUNT(*) FROM announcements
UNION ALL SELECT 'reports', COUNT(*) FROM reports
ORDER BY row_count DESC;

-- 4. Average row size for photo tables (the likely culprits)
SELECT
  'photos' AS tbl,
  COUNT(*) AS rows,
  pg_size_pretty(AVG(LENGTH(data))::BIGINT) AS avg_data_size,
  pg_size_pretty(SUM(LENGTH(data))::BIGINT) AS total_data_size
FROM photos
UNION ALL
SELECT
  'ref_photos',
  COUNT(*),
  pg_size_pretty(AVG(LENGTH(data))::BIGINT),
  pg_size_pretty(SUM(LENGTH(data))::BIGINT)
FROM ref_photos;

-- 5. Config table — check for large base64 blobs stored as config values
SELECT
  key,
  pg_size_pretty(LENGTH(value::TEXT)::BIGINT) AS value_size,
  LENGTH(value::TEXT) AS value_bytes
FROM config
ORDER BY LENGTH(value::TEXT) DESC
LIMIT 20;

-- 6. Check TOAST storage (where large TEXT values like base64 are stored)
SELECT
  c.relname AS table_name,
  pg_size_pretty(pg_relation_size(c.reltoastrelid)) AS toast_size,
  pg_relation_size(c.reltoastrelid) AS toast_bytes
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.reltoastrelid != 0
ORDER BY pg_relation_size(c.reltoastrelid) DESC;

-- 7. Check Supabase storage buckets (if using Supabase Storage)
SELECT
  id AS bucket_id,
  name AS bucket_name,
  public
FROM storage.buckets;

-- 8. Check storage.objects size
SELECT
  bucket_id,
  COUNT(*) AS file_count,
  pg_size_pretty(SUM(COALESCE((metadata->>'size')::BIGINT, 0))) AS total_size
FROM storage.objects
GROUP BY bucket_id
ORDER BY SUM(COALESCE((metadata->>'size')::BIGINT, 0)) DESC;

-- 9. Check Supabase internal tables (auth, realtime, etc.)
SELECT
  schemaname || '.' || tablename AS table_name,
  pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) AS total_size,
  pg_total_relation_size(schemaname || '.' || tablename) AS total_bytes
FROM pg_tables
WHERE schemaname IN ('auth', 'realtime', 'storage', 'supabase_functions', 'extensions', 'pgsodium')
ORDER BY pg_total_relation_size(schemaname || '.' || tablename) DESC
LIMIT 30;

-- 10. Overall schema breakdown
SELECT
  schemaname AS schema_name,
  pg_size_pretty(SUM(pg_total_relation_size(schemaname || '.' || tablename))::BIGINT) AS total_size,
  SUM(pg_total_relation_size(schemaname || '.' || tablename))::BIGINT AS total_bytes,
  COUNT(*) AS table_count
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
GROUP BY schemaname
ORDER BY SUM(pg_total_relation_size(schemaname || '.' || tablename)) DESC;
