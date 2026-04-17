"use client";

export type AnalyticsEventName =
  | "session_started"
  | "graph_interaction_started"
  | "search_opened"
  | "search_result_selected"
  | "section_opened"
  | "project_opened"
  | "skill_group_opened"
  | "experience_opened"
  | "certification_opened"
  | "about_opened"
  | "hire_me_opened"
  | "resume_clicked"
  | "linkedin_clicked"
  | "github_profile_clicked"
  | "email_clicked"
  | "project_live_demo_clicked"
  | "project_github_clicked"
  | "background_preset_changed";

export type DeviceType = "mobile" | "desktop" | "tablet" | "unknown";

export interface AnalyticsPayload {
  event: AnalyticsEventName;
  sessionId: string;
  visitorId: string;
  timestamp: string;
  path: string;
  source: "portfolio";
  deviceType: DeviceType;
  referrer: string | null;
  userAgent: string | null;
  metadata: Record<string, unknown>;
}

const VISITOR_ID_KEY = "ascension-visitor-id";
const SESSION_ID_KEY = "ascension-session-id";
const SESSION_ONCE_PREFIX = "ascension-track-once:";
const TRACK_ENDPOINT = "/api/track";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function createId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getStoredId(storage: Storage, key: string): string {
  const existing = storage.getItem(key);
  if (existing) {
    return existing;
  }

  const next = createId();
  storage.setItem(key, next);
  return next;
}

export function getVisitorId(): string | null {
  if (!isBrowser()) {
    return null;
  }

  return getStoredId(window.localStorage, VISITOR_ID_KEY);
}

export function getSessionId(): string | null {
  if (!isBrowser()) {
    return null;
  }

  return getStoredId(window.sessionStorage, SESSION_ID_KEY);
}

export function getDeviceType(): DeviceType {
  if (!isBrowser()) {
    return "unknown";
  }

  const width = window.innerWidth;
  if (width <= 768) {
    return "mobile";
  }

  if (width <= 1024) {
    return "tablet";
  }

  return "desktop";
}

function buildPayload(
  event: AnalyticsEventName,
  metadata: Record<string, unknown> = {},
): AnalyticsPayload | null {
  if (!isBrowser()) {
    return null;
  }

  const sessionId = getSessionId();
  const visitorId = getVisitorId();
  if (!sessionId || !visitorId) {
    return null;
  }

  return {
    event,
    sessionId,
    visitorId,
    timestamp: new Date().toISOString(),
    path: window.location.pathname,
    source: "portfolio",
    deviceType: getDeviceType(),
    referrer: document.referrer || null,
    userAgent: navigator.userAgent || null,
    metadata,
  };
}

function postPayload(payload: AnalyticsPayload): void {
  const body = JSON.stringify(payload);

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(TRACK_ENDPOINT, blob);
      return;
    }
  } catch {
    // Fall through to fetch.
  }

  void fetch(TRACK_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    keepalive: true,
  }).catch(() => {
    // Analytics should never block the UI.
  });
}

export function track(
  event: AnalyticsEventName,
  metadata: Record<string, unknown> = {},
): void {
  const payload = buildPayload(event, metadata);
  if (!payload) {
    return;
  }

  postPayload(payload);
}

export function trackOncePerSession(
  key: string,
  event: AnalyticsEventName,
  metadata: Record<string, unknown> = {},
): void {
  if (!isBrowser()) {
    return;
  }

  const storageKey = `${SESSION_ONCE_PREFIX}${key}`;
  if (window.sessionStorage.getItem(storageKey) === "1") {
    return;
  }

  window.sessionStorage.setItem(storageKey, "1");
  track(event, metadata);
}
