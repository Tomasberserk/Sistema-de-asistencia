# 05 — Architectural Decision Records (ADRs)

This folder contains the permanent record of architectural decisions adopted in this project.
Every decision follows a standardized structure outlining context, options, decision, and consequences.

## Accepted records

| ADR | Title | Status | Date |
|---|---|---|---|
| [ADR-001](./records/ADR-001-modular-monolith-as-default.md) | Modular Monolith as default architecture | Accepted | 2026-07-25 |
| [ADR-002](./records/ADR-002-rotating-qr-hmac.md) | Rotating QR code with HMAC-SHA256 and leeway | Accepted | 2026-08-10 |
| [ADR-003](./records/ADR-003-anti-overengineering-facial-ip.md) | Elimination of facial AI and rigid IP blocking | Accepted | 2026-08-22 |

## Lifecycle states

- **Draft:** Proposed decision undergoing technical review.
- **Accepted:** Approved decision actively enforced across the codebase.
- **Superseded:** Historical decision replaced by a newer accepted record.

## Template

Use [`./_template-adr.md`](./_template-adr.md) when proposing a new architectural change.

---

**Related:** [`../modular-monolith.md`](../modular-monolith.md) · [`_template-adr.md`](./_template-adr.md)
