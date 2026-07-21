---
name: authorization
description: Enforce role-based access (admin vs ambassador vs public) on controllers
---

# Authorization Skill

Control access by role.

## Rules
- Define middleware/guards in `src/middleware/` (or a `@Authorized` role decorator via `routing-controllers`).
- Roles: `admin`, `ambassador`, `public` (no auth).
- Admin controllers require `admin`; ambassador controllers require `ambassador`.
- Resolve the current user from the JWT/session and pass via `@Req()` or DI.
- Fail closed: deny if role unknown or missing.

## Checklist
- [ ] Role guard/middleware
- [ ] Admin routes protected
- [ ] Ambassador routes protected
- [ ] Unknown role denied
