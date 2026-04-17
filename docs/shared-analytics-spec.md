# Shared Analytics Spec

This document defines the shared analytics contract for:

- the portfolio app, which produces analytics events
- the analytics webapp, which reads and analyzes those events

The goal is to keep both systems aligned around one event model, one ingestion contract, and one database structure.

## Purpose

This analytics system exists to answer practical portfolio questions such as:

- How many visitors actually interact with the graph?
- Which section gets opened most?
- Which projects get the most attention?
- Do people click `Hire Me`, resume, LinkedIn, or GitHub?
- How does mobile behavior differ from desktop behavior?

This is not intended to be generic web analytics. It is product-style event analytics for the portfolio experience.

## Architecture

The system has four parts:

1. Portfolio app
   - Emits structured analytics events.
   - Sends them to an ingestion endpoint.

2. Ingestion API
   - Validates payloads.
   - Enriches metadata where needed.
   - Writes events to the database.

3. Database
   - Stores raw events and session-level data.
   - Serves as the source of truth.

4. Analytics webapp
   - Reads from the database.
   - Aggregates events into charts, rankings, and recommendations.

## Design Principles

- Keep the event schema stable.
- Use explicit event names, not vague ones.
- Track high-signal interactions only.
- Preserve raw event data.
- Make UI components call one shared tracking helper.
- Keep ingestion separate from analysis.

## Event Model

Each event should follow this shape:

```ts
type AnalyticsEvent = {
  event: string;
  sessionId: string;
  visitorId: string;
  timestamp: string;
  path: string;
  source: "portfolio";
  deviceType: "mobile" | "desktop" | "tablet" | "unknown";
  referrer?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown>;
};
```

## Required Fields

- `event`
  - Stable event name.
- `sessionId`
  - Identifies one browsing session.
- `visitorId`
  - Anonymous persistent visitor identifier.
- `timestamp`
  - ISO 8601 UTC timestamp.
- `path`
  - Current route, usually `/`.
- `source`
  - Identifies the producer app. For now use `portfolio`.
- `deviceType`
  - Normalized device type.

## Optional Fields

- `referrer`
- `userAgent`
- `metadata`

## Initial Event List

These are the first events to support.

### Session / baseline

- `session_started`
- `graph_interaction_started`

### Navigation / discovery

- `search_opened`
- `search_result_selected`
- `section_opened`

### Portfolio content engagement

- `project_opened`
- `skill_group_opened`
- `experience_opened`
- `certification_opened`
- `about_opened`

### Recruiter CTA events

- `hire_me_opened`
- `resume_clicked`
- `linkedin_clicked`
- `github_profile_clicked`
- `email_clicked`

### Project outbound links

- `project_live_demo_clicked`
- `project_github_clicked`

### Optional UI interaction events

- `background_preset_changed`

## Event Metadata Contract

Each event type may include event-specific metadata.

### `graph_interaction_started`

```json
{
  "interactionType": "node-select"
}
```

### `section_opened`

```json
{
  "section": "projects"
}
```

Allowed `section` values:

- `projects`
- `skills`
- `experience`
- `certifications`
- `about`

### `project_opened`

```json
{
  "projectId": "daarkin",
  "title": "Daarkin"
}
```

### `skill_group_opened`

```json
{
  "groupId": "frontend",
  "title": "Frontend"
}
```

### `experience_opened`

```json
{
  "experienceId": "ollopa-corporation",
  "title": "IT Intern (OJT)"
}
```

### `certification_opened`

```json
{
  "certificationId": "hcip-storage-v5",
  "title": "Huawei HCIP-Storage V5.0"
}
```

### `hire_me_opened`

```json
{}
```

### `resume_clicked`

```json
{
  "location": "hire-me-modal"
}
```

### `linkedin_clicked`

```json
{
  "location": "hire-me-modal"
}
```

### `github_profile_clicked`

```json
{
  "location": "about-panel"
}
```

### `project_live_demo_clicked`

```json
{
  "projectId": "daarkin",
  "title": "Daarkin"
}
```

### `project_github_clicked`

