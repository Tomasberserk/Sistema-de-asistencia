# ADR-003: Elimination of Facial AI and Rigid IP Blocking

- **Status:** Accepted
- **Date:** 2026-08-22
- **Authors:** SENA ADSO Engineering Team

## Context

Initial prototypes included client-side facial recognition (`face-api.js`) and strict
classroom Wi-Fi IP subnet matching. In real classroom testing, neural networks crashed
low-end apprentice phones and student cellular data (4G/5G) was mistakenly blocked.

## Decision

1. Completely eliminate client-side neural net facial recognition.
2. Make IP subnet checking configurable per session rather than rigid and mandatory.
3. Establish a 6-character manual CSR room code contingency for camera focus issues.

## Alternatives considered

- **Compulsory Biometrics:** Rejected due to student exclusion and device crashes.
- **Strict IP Enforcement:** Rejected because campus Wi-Fi saturation forces mobile data use.

## Consequences

- **Positive:** Average check-in time drops to < 1 min per apprentice; zero technological exclusion.
- **Trade-off:** Physical classroom presence relies on dynamic QR rotation and instructor oversight.

---

**Related:** [`ADR-002-rotating-qr-hmac.md`](./ADR-002-rotating-qr-hmac.md)
