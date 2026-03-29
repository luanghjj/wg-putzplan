---
name: apple-opus-chat
description: Tạo Artifact giao diện chat gọi Claude Opus, thiết kế phong cách Apple — minimal, mượt, icon line. Dùng skill này bất cứ khi nào người dùng muốn xây dựng một app/widget chat AI với thiết kế cao cấp, sang trọng kiểu Apple, icon line stroke, hiệu ứng mượt. Trigger khi người dùng nói: "giao diện chat Opus", "app chat Apple style", "widget chat AI đẹp", "thiết kế Apple cho chat", hoặc bất kỳ yêu cầu kết hợp chat AI + design chất lượng cao.
---

# Apple-Style Opus Chat Artifact

Tạo một Artifact HTML single-file gọi Claude Opus qua Anthropic API, giao diện thiết kế theo ngôn ngữ thiết kế Apple.

## Nguyên tắc thiết kế

### Màu sắc & Theme
```css
/* Light mode — Apple-inspired */
--bg: #F5F5F7;
--surface: rgba(255,255,255,0.72);
--surface-elevated: #FFFFFF;
--text-primary: #1D1D1F;
--text-secondary: #6E6E73;
--accent: #0071E3;          /* Apple Blue */
--accent-hover: #0077ED;
--border: rgba(0,0,0,0.08);
--shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
--shadow-md: 0 4px 24px rgba(0,0,0,0.10);
--radius: 18px;
--radius-sm: 12px;
```

### Typography
- Font: `-apple-system, "SF Pro Display", "SF Pro Text", BlinkMacSystemFont, sans-serif`
- Heading: 600 weight, letter-spacing: -0.022em
- Body: 400 weight, line-height: 1.6

### Icon Line Style
- Tất cả icon dùng SVG stroke, **KHÔNG fill**
- `stroke-width: 1.5`, `stroke-linecap: round`, `stroke-linejoin: round`
- Kích thước tiêu chuẩn: 20×20px
- Màu: inherit từ text color

Ví dụ icon send:
```svg
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <line x1="22" y1="2" x2="11" y2="13"/>
  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
</svg>
```

## Cấu trúc Artifact

```html
<!-- Layout tổng thể -->
<div class="app">
  <header class="app-header">        <!-- Thanh tiêu đề blur -->
  <main class="chat-area">           <!-- Vùng hiển thị tin nhắn -->
  <footer class="input-bar">         <!-- Ô nhập liệu -->
</div>
```

### Header
- `backdrop-filter: blur(20px) saturate(180%)`
- Background: `rgba(245,245,247,0.8)`
- Border-bottom: `1px solid var(--border)`
- Hiển thị: icon model (line) + tên "Claude Opus" + trạng thái

### Chat bubbles
```css
/* User bubble */
.bubble-user {
  background: var(--accent);
  color: white;
  border-radius: 18px 18px 4px 18px;
  align-self: flex-end;
  max-width: 72%;
}

/* Assistant bubble */
.bubble-ai {
  background: var(--surface-elevated);
  color: var(--text-primary);
  border-radius: 18px 18px 18px 4px;
  align-self: flex-start;
  max-width: 72%;
  box-shadow: var(--shadow-sm);
}
```

### Input bar
- Floating bar với `box-shadow` và `backdrop-filter`
- Textarea tự co giãn chiều cao
- Nút gửi: circle 36px, background accent, icon send SVG line
- Placeholder: "Nhắn tin với Opus…"

### Typing indicator
```html
<div class="typing-indicator">
  <span></span><span></span><span></span>
</div>
```
```css
.typing-indicator span {
  width: 6px; height: 6px;
  background: var(--text-secondary);
  border-radius: 50%;
  animation: bounce 1.2s infinite;
}
/* delay: 0s, 0.2s, 0.4s */
```

## Gọi API Opus

```javascript
const MODEL = "claude-opus-4-5"; // hoặc claude-opus-4-20250514

async function sendMessage(userText, conversationHistory) {
  // Thêm message user vào history
  conversationHistory.push({ role: "user", content: userText });

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      messages: conversationHistory
    })
  });

  const data = await response.json();
  const assistantText = data.content
    .filter(b => b.type === "text")
    .map(b => b.text)
    .join("\n");

  // Thêm response vào history
  conversationHistory.push({ role: "assistant", content: assistantText });
  return assistantText;
}
```

## Animations & Micro-interactions

```css
/* Tin nhắn xuất hiện */
@keyframes messageIn {
  from { opacity: 0; transform: translateY(8px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.bubble { animation: messageIn 0.25s cubic-bezier(0.34,1.56,0.64,1); }

/* Nút gửi */
.btn-send:active { transform: scale(0.93); }
.btn-send { transition: all 0.15s ease; }

/* Scroll mượt */
.chat-area { scroll-behavior: smooth; }
```

## Checklist trước khi xuất

- [ ] Font SF Pro / -apple-system
- [ ] Tất cả icon là SVG line (no fill)
- [ ] Blur header hoạt động
- [ ] Bubble animation mượt
- [ ] conversationHistory duy trì multi-turn
- [ ] Typing indicator khi đang chờ
- [ ] Auto-scroll khi có tin mới
- [ ] Textarea resize tự động
- [ ] Error handling nếu API lỗi
- [ ] Mobile responsive
