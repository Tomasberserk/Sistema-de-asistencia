# 10 — DevOps

## Purpose

This section defines deployment environments, automated continuous integration
pipelines, and local developer workstation configuration for the attendance system.

## Documents

| Document | Answers | Priority |
|---|---|---|
| [environments.md](./environments.md) | What environments exist and how do they differ? | ⭐ |
| [ci-cd.md](./ci-cd.md) | How does code move from pull request to deployment? | ⭐ |
| [local-setup.md](./local-setup.md) | How does an engineer run the project locally? | ⭐ |

## DevOps philosophy

1. Zero external infrastructure dependencies for local development (no mandatory Docker).
2. Continuous verification of domain invariants in every CI run.
3. Automated database initialization and migrations on startup.
4. Parity between local SQLite and production PostgreSQL persistence layers.

---

**Related:** [`../05-architecture/modular-monolith.md`](../05-architecture/modular-monolith.md) · [`local-setup.md`](./local-setup.md)
