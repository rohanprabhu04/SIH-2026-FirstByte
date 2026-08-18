# FIRSTBYTE Allocation Engine Specification

## Objective

Find a high-quality allocation of eligible applicants to internship opportunities while respecting capacity and explicitly configured mandatory constraints.

## Engine stages

### Stage 1 — Normalize

Normalize skills, locations, sectors and categorical values.

### Stage 2 — Eligibility filtering

Reject applicant-opportunity pairs that violate hard eligibility requirements.

Examples:
- Qualification mismatch
- Required experience not met
- Other explicitly defined eligibility requirements

### Stage 3 — Suitability scoring

Calculate a score for each feasible applicant-opportunity pair.

Potential components:
- Skill compatibility
- Qualification compatibility
- Sector preference
- Location preference
- Other scheme-approved preference signals

Weights must be configurable and documented. Do not claim specific weights until implemented and tested.

### Stage 4 — Optimization

Define an assignment decision:

```text
x[i,j] = 1 if applicant i receives internship j
x[i,j] = 0 otherwise
```

Core constraints:
- Each applicant receives at most one internship per allocation run.
- Each internship cannot exceed capacity.
- Ineligible pairs cannot be assigned.
- Applicable mandatory policy constraints must be respected.

Objective:

Maximize total allocation utility based on suitability scores and approved objectives.

### Stage 5 — Explanation

For every allocation, expose major contributing factors:
- Skill compatibility
- Qualification
- Sector preference
- Location preference
- Relevant policy/constraint status

Do not use Grad-CAM for this structured/tabular allocation problem.

### Stage 6 — Metrics

At minimum:
- Allocated applicants
- Unallocated applicants
- Seat utilization
- Average match score
- Preference satisfaction
- Policy-constraint compliance
- Runtime

## Baseline evaluation

Compare the engine against at least one simple baseline, such as:
- Greedy highest-match allocation

Never fabricate performance improvements. Generate metrics from actual experiments.

## Infeasibility

If mandatory constraints cannot all be satisfied:

```text
status = "infeasible"
```

Return a clear error/report to the administrator rather than silently violating a hard constraint.
