# 06 — Database Conventions

## Naming and type standards

| Element | Convention | Example |
|---|---|---|
| Tables | Lowercase plural snake_case | `attendance_sessions`, `audit_logs` |
| Primary keys | Text identifiers with semantic prefix | `sala_1710000000`, `exc_1710000000` |
| Foreign keys | Referenced singular table name + `_id` | `session_id`, `person_id`, `unit_id` |
| Timestamps | ISO 8601 UTC strings | `2026-09-18T18:30:00.000Z` |
| Booleans | Integer flags (`0` for false, `1` for true) | `active INTEGER DEFAULT 1` |
| JSON columns | Stringified text with schema validation | `roles TEXT`, `metadata_json TEXT` |

## Data integrity and retention rules

1. **No foreign key cascade deletes:** Critical academic and attendance records must never be deleted by cascading foreign keys.
2. **Soft deactivation over physical deletes:** `active = 0` is used to archive entities while preserving historical reporting integrity.
3. **Audit immutability:** The `audit_logs` table only permits `INSERT` operations; `UPDATE` and `DELETE` are disallowed.
4. **Unique constraints:** `people(institution_id, documento)` and `enrollments(unit_id, person_id)` are uniquely enforced.
5. **Deterministic date parsing:** Date columns storing calendar days must follow strict `YYYY-MM-DD` formatting.

## Engine compatibility

All queries must run without syntax differences across SQLite3 in development and
PostgreSQL in cloud production via the unified adapter in `backend/src/db.js`.

---

**Related:** [`models.md`](./models.md) · [`migrations.md`](./migrations.md)
