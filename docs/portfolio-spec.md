# Portfolio Specification — Franz Jason Dolores
## "Cosmic Neural Network" Interactive Portfolio

---

## 1. Concept Summary

A dark-space canvas where a central identity node (YOU) branches outward into animated pathways leading to Projects, Skills, Experience, and About nodes. Each node expands into a detail panel when activated. The interaction model mirrors a knowledge graph or skill tree — familiar to any gamer, immediately impressive to any recruiter.

The core metaphor: **your mind as a system.** Everything connects. Nothing is isolated.

---

## 2. Tech Stack

### Framework
- **Next.js 14** (App Router)
- Deployed on **Vercel** (you already know this workflow from Daarkin)

### Rendering & Animation
- **React Three Fiber (R3F)** — 3D canvas rendering via Three.js
- **@react-three/drei** — helpers (OrbitControls, Text, Line, Sphere)
- **Framer Motion** — UI panel animations, page transitions
- **GSAP** — precise timeline animations for node pulse effects

### Graph / Node Logic
- Custom hook `useNodeGraph` — manages node state, active node, connection lines
- No external graph library needed — the node count is small enough to hand-roll

### Styling
- **Tailwind CSS** — UI panels, overlays, mobile layout
- CSS custom properties for the design token system (see Section 4)

### Type Safety
- **TypeScript** throughout

### Content
- Static JSON files in `/data/` — no CMS needed
- One file per section: `projects.json`, `skills.json`, `experience.json`

### Performance
- `React.lazy` + `Suspense` for the 3D canvas
- Fallback 2D layout for mobile (canvas is desktop-first)
- `next/image` for all project screenshots

### Package List
```
next react react-dom typescript
@react-three/fiber @react-three/drei three
framer-motion gsap
tailwindcss postcss autoprefixer
@types/three @types/react @types/node
```

> Note: GSAP handles the load sequence timeline; Framer Motion handles UI panel animations. They don't overlap — each does what the other does poorly. Don't drop either.

---

## 3. Site Architecture

```
/app
  layout.tsx          — global font, metadata, dark bg
  page.tsx            — canvas entry point
  /components
    /canvas
      Scene.tsx         — R3F Canvas wrapper
      CentralNode.tsx   — the YOU node
      BranchNode.tsx    — reusable child node
      ConnectionLine.tsx — animated beam between nodes
      ParticleField.tsx — background star particles
    /panels
      ProjectPanel.tsx  — slides in when project node clicked
      SkillPanel.tsx
      AboutPanel.tsx
      ExperiencePanel.tsx
    /ui
      NavHint.tsx       — "click a node to explore" instruction
      MobileLayout.tsx  — fallback for small screens
      ResumeButton.tsx  — fixed download button (PDF resume)
  /hooks
    useNodeGraph.ts     — node state management
    useDeviceCheck.ts   — WebGL + touch detection (not just screen width)
    useReducedMotion.ts — respects prefers-reduced-motion
/data                   — at root level, not inside /app
  projects.json
  skills.json
  experience.json
  about.json
/types
  index.ts              — Project, SkillCategory, ExperienceItem interfaces
/public
  /screenshots          — project images
  og-image.png          — OpenGraph preview image
  favicon.ico
  resume.pdf            — downloadable resume
```

> Note: `/public/fonts` is not needed — fonts load via `next/font/google` which handles caching and optimization automatically.

---

## 4. Visual Design System

### Color Palette
```
Background:     #050510  — deep space black-blue
Central node:   #7F77DD  — purple (your identity color)
Project nodes:  #1D9E75  — teal
Skill nodes:    #378ADD  — blue
Experience:     #D85A30  — coral
About node:     #888780  — gray

Connection lines: rgba(127, 119, 221, 0.3)  — purple, low opacity
Active line:      rgba(127, 119, 221, 0.9)  — full opacity on hover/select
Particle field:   rgba(255, 255, 255, 0.4)  — white, dim

Panel background: rgba(5, 5, 16, 0.92)     — frosted dark glass
Panel border:     rgba(127, 119, 221, 0.25)
```

### Typography
```
Display (name):   Space Grotesk, 700, 48px
Node labels:      Space Grotesk, 500, 14px
Panel headings:   Space Grotesk, 500, 20px
Panel body:       Inter, 400, 15px, line-height 1.7
Code/tech tags:   JetBrains Mono, 400, 13px
```

