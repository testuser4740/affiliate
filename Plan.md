# Gajab Affiliate — Project Structure & AI Development Guide

TypeScript backend for the **Gajab Campus Ambassador Affiliate Program**. It manages the
complete ambassador lifecycle: applications → approval → referral tracking → affiliate links →
commission engine → tiers → leaderboards → tasks & rewards → payouts → analytics → activity →
notifications/inbox → admin dashboard.

This document is written for AI coding agents (Kilo, Claude Code, Gemini CLI, Cursor, Copilot)
so they can understand the architecture, standards, and the order in which to build features
before changing any code.

---

## Tech Stack

| Layer                | Technology                                              |
| -------------------- | ------------------------------------------------------- |
| Language             | TypeScript (Strict Mode)                                |
| Runtime              | Node.js (ts-node dev / compiled `dist` prod)            |
| Framework            | Express                                                 |
| Routing              | `routing-controllers`                                   |
| ORM                  | TypeORM                                                 |
| Database             | PostgreSQL (`pg`)                                        |
| Dependency Injection | TypeDI                                                  |
| Validation           | `class-validator`                                        |
| Transformation       | `class-transformer`                                      |
| Documentation        | Swagger / OpenAPI (`routing-controllers-openapi`)        |
| Views                | EJS                                                     |
| Package Manager      | npm                                                     |

---

## High-Level Architecture

```
                    Client
                       │
                 REST API Request
                       │
              routing-controllers
                       │
               Controller Layer
                       │
                Service Layer      ← all business logic lives here
                       │
             Repository Layer      ← all SQL / queries live here
                       │
               TypeORM Entities
                       │
             PostgreSQL Database
```

**Key rule:** Controllers never contain business logic. Repositories never contain business
logic. Business rules belong only inside **Services**.

---

## Directory Layout (Current)

The tree below reflects what actually exists today. Items marked **(planned)** are part of the
target architecture from this guide but are not yet present in the repo.

```
affiliate_project/
├── package.json            # scripts + dependencies
├── package-lock.json
├── tsconfig.json           # TS config (decorators + emitDecoratorMetadata enabled)
├── views/
│   └── dashboard.ejs       # EJS dashboard template
├── src/
│   ├── index.ts            # barrel exports of all entities + AppDataSource
│   ├── app.ts              # bootstrap: Express app + DI + Swagger + routing
│   ├── routing.ts          # routing-controllers setup / controller registration
│   ├── container.ts        # TypeDI service container configuration
│   ├── sync.ts             # one-off schema sync script
│   ├── seed.ts             # one-off seed script
│   ├── swagger-schemas.ts  # shared Swagger/OpenAPI schema helpers
│   ├── data-source.ts      # TypeORM DataSource (Postgres) + entity registry
│   ├── entities/           # TypeORM entities (one file per entity) — 15 files
│   │   ├── applicants.ts
│   │   ├── ambassadors.ts
│   │   ├── tiers.ts
│   │   ├── affiliate-urls.ts
│   │   ├── commission-overrides.ts
│   │   ├── commission-history.ts
│   │   ├── order-utilization-logs.ts
│   │   ├── referral-codes.ts
│   │   ├── activity-logs.ts
│   │   ├── tasks.ts
│   │   ├── task-submissions.ts
│   │   ├── payouts.ts
│   │   ├── announcements.ts
│   │   ├── pocs.ts
│   │   └── inbox-messages.ts
│   ├── repositories/       # custom TypeORM repository extensions
│   │   ├── announcement.repository.ts
│   │   └── applicant.repository.ts
│   ├── services/           # (empty) — reserved for business-logic services (planned)
│   ├── controllers/        # routing-controllers REST controllers (by role)
│   │   ├── base.ts                 # shared base controller / helpers
│   │   ├── apply.ts                # public ambassador application route
│   │   ├── admin/
│   │   │   ├── base.ts
│   │   │   ├── dto.ts              # admin request/response DTOs
│   │   │   ├── applicants.ts
│   │   │   ├── affiliate-urls.ts
│   │   │   ├── analytics.ts
│   │   │   ├── announcements.ts
│   │   │   ├── commission-overrides.ts
│   │   │   ├── directory.ts
│   │   │   ├── pocs.ts
│   │   │   └── tasks.ts
│   │   └── ambassador/
│   │       ├── base.ts
│   │       ├── announcements.ts
│   │       ├── home.ts
│   │       ├── inbox.ts
│   │       ├── leaderboard.ts
│   │       ├── payouts.ts
│   │       ├── tasks.ts
│   │       └── tier.ts
│   └── web/
│       └── dashboard.ts    # serves the EJS dashboard view
└── .kilo/
    ├── agents/
    │   └── code-simplifier.md
    ├── skills/
    │   ├── entity-generator.md
    │   ├── repository-generator.md
    │   ├── service-generator.md
    │   ├── controller-generator.md
    │   ├── dto-generator.md
    │   ├── migration-generator.md
    │   ├── swagger-generator.md
    │   ├── validation.md
    │   ├── error-handling.md
    │   ├── pagination.md
    │   ├── filtering.md
    │   ├── analytics.md
    │   ├── authorization.md
    │   ├── logging.md
    │   └── testing.md
    └── prompts/
        ├── create-module.md
        ├── create-crud.md
        ├── review-code.md
        ├── refactor.md
        └── optimize.md
```

