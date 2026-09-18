# 09 — Module Data Model

**Module:** [Module Name]

## Owned tables

| Table | Primary Key | Foreign Keys | Key Attributes |
|---|---|---|---|
| `example_table` | `id TEXT` | `parent_id TEXT` | `name`, `status`, `created_at` |

## Invariants and constraints

1. Foreign keys must refer to existing entities in the database.
2. Status values must belong to an enumerated domain set.
3. Soft deactivation is required before any physical record cleanup.
4. Timestamps are stored in ISO 8601 UTC format.
5. Queries must use parameterized placeholders to prevent SQL injection.

## Migration history

- Migrations affecting this table are managed sequentially in `backend/src/db.js`.

---

**Related:** [`README.md`](./README.md) · [`../../06-data/models.md`](../../06-data/models.md)
