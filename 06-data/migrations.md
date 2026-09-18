# 06 — Migrations

## Migration strategy

Database schema updates are applied programmatically in `backend/src/db.js` inside
the `initDb` lifecycle hook before the HTTP server binds to the listening port.

## Migration phases

| Phase | Description | Key Changes |
|---|---|---|
| Phase v1 | Base schema | Institutions, fichas, people, enrollments |
| Phase v2 | Attendance core | Sessions, attendance records, late requests |
| Phase v3 | Evidence & security | Evidence flags, creator IP tracking |
| Phase v4 | Governance & holidays | Holidays table, deletion requests, audit logs, validation modes |

## Idempotency rules

- Tables created via `CREATE TABLE IF NOT EXISTS`.
- Columns added using programmatic introspection (`PRAGMA table_info` on SQLite and `ALTER TABLE` with error suppression on PostgreSQL).
- Default seed records inserted with conflict guards.

---

**Related:** [`models.md`](./models.md) · [`../05-architecture/modular-monolith.md`](../05-architecture/modular-monolith.md)
