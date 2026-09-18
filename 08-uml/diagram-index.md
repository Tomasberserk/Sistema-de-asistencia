# 08 — Diagram Index

## 1. Sequence: Dynamic QR Check-in Flow

```mermaid
sequenceDiagram
    autonumber
    actor A as Apprentice Mobile
    participant S as Express API
    participant D as SQLite/Postgres

    A->>S: POST /attendance/checkin {token, doc, pwd}
    S->>S: Verify HMAC token against current & previous 15s slot
    alt Token invalid or expired
        S-->>A: HTTP 400 ROOM_EXPIRED / INVALID_TOKEN
    else Token valid
        S->>S: calculateAttendanceBlocks(startTime, arrivalTime)
        S->>D: INSERT INTO attendance_records
        S-->>A: HTTP 200 {status: "accepted", horasValidadas}
    end
```

## 2. Sequence: Four-Eyes Ficha Deletion

```mermaid
sequenceDiagram
    autonumber
    actor C1 as Coordinator A
    actor C2 as Coordinator B
    participant S as Express API
    participant D as Database

    C1->>S: POST /api/coord/fichas/:id/request-deletion
    S->>D: INSERT INTO deletion_requests (status: 'PENDING_APPROVAL')
    S->>D: UPDATE academic_units SET status = 'PENDING_DELETION'
    S-->>C1: HTTP 202 Solicitud radicada

    C2->>S: POST /api/coord/deletion-requests/:id/approve
    alt C2 is same as C1 (Self-approval)
        S-->>C2: HTTP 403 SELF_APPROVAL_FORBIDDEN (BR-08)
    else Distinct Coordinator
        S->>D: UPDATE deletion_requests SET status = 'APPROVED'
        S->>D: UPDATE academic_units SET active = 0, status = 'DELETED'
        S-->>C2: HTTP 200 Ficha eliminada exitosamente
    end
```

---

**Related:** [`../02-domain/entities-and-rules.md`](../02-domain/entities-and-rules.md) · [`../07-api/rest-conventions.md`](../07-api/rest-conventions.md)
