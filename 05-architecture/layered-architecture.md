# 05 — Layered Architecture

## Layer definitions

The system strictly enforces a 4-tier layered architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Presentation Layer (HTTP Controllers & SPA Views)            │
│    - Express route handlers, input sanitization, JWT extraction  │
├─────────────────────────────────────────────────────────────────┤
│ 2. Application Layer (Use Case Orchestration)                   │
│    - Transaction boundaries, audit log generation, notifications │
├─────────────────────────────────────────────────────────────────┤
│ 3. Domain Layer (Pure Business Invariants)                      │
│    - calculateAttendanceBlocks, isWithinBusinessDays, BR-01..12  │
├─────────────────────────────────────────────────────────────────┤
│ 4. Persistence Layer (Data Access & Migrations)                 │
│    - SQL query execution, connection pooling, schema migrations  │
└─────────────────────────────────────────────────────────────────┘
```

## Layering rules

1. Requests flow downwards from Presentation to Persistence.
2. Domain functions are pure and never directly import Express `req` or `res`.
3. The Presentation layer handles HTTP status codes and error serialization.
4. The Persistence layer exposes parameterized queries preventing SQL injection.

---

**Related:** [`modular-monolith.md`](./modular-monolith.md) · [`boundary-enforcement.md`](./boundary-enforcement.md)
