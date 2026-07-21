---
name: review-code
description: Review changes for architecture violations, missing validation, and consistency
---

# Prompt: Review Code

Review recent code changes against the project's AI coding rules.

## Usage
`/review-code` (reviews working tree or a given file/PR diff)

## Checklist
- [ ] Controllers contain no business logic or SQL.
- [ ] Business logic lives in services only.
- [ ] SQL lives in repositories only.
- [ ] DTOs used for request/response (no raw entities returned).
- [ ] All request bodies validated (`class-validator`).
- [ ] Typed exceptions thrown, no raw stack traces leaked.
- [ ] Dependency injection used (no direct DataSource in controllers).
- [ ] Swagger updated for changed endpoints.
- [ ] Transactions used for multi-write operations.
- [ ] No duplicate repository code.

## Output
List issues by severity (blocker / warning / nit) with file:line and a suggested fix.
