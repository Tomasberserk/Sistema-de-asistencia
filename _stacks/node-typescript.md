# _stacks — Node.js Modular Monolith

This guide governs the Node.js implementation of the SENA attendance system.

## Baseline versions

| Component | Version | Verification |
|---|---|---|
| Node.js | 20+ LTS | `node --version` |
| Express | 5.x | Checked in `backend/package.json` |
| SQLite3 | 5.x | Local development persistence |
| BcryptJS | 2.4.x | Credential hashing |
| JSONWebToken | 9.x | Session token issuance |

## Commands

| Stage | Command |
|---|---|
| Install | `npm run install:all` |
| Develop | `npm run dev` |
| Test | `npm test` |

---

**Related:** [`../05-architecture/modular-monolith.md`](../05-architecture/modular-monolith.md)
