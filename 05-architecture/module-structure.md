# 05 — Module Structure

## Code tree layout

```
sena-attendance-system/
├── backend/
│   ├── src/
│   │   ├── server.js          # Express app, static serving, route registry
│   │   ├── controllers.js     # Presentation & domain services
│   │   ├── db.js              # Persistence adapter, schema & migrations
│   │   └── auth.js            # JWT verification & password security
│   └── tests/
│       ├── run-all.js                 # Test runner entrypoint
│       ├── health.test.js             # Probe endpoints
│       ├── token-rotation.test.js     # HMAC QR determinism & leeway
│       ├── punctuality-hours.test.js  # H(delay) attendance formula
│       └── invariants-governance.test.js # BR-01 to BR-12 invariants
├── frontend/
│   ├── index.html             # Single Page Application layout
│   ├── app.js                 # SPA logic, state management, UI rendering
│   └── offline-queue.js       # IndexedDB offline sync adapter
└── database/
    ├── schema.sql             # Canonical SQL schema
    └── seeds.sql              # Default development data
```

---

**Related:** [`modular-monolith.md`](./modular-monolith.md) · [`boundary-enforcement.md`](./boundary-enforcement.md)
