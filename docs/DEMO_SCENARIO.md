# FIRSTBYTE Demo Scenario

Use this scenario for integration testing and the SIH presentation.

## Dataset

Generate a synthetic dataset such as:
- 5,000 applicants
- 500 internship opportunities
- A configurable total seat count

The exact numbers can change based on performance. Never claim the demo numbers are real PM Internship Scheme data.

## Demo flow

### 1. Load data

Show applicant and opportunity counts.

### 2. Preview a match

Select one applicant and show:
- skills
- qualification
- preferences
- candidate internship
- match score
- explanation

### 3. Run allocation

Show:
- processing status
- allocated count
- unallocated count
- average match score
- seat utilization
- policy compliance

### 4. Compare with baseline

Run:
- Greedy baseline
- FIRSTBYTE optimized allocation

Compare actual metrics.

### 5. Simulate a disruption

Reduce the capacity of one internship.

Example:

```text
I001: 50 seats -> 20 seats
```

Run re-optimization and show changed allocations.

### 6. Explain a final allocation

Show the factors behind one applicant's allocation.

## Judge story

The key message:

```text
Individual recommendation
        is not enough.

Thousands of applicants
        +
Limited internship capacity
        +
Policy constraints
        ↓
System-wide optimized allocation
```
