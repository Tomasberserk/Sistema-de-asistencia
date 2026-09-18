# 00 — Definition of Ready

A user story cannot enter sprint planning until every criterion below is verified.

## Checklist

| # | Criterion | How it is verified |
|---|---|---|
| 1 | Story has a single testable set of acceptance criteria | Written as Given/When/Then matching BR-01 to BR-12 |
| 2 | Story fits within a single development week | Estimated at <= 8 story points in planning poker |
| 3 | Domain entity dependencies are mapped | Verified against [`../02-domain/domain-map.md`](../02-domain/domain-map.md) |
| 4 | Affected modules are explicitly declared | Verified against [`../09-modules/module-catalog.md`](../09-modules/module-catalog.md) |
| 5 | UI/UX screen design tokens are attached | Verified against [`../12-ux-ui/design-system.md`](../12-ux-ui/design-system.md) |
| 6 | Zero unclarified business logic ambiguities | Timezone, working days, and delay formulas locked |
| 7 | Aligned with anti-overengineering policy | Verified exclusion of browser facial AI and strict IP locking |

## What Ready is not

Ready does not mean writing implementation code ahead of time. It means the
assigned engineer can immediately implement the domain invariants and tests
without stopping to ask stakeholders what the requirement actually intended.

---

**Related:** [`definition-of-done.md`](./definition-of-done.md) · [`README.md`](./README.md)
