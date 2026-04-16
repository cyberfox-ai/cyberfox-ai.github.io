# 🖥 3D Desk Portfolio — Upgraded Edition

An ultra-detailed procedural 3D desk scene on a **rotating glowing platform** — built entirely with Three.js (no Blender needed). GitHub Pages ready.

## 🚀 Deploy to GitHub Pages in 3 Steps

1. **Create a GitHub repo** (e.g. `my-portfolio`)
2. **Upload** all files keeping this structure:
   ```
   index.html
   css/style.css
   js/scene.js
   js/ui.js
   README.md
   ```
3. **Enable Pages**: Settings → Pages → Source: `main` branch → root

Your site will be live at `https://yourusername.github.io/my-portfolio`

---

## ✏️ Customize Your Info

### Name & Role — `index.html`
- Find `Alex` and `Chen` → replace with your name
- Update job title text in the hero section

### Links — `index.html`
Search and replace:
- `href="https://github.com"` → your GitHub URL
- `href="https://twitter.com"` → your Twitter URL  
- `href="mailto:alex@example.com"` → your email
- `href="https://linkedin.com"` → your LinkedIn URL
- `href="https://buymeacoffee.com"` → your Coffee link

### Projects — `index.html`
Find `<div class="proj-grid">` and edit the 4 project cards.

### Colors — `css/style.css`
```css
--acc:  #e8c547;   /* gold accent */
--acc2: #ff6b35;   /* orange accent */
--blue: #4fc3f7;   /* blue */
--green: #69ffb4;  /* green (RGB glow) */
```

---

## 🎮 3D Interaction

| Action | Effect |
|--------|--------|
| **Drag** | Orbit around the desk |
| **Scroll** | Zoom in / out |
| **Click Monitor** | Opens About Me |
| **Click GitHub block** | GitHub panel |
| **Click Twitter block** | Twitter panel |
| **Click Coffee block** | Buy Me Coffee panel |
| **Top Nav** | Navigate all sections |

Platform auto-rotates when idle — dragging pauses rotation.

---

## ✨ Features

- Custom GLSL wood grain shader on desk
- Animated terminal/code screen shader on monitor
- RGB color-cycling strips (monitor, keyboard, mouse, mousepad, platform)
- Multi-ring glowing platform with leg pillars
- Articulating desk lamp with glow
- Detailed cactus plant with spines
- Headphone stand, speakers, books, notepad, pen, phone, mug
- Floating particle dust
- Mouse parallax + smooth orbit controls
- Custom cursor
- Typing effect hero
- Glassmorphism panel overlays

## 🛠 Stack
- Three.js r128 (CDN — no install needed)
- Google Fonts (Raleway + JetBrains Mono)
- Pure HTML / CSS / JS — zero build tools
