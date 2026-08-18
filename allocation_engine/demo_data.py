from __future__ import annotations

import random

from .models import Applicant, Internship


SECTORS = {
    "it": ["python", "sql", "javascript", "react"],
    "finance": ["excel", "accounting", "finance", "sql"],
    "manufacturing": ["autocad", "quality control", "excel", "mechanics"],
    "healthcare": ["communication", "excel", "data entry", "biology"],
}
LOCATIONS = ["bengaluru", "mysuru", "hubballi", "belagavi", "kalaburagi"]
QUALIFICATIONS = ["btech computer science", "bcom", "bba", "diploma"]


def generate_demo_data(applicant_count: int = 1000, internship_count: int = 80, seed: int = 42) -> tuple[list[Applicant], list[Internship]]:
    rng = random.Random(seed)
    internships: list[Internship] = []
    for index in range(internship_count):
        sector = list(SECTORS)[index % len(SECTORS)]
        internships.append(Internship(
            internship_id=f"INT-{index + 1:03d}", employer_name=f"Demo Employer {index + 1}", title=f"{sector.title()} Intern",
            required_skills=rng.sample(SECTORS[sector], 2), eligible_qualifications=rng.sample(QUALIFICATIONS, 2),
            sector=sector, location=LOCATIONS[index % len(LOCATIONS)], capacity=8 + index % 8, minimum_skill_match=0.2,
        ))
    applicants: list[Applicant] = []
    for index in range(applicant_count):
        sector = rng.choice(list(SECTORS))
        preferred_sector = sector if rng.random() < 0.75 else rng.choice(list(SECTORS))
        applicants.append(Applicant(
            applicant_id=f"APP-{index + 1:04d}", skills=rng.sample(SECTORS[sector], 2), qualification=rng.choice(QUALIFICATIONS),
            location=rng.choice(LOCATIONS), district_type=rng.choices(["urban", "rural", "aspirational"], weights=[65, 25, 10])[0],
            social_category=rng.choice(["general", "obc", "sc", "st"]), sector_preferences=[preferred_sector, sector],
            location_preferences=rng.sample(LOCATIONS, 2), past_participation=rng.random() < 0.08,
        ))
    return applicants, internships
