from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, field_validator


def _clean_text(value: str) -> str:
    return " ".join(value.strip().lower().split())


class Applicant(BaseModel):
    applicant_id: str
    skills: list[str] = Field(default_factory=list)
    qualification: str
    location: str
    district_type: Literal["urban", "rural", "aspirational"] = "urban"
    social_category: str = "general"
    sector_preferences: list[str] = Field(default_factory=list)
    location_preferences: list[str] = Field(default_factory=list)
    preferred_internship_ids: list[str] = Field(default_factory=list)
    past_participation: bool = False
    is_active: bool = True

    @field_validator("skills", "sector_preferences", "location_preferences", "preferred_internship_ids", mode="before")
    @classmethod
    def _remove_blank_values(cls, value: list[str] | None) -> list[str]:
        return [item for item in (value or []) if item and item.strip()]


class Internship(BaseModel):
    internship_id: str
    employer_name: str
    title: str
    required_skills: list[str] = Field(default_factory=list)
    eligible_qualifications: list[str] = Field(default_factory=list)
    sector: str
    location: str
    capacity: int = Field(ge=0)
    minimum_skill_match: float = Field(default=0.0, ge=0.0, le=1.0)
    accepts_past_participants: bool = True
    is_active: bool = True


class ScoringWeights(BaseModel):
    skills: int = Field(default=40, ge=0)
    sector: int = Field(default=20, ge=0)
    location: int = Field(default=15, ge=0)
    preference: int = Field(default=15, ge=0)
    qualification: int = Field(default=10, ge=0)

    def normalized_total(self) -> int:
        return self.skills + self.sector + self.location + self.preference + self.qualification


class PolicyConfig(BaseModel):
    """Demo-only policy knobs. They are not official scheme rules."""

    rural_minimum_allocations: int = Field(default=0, ge=0)
    aspirational_minimum_allocations: int = Field(default=0, ge=0)
    category_minimum_allocations: dict[str, int] = Field(default_factory=dict)
    past_participant_score_penalty: int = Field(default=0, ge=0, le=100)
    target_shortfall_penalty: int = Field(default=12_000, ge=0)
    stability_bonus: int = Field(default=200, ge=0)


class RunConfig(BaseModel):
    scoring: ScoringWeights = Field(default_factory=ScoringWeights)
    policies: PolicyConfig = Field(default_factory=PolicyConfig)
    max_candidates_per_applicant: int = Field(default=8, ge=1, le=30)
    solver_time_limit_seconds: float = Field(default=10.0, gt=0.0, le=120.0)
    random_seed: int = 42
    previous_allocations: dict[str, str] = Field(default_factory=dict)


class AllocationRequest(BaseModel):
    applicants: list[Applicant]
    internships: list[Internship]
    config: RunConfig = Field(default_factory=RunConfig)


class ScoreBreakdown(BaseModel):
    skills: float
    sector: float
    location: float
    preference: float
    qualification: float
    total: float


class AllocationDecision(BaseModel):
    applicant_id: str
    status: Literal["allocated", "unallocated"]
    internship_id: str | None = None
    match_score: float | None = None
    score_breakdown: ScoreBreakdown | None = None
    explanation: str | None = None
    unallocated_reason: str | None = None


class PolicyMetric(BaseModel):
    policy: str
    target: int
    achieved: int
    shortfall: int


class ReoptimizationSummary(BaseModel):
    previous_allocations: int
    retained_allocations: int
    changed_allocations: int
    newly_allocated: int
    deallocated: int


class RunMetrics(BaseModel):
    applicant_count: int
    internship_count: int
    total_seats: int
    allocated_count: int
    unallocated_count: int
    seat_utilization_percent: float
    average_match_score: float
    solve_time_seconds: float
    solver_status: str


class AllocationResult(BaseModel):
    decisions: list[AllocationDecision]
    policy_metrics: list[PolicyMetric]
    metrics: RunMetrics
    reoptimization: ReoptimizationSummary | None = None