```json
{
  "projectId": "glenda-residences",
  "title": "Glenda Residences"
}
```

### `background_preset_changed`

```json
{
  "preset": "cinematic"
}
```

## Naming Rules

- Use lowercase snake-style event names with underscores.
- Do not rename events casually.
- Do not reuse one event name for different meanings.
- Prefer explicit names like `project_opened` over vague names like `item_clicked`.

## Client Tracking Rules

The portfolio app should expose one shared tracking helper, for example:

```ts
track("project_opened", {
  projectId: "daarkin",
  title: "Daarkin"
});
```

Rules:

- UI components should not build raw analytics payloads by hand.
- All events should go through one helper.
- The helper should attach shared fields automatically.
- Session and visitor IDs should be handled centrally.

## Ingestion API Contract

Suggested endpoint:

```txt
POST /api/track
```

Suggested request body:

```json
{
  "event": "project_opened",
  "sessionId": "session_uuid",
  "visitorId": "visitor_uuid",
  "timestamp": "2026-04-17T12:00:00.000Z",
  "path": "/",
  "source": "portfolio",
  "deviceType": "desktop",
  "referrer": "https://www.linkedin.com/",
  "metadata": {
    "projectId": "daarkin",
    "title": "Daarkin"
  }
}
```

Suggested response:

```json
{
  "ok": true
}
```

### Ingestion Requirements

- Validate required fields.
- Reject malformed events.
- Add server timestamp if needed.
- Store raw metadata JSON.
- Avoid blocking the UI on best-effort failures.

## Database Schema

Use PostgreSQL.

### Table: `analytics_events`

```sql
create table analytics_events (
  id bigserial primary key,
  event_name text not null,
  session_id uuid not null,
  visitor_id uuid not null,
  occurred_at timestamptz not null,
  path text not null,
  source text not null,
  device_type text not null,
  referrer text,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
```

Recommended indexes:

```sql
create index analytics_events_event_name_idx on analytics_events (event_name);
create index analytics_events_occurred_at_idx on analytics_events (occurred_at desc);
create index analytics_events_session_id_idx on analytics_events (session_id);
create index analytics_events_visitor_id_idx on analytics_events (visitor_id);
create index analytics_events_metadata_gin_idx on analytics_events using gin (metadata);
```

### Table: `analytics_sessions`

```sql
create table analytics_sessions (
  id uuid primary key,
  visitor_id uuid not null,
  started_at timestamptz not null,
  last_seen_at timestamptz not null,
  landing_path text not null,
  referrer text,
  device_type text not null,
  source text not null,
  created_at timestamptz not null default now()
);
```

## Query Goals For The Analytics Webapp

The analytics webapp should support:

- visitor counts
- interaction rate
- most-opened sections
- most-opened projects
- CTA click counts
- mobile vs desktop comparison
- top referrers
- event timelines

## Core Questions And Matching Queries

### How many visitors actually interact with the graph?

Count unique `visitor_id` values that emitted `graph_interaction_started`.

### Which section gets opened most?

Count `section_opened` grouped by `metadata.section`.

### Which projects get the most attention?

Count `project_opened` grouped by `metadata.projectId`.

### Do people click Hire Me, resume, LinkedIn, or GitHub?

Count:

- `hire_me_opened`
- `resume_clicked`
- `linkedin_clicked`
- `github_profile_clicked`
- `project_github_clicked`

## Privacy / Data Policy

- Do not collect names, emails, or personally identifying form data.
- Keep visitor identity anonymous.
- Avoid storing exact IPs in the application schema unless explicitly needed.
- Track behavior, not personal identity.

## Versioning

This document is the shared contract between the producer app and the analytics app.

If the schema changes:

1. update this spec first
2. update the ingestion API
3. update the portfolio tracking helper
4. update the analytics webapp queries

## Initial Build Order

1. Define event helper in the portfolio app.
2. Add `session_started`.
3. Add `graph_interaction_started`.
4. Add section and project open events.
5. Add CTA click events.
6. Build ingestion API.
7. Store events in PostgreSQL.
8. Build analytics dashboard on top of raw events.
