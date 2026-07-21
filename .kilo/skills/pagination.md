---
name: pagination
description: Implement consistent pagination (page, limit, cursor) in repositories and controllers
---

# Pagination Skill

Standardize pagination.

## Rules
- Repositories expose `paginate({ page, limit, sort, order })` returning `{ data, total, page, limit }`.
- Default `limit` (e.g. 20), max `limit` cap (e.g. 100).
- Use `skip`/`take` for offset pagination, or keyset for large tables.
- Controllers accept `?page=&limit=&sort=&order=` and return the envelope.
- Document pagination params in Swagger.

## Checklist
- [ ] Repository paginate()
- [ ] Default + max limit enforced
- [ ] Consistent response envelope
- [ ] Swagger params documented
