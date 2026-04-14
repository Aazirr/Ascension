# Implementation Roadmap

Use this sequence to reduce risk and avoid rework.

## Progress

- [x] Phase 1 - Foundation
- [ ] Phase 2 - Mobile fallback first
- [ ] Phase 3 - Device and motion gates
- [ ] Phase 4 - 3D graph skeleton
- [ ] Phase 5 - Panels and interactions
- [ ] Phase 6 - Animation pass
- [ ] Phase 7 - Polish and release

## Phase 1 - Foundation

- [x] Initialize Next.js + TypeScript + Tailwind project.
- [x] Add fonts, metadata, and Vercel Analytics.
- [x] Create `types/index.ts` and empty JSON data files.
- [x] Add base theme tokens in global CSS.

Exit criteria:

- [x] Project builds cleanly.
- [x] Core layout and font stack are visible.

## Phase 2 - Mobile fallback first

- [ ] Build hero section and availability badge.
- [ ] Build projects cards grid.
- [ ] Build grouped skills section.
- [ ] Build experience timeline.
- [ ] Build certifications and contact sections.
- [ ] Add Framer Motion scroll reveal (respect reduced motion).

Exit criteria:

- [ ] Full fallback is complete and visually coherent.
- [ ] Content reads well on 390px and 768px widths.

## Phase 3 - Device and motion gates

- [ ] Implement `useDeviceCheck` (viewport + WebGL).
- [ ] Implement `useReducedMotion`.
- [ ] Integrate mode switch in `app/page.tsx`.

Exit criteria:

- [ ] Fallback mode triggers correctly under each gate condition.

## Phase 4 - 3D graph skeleton

- [ ] Build `Scene.tsx` with `CameraControls`.
- [ ] Place central node and category nodes.
- [ ] Add leaf nodes and static connection lines.
- [ ] Add click handling and active node state.

Exit criteria:

- [ ] Nodes are spaced and clickable.
- [ ] Camera can move toward clicked nodes.

## Phase 5 - Panels and interactions

- [ ] Build all section panels.
- [ ] Connect panel data to active node.
- [ ] Add Escape key close.
- [ ] Add canvas `onPointerMissed` close.

Exit criteria:

- [ ] Any node can open/close the expected panel content.

## Phase 6 - Animation pass

- [ ] Add central node pulse/rotation (disabled in reduced motion).
- [ ] Add dashed line animation and active-line emphasis.
- [ ] Add particle field drift (disabled in reduced motion).
- [ ] Add GSAP intro timeline using refs.

Exit criteria:

- [ ] Motion feels intentional and smooth.
- [ ] Reduced-motion mode remains fully usable and mostly static.

## Phase 7 - Polish and release

- [ ] Verify metadata, OG image, and favicon.
- [ ] Add screenshot assets and resume PDF.
- [ ] Run Lighthouse checks and tune bottlenecks.
- [ ] Cross-browser test (Chrome, Firefox, Safari).
- [ ] Deploy to Vercel.

Exit criteria:

- [ ] Performance and accessibility targets are close to spec.
- [ ] Production deployment is stable.
