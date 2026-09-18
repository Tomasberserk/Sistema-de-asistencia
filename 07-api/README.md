# 07 — API

## Purpose

This section documents the public and protected REST API surface exposed by the monolithic
backend, specifying route structures, authentication policies, and JSON contracts.

## Documents

| Document | Answers | Priority |
|---|---|---|
| [rest-conventions.md](./rest-conventions.md) | What are the routes, contracts, error envelopes, and status codes? | ⭐ |

## Design guidelines

1. Resources use plural nouns (`/api/sessions`, `/api/coord/fichas`).
2. Protected endpoints require `Authorization: Bearer <token>`.
3. Responses return standardized JSON envelopes with consistent error structures.
4. HTTP verbs map strictly to operations: GET (read), POST (create/action), PUT (replace), DELETE (suppress).
5. Input parameters are sanitized before reaching controllers to mitigate script injection.

## API lifecycle and versioning

All public endpoints are served under the unified root or `/api/*` namespace.
Breaking changes to payload structures require architectural review under ADR-001.

---

**Related:** [`../05-architecture/modular-monolith.md`](../05-architecture/modular-monolith.md) · [`rest-conventions.md`](./rest-conventions.md)
