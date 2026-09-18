# 05 — Modular Monolith

## Monolithic structure

The application packages frontend, backend API, domain logic, and persistence adapters
into a single deployable artifact executing under one Node.js process on port 4000.

```
┌────────────────────────────────────────────────────────────────────────┐
│              SENA ATTENDANCE SYSTEM (SINGLE PROCESS :4000)             │
│                                                                        │
│   Frontend SPA (Vanilla JS / Tailwind CDN)                             │
│   ├── Instructor Panel   ├── Coordinator Panel   ├── Apprentice Mobile │
│                                                                        │
│   REST API Gateway & Controllers (Express 5)                           │
│   ├── /api/auth/*        ├── /api/sessions/*     ├── /attendance/*     │
│   ├── /api/student/*     ├── /api/coord/*        ├── /reports/*        │
│                                                                        │
│   Modular Domain Layer (Pure Invariant Functions)                      │
│   ├── Punctuality H(delay)   ├── 3-Day Working Days   ├── Four-Eyes    │
│                                                                        │
│   Persistence Adapter (db.js)                                          │
│   └── Conmutable Engine: SQLite3 (Local) / PostgreSQL (Production)     │
└────────────────────────────────────────────────────────────────────────┘
```

## Key architectural benefits

1. **Zero distributed overhead:** No network latency between microservices or complex saga rollbacks.
2. **Simplified operations:** One `npm run dev` starts the entire development environment instantly.
3. **Transaction consistency:** Four-Eyes approvals and attendance updates execute within single database transactions.

---

**Related:** [`layered-architecture.md`](./layered-architecture.md) · [`module-structure.md`](./module-structure.md)
