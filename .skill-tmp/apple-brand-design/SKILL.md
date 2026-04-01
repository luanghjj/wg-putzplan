---
name: apple-brand-design
description: >
  Thiết kế giao diện, component, landing page, poster, hoặc bất kỳ sản phẩm visual nào theo đúng nhận diện thương hiệu Apple — tối giản, tinh tế, sang trọng, đẳng cấp. Kích hoạt khi người dùng yêu cầu "thiết kế theo style Apple", "nhận diện thương hiệu Apple", "Apple UI", "thiết kế như Apple", "giao diện kiểu Apple", "phong cách Apple", hoặc bất kỳ yêu cầu nào muốn đạt được thẩm mỹ premium/minimal tương tự Apple. Luôn ưu tiên dùng skill này khi người dùng muốn sản phẩm trông sang trọng, tối giản và hiện đại như sản phẩm của Apple.
---

# Apple Brand Design Skill

Skill này hướng dẫn cách tạo ra sản phẩm thiết kế chuẩn nhận diện thương hiệu Apple — mọi chi tiết đều phải toát lên sự tối giản, tinh tế, và cao cấp.

---

## Triết lý cốt lõi của Apple Design

> "Simplicity is the ultimate sophistication." — Apple Design Philosophy

Apple không chỉ thiết kế đẹp — họ thiết kế **có chủ đích**. Mỗi pixel đều có lý do tồn tại. Loại bỏ mọi thứ không cần thiết. Phần còn lại phải hoàn hảo.

---

## Hệ thống màu sắc (Color System)

### Nền tảng
```
--apple-white:     #FFFFFF
--apple-off-white: #F5F5F7    /* Nền trang chính */
--apple-light-gray:#E8E8ED
--apple-mid-gray:  #86868B    /* Subtext, mô tả */
--apple-dark-gray: #424245
--apple-near-black:#1D1D1F    /* Tiêu đề chính */
--apple-black:     #000000
```

### Dark Mode (bắt buộc hỗ trợ)
```
--apple-dark-bg:   #000000    /* hoặc #1C1C1E */
--apple-dark-card: #1C1C1E
--apple-dark-border:#38383A
--apple-dark-text: #F5F5F7
--apple-dark-sub:  #98989D
```

### Accent Colors (dùng có chọn lọc)
```
--apple-blue:      #0071E3    /* CTA chính, link */
--apple-blue-dark: #0077ED    /* hover state */
--apple-blue-light:#2997FF    /* Dark mode CTA */
```

