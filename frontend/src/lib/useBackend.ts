"use client";
import { useEffect, useState } from "react";
import { backend } from "./apiHooks";
import { useEventStream, LiveEventType } from "@/hooks/useEventStream";

// Loads live data from the backend and falls back to the provided mock value
// if the request fails or the API is not running. Keeps the app usable in demo mode.
export function useBackend<T>(
  loader: () => Promise<T>,
  fallback: T,
  deps: unknown[] = [],
  liveEvents?: LiveEventType[],
): T {
  const [data, setData] = useState<T>(fallback);
  const [tick, setTick] = useState(0);

  const load = () => {
    loader()
      .then((res) => {
        if (res !== undefined && res !== null) setData(res);
      })
      .catch(() => {
        /* keep fallback (mock data) */
      });
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  // Open a single live SSE connection; re-fetch whenever a relevant event arrives.
  useEventStream((event) => {
    if (liveEvents && liveEvents.includes(event.type)) {
      setTick((t) => t + 1);
    }
  }, Boolean(liveEvents));

  return data;
}
