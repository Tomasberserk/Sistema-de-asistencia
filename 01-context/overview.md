# 01 — Overview

## What it does

The **SENA Academic Attendance System** is a unified modular monolith application
that replaces traditional paper-based roll calls with a fast, dynamic QR and network
check-in mechanism, automatic fractional hours calculation, and audit-ready reports.

| Capability | Description |
|---|---|
| Fast presence check-in | Rotating HMAC QR code + 6-char fallback manual code (< 1 min per apprentice) |
| Fractional hours calculation | Automatically computes attended hours (6h to 0h) based on exact delay |
| Excuse filing module | Apprentice excuse submission restricted to 3 business days in America/Bogota |
| Coordinator governance | Two-person rule (dual approval) for sensitive ficha deletions and audit trail |
| Reporting | One-click Excel (.xlsx) export and official PDF attendance sheets |

## Who it is for

| Audience | Uses it to |
|---|---|
| SENA Apprentice | Check in under 1 minute, view history, and submit medical/labor excuses |
| SENA Instructor | Open attendance rooms, monitor check-ins, resolve excuses, and export records |
| SENA Coordinator | Manage fichas/instructors, audit attendance evidence, and approve critical deletions |

## Problem it solves

Traditional manual roll calls take 15–25 minutes daily (~6.6 class hours monthly), suffer
from proxy signing fraud, unfairly penalize minor traffic delays with total absences (0h),
and impose tedious paper-to-Sofia transcription work.

## Constraints

| Constraint | Why |
|---|---|
| Single deployable process | One Node.js Express server serving REST API and SPA on port 4000 |
| Conmutable database | SQLite for local development; PostgreSQL for cloud production deployments |
| Deterministic timezone | All calendar logic locked to `America/Bogota` (UTC-5) |

---

**Related:** [`scope.md`](./scope.md) · [`glossary.md`](./glossary.md)
