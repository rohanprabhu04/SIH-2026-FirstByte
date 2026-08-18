from __future__ import annotations

import time
from collections import defaultdict

from ortools.sat.python import cp_model

from .models import (
    AllocationDecision, AllocationRequest, AllocationResult, PolicyMetric, ReoptimizationSummary, RunMetrics,
)
from .scoring import Candidate, explain, is_eligible, score_candidate


class AllocationEngine:
    """Scores candidates then optimizes a single global, explainable allocation."""

    def run(self, request: AllocationRequest) -> AllocationResult:
        started = time.perf_counter()
        applicants = {item.applicant_id: item for item in request.applicants}
        internships = {item.internship_id: item for item in request.internships}
        if len(applicants) != len(request.applicants) or len(internships) != len(request.internships):
            raise ValueError("Applicant and internship IDs must be unique")

        candidates_by_applicant: dict[str, list[Candidate]] = defaultdict(list)
        for applicant in request.applicants:
            for internship in request.internships:
                if is_eligible(applicant, internship):
                    candidates_by_applicant[applicant.applicant_id].append(
                        score_candidate(applicant, internship, request.config.scoring, request.config.policies.past_participant_score_penalty)
                    )
            candidates_by_applicant[applicant.applicant_id].sort(key=lambda item: item.breakdown.total, reverse=True)
            candidates_by_applicant[applicant.applicant_id] = candidates_by_applicant[applicant.applicant_id][:request.config.max_candidates_per_applicant]

        model = cp_model.CpModel()
        variables: dict[tuple[str, str], cp_model.IntVar] = {}
        candidate_lookup: dict[tuple[str, str], Candidate] = {}
        for applicant_id, candidates in candidates_by_applicant.items():
            for candidate in candidates:
                key = (applicant_id, candidate.internship_id)
                variables[key] = model.NewBoolVar(f"assign_{applicant_id}_{candidate.internship_id}")
                candidate_lookup[key] = candidate

        for applicant_id, candidates in candidates_by_applicant.items():
            model.Add(sum(variables[(applicant_id, item.internship_id)] for item in candidates) <= 1)
        for internship in request.internships:
            model.Add(sum(variable for (applicant_id, internship_id), variable in variables.items() if internship_id == internship.internship_id) <= internship.capacity)

        policy_metrics: list[tuple[str, int, list[cp_model.IntVar]]] = []
        policies = request.config.policies
        for name, target, predicate in [
            ("rural_minimum_allocations", policies.rural_minimum_allocations, lambda a: a.district_type == "rural"),
            ("aspirational_minimum_allocations", policies.aspirational_minimum_allocations, lambda a: a.district_type == "aspirational"),
        ]:
            if target:
                members = [var for (applicant_id, _), var in variables.items() if predicate(applicants[applicant_id])]
                policy_metrics.append((name, target, members))
        for category, target in policies.category_minimum_allocations.items():
            if target:
                members = [var for (applicant_id, _), var in variables.items() if applicants[applicant_id].social_category.lower() == category.lower()]
                policy_metrics.append((f"category:{category}", target, members))

        objective_terms = []
        for key, variable in variables.items():
            candidate = candidate_lookup[key]
            utility = int(round(candidate.breakdown.total * 100))
            if request.config.previous_allocations.get(key[0]) == key[1]:
                utility += policies.stability_bonus
            objective_terms.append(utility * variable)
        shortfalls: list[tuple[str, int, cp_model.IntVar, list[cp_model.IntVar]]] = []
        for name, target, members in policy_metrics:
            shortfall = model.NewIntVar(0, target, f"shortfall_{name.replace(':', '_')}")
            model.Add(shortfall >= target - sum(members))
            objective_terms.append(-policies.target_shortfall_penalty * shortfall)
            shortfalls.append((name, target, shortfall, members))
        model.Maximize(sum(objective_terms) if objective_terms else 0)

        solver = cp_model.CpSolver()
        solver.parameters.max_time_in_seconds = request.config.solver_time_limit_seconds
        solver.parameters.random_seed = request.config.random_seed
        solver.parameters.num_search_workers = 1
        status = solver.Solve(model)
        status_name = solver.StatusName(status)
        if status not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
            raise RuntimeError(f"Allocation solver did not find a feasible solution: {status_name}")

        assigned: dict[str, Candidate] = {}
        for key, variable in variables.items():
            if solver.Value(variable):
                assigned[key[0]] = candidate_lookup[key]
        decisions: list[AllocationDecision] = []
        for applicant in request.applicants:
            candidate = assigned.get(applicant.applicant_id)
            if candidate:
                internship = internships[candidate.internship_id]
                decisions.append(AllocationDecision(applicant_id=applicant.applicant_id, status="allocated", internship_id=candidate.internship_id, match_score=candidate.breakdown.total, score_breakdown=candidate.breakdown, explanation=explain(candidate, internship)))
            else:
                reason = "no_eligible_opportunity" if not candidates_by_applicant[applicant.applicant_id] else "capacity_or_policy_competition"
                decisions.append(AllocationDecision(applicant_id=applicant.applicant_id, status="unallocated", unallocated_reason=reason))

        reported_policies = [
            PolicyMetric(policy=name, target=target, achieved=sum(solver.Value(item) for item in members), shortfall=solver.Value(shortfall))
            for name, target, shortfall, members in shortfalls
        ]
        allocated_scores = [item.match_score for item in decisions if item.match_score is not None]
        total_seats = sum(item.capacity for item in request.internships)
        elapsed = time.perf_counter() - started
        metrics = RunMetrics(
            applicant_count=len(request.applicants), internship_count=len(request.internships), total_seats=total_seats,
            allocated_count=len(assigned), unallocated_count=len(request.applicants) - len(assigned),
            seat_utilization_percent=round((len(assigned) / total_seats * 100) if total_seats else 0.0, 2),
            average_match_score=round(sum(allocated_scores) / len(allocated_scores), 2) if allocated_scores else 0.0,
            solve_time_seconds=round(elapsed, 4), solver_status=status_name,
        )
        reoptimization = self._reoptimization_summary(request.config.previous_allocations, assigned) if request.config.previous_allocations else None
        return AllocationResult(decisions=decisions, policy_metrics=reported_policies, metrics=metrics, reoptimization=reoptimization)

    @staticmethod
    def _reoptimization_summary(previous: dict[str, str], assigned: dict[str, Candidate]) -> ReoptimizationSummary:
        retained = sum(1 for applicant_id, internship_id in previous.items() if assigned.get(applicant_id) and assigned[applicant_id].internship_id == internship_id)
        changed = sum(1 for applicant_id, internship_id in previous.items() if assigned.get(applicant_id) and assigned[applicant_id].internship_id != internship_id)
        deallocated = sum(1 for applicant_id in previous if applicant_id not in assigned)
        newly = sum(1 for applicant_id in assigned if applicant_id not in previous)
        return ReoptimizationSummary(previous_allocations=len(previous), retained_allocations=retained, changed_allocations=changed, newly_allocated=newly, deallocated=deallocated)
