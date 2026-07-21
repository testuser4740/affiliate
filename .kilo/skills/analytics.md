---
name: analytics
description: Build reports, KPIs, leaderboards, and aggregated queries via repositories
---

# Analytics Skill

Build reporting and aggregation features.

## Rules
- Put aggregated/optimized SQL in dedicated repositories (`AnalyticsRepository`, `LeaderboardRepository`, `CommissionRepository`).
- Expose KPIs: dashboard metrics, monthly reports, conversion rate, active ambassadors, revenue, top performers.
- Leaderboard: `findTopPerformers()`, `getLeaderboard()` with ranking.
- Return DTOs (not raw rows) shaped for charts/tables.
- Keep analytics read-only; never mutate in analytics services without a transaction.

## Checklist
- [ ] Aggregation in repository
- [ ] KPI DTOs defined
- [ ] Leaderboard ranking implemented
- [ ] Read-only by default
