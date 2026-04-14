# Quality and Release Checklist

Use this checklist before shipping.

## Progress

- [x] Phase 1 foundation complete
- [ ] Phase 2 fallback complete
- [ ] Phase 3 device gates complete
- [ ] Phase 4 graph skeleton complete
- [ ] Phase 5 panels complete
- [ ] Phase 6 animation pass complete
- [ ] Phase 7 polish and release complete

## Functional checks

- [ ] Desktop graph mode renders with central, category, and leaf nodes.
- [ ] Mobile fallback renders for <=768px width.
- [ ] Mobile fallback renders when WebGL is unavailable.
- [ ] Reduced motion disables non-essential animation.
- [ ] Node click opens matching panel.
- [ ] Escape key closes active panel.
- [ ] Canvas outside click closes active panel.
- [ ] Resume button downloads `/resume.pdf`.

## Visual checks

- [ ] Color tokens match spec.
- [ ] Font stack is Space Grotesk, Inter, and JetBrains Mono.
- [ ] Panel width stays within desktop constraints.
- [ ] Hover, active, and idle node states are visually distinct.

## Performance checks

- [ ] First contentful paint is near target.
- [ ] Canvas is interactive in under 3 seconds on average connection.
- [ ] Bundle size remains controlled for Three.js usage.
- [ ] Particle count does not exceed 500.

## Accessibility checks

- [ ] Fallback mode is keyboard navigable.
- [ ] Buttons and links have visible focus states.
- [ ] Contrast is acceptable in panel text and tags.
- [ ] Motion-sensitive users are respected.

## SEO and metadata checks

- [ ] Title and description are set in layout metadata.
- [ ] Open Graph image is present and valid.
- [ ] Canonical and robots metadata are present.
- [ ] Twitter card metadata is present.

## Deployment checks

- [ ] Build succeeds in CI.
- [ ] Vercel deployment succeeds.
- [ ] Custom domain resolves (if configured).
- [ ] Analytics events are visible in Vercel dashboard.

## Current status

- [x] Lint passes locally.
- [x] Production build passes locally.
- [x] Foundation docs and starter data are in place.
