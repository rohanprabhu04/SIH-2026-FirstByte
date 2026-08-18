# FIRSTBYTE API Contract

This is the shared interface between frontend, backend, database and allocation-engine teams.

## Architecture rule

Frontend -> FastAPI -> services/database/allocation engine

The frontend should not call the allocation engine directly.

## Base URL

Development:

```text
http://localhost:8000/api/v1
```

## 1. Health

### GET `/health`

Response:

```json
{
  "status": "ok"
}
```

## 2. Applicants

### GET `/applicants`

Returns paginated applicants.

Example response:

```json
{
  "items": [],
  "page": 1,
  "page_size": 50,
  "total": 0
}
```

### GET `/applicants/{applicant_id}`

Returns one applicant profile.

## 3. Internship opportunities

### GET `/internships`

Returns paginated internship opportunities.

### POST `/internships`

Creates an internship opportunity.

Request:

```json
{
  "employer_id": "E001",
  "title": "AI/ML Intern",
  "description": "Work on ML projects.",
  "required_skills": ["Python", "SQL", "Machine Learning"],
  "qualification_required": "B.Tech CSE",
  "experience_required_months": 0,
  "location": "Bengaluru",
  "sector": "IT",
  "capacity": 20
}
```

## 4. Allocation

### POST `/allocation/runs`

Starts an allocation run.

Request:

```json
{
  "policy_config": {
    "enable_past_participation_rule": true,
    "enable_affirmative_action_rules": true
  }
}
```

The exact policy parameters must be agreed with the team and grounded in the problem/scheme requirements. Do not invent government quotas.

Response:

```json
{
  "allocation_run_id": "RUN001",
  "status": "completed",
  "summary": {
    "allocated_count": 0,
    "unallocated_count": 0,
    "average_match_score": 0.0,
    "seat_utilization": 0.0,
    "policy_compliance": true
  }
}
```

## 5. Allocation results

### GET `/allocation/runs/{allocation_run_id}`

Returns run summary and status.

### GET `/allocation/runs/{allocation_run_id}/results`

Example:

```json
{
  "items": [
    {
      "applicant_id": "A001",
      "internship_id": "I001",
      "match_score": 91.5,
      "status": "allocated",
      "explanation": {
        "skill_compatibility": 0.95,
        "qualification_match": 1.0,
        "sector_preference": 1.0,
        "location_preference": 0.8
      }
    }
  ]
}
```

## 6. Re-optimization

### POST `/allocation/runs/{allocation_run_id}/reoptimize`

Used when capacity or supported policy configuration changes.

Request:

```json
{
  "changes": {
    "internship_capacity_updates": [
      {
        "internship_id": "I001",
        "new_capacity": 10
      }
    ]
  }
}
```

Response:

```json
{
  "new_allocation_run_id": "RUN002",
  "status": "completed"
}
```

## 7. Match preview

### POST `/matching/preview`

Used by the UI to show candidate-opportunity suitability before a full allocation.

Request:

```json
{
  "applicant_id": "A001",
  "internship_id": "I001"
}
```

Response:

```json
{
  "applicant_id": "A001",
  "internship_id": "I001",
  "match_score": 91.5,
  "eligible": true,
  "explanation": {
    "skill_compatibility": 0.95,
    "qualification_match": 1.0,
    "sector_preference": 1.0,
    "location_preference": 0.8
  }
}
```

## 8. Error format

Use one consistent error format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "capacity must be non-negative",
    "details": {}
  }
}
```

Suggested codes:

- `VALIDATION_ERROR`
- `NOT_FOUND`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `ALLOCATION_INFEASIBLE`
- `INTERNAL_ERROR`

## Backend ↔ Allocation Engine contract

The backend passes normalized applicant/opportunity records and policy configuration to the engine.

The engine returns:
- allocation decisions
- match scores
- explanations
- allocation metrics
- feasibility/status information

The allocation engine should not directly own HTTP routes or database authentication.

## Contract change rule

If a field or endpoint must change:
1. Tell the team.
2. Update this document.
3. Update the affected implementation.
4. Test frontend/backend/engine integration.
