# 04 — Traceability Matrix

This matrix maps every functional requirement to its governing business rule, non-functional
requirement, owning module, and automated verification test.

## Mapping table

| Story ID | Business Rule | NFR | Owning Module | Automated Test File |
|---|---|---|---|---|
| US-01 | BR-05, BR-06 | NFR-01 | `sessions` | `tests/invariants-governance.test.js` |
| US-02 | BR-01, BR-03 | NFR-05 | `attendance` | `tests/token-rotation.test.js` |
| US-03 | BR-03 | NFR-05 | `attendance` | `tests/token-rotation.test.js` |
| US-04 | BR-02 | NFR-06 | `attendance` | `tests/punctuality-hours.test.js` |
| US-05 | BR-07 | NFR-06 | `excuses` | `tests/invariants-governance.test.js` |
| US-06 | BR-09 | NFR-01 | `excuses` | `tests/invariants-governance.test.js` |
| US-07 | BR-08, BR-12 | NFR-04 | `governance` | `tests/invariants-governance.test.js` |
| US-08 | BR-12 | NFR-01 | `reporting` | `tests/integration.test.js` |

## Quality gate rule

A user story cannot be marked `Done` in the sprint board if its corresponding test
in the rightmost column is failing or missing.

---

**Related:** [`user-stories.md`](./user-stories.md) · [`non-functional.md`](./non-functional.md)
