# FIRSTBYTE Data Schema

This document is the shared contract for database, backend, data-generation and allocation-engine work.

## 1. Applicant

| Field | Type | Required | Description |
|---|---|---:|---|
| `applicant_id` | UUID/String | Yes | Unique applicant identifier |
| `full_name` | String | Yes | Applicant display name |
| `skills` | Array[String] | Yes | Normalized skills |
| `qualification` | String | Yes | Highest/relevant qualification |
| `experience_months` | Integer | No | Relevant prior experience |
| `location` | String | Yes | Current/preferred location representation |
| `district` | String | No | District |
| `rural_or_urban` | Enum | No | `rural` / `urban` |
| `sector_preferences` | Array[String] | No | Preferred sectors |
| `location_preferences` | Array[String] | No | Preferred locations |
| `past_participation` | Boolean | Yes | Whether applicant participated previously |
| `social_category` | String/Enum | No | Policy-relevant category, only where legally/scheme-appropriate |
| `aspirational_district` | Boolean | No | Policy-relevant indicator |
| `profile_complete` | Boolean | Yes | Whether required profile information is complete |

### Applicant example

```json
{
  "applicant_id": "A001",
  "full_name": "Applicant 001",
  "skills": ["Python", "SQL", "Machine Learning"],
  "qualification": "B.Tech CSE",
  "experience_months": 0,
  "location": "Bengaluru",
  "district": "Bengaluru Urban",
  "rural_or_urban": "urban",
  "sector_preferences": ["IT", "AI"],
  "location_preferences": ["Bengaluru"],
  "past_participation": false,
  "social_category": "SC",
  "aspirational_district": false,
  "profile_complete": true
}
```

## 2. Employer

| Field | Type | Required | Description |
|---|---|---:|---|
| `employer_id` | UUID/String | Yes | Unique employer identifier |
| `company_name` | String | Yes | Employer/company name |
| `sector` | String | Yes | Primary sector |
| `location` | String | Yes | Opportunity location |
| `verified` | Boolean | Yes | Prototype verification status |

## 3. Internship Opportunity

| Field | Type | Required | Description |
|---|---|---:|---|
| `internship_id` | UUID/String | Yes | Unique opportunity identifier |
| `employer_id` | UUID/String | Yes | Owning employer |
| `title` | String | Yes | Internship title |
| `description` | String | No | Short opportunity description |
| `required_skills` | Array[String] | Yes | Required/desired skills |
| `qualification_required` | String | Yes | Minimum qualification |
| `experience_required_months` | Integer | No | Minimum relevant experience |
| `location` | String | Yes | Internship location |
| `sector` | String | Yes | Internship sector |
| `capacity` | Integer | Yes | Available seats |
| `active` | Boolean | Yes | Whether opportunity is currently available |

### Internship example

```json
{
  "internship_id": "I001",
  "employer_id": "E001",
  "title": "AI/ML Intern",
  "description": "Work on data and machine-learning projects.",
  "required_skills": ["Python", "SQL", "Machine Learning"],
  "qualification_required": "B.Tech CSE",
  "experience_required_months": 0,
  "location": "Bengaluru",
  "sector": "IT",
  "capacity": 20,
  "active": true
}
```

## 4. Allocation

| Field | Type | Required | Description |
|---|---|---:|---|
| `allocation_id` | UUID/String | Yes | Unique allocation record |
| `applicant_id` | UUID/String | Yes | Assigned applicant |
| `internship_id` | UUID/String | Yes | Assigned internship |
| `match_score` | Float | Yes | Suitability score |
| `status` | Enum | Yes | `allocated`, `unallocated`, `reassigned` |
| `explanation` | Object | Yes | Major contributing factors |
| `allocation_run_id` | UUID/String | Yes | Allocation run that produced it |

## 5. Allocation Run

| Field | Type | Required | Description |
|---|---|---:|---|
| `allocation_run_id` | UUID/String | Yes | Unique run identifier |
| `created_at` | ISO DateTime | Yes | Run timestamp |
| `applicant_count` | Integer | Yes | Number of applicants processed |
| `internship_count` | Integer | Yes | Number of opportunities processed |
| `seat_count` | Integer | Yes | Total available seats |
| `allocated_count` | Integer | Yes | Applicants allocated |
| `unallocated_count` | Integer | Yes | Applicants not allocated |
| `average_match_score` | Float | No | Average score of allocated matches |
| `seat_utilization` | Float | No | Percentage of available seats filled |
| `policy_compliance` | Boolean | Yes | Whether mandatory encoded constraints were satisfied |

## 6. Policy Configuration

Do not hard-code policy assumptions that are not present in the official scheme rules.

| Field | Type | Description |
|---|---|---|
| `policy_id` | UUID/String | Unique policy configuration |
| `name` | String | Policy name |
| `enabled` | Boolean | Whether enabled |
| `parameters` | JSON/Object | Configurable parameters |
| `priority` | Integer | Relative priority where applicable |

## Data rules

1. IDs must be unique.
2. Skills must use normalized names where possible (`Python`, not `python programming language` in one record and `Python` in another).
3. `capacity` must be a non-negative integer.
4. An applicant must never receive more than one internship in a single allocation run unless the scheme explicitly requires otherwise.
5. An internship must never exceed its available capacity.
6. Eligibility filtering happens before optimization.
7. Policy-sensitive fields must only be used according to the applicable scheme/legal rules.
8. Never fabricate real government data or claim synthetic data is production data.