### Target structure (per architecture guide — not yet created)

```
├── config/          (planned)  # env / app config
├── entities/        (exists)
├── migrations/      (planned)  # referenced by DataSource, dir not present
├── repositories/    (exists, partial)
├── services/        (exists, empty)
├── controllers/     (exists, partial — no per-module subfolders yet)
├── dto/             (planned)   # Create/Update/Filter/Response DTOs per module
├── middleware/      (planned)   # auth, error handling, etc.
├── validators/      (planned)
├── helpers/         (planned)
├── utils/           (planned)
├── constants/       (planned)
├── exceptions/      (planned)  # typed exceptions
├── interfaces/      (planned)
├── types/           (planned)
├── web/             (exists)
└── tests/           (planned)
```

---

## Data Model (Entities)

| Entity                    | Purpose                                              |
| ------------------------- | ---------------------------------------------------- |
| `Applicant`               | Pending ambassador applications                      |
| `Ambassador`              | Approved campus ambassadors                          |
| `Tier`                    | Commission tier definitions                          |
| `AffiliateUrl`            | Tracked affiliate/referral URLs                      |
| `ReferralCode`            | Per-ambassador referral codes                        |
| `CommissionOverride`      | Per-ambassador commission rate overrides             |
| `CommissionHistory`       | Recorded commission earnings                         |
| `OrderUtilizationLog`     | Logs of order/referral utilization                   |
| `ActivityLog`             | General ambassador activity history                  |
| `Task`                    | Assignable tasks for ambassadors                     |
| `TaskSubmission`          | Ambassador submissions against tasks                 |
| `Payout`                  | Commission payout records                            |
| `Announcement`            | Admin announcements to ambassadors                   |
| `Poc`                     | Points of contact (POC) records                      |
| `InboxMessage`            | Ambassador inbox messages                            |

All entities are registered in `src/data-source.ts` and re-exported from `src/index.ts`.

---

## Layer Responsibilities

### 1. Entity Layer
Database mapping only: columns, relations, indexes, constraints.
**Never:** business logic, API validation, service logic.

### 2. Repository Layer
One repository per entity. Responsibilities: queries, search, filtering, pagination, aggregate
queries, statistics, transactions.
**Never:** calculate commissions, apply business rules, send notifications.
**Suggested interface:** `findById`, `findByEmail`, `findPending`, `findApproved`, `search`,
`paginate`, `create`, `update`, `delete`, `count`, `exists`. Complex modules may add
`AnalyticsRepository` / `CommissionRepository` / `LeaderboardRepository` for optimized SQL.

### 3. Service Layer
All business logic. Responsibilities: validation, business rules, transactions, repository
coordination, event publishing, logging. **Suggested services:** `ApplicantService`,
`AmbassadorService`, `ReferralService`, `CommissionService`, `TierService`, `TaskService`,
`TaskSubmissionService`, `AnalyticsService`, `AnnouncementService`, `InboxService`,
`PayoutService`, `DashboardService`, `ActivityService`, `NotificationService`.

### 4. Controller Layer
Receive request → validate DTO → call service → return response. Nothing else.

### 5. DTO Layer
Per module: `CreateXDto`, `UpdateXDto`, `XResponseDto`, `XFilterDto`, `XSearchDto`.
Never expose entities directly.

---

## How It Works

### Bootstrap flow
1. `src/app.ts` initializes the **TypeDI** container and builds the Express app.
2. `src/routing.ts` registers all controllers with `routing-controllers`
   (entity decorators for bodies + `class-validator` validation).
