---
name: optimize
description: Optimize queries, N+1 issues, and performance while keeping the architecture
---

# Prompt: Optimize

Find and fix performance issues.

## Usage
`/optimize <target>` — file, module, or "queries"

## Focus areas
- N+1 queries: replace loops of `findById` with joins / `In()` / `relations`.
- Missing indexes on filtered/sorted columns (add via migration).
- Pagination on large tables (avoid unbounded `find()`).
- Redundant queries: cache counts, batch fetches.
- Use `select` to fetch only needed columns.

## Rules
- Keep logic in correct layers (repo for SQL, service for orchestration).
- Measure before/after; prefer `explain` on slow queries.
- Add migrations for new indexes.

## Output
List findings with impact + applied fix + verification.
