# 06 — Models

## Relational tables schema

| Table | Owning Module | Key Columns |
|---|---|---|
| `institutions` | `academic` | `id` (PK), `code`, `name`, `theme`, `active` |
| `academic_units` | `academic` | `id` (PK), `code`, `name`, `jornada`, `status`, `active` |
| `people` | `identity` | `id` (PK), `documento`, `email`, `nombre`, `password`, `roles`, `active` |
| `enrollments` | `academic` | `id` (PK), `institution_id`, `unit_id`, `person_id`, `active` |
| `attendance_sessions` | `sessions` | `id` (PK), `unit_id`, `status`, `qr_token`, `validation_mode`, `creator_ip` |
| `attendance_records` | `attendance` | `id` (PK), `session_id`, `person_id`, `documento`, `horas_validadas`, `status` |
| `excuses` | `excuses` | `id` (PK), `session_id`, `person_id`, `text`, `file_name`, `status` |
| `late_requests` | `attendance` | `id` (PK), `session_id`, `documento`, `justification`, `status` |
| `holidays` | `excuses` | `date` (PK), `name`, `active` |
| `deletion_requests` | `governance` | `id` (PK), `entity_type`, `entity_id`, `requested_by`, `approved_by`, `status` |
| `audit_logs` | `governance` | `id` (PK), `actor_id`, `action`, `entity_type`, `entity_id`, `created_at` |

## Indices

- `people(institution_id, documento)` UNIQUE
- `enrollments(unit_id, person_id)` UNIQUE
- `holidays(date)` UNIQUE PRIMARY KEY
- `attendance_records(session_id, person_id)` UNIQUE per session

---

**Related:** [`database-conventions.md`](./database-conventions.md) · [`migrations.md`](./migrations.md)
