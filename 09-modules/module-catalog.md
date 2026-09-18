# 09 — Module Catalog

## Catalog of internal modules

| Module | Core Responsibility | Owned Tables | Exposed Facade |
|---|---|---|---|
| `identity` | Authentication, credential security, role assignment | `people` | `login`, `authenticate`, `requireRole` |
| `academic` | Fichas, institutions, apprentice enrollments | `institutions`, `academic_units`, `enrollments` | `getFichaById`, `createFicha`, `listFichas` |
| `sessions` | Attendance rooms, 15s HMAC QR generation, validation rules | `attendance_sessions` | `createRoom`, `generateQrToken`, `closeSession` |
| `attendance` | Check-in processing, delay calculation, manual override | `attendance_records`, `late_requests` | `recordCheckin`, `calculateAttendanceBlocks` |
| `excuses` | Excuse filing, 3-business-day validation, resolution | `excuses`, `holidays` | `submitExcuse`, `isWithinBusinessDays` |
| `reporting` | Excel (.xlsx) and PDF document generation | *(Read-only views)* | `getSessionReport`, `downloadCoordExcelReport` |
| `governance` | Two-person rule approvals, audit logging | `deletion_requests`, `audit_logs` | `requestFichaDeletion`, `createAuditLog` |

## Inward and outward dependency rules

1. `attendance` queries `sessions` and `academic` to validate room and enrollment state.
2. `sessions` and `academic` never query or import from `attendance`.
3. `governance` operates orthogonally: it intercepts administrative actions and audits them.
4. Circular dependencies between modules are strictly forbidden by architectural linters.
5. All inter-module communication occurs via public function contracts, never raw SQL joins.

## Module maturity levels

All 7 modules are actively implemented and covered by automated invariant tests in the
monolithic backend distribution.

---

**Related:** [`../02-domain/module-boundaries.md`](../02-domain/module-boundaries.md) · [`../05-architecture/module-structure.md`](../05-architecture/module-structure.md)
