from fastapi import FastAPI

from app.engine import build_matrix, optimize, parse_resume
from app.schemas import MatrixRequest, OptimizeRequest, ResumeRequest

app = FastAPI(title="SIH AI Optimization Service", version="1.0.0")


@app.get("/health")
def health():
    return {"status": "ok", "service": "ai-service"}


@app.post("/ai/parse-resume")
def parse_resume_route(payload: ResumeRequest):
    return parse_resume(payload.text)


@app.post("/ai/build-matrix")
def build_matrix_route(payload: MatrixRequest):
    return {"matrix": build_matrix(payload.students, payload.internships)}


@app.post("/ai/optimize")
def optimize_route(payload: OptimizeRequest):
    return optimize(payload.matrix, payload.internships)
