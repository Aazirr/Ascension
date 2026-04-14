# Node Icon Structure

Put your node icons in these tier folders:

- `public/icons/tier-1-central/`
- `public/icons/tier-2-category/`
- `public/icons/tier-3-leaf/`

## Naming Rule

Use the **node id** as the filename with `.svg`:

- `public/icons/tier-1-central/central-you.svg`
- `public/icons/tier-2-category/branch-projects.svg`
- `public/icons/tier-3-leaf/project-hybrid.svg`

If a specific icon is missing, the app falls back to `_default.svg` in that tier.

## Node Id Patterns

- Tier 1 (central): `central-you`
- Tier 2 (category): `branch-projects`, `branch-skills`, `branch-experience`, `branch-certifications`, `branch-about`
- Tier 3 (leaf):
  - Projects: `project-{project.id}`
  - Skills: `skill-group-{skillCategory.id}`
  - Experience: `experience-{experience.id}`
  - Certifications: `certification-{certification.id}`
  - About: `about-background`, `about-community`, `about-contact`
