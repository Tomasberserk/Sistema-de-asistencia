# 05 — Boundary Enforcement

## Architectural rules

To prevent coupling and architectural drift inside the monolith, the following rules apply:

1. **Explicit API Contracts:** Modules interact via documented exported functions, never private internals.
2. **Table Ownership:** Each relational table is owned by exactly one module. Cross-module writes must call the owner's service.
3. **No Circular Dependencies:** A module that imports from another module cannot be imported by that module.
4. **Isolated Pure Functions:** Mathematical algorithms (`calculateAttendanceBlocks`, `calculateBusinessDaysDeadline`) must remain pure functions independent of database connections.

## Module dependency hierarchy

```
Presentation (server.js, controllers.js)
  └── Application & Domain (services, pure invariants)
        └── Persistence Adapter (db.js)
```

## Automated verification

- Automated test suites verify invariant enforcement independently from HTTP endpoints.
- Pull requests modifying database schemas must update [`../06-data/models.md`](../06-data/models.md) in the same commit.
- ESLint checks enforce module boundaries before automated tests execute.

---

**Related:** [`layered-architecture.md`](./layered-architecture.md) · [`decisions/README.md`](./decisions/README.md)
