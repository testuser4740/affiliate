---
name: error-handling
description: Throw and handle typed exceptions with consistent error response shapes
---

# Error Handling Skill

Standardize errors across the API.

## Rules
- Define typed exceptions in `src/exceptions/` (e.g. `NotFoundException`, `ConflictException`, `ValidationException`, `UnauthorizedException`).
- Throw from services; let a global error middleware (`src/middleware/`) map them to HTTP responses.
- Always return a consistent JSON shape:
  ```json
  { "error": { "code": "NOT_FOUND", "message": "..." }, "status": 404 }
  ```
- Never leak stack traces or internal details to clients.
- Log full error server-side (see `logging`).

## Checklist
- [ ] Typed exceptions defined
- [ ] Global error handler maps to consistent shape
- [ ] No raw stack traces returned
- [ ] Server-side logging present
