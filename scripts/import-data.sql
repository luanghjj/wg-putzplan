-- ============================================================
-- WG Putzplan — Import data vào project mới
-- Chạy SAU KHI đã chạy new-project-schema.sql
-- ============================================================

-- ──────────────────────────────────────────────────────
-- 1. USERS (from firebase-export.json)
-- ──────────────────────────────────────────────────────
INSERT INTO users (id, name, role, room, room_id, password) VALUES
  ('owner-1',       'Origami',    'owner',    '—',  NULL, 'origami'),
  ('u-cuong',       'Cường',      'resident', 'P1', '1774562615311', '7395'),
  ('u-chien',       'Chiến',      'resident', 'P1', '1774562615311', '8459'),
  ('u-trong',       'Trọng',      'resident', 'P1', '1774562615311', '3065'),
  ('u-haiocean',    'Hải Ocean',  'resident', 'P1', '1774562615311', '2713'),
  ('u-thuy',        'Thuý',       'resident', 'P2', '1774562631044', '6284'),
  ('u-thoa',        'Thoa',       'resident', 'P2', '1774562631044', '3176'),
  ('u-tungcool',    'Tùng Cool',  'resident', 'P2', '1774562631044', '1568'),
  ('u-haiwave',     'Hải Wave',   'resident', 'P2', '1774562631044', '3639'),
  ('u-sonrock',     'Sơn Rock',   'resident', 'P3', '1774562641975', '5930'),
  ('u-tungmini',    'Tùng Mini',  'resident', 'P3', '1774562641975', '9999'),
  ('u-trung',       'Trung',      'resident', 'P3', '1774562641975', '7641'),
  ('u-dung',        'Dũng',       'resident', 'P3', '1774562641975', '9042')
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────
-- 2. ROOMS
-- ──────────────────────────────────────────────────────
INSERT INTO rooms (id, name, residents) VALUES
  ('1774562615311', 'P1', '[{"name":"Cường","password":"7395"},{"name":"Chiến","password":"8459"},{"name":"Trọng","password":"3065"},{"name":"Hải Ocean","password":"2713"}]'::jsonb),
  ('1774562631044', 'P2', '[{"name":"Thuý","password":"6284"},{"name":"Thoa","password":"3176"},{"name":"Tùng Cool","password":"1568"},{"name":"Hải Wave","password":"3639"}]'::jsonb),
  ('1774562641975', 'P3', '[{"name":"Sơn Rock","password":"5930"},{"name":"Tùng Mini","password":"9999"},{"name":"Trung","password":"7641"},{"name":"Dũng","password":"9042"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────
-- 3. CONFIG — settings
-- ──────────────────────────────────────────────────────
INSERT INTO config (key, value) VALUES
  ('masterPin', '"1234"'::jsonb),
  ('lang', '"vi"'::jsonb),
  ('sheetsUrl', '""'::jsonb),
  ('rotation', 'null'::jsonb),
  ('rolePerms', '{"owner":["manage_rooms","manage_residents","manage_roles","edit_rules","config_sheets","edit_tasks","check_own_area","check_all","view_history","export_data","reset_week"],"manager":["manage_residents","check_own_area","check_all","view_history","export_data","manage_rooms"],"resident":["check_own_area","view_history"]}'::jsonb),
  ('dailyTasks', '[{"de":"Geschirr spülen / abräumen","vi":"Rửa bát / dọn bàn","pts":1},{"de":"Herd & Arbeitsflächen wischen","vi":"Lau bếp & mặt bàn","pts":1},{"de":"Müll rausbringen (wenn voll)","vi":"Đổ rác (khi đầy)","pts":1},{"de":"Schuhe ordentlich aufstellen","vi":"Xếp giày gọn gàng","pts":1},{"de":"Toilette nach Benutzung säubern","vi":"Vệ sinh toilet sau khi dùng","pts":1},{"de":"Spüle trockenwischen","vi":"Lau khô bồn rửa","pts":1},{"de":"Boden nach Benutzung trocknen","vi":"Làm khô nền sau khi sử dụng (tắm, đánh răng, vệ sinh)","pts":1}]'::jsonb),
  ('weeklyAreas', '[{"id":"kitchen","color":"#3B82F6","bg":"#EFF6FF","tasks":[{"de":"Küchenboden fegen & wischen","vi":"Quét & lau sàn bếp","pts":3},{"de":"Spüle & Armaturen reinigen","vi":"Vệ sinh bồn rửa & vòi","pts":3},{"de":"Herd, Backofen & Regale putzen","vi":"Chà bếp, lò nướng & kệ bếp","pts":3},{"de":"Kühlschrank (innen & außen) & Schränke reinigen","vi":"Dọn tủ lạnh (trong & ngoài) & lau tủ bếp","pts":3},{"de":"Mülleimer reinigen & Glastüren putzen","vi":"Rửa thùng rác & lau cửa kính","pts":2}]},{"id":"bathroom","color":"#F59E0B","bg":"#FFFBEB","tasks":[{"de":"Toilette putzen (innen & außen)","vi":"Vệ sinh toilet","pts":3},{"de":"Waschbecken & Spiegel reinigen","vi":"Lau bồn rửa & gương","pts":3},{"de":"Dusche / Badewanne reinigen","vi":"Vệ sinh vòi sen / bồn tắm","pts":3},{"de":"Boden saugen & wischen","vi":"Hút bụi & lau sàn","pts":3},{"de":"Handtücher wechseln, Regale ordnen & Waschmaschine reinigen","vi":"Thay khăn, sắp kệ gọn & vệ sinh máy giặt","pts":2},{"de":"Badezimmer 2. OG trocknen","vi":"Làm sạch khô nhà tắm tầng 2","pts":2}]},{"id":"common","color":"#10B981","bg":"#ECFDF5","tasks":[{"de":"Flur, Eingang & Treppenhaus reinigen, Schuhe ordnen","vi":"Lau hành lang, cửa ra vào & cầu thang, xếp giày gọn","pts":3},{"de":"Wohnzimmer saugen & Böden wischen","vi":"Hút bụi phòng khách & lau sàn khu vực chung","pts":3},{"de":"Tische, Regale, Türgriffe & Lichtschalter abwischen","vi":"Lau bàn, kệ, tay nắm cửa & công tắc đèn","pts":2},{"de":"Fenster reinigen & Balkon aufräumen","vi":"Lau cửa sổ & dọn ban công","pts":3},{"de":"Müll rausbringen & Mülleimer reinigen","vi":"Đổ rác khi đầy & rửa thùng rác","pts":2}]}]'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ──────────────────────────────────────────────────────
-- 4. Give 5⭐ welcome bonus to each resident
-- ──────────────────────────────────────────────────────
INSERT INTO history (task_key, area_id, person, room, week, month, pts, status, verified_by, verified_at, timestamp)
SELECT
  '🎁 Willkommensbonus',
  'daily',
  u.name,
  u.room,
  to_char(NOW(), 'IW'),
  to_char(NOW(), 'YYYY-MM'),
  5,
  'auto',
  'system',
  EXTRACT(EPOCH FROM NOW())::BIGINT * 1000,
  EXTRACT(EPOCH FROM NOW())::BIGINT * 1000
FROM users u
WHERE u.room != '—' AND u.role != 'owner';
