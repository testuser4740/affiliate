---
name: controller-generator
description: Generate a routing-controllers REST controller wired to a service with DTO mapping and validation
---

# Controller Generator

Generate a `routing-controllers` REST controller.

## When to use
To expose a service as HTTP endpoints.

## Rules
- Place under `src/controllers/<role>/<name>.ts` (role: `admin`, `ambassador`, or root for public).
- Use `@JsonController()`, `@Get`, `@Post`, `@Put`, `@Patch`, `@Delete`.
- Controller does ONLY: receive request → validate DTO → call service → return response.
- Inject the service via TypeDI constructor injection. Do NOT query repositories or write SQL here.
- Validate bodies with `@Body()` + DTOs decorated by `class-validator`.
- Add Swagger decorators (`@OpenAPI` / `routing-controllers-openapi`) to every endpoint.
- Return consistent response shapes (see `api-style` skill). Never return entities directly.

## Checklist
- [ ] @JsonController with base route
- [ ] Endpoints map to service methods
- [ ] Request bodies validated via DTO
- [ ] Service injected, no direct repository access
- [ ] Swagger docs on each endpoint
- [ ] Registered in `src/routing.ts` (if not auto-scanned)
