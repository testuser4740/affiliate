// Lightweight in-process event hub used to broadcast live DB changes to SSE clients.
// When any ambassador-related record changes (orders, commissions, leaderboard),
// we emit an event so every connected client receives a real-time push.
import { EventEmitter } from "events";

export type LiveEvent =
  | { type: "leaderboard" }
  | { type: "orders" }
  | { type: "commission" }
  | { type: "ambassador_created"; ambassadorId: string }
  | { type: "inbox"; ambassadorId: string }
  | { type: "pocs" }
  | { type: "announcements" }
  | { type: "tasks" }
  | { type: "affiliate_urls" }
  | { type: "commission_overrides" }
  | { type: "applicants" }
  | { type: "analytics" };

class EventBus extends EventEmitter {
  constructor() {
    super();
    // Many listeners (one per SSE connection) — raise the default limit.
    this.setMaxListeners(0);
  }

  broadcast(event: LiveEvent): void {
    this.emit("live", event);
  }
}

// Singleton shared across the app process.
export const liveBus = new EventBus();
