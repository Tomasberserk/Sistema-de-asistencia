# 09 — Module Runbook

**Module:** [Module Name]

## Diagnostics and troubleshooting

| Symptom | Probable Cause | Action |
|---|---|---|
| Constraint error | Duplicate unique key | Verify input payload uniqueness |
| Query timeout | Unindexed column lookup | Add index via migration script |
| Missing record | Entity marked inactive | Check `active = 0` filter |
| Invalid token | Expired HMAC slot | Re-synchronize client timestamp |

## Operational checklist

1. Verify table migrations executed during startup.
2. Confirm error responses return standardized JSON error code envelopes.
3. Check audit log records generated for critical state transitions.
4. Validate that health checks return status code 200.
5. Inspect application logs for unhandled rejection warnings.
6. Verify persistent storage permissions on the target database volume.

---

**Related:** [`README.md`](./README.md) · [`../../13-operations/runbook.md`](../../13-operations/runbook.md)
