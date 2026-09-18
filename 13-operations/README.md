# 13 — Operations

## Purpose

This section provides operational manuals, incident response procedures, and observability
standards for running the application reliably in local and cloud environments.

## Documents

| Document | Answers | Priority |
|---|---|---|
| [runbook.md](./runbook.md) | How is the system deployed, monitored, and maintained? | ⭐ |
| [observability.md](./observability.md) | How are health, metrics, and audit logs observed? | ⭐ |
| [_template-incident.md](./_template-incident.md) | Incident postmortem template | — |

## Operational objectives

1. Zero downtime during regular classroom operation hours.
2. Immediate recovery from bad database states via clean seeding.
3. Comprehensive audit traceability of all administrative actions in `audit_logs`.
4. Automated health monitoring via liveness (`/health`) and readiness (`/ready`) probes.

---

**Related:** [`../10-devops/environments.md`](../10-devops/environments.md) · [`runbook.md`](./runbook.md)
