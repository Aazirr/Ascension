# Quality and Release Checklist

Use this checklist before shipping.

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
