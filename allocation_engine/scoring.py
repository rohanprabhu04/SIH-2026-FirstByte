from __future__ import annotations

import math
from dataclasses import dataclass

from .models import Applicant, Internship, ScoreBreakdown, ScoringWeights
from .normalization import normalize, normalized_set, qualification_matches


@dataclass(frozen=True)
class Candidate:
    applicant_id: str
    internship_id: str
    breakdown: ScoreBreakdown


def skill_similarity(applicant_skills: list[str], required_skills: list[str]) -> float:
    applicant = normalized_set(applicant_skills)
    required = normalized_set(required_skills)
    if not required:
        return 1.0
    if not applicant:
        return 0.0
    return len(applicant & required) / math.sqrt(len(applicant) * len(required))


def is_eligible(applicant: Applicant, internship: Internship) -> bool:
    if not applicant.is_active or not internship.is_active or internship.capacity == 0:
        return False
    if applicant.past_participation and not internship.accepts_past_participants:
        return False
    if not qualification_matches(applicant.qualification, internship.eligible_qualifications):
        return False
    return skill_similarity(applicant.skills, internship.required_skills) >= internship.minimum_skill_match


def _rank_score(target: str, preferences: list[str]) -> float:
    target = normalize(target)
    for index, preference in enumerate(preferences):
        if normalize(preference) == target:
            return max(0.0, 1.0 - index * 0.2)
    return 0.0


def score_candidate(applicant: Applicant, internship: Internship, weights: ScoringWeights, past_penalty: int = 0) -> Candidate:
    if not is_eligible(applicant, internship):
        raise ValueError("Cannot score an ineligible applicant–internship pair")
    skill = skill_similarity(applicant.skills, internship.required_skills)
    sector = _rank_score(internship.sector, applicant.sector_preferences)
    location = 1.0 if normalize(applicant.location) == normalize(internship.location) else _rank_score(internship.location, applicant.location_preferences)
    explicit = _rank_score(internship.internship_id, applicant.preferred_internship_ids)
    preference = explicit if explicit else (sector + location) / 2
    qualification = 1.0
    total_weight = weights.normalized_total()
    total = (skill * weights.skills + sector * weights.sector + location * weights.location + preference * weights.preference + qualification * weights.qualification) / total_weight * 100
    total = max(0.0, total - (past_penalty if applicant.past_participation else 0))
    return Candidate(
        applicant.applicant_id,
        internship.internship_id,
        ScoreBreakdown(
            skills=round(skill * 100, 2), sector=round(sector * 100, 2), location=round(location * 100, 2),
            preference=round(preference * 100, 2), qualification=100.0, total=round(total, 2),
        ),
    )


def explain(candidate: Candidate, internship: Internship) -> str:
    score = candidate.breakdown
    strongest = sorted(
        [("skills", score.skills), ("sector preference", score.sector), ("location preference", score.location), ("ranked preference", score.preference)],
        key=lambda item: item[1], reverse=True,
    )[:2]
    factors = " and ".join(f"{name} ({value:.0f}%)" for name, value in strongest if value > 0)
    if not factors:
        factors = "qualification eligibility"
    return f"Allocated to {internship.title} because of {factors}; overall suitability is {score.total:.1f}% and capacity was available."
