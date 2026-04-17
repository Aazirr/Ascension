-- Shared analytics tables for the portfolio producer app and analytics webapp.
-- Run this in Supabase SQL Editor first.

create extension if not exists pgcrypto;

create table if not exists public.analytics_events (
  id bigserial primary key,
  event_name text not null,
  session_id uuid not null,
  visitor_id uuid not null,
  occurred_at timestamptz not null,
  path text not null,
  source text not null default 'portfolio',
  device_type text not null,
  referrer text,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_event_name_idx
  on public.analytics_events (event_name);

create index if not exists analytics_events_occurred_at_idx
  on public.analytics_events (occurred_at desc);

create index if not exists analytics_events_session_id_idx
  on public.analytics_events (session_id);

create index if not exists analytics_events_visitor_id_idx
  on public.analytics_events (visitor_id);

create index if not exists analytics_events_metadata_gin_idx
  on public.analytics_events using gin (metadata);

create table if not exists public.analytics_sessions (
  id uuid primary key,
  visitor_id uuid not null,
  started_at timestamptz not null,
  last_seen_at timestamptz not null,
  landing_path text not null,
  referrer text,
  device_type text not null,
  source text not null default 'portfolio',
  created_at timestamptz not null default now()
);

create index if not exists analytics_sessions_visitor_id_idx
  on public.analytics_sessions (visitor_id);

create index if not exists analytics_sessions_started_at_idx
  on public.analytics_sessions (started_at desc);

alter table public.analytics_events enable row level security;
alter table public.analytics_sessions enable row level security;

revoke all on public.analytics_events from anon, authenticated;
revoke all on public.analytics_sessions from anon, authenticated;
