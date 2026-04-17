-- Helpful starter views for the future analytics dashboard webapp.
-- Run this after the tables and function are created.

create or replace view public.analytics_section_opens as
select
  metadata ->> 'section' as section,
  count(*) as open_count
from public.analytics_events
where event_name = 'section_opened'
group by metadata ->> 'section';

create or replace view public.analytics_project_opens as
select
  metadata ->> 'projectId' as project_id,
  max(metadata ->> 'title') as title,
  count(*) as open_count
from public.analytics_events
where event_name = 'project_opened'
group by metadata ->> 'projectId';

create or replace view public.analytics_cta_events as
select
  event_name,
  count(*) as total
from public.analytics_events
where event_name in (
  'hire_me_opened',
  'resume_clicked',
  'linkedin_clicked',
  'github_profile_clicked',
  'project_github_clicked',
  'project_live_demo_clicked',
  'email_clicked'
)
group by event_name;
