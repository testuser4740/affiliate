"use client";
import { useEffect, useState } from "react";
import { backend } from "./apiHooks";
import { useEventStream, LiveEventType } from "@/hooks/useEventStream";

export function useBackend<T>(
  loader: () => Promise<T>,
  fallback: T,
  deps: unknown[] = [],
  liveEvents?: LiveEventType[],
  ambassadorId?: string,
): T & { _loading?: boolean } {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  const load = () => {
    setLoading(true);
    loader()
      .then((res) => {
        if (res !== undefined && res !== null) setData(res);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [...deps, tick]);

  useEventStream((event) => {
    if (liveEvents && liveEvents.includes(event.type)) {
      setTick((t) => t + 1);
    }
  }, Boolean(liveEvents), ambassadorId);

  if (Array.isArray(data)) {
    (data as any)._loading = loading;
  } else if (data && typeof data === "object") {
    (data as any)._loading = loading;
  }

  return data as T & { _loading?: boolean };
}
