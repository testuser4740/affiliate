---
name: migration-generator
description: Generate safe TypeORM schema migrations with indexes, foreign keys, and rollback support
---

# Migration Generator

Generate a TypeORM migration.

## When to use
When schema changes are needed for production (instead of relying on `synchronize: true`).

## Rules
- Generate via `npm run migration:generate` (uses `src/data-source.ts`).
- Place migrations at `src/migrations/*.ts` (directory to be created).
- Each migration must implement `up(queryRunner)` and `down(queryRunner)`.
- `down()` must cleanly reverse `up()` (drop what was created, in reverse order).
- Create indexes and foreign keys explicitly; respect existing naming.
- Never use `synchronize` in production — migrations are the source of truth there.

## Checklist
- [ ] up() applies change
- [ ] down() reverses change
- [ ] Indexes/FKs declared
- [ ] Idempotent / ordered correctly
