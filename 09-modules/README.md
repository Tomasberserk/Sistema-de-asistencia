# 09 — Modules

## Purpose

This section details the catalog of internal modules comprising the monolithic
application, outlining their responsibilities, boundaries, and owned data.

## Documents

| Document | Answers | Priority |
|---|---|---|
| [module-catalog.md](./module-catalog.md) | What are the modules, their responsibilities, and owned tables? | ⭐ |
| [_template-module/README.md](./_template-module/README.md) | Standard module documentation template | — |

## Monolithic module definition

Inside this application, a **module** is not a microservice. It is a cohesive logical
package within the single deployable codebase that encapsulates specific domain invariants,
owns specific tables, and communicates via clear exported interfaces.

## Benefits of modular cohesion

1. Prevents sprawling spaghetti code and uncontrolled cross-table updates.
2. Allows developers to test business invariants in isolation.
3. Provides a clean pathway toward future service extraction if ever needed.

---

**Related:** [`../02-domain/module-boundaries.md`](../02-domain/module-boundaries.md) · [`module-catalog.md`](./module-catalog.md)
