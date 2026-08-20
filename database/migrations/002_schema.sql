-- =============================================================================
-- FIRSTBYTE SIH-2026
-- Migration : 002_schema.sql
-- Source    : docs/DATA_SCHEMA.md  (do not diverge from that document)
-- Safe to run on a fresh PostgreSQL database.
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- Custom enum types
-- ---------------------------------------------------------------------------

CREATE TYPE rural_urban_enum AS ENUM (
    'rural',
    'urban'
);

CREATE TYPE allocation_status_enum AS ENUM (
    'allocated',
    'unallocated',
    'reassigned'
);

-- ---------------------------------------------------------------------------
-- employers
--   No FK dependencies.
--   Referenced by: internship_opportunities.employer_id
-- ---------------------------------------------------------------------------

CREATE TABLE employers (
    employer_id  TEXT    NOT NULL,
    company_name TEXT    NOT NULL,
    sector       TEXT    NOT NULL,
    location     TEXT    NOT NULL,
    verified     BOOLEAN NOT NULL,

    CONSTRAINT pk_employers PRIMARY KEY (employer_id)
);

-- ---------------------------------------------------------------------------
-- applicants
--   No FK dependencies.
--   Referenced by: allocations.applicant_id
--
--   social_category and aspirational_district are policy-sensitive fields;
--   they are stored as-is and must only be used according to the applicable
--   scheme/legal rules (DATA_SCHEMA.md §Data rules, rule 7).
-- ---------------------------------------------------------------------------

CREATE TABLE applicants (
    applicant_id          TEXT             NOT NULL,
    full_name             TEXT             NOT NULL,
    -- Skills must use normalized names (DATA_SCHEMA.md §Data rules, rule 2)
    skills                TEXT[]           NOT NULL,
    qualification         TEXT             NOT NULL,
    experience_months     INTEGER,                    -- optional
    location              TEXT             NOT NULL,
    district              TEXT,                       -- optional
    rural_or_urban        rural_urban_enum,           -- optional
    sector_preferences    TEXT[],                     -- optional
    location_preferences  TEXT[],                     -- optional
    past_participation    BOOLEAN          NOT NULL,
    social_category       TEXT,                       -- optional; policy-sensitive
    aspirational_district BOOLEAN,                    -- optional; policy-sensitive
    profile_complete      BOOLEAN          NOT NULL,

    CONSTRAINT pk_applicants PRIMARY KEY (applicant_id)
);

-- ---------------------------------------------------------------------------
-- internship_opportunities
--   FK → employers
--
--   capacity must be a non-negative integer (DATA_SCHEMA.md §Data rules, rule 3).
--   required_skills must use normalized names (DATA_SCHEMA.md §Data rules, rule 2).
-- ---------------------------------------------------------------------------

CREATE TABLE internship_opportunities (
    internship_id              TEXT    NOT NULL,
    employer_id                TEXT    NOT NULL,
    title                      TEXT    NOT NULL,
    description                TEXT,                  -- optional
    -- Skills must use normalized names (DATA_SCHEMA.md §Data rules, rule 2)
    required_skills            TEXT[]  NOT NULL,
    qualification_required     TEXT    NOT NULL,
    experience_required_months INTEGER,               -- optional
    location                   TEXT    NOT NULL,
    sector                     TEXT    NOT NULL,
    capacity                   INTEGER NOT NULL,
    active                     BOOLEAN NOT NULL,

    CONSTRAINT pk_internship_opportunities PRIMARY KEY (internship_id),
    CONSTRAINT fk_internship_employer      FOREIGN KEY (employer_id)
                                               REFERENCES employers (employer_id),
    -- Data rule §3: capacity must be a non-negative integer
    CONSTRAINT chk_capacity_non_negative   CHECK (capacity >= 0)
);

-- ---------------------------------------------------------------------------
-- allocation_runs
--   No FK dependencies.
--   Referenced by: allocations.allocation_run_id
-- ---------------------------------------------------------------------------

