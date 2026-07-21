---
name: testing
description: Create unit, repository, service, and controller tests with mocked repositories
---

# Testing Skill

Add tests across layers.

## Rules
- Place tests under `src/tests/` mirroring the module structure.
- Unit: pure functions / DTO validation.
- Repository: use a test DB or `TypeORM` in-memory / transactions rolled back.
- Service: mock repositories (no DB) to isolate business logic.
- Controller: use `supertest` against the app with mocked services.
- Aim for business-rule coverage (commission calc, approval flow, leaderboard).

## Checklist
- [ ] Unit tests for DTOs/utils
- [ ] Service tests with mocked repos
- [ ] Controller tests via supertest
- [ ] Repository/integration tests