All three fonts (Space Grotesk, Inter, JetBrains Mono) are on Google Fonts. Load all via `next/font/google` — do not self-host or use `<link>` tags.

### Node Sizes (radius in Three.js units)
```
Central node:   1.2
Category nodes: 0.7   (Projects, Skills, etc.)
Leaf nodes:     0.4   (individual projects, individual skills)
```

### Spacing / Layout
```
Canvas: full viewport (100vw × 100vh)
Panel width: 420px, slides in from right
Panel padding: 2rem
Mobile breakpoint: 768px → switch to scrollable 2D layout
```

---

## 5. Node Graph Structure

```
YOU (central)
├── Projects
│   ├── Glenda Residences
│   ├── DripMon
│   ├── Daarkin
│   ├── VGC Puzzle Trainer
│   └── SpeakForge
├── Skills
│   ├── Frontend  (React, Next.js, TypeScript, Tailwind)
│   ├── Backend   (Node.js, Express, PostgreSQL, REST)
│   ├── Integrations (Telegram, Discord.js, PokeAPI, Anthropic)
│   └── Tooling   (Railway, Vercel, GitHub, Google Apps Script)
├── Experience
│   ├── Ollopa Corporation (OJT)
│   └── Freelance GAS Developer
├── Certifications
│   ├── Huawei HCIP-Storage V5.0
│   ├── Huawei HCIA-Storage V4.5
│   └── Huawei HCIE-Storage V2.5
└── About
    ├── Background
    ├── Gaming / Community
    └── Contact
```

Leaf nodes only expand on click — they don't branch further. Clicking opens the detail panel.

---

## 6. Animation Specifications

### Central Node — Idle State
- Slow continuous rotation: `rotation.y += 0.003` per frame (inside `useFrame`)
- Pulse scale: `Math.sin(state.clock.getElapsedTime()) * 0.05 + 1.0` — note: `clock` in R3F's `useFrame` callback is a `THREE.Clock` object, use `.getElapsedTime()` not raw `clock`
- Emissive glow: purple, intensity 0.4

### Connection Lines — Idle State
- Opacity: 0.3
- Animated dash offset scrolling toward child nodes (data-flow feel)
- Use `LineDashedMaterial` with `dashOffset` animated in `useFrame`
- **Critical gotcha:** `LineDashedMaterial` requires calling `line.computeLineDistances()` every time geometry changes or dashes won't render. Store a ref to the line and call this after any position update.

### Node — Hover State
- Scale lerp to 1.2 over 200ms
- Line opacity lerp to 0.8
- Cursor changes to pointer (`document.body.style.cursor = 'pointer'` in `onPointerOver`, reset in `onPointerOut`)
- Label brightens

### Node — Active/Selected State
- Scale lerp to 1.35
- Emissive intensity increases to 0.8
- Connected lines fully opaque, pulsing
- Panel slides in from right (Framer Motion: `x: 420 → 0`, spring)
- **Closing the panel:** clicking outside the panel or pressing Escape resets active node to null and slides panel out. Wire an `onPointerMissed` handler on the R3F Canvas for click-outside, and a `keydown` listener for Escape.

### Background Particles
- 300–500 points scattered across a large sphere
- Slow drift using simplex noise per frame
- Two size classes: 0.02 (most) and 0.05 (occasional bright stars)
- **Reduced motion:** if `prefers-reduced-motion: reduce` is detected, skip drift animation entirely — particles remain static.

