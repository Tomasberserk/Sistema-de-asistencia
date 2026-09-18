# _stacks — Stack Reference Guides

## Purpose

This section holds the language, runtime, and framework conventions for the monolithic
codebase. For this project, the canonical guide is [`node-typescript.md`](./node-typescript.md),
adapted to our Node.js (ES Modules) modular monolith architecture.

## Documents

| Document | Stack | Status |
|---|---|---|
| [node-typescript.md](./node-typescript.md) | Node.js 20+ LTS, Express 5, ES Modules | Active Standard |

## Adoption policy

The stack guide defines the baseline runtime versions, testing libraries, and boundary
enforcement patterns. Changes to stack tooling require consensus across the development team.

## Monolith runtime characteristics

1. Single application process hosting API endpoints and serving static assets.
2. Direct asynchronous database queries through the `db.js` parameterized adapter.
3. Pure ESM syntax (`import` / `export`) across backend controllers and tests.

---

**Related:** [`node-typescript.md`](./node-typescript.md) · [`../05-architecture/modular-monolith.md`](../05-architecture/modular-monolith.md)
