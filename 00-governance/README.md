# 00 — Governance

## Purpose

This section establishes the engineering governance and collaboration standards for
the **SENA Academic Attendance System** (`sena-attendance-system`). It governs how
our team plans, branches, reviews, tests, documents, and secures a single deployable
modular monolith application across all development sprints.

## Documents

| Document | Answers | Priority |
|---|---|---|
| [definition-of-ready.md](./definition-of-ready.md) | When can an attendance user story enter a sprint? | ⭐ |
| [definition-of-done.md](./definition-of-done.md) | When is an attendance user story finished? | ⭐ |
| [git-conventions.md](./git-conventions.md) | How are branches and commit messages structured? | ⭐ |
| [documentation-rules.md](./documentation-rules.md) | When is an SDD design document complete? | ⭐ |
| [agile-conventions.md](./agile-conventions.md) | What ceremonies run, and what artifacts do they produce? | — |
| [security-policy.md](./security-policy.md) | How are JWT secrets, passwords, and data protected? | — |
| [_template-sprint-retro.md](./_template-sprint-retro.md) | Template for bi-weekly sprint retrospectives | — |

## Out of scope

This framework governs a single deployable Node.js modular monolith running on a
single process and shared database. Microservices patterns (distributed transactions,
service meshes, sagas) are intentionally excluded.

## Verification checklist

- [x] Definition of Ready and Done enforced on all sprint backlog items
- [x] Git conventions strictly followed in commits and PRs
- [x] Security lead assigned and operational audit policies active

---

**Related:** [`00-sdd-guide.md`](../00-sdd-guide.md) · [`documentation-rules.md`](./documentation-rules.md)
