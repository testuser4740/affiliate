---
name: refactor
description: Refactor code to better follow layered architecture without changing behavior
---

# Prompt: Refactor

Improve code structure while preserving behavior.

## Usage
`/refactor <target>` — a file, directory, or "controllers-to-services"

## Methodology
1. Identify violations (logic in controllers, queries in services, duplicated code).
2. Extract business logic into `src/services/`.
3. Extract queries into repositories.
4. Introduce DTOs where entities are returned directly.
5. Add typed exceptions + consistent error responses.
6. Preserve public API and externally observable behavior.
7. Run `npm run typecheck` and existing tests.

## Rules
- Do not change public API unless explicitly approved.
- Keep behavior identical (no silent behavior changes).
- Update STRUCTURE.md if architecture changes.

## Output
Before/after summary per changed file + verification status.
