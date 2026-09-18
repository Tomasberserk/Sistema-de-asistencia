# 13 — Observability

## Probes and health checks

- **Liveness Probe:** `GET /health` returns `200 ok`.
- **Readiness Probe:** `GET /ready` verifies database query execution.

## Audit trail schema (`audit_logs`)

Every administrative action writes an immutable record:
```json
{
  "id": "aud_1710000000_abc123",
  "actor_id": "per_coord_1",
  "action": "APPROVE_FICHA_DELETION",
  "entity_type": "ficha",
  "entity_id": "unit_ficha_3413974",
  "created_at": "2026-09-18T18:30:00.000Z"
}
```

## Monitoring checklist

1. Check server standard output logs for uncaught exception traces.
2. Query `audit_logs` periodically to verify administrative actions.
3. Monitor database connection pool latency and memory utilization.

---

**Related:** [`runbook.md`](./runbook.md) · [`../02-domain/entities-and-rules.md`](../02-domain/entities-and-rules.md)
