# 10 — Environments

## Environment matrix

| Dimension | Local Development | Staging / Production |
|---|---|---|
| Runtime | Node.js 20+ LTS | Node.js 20+ LTS (Vercel / Cloud Container) |
| Database | SQLite3 (`database.sqlite`) | PostgreSQL (`DATABASE_URL`) |
| Host / Port | `http://localhost:4000` | Cloud HTTPS endpoint |
| Timezone | `America/Bogota` (UTC-5) | `America/Bogota` (UTC-5) |
| Seed Data | Automatic SENA demo records | Managed via migrations & initial seed |
| Log Level | `debug` (console) | `info` (structured stdout & `audit_logs`) |

## Parity controls

1. SQL migrations are tested against both SQLite and PostgreSQL engines.
2. Timezone is explicitly injected via `process.env.TZ = 'America/Bogota'`.
3. Feature toggles (`ip_check_enabled`) operate identically across all targets.
4. Environment secrets are loaded via `.env` in local development and cloud secret managers in production.
5. Automated health check (`GET /api/health`) validates database connectivity on startup.
6. Static assets are served from `./frontend` in both local dev and production container images.

---

**Related:** [`ci-cd.md`](./ci-cd.md) · [`local-setup.md`](./local-setup.md)
