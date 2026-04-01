---
description: WG Putzplan — luồng hoạt động đầy đủ, đọc trước khi code bất kỳ tính năng nào
---

# WG Putzplan — Luồng hoạt động chính thức

> ⚠️ ĐỌC FILE NÀY TRƯỚC KHI CODE BẤT KỲ THỨ GÌ LIÊN QUAN ĐẾN TASK, HISTORY, VERIFY.

---

## 1. Tech Stack

- **Frontend**: React 19 + Vite, inline styles (không dùng Tailwind)
- **Database**: Supabase (PostgreSQL) — realtime enabled
- **Deploy**: Vercel
- **Auth**: PIN-based (không dùng Supabase Auth)
- **Styles**: `src/styles.js` — dùng `C`, `F`, `btnS`, v.v.

---

## 2. Roles (vai trò)

| Role | Quyền |
|---|---|
| `owner` | Tất cả quyền |
| `manager` | Xác nhận/từ chối nhiệm vụ hàng tuần |
| `resident` | Làm nhiệm vụ hàng ngày + hàng tuần của phòng mình |

---

## 3. Loại nhiệm vụ

### 3a. Hàng ngày (daily)
- Mỗi người làm task của **mình**, độc lập với người khác
- Chụp ảnh → **tự động xác nhận ngay** (`status = 'auto'`)
- Lưu vào bảng `history` ngay lập tức
- Reset mỗi ngày (kiểm tra bằng `day = today`, không phải tuần)
- **KHÔNG cần manager xét duyệt**

### 3b. Hàng tuần (weekly)
- Mỗi phòng được giao **1 khu vực** theo rotation tuần
- Người trong phòng tự phân công nhau, mỗi người làm **1-2 task** của khu vực đó
- Chụp ảnh → gửi lên với `status = 'pending'`
- **Chờ Manager/Owner xét duyệt**
- Manager ✅ → UPDATE `status = 'verified'` → lưu lịch sử chính thức
- Manager ❌ → DELETE khỏi history → người dùng làm lại từ đầu
- **KHÔNG lưu vào lịch sử cho đến khi manager xác nhận**

---

## 4. Database Schema — Bảng chính

### `history` (bảng duy nhất cho cả pending + confirmed)
```sql
id          SERIAL PRIMARY KEY
task_key    TEXT        -- tên task (tiếng Đức)
area_id     TEXT        -- 'daily' | id khu vực tuần (küche, bad, ...)
person      TEXT        -- tên người làm
room        TEXT        -- phòng của người đó
week        TEXT        -- KW number (ví dụ: '14')
day         TEXT        -- YYYY-MM-DD (chỉ cho daily tasks)
month       TEXT
pts         INTEGER
status      TEXT        -- 'auto' | 'pending' | 'verified'
verified_by TEXT        -- tên manager đã xác nhận (nếu có)
verified_at BIGINT
photo_key   TEXT        -- key trong bảng photos
timestamp   BIGINT
created_at  TIMESTAMPTZ
```

### `photos`
```
key   TEXT PRIMARY KEY  -- format: "${day/week}-${area_id}-${task_key}-${person}"
data  TEXT              -- base64 image
```

---

## 5. Luồng dữ liệu chi tiết

### Daily task hoàn thành:
```
User bấm ✓ + chụp ảnh
  → doDone(tk, 'daily', photo)
  → INSERT history { status='auto', day=today, verified_by='auto', verified_at=now }
  → INSERT photos { key: "${today}-daily-${tk}-${person}", data: photo }
  → isDailyC(tk, person) = true → task hiện tick ✓
  → Lịch sử: hiện ngay (status='auto')
  → Điểm: cộng ngay
```

### Weekly task hoàn thành:
```
User bấm ✓ + chụp ảnh
  → doDone(tk, areaId, photo)
  → INSERT history { status='pending', week=wk }
  → INSERT photos { key: "${wk}-${areaId}-${tk}-${person}", data: photo }
  → isWeeklyC(tk, areaId, wk, person) = true → task hiện tick ✓ (chờ)
  → Manager thấy trong "Chờ xác nhận" panel
  → Lịch sử: CHƯA hiện
  → Điểm: CHƯA cộng
```

### Manager xác nhận weekly:
```
Manager bấm ✅
  → doVerify(historyId, by)
  → UPDATE history SET status='verified', verified_by=by, verified_at=now
  → Lịch sử: hiện ngay (status='verified')
  → Điểm: cộng ngay
```

### Manager từ chối weekly:
```
Manager bấm ❌ + nhập lý do
  → doReject(historyId, by, reason)
  → DELETE history WHERE id=historyId
  → DELETE photos WHERE key=photoKey
  → Task trở về trạng thái "chưa làm"
  → Người dùng phải làm lại từ đầu
```

---

## 6. Các hàm quan trọng trong App.jsx

```js
// Kiểm tra daily task hôm nay của person
isDailyC(tk, person)
  → history.find(c => c.area_id='daily' && c.day=today && c.person=person && c.task_key=tk)

// Kiểm tra weekly task tuần này của person
isWeeklyC(tk, areaId, wk, person)
  → history.find(c => c.area_id=areaId && c.week=wk && c.person=person && c.task_key=tk)

// Làm xong task (daily hoặc weekly)
doDone(tk, areaId, photo)
  → INSERT history với status phù hợp

// Manager xác nhận (chỉ weekly)
doVerify(historyId, byName)
  → UPDATE history SET status='verified'

// Manager từ chối (chỉ weekly)
doReject(historyId, byName, reason)
  → DELETE history

// Hoàn tác (chỉ khi còn pending)
doUndo(tk, areaId, wkOrDay)
  → DELETE history WHERE status IN ('auto', 'pending') AND person=user.name
```

---

## 7. Hiển thị trong UI

### PlanScreen:
- **Daily section**: Mỗi task hiện tick ✓ nếu `isDailyC(tk, user.name)` = true
- **Weekly section**: Chỉ hiện tasks của khu vực được giao cho phòng user (`canC(areaId)`)
  - Tick ✓ nếu `isWeeklyC(tk, areaId, wk, user.name)` = true
- **Manager panel** (chỉ owner/manager thấy): List tất cả `history WHERE status='pending'` của tuần này

### HistoryScreen:
- Chỉ hiện `history WHERE status IN ('auto', 'verified')`
- Hiện ảnh kèm theo, tên người, ngày, task, điểm, badge xác nhận

### LeaderScreen:
- Điểm = SUM(pts) từ `history WHERE status IN ('auto', 'verified')`

---

## 8. Photo key format

```
Daily:   "${today}-daily-${task_key}-${person}"
Weekly:  "${week}-${area_id}-${task_key}-${person}"
```
Ví dụ:
- `"2026-04-02-daily-Küche putzen-Linh"`
- `"14-küche-Staubsaugen-Minh"`

---

## 9. Những điều KHÔNG được làm

❌ Không dùng `onConflict: "timestamp"` — timestamp không phải UNIQUE key
❌ Không DELETE tất cả rồi INSERT lại — gây mất dữ liệu
❌ Không để realtime echo gây re-render (dùng `skipSync` counter)
❌ Không mix daily và weekly trong cùng 1 logic check (dùng `area_id === 'daily'`)
❌ Không hiện weekly pending trong lịch sử (chỉ hiện `status IN ('auto','verified')`)
❌ Không cộng điểm cho task pending (chỉ cộng khi `status IN ('auto','verified')`)