3. Swagger UI is mounted (schemas from `src/swagger-schemas.ts`).
4. `src/web/dashboard.ts` serves the EJS dashboard from `views/dashboard.ejs`.

### Roles
- **Public** — `apply.ts` handles ambassador sign-up applications.
- **Admin** — applicants, URLs, analytics, announcements, commissions, directory, POCs, tasks.
- **Ambassador** — home, announcements, inbox, leaderboard, payouts, tasks, tier.

### Database
- `src/data-source.ts` defines a Postgres `DataSource` (env-configurable via `DB_*` vars,
  defaults to `localhost:5432` / `gajab_affiliate`).
- `synchronize: true` keeps the schema in sync during development.
- `migrations` are configured (`src/migrations/*.ts`) but the directory doesn't exist yet.

---

## Scripts (`package.json`)

| Command                  | Description                                |
| ------------------------ | ------------------------------------------ |
| `npm run dev`            | Run via `ts-node src/app.ts`               |
| `npm run build`          | Compile TypeScript to `dist/`              |
| `npm start`              | Run compiled `dist/app.js`                 |
| `npm run typecheck`      | `tsc --noEmit`                             |
| `npm run schema:sync`    | Run `src/sync.ts` to synchronize schema    |
| `npm run seed`           | Run `src/seed.ts` to seed data             |
| `npm run migration:generate` | Generate a TypeORM migration          |
| `npm run migration:run`  | Apply TypeORM migrations                   |

---

## Environment Variables

| Variable         | Default          | Usage                |
| ---------------- | ---------------- | -------------------- |
| `DB_HOST`        | `localhost`      | Postgres host        |
| `DB_PORT`        | `5432`           | Postgres port        |
| `DB_USERNAME`    | `postgres`       | Postgres user        |
| `DB_PASSWORD`    | `postgres`       | Postgres password    |
| `DB_NAME`        | `gajab_affiliate`| Database name        |

---

## AI Coding Rules

### DO
- ✔ Keep controllers thin
- ✔ Put logic into services
- ✔ Put SQL into repositories
- ✔ Reuse DTOs
- ✔ Use dependency injection
- ✔ Use TypeORM relations
- ✔ Validate all request bodies
- ✔ Throw typed exceptions
- ✔ Return consistent responses
- ✔ Document every endpoint + update Swagger
- ✔ Add repository methods instead of duplicate queries

### DON'T
- ❌ Write SQL inside controllers
- ❌ Access DataSource directly inside controllers
- ❌ Duplicate repository code
- ❌ Use raw queries without necessity
- ❌ Mix validation and business logic
- ❌ Return entities directly
- ❌ Ignore transactions

---

## Module Development Flow

Build every feature in this order — never skip layers:

```
Entity → Migration → Repository → DTO → Service → Controller → Swagger → Testing
```

---

## Service Responsibilities by Module

| Module         | Responsibilities                                                       |
| -------------- | ---------------------------------------------------------------------- |
| Applicant      | apply, review, approve, reject, withdraw, list, get, update, convert→Ambassador |
| Ambassador     | profile, status, referral statistics                                   |
| Referral       | validate referral code, track usage, prevent duplicates                |
| Commission     | calculate earnings, tier multiplier, override handling, history, rollback, recalc |
| Analytics      | dashboard, monthly reports, conversion rate, active ambassadors, revenue, top performers |
| Tasks          | assign, submit, review, approve, reject                                |
| Inbox          | send messages, read status, archive                                    |
| Announcement   | publish, schedule, archive                                             |
| Payout         | generate payout, export, mark paid                                     |

---

## API Endpoints

All routes are mounted under the `/api` prefix (see `src/routing.ts`, `routePrefix: "/api"`).
Grouped by tag.

### Public / Apply
| Method | Path                              | Description                                  |
| ------ | --------------------------------- | -------------------------------------------- |
| POST   | `/api/apply`                      | Submit a campus ambassador application       |
| GET    | `/api/apply/check`                | Duplicate check by `email` / `phone`         |

### Admin / Applicants
| Method | Path                              | Description                                  |
| ------ | --------------------------------- | -------------------------------------------- |
| GET    | `/api/admin/applicants`           | List applicants (filters: q, status, state, city) |
| GET    | `/api/admin/applicants/:id`       | Get applicant by id                          |
| POST   | `/api/admin/applicants`           | Create applicant                             |
| PUT    | `/api/admin/applicants/:id`       | Update applicant                             |
| DELETE | `/api/admin/applicants/:id`       | Delete applicant                             |
| POST   | `/api/admin/applicants/:id/approve`   | Approve (sets 5% default commission)     |
| POST   | `/api/admin/applicants/:id/partial`  | Partially approve (requires comment)      |
| POST   | `/api/admin/applicants/:id/reject`   | Reject (requires comment)                 |

