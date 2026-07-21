---
name: logging
description: Apply structured logging across services, repositories, and middleware
---

# Logging Skill

Standardize logging.

## Rules
- Use a single logger helper in `src/utils/` or `src/helpers/`.
- Log at service boundaries: important state changes, transactions, errors.
- Include context (entity id, user id, action) — no secrets or PII.
- Levels: error, warn, info, debug.
- Never `console.log` scattered; route through the logger.

## Checklist
- [ ] Shared logger helper
- [ ] Context-enriched logs
- [ ] No secrets/PII
- [ ] Levels used appropriately
