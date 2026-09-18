# 13 — Runbook

## Service startup

```powershell
npm run dev
```
Server binds to `http://localhost:4000`, initializes database schemas, and seeds default records.

## Common operational tasks

### Database re-initialization
To wipe development database and re-seed from scratch:
```powershell
Remove-Item backend/database.sqlite -Force
npm run dev
```

### Health verification
```powershell
curl http://localhost:4000/health
# Returns HTTP 200 "ok"
```

---

**Related:** [`observability.md`](./observability.md) · [`_template-incident.md`](./_template-incident.md)
