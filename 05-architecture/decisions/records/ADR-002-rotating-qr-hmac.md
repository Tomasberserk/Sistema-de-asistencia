# ADR-002: Rotating QR Code with HMAC-SHA256 and Leeway

- **Status:** Accepted
- **Date:** 2026-08-10
- **Authors:** SENA ADSO Engineering Team

## Context

Static QR codes projected on classroom boards are easily photographed and shared via
instant messaging to absent students outside the classroom.

## Decision

Implement dynamic QR rotation calculated on the server using HMAC-SHA256 over
the session identifier and a 15-second time slot counter. Provide a 1-slot leeway
window to accommodate network transmission latency.

## Alternatives considered

- **Static Session QR:** Rejected due to proxy check-in vulnerability.
- **WebSocket Streaming:** Rejected to avoid persistent connection drops on classroom Wi-Fi.

## Consequences

- **Positive:** Pre-captured photos expire in seconds, preventing unauthorized remote check-ins.
- **Trade-off:** Requires tight server clock synchronization using standard NTP.

---

**Related:** [`ADR-001-modular-monolith-as-default.md`](./ADR-001-modular-monolith-as-default.md)
