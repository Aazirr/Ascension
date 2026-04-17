-- Upserts anonymous analytics session state while preserving the original started_at.
-- Run this after 001_analytics_tables.sql.

create or replace function public.touch_analytics_session(
  p_session_id uuid,
  p_visitor_id uuid,
  p_started_at timestamptz,
  p_last_seen_at timestamptz,
  p_landing_path text,
  p_referrer text default null,
  p_device_type text default 'unknown',
  p_source text default 'portfolio'
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.analytics_sessions (
    id,
    visitor_id,
    started_at,
    last_seen_at,
    landing_path,
    referrer,
    device_type,
    source
  )
  values (
    p_session_id,
    p_visitor_id,
    p_started_at,
    p_last_seen_at,
    p_landing_path,
    p_referrer,
    p_device_type,
    p_source
  )
  on conflict (id) do update
    set last_seen_at = greatest(public.analytics_sessions.last_seen_at, excluded.last_seen_at),
        referrer = coalesce(public.analytics_sessions.referrer, excluded.referrer),
        device_type = excluded.device_type,
        source = excluded.source;
end;
$$;

revoke all on function public.touch_analytics_session(
  uuid,
  uuid,
  timestamptz,
  timestamptz,
  text,
  text,
  text,
  text
) from public;
