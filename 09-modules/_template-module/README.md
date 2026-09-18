# 09 — Module Template

**Module:** [Module Name]  
**Owning Team:** SENA ADSO Development Team  
**Status:** Active  

## Purpose

Defines the responsibilities, owned tables, exported contracts, and invariants of this module
within the monolithic architecture of the SENA attendance system.

## Contents

| Document | Answers |
|---|---|
| [data-model.md](./data-model.md) | Which database tables does this module own? |
| [decisions.md](./decisions.md) | What technical decisions govern this module? |
| [runbook.md](./runbook.md) | How is this module operated and diagnosed? |

## Boundary rules

1. All external calls must route through the exported service facade.
2. Invariant assertions are verified using automated unit tests before merge.
3. Database mutations must generate appropriate audit log entries.

---

**Related:** [`../module-catalog.md`](../module-catalog.md)
