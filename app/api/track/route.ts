import { NextResponse } from "next/server";

const ALLOWED_EVENTS = new Set([
  "session_started",
  "graph_interaction_started",
  "search_opened",
  "search_result_selected",
  "section_opened",
  "project_opened",
  "skill_group_opened",
  "experience_opened",
  "certification_opened",
  "about_opened",
  "hire_me_opened",
  "resume_clicked",
  "linkedin_clicked",
  "github_profile_clicked",
  "email_clicked",
  "project_live_demo_clicked",
  "project_github_clicked",
  "background_preset_changed",
]);

type TrackBody = {
  event?: unknown;
  sessionId?: unknown;
  visitorId?: unknown;
  timestamp?: unknown;
  path?: unknown;
  source?: unknown;
  deviceType?: unknown;
  referrer?: unknown;
  userAgent?: unknown;
  metadata?: unknown;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeBody(body: TrackBody, request: Request) {
  if (
    !isNonEmptyString(body.event) ||
    !ALLOWED_EVENTS.has(body.event) ||
    !isNonEmptyString(body.sessionId) ||
    !isNonEmptyString(body.visitorId) ||
    !isNonEmptyString(body.timestamp) ||
    !isNonEmptyString(body.path) ||
    body.source !== "portfolio" ||
    !isNonEmptyString(body.deviceType)
  ) {
    return null;
  }

  return {
    event: body.event,
    sessionId: body.sessionId,
    visitorId: body.visitorId,
    timestamp: body.timestamp,
    path: body.path,
    source: "portfolio",
    deviceType: body.deviceType,
    referrer:
      typeof body.referrer === "string"
        ? body.referrer
        : request.headers.get("referer"),
    userAgent:
      typeof body.userAgent === "string"
        ? body.userAgent
        : request.headers.get("user-agent"),
    metadata:
      body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)
        ? body.metadata
        : {},
    receivedAt: new Date().toISOString(),
  };
}

async function forwardEvent(payload: Record<string, unknown>) {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseServiceRoleKey) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      Prefer: "return=minimal",
    };

    const sessionPayload = {
      p_session_id: payload.sessionId,
      p_visitor_id: payload.visitorId,
      p_started_at: payload.timestamp,
      p_last_seen_at: payload.timestamp,
      p_landing_path: payload.path,
      p_referrer: payload.referrer,
      p_device_type: payload.deviceType,
      p_source: payload.source,
    };

    const eventPayload = {
      event_name: payload.event,
      session_id: payload.sessionId,
      visitor_id: payload.visitorId,
      occurred_at: payload.timestamp,
      path: payload.path,
      source: payload.source,
      device_type: payload.deviceType,
      referrer: payload.referrer,
      user_agent: payload.userAgent,
      metadata: payload.metadata,
    };

    await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/rpc/touch_analytics_session`, {
        method: "POST",
        headers,
        body: JSON.stringify(sessionPayload),
        cache: "no-store",
      }),
      fetch(`${supabaseUrl}/rest/v1/analytics_events`, {
        method: "POST",
        headers,
        body: JSON.stringify(eventPayload),
        cache: "no-store",
      }),
    ]);

    return;
  }

  const forwardUrl = process.env.ANALYTICS_FORWARD_URL;
  if (!forwardUrl) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[analytics.track]", payload);
    }
    return;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (process.env.ANALYTICS_FORWARD_TOKEN) {
    headers.Authorization = `Bearer ${process.env.ANALYTICS_FORWARD_TOKEN}`;
  }

  await fetch(forwardUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    cache: "no-store",
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TrackBody;
    const payload = normalizeBody(body, request);

    if (!payload) {
      return NextResponse.json({ ok: false, error: "Invalid analytics payload" }, { status: 400 });
    }

    await forwardEvent(payload);
    return NextResponse.json({ ok: true }, { status: 202 });
  } catch {
    return NextResponse.json({ ok: false, error: "Unable to process analytics event" }, { status: 400 });
  }
}
