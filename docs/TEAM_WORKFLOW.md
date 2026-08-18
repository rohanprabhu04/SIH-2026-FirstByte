# FIRSTBYTE Team Workflow

## Branch ownership

- `feature/frontend` — Frontend
- `feature/backend` — FastAPI/backend
- `feature/allocation-engine` — Matching + optimization
- `feature/database-auth` — Database + authentication/RBAC
- `feature/data-testing` — Synthetic data + testing

## Rules

1. Never push directly to `main`.
2. Pull/rebase from the latest `main` before opening a PR when practical.
3. Keep commits small and descriptive.
4. One teammate reviews the PR.
5. Run relevant tests before merging.
6. Do not merge code that leaves the application knowingly broken.
7. Shared schema/API changes must be communicated to the team.
8. Never commit `.env`, passwords, API keys or service-role keys.
9. Keep `main` presentation-ready.

## Commit examples

```text
feat: add applicant profile endpoint
feat: implement skill match scoring
fix: prevent allocation above internship capacity
test: add infeasible allocation scenario
docs: update API contract
```
