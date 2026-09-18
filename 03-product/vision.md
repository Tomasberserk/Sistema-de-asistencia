# 03 — Product Vision

## Vision statement

To deliver a lightweight, web-first attendance platform that allows every SENA apprentice
to verify classroom presence in under 1 minute from their smartphone browser without
installing native apps, ensuring institutional record integrity while fairly computing
proportional training hours.

## Target outcomes (TO-BE)

| Dimension | Before (AS-IS) | Target (TO-BE) |
|---|---|---|
| Roll call duration | 15–25 minutes | Under 1 minute per apprentice |
| Punctuality model | Binary (6h or 0h) | Proportional $H(delay)$ (6h to 0h) |
| Fraud resilience | High vulnerability (paper proxy) | Rotating HMAC QR code + local IP check |
| Technological inclusion | Device-dependent | Universal web app with 6-char fallback |
| Reporting latency | Days/weeks | Instant Excel (.xlsx) and PDF export |

## Guardrails (Anti-Overengineering)

1. **No client-side facial AI:** Excluded to protect battery, network bandwidth, and low-end hardware.
2. **No mandatory local IP lock:** Configurable switch to accommodate student mobile data (4G/5G).
3. **No native mobile app store build:** Runs purely in standards-compliant mobile browsers.

---

**Related:** [`problem-framing.md`](./problem-framing.md) · [`../04-requirements/non-functional.md`](../04-requirements/non-functional.md)
