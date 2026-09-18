# 02 — Entities and Rules

## Entities

| Entity | Key attributes | Invariants |
|---|---|---|
| Person | id, institution_id, documento, email, nombre, roles, active | Documento unique per institution; password length >= 6 |
| AcademicUnit | id, institution_id, code, name, jornada, status, active | Code unique per institution; status in [ACTIVE, PENDING_DELETION, DELETED] |
| AttendanceSession | id, unit_id, status, qr_token, room_created_at, validation_mode | validation_mode in [QR_ONLY, IP_ONLY, IP_AND_QR]; never NONE |
| AttendanceRecord | id, session_id, person_id, documento, horas_validadas, status | One record per apprentice per session; horas_validadas in [0..6] |
| Excuse | id, session_id, person_id, text, file_name, status, created_at | Max 1 excuse per apprentice per session; status in [pending, approved, rejected] |
| Holiday | date, name, active | Date is unique primary key formatted YYYY-MM-DD |
| DeletionRequest | id, entity_type, entity_id, requested_by, approved_by, status | requested_by != approved_by; status in [PENDING_APPROVAL, APPROVED, REJECTED] |
| AuditLog | id, actor_id, action, entity_type, entity_id, created_at | Immutable append-only record; never updated or deleted |

## Business rules

1. **BR-01 (Enrollment):** Only active apprentices enrolled in an active Ficha can register attendance.
2. **BR-02 (Punctuality Formula):** Training hours are computed deterministically via $H(delay)$:
   - $delay le 15	ext{ min} implies 6	ext{h}$ assisted, $0	ext{h}$ delay (REGULAR)
   - $16	ext{ min} le delay le 60	ext{ min} implies 5	ext{h}$ assisted, $1	ext{h}$ delay (RETARDO_BLOQUE_1)
   - $61	ext{ min} le delay le 120	ext{ min} implies 4	ext{h}$ assisted, $2	ext{h}$ delay (RETARDO_BLOQUE_2)
   - $121	ext{ min} le delay le 180	ext{ min} implies 3	ext{h}$ assisted, $3	ext{h}$ delay (RETARDO_BLOQUE_3)
   - $181	ext{ min} le delay le 240	ext{ min} implies 2	ext{h}$ assisted, $4	ext{h}$ delay (RETARDO_BLOQUE_4)
   - $241	ext{ min} le delay le 300	ext{ min} implies 1	ext{h}$ assisted, $5	ext{h}$ delay (RETARDO_BLOQUE_5)
   - $delay > 300	ext{ min} implies 0	ext{h}$ assisted, $6	ext{h}$ delay (RETARDO_BLOQUE_6)
3. **BR-03 (QR Rotation):** QR tokens rotate every 15s via HMAC-SHA256 with 1-slot leeway.
4. **BR-04 (No Duplicate Check-in):** An apprentice can check in at most once per session.
5. **BR-05 (Validation Mode):** A room cannot be opened with both QR and IP validation disabled.
6. **BR-06 (Room Expiration):** Regular check-in closes after 15 minutes; subsequent entries require manual override or late request.
7. **BR-07 (Statutory Excuse Deadline):** Excuses must be submitted by 23:59:59 America/Bogota of the 3rd business day following session date (skipping weekends and Colombian holidays).
8. **BR-08 (Four-Eyes Principle):** Ficha deletion requires two distinct coordinators (requester != approver). Self-approval is rejected with HTTP 403.
9. **BR-09 (Excuse Resolution):** Approved excuses update attendance to PRESENTE and restore 6 hours.
10. **BR-10 (Password Safety):** User passwords must be >= 6 characters; blank edit inputs preserve existing hash.
11. **BR-11 (Habeas Data):** Account deletion anonymizes personal identifiers while preserving academic attendance statistics.
12. **BR-12 (Audit Logging):** All administrative actions emit an immutable structured log in `audit_logs`.

---

**Related:** [`domain-map.md`](./domain-map.md) · [`module-boundaries.md`](./module-boundaries.md)
