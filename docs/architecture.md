# Architecture Guide

## Runtime modes

The app has two user-facing modes:

- Desktop immersive mode: React Three Fiber graph with interactive nodes and camera movement.
- Fallback mode: scrollable 2D layout for small screens, no WebGL, or reduced-motion users.

Selection logic:

- Use fallback when any is true:
  - viewport width <= 768
  - WebGL not supported
  - `prefers-reduced-motion: reduce`

## Core modules

### App shell

- `app/layout.tsx`: global styles, fonts, metadata, analytics.
- `app/page.tsx`: mode switching and top-level composition.

### Canvas system

- `Scene.tsx`: Canvas orchestration, camera controls, pointer-missed close behavior.
- `CentralNode.tsx`: identity node with optional idle animation.
- `BranchNode.tsx`: reusable category and leaf node representation.
- `ConnectionLine.tsx`: dashed animated lines with distance recompute.
- `ParticleField.tsx`: star background with reduced-motion guard.

### Panel system

- `ProjectPanel.tsx`
- `SkillPanel.tsx`
- `ExperiencePanel.tsx`
- `CertificationPanel.tsx`
- `AboutPanel.tsx`

Panels slide from right and close via outside click or Escape.

### Hooks

- `useNodeGraph.ts`: active node, hover state, adjacency, open/close actions.
- `useDeviceCheck.ts`: viewport + WebGL support detection.
- `useReducedMotion.ts`: reads motion preference and exposes stable boolean.

### Data layer

Static JSON files in `/data`:

- `projects.json`
- `skills.json`
- `experience.json`
- `certifications.json`
- `about.json`

Type contracts live in `types/index.ts`.

## Interaction flow

1. Initial load decides mode (canvas vs fallback).
2. If canvas mode and motion allowed, play GSAP intro sequence.
3. User hovers and clicks nodes.
4. Active node updates graph state.
5. Related panel opens with Framer Motion.
6. Escape/outside click clears active node and closes panel.

## Rendering and animation responsibilities

- GSAP: intro timeline and fine-grained object ref animation.
- Framer Motion: panel and mobile section transitions.
- R3F `useFrame`: lightweight per-frame mesh/line/particle updates.

Avoid using GSAP on React state directly.

## Performance guardrails

- Keep particles under 500.
- Use `BufferGeometry` only.
- Minimize number of `useFrame` hooks.
- Dispose geometry/materials on unmount.
- Lazy-load heavy canvas modules where practical.
