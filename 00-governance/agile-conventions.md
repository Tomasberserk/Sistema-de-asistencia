# 00 — Agile Conventions

This project runs 1-week sprint cycles across a 4-week delivery roadmap for a single
deployable academic attendance application built by the SENA ADSO team.

## Ceremonies

| Ceremony | Cadence | Artifact produced |
|---|---|---|
| Backlog refinement | Weekly, 45 min | Stories move to "Ready" per [`definition-of-ready.md`](./definition-of-ready.md) |
| Sprint planning | Weekly, 1 hour | Sprint goal and committed story backlog |
| Daily standup | Daily, 15 min | Active blockers logged in task board |
| Sprint review / demo | Weekly, 45 min | Functional demo to instructor and stakeholders |
| Sprint retrospective | Weekly, 30 min | Completed [`_template-sprint-retro.md`](./_template-sprint-retro.md) |

## Estimation

- **Unit:** Story points on Fibonacci scale (1, 2, 3, 5, 8).
- **Who estimates:** The full development team via planning poker.
- **Threshold:** Stories estimated > 8 points must be split before entering a sprint.

## Board workflow

The sprint board uses 5 explicit columns:
`Backlog -> Ready -> In Progress -> In Review -> Done`.
A story cannot transition to `Done` without fulfilling the [`definition-of-done.md`](./definition-of-done.md).

---

**Related:** [`definition-of-ready.md`](./definition-of-ready.md) · [`README.md`](./README.md)
