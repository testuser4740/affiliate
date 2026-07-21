---
name: repository-generator
description: Generate a TypeORM custom repository with CRUD, search, pagination, filtering, and aggregations
---

# Repository Generator

Generate a custom TypeORM repository for an entity.

## When to use
After creating an entity, to centralize all database queries for it.

## Rules
- Place at `src/repositories/<name>.repository.ts`.
- Extend `Repository<Entity>` via `@EntityRepository` (or `dataSource.getRepository` pattern used in the project).
- Keep SQL/queries here only. No business rules, no notifications.
- Provide a consistent interface: `findById`, `create`, `update`, `delete`, `count`, `exists`, plus domain finders (`findPending`, `findApproved`, `findByX`).
- Implement `paginate()` and `search()` using `skip`/`take` and `SelectQueryBuilder`.
- Use transactions (`dataSource.transaction`) for multi-step writes.
- Prefer `QueryBuilder` over raw SQL; use raw SQL only when necessary.

## Repositories to provide (per architecture guide)
Applicant, Ambassador, Tier, AffiliateUrl, Referral, Commission, CommissionHistory,
Task, TaskSubmission, Announcement, Inbox, Payout, Activity, Analytics, Poc, Dashboard.

## Interface checklist
- [ ] findById(id)
- [ ] create / save
- [ ] update(id, partial)
- [ ] delete(id)
- [ ] count(criteria)
- [ ] exists(criteria)
- [ ] paginate(options)
- [ ] search(filters)
- [ ] domain-specific finders
