# 01 — Glossary

This document defines the canonical Ubiquitous Language for the attendance domain.

## Terms

| Term | Definition | Forbidden synonyms |
|---|---|---|
| Ficha | Academic training unit grouping apprentices and curricular sessions | Course, class, group |
| Session | Concrete instance of a class with scheduled start, end, and validation rules | Meeting, lecture |
| Room (Sala) | Active operational window through which a session accepts attendance check-ins | Channel, portal |
| Attendance | Verified record of an apprentice's presence in a specific session | Check-in, log |
| Delay (Retardo) | Exact time difference between student check-in and session scheduled start | Tardiness, late |
| Computed Hours | Recognized training hours awarded to an apprentice based on arrival delay | Graded hours |
| Excuse | Formal request filed by an apprentice to justify an absence or late arrival | Justification, note |
| Filing (Radicación) | Submission of an excuse before the 3-business-day statutory deadline | Upload, post |
| Requesting Coordinator | Coordinator who initiates a sensitive action requiring dual authorization | Creator |
| Approving Coordinator | Distinct second coordinator who validates and executes the action | Admin, reviewer |
| Four-Eyes Principle | Governance rule requiring two distinct coordinators to approve critical deletions | Dual control |
| Deactivation | Soft operational suspension that preserves historical data and audit trails | Archive |
| Deletion | Formal removal of an entity executed only after Four-Eyes approval | Hard delete |
| Suppression | Personal data erasure complying with Habeas Data Law 1581 | Account wipe |

---

**Related:** [`overview.md`](./overview.md) · [`../02-domain/entities-and-rules.md`](../02-domain/entities-and-rules.md)
