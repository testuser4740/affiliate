---
name: create-module
description: Scaffold a complete module across all layers following the project architecture
---

# Prompt: Create Module

Scaffold a new feature module end-to-end following the layered architecture.

## Usage
`/create-module <ModuleName>` — e.g. `/create-module Payout`

## Steps (never skip a layer)
1. **Entity** — create `src/entities/<name>.ts` (+ register in `data-source.ts` & `index.ts`).
2. **Migration** — `npm run migration:generate` for the new table.
3. **Repository** — `src/repositories/<name>.repository.ts` with CRUD + paginate + search.
4. **DTO** — `src/dto/<module>/` Create/Update/Response/Filter DTOs.
5. **Service** — `src/services/<name>.service.ts` with business logic + transactions.
6. **Controller** — `src/controllers/<role>/<name>.ts` thin, validated, Swagger-documented.
7. **Swagger** — document every endpoint.
8. **Testing** — add service + controller tests with mocked repositories.

## Rules
- Controllers call services only; services call repositories only.
- Return DTOs, not entities.
- Throw typed exceptions.
- Update STRUCTURE.md status table if new layers are introduced.

## Output
List each created file and a one-line purpose.
