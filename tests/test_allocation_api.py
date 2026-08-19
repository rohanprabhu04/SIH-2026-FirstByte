import unittest

from allocation_engine import AllocationRequest
from backend.app.main import app, health, run_allocation


class AllocationApiTests(unittest.TestCase):
    def test_health_reports_cp_sat_engine(self):
        self.assertEqual(health()["engine"], "OR-Tools CP-SAT")
        self.assertIn("/api/health", {route.path for route in app.routes})

    def test_run_endpoint_uses_shared_engine(self):
        payload = {
            "applicants": [{"applicant_id": "app-1", "skills": ["python", "sql"], "qualification": "btech", "location": "bengaluru", "sector_preferences": ["it"]}],
            "internships": [{"internship_id": "int-1", "employer_name": "Demo", "title": "Python Intern", "required_skills": ["python"], "eligible_qualifications": ["btech"], "sector": "it", "location": "bengaluru", "capacity": 1}],
        }
        response = run_allocation(AllocationRequest.model_validate(payload))
        decision = response.decisions[0]
        self.assertEqual(decision.internship_id, "int-1")
        self.assertEqual(decision.status, "allocated")