CREATE TABLE allocation_runs (
    allocation_run_id   TEXT             NOT NULL,
    created_at          TIMESTAMPTZ      NOT NULL,
    applicant_count     INTEGER          NOT NULL,
    internship_count    INTEGER          NOT NULL,
    seat_count          INTEGER          NOT NULL,
    allocated_count     INTEGER          NOT NULL,
    unallocated_count   INTEGER          NOT NULL,
    average_match_score DOUBLE PRECISION,             -- optional
    seat_utilization    DOUBLE PRECISION,             -- optional; fraction of seats filled
    policy_compliance   BOOLEAN          NOT NULL,

    CONSTRAINT pk_allocation_runs PRIMARY KEY (allocation_run_id)
);

-- ---------------------------------------------------------------------------
-- allocations
--   FK → applicants, internship_opportunities, allocation_runs
--
--   Data rule §4: an applicant must not receive more than one internship in a
--   single allocation run → UNIQUE (applicant_id, allocation_run_id).
--
--   Data rule §5: an internship must never exceed its available capacity →
--   enforced at the application layer against internship_opportunities.capacity.
--
--   explanation stores the major contributing factors as a JSON object
--   (DATA_SCHEMA.md §Allocation).
-- ---------------------------------------------------------------------------

CREATE TABLE allocations (
    allocation_id     TEXT                   NOT NULL,
    applicant_id      TEXT                   NOT NULL,
    internship_id     TEXT                   NOT NULL,
    match_score       DOUBLE PRECISION       NOT NULL,
    status            allocation_status_enum NOT NULL,
    explanation       JSONB                  NOT NULL,
    allocation_run_id TEXT                   NOT NULL,

    CONSTRAINT pk_allocations           PRIMARY KEY (allocation_id),
    CONSTRAINT fk_allocation_applicant  FOREIGN KEY (applicant_id)
                                            REFERENCES applicants (applicant_id),
    CONSTRAINT fk_allocation_internship FOREIGN KEY (internship_id)
                                            REFERENCES internship_opportunities (internship_id),
    CONSTRAINT fk_allocation_run        FOREIGN KEY (allocation_run_id)
                                            REFERENCES allocation_runs (allocation_run_id),
    -- Data rule §4: one allocation record per applicant per run
    CONSTRAINT uq_applicant_per_run     UNIQUE (applicant_id, allocation_run_id)
);

-- ---------------------------------------------------------------------------
-- policy_configurations
--   No FK dependencies.
--
--   parameters stores configurable policy parameters as a JSON object.
--   priority is nullable because it applies only where relevant.
--
--   No government reservation percentages or quota values are hard-coded here;
--   all policy parameters are held in the parameters JSONB column and must
--   only be applied according to the applicable scheme/legal rules
--   (DATA_SCHEMA.md §Policy Configuration, §Data rules, rule 7).
-- ---------------------------------------------------------------------------

CREATE TABLE policy_configurations (
    policy_id  TEXT    NOT NULL,
    name       TEXT    NOT NULL,
    enabled    BOOLEAN NOT NULL,
    parameters JSONB   NOT NULL,
    priority   INTEGER,           -- optional; relative priority where applicable

    CONSTRAINT pk_policy_configurations PRIMARY KEY (policy_id)
);

-- ---------------------------------------------------------------------------
-- Indexes on FK columns
--   PostgreSQL does not auto-index FK columns; these prevent sequential scans
--   on the most common join paths implied by the schema relationships.
-- ---------------------------------------------------------------------------

CREATE INDEX idx_internship_opportunities_employer_id
    ON internship_opportunities (employer_id);

CREATE INDEX idx_allocations_applicant_id
    ON allocations (applicant_id);

CREATE INDEX idx_allocations_internship_id
    ON allocations (internship_id);

CREATE INDEX idx_allocations_allocation_run_id
    ON allocations (allocation_run_id);

COMMIT;