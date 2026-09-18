# 04 — User Stories

## Story catalog

| ID | Title | Role | Summary |
|---|---|---|---|
| US-01 | Open attendance room | Instructor | Configure validation mode (QR/IP) and open 15-minute room |
| US-02 | Scan QR check-in | Apprentice | Scan rotating HMAC QR code and confirm presence |
| US-03 | Fallback manual check-in | Apprentice | Type 6-char CSR code when smartphone camera fails |
| US-04 | Proportional hours computation | System | Calculate attended hours (6h to 0h) based on arrival delay |
| US-05 | File excuse within 3 days | Apprentice | Radicate medical/work justification before statutory deadline |
| US-06 | Resolve apprentice excuses | Instructor | Approve or reject submitted excuses and restore hours |
| US-07 | Four-eyes ficha deletion | Coordinator | Require dual approval between Coordinator A and Coordinator B |
| US-08 | Export attendance reports | Instructor | Generate Excel (.xlsx) and PDF attendance sheets |

## Key acceptance criteria

### US-01: Open Room
- **Given:** Instructor is authenticated and selects an active Ficha.
- **When:** Instructor submits room creation with at least one validation mode.
- **Then:** Room is created with 15-minute window and dynamic QR generation starts.

### US-05: Excuse Filing
- **Given:** An apprentice has an absence or tardiness.
- **When:** Apprentice submits excuse within 3 business days of session date.
- **Then:** Excuse is stored as `pending` and becomes visible in instructor inbox.

---

**Related:** [`non-functional.md`](./non-functional.md) · [`traceability-matrix.md`](./traceability-matrix.md)
