# 01 — Scope

## In scope

| Capability | Note |
|---|---|
| Rotating HMAC QR check-in | 15-second dynamic tokens with 1-slot leeway to absorb network latency |
| Contingency manual code | 6-character room code when apprentice camera or focus fails |
| Fractional attendance algorithm | Proportional hours recognition (6h, 5h, 4h, 3h, 2h, 1h, 0h) |
| 3-business-day excuse filing | Strict deadline calculated skipping weekends and official Colombian holidays |
| Two-person deletion rule | Ficha deletion requires Coordinator A request and Coordinator B approval |
| Excel & PDF reporting | Consolidated attendance sheets for institutional audit |
| Habeas data suppression | Personal data anonymization while preserving attendance statistics |

## Out of scope

| Capability | Why it is excluded |
|---|---|
| Client-side facial AI | Excluded per ADR-003: heavy neural nets crash low-end phones and fail in classroom light |
| Rigid IP subnet blocking | Excluded per ADR-003: apprentices frequently use mobile data (4G/5G) |
| Physical biometric hardware | Classroom solution relies on ubiquitous personal smartphone web browsers |
| Microservices architecture | Single deployable monolith avoids distributed transaction overhead |

---

**Related:** [`overview.md`](./overview.md) · [`../02-domain/entities-and-rules.md`](../02-domain/entities-and-rules.md)
