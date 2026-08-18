# FIRSTBYTE — SIH260514

AI-Based Smart Allocation Engine for PM Internship Scheme.

## Project goal

Build a government-side decision-support system that:
1. Accepts structured applicant and internship-opportunity data.
2. Filters infeasible applicant–opportunity pairs.
3. Calculates applicant–opportunity suitability scores.
4. Uses constraint optimization to produce a system-wide allocation.
5. Explains allocation decisions and reports allocation metrics.
6. Supports re-optimization when capacity or policy parameters change.

## Repository structure

```text
/
├── frontend/
├── backend/
├── allocation_engine/
├── data/
├── docs/
└── tests/
```

## Git branches

- `main` — stable, integration-ready branch
- `feature/frontend` — Next.js/React frontend
- `feature/backend` — FastAPI backend and API layer
- `feature/allocation-engine` — matching, scoring and OR-Tools optimization
- `feature/database-auth` — PostgreSQL/Supabase schema, authentication and RBAC
- `feature/data-testing` — synthetic data generation, validation and test scenarios

## Architecture

```text
Applicant Data + Internship Data
              |
              v
Eligibility / Feasibility Filtering
              |
              v
Suitability Scoring
              |
              v
Constraint Optimization (OR-Tools / CP-SAT)
              |
              v
Final Allocation
              |
       +------+------+
       |             |
       v             v
Explanations      Metrics
       |             |
       +------+------+
              v
        FastAPI Backend
              |
              v
       Role-Based Frontend
```

## Important development rule

Do not invent new field names or API payloads independently. Use:
- `docs/DATA_SCHEMA.md`
- `docs/API_CONTRACT.md`

If a schema change is necessary, discuss it with the team before implementing it.

## Prototype data

The hackathon prototype uses realistic synthetic applicant and internship data. It does not depend on access to the live PM Internship Scheme website or production government APIs.

## Environment

Copy `.env.example` to `.env` and fill in local/development values. Never commit secrets.
