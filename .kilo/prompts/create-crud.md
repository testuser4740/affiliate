---
name: create-crud
description: Generate CRUD endpoints for an existing entity following repository/service/controller pattern
---

# Prompt: Create CRUD

Generate full CRUD for an existing entity.

## Usage
`/create-crud <EntityName> <role>` — e.g. `/create-crud Announcement admin`

## Steps
1. Ensure repository has `findById`, `create`, `update`, `delete`, `paginate`, `count`.
2. Create/extend DTOs: Create, Update, Response, Filter.
3. Create service methods: get, list, create, update, delete.
4. Create controller routes: GET list, GET :id, POST, PUT/PATCH, DELETE.
5. Add Swagger decorators + error handling.
6. Add tests (service + controller).

## Rules
- Reuse existing repository/service if present; extend rather than duplicate.
- Validate all inputs; return DTOs.

## Output
List routes created with methods + paths.
