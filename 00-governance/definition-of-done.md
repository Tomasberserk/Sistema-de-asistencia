# 00 — Definition of Done

A user story is considered complete when every condition below is fulfilled.

## Checklist

| # | Criterion | How it is verified |
|---|---|---|
| 1 | Code implements all acceptance criteria and domain invariants | Pure domain functions verify BR-01 to BR-12 |
| 2 | Automated unit and integration tests pass cleanly | `npm test` exits with code 0 in local and CI environments |
| 3 | Invariant test suite covers all boundary conditions | Verified for 15:00 vs 15:01, holiday skips, and self-approval |
| 4 | Public API contracts strictly followed | Validated against [`../07-api/rest-conventions.md`](../07-api/rest-conventions.md) |
| 5 | Database migrations execute idempotently | Verified on SQLite and PostgreSQL without manual schema edits |
| 6 | Observability format followed | Structured audit logs written to `audit_logs` table |
| 7 | Documentation updated in the same pull request | SDD markdown files updated matching the implementation |
| 8 | Code review approved by peer developer | At least one peer review approval before merge to `main` |

## Quality thresholds

- **Core domain line coverage:** 90% minimum on `attendance` and `sessions` modules.
- **Changed files line coverage:** 80% minimum across all application layers.
- **Audit integrity:** Zero unhandled 500 errors on invalid client inputs.

---

**Related:** [`definition-of-ready.md`](./definition-of-ready.md) · [`README.md`](./README.md)
