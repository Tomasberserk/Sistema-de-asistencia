# 07 — REST Conventions

## Endpoint catalog

| Method | Route | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/auth/login` | Public | — | Authenticate user and issue 24h JWT |
| POST | `/room/create` | Public | Instructor | Create attendance room with QR/IP rules |
| POST | `/attendance/manual-checkin` | Bearer | Instructor | Manual check-in override for apprentice |
| GET | `/api/student/history` | Bearer | Apprentice | Get student attendance history and excuses |
| POST | `/api/student/excuses` | Bearer | Apprentice | Radicate excuse within 3 business days |
| GET | `/api/instructor/excuses` | Bearer | Instructor | List pending apprentice excuses |
| POST | `/api/instructor/excuses/:id/resolve`| Bearer | Instructor | Approve or reject submitted excuse |
| GET | `/api/coord/fichas` | Bearer | Coordinator| List academic units and learner counts |
| POST | `/api/coord/fichas/:id/request-deletion` | Bearer | Coordinator | Request ficha deletion (Four-Eyes Step 1) |
| POST | `/api/coord/deletion-requests/:id/approve`| Bearer | Coordinator | Approve ficha deletion (Four-Eyes Step 2) |
| GET | `/health` | Public | — | Health check probe (returns 200 "ok") |

## Standard response formats

### Success (HTTP 200 / 201 / 202)
```json
{ "data": { "id": "sala_171000", "status": "active" } }
```

### Error (HTTP 400 / 403 / 409 / 422 / 500)
```json
{ "error": { "code": "EXCUSE_DEADLINE_EXCEEDED", "message": "El plazo legal ha expirado." } }
```

---

**Related:** [`../04-requirements/user-stories.md`](../04-requirements/user-stories.md) · [`../06-data/models.md`](../06-data/models.md)
