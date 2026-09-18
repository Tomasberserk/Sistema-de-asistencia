# 02 — Domain Map

## Bounded contexts

```mermaid
graph TD
    Identity["Identity & Access<br/>people, credentials, roles"]
    Academic["Academic Management<br/>institutions, academic_units, enrollments"]
    Sessions["Classroom Sessions<br/>attendance_sessions, room_lifecycle"]
    Attendance["Attendance Core<br/>attendance_records, delay_calculation"]
    Excuses["Excuses & Holidays<br/>excuses, holidays, working_days"]
    Governance["Governance & Audit<br/>deletion_requests, audit_logs"]

    Sessions -->|reads ficha and instructor from| Academic
    Attendance -->|validates active session with| Sessions
    Attendance -->|verifies apprentice enrollment with| Academic
    Excuses -->|links to session and apprentice via| Attendance
    Excuses -->|evaluates business days using| Academic
    Governance -->|protects deletions on| Academic
    Governance -->|audits actions across| Identity
```

## Context relationships

| Relationship | Interaction Type |
|---|---|
| Sessions -> Academic | Synchronous read-only query to verify ficha ownership |
| Attendance -> Sessions | Validates session status is `active` and token is valid |
| Excuses -> Sessions | Reads `activated_at` to calculate 3-business-day deadline |
| Governance -> Academic | Transitions ficha to `PENDING_DELETION` and `DELETED` |

---

**Related:** [`entities-and-rules.md`](./entities-and-rules.md) · [`module-boundaries.md`](./module-boundaries.md)
