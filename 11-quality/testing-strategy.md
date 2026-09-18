# 11 — Testing Strategy

## Test pyramid

```
        /   E2E Tests   \        5% (Full check-in to export cycle)
       / Integration Tests \     25% (REST API endpoints & DB queries)
      /   Invariant Tests   \    70% (Pure domain logic: delays, holidays, 4-eyes)
```

## Test suites catalog

| Suite | File | What it tests |
|---|---|---|
| Health checks | `tests/health.test.js` | Probes `/health` and `/ready` |
| Token rotation | `tests/token-rotation.test.js` | HMAC-SHA256 determinism, 15s rotation, leeway |
| Punctuality formula | `tests/punctuality-hours.test.js` | Piecewise $H(delay)$ hours computation (6h to 0h) |
| Invariants & governance | `tests/invariants-governance.test.js` | BR-01 to BR-12, 3 business days, holiday skip, 4-eyes |

## Execution commands

Run all suites in a single command:
```powershell
npm test
```

---

**Related:** [`tdd-guide.md`](./tdd-guide.md) · [`../04-requirements/traceability-matrix.md`](../04-requirements/traceability-matrix.md)
