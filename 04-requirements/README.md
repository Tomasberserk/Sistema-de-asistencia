# 04 — Requirements

## Purpose

This section defines the functional and non-functional requirements of the system,
specifying verifiable user stories, measurable quality attributes, and traceability.

## Documents

| Document | Answers | Priority |
|---|---|---|
| [user-stories.md](./user-stories.md) | What functional capabilities must the software deliver? | ⭐ |
| [non-functional.md](./non-functional.md) | What performance, security, and quality targets apply? | ⭐ |
| [traceability-matrix.md](./traceability-matrix.md) | How does each story map to business rules and tests? | ⭐ |
| [_template-hu.md](./_template-hu.md) | Standard user story template | — |

## Core metrics

- **Check-in speed:** <= 60 seconds per apprentice end-to-end.
- **API Latency:** p95 < 300 ms under 50 concurrent classroom requests.
- **Coverage:** >= 80% global line coverage; >= 90% core domain coverage.

---

**Related:** [`../03-product/vision.md`](../03-product/vision.md) · [`user-stories.md`](./user-stories.md)
