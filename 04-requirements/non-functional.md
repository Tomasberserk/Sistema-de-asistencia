# 04 — Non-Functional Requirements

## Quality attributes

| ID | Category | Target | Verification method |
|---|---|---|---|
| NFR-01 | Latency | p95 < 300 ms under 50 concurrent requests | Integration benchmark test |
| NFR-02 | Availability | 99.5% uptime during scheduled classroom hours | Health check probe (`/health`) |
| NFR-03 | Authentication | JWT signed with HMAC-SHA256, 24-hour expiration | Auth unit test suite |
| NFR-04 | Password Security | Bcrypt hashing with 10 salt rounds; minimum 6 chars | Invariant security tests |
| NFR-05 | QR Cryptography | Rotating token generated via HMAC-SHA256 every 15s | Token rotation test suite |
| NFR-06 | Timezone Determinism | All business logic locked to America/Bogota (UTC-5) | Holiday & working days tests |
| NFR-07 | Database Portability | Conmutable SQLite (dev) and PostgreSQL (prod) | Automated migration test suite |
| NFR-08 | Privacy (Habeas Data) | Right to suppression under Colombian Law 1581 | Data anonymization unit test |

## Security and audit constraints

1. Plaintext passwords strictly forbidden in database persistence.
2. All administrative actions write structured events to `audit_logs`.
3. Auto-approval in Two-Person Rule is prohibited at the database constraint level.
4. Input sanitization applied to all text payloads to prevent cross-site scripting (XSS).

## Quality thresholds

Code coverage must satisfy a minimum of 80% on all modified files, with the core
attendance and sessions modules requiring 90% test coverage.

---

**Related:** [`user-stories.md`](./user-stories.md) · [`traceability-matrix.md`](./traceability-matrix.md)