### Admin / Affiliate URLs
| Method | Path                              | Description                                  |
| ------ | --------------------------------- | -------------------------------------------- |
| GET    | `/api/admin/affiliate-urls`       | List URLs (filters: ambassador, channel, q)  |
| GET    | `/api/admin/affiliate-urls/:id`   | Get URL by id                                |
| POST   | `/api/admin/affiliate-urls`       | Create URL                                   |
| PUT    | `/api/admin/affiliate-urls/:id`   | Update URL                                   |
| DELETE | `/api/admin/affiliate-urls/:id`   | Delete URL                                   |

### Admin / Analytics
| Method | Path                              | Description                                  |
| ------ | --------------------------------- | -------------------------------------------- |
| GET    | `/api/admin/analytics/kpis`       | KPI summary (ambassadors, orders, GMV, commission…) |
| GET    | `/api/admin/analytics/trend`      | Activity trend (ascending by date)           |
| GET    | `/api/admin/analytics/activity`   | Activity logs (date range: from, to)         |

### Admin / Announcements
| Method | Path                              | Description                                  |
| ------ | --------------------------------- | -------------------------------------------- |
| GET    | `/api/admin/announcements`        | List (filters: audience, priority)           |
| GET    | `/api/admin/announcements/:id`    | Get by id                                    |
| POST   | `/api/admin/announcements`        | Create & send announcement                   |
| PUT    | `/api/admin/announcements/:id`    | Update announcement                          |
| DELETE | `/api/admin/announcements/:id`    | Delete announcement                          |

### Admin / Commission Overrides
| Method | Path                              | Description                                  |
| ------ | --------------------------------- | -------------------------------------------- |
| GET    | `/api/admin/commission-overrides` | List boost campaigns (filters: status, q)    |
| GET    | `/api/admin/commission-overrides/:id` | Get by id                               |
| POST   | `/api/admin/commission-overrides` | Create campaign                              |
| PUT    | `/api/admin/commission-overrides/:id` | Update campaign                          |
| DELETE | `/api/admin/commission-overrides/:id` | Delete campaign                          |

### Admin / Directory (Ambassadors)
| Method | Path                              | Description                                  |
| ------ | --------------------------------- | -------------------------------------------- |
| GET    | `/api/admin/ambassadors`          | List ambassadors (filters: tier, state, city, q) |
| GET    | `/api/admin/ambassadors/:id`      | Get ambassador by id                         |
| PUT    | `/api/admin/ambassadors/:id`      | Update ambassador                            |
| GET    | `/api/admin/ambassadors/leaderboard` | Master leaderboard (ranked by revenue)    |

### Admin / Support POCs
| Method | Path                              | Description                                  |
| ------ | --------------------------------- | -------------------------------------------- |
| GET    | `/api/admin/pocs`                 | List POCs (filters: region, role, q)         |
| GET    | `/api/admin/pocs/:id`             | Get POC by id                                |
| POST   | `/api/admin/pocs`                 | Create POC                                   |
| PUT    | `/api/admin/pocs/:id`             | Update POC                                   |
| DELETE | `/api/admin/pocs/:id`             | Delete POC                                   |

### Admin / Tasks
| Method | Path                              | Description                                  |
| ------ | --------------------------------- | -------------------------------------------- |
| GET    | `/api/admin/tasks`                | List task library (filters: status, q)       |
| GET    | `/api/admin/tasks/:id`            | Get task by id                               |
| POST   | `/api/admin/tasks`                | Create task                                  |
| PUT    | `/api/admin/tasks/:id`            | Update task                                  |
| DELETE | `/api/admin/tasks/:id`            | Delete task                                  |
| POST   | `/api/admin/tasks/:id/assign`     | Assign task to ambassador (creates submission) |
| GET    | `/api/admin/tasks/submissions`    | List submissions (filter: status)            |
| POST   | `/api/admin/tasks/submissions/:submissionId/review` | Review submission (approve/reject/resubmit) |

