---
name: validation
description: Apply class-validator and class-transformer validation consistently across DTOs and services
---

# Validation Skill

Enforce request validation project-wide.

## Rules
- All controller request bodies use DTOs decorated with `class-validator`.
- Use `@IsOptional()` for partial updates; never leave required fields unvalidated.
- Use `@Type(() => Number)` / `class-transformer` for query param coercion.
- Validate in services too for internal callers (don't trust callers).
- Return 400 with structured error messages on failure (see `error-handling`).
- Reuse common validators (email, uuid, enum) — don't redefine inline.

## Checklist
- [ ] DTOs decorated
- [ ] Query params coerced
- [ ] Services re-validate untrusted input
- [ ] Errors mapped to 400 responses
