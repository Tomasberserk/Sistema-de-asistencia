# 11 — TDD Guide

## Test-driven workflow for domain invariants

1. **Write failing invariant test:** Specify the expected input and output asserting the rule (e.g. 15:00 is 6h, 15:01 is 5h).
2. **Execute test:** Run `npm test` and confirm assertion failure.
3. **Implement pure function:** Write the minimal code in the domain module to satisfy the invariant.
4. **Refactor and verify:** Rerun `npm test` to confirm green status.

## Practical example: BR-07 Working Days

```javascript
const deadline = await calculateBusinessDaysDeadline('2026-02-06T18:00:00-05:00', 3);
assert.strictEqual(getBogotaDateString(deadline), '2026-02-11');
```

## Edge case verification

- Validate weekend skips (Friday session deadline falls on Wednesday).
- Validate holiday skips (official Colombian holidays extend deadline to Thursday).
- Validate exact cutoff at 23:59:59 America/Bogota.

## Test case documentation

Use [`./_template-test-case.md`](./_template-test-case.md) when formalizing complex QA scenarios.

---

**Related:** [`testing-strategy.md`](./testing-strategy.md) · [`../00-governance/definition-of-done.md`](../00-governance/definition-of-done.md)
