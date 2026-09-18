# ADR-001: Modular Monolith as Default Architecture

- **Status:** Accepted
- **Date:** 2026-07-25
- **Authors:** SENA ADSO Engineering Team

## Context

The attendance system requires fast classroom response, rapid local deployment on
standard development machines, and zero runtime overhead from container orchestration.

## Decision

Adopt a unified modular monolith stack:
- **Backend:** Node.js (Express 5) serving REST endpoints and static SPA views.
- **Frontend:** HTML5, Vanilla JavaScript, and Tailwind CSS loaded via CDN.
- **Persistence:** Conmutable adapter (`db.js`) supporting SQLite locally and PostgreSQL in production.

## Alternatives considered

- **Microservices with Docker Compose:** Rejected due to machine resource consumption in class labs.
- **Ionic/Capacitor Native App:** Rejected to avoid complex mobile compilation tooling for students.

## Consequences

- **Positive:** Project boots in 1 second with `npm run dev`; zero distributed transaction failures.
- **Trade-off:** Application scales vertically as a single unit rather than per-service.

---

**Related:** [`../modular-monolith.md`](../../modular-monolith.md)
