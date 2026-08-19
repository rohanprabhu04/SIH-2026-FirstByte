# SIH Allocation API

Thin FastAPI adapter for the shared `allocation_engine` package. It owns HTTP validation only; scoring and CP-SAT optimization stay in `allocation_engine/`.

## Run

```powershell
python -m pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

Endpoints:

- `GET /api/health`
- `POST /api/v1/allocations/run` — accepts the `AllocationRequest` JSON contract
- `POST /api/v1/allocations/demo` — runs the deterministic 1,000-applicant demo

Interactive API documentation: `http://localhost:8000/docs`.
