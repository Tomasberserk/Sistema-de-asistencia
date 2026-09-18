# 06 — Data

## Purpose

This section defines database conventions, relational table schemas, and the dynamic
migration strategy across SQLite and PostgreSQL engines for the attendance system.

## Documents

| Document | Answers | Priority |
|---|---|---|
| [database-conventions.md](./database-conventions.md) | What naming, type, and key standards apply? | ⭐ |
| [models.md](./models.md) | What is the schema of all persistent relational tables? | ⭐ |
| [migrations.md](./migrations.md) | How are schema evolutions applied safely? | ⭐ |

## Core database principles

1. Single relational schema shared across all modules in the monolith.
2. Table names and column identifiers use strictly lowercase `snake_case`.
3. Conmutable support: 100% feature parity between local SQLite and production PostgreSQL.
4. Schema updates execute automatically during application bootstrap via `initDb`.

## Owned tables

- `institutions`, `academic_units`, `people`, `enrollments`
- `attendance_sessions`, `attendance_records`, `excuses`, `late_requests`
- `holidays`, `deletion_requests`, `audit_logs`

---

**Related:** [`../05-architecture/modular-monolith.md`](../05-architecture/modular-monolith.md) · [`models.md`](./models.md)
