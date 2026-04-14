# Project Setup Guide

This guide bootstraps the project with the stack required by the spec.

## 1. Create app

```bash
npx create-next-app@latest . --ts --tailwind --app --eslint --src-dir false --import-alias "@/*"
```

Choose these values if prompted:

- Use TypeScript: Yes
- Use App Router: Yes
- Use Tailwind CSS: Yes
- Use `src/` directory: No

## 2. Install dependencies

```bash
npm install @react-three/fiber @react-three/drei three framer-motion gsap @vercel/analytics
npm install -D @types/three
```

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

- Add metadata and Open Graph config to `app/layout.tsx`.
- Add `<Analytics />` from `@vercel/analytics/react` in `app/layout.tsx`.
- Build mobile fallback first before the 3D graph.
- Add WebGL detection and reduced-motion handling before animations.

## 6. First-run verification

- `npm run lint` passes
- `npm run build` passes
- Landing page renders on desktop and mobile viewport
- Mobile fallback renders when WebGL is unavailable
