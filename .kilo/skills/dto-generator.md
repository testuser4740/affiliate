---
name: dto-generator
description: Generate Create, Update, Filter, and Response DTOs with class-validator rules
---

# DTO Generator

Generate data-transfer objects for a module.

## When to use
Whenever a controller needs to accept or return structured data.

## Rules
- Place under `src/dto/<module>/<name>.ts`.
- Four DTO kinds per module: `CreateXDto`, `UpdateXDto`, `XResponseDto`, `XFilterDto` (and optionally `XSearchDto`).
- Use `class-validator` (`@IsString`, `@IsEmail`, `@IsOptional`, `@IsUUID`, `@Min`, `@Max`, etc.).
- Use `class-transformer` (`@Type`, `@Exclude`, `@Expose`) for conversion.
- `UpdateXDto` fields are `@IsOptional()`.
- `XResponseDto` must NOT expose internal columns (passwords, secrets, raw foreign keys unless needed).
- Map entities → Response DTO inside services (never return entities).

## Checklist
- [ ] CreateXDto with required validators
- [ ] UpdateXDto with optional fields
- [ ] XResponseDto safe projection
- [ ] XFilterDto for query params
