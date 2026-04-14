# Project Setup Guide

This guide bootstraps the project with the stack required by the spec.

## Progress

- [x] Project scaffold initialized
- [x] Core dependencies installed
- [x] Fonts, metadata, and analytics wired
- [x] Base theme tokens added
- [ ] Mobile fallback scaffold created
- [ ] Device and motion gates implemented
- [ ] 3D graph structure built
- [ ] Panels and interactions wired

## 1. Create app

```bash
npx create-next-app@latest . --ts --tailwind --app --eslint --src-dir false --import-alias "@/*"
```

Choose these values if prompted:

- [x] Use TypeScript: Yes
- [x] Use App Router: Yes
- [x] Use Tailwind CSS: Yes
- [x] Use `src/` directory: No

## 2. Install dependencies

```bash
npm install @react-three/fiber @react-three/drei three framer-motion gsap @vercel/analytics
npm install -D @types/three
```

- [x] React Three Fiber installed
- [x] Drei installed
- [x] Three.js installed
- [x] Framer Motion installed
- [x] GSAP installed
- [x] Vercel Analytics installed
- [x] Three.js types installed

## 3. Recommended folder layout

```text
app/
  layout.tsx
  page.tsx
  components/
    canvas/
    panels/
    ui/
  hooks/
data/
  projects.json
  skills.json
  experience.json
  certifications.json
  about.json
types/
  index.ts
public/
  screenshots/
  og-image.png
  favicon.ico
  resume.pdf
docs/
```

## 4. Fonts

Use `next/font/google` in `app/layout.tsx`:

- Space Grotesk
- Inter
- JetBrains Mono

Do not use `<link>` tags or self-hosting for this project.

## 5. Baseline tasks

- [x] Add metadata and Open Graph config to `app/layout.tsx`.
- [x] Add `<Analytics />` from `@vercel/analytics/react` in `app/layout.tsx`.
- [ ] Build mobile fallback first before the 3D graph.
- [ ] Add WebGL detection and reduced-motion handling before animations.

## 6. First-run verification

- [x] `npm run lint` passes
- [x] `npm run build` passes
- [x] Landing page renders on desktop and mobile viewport
- [ ] Mobile fallback renders when WebGL is unavailable
