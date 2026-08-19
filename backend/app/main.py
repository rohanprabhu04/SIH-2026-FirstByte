from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from allocation_engine import AllocationEngine, AllocationRequest
from allocation_engine.demo_data import generate_demo_data


app = FastAPI(title="SIH Allocation API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
engine = AllocationEngine()


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "allocation-api", "engine": "OR-Tools CP-SAT"}


@app.post("/api/v1/allocations/run")
def run_allocation(request: AllocationRequest):
    """Run the shared allocation engine on validated applicant and internship data."""
    try:
        return engine.run(request)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@app.post("/api/v1/allocations/demo")
def run_demo_allocation() -> dict:
    """Run the deterministic synthetic demo used by the dashboard presentation."""
    applicants, internships = generate_demo_data()
    return engine.run(AllocationRequest(applicants=applicants, internships=internships)).model_dump()
