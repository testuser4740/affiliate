---
name: swagger-generator
description: Automatically document requests, responses, errors, and examples with OpenAPI decorators
---

# Swagger Generator

Document endpoints with OpenAPI.

## When to use
Every time a controller endpoint is added or changed.

## Rules
- Use `routing-controllers-openapi` (`@OpenAPI`) on each route.
- Document: summary, request body (DTO schema), success response (Response DTO), and error responses.
- Reuse DTO classes so schemas stay in sync with validation.
- Keep shared schema helpers in `src/swagger-schemas.ts`.
- Serve UI via `swagger-ui-express` (already mounted in `src/app.ts`).
- Add example payloads for key endpoints.

## Checklist
- [ ] @OpenAPI on each endpoint
- [ ] Request/response schemas reference DTOs
- [ ] Error responses documented
- [ ] Examples provided for core endpoints
