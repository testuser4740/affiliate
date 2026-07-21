---
name: filtering
description: Implement consistent query filtering and searching in repositories
---

# Filtering Skill

Standardize filtering/searching.

## Rules
- Use a `XFilterDto` for filter params; map to `QueryBuilder` `where` clauses in repositories.
- Support exact match, range (`from`/`to`), `in` lists, and free-text `search`.
- Compose conditions with `andWhere`/`orWhere`; never concatenate raw user input into SQL.
- Combine filtering with pagination.

## Checklist
- [ ] FilterDto defined
- [ ] QueryBuilder-based conditions
- [ ] No string-concatenated SQL
- [ ] Works with pagination
