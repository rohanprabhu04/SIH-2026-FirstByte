"""Explainable, policy-configurable internship allocation engine."""

from .engine import AllocationEngine
from .models import (
    AllocationRequest,
    AllocationResult,
    Applicant,
    Internship,
    PolicyConfig,
    ScoringWeights,
)

__all__ = [
    "AllocationEngine",
    "AllocationRequest",
    "AllocationResult",
    "Applicant",
    "Internship",
    "PolicyConfig",
    "ScoringWeights",
]
