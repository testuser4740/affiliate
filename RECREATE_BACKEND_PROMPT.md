# Backend Recreation Prompt (Node.js) — Reusable Template

> **How to reuse this prompt:** Sections 1–8 describe the reusable *architecture, conventions, and framework choices*. Keep those as-is for any new backend. Section 9 ("Business Domain & Logic") is the only part that changes — replace the entities, rules, and workflows in Section 9 with your new domain's entities and rules, and this prompt will still produce a backend with the same shape, quality, and conventions.

---

## 1. What to Build

Build a complete backend-only REST API service in **Node.js with TypeScript**. No frontend. The service must expose JSON APIs consumed by two different client apps (an internal admin dashboard and a end-user/member-facing app), plus one public/unauthenticated surface for anonymous visitors, and an optional server-rendered HTML page for quick internal viewing.

Use this stack unless told otherwise:
- **Language:** TypeScript, compiled with strict typing.
- **Web framework:** Express, wired through a decorator-based routing/controller library (controllers are classes, routes are decorators like `@Get`, `@Post`, request bodies are auto-validated DTront classes).
- **Dependency injection:** a lightweight DI container so services/repositories are singletons resolved by type, not manually instantiated.
- **ORM:** a TypeScript-first ORM (entity classes decorated with columns/relations, repository pattern) backed by a relational database (Postgres by default).
- **Validation:** DTO classes with declarative validation decorators (required fields, string/number/date shape, enums) — invalid requests are rejected before reaching business logic.
- **Auth:** stateless token-based auth (signed token containing user id, role, and a link to the domain-specific "member" record), not server-side sessions.
- **Real-time:** a simple in-process event emitter that broadcasts change events, consumed by a Server-Sent-Events (SSE) endpoint so connected clients get live updates without polling.
- **Logging:** structured logger (info/warn/error) injected into every service via a decorator, tagged with the originating file/module.
- **Migrations:** the ORM's migration mechanism for schema changes, plus a one-off "sync" script for fresh environments and a "seed" script that loads demo/fixture data.

---

## 2. High-Level Architecture

Organize the codebase into clearly separated layers so business logic never leaks into HTTP or database concerns:

- **Models (entities):** one class per database table. Each model declares its columns, types, defaults, indexes, and relations (one-to-many, many-to-one, many-to-many with join tables) to other models. Primary keys are usually short human-readable string codes with a defined prefix (see Section 8), not raw auto-increment numbers, except for pure log/history tables where an auto-increment integer is fine.
- **Repositories:** one thin class per model that exposes the ORM repository and any custom finder/query-builder helpers (e.g., full-text-ish filtering across a couple of columns, date-range queries). Repositories contain **no business rules** — only data access.
- **Services:** one class per business capability (not necessarily 1:1 with a model). All business logic, validation beyond basic shape, cross-entity coordination, and side effects (broadcasting events, cascading updates to related records) live here. Services depend on repositories and on each other via DI.
- **Controllers:** thin HTTP adapters. A controller method: reads path/query params and the validated body, calls exactly one (or a couple of) service methods, and returns plain data (the framework serializes it to JSON). Controllers hold no business logic — only role/route wiring and shape of the response.
- **DTOs:** one file per resource containing "Create", "Update", and any action-specific input classes with validation decorators. Never accept the raw model class as input.
- **Middlewares:** cross-cutting request handling — auth token verification, request logging, and a single centralized error handler that maps thrown errors to HTTP status codes and a consistent JSON error shape.
- **Loaders:** startup bootstrapping split into small independently-testable units — database connection, logger setup, Express app + routing-controller wiring, any startup housekeeping job (e.g., recomputing derived/expired statuses once at boot), and the public/unauthenticated router mount.
- **Errors:** a small hierarchy of typed HTTP errors (NotFound = 404, Validation = 422, Conflict = 409, Unauthorized = 401, Forbidden = 403) thrown from services and translated to responses by the error middleware — never format error JSON by hand inside a controller.

