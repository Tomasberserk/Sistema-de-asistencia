# 08 — UML & Diagrams

## Purpose

This section compiles visual architecture and sequence diagrams modeling the critical
business flows of the attendance system using GitHub-native Mermaid format.

## Documents

| Document | Answers | Priority |
|---|---|---|
| [diagram-index.md](./diagram-index.md) | What do the core architectural flows look like visually? | ⭐ |

## Included diagrams

1. **Dynamic QR Rotation Check-in Flow:** Illustrates the 15s HMAC slot validation and tolerance window.
2. **Statutory 3-Business-Day Excuse Submission:** Models the calendar deadline calculation and instructor resolution.
3. **Two-Person Rule (Four-Eyes) Ficha Deletion:** Shows the dual-authorization state machine between coordinators.
4. **Monolith Boundary Flow:** Maps how controllers invoke domain services and persistence adapters.

## Diagram rendering standard

All diagrams are authored in native Mermaid syntax to ensure immediate graphical rendering
in GitHub repositories without requiring external image exports.

---

**Related:** [`../05-architecture/layered-architecture.md`](../05-architecture/layered-architecture.md) · [`diagram-index.md`](./diagram-index.md)
