import unittest

from allocation_engine import AllocationEngine, AllocationRequest, Applicant, Internship, PolicyConfig
from allocation_engine.demo_data import generate_demo_data
from allocation_engine.models import RunConfig
from allocation_engine.scoring import score_candidate


def applicant(identifier: str, skills=None, **extra):
    return Applicant(applicant_id=identifier, skills=skills or ["python", "sql"], qualification="btech computer science", location="bengaluru", sector_preferences=["it"], location_preferences=["bengaluru"], **extra)


def internship(identifier: str, capacity=1, **extra):
    return Internship(internship_id=identifier, employer_name="Demo", title="Software Intern", required_skills=["python", "sql"], eligible_qualifications=["btech"], sector="it", location="bengaluru", capacity=capacity, minimum_skill_match=0.2, **extra)


class AllocationEngineTests(unittest.TestCase):
    def test_score_and_explanation_components(self):
        candidate = score_candidate(applicant("a1"), internship("i1"), RunConfig().scoring)
        self.assertEqual(candidate.breakdown.skills, 100.0)
        self.assertEqual(candidate.breakdown.location, 100.0)
        self.assertGreater(candidate.breakdown.total, 90)

    def test_capacity_and_single_assignment_are_enforced(self):
        result = AllocationEngine().run(AllocationRequest(applicants=[applicant("a1"), applicant("a2")], internships=[internship("i1", capacity=1)]))
        allocated = [item for item in result.decisions if item.status == "allocated"]
        self.assertEqual(len(allocated), 1)
        self.assertEqual(len({item.applicant_id for item in allocated}), 1)
        self.assertEqual(len({item.internship_id for item in allocated}), 1)

    def test_ineligible_applicant_is_not_assigned(self):
        result = AllocationEngine().run(AllocationRequest(applicants=[applicant("a1", skills=["excel"])], internships=[internship("i1")]))
        self.assertEqual(result.decisions[0].unallocated_reason, "no_eligible_opportunity")

    def test_policy_target_is_reported_even_when_unmet(self):
        result = AllocationEngine().run(AllocationRequest(
            applicants=[applicant("a1", district_type="urban")], internships=[internship("i1")],
            config=RunConfig(policies=PolicyConfig(rural_minimum_allocations=2)),
        ))
        metric = result.policy_metrics[0]
        self.assertEqual(metric.shortfall, 2)
        self.assertEqual(result.metrics.allocated_count, 1)

    def test_reoptimization_reports_seat_removal_change(self):
        initial = AllocationEngine().run(AllocationRequest(applicants=[applicant("a1"), applicant("a2")], internships=[internship("i1", capacity=2)]))
        previous = {item.applicant_id: item.internship_id for item in initial.decisions if item.internship_id}
        rerun = AllocationEngine().run(AllocationRequest(applicants=[applicant("a1"), applicant("a2")], internships=[internship("i1", capacity=1)], config=RunConfig(previous_allocations=previous)))
        self.assertEqual(rerun.reoptimization.previous_allocations, 2)
        self.assertEqual(rerun.reoptimization.deallocated, 1)

    def test_1000_applicant_demo_dataset_runs(self):
        applicants, internships = generate_demo_data()
        result = AllocationEngine().run(AllocationRequest(applicants=applicants, internships=internships, config=RunConfig(solver_time_limit_seconds=5)))
        self.assertEqual(result.metrics.applicant_count, 1000)
        self.assertLessEqual(result.metrics.allocated_count, result.metrics.total_seats)


if __name__ == "__main__":
    unittest.main()
