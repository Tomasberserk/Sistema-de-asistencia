# 00 — Git Conventions

## Branch strategy

```
main                    Production. Always deployable. Merges only from release branches.
  |-- dev               Integration branch. Merges from feature branches.
        |-- feat/[description]    One branch per feature or user story
        |-- fix/[description]     One branch per bug fix
        |-- chore/[description]   Tooling, dependencies, docs
        |-- hotfix/[description]  Urgent fix branched from main
```

- Nobody commits directly to `main` or `dev`.
- One branch equals one task. Branches are deleted right after merge.

## Branch naming

`[type]/[short-description-in-kebab-case]` — example: `feat/four-eyes-deletion`

## Commit format (Conventional Commits)

| Type | When to use |
|---|---|
| `feat` | New user functionality (e.g. `feat(attendance): add working days check`) |
| `fix` | Bug fix (e.g. `fix(sessions): enforce validation mode check`) |
| `docs` | Documentation changes only (e.g. `docs(domain): update entities`) |
| `refactor` | Code restructuring without behavior change |
| `test` | Adding or updating automated invariant tests |
| `chore` | Tooling, dependencies, database seeds |

Format: `type(scope): imperative, lowercase, no trailing period`.

## Merge policy

- **Squash and merge** for feature branches into `dev` — one clean commit per story.
- **Merge commit** for `dev` into `main` at release time — preserves release history.
- Pull requests require one peer approval and green automated test suite.

---

**Related:** [`agile-conventions.md`](./agile-conventions.md) · [`README.md`](./README.md)
