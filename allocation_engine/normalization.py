from __future__ import annotations

import re


ALIASES = {
    "py": "python", "python3": "python", "js": "javascript", "nodejs": "javascript",
    "postgres": "postgresql", "b tech": "btech", "b.tech": "btech",
    "bachelor of technology": "btech", "bachelor of engineering": "be",
    "computer science engineering": "computer science", "cse": "computer science",
    "information technology": "it", "bangalore": "bengaluru",
}


def normalize(value: str) -> str:
    value = re.sub(r"[^a-z0-9+#. ]+", " ", value.lower()).strip()
    value = re.sub(r"\s+", " ", value)
    return ALIASES.get(value, value)


def normalized_set(values: list[str]) -> set[str]:
    return {normalize(value) for value in values if normalize(value)}


def qualification_matches(applicant_qualification: str, eligible_qualifications: list[str]) -> bool:
    if not eligible_qualifications:
        return True
    applicant = normalize(applicant_qualification)
    eligible = normalized_set(eligible_qualifications)
    if applicant in eligible:
        return True
    # A broad B.Tech requirement can accept discipline-specific B.Tech strings.
    return any(item in applicant or applicant in item for item in eligible)