Folder shape to follow:
```
src/
  api/
    controllers/
      admin/        -> internal/admin-role-only endpoints
      <member-role>/ -> endpoints scoped to the authenticated end-user's own record
      (top-level)    -> shared/public controllers (auth, public application/intake form)
    services/
    repositories/
    models/
    middlewares/
    migrations/
    errors/
    lib/            -> auth/crypto helpers, the event bus
    web/            -> optional server-rendered view controller(s)
    dto/
  auth/             -> auth service + framework-specific authorization/current-user hooks
  loaders/
  decorators/       -> e.g. an injectable Logger decorator
  commands/         -> standalone scripts: schema sync, data seed
  env.ts / lib/env  -> typed environment variable access
```

---

## 3. Authentication & Authorization Model

- Exactly two authenticated roles plus one implicit public/anonymous caller: an **admin** role (full back-office access) and a **member** role (the primary domain actor — e.g. a customer, a participant, a partner; scoped to only their own data). Every authenticated user record stores: id, email (unique), hashed password, role, an optional foreign key to their domain-specific profile record (e.g. an ambassador/member id), and display name.
- **Password hashing:** use a salted, computationally-expensive one-way hash (scrypt or bcrypt) — store as `algorithm$salt$hash`. Never store plaintext. Verification recomputes the hash with the stored salt and does a constant-time comparison.
- **Tokens:** on login, verify email + password, then issue a compact signed token (HMAC-SHA256 over a base64url header+payload, itself base64url-encoded) containing `{ id, role, memberId, email, name }`. No expiry logic is required unless asked for. Verification recomputes the signature and constant-time-compares before trusting the payload.
- **Middleware:** a "before" middleware reads the `Authorization: Bearer <token>` header on every request, verifies it, and attaches the decoded user to the request object if valid (silently does nothing if absent/invalid — the authorization check happens separately per-route).
- **Route-level authorization:** controllers (or controller classes) are annotated with the role(s) allowed to call them. A single authorization hook checks "is there a decoded user on the request, and if the route requires specific roles, is the user's role in that list" — reject with 401 if no user, or effectively 403 behavior if the role doesn't match. Public endpoints (login, the anonymous intake/application form, a public leaderboard/listing) have no role annotation.
- **Current-user injection:** provide a helper so any controller method can request "the currently authenticated user" as a parameter instead of manually reading it off the request.

---

## 4. Standard Conventions (apply to every resource)

Follow these conventions for **every** entity/resource unless the business logic in Section 9 explicitly overrides them:

**Human-readable IDs.** Primary-facing entities (not pure logs) get a short prefixed string ID generated on insert if not supplied, e.g. `PREFIX-000123` or `prefix_<base36-timestamp>`, using a zero-padded running sequence derived from counting existing rows with that prefix, OR a timestamp-plus-random suffix when strict sequential numbering isn't required. Pure event/history/log tables (activity logs, submission logs, utilization logs) may use a plain auto-increment integer instead.

**List endpoints.** Every "list" service method accepts an optional filter object (status/category/region-type exact-match fields, plus a free-text `q` param) and returns `{ data: T[], total: number }`. Exact-match filters are applied at the query layer; the free-text filter is applied in-memory across a small set of concatenated relevant string fields (name/title/label/etc.) — case-insensitive substring match. Default ordering is meaningful per entity (e.g. newest first, highest metric first, nearest deadline first) — never unordered.

**Get-by-id.** Always throws a typed NotFound error (404) if missing — controllers never manually 404.

