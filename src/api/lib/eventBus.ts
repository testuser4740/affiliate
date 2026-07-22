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

type Listener = (event: unknown) => void;

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

export type StreamConnection = {
  ambassadorId?: string;
  listener: Listener;
};

export type ConnectionManager = {
  add(connection: StreamConnection): () => void;
  forAmbassador(ambassadorId: string): Listener[];
  all(): Listener[];
};

export const connectionManager: ConnectionManager = {
  add(connection) {
    const connections: StreamConnection[] = (connectionManager as any).__connections ||= [];
    connections.push(connection);
    return () => {
      const idx = connections.indexOf(connection);
      if (idx >= 0) connections.splice(idx, 1);
    };
  },
  forAmbassador(ambassadorId: string) {
    const connections: StreamConnection[] = (connectionManager as any).__connections || [];
    return connections.filter((c) => c.ambassadorId === ambassadorId).map((c) => c.listener);
  },
  all() {
    const connections: StreamConnection[] = (connectionManager as any).__connections || [];
    return connections.map((c) => c.listener);
  },
};