### Ambassador / Home
| Method | Path                              | Description                                  |
| ------ | --------------------------------- | -------------------------------------------- |
| GET    | `/api/ambassador/:ambassadorId/home`     | Own dashboard (profile, KPIs, URLs, orders) |
| GET    | `/api/ambassador/:ambassadorId/profile`  | Get own profile                            |
| PUT    | `/api/ambassador/:ambassadorId/profile`  | Update own profile                         |

### Ambassador / Announcements
| Method | Path                              | Description                                  |
| ------ | --------------------------------- | -------------------------------------------- |
| GET    | `/api/ambassador/:ambassadorId/announcements` | Announcements visible to ambassador (filter: audience) |

### Ambassador / Inbox
| Method | Path                              | Description                                  |
| ------ | --------------------------------- | -------------------------------------------- |
| GET    | `/api/ambassador/:ambassadorId/inbox`        | Own inbox messages (filter: unread)     |
| GET    | `/api/ambassador/:ambassadorId/inbox/:msgId` | Get a message by id                      |
| POST   | `/api/ambassador/:ambassadorId/inbox/:msgId/read` | Mark message as read                  |

### Ambassador / Leaderboard
| Method | Path                              | Description                                  |
| ------ | --------------------------------- | -------------------------------------------- |
| GET    | `/api/ambassador/leaderboard`     | Public leaderboard (revenue ranking, filter: state) |

### Ambassador / Payouts
| Method | Path                              | Description                                  |
| ------ | --------------------------------- | -------------------------------------------- |
| GET    | `/api/ambassador/:ambassadorId/payouts` | Own payout cycles (filter: month)         |

### Ambassador / Tasks
| Method | Path                              | Description                                  |
| ------ | --------------------------------- | -------------------------------------------- |
| GET    | `/api/ambassador/:ambassadorId/tasks`            | Tasks available (filter: status)        |
| GET    | `/api/ambassador/:ambassadorId/tasks/submissions`| Own submissions                          |
| POST   | `/api/ambassador/:ambassadorId/tasks/:taskId/submit` | Submit / resubmit proof               |

### Ambassador / Tier
| Method | Path                              | Description                                  |
| ------ | --------------------------------- | -------------------------------------------- |
| GET    | `/api/ambassador/:ambassadorId/tier` | Own tier + progression to next tier         |

---

## Implementation Status (current repo vs. architecture guide)

| Area            | Status                                                        |
| --------------- | ------------------------------------------------------------- |
| Entities (15)   | ✅ Implemented                                                |
| Repositories    | 🟡 Partial — only `announcement`, `applicant`                 |
| Services        | ⚪ Empty — `src/services/` exists but unused                  |
| Controllers     | 🟡 Implemented by role, but contain logic (no service layer) |
| DTOs            | 🟡 Only `controllers/admin/dto.ts`; no shared `dto/` layer    |
| Migrations      | ⚪ Not present (configured in DataSource)                     |
| Middleware/Exceptions/Config | ⚪ Not present                                  |
| Tests           | ⚪ Not present                                                |
| `.kilo/` docs/skills | ✅ `agents/code-simplifier.md`, 15 `skills/`, 5 `prompts/` |

> **Note for AI agents:** The current controllers query repositories directly. As features
> grow, extract business logic into `src/services/*` per the flow above and have controllers
> call services instead.

---

## Suggested Repository List
`ApplicantRepository`, `AmbassadorRepository`, `TierRepository`, `AffiliateUrlRepository`,
`ReferralRepository`, `CommissionRepository`, `CommissionHistoryRepository`, `TaskRepository`,
`TaskSubmissionRepository`, `AnnouncementRepository`, `InboxRepository`, `PayoutRepository`,
`ActivityRepository`, `AnalyticsRepository`, `PocRepository`, `DashboardRepository`.

## Suggested Services
`ApplicantService`, `AmbassadorService`, `ReferralService`, `CommissionService`, `TierService`,
`TaskService`, `TaskSubmissionService`, `AnalyticsService`, `AnnouncementService`,
`InboxService`, `PayoutService`, `DashboardService`, `ActivityService`, `NotificationService`.

---

## Kilo Skill Set (target)

Generators to support the module flow: `entity-generator`, `repository-generator`,
`service-generator`, `controller-generator`, `dto-generator`, `migration-generator`,
`swagger-generator`, plus cross-cutting skills `validation`, `error-handling`, `pagination`,
`filtering`, `analytics`, `authorization`, `logging`, `testing`. Located under
`.kilo/skills/` and `.kilo/prompts/` (not yet created).
