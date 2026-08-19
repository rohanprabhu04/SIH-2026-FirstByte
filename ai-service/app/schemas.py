from pydantic import BaseModel, Field


class ResumeRequest(BaseModel):
    text: str = Field(min_length=1, max_length=50000)


class MatrixRequest(BaseModel):
    students: list[dict] = []
    internships: list[dict] = []
    preferences: list[dict] = []
    weights: dict = {}


class OptimizeRequest(MatrixRequest):
    matrix: list[dict] = []
