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

type Listener = (event: LiveEvent) => void;

class SharedEventSource {
  private connections = new Map<string, { es: EventSource; refCount: number; listeners: Set<Listener> }>();

  subscribe(listener: Listener, ambassadorId?: string): () => void {
    const key = ambassadorId ?? "__admin__";
    let entry = this.connections.get(key);
    if (!entry) {
      const url = ambassadorId
        ? `${API_BASE_URL}/stream?ambassadorId=${encodeURIComponent(ambassadorId)}`
        : `${API_BASE_URL}/stream`;
      const es = new EventSource(url);
      entry = { es, refCount: 0, listeners: new Set() };
      this.connections.set(key, entry);

      es.onmessage = (msg) => {
        if (msg.data) {
          try {
            const event: LiveEvent = { type: "ping", ...JSON.parse(msg.data) };
            entry!.listeners.forEach(l => l(event));
          } catch { /* ignore */ }
        }
      };

      const handle = (e: MessageEvent) => {
        let payload: Partial<LiveEvent> = {};
        try { payload = e.data ? JSON.parse(e.data) : {}; } catch { /* ignore */ }
        const event = { type: e.type as LiveEventType, ...payload } as LiveEvent;
        entry!.listeners.forEach(l => l(event));
      };

      const eventTypes: LiveEventType[] = ["leaderboard", "orders", "commission", "ambassador_created", "inbox", "pocs", "announcements", "tasks", "affiliate_urls", "commission_overrides", "applicants", "analytics", "connected", "ping"];
      eventTypes.forEach(type => es.addEventListener(type, handle as EventListener));
      es.onerror = () => {};
    }

    entry.refCount++;
    entry.listeners.add(listener);

    return () => {
      const e = this.connections.get(key);
      if (!e) return;
      e.listeners.delete(listener);
      e.refCount--;
      if (e.refCount <= 0) {
        e.es.close();
        this.connections.delete(key);
      }
    };
  }
}

const sharedEventSource = new SharedEventSource();

export function useEventStream(
  onEvent: (event: LiveEvent) => void,
  enabled: boolean = true,
  ambassadorId?: string,
): void {
  const cbRef = useRef(onEvent);
  cbRef.current = onEvent;

  useEffect(() => {
    if (!enabled) return;

    const listener: Listener = (event) => cbRef.current(event);
    const unsub = sharedEventSource.subscribe(listener, ambassadorId);

    return unsub;
  }, [enabled, ambassadorId]);
}
