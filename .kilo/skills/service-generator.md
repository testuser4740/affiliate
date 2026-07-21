---
name: service-generator
description: Generate a service with business logic, validation, transactions, and repository coordination
---

# Service Generator

Generate a business-logic service.

## When to use
To hold the business rules for a module. Services are the ONLY place business logic belongs.

## Rules
- Place at `src/services/<name>.service.ts`.
- Inject repositories via TypeDI (`@Service()` + constructor injection).
- Coordinate one or more repositories; wrap multi-step operations in transactions.
- Validate inputs (use DTOs + `class-validator`), throw typed exceptions from `src/exceptions`.
- Never access `DataSource` directly; use injected repositories.
- Never return entities directly — map to response DTOs.
- Emit/log domain events as needed.

## Suggested services
Applicant, Ambassador, Referral, Commission, Tier, Task, TaskSubmission, Analytics,
Announcement, Inbox, Payout, Dashboard, Activity, Notification.

## Example methods
- `ApplicantService`: apply, approve, reject, withdraw, listApplicants, getApplicant, updateApplicant, convertToAmbassador
- `CommissionService`: calculateCommission, applyOverride, generateHistory, rollbackCommission, recalculate

## Checklist
- [ ] @Service() decorated
- [ ] Repositories injected via constructor
- [ ] Business rules implemented
- [ ] Transactions for multi-write ops
- [ ] Typed exceptions thrown
- [ ] Returns DTOs, not entities