**Create.** Validates required fields at the service layer even though DTO validation already ran (defense in depth for anything DTO validation can't express, like "must be non-whitespace"), applies sensible defaults for optional fields (status defaults to an initial state, counters default to 0), generates the ID per the rule above, saves, and — if the entity is one clients subscribe to in real time — broadcasts a change event afterward.

**Update.** Loads the existing record (404 if missing), merges only the fields present in the input onto the existing entity (never full-overwrite/replace), re-derives any computed fields that depend on what changed (e.g. recompute a status field if start/end dates changed), saves, and broadcasts a change event if applicable.

**Delete.** Loads (404 if missing), removes, broadcasts a change event if applicable. No soft-delete unless the business logic says otherwise.

**Cross-entity cascades.** When an action on one entity should be reflected in another (a status change unlocking a follow-on record, a numeric total on entity A needing to be incremented when entity B is created), do that cascade **inside the service method that performs the primary action**, in the same transaction/request — never rely on the client to make two separate calls.

**Real-time broadcasting.** Maintain a single process-wide event emitter ("live bus"). Any service mutation that a connected client might care about calls `liveBus.broadcast({ type: "<resource-name>" [, ...minimal identifying fields] })` after a successful save. Never broadcast before the save succeeds. One SSE endpoint (per authenticated member, and/or a global one for admin) subscribes to this bus and forwards matching events to open connections; keep a simple connection registry (add/remove/list, optionally filterable by which member a connection belongs to) rather than a full pub/sub broker.

**Error shape.** All errors funnel through one centralized error-handling middleware. It returns `{ status: 0, message, ...validationErrors? }` with the correct HTTP status code; in non-production it also includes the stack trace. Controllers and services never `res.json()` an error directly — they throw.

**Logging.** Every service takes an injected logger scoped to its own filename and logs at least: successful creates/important state transitions (info) and any caught failures before rethrowing (error). Don't log at every single method — log where it aids debugging a live system (state transitions, external-looking side effects), not on trivial reads.

**Repository pattern discipline.** A service never imports the ORM directly for querying — only through its injected repository wrapper(s). Repositories may expose one or two bespoke query-builder methods for filters that are awkward as plain `find()` calls (e.g. many-to-many relation filtering, OR-across-multiple-optional-conditions searches), but keep the bespoke logic there, not duplicated in services.

---

## 5. Data Modeling Conventions

- Money/amount fields: `decimal` with fixed precision/scale (e.g. `precision: 14, scale: 2`), never floating point.
- Percentage fields: small `int` or `decimal(5,2)` depending on whether fractional percentages are needed.
- Status/enum-like fields: plain `varchar` with an application-level union type (not a DB enum) so new statuses don't require a migration — validate the allowed values in the DTO/service instead.
- Foreign keys: nullable `varchar`/matching-type column with an explicit `@Index`, plus the ORM relation decorator for eager-loadable joins when the calling code needs the related object, not just the id.
- Every entity has a `createdAt` auto-set timestamp. Add other explicit timestamp columns only when the business logic needs to reason about them (a "last activity" timestamp, a "sent on" timestamp) — don't blanket-add `updatedAt` unless asked.
- Many-to-many relations use an explicit join table named for the two sides (e.g. `parent_linked_children`), and the "owning" side's service is responsible for the "set the full list of related X for this Y" operation (replace, not append-only).

---

## 6. Cross-Cutting Startup Behavior

- On process start, run any "reconcile derived state" logic once (e.g., recompute which time-boxed records are currently Active/Scheduled/Expired based on today's date) so the database is never stale from having been offline across a date boundary. Do this in its own loader that runs after the DB connection is ready, log success/failure, and never crash the whole app if this step fails — just log the error.
- Provide two standalone CLI scripts, runnable outside the normal server boot: one that connects and synchronizes the schema (for fresh dev/environments), and one that seeds baseline/reference + demo data (reference data like tiers/plans/categories, plus a handful of realistic demo rows per entity) so the API is immediately explorable after a fresh setup.
- Environment configuration is centralized in one typed accessor (`getOsEnv`-style helper) — nothing reads `process.env` directly outside that module.

---

## 7. API Surface Shape

Group routes by audience, each as its own controller (or set of controllers) under a distinct path prefix:

- `POST /auth/login` — public. Validates credentials, returns `{ token, user }`.
- `POST /apply` (or your domain's public intake action) and a `GET /apply/check?...` duplicate-check helper — public, unauthenticated, used by outside visitors to submit an application/request that an admin will later review.
- `/admin/<resource>` — admin-only CRUD for every manageable resource, plus resource-specific action endpoints (approve/reject/convert, assign/review, etc. — see Section 9 for which ones apply to your domain).
- `/<member-role>/:memberId/<sub-resource>` — the authenticated member's own view of their data (their home/dashboard summary, their profile, their tasks/assignments, their messages, their payout history, their progression/tier status). These endpoints trust the `:memberId` path param but the route is still role-gated to the member role (and in a stricter build, additionally checks the token's own memberId matches the path param).
- One or more fully public, unauthenticated `GET` endpoints for anything meant to be shown to outsiders without login (e.g. a public leaderboard/ranking).
- One SSE endpoint for live updates.
- Optionally, one server-rendered HTML page (a single internal dashboard view) built directly against the repositories for a quick human-readable snapshot, separate from the JSON API.

---

## 8. Naming & Small Conventions Checklist

- Prefixed IDs: pick one 2–4 letter prefix per primary entity (e.g. `T-001` for tasks, `CO-001` for override/campaign records, `POC-001`, `AP-2026-0001` for year-scoped applications) and zero-pad the running sequence to a fixed width appropriate to expected volume.
- Every "list" filter object gets its own small TypeScript interface named `<Resource>Filter`.
- Percentage/rate resolution that depends on priority order (an active override beats a default beats a fallback) is written as its own single method with a comment enumerating the priority order in plain English, and is reused everywhere that rate is needed (at time of a new transaction, and when recalculating a profile's current standing) — never duplicated inline.
- Any ranking (leaderboard-style "recompute rank 1..N by metric descending") is its own method, called after any mutation that could change the ranking, and only writes rows whose rank actually changed.

---

## 9. Business Domain & Logic — *(replace this whole section for a new domain)*

> Everything below is specific to the example domain this template was extracted from: a **campus-ambassador / affiliate referral program**. Replace the entities and rules in this section with your new domain's rules; keep Sections 1–8 unchanged.

### 9.1 Core Entities

- **Applicant** — someone who submitted the public intake form. Fields: name, phone, optional WhatsApp, email, year/grade, optional social handles, club/organization involvement, college, city, state, a proposed commission percentage, applied-on date, status (`Pending` / `Approved` / `Partially Approved` / `Rejected`), a `duplicate` boolean, free-text comments. ID pattern `AP-<year>-0001`.
- **Ambassador (member)** — an approved, onboarded program member. Fields: name, college, city, state, email, phone, avatar, numeric `rank`, `commissionPct`, cumulative `revenue`, cumulative `orders` count, a link to their login user, a link to their current Tier. ID pattern `amb_<base36 timestamp>`.
- **Tier** — a reference table of revenue bands (name, min revenue, max revenue, color/icon for display, a commission-percentage label, a list of perks). Tiers are looked up by name, not hardcoded per-ambassador.
- **Commission Override** — a time-boxed campaign that temporarily changes the commission rate for a tier (or "all ambassadors"): label, "applies to" (a tier name or "All Ambassadors"), original percentage, override percentage, start date, end date, and a computed status (`Scheduled` / `Active` / `Expired`) derived purely from today's date vs. the date window. ID pattern `CO-001`.
- **Commission History** — one row per completed order/transaction attributed to an ambassador: date, product, category, an optional affiliate-URL label, ambassador link, order value, the commission percentage actually applied, the computed commission amount, an order status, and a payout status (`Pending`/`Paid`).
- **Affiliate URL** — a trackable link belonging to an ambassador: label, target URL, channel, college, running totals (clicks, signups, orders, revenue, commission, click-through-rate), last-click timestamp. ID pattern `URL-001`.
- **Referral Code** & **Order Utilization Log** — an alternate attribution mechanism: a shareable code with a discount type/value/cap and running totals (uses, GMV, commission), and one log row per time the code is redeemed on an order (order id, customer id, order value, computed discount, commission percentage and value at time of use).
- **Task** & **Task Submission** — an assignable to-do the program runs (title, description, deadline, reward amount, counts of how many members it's been assigned to / completed, status) and one submission per member-assignment (status `Pending Review` / `Approved` / `Rejected` with a reject reason, a proof/submission payload, submitted-on timestamp). ID pattern `T-001` for tasks; timestamp-based ids for submissions.
- **POC (point of contact)** — an internal contact assigned to support one or more ambassadors: name, role, region, contact details, working hours, and a many-to-many link to the ambassadors they support. ID pattern `POC-001`.
- **Announcement** — a broadcast message targeted at an audience (`All Ambassadors`, a specific tier's members, or a specific city/state), with a priority, and per-member read receipts tracked in a separate table so "has this member read this announcement" and "how many total reads" can both be queried.
- **Inbox Message** — a direct message to one specific member (from, subject, preview, body, received-on, read flag, priority). ID pattern `MSG-<...>`.
- **Payout** — a per-period payout cycle row for a member (period label, month, amount, status, date).
- **Activity Log** — a daily rollup row (date, clicks, signups, orders, revenue) used purely for trend charts.
- **User** — the login/auth record (email, password hash, role `admin`/`ambassador`, optional link to their Ambassador profile, display name).

### 9.2 Key Business Rules

**Commission rate resolution (priority order) — this is the central rule of the whole system:**
1. If there is a Commission Override whose date window includes today and whose "applies to" matches the ambassador's current tier (or is "All Ambassadors"), use that override's percentage. If multiple overrides are simultaneously eligible, the one with the most recent start date wins.
2. Otherwise, if the ambassador has never completed an order (`orders === 0`), apply a flat introductory rate (5%) regardless of tier.
3. Otherwise, apply the tier-based default rate looked up from the tier thresholds: revenue ≥ 400,000 → Platinum (15%); ≥ 150,000 → Gold (12%); ≥ 50,000 → Silver (10%); otherwise → Bronze (8%). Thresholds are evaluated highest-first and the first matching band wins.
This resolution logic must be a single reusable function, because it's called both (a) at the moment a new commission-earning order is recorded, and (b) whenever an ambassador's profile is re-synced (e.g. a "recalculate my tier" endpoint).

**Recording a new commissioned order:**
- Resolve the effective rate per the rule above using the ambassador's *current* stored profile (tier, order count).
- Compute `commission = rate% * orderValue`, save a new Commission History row with status `Placed` and payout status `Pending` (or whatever was supplied).
- Then update the ambassador's rollup: add the order value to cumulative revenue, increment order count by 1, re-resolve which Tier the *new* revenue total falls into and relink the foreign key if it changed, re-resolve and store the new effective commission percentage (so the profile always shows the rate that *will* apply next, not the rate that just applied), and finally recompute global rank (reassign ranks 1..N for all members ordered by revenue descending, only writing rows whose rank number actually changed).
- Broadcast real-time events for "orders changed", "commission changed", and "leaderboard changed" after the save succeeds.

**Marking a commission as paid:** simple status flip from whatever it was to `Paid` — no recalculation cascade.

**Commission Override status lifecycle:** status is never manually set by an admin — it's always derived from comparing today's date (date-only, ignoring time) against the start/end date window: `end < today` → `Expired`; `start ≤ today ≤ end` → `Active`; `start > today` → `Scheduled`. Recompute this for every override (a) once at process startup, so the system self-heals if it was offline across a date boundary, and (b) every time the effective-rate resolver runs, since that's the moment correctness matters most; persist the status only when it actually changed to avoid needless writes.

**Applicant review workflow:**
- `Approve`: no comment required. If the applicant doesn't already have a commission percentage set, default it to 5%.
- `Partially Approve` and `Reject`: a comment/reason is **required** — reject the action with a validation error if blank.
- Duplicate detection: when an application is first submitted, check whether any existing applicant already shares the same email or phone, and flag the new row as a duplicate (informational only — does not block submission).

**Converting an approved applicant into a full ambassador (member) — this is a multi-step onboarding cascade that must happen atomically as one operation:**
1. Refuse unless the applicant's status is exactly `Approved`.
2. Refuse if an ambassador or a login user already exists for that email (prevents double-conversion).
3. Compute the next global rank as `max(existing ranks) + 1`.
4. Look up the requested (or default "Bronze") tier record and link it.
5. Create the Ambassador row, carrying over name/college/city/state/email/phone from the applicant (any of these individually overridable at conversion time), a default avatar if none given, and the commission percentage from the applicant (or 5% fallback).
6. Create the linked login User with role `ambassador`, hashing whatever temporary/chosen password was supplied.
7. Auto-provision a default "Master Link" Affiliate URL for the new ambassador (auto-generated slug from their name, uppercased and stripped of non-letters).
8. Auto-provision a welcome Inbox Message from an admin identity to the new ambassador.
9. Delete the now-converted Applicant row (the ambassador table becomes the single source of truth going forward).
10. Broadcast "a new ambassador joined" + "leaderboard changed" + "applicants changed" events.
Every one of these side effects must fire from a single service method — never leave it to the caller to make 4 separate API calls.

**Tasks:**
- Listing supports an optional status filter and a free-text search across id+title+description, default-ordered by nearest deadline first.
- Assigning a task to a member creates a Task Submission in `Pending Review` status and increments the task's assigned-count.
- Reviewing a submission sets its status (and a reject reason if rejecting); if the reviewed status is `Approved`, additionally increment the parent task's completed-count.
- A member's own "my assigned tasks" view is a join-by-hand across their submissions and each submission's parent task, shaped into one flat list combining submission status/proof/reject-reason with the task's title/description/deadline/reward.

**Points of Contact (POC):**
- Linking a POC to ambassadors is a full-replace operation (pass the complete list of member names you want linked; the previous link set is replaced, not appended to) — resolved by looking up ambassador rows by name.
- Listing POCs supports filters by region and role, plus free-text search across name/role/region and the names of their currently-linked members.

**Announcements & targeting:**
- Audience targeting values: `All Ambassadors`, a tier-scoped audience (Gold+Platinum are grouped together as one audience value, Silver its own, Bronze its own), `Specific city`, `Specific state`.
- "Get announcements relevant to member X" means: always include `All Ambassadors` announcements, include the tier-grouped audience matching member X's current tier, include city-targeted announcements where the target city equals member X's city, and include state-targeted announcements where the target state equals member X's state — combined with OR.
- Read receipts are tracked per (announcement, member) pair so unread counts and "has member X read announcement Y" can be queried independently of the announcement's own aggregate read counter.

**Referral codes:** validating a code checks it exists and its status is `Active` before recording usage; recording usage computes a discount and a commission value from the code's stored percentage value against the order value, logs a utilization row, and increments the code's running uses/GMV/commission totals.

**Tier progression display:** given a member's revenue and the ordered list of all tiers, find the tier band the revenue currently falls in (by min ≤ revenue < max), the next tier up (the first tier whose min exceeds current revenue, or null if already at the top), and a 0–100 progress percentage toward that next tier computed as `(revenue - currentTier.min) / (currentTier.max - currentTier.min) * 100`, clamped and rounded; if there is no next tier, progress is 100.

**Dashboard/home summary for a member:** their profile (with tier joined in), their affiliate URLs, their 5 most recent commission history rows, and totals (clicks/signups/orders/revenue/commission) summed across all of their affiliate URLs.

**Analytics/KPIs (admin-facing):** total member count, total orders, totals for clicks/signups/orders/GMV pulled from the daily activity-log rollups (falling back to summed affiliate-URL revenue if the rollup is empty), total commission (summed commission-history amounts plus summed affiliate-URL commission amounts), total commission already paid out, and an overall conversion rate (orders ÷ clicks) — all computed on read, not stored.

### 9.3 Endpoints to Expose (mirrors Section 7's shape for this domain)

- `POST /auth/login`
- `POST /apply`, `GET /apply/check`
- `/admin/applicants` — list/get/create/update/delete, `/:id/approve`, `/:id/partial`, `/:id/reject`, `/:id/convert`
- `/admin/ambassadors` (or wherever ambassador CRUD lives) — list/get/create/update, leaderboard
- `/admin/tasks` — list/get/create/update/delete, `/submissions`, `/:id/assign`, `/submissions/:submissionId/review`
- `/admin/commission-overrides` — full CRUD
- `/admin/affiliate-urls`, `/admin/pocs`, `/admin/announcements` — full CRUD
- `/admin/analytics` — KPIs, trend, activity range
- `/admin/reports` — whatever export/report views are needed
- `/ambassador/:ambassadorId/home`, `/ambassador/:ambassadorId/profile` (get + update)
- `/ambassador/:ambassadorId/tier`
- `/ambassador/:ambassadorId/payouts`
- `/ambassador/:ambassadorId/tasks`
- `/ambassador/:ambassadorId/inbox`
- `/ambassador/:ambassadorId/announcements`
- `/ambassador/leaderboard` — public, unauthenticated
- an SSE stream endpoint
- an optional server-rendered `/dashboard` view

---

**End of prompt.** To reuse: keep Sections 1–8 verbatim, delete everything under Section 9, and write your new domain's entities/rules/endpoints in the same level of detail (entity list with fields and ID conventions → numbered business rules in plain English, especially any "priority order" or "multi-step cascade" logic → endpoint list grouped by audience).