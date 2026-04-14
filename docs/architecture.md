# Architecture Guide

## Progress

- [x] Runtime modes defined
- [x] Core modules identified
- [x] Interaction flow documented
- [x] Rendering responsibilities separated
- [x] Performance guardrails listed

## Runtime modes

The app has two user-facing modes:

- [x] Desktop immersive mode: React Three Fiber graph with interactive nodes and camera movement.
- [x] Fallback mode: scrollable 2D layout for small screens, no WebGL, or reduced-motion users.

Selection logic:

- [x] Use fallback when any is true:
  - [x] viewport width <= 768
  - [x] WebGL not supported
  - [x] `prefers-reduced-motion: reduce`

## Core modules

### App shell

- [x] `app/layout.tsx`: global styles, fonts, metadata, analytics.
- [x] `app/page.tsx`: mode switching and top-level composition.

### Canvas system

- [ ] `Scene.tsx`: Canvas orchestration, camera controls, pointer-missed close behavior.
- [ ] `CentralNode.tsx`: identity node with optional idle animation.
- [ ] `BranchNode.tsx`: reusable category and leaf node representation.
- [ ] `ConnectionLine.tsx`: dashed animated lines with distance recompute.
- [ ] `ParticleField.tsx`: star background with reduced-motion guard.

### Panel system

- [ ] `ProjectPanel.tsx`
- [ ] `SkillPanel.tsx`
- [ ] `ExperiencePanel.tsx`
- [ ] `CertificationPanel.tsx`
- [ ] `AboutPanel.tsx`

Panels slide from right and close via outside click or Escape.

- [ ] Panels slide from right and close via outside click or Escape.

### Hooks

- [ ] `useNodeGraph.ts`: active node, hover state, adjacency, open/close actions.
- [ ] `useDeviceCheck.ts`: viewport + WebGL support detection.
- [ ] `useReducedMotion.ts`: reads motion preference and exposes stable boolean.

### Data layer

Static JSON files in `/data`:

- [x] `projects.json`
- [x] `skills.json`
- [x] `experience.json`
- [x] `certifications.json`
- [x] `about.json`

Type contracts live in `types/index.ts`.

- [x] Type contracts live in `types/index.ts`.

## Interaction flow

1. [x] Initial load decides mode (canvas vs fallback).
2. [x] If canvas mode and motion allowed, play GSAP intro sequence.
3. [x] User hovers and clicks nodes.
4. [x] Active node updates graph state.
5. [x] Related panel opens with Framer Motion.
6. [x] Escape/outside click clears active node and closes panel.

## Rendering and animation responsibilities

- [x] GSAP: intro timeline and fine-grained object ref animation.
- [x] Framer Motion: panel and mobile section transitions.
- [x] R3F `useFrame`: lightweight per-frame mesh/line/particle updates.

Avoid using GSAP on React state directly.

- [x] Avoid using GSAP on React state directly.

## Performance guardrails

- [x] Keep particles under 500.
- [x] Use `BufferGeometry` only.
- [x] Minimize number of `useFrame` hooks.
- [x] Dispose geometry/materials on unmount.
- [x] Lazy-load heavy canvas modules where practical.
