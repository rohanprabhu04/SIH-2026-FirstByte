import re

KNOWN_SKILLS = {"python", "java", "javascript", "typescript", "sql", "postgresql", "fastapi", "react", "docker", "aws", "machine learning", "scikit-learn", "data analysis"}


def parse_resume(text: str) -> dict:
    normalized = text.lower()
    skills = [{"name": skill, "proficiency": 75} for skill in sorted(KNOWN_SKILLS) if re.search(rf"\\b{re.escape(skill)}\\b", normalized)]
    locations = [location.title() for location in ("Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Pune", "Remote") if location.lower() in normalized]
    goals = []
    for goal in ("Backend Development", "Frontend Development", "Data Science", "Machine Learning", "Cloud Engineering"):
        if any(word in normalized for word in goal.lower().split()):
            goals.append(goal)
    return {"skills": skills, "careerGoals": goals, "preferredLocations": locations}


def build_matrix(students: list[dict], internships: list[dict]) -> list[dict]:
    matrix = []
    for student in students:
        for internship in internships:
            cgpa_ok = student.get("cgpa") is None or internship.get("minimum_cgpa") is None or student["cgpa"] >= internship["minimum_cgpa"]
            location_score = 100 if internship.get("location") in student.get("preferred_locations", []) else 50
            score = round((location_score + (100 if cgpa_ok else 0)) / 2, 2)
            matrix.append({"student_id": student.get("id"), "internship_id": internship.get("id"), "eligible": cgpa_ok, "score": score, "breakdown": [{"criterion": "eligibility", "score": 100 if cgpa_ok else 0}]})
    return matrix


def optimize(matrix: list[dict], internships: list[dict]) -> dict:
    capacities = {item.get("id"): item.get("seats", 1) for item in internships}
    selected = set()
    allocations = []
    for candidate in sorted((item for item in matrix if item.get("eligible")), key=lambda item: item.get("score", 0), reverse=True):
        student_id = candidate.get("student_id")
        internship_id = candidate.get("internship_id")
        if student_id in selected or capacities.get(internship_id, 0) <= 0:
            continue
        selected.add(student_id)
        capacities[internship_id] -= 1
        allocations.append({"student_id": student_id, "internship_id": internship_id, "match_score": candidate.get("score", 0), "score_breakdown": candidate.get("breakdown", []), "allocation_reason": "Highest eligible compatibility score"})
    student_ids = {item.get("student_id") for item in matrix}
    return {"allocations": allocations, "preferenceSatisfaction": 0, "fairnessScore": 100 if allocations else 0, "unallocated": sorted(student_ids - selected)}