### Camera
- Use `@react-three/drei`'s `CameraControls` instead of `OrbitControls` for this project — it supports programmatic camera movement (`cameraControls.moveTo()`, `cameraControls.fitToBox()`) without fighting the control loop. `OrbitControls` is hard to lerp programmatically.
- Auto-rotate: slow, pauses when user interacts
- Min/max polar angle constrained (don't let user flip upside down)
- On node click: camera smoothly moves toward clicked node using `cameraControls.moveTo(x, y, z, true)` (the `true` enables animation)

### Page Load Sequence (timeline, GSAP)
```
0.0s  — particles fade in
0.4s  — central node scales up from 0
0.8s  — connection lines draw outward (stroke animation)
1.2s  — category nodes appear, staggered 150ms each
1.8s  — nav hint fades in ("Click a node to explore")
```
> GSAP + R3F integration note: GSAP cannot directly tween R3F component state. Animate refs to Three.js objects (e.g. `meshRef.current.scale`) inside a `gsap.to()` call, or use GSAP to drive a plain JS value that R3F reads each frame via `useFrame`. Do not try to tween React state with GSAP — it will cause re-render conflicts.

---

## 7. Panel Design — Per Section

### Project Panel
```
— Project name (heading)
— One-line description (italic, muted)
— Tech stack tags (JetBrains Mono, pill style)
— Screenshot or mockup image
— 3 bullet points: what it does, key technical decision, real-world impact
— Two buttons: [Live Demo] [GitHub]
```

### Skills Panel
```
— Category name
— Skill tags in a wrap grid
— For each skill: name + a 1-line honest context
  ("PostgreSQL — used in 4 deployed projects, schema design + migrations")
```

### Experience Panel
```
— Role + company + dates
— 3 bullet points max, same style as resume
```

### About Panel
```
— Short paragraph (your own words — conversational, not formal)
— Gaming / community section: DripMon, VGC, competitive mindset
— Availability status badge (green dot + "Open to opportunities")
— Contact: email + GitHub + LinkedIn
— Resume download button (links to /public/resume.pdf)
```

> Panel width note: 420px works on 1280px+ screens. On smaller desktops (1024px–1280px) reduce to 360px. Use a CSS clamp or Tailwind responsive class — don't let the panel eat more than 35% of the viewport width.

---

## 8. Mobile Fallback (≤768px)

The 3D canvas is replaced with a clean scrollable single-page layout when either: screen width ≤ 768px **or** WebGL is not supported **or** `prefers-reduced-motion: reduce` is set. The `useDeviceCheck` hook should check all three — not just screen width — because some users disable WebGL or have motion sensitivity.

```
— Hero: name, tagline, availability badge, resume download button
— Projects: card grid (2 col on tablet, 1 col on phone)
— Skills: tag cloud grouped by category
— Experience: timeline
— Certifications
— About + Contact
```

Same color palette and typography. Framer Motion scroll-triggered fade-ins replace the node interactions.

This is not a degraded experience — it's a complete alternate layout.

---

## 9. Data Formats

### projects.json
```json
[
  {
    "id": "glenda",
    "title": "Glenda Residences",
    "tagline": "Apartment billing system with Telegram bot and SMS automation",
    "stack": ["Node.js", "React", "Express", "PostgreSQL", "Telegram API", "pdfkit"],
    "bullets": [
      "Manages full tenant lifecycle — registration, meter readings, bill generation, payment tracking",
      "Telegram bot shares the same database as the admin webapp for redundant operator access",
      "Deployed on Railway with automatic schema migrations on startup"
    ],
    "liveUrl": "https://your-railway-url.app",
    "githubUrl": "https://github.com/Aazirr/Glenda_Residences",
    "screenshot": "/screenshots/glenda.png",
    "nodePosition": [3, 1, -1]
  }
]
```

### skills.json
```json
[
  {
    "id": "frontend",
    "category": "Frontend",
    "nodePosition": [2, -1, 2],
    "skills": [
      { "name": "React", "context": "Used in Glenda, Daarkin, SpeakForge, VGC Trainer" },
      { "name": "Next.js", "context": "VGC Puzzle Trainer architecture" },
      { "name": "TypeScript", "context": "Daarkin and VGC Trainer codebases" },
      { "name": "Tailwind CSS", "context": "UI layer across all React projects" }
    ]
  }
]
```

### experience.json
```json
[
  {
    "id": "ollopa",
    "role": "IT Intern (OJT)",
    "company": "Ollopa Corporation",
    "location": "Quezon City",
    "dates": "Sep 2025 – Dec 2025",
    "nodePosition": [-3, 0, 1],
    "bullets": [
      "Provided IT and system-related support for sales operations",
      "Identified and documented bugs during website review cycles",
      "Gained exposure to IT workflows, stakeholder reporting, and production deadlines"
    ]
  }
]
```

> `nodePosition` is the x/y/z coordinate of the leaf node in 3D space. Plan positions on paper first — sketch the graph layout before hardcoding coordinates. Nodes need enough spacing to avoid overlap (minimum ~2 units between any two leaf nodes). Category nodes should sit at roughly 2.5 units from center; leaf nodes at 4.5–5.5 units from center.

---

## 10. Performance Targets

```
Lighthouse score:       90+ performance, 90+ accessibility (not 100 — canvas is inherently limited for screen readers)
First contentful paint: < 2.0s (Three.js makes < 1.5s unrealistic — the canvas loads behind Suspense but initial HTML still needs to paint first)
Canvas load:            < 3.0s on average connection
Bundle size:            < 500kb gzipped (Three.js is heavy — tree shaking is essential)
```

Three.js optimization notes:
- Use `BufferGeometry` only — never legacy `Geometry`
- Dispose geometries and materials when panels unmount
- Limit `useFrame` callbacks — consolidate into one where possible
- Keep particle count under 500

**Required additions for accessibility and resilience:**

WebGL detection — on mount, check `canvas.getContext('webgl2') || canvas.getContext('webgl')`. If null, render the mobile fallback layout regardless of screen size. Some corporate laptops and VMs have WebGL disabled.

`prefers-reduced-motion` — use the `useReducedMotion` hook (Framer Motion exposes this, or write your own with `window.matchMedia('(prefers-reduced-motion: reduce)')`). When true: skip the GSAP load sequence, disable particle drift, disable auto-rotate, disable node pulse. The graph still renders — just static.

```tsx
const reducedMotion = useReducedMotion()
// pass as prop to Scene — Scene disables animations accordingly
```

---

## 11. SEO & Meta

```tsx
// app/layout.tsx
export const metadata = {
  title: "Franz Jason Dolores — Full Stack Developer",
  description: "Building real systems for real users. Node.js, React, PostgreSQL.",
  metadataBase: new URL("https://yourdomain.com"),
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Franz Jason Dolores — Full Stack Developer",
    description: "Full Stack Developer — Cebu, Philippines",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Franz Jason Dolores — Full Stack Developer",
    description: "Full Stack Developer — Cebu, Philippines",
    images: ["/og-image.png"],
  },
}
```

**Vercel Analytics** — add `@vercel/analytics` to the project. It's free on Vercel's hobby tier and gives you visitor counts, top pages, and referral sources. Useful to know if anyone is actually finding your portfolio.

```tsx
// app/layout.tsx
import { Analytics } from "@vercel/analytics/react"
// add <Analytics /> inside the body
```

---

## 12. Build & Deploy Checklist

- [ ] Init Next.js with TypeScript + Tailwind
- [ ] Set up `/types/index.ts` — Project, SkillCategory, ExperienceItem interfaces
- [ ] Populate all `/data` JSON files
- [ ] Add `resume.pdf` to `/public`
- [ ] Build mobile fallback layout first (use as design foundation)
- [ ] Add WebGL detection in `useDeviceCheck`
- [ ] Add `useReducedMotion` hook
- [ ] Build ParticleField (background)
- [ ] Build CentralNode with idle animations
- [ ] Build ConnectionLine — remember `computeLineDistances()` for dashes
- [ ] Build BranchNode (reusable)
- [ ] Wire `useNodeGraph` hook
- [ ] Replace OrbitControls with CameraControls (drei)
- [ ] Add camera movement on node click
- [ ] Build all 4 detail panels + Certifications panel
- [ ] Add panel slide-in with Framer Motion
- [ ] Wire Escape key + click-outside to close panel (`onPointerMissed` on Canvas)
- [ ] Add ResumeButton component (fixed position, links to `/public/resume.pdf`)
- [ ] Page load sequence (GSAP timeline — animate mesh refs, not React state)
- [ ] Disable all animations when `reducedMotion` is true
- [ ] SEO metadata + OG image (1200×630px)
- [ ] Add Vercel Analytics
- [ ] Cross-browser test: Chrome, Firefox, Safari
- [ ] Deploy to Vercel
- [ ] Connect custom domain (optional)

---

## 13. Estimated Build Time

| Phase | Hours |
|---|---|
| Setup + data layer + types | 2–3 hrs |
| Mobile fallback layout | 3–4 hrs |
| 3D canvas + nodes + lines | 6–8 hrs |
| Animations (idle + interaction) | 4–6 hrs |
| Detail panels (all 5 inc. Certifications) | 5–6 hrs |
| Escape/click-outside + reduced motion | 1–2 hrs |
| Polish + cross-browser testing + deploy | 2–3 hrs |
| **Total** | **~23–32 hrs** |

Realistically 1.5–2 weekends of focused work if you're doing this alongside applications.

---

*Keep applications going while you build this. Don't let the portfolio block the job search.*
