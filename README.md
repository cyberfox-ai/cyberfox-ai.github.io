# 3D Portfolio — Floating Island

Inspired by plantpot.studio. Built with React Three Fiber.

## Quick Start

```bash
cd portfolio-3d
npm install
npm run dev
```

Open http://localhost:5173

## Controls

- **Drag** — orbit camera around island
- **Scroll** — zoom in/out
- **☀️ / 🌙** — toggle day/night lighting

## Project Structure

```
src/
├── App.jsx                  # Canvas, lights, camera, orbit controls
├── main.jsx                 # React entry
└── components/
    ├── FloatingIsland.jsx   # Island + all 3D objects (geometry-based)
    ├── Starfield.jsx        # Animated star field background
    └── UI.jsx               # HTML overlay (nav, toggle, hints)
```

## What's Built

- ✅ Floating island with layered geometry
- ✅ Building / office room
- ✅ Desk with dual monitors + lamp + keyboard
- ✅ Swivel chair
- ✅ Campfire with animated flame + warm light
- ✅ Street lantern with point light
- ✅ Tree with organic leaf clusters
- ✅ Mailbox
- ✅ Welcome sign
- ✅ Project canvas/easel
- ✅ Starfield background
- ✅ Day/Night toggle
- ✅ Gentle floating bob animation

## Next Steps

1. **Load a Blender model** — Replace geometry with a `.glb` file using `useGLTF` from drei
2. **Click to navigate** — Add raycasting + GSAP camera tween to zoom into desk/mailbox/etc
3. **Content panels** — Show project info when user clicks an object
4. **Custom cursor** — CSS cursor swap on hover
5. **Scroll interaction** — Use scroll to orbit camera
6. **GSAP intro animation** — Camera flies in from far on load

## Dependencies

| Package | Purpose |
|---------|---------|
| `@react-three/fiber` | React renderer for Three.js |
| `@react-three/drei` | Helpers: OrbitControls, useGLTF, etc |
| `three` | 3D engine |
| `gsap` | Camera animations (ready to use) |
