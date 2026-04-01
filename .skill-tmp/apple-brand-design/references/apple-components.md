# Apple-style Component Library

Code mẫu đầy đủ cho các component thường gặp theo phong cách Apple.

---

## Full Page Template (HTML)

```html
<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Product Name</title>
<style>
  :root {
    --white: #FFFFFF;
    --off-white: #F5F5F7;
    --near-black: #1D1D1F;
    --mid-gray: #86868B;
    --blue: #0071E3;
    --blue-hover: #0077ED;
    --ease: cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: -apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif;
    background: var(--white);
    color: var(--near-black);
    -webkit-font-smoothing: antialiased;
  }

  /* NAV */
  nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(20px) saturate(180%);
    height: 48px;
    display: flex; align-items: center; justify-content: center;
    gap: 32px;
  }
  nav a {
    font-size: 14px; color: var(--near-black);
    text-decoration: none; opacity: 0.85;
    transition: opacity 0.2s;
  }
  nav a:hover { opacity: 1; color: var(--blue); }

  /* HERO */
  .hero {
    text-align: center;
    padding: 120px 24px 80px;
    background: var(--off-white);
  }
  .eyebrow {
    font-size: 14px; color: var(--blue);
    letter-spacing: 0.01em; margin-bottom: 16px;
  }
  .hero h1 {
    font-size: clamp(48px, 8vw, 96px);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.05;
    margin-bottom: 20px;
  }
  .hero p {
    font-size: clamp(19px, 2.5vw, 24px);
    color: var(--mid-gray);
    max-width: 600px; margin: 0 auto 36px;
    line-height: 1.5;
  }
  .cta-group { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .btn-primary {
    background: var(--blue); color: white;
    padding: 12px 22px; border-radius: 980px;
    font-size: 17px; text-decoration: none;
    transition: background 0.2s var(--ease);
  }
  .btn-primary:hover { background: var(--blue-hover); }
  .btn-secondary {
    color: var(--blue); padding: 12px 22px;
    font-size: 17px; text-decoration: none;
  }
  .btn-secondary:hover { text-decoration: underline; }

  /* FEATURE GRID */
  .features {
    max-width: 980px; margin: 0 auto;
    padding: 100px 24px;
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;
  }
  .feature-card {
    background: var(--off-white);
    border-radius: 18px; padding: 48px 40px;
    overflow: hidden;
  }
  .feature-card.dark {
    background: var(--near-black); color: white;
  }
  .feature-card .tag {
    font-size: 14px; color: var(--blue);
    font-weight: 500; margin-bottom: 12px;
  }
  .feature-card.dark .tag { color: #2997FF; }
  .feature-card h2 {
    font-size: clamp(28px, 3.5vw, 40px);
    font-weight: 700; letter-spacing: -0.02em;
    line-height: 1.1; margin-bottom: 16px;
  }
  .feature-card p {
    font-size: 17px; color: var(--mid-gray);
    line-height: 1.65;
  }
  .feature-card.dark p { color: #98989D; }

  /* Scroll animation */
  .animate {
    opacity: 0; transform: translateY(28px);
    transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
  }
  .animate.visible { opacity: 1; transform: none; }

  /* FOOTER */
  footer {
    border-top: 1px solid #D2D2D7;
    padding: 40px 24px;
    max-width: 980px; margin: 0 auto;
    font-size: 12px; color: var(--mid-gray);
    line-height: 1.6;
  }
  footer a { color: var(--mid-gray); text-decoration: none; }
  footer a:hover { color: var(--blue); }

  @media (max-width: 768px) {
    .features { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>

<nav>
  <a href="#">Mac</a>
  <a href="#">iPad</a>
  <a href="#">iPhone</a>
  <a href="#">Watch</a>
  <a href="#">Support</a>
</nav>

<section class="hero">
  <p class="eyebrow">Introducing · ProductName · Available now.</p>
  <h1>Designed to<br>delight.</h1>
  <p>The most powerful experience yet. Built for what's next.</p>
  <div class="cta-group">
    <a class="btn-primary" href="#">Learn more</a>
    <a class="btn-secondary" href="#">Buy →</a>
  </div>
</section>

<section class="features">
  <div class="feature-card animate">
    <p class="tag">Performance</p>
    <h2>Blazing fast.<br>By design.</h2>
    <p>The new chip delivers up to 40% faster performance with all-day battery life.</p>
  </div>
  <div class="feature-card dark animate">
    <p class="tag">Display</p>
    <h2>See it to<br>believe it.</h2>
    <p>ProMotion technology. Super Retina XDR. Always-on display.</p>
  </div>
  <div class="feature-card dark animate">
    <p class="tag">Camera</p>
    <h2>Pro camera.<br>Pro results.</h2>
    <p>48MP main. Cinematic mode. Photographic Styles.</p>
  </div>
  <div class="feature-card animate">
    <p class="tag">Privacy</p>
    <h2>Your data.<br>Your business.</h2>
    <p>Privacy isn't just a feature. It's a fundamental right.</p>
  </div>
</section>

<footer>
  <p>Copyright © 2025 Company Name. All rights reserved.</p>
  <p><a href="#">Privacy Policy</a> · <a href="#">Terms of Use</a> · <a href="#">Contact</a></p>
</footer>

<script>
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.12 }
  );
  document.querySelectorAll('.animate').forEach(el => observer.observe(el));
</script>
</body>
</html>
```

---

## Dark Mode Full Toggle

```css
@media (prefers-color-scheme: dark) {
  body { background: #000; color: #F5F5F7; }
  nav { background: rgba(0,0,0,0.85); }
  .feature-card { background: #1C1C1E; }
  .feature-card p { color: #98989D; }
  footer { border-color: #38383A; color: #98989D; }
}
```

---

## React Component: Apple-style CTA Section

```jsx
import { useEffect, useRef } from "react";

const styles = {
  section: {
    textAlign: "center",
    padding: "120px 24px",
    background: "#F5F5F7",
    fontFamily: "-apple-system, 'Helvetica Neue', sans-serif",
  },
  eyebrow: { fontSize: 14, color: "#0071E3", marginBottom: 16, letterSpacing: "0.01em" },
  h1: { fontSize: "clamp(48px, 8vw, 80px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 20, color: "#1D1D1F" },
  sub: { fontSize: 19, color: "#86868B", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.6 },
  btnPrimary: {
    background: "#0071E3", color: "white", padding: "12px 22px",
    borderRadius: 980, fontSize: 17, border: "none", cursor: "pointer",
    textDecoration: "none", display: "inline-block",
  },
  btnSecondary: {
    color: "#0071E3", padding: "12px 22px", fontSize: 17,
    background: "none", border: "none", cursor: "pointer",
  },
};

export default function AppleHero({ eyebrow, headline, subtext, ctaPrimary, ctaSecondary }) {
  return (
    <section style={styles.section}>
      <p style={styles.eyebrow}>{eyebrow}</p>
      <h1 style={styles.h1}>{headline}</h1>
      <p style={styles.sub}>{subtext}</p>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
        <a href="#" style={styles.btnPrimary}>{ctaPrimary}</a>
        <button style={styles.btnSecondary}>{ctaSecondary} →</button>
      </div>
    </section>
  );
}
```
