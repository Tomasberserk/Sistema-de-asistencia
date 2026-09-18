# 00 — Security Policy

This project ships as a single deployable application. Security controls protect
one Node.js process, one relational database, and one set of runtime environment variables.

## Secrets and tokens

| Rule | Detail |
|---|---|
| No plaintext credentials | Enforced via pre-commit git checks and environment injection |
| Password storage | Encrypted with `bcryptjs` (10 salt rounds); plaintext seeds forbidden in production |
| Session tokens | Signed using `jsonwebtoken` (HMAC-SHA256) with 24-hour expiration |
| QR dynamic tokens | Deterministic HMAC-SHA256 with 15s window and 1-slot leeway |
| Password reset tokens | Stored as SHA-256 hash in database; single-use atomic invalidation |

## Dependency security

- CI runs `npm audit` on every pull request.
- Vulnerabilities rated **high** or **critical** block deployment until resolved.
- Runtime packages locked via `package-lock.json`.

## Access control and auditability

- **Authentication:** Middleware validates Bearer JWT on protected routes.
- **Role authorization:** Enforced at domain service boundary (`APRENDIZ`, `INSTRUCTOR`, `COORDINADOR`).
- **Four-eyes principle:** Critical deletions require two distinct coordinators.
- **Audit trail:** Sensitive operations write immutable records to `audit_logs`.

---

**Related:** [`documentation-rules.md`](./documentation-rules.md) · [`README.md`](./README.md)
