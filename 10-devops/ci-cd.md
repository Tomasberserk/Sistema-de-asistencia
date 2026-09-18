# 10 — CI/CD Pipeline

## Pipeline stages

```
1. Dependency Install -> 2. Boundary Verification -> 3. Automated Tests -> 4. Deploy
```

## Stage details

| Stage | Command | Success criterion |
|---|---|---|
| Dependency install | `npm run install:all` | Clean install from lockfiles without warnings |
| Automated tests | `npm test` | 100% test suites pass (health, tokens, hours, invariants) |
| Boundary check | `node tests/invariants-governance.test.js` | Invariants BR-01 to BR-12 verified |
| Deployment | Git push to `main` | Automated cloud build and zero-downtime deploy |

## Quality gates

A pull request cannot merge if any invariant test in `npm test` fails, or if
untracked schema changes are detected without corresponding model documentation.

---

**Related:** [`environments.md`](./environments.md) · [`../11-quality/testing-strategy.md`](../11-quality/testing-strategy.md)
