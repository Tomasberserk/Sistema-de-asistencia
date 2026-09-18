# 11 — Quality

## Purpose

This section defines the testing strategy, test layers, quality gates, and TDD
practices ensuring all domain invariants are preserved across the codebase.

## Documents

| Document | Answers | Priority |
|---|---|---|
| [testing-strategy.md](./testing-strategy.md) | How is the system tested across layers? | ⭐ |
| [tdd-guide.md](./tdd-guide.md) | How do developers write invariant tests first? | ⭐ |
| [_template-test-case.md](./_template-test-case.md) | Test case documentation template | — |

## Core testing principles

1. Domain invariants (BR-01 to BR-12) are tested as pure, deterministic functions.
2. Every bug fix must include an automated regression test reproducing the issue.
3. Tests run without external network dependencies or external container setups.
4. All test suites must execute in under 2 seconds during local verification.

---

**Related:** [`../00-governance/definition-of-done.md`](../00-governance/definition-of-done.md) · [`testing-strategy.md`](./testing-strategy.md)
