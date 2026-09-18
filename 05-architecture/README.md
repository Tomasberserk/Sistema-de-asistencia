# 05 — Architecture

## Purpose

This section documents the internal structural architecture of the single deployable
modular monolith application, defining layers, module boundaries, and ADR records.

## Documents

| Document | Answers | Priority |
|---|---|---|
| [modular-monolith.md](./modular-monolith.md) | Why a modular monolith and how is it organized? | ⭐ |
| [layered-architecture.md](./layered-architecture.md) | How are presentation, application, and persistence layered? | ⭐ |
| [module-structure.md](./module-structure.md) | What does the folder layout look like on disk? | ⭐ |
| [boundary-enforcement.md](./boundary-enforcement.md) | How are inter-module boundaries guarded against coupling? | ⭐ |
| [decisions/README.md](./decisions/README.md) | Architectural Decision Records (ADRs) index | ⭐ |

## Architectural pattern

The system is built as a **Lightweight Modular Monolith** in Node.js (Express 5)
with a client SPA (Vanilla JS + Tailwind CSS) and conmutable persistence (SQLite/PostgreSQL).

---

**Related:** [`modular-monolith.md`](./modular-monolith.md) · [`layered-architecture.md`](./layered-architecture.md)
