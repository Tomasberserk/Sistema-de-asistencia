# 02 — Module Boundaries

## Boundary assignments

| Module | Owns entities | Public contract exposed |
|---|---|---|
| `identity` | Person | `authMiddleware`, `validateCredentials`, `requireRole` |
| `academic` | Institution, AcademicUnit, Enrollment | `getFichaById`, `validateEnrollment`, `listFichas` |
| `sessions` | AttendanceSession | `createRoom`, `verifyQrToken`, `closeSession` |
| `attendance` | AttendanceRecord | `recordCheckin`, `calculateAttendanceBlocks`, `manualOverride` |
| `excuses` | Excuse, Holiday | `submitExcuse`, `resolveExcuse`, `isWithinBusinessDays` |
| `reporting` | *(Read-only views)* | `generateExcelReport`, `generatePdfReport` |
| `governance` | DeletionRequest, AuditLog | `requestFichaDeletion`, `approveFichaDeletion`, `createAuditLog` |

## Inward and outward dependency rules

1. `attendance` queries `sessions` and `academic` to validate room and enrollment state.
2. `sessions` and `academic` never query or import from `attendance`.
3. `governance` operates orthogonally: it intercepts administrative actions and audits them.
4. Circular dependencies between modules are strictly forbidden by architectural linters.
5. All inter-module communication occurs via public function contracts, never raw SQL joins.

## Enforcing boundaries

Each module encapsulates its domain logic. Tables owned by a module cannot be written
to by another module without invoking the owning module's public service contract.

---

**Related:** [`domain-map.md`](./domain-map.md) · [`entities-and-rules.md`](./entities-and-rules.md)
