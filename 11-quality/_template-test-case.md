# 11 — Test Case Template

**ID:** TC-[Number]  
**Rule under test:** [BR-NN]  
**Category:** [Unit / Invariant / Integration]  
**Author:** SENA QA Team  

## Objective
Verify that the system strictly complies with business rule [BR-NN] under boundary conditions.

## Preconditions
- Database initialized with seed institutions and users.
- Server timezone configured to `America/Bogota`.

## Test steps
1. Execute function or call endpoint with [parameters].
2. Assert response HTTP status code is [200 / 400 / 403 / 422].
3. Verify returned payload matches expected schema.

## Expected outcome
- System enforces invariant without raising unhandled 500 exceptions.

---

**Related:** [`testing-strategy.md`](./testing-strategy.md)
