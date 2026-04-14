# Implementation Roadmap

Use this sequence to reduce risk and avoid rework.

## Progress

- [x] Phase 1 - Foundation
- [x] Phase 2 - Mobile fallback first
- [x] Phase 3 - Device and motion gates
- [x] Phase 4 - 3D graph skeleton
- [x] Phase 5 - Panels and interactions
- [x] Phase 6 - Animation pass
- [ ] Phase 7 - Polish and release

## Phase 1 - Foundation

- [x] Initialize Next.js + TypeScript + Tailwind project.
- [x] Add fonts, metadata, and Vercel Analytics.
- [x] Install all packages including `simplex-noise`.
- [x] Add `resume.pdf` to `/public`.
- [x] Implement `useReducedMotion` hook.
- [x] Create `types/index.ts` and empty JSON data files.
- [x] Add base theme tokens in global CSS.

Exit criteria:

- [x] Project builds cleanly.
- [x] Core layout and font stack are visible.

## Phase 2 - Mobile fallback first

- [x] Build hero section and availability badge.
- [x] Build projects cards grid.
- [x] Build grouped skills section.
- [x] Build experience timeline.
- [x] Build certifications and contact sections.
- [x] Add Framer Motion scroll reveal (gate with useReducedMotion from Phase 1).

Exit criteria:

- [x] Full fallback is complete and visually coherent.
- [x] Content reads well on 390px and 768px widths.
- [x] Deploy to Vercel.

## Phase 3 - Device and motion gates

- [x] Implement `useDeviceCheck` (viewport + WebGL).
- [x] Implement `useReducedMotion`.
- [x] Integrate mode switch in `app/page.tsx`.

Exit criteria:

- [x] Fallback mode triggers correctly under each gate condition.

## Phase 4 - 3D graph skeleton

- [x] Build `Scene.tsx` with `CameraControls`.
- [x] Place central node and category nodes.
- [x] Add leaf nodes and static connection lines.
- [x] Wire `useNodeGraph` hook for active node state.
- [x] Add hover states - cursor pointer, scale feedback.
- [x] Add static `ParticleField`.
- [x] Add click handling and active node state.

Exit criteria:

- [x] Nodes are spaced and clickable.
- [x] Camera can move toward clicked nodes.
- [x] Nodes respond visually to hover and click.

## Phase 5 - Panels and interactions

- [x] Build all section panels.
- [x] Connect panel data to active node.
- [x] Add Escape key close.
- [x] Add canvas `onPointerMissed` close.

Exit criteria:

- [x] Any node can open/close the expected panel content.

## Phase 6 - Animation pass

- [x] Add central node pulse/rotation (disabled in reduced motion).
- [x] Add dashed line animation and active-line emphasis.
- [x] Add particle field drift (disabled in reduced motion).
- [x] Add GSAP intro timeline using refs.

Exit criteria:

- [x] Motion feels intentional and smooth.
- [x] Reduced-motion mode remains fully usable and mostly static.

## Phase 7 - Polish and release

- [ ] Fix welcome intro animation visibility (currently not appearing on initial load).
- [ ] Verify metadata, OG image, and favicon.
- [ ] Add screenshot assets.
- [ ] Run Lighthouse checks and tune bottlenecks.
- [ ] Cross-browser test (Chrome, Firefox, Safari).
- [ ] Test `prefers-reduced-motion` explicitly on the OS.
- [ ] Test on a real mobile device.
- [ ] Verify GSAP intro timeline animates mesh refs, not React state.

Exit criteria:

- [ ] Performance and accessibility targets meet the spec: 90+ Lighthouse performance, 90+ accessibility, < 2.0s FCP, < 500kb gzipped.
- [ ] Production deployment is stable.
