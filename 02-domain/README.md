# 02 — Domain

## Purpose

This section models the core business domain of academic attendance, maps bounded
contexts, defines domain entities, and establishes the 12 business invariants (BR-01 to BR-12).

## Documents

| Document | Answers | Priority |
|---|---|---|
| [domain-map.md](./domain-map.md) | How are bounded contexts delineated and connected? | ⭐ |
| [entities-and-rules.md](./entities-and-rules.md) | What are the entities, invariants, and business rules? | ⭐ |
| [module-boundaries.md](./module-boundaries.md) | Which module owns which entity and table? | ⭐ |

## Domain highlights

1. **Deterministic Punctuality Formula:** Exact mathematical piecewise function $H(delay)$.
2. **Statutory 3-Business-Day Deadline:** Calibrated to `America/Bogota` and official holidays.
3. **Four-Eyes Governance:** Concurrency-safe, non-self-approvable dual authorization.
4. **Anti-Fraud Protections:** Dynamic HMAC QR codes with network latency tolerance.

## Review gate criteria

- All entities map directly to persisted database tables in section 06.
- Every business rule is numbered (BR-01 to BR-12) and verifiable via tests.

---

**Related:** [`../01-context/glossary.md`](../01-context/glossary.md) · [`entities-and-rules.md`](./entities-and-rules.md)
