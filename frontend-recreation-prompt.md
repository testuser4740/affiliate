# Frontend Recreation Prompt (Next.js) — Reusable Template

> **How to reuse this prompt:** Sections 1–8 describe the reusable *stack, architecture, and UI conventions*. Keep those as-is for any new project. Section 9 ("Screens & Business UI Logic") is the only part that changes — replace the pages, data shapes, and interaction rules with your new domain's, and this prompt will still produce a frontend with the same structure, data-fetching pattern, and design discipline.
>
> This prompt assumes it is paired with a backend built from the companion "Backend Recreation Prompt" — a token-auth JSON REST API with `{ data, total }` list envelopes, admin vs. member role separation, and an SSE live-update stream. Adjust Section 3 if your backend differs.

---

## 1. What to Build

Build a complete **frontend-only** web application in **Next.js (App Router) + TypeScript** that consumes a separate backend REST API over HTTP — no server actions, no backend logic embedded in the frontend, no direct database access. The app serves three audiences from one codebase:
- an **admin console** (internal, role-gated),
- a **member/customer dashboard** (the authenticated end-user's own view, role-gated),
- a small set of **fully public pages** (marketing/landing, a public application/signup form, login).

Use this stack unless told otherwise:
- **Framework:** Next.js App Router (`app/` directory), React 19, client components (`"use client"`) for anything interactive — this is a client-rendered SPA-over-Next.js, not a server-components-heavy app, because everything depends on an authenticated API client and live data.
- **Styling:** Tailwind CSS with a small custom design system layered on top of **shadcn/ui** primitives (Radix UI underneath) — see Section 6.
- **Data fetching:** a thin typed API client wrapping `axios` or `fetch`, plus a single custom hook that combines "fetch on mount/dep-change" with "refetch when a relevant real-time event arrives" (see Section 4). Do not introduce a full server-state library (React Query, SWR) as the primary fetching mechanism even if it's installed — keep one consistent hand-rolled pattern so every page fetches data the same way; a query-client provider can still wrap the app for future use, but pages should not each invent their own fetching approach.
- **Forms:** `react-hook-form` + `zod` for anything with more than 2-3 fields or async validation; plain controlled `useState` for simple filter bars and search inputs.
- **Icons:** one consistent icon set (`lucide-react`).
- **Toasts/notifications:** one consistent toast library, triggered from action handlers (success and error), never silent failures.
- **Charts:** `recharts` for any trend/analytics visualizations.
- **Dates:** one date library (`dayjs` or `date-fns`) used consistently — don't mix.

---

## 2. High-Level Architecture

```
app/
  layout.tsx              -> root layout: fonts, global CSS, the single Providers wrapper
  page.tsx                -> public landing page
  login/page.tsx           -> public login
  apply/page.tsx            -> public intake/signup form (if the domain has one)
  admin/
    layout.tsx             -> admin shell: role guard + admin nav
    <resource>/page.tsx     -> one folder per admin-manageable resource
    <resource>/[id]/...      -> nested flows (e.g. a multi-step onboarding action)
  dashboard/                -> the authenticated member's own area
    layout.tsx              -> member shell: role guard + member nav
    page.tsx                -> member home/summary
    <sub-resource>/page.tsx  -> one folder per member-facing feature
src/
  lib/
    api.ts                 -> low-level HTTP client + token storage
    auth.tsx                -> AuthContext/AuthProvider + useAuth()
    apiHooks.ts              -> one `backend` object: every API call as a named typed function, plus the response type interfaces
    useBackend.ts             -> the fetch+live-refetch hook (Section 4)
    dto/                     -> input-shape types shared with the backend's DTOs, kept in sync by hand
    utils.ts                 -> `cn()` classname helper and small formatters
  hooks/
    useEventStream.ts         -> shared SSE connection manager (Section 4)
    use-toast.tsx             -> toast helper if not using a third-party one directly
  components/
    ui/                      -> shadcn/ui primitives, generated not hand-written (button, dialog, table, select, etc.)
    <Feature>.tsx              -> shared composite components used across 2+ pages (charts, progress widgets, share/copy rows, nav link, logo)
  constants/
    testIds/                  -> centralized `data-testid` string constants, one file per feature area, re-exported from an index — never inline ad-hoc test ids scattered with no naming convention
  data/
    options.ts                -> static reference lists used for dropdowns/filters (states/cities/categories/tier definitions) that mirror backend reference data
```

**Rule of thumb for where code goes:** anything that talks to the network lives in `src/lib`. Anything reusable across ≥2 pages lives in `src/components`. Anything route-specific stays inline in that route's `page.tsx`. Never let a page import another page's internals.

---

## 3. API Client & Auth

- **Base URL** comes from a public env var (e.g. `NEXT_PUBLIC_API_URL`), defaulting to a local dev backend URL.
- **Token storage:** a bearer token issued by the backend's login endpoint, persisted in `localStorage` under one namespaced key, guarded with `typeof window === "undefined"` checks so it's safe to import in code that might run during SSR/build.
- **HTTP client:** one shared instance with a request interceptor that attaches `Authorization: Bearer <token>` automatically to every call — individual API functions never handle the header themselves.
- **`ApiList<T>` envelope:** every list-returning call is typed as `{ data: T[]; total: number }`, matching the backend's list shape exactly — never assume a bare array.
- **`backend` object:** a single flat object in `apiHooks.ts` exporting every distinct API operation as a small named function (`listX`, `createX`, `updateX`, `deleteX`, `approveX`, etc.), each with explicit param types and a return type. Pages call `backend.someMethod(...)`, never construct URLs inline. This is the one place that knows every backend route.
- **Auth context:** a React context exposing `{ user, token, isAuthenticated, loading, login, logout }`. On mount, hydrate by reading the stored token and decoding its payload client-side (base64url JSON decode of the middle JWT-like segment) so the UI knows who's logged in without an extra network round-trip; if decoding fails, clear the stored token. `login()` calls the backend, stores the token, and sets user state. `logout()` clears both.
- **Route guards:** each role-specific layout (`admin/layout.tsx`, `dashboard/layout.tsx`) checks `loading` → render nothing/a blank shell while auth is hydrating; once resolved, if not authenticated or the role doesn't match this section, client-side redirect to `/login`. Never flash protected content before the check resolves — render an empty shell during `loading`.
- **Downloads:** any "export as file" action goes through one shared `downloadBlob(url, filename)` helper that requests a blob, builds an object URL, and triggers a synthetic anchor click — not opening a new tab/window.

---

## 4. Live Data Pattern

This is the most important reusable convention in the whole app: **pages don't poll, and they don't manually wire up refetching.** Instead:

1. A shared, singleton **event-stream manager** opens exactly one `EventSource` connection per distinct scope (e.g. one global admin connection, one per logged-in member id) and de-duplicates subscribers via a reference count — multiple components subscribing to the same scope share one underlying connection, and the connection closes when the last subscriber unmounts.
2. A `useEventStream(onEvent, enabled, scopeId?)` hook is the low-level subscribe primitive.
3. A `useBackend(loader, fallback, deps, liveEventTypes?, scopeId?)` hook is what pages actually use:
   - Calls `loader()` on mount and whenever `deps` change, setting a `_loading` flag on the returned data (non-enumerable-ish convenience — attached directly to the object/array so callers can do `const rows = data; const loading = data._loading`).
   - Also subscribes to the live event stream; whenever an event whose `type` is in `liveEventTypes` arrives, it bumps an internal counter that's in the effect's dependency array, triggering a silent refetch — no manual "listen for this event and setState" boilerplate per page.
   - Swallows fetch errors into the `fallback` value rather than throwing, so a flaky network doesn't crash a page — pages should still show an empty/error-appropriate state when `data` equals the fallback and loading is false.
4. Every service-layer mutation on the backend broadcasts one or more named event types after a successful save (see the backend prompt's Section "Real-time broadcasting"). The frontend's job is only to declare, per page, *which* event types should trigger a refetch of *that page's* data — e.g. a leaderboard page refetches on `leaderboard`/`orders`/`commission` events; an inbox page refetches on `inbox` events scoped to that member's id.

Apply this same `useBackend(...)` call shape to every data-loading page in the app — list pages, detail pages, and dashboard summary widgets alike — rather than inventing per-page `useEffect` + `useState` fetch logic.

---

## 5. Page/Feature Conventions

**List pages** (admin resource tables, member history views) follow one repeatable shape:
- A header with a small eyebrow label ("sticker"), a large page title, and a live count ("`{filtered.length} of {rows.length}` items").
- A filter bar: a search input (bound to local `q` state), plus a `<select>` per exact-match filter (status, category, region, etc.), all controlled and all passed into the `useBackend` loader call's args so filtering happens server-side, with an additional **client-side re-filter pass** over the already-fetched rows as a defense-in-depth/instant-feedback layer (don't wait for a network round trip to hide a row that no longer matches after a keystroke).
- A table with a sticky/tinted header row, a loading state (spinner + label) shown in place of rows while `_loading` is true, and an explicit empty state (icon + "No data found" + a hint) when the filtered result is empty — never render a bare empty `<tbody>`.
- Row click opens a **slide-over detail drawer** (fixed-position panel sliding from the right, with a dimmed backdrop that closes it on click) rather than navigating to a separate page, for anything that's primarily "view + take one of a few actions on this record."
- Every mutating action (approve/reject/create/delete) is wrapped in a `try/catch` that shows a success toast either way — real success message from the real network call, or a clearly-a-demo/optimistic fallback message if the call fails — so the UI never dead-ends silently on a broken connection during development. (Drop the fallback branch for a production build; keep the try/catch + toast pattern.)
- Any action requiring a reason/comment enforces it client-side before calling the API (disable the button or show a toast/validation message if the required field is blank) *in addition to* the backend's own validation — never rely on the backend alone to catch it, since that produces a worse error UX.

**Dashboards/summary pages** (member home, admin analytics) follow: a hero/stat-card row (`useBackend`-loaded aggregate numbers), followed by 1–2 chart components, followed by a short "recent activity" list — all independently loaded via their own `useBackend` calls so a slow chart doesn't block the stat cards from appearing.

**Multi-step flows** (e.g. converting an application into a full account) get their own nested route (`[id]/add-x/page.tsx`) rather than being crammed into a modal — anything that collects a password, multiple confirmations, or more than ~5 fields is a dedicated page, not a dialog.

**Role-scoped shells:** the admin layout and the member layout are two separate, independently-guarded components, each rendering their own persistent side/bottom navigation, each reading `useAuth()` directly. Don't share one "smart" layout that branches on role internally — keep the two shells structurally separate so each can evolve its own nav/branding without conditional spaghetti.

**Navigation:** build one small `NavLink` wrapper around the framework's link component that accepts either a plain className or a `({isActive}) => className` function, so active-state styling is declared inline at each usage site instead of duplicated per nav item.

---

## 6. Design System Conventions

- Don't hand-roll primitives — generate/install shadcn/ui components (button, dialog, drawer, table, select, tabs, dropdown-menu, toast, tooltip, avatar, card, badge, etc.) into `components/ui/` and treat that folder as generated/vendor code you extend but rarely hand-edit.
- On top of the primitives, define a **small custom component-class layer** in the global stylesheet (`@layer components`) for the recurring composite patterns specific to this product's look — a "card" style, an outline "sticker"/pill badge in 2–3 semantic color variants (info/warning/brand), a primary/accent/ghost button style, and a standard input style. Reference these utility classes (e.g. `.app-card`, `.btn-primary`, `.input-app`) from pages instead of repeating the same Tailwind utility soup in every file.
- Theme via CSS custom properties (`--background`, `--foreground`, `--primary`, `--radius`, etc.) declared once in `:root` and consumed by Tailwind's `hsl(var(--x))` color config — never hardcode the brand palette as raw hex scattered through components except for one-off accents; centralize the palette.
- Pick one distinctive display font for headings (via `next/font`, loaded once in the root layout and exposed as a CSS variable) layered over a clean system sans for body text — headings get a heavier weight and tightened letter-spacing as a dedicated `.font-display` utility.
- Every interactive element that a test suite would need to target gets a stable `data-testid`, sourced from the centralized `constants/testIds` module rather than inline string literals repeated across files — keeps renames safe and greppable.
- Mobile: every role-gated shell renders a **different nav pattern** at small breakpoints than desktop — a bottom tab bar (5–6 primary items) plus an overflow entry into a popup menu for the rest, versus a full sidebar at desktop widths — implemented with Tailwind responsive classes on the same layout tree, not a separate mobile component tree.

---

## 7. Cross-Cutting Behaviors

- **Global providers**, mounted once in the root layout: a query-client provider (even if `useBackend` is the primary fetch mechanism, keep this available for anything that benefits from it later), the toast renderer, and the auth provider — nested in a fixed, deliberate order (query → auth → anything auth-dependent).
- **Environment config:** one `.env` with the public API base URL; nothing else sensitive belongs on the client.
- **Error boundaries:** rely on Next.js's built-in route error handling for unexpected render crashes; rely on the `useBackend` fallback + explicit empty states for expected "no data yet" / "request failed" cases — don't build a third bespoke error-state mechanism per page.
- **Optimistic UX for demos:** when a backend call is expected to sometimes be unavailable (e.g. during early development against a stubbed backend), prefer "attempt the real call, fall back to a client-only success toast" over blocking the whole interaction — but always attempt the real call first, never skip straight to the fallback.

---

## 8. Naming & Small Conventions Checklist

- One `apiHooks.ts` per app; one entry per backend endpoint; group entries with a `// Section` comment matching the backend's own controller grouping (public / admin / member).
- Response-shape interfaces (`Ambassador`, `Task`, `Announcement`, etc. in the example domain) are declared once in `apiHooks.ts` next to the calls that return them, and imported everywhere else — never redeclared per page.
- Every page-level component is a default export named after the route; every shared component is a named default export with a one-line doc comment if its purpose isn't obvious from the name.
- Static reference data that mirrors backend seed/reference tables (categories, regions, tier definitions with their display colors/icons) lives in one `data/options.ts`, not duplicated inline in the pages that use it.

---

## 9. Screens & Business UI Logic — *(replace this whole section for a new domain)*

> Everything below is specific to the example domain this template was extracted from: a **campus-ambassador / affiliate referral program**, paired with the companion backend prompt's domain. Replace with your new domain's screens and rules; keep Sections 1–8 unchanged.

### 9.1 Public Screens
- **Landing page** (`/`) — marketing/overview, links to Apply and Login.
- **Apply** (`/apply`) — public multi-field application form (name, phone, optional WhatsApp, email, year, optional socials, club involvement, college, city, state); on submit calls the public "submit application" endpoint. Before/while filling it out, a duplicate-check call (by email/phone) can warn the applicant if they've already applied.
- **Login** (`/login`) — email + password, calls the auth login endpoint, stores the token, then redirects based on the returned role (`admin` → `/admin`, member role → `/dashboard`).
- **Public leaderboard** — reachable without auth, shows the ranked member list filterable by state, no sensitive fields exposed.

### 9.2 Admin Console (`/admin/*`, role = admin)
Nav sections, each its own page/table following the List Page convention in Section 5:
- **Applicants** — table with search + status/state/city filters; row click opens a detail drawer showing full application info and a duplicate-detected warning banner if flagged; three actions — Approve (no reason needed, auto-sets a fixed introductory commission rate, then **navigates to a dedicated "Add Ambassador" sub-page** to collect a password and finish onboarding — this is a multi-step flow, not a modal), Partially Approve (requires a comment), Reject (requires a reason) — reason/comment fields are validated client-side before the call fires.
- **Add Ambassador** (`/admin/applicants/[id]/add-ambassador`) — a dedicated page (not a dialog) collecting/confirming name, email, phone, college, city, state, starting commission, tier, and a password for the new login; submits to the "convert applicant" endpoint and redirects to the Directory on success.
- **Directory** — the full member list/table with tier, rank, city/state, revenue, commission columns; filter by tier/state/city, search by name/college.
- **Affiliate URLs** — table of trackable links across all members, filterable by member and channel, showing clicks/signups/orders/revenue/commission/CTR columns.
- **Tasks** — table of assignable tasks with status filter and search; create/edit a task (title, description, deadline, reward); a separate "Submissions" view for reviewing pending proof submissions (approve/reject with a reason).
- **Commission Overrides / Utilization** — table of time-boxed rate-override campaigns with a computed status badge (Scheduled/Active/Expired, styled distinctly per state); create/edit form collects label, applies-to (a tier or "All Ambassadors"), override %, and a date range; a separate view shows raw order/commission history.
- **Announcements** — table + create/edit form (title, body, audience selector — All / a tier group / specific city / specific state — plus priority); shows read-count per announcement.
- **Directory of POCs / Support** — table of internal contacts with region/role filters and a multi-select to link/unlink which members each POC supports (full-replace semantics on save, matching the backend's "set the whole list" endpoint).
- **Leaderboard (admin view)** — same ranked list as the public one but with extra internal columns, filterable by state.
- **Analytics** — a KPI stat-card row (totals for members/orders/clicks/signups/GMV/commission/paid-commission/conversion rate) plus one or two trend charts (clicks/signups/orders/revenue over time) and a raw activity-log/date-range view.
- **Reports** — a "download" action (e.g. an ambassador list export) using the shared `downloadBlob` helper.

### 9.3 Member Dashboard (`/dashboard/*`, role = member)
Shell shows the member's avatar, name, rank, and current tier in a persistent header/popup profile card (including a "Top 10" badge treatment when their rank qualifies), and a mobile bottom-tab bar for the primary 5 sections plus an overflow popup for the rest (profile, settings, help).
- **Home** — the member's own summary: profile snippet, aggregate stats (clicks/signups/orders/revenue/commission summed across their links), their affiliate URLs, and their most recent commission/order history.
- **Inbox** — list of direct messages (from/subject/preview/priority/read state), unread count surfaced as a badge in the nav; opening a message marks it read.
- **Performance** — charts of the member's own activity trend.
- **Tier** — current tier card, progress bar toward the next tier (computed from revenue vs. the tier's min/max band), and the full tier ladder with perks per tier for context.
- **Tasks** — the member's assigned tasks with status (Pending Review/Approved/Rejected + reject reason), and a submission form (proof upload/link) for open tasks.
- **Leaderboard** — same ranked list, member-facing framing (e.g. highlighting their own row).
- **Payouts** — their payout-cycle history (period, amount, status), filterable by month.
- **Announcements** — the subset of announcements targeted at them (all-audience + their tier group + their city/state), read/unread affordance.
- **Profile / Settings** — view + edit their own profile fields; a change-password action.
- **Support** — a help/contact screen (POC info or a contact form), not a full ticketing system.

### 9.4 Cross-Screen Rules Carried from the Backend
- Every rate/tier/status label shown in the UI must reflect the backend's computed values exactly (never recompute business math like commission-rate resolution or override status client-side) — the frontend displays and lets the user trigger recalculation (e.g. hitting the "tier" endpoint), it does not duplicate the resolution logic.
- Any action described in the backend prompt as a "multi-step cascade" (e.g. applicant→ambassador conversion) must correspond to exactly one frontend flow that calls exactly one backend endpoint — never split a backend-atomic operation across multiple sequential frontend calls.
- Reflect the backend's list envelope and filter parameter names exactly in `apiHooks.ts` — the frontend's filter UI options (status values, audience values, channel values) must be kept in the same fixed vocabulary the backend expects, sourced from `data/options.ts`.

---

**End of prompt.** To reuse: keep Sections 1–8 verbatim, delete everything under Section 9, and write your new domain's public/admin/member screens and cross-screen rules at the same level of detail (screen list grouped by audience → for each, its filters/actions/special flows → a short "rules carried from the backend" list ensuring no business logic gets duplicated client-side).