**Quy tắc màu:**
- **Tối đa 2 màu** trong một layout (không đếm trắng/đen/xám)
- Màu accent chỉ dùng cho CTA, link, highlight quan trọng
- Nền luôn là trắng hoặc off-white (#F5F5F7), KHÔNG dùng màu nền rực rỡ
- Product shots được đặt trên nền trắng hoặc gradient xám rất nhạt

---

## Typography (Chữ viết)

### Font chính
```css
font-family: -apple-system, 'SF Pro Display', 'SF Pro Text', 
             'Helvetica Neue', Arial, sans-serif;
```

Khi import từ Google Fonts (fallback):
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
```

### Thang cỡ chữ (Type Scale)
| Role | Size | Weight | Line-height | Tracking |
|---|---|---|---|---|
| Hero headline | 80–96px | 700 | 1.05 | -0.03em |
| Section headline | 48–56px | 700 | 1.08 | -0.02em |
| Sub-headline | 28–32px | 600 | 1.15 | -0.01em |
| Body large | 19–21px | 400 | 1.6 | 0 |
| Body | 17px | 400 | 1.65 | 0 |
| Caption/Label | 12–14px | 400 | 1.4 | 0.01em |

### Quy tắc Typography
- **Headlines**: Bold, chữ hoa có chọn lọc (KHÔNG viết hoa toàn bộ)
- **Body text**: Màu `#1D1D1F` trên nền sáng, `#F5F5F7` trên nền tối
- **Subtext / mô tả**: Luôn dùng màu `#86868B` (xám trung)
- **Không** dùng quá 2 font family trong một dự án
- Letter-spacing âm cho headline lớn tạo cảm giác premium

---

## Layout & Spacing

### Grid System
```
Max-width container: 980px (Apple.com tiêu chuẩn)
Wide content:        1200px
Full-bleed sections: 100vw với padding ngang 48px (desktop), 24px (mobile)
```

### Spacing Scale
```
4px  → micro spacing
8px  → tight  
12px → small  
20px → medium
28px → section internal
48px → section gap
80px → between major sections
120px→ hero padding
```

### Quy tắc layout
- **Căn giữa (centered)** là mặc định của Apple — hero section, text, CTA
- Sử dụng **grid 2 cột** cho tính năng: ảnh trái + text phải (hoặc ngược lại)
- Khoảng trắng (whitespace) là yếu tố thiết kế — đừng sợ khoảng trống
- Section nào cũng cần `padding: 120px 48px` (desktop)

---

## Components & Patterns

### Hero Section
```html
<!-- Pattern chuẩn Apple Hero -->
<section class="hero">
  <p class="eyebrow">New. / iPhone 17 / Now available.</p>
  <h1 class="hero-headline">Designed to amaze.</h1>
  <p class="hero-sub">Chip. Camera. Intelligence.</p>
  <div class="cta-group">
    <a class="btn-primary">Learn more</a>
    <a class="btn-secondary">Buy →</a>
  </div>
  <img class="hero-image" src="product.png" />
</section>
```

### Buttons
```css
/* Primary CTA */
.btn-primary {
  background: #0071E3;
  color: white;
  border-radius: 980px; /* pill shape */
  padding: 12px 22px;
  font-size: 17px;
  font-weight: 400;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover { background: #0077ED; }

/* Secondary / Ghost */
.btn-secondary {
  background: transparent;
  color: #0071E3;
  border-radius: 980px;
  padding: 12px 22px;
  font-size: 17px;
  border: none;
  cursor: pointer;
}
.btn-secondary:hover { text-decoration: underline; }
```

### Cards (Feature Cards)
```css
.feature-card {
  background: #FFFFFF; /* hoặc #F5F5F7 trên nền trắng */
  border-radius: 18px;
  padding: 40px;
  /* KHÔNG có border, KHÔNG có box-shadow rõ ràng */
  box-shadow: 0 2px 20px rgba(0,0,0,0.04);
}
```

### Navigation (Apple-style Nav)
- Nền: `rgba(255,255,255,0.85)` với `backdrop-filter: blur(20px)` (glassmorphism tinh tế)
- Logo/brand ở giữa hoặc trái
- Nav links: màu `#1D1D1F`, hover thành `#0071E3`
- Không có border dưới, không có shadow nặng

---

## Motion & Animation

Apple dùng animation **mượt mà, tinh tế** — không bao giờ rõ ràng hay phô trương.

### Easing chuẩn
```css
--ease-apple: cubic-bezier(0.25, 0.1, 0.25, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* spring effect */
```

### Scroll animations (Signature Apple)
```js
// Fade + slide up khi scroll đến
const observer = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) el.target.classList.add('visible');
  });
}, { threshold: 0.15 });
```
```css
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s var(--ease-apple), 
              transform 0.7s var(--ease-apple);
}
.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Hover interactions
- Scale nhẹ: `transform: scale(1.02)` — KHÔNG quá 1.05
- Duration: 200–300ms
- Luôn có `transition` mượt

---

## Hình ảnh & Visual

### Quy tắc ảnh
- Product shot: nền trắng hoặc gradient xám cực nhạt
- **Không** dùng stock photo generic
- Ảnh phải **lớn, táo bạo, full-width** trong hero section
- Aspect ratio 16:9 hoặc 4:3 cho featured images

### Gradient (dùng có kiểm soát)
```css
/* Gradient tinh tế Apple — KHÔNG dùng màu rực rỡ */
background: linear-gradient(180deg, #F5F5F7 0%, #FFFFFF 100%);

/* Gradient tối cho dark sections */
background: linear-gradient(180deg, #1D1D1F 0%, #000000 100%);
```

### Glassmorphism (Signature Apple)
```css
.glass-card {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 0.5px solid rgba(255, 255, 255, 0.3);
  border-radius: 18px;
}
```

---

## Những điều TUYỆT ĐỐI KHÔNG làm (Anti-patterns)

❌ Gradient màu sắc rực rỡ (tím, hồng, cam trên nhau)  
❌ Shadow đen đậm, drop shadow nặng nề  
❌ Border rõ ràng trên card (dùng nền xám nhạt thay thế)  
❌ Quá nhiều màu trong một trang  
❌ Font chữ trang trí, handwriting, display font lạ  
❌ Animation nhanh, giật, bouncy quá mức  
❌ Nền màu đậm ở toàn trang (chỉ dùng cho Dark Mode có chủ đích)  
❌ Nút bo góc vuông (luôn dùng pill hoặc border-radius lớn)  
❌ Icon pixel art, icon màu mè (dùng SF Symbols style — line icon đơn giản)  
❌ Text quảng cáo kiểu cũ — Apple viết ngắn, súc tích, đầy cảm xúc  

---

## Copy / Ngôn ngữ theo phong cách Apple

Apple viết copy rất đặc trưng:
- **Ngắn, mạnh, cảm xúc**: "Stunning. Fast. Magical."
- **Tính tính từ cao**: "Extraordinary", "Incredible", "Breathtaking"  
- **Không giải thích dài dòng** — để người dùng cảm nhận
- **Headline = tuyên bố** ("The most powerful chip ever.")
- **Sub = chi tiết** (nhỏ hơn, màu xám, giải thích ngắn gọn)
- Eyebrow text (phía trên headline): tên sản phẩm, "New." hoặc "Coming soon."

---

## Checklist trước khi hoàn thiện

Trước khi giao sản phẩm, kiểm tra:

- [ ] Màu sắc không quá 2 accent color  
- [ ] Typography đúng thang cỡ chữ, weight, và letter-spacing  
- [ ] Whitespace đủ rộng — không bị chật chội  
- [ ] Nút CTA dùng màu `#0071E3`, hình pill  
- [ ] Animation mượt, không giật  
- [ ] Dark mode hoạt động (nếu có yêu cầu)  
- [ ] Mobile responsive — breakpoint tại 768px và 390px  
- [ ] Không có border/shadow nặng  
- [ ] Copy ngắn, mạnh, đúng giọng điệu Apple  

---

## Tham khảo thêm

Xem file `references/apple-components.md` để có code mẫu đầy đủ cho:
- Navigation bar
- Hero section full-page
- Feature grid (2-col, 3-col)
- Product showcase section
- Footer
