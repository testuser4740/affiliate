"use client";
import { useEffect, useRef } from "react";
import { API_BASE_URL } from "@/lib/api";

export type LiveEventType =
  | "leaderboard"
  | "orders"
  | "commission"
  | "ambassador_created"
  | "inbox"
  | "pocs"
  | "announcements"
  | "tasks"
  | "affiliate_urls"
  | "commission_overrides"
  | "applicants"
  | "analytics"
  | "ping"
  | "connected";

export interface LiveEvent {
  type: LiveEventType;
  ambassadorId?: string;
}

/**
 * Opens a single Server-Sent Events connection to the backend's live stream.
 * The connection stays open until the component unmounts (i.e. until logout /
 * navigation away) — no polling, no repeated fetching. Every DB change the
 * server broadcasts is delivered here in real time.
 */
export function useEventStream(
  onEvent: (event: LiveEvent) => void,
  enabled: boolean = true,
): void {
  const cbRef = useRef(onEvent);
  cbRef.current = onEvent;

  useEffect(() => {
    if (!enabled) return;
    const es = new EventSource(`${API_BASE_URL}/stream`);

    es.onmessage = (msg) => {
      // Default message event (no `event:` field) — ignore; we use named events.
      if (msg.data) {
        try {
          cbRef.current({ type: "ping", ...JSON.parse(msg.data) } as LiveEvent);
        } catch {
          /* ignore */
        }
      }
    };

    const handle = (e: MessageEvent) => {
      let payload: Partial<LiveEvent> = {};
      try {
        payload = e.data ? JSON.parse(e.data) : {};
      } catch {
        /* ignore */
      }
      cbRef.current({ type: e.type as LiveEventType, ...payload } as LiveEvent);
    };

    (["leaderboard", "orders", "commission", "ambassador_created", "inbox", "pocs", "announcements", "tasks", "affiliate_urls", "commission_overrides", "applicants", "analytics", "connected", "ping"] as LiveEventType[]).forEach(
      (type) => es.addEventListener(type, handle as EventListener),
    );

    es.onerror = () => {
      // EventSource auto-reconnects; nothing to do here.
    };

    return () => {
      es.close();
    };
  }, [enabled]);
}
