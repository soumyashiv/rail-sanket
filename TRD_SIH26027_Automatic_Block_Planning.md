# TRD — AI-Powered Automatic Block Planning for Indian Railways

**Challenge:** SIH26027  
**Product:** AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations  
**Category:** Software  
**Theme:** Transportation & Logistics  
**Document Type:** Technical Requirements Document  
**Target:** SIH MVP / Demonstration Prototype  
**Architecture Principle:** Simple, modular, explainable, deployable

---

# 1. Technical Objective

Build a web-based decision-support platform that consumes maintenance, timetable, corridor, and block-availability data and generates feasible, optimized maintenance block plans.

The system will:

1. Normalize maintenance data from TMS, SMMS, and TDMS.
2. Consume/simulate COA, timetable, and goods-train forecast data.
3. Calculate explainable maintenance priority.
4. Generate feasible block windows.
5. Detect compatible maintenance tasks.
6. Optimize task-to-block assignment.
7. Generate weekly and monthly plans.
8. Detect conflicts and unscheduled critical work.
9. Support planner-driven what-if scenarios.
10. Require human approval before a plan becomes final.

The system is **not a railway control system** and must not directly control signalling, traction, or field equipment.

---

# 2. MVP Technical Scope

## In Scope

- Web dashboard.
- REST backend.
- Relational database.
- CSV import adapters.
- Synthetic/demo data.
- Maintenance task normalization.
- Priority scoring.
- Constraint validation.
- Block-window generation.
- Task compatibility.
- Block optimization.
- Weekly planning.
- Monthly capacity planning.
- Conflict detection.
- What-if recalculation.
- Explainable recommendations.
- Audit trail.
- CSV/PDF export.

## Out of Scope

- Direct production integration with railway systems.
- Real-time signalling control.
- Automatic operational block authorization.
- Nationwide distributed architecture.
- Deep-learning infrastructure.
- Kubernetes.
- Event streaming platform.
- Complex GIS infrastructure.
- Autonomous operational decision-making.

---

# 3. Recommended Technology Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | Next.js + React | Fast dashboard development |
| UI | Tailwind CSS | Simple consistent UI |
| Charts | Recharts | KPI/timeline visualizations |
| Backend | Python + FastAPI | Lightweight APIs + optimization ecosystem |
| ORM | SQLAlchemy | PostgreSQL integration |
| Database | PostgreSQL | Reliable relational data |
| Validation | Pydantic | API/data validation |
| Optimization | OR-Tools | Constraint optimization |
| Data processing | Pandas | CSV/demo data processing |
| Auth | JWT/session-based auth | Simple MVP authentication |
| PDF | ReportLab | Server-side report generation |
| Testing | Pytest + Playwright | Backend + critical UI flows |
| Containers | Docker Compose | Simple local/deployment setup |

### Alternative

For a smaller hackathon implementation, SQLite can replace PostgreSQL during development.

---

# 4. High-Level Architecture

```text
                         External Sources
               +-------------------------------+
               | TMS | SMMS | TDMS | COA       |
               | Timetable | Goods Forecast    |
               +---------------+---------------+
                               |
                               v
                    +----------------------+
                    | Data Adapter Layer   |
                    | CSV / Mock API       |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    | Data Normalization    |
                    | Validation            |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    | PostgreSQL Database  |
                    +----------+-----------+
                               |
             +-----------------+-----------------+
             |                                   |
             v                                   v
   +----------------------+            +----------------------+
   | Priority Engine      |            | Constraint Engine    |
   | Criticality          |            | Safety rules         |
   | Urgency              |            | Corridor rules       |
   | Overdue              |            | Time constraints     |
   +----------+-----------+            +----------+-----------+
              |                                   |
              +----------------+------------------+
                               |
                               v
                    +----------------------+
                    | Planning Engine      |
                    | Candidate generation |
                    | Bundling             |
                    | Optimization         |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    | Plan Service         |
                    | Weekly / Monthly     |
                    | What-if              |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    | FastAPI REST API     |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    | Next.js Dashboard    |
                    +----------------------+
```

---

# 5. Architecture Style

Use a **modular monolith**.

```text
backend/
├── app/
│   ├── api/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── planning/
│   ├── optimization/
│   ├── rules/
│   ├── adapters/
│   ├── auth/
│   └── utils/
├── tests/
└── main.py
```

Do not split these modules into independent microservices.

The optimization engine, API, database, and business logic can run inside one backend application.

---

# 6. Backend Modules

## 6.1 Data Adapter Module

Responsibilities:

- Read CSV files.
- Validate incoming records.
- Map source-specific fields to canonical fields.
- Handle missing/invalid values.
- Store normalized records.

Interfaces:

```python
class MaintenanceAdapter:
    def load(self, source_file) -> list[MaintenanceTask]:
        ...

class TrainMovementAdapter:
    def load(self, source_file) -> list[TrainMovement]:
        ...

class BlockWindowAdapter:
    def load(self, source_file) -> list[BlockWindow]:
        ...
```

Future API integrations should implement the same adapter interfaces.

---

# 7. Canonical Data Model

## 7.1 MaintenanceTask

```text
id: UUID
external_id: string
source_system: enum
department: enum
asset_id: string
asset_type: string
corridor_id: string
section_id: string
location: string
task_type: string
criticality: integer 1-5
defect_severity: integer 1-5
due_date: datetime
estimated_duration_minutes: integer
required_block_type: enum
crew_id: nullable string
dependencies: JSON
status: enum
created_at: datetime
updated_at: datetime
```

---

## 7.2 TrainMovement

```text
id: UUID
train_number: string
service_date: date
corridor_id: string
section_id: string
arrival_time: datetime
departure_time: datetime
train_type: enum
priority: integer
forecast: boolean
forecast_confidence: nullable float
```

---

## 7.3 BlockWindow

```text
id: UUID
service_date: date
corridor_id: string
section_id: string
start_time: datetime
end_time: datetime
duration_minutes: integer
block_type: enum
availability_status: enum
risk_level: enum
```

---

## 7.4 ScheduledBlock

```text
id: UUID
plan_id: UUID
service_date: date
corridor_id: string
section_id: string
start_time: datetime
end_time: datetime
block_type: enum
utilization_percent: float
operational_impact_score: float
status: enum
```

---

## 7.5 ScheduledTask

```text
id: UUID
block_id: UUID
task_id: UUID
sequence: integer
planned_start: datetime
planned_end: datetime
```

---

## 7.6 PlanningPlan

```text
id: UUID
name: string
planning_horizon: enum
start_date: date
end_date: date
status: enum
version: integer
created_by: UUID
generated_at: datetime
approved_at: nullable datetime
```

---

## 7.7 AuditLog

```text
id: UUID
user_id: UUID
action: string
entity_type: string
entity_id: UUID
old_value: JSON
new_value: JSON
reason: nullable string
created_at: datetime
```

---

# 8. Enumerations

## Department

```text
ENGINEERING
SNT
TRACTION
```

## Source System

```text
TMS
SMMS
TDMS
COA
TIMETABLE
GOODS_FORECAST
```

## Task Status

```text
OPEN
SCHEDULED
IN_PROGRESS
COMPLETED
CANCELLED
```

## Plan Status

```text
DRAFT
AI_RECOMMENDED
UNDER_REVIEW
APPROVED
REJECTED
ARCHIVED
```

## Block Type

```text
TRAFFIC_BLOCK
POWER_BLOCK
SIGNALLING_DISCONNECTION
COMBINED
```

---

# 9. Database Design

Minimum relational tables:

```text
users
maintenance_tasks
train_movements
corridors
sections
block_windows
planning_plans
scheduled_blocks
scheduled_tasks
conflicts
recommendations
audit_logs
```

Relationships:

```text
corridor
  └── sections
       ├── maintenance_tasks
       ├── train_movements
       └── block_windows

planning_plan
  └── scheduled_blocks
       └── scheduled_tasks
            └── maintenance_task
```

Use indexes on:

```text
maintenance_tasks(corridor_id)
maintenance_tasks(due_date)
maintenance_tasks(status)
maintenance_tasks(criticality)

train_movements(corridor_id, service_date)

block_windows(corridor_id, service_date)
block_windows(start_time, end_time)

scheduled_blocks(plan_id)
```

---

# 10. Data Normalization

Source systems may use different names for the same concepts.

Example:

```text
TMS:
section_code

SMMS:
section_id

TDMS:
location_code
```

Normalize all into:

```text
section_id
```

Similarly:

```text
urgent
high priority
P1
critical
```

should map into a canonical criticality scale.

Normalization pipeline:

```text
Raw Input
   ↓
Schema Validation
   ↓
Field Mapping
   ↓
Enum Normalization
   ↓
Unit Normalization
   ↓
Duplicate Detection
   ↓
Business Validation
   ↓
Canonical Database
```

Invalid records should be rejected with an understandable error.

---

# 11. Import API

## POST `/api/v1/import/maintenance`

Accept:

```text
multipart/form-data
file=<CSV>
source_system=TMS
```

Response:

```json
{
  "total": 300,
  "imported": 292,
  "rejected": 8,
  "errors": [
    {
      "row": 14,
      "field": "estimated_duration_minutes",
      "message": "Must be greater than zero"
    }
  ]
}
```

Equivalent endpoints:

```text
POST /api/v1/import/trains
POST /api/v1/import/block-windows
POST /api/v1/import/goods-forecast
```

---

# 12. Priority Engine

Priority must be deterministic and explainable.

## Inputs

```text
criticality
defect_severity
overdue_days
asset_impact
operational_impact
due_date
```

## Output

```text
priority_score: 0-100
priority_level:
    LOW
    MEDIUM
    HIGH
    CRITICAL
reasons[]
```

Suggested formula:

```text
priority =
    0.30 * criticality_score
  + 0.20 * urgency_score
  + 0.20 * defect_score
  + 0.15 * asset_impact_score
  + 0.10 * overdue_score
  + 0.05 * operational_benefit_score
```

Normalize every component to `0–100`.

Weights should be configuration values rather than hardcoded throughout the codebase.

---

# 13. Priority Calculation

Example:

```python
def calculate_priority(task):
    score = (
        0.30 * task.criticality_score +
        0.20 * task.urgency_score +
        0.20 * task.defect_score +
        0.15 * task.asset_impact_score +
        0.10 * task.overdue_score +
        0.05 * task.operational_benefit_score
    )

    return round(score, 2)
```

Generate reasons separately:

```python
[
    "Critical asset",
    "14 days overdue",
    "High defect severity",
    "High-traffic corridor"
]
```

Do not use an LLM to calculate the actual safety or priority score.

---

# 14. Urgency Function

Suggested MVP:

```text
Days to due date

> 30 days       → 20
15–30 days      → 40
7–14 days       → 60
1–6 days        → 80
Due/overdue     → 100
```

For overdue tasks:

```text
overdue_score = min(100, 50 + overdue_days * 3)
```

Domain experts should validate these thresholds.

---

# 15. Block Window Generation

A block window is feasible when:

```text
window duration >= required task duration
```

and:

```text
No prohibited train movement overlaps the window
```

and:

```text
Required block type is supported
```

and:

```text
Required safety buffer is satisfied
```

Basic process:

```python
for gap in operational_gaps:
    if gap.duration >= minimum_block_duration:
        create_candidate_window(gap)
```

Then apply constraints.

---

# 16. Train Conflict Detection

For each proposed block:

```text
block_start
block_end
```

find train movements where:

```text
train_start < block_end
AND
train_end > block_start
```

If an overlapping movement is incompatible with the block:

```text
CONFLICT
```

The conflict must include:

```text
train_number
corridor
time
conflict_type
severity
```

---

# 17. Safety Buffer

Configurable:

```text
before_train_buffer_minutes
after_train_buffer_minutes
```

For MVP, use a configurable default such as:

```text
10 minutes
```

The exact value must be treated as a configuration/demo parameter, not a railway operational rule.

---

# 18. Task Compatibility Engine

Two tasks are compatible only if:

```text
same/compatible corridor
AND
compatible section
AND
compatible block type
AND
no dependency conflict
AND
resource conflict does not exist
AND
combined duration <= window duration
AND
safety constraints remain valid
```

Function:

```python
def are_tasks_compatible(task_a, task_b, window):
    ...
```

Return:

```json
{
  "compatible": true,
  "reasons": [
    "Same section",
    "Compatible block type"
  ]
}
```

Or:

```json
{
  "compatible": false,
  "reasons": [
    "Requires separate power block"
  ]
}
```

---

# 19. Task Bundling

Candidate bundle:

```text
Bundle
├── task A
├── task B
└── task C
```

Calculate:

```text
total_duration
max_criticality
average_priority
operational_impact
resource_usage
```

Bundling benefit:

```text
bundling_benefit =
    separate_blocks_required
    - combined_blocks_required
```

The optimizer can reward bundling but must never allow an invalid bundle.

---

# 20. Optimization Engine

## Inputs

```text
tasks
block_windows
train_movements
constraints
resource availability
priority scores
```

## Outputs

```text
scheduled_blocks
scheduled_tasks
unscheduled_tasks
conflicts
optimization_metrics
```

---

# 21. Optimization Objective

Recommended weighted objective:

```text
MAXIMIZE

  35% critical/priority maintenance completed
+ 20% block utilization
+ 20% asset availability improvement
+ 15% bundling benefit
+ 10% overdue reduction

MINIMIZE

  operational disruption
  conflicts
  idle block time
  unnecessary blocks
```

The implementation should expose weights through configuration.

---

# 22. Hard Constraints

These constraints must always hold:

```text
1. Task assigned at most once.
2. Task cannot start before block start.
3. Task must finish before block end.
4. Total task duration <= block duration.
5. Incompatible train movement cannot overlap.
6. Required block type must match.
7. Task dependency must be satisfied.
8. Resource cannot be double-booked.
9. Safety buffer must be respected.
10. Approved existing blocks cannot be silently overwritten.
```

If a hard constraint cannot be satisfied, the task remains unscheduled.

---

# 23. Soft Constraints

Use these only for optimization ranking:

```text
Higher task priority
Higher criticality
More overdue days
Higher asset impact
Higher block utilization
More compatible work bundled
Lower operational impact
Fewer separate blocks
```

---

# 24. OR-Tools Model

The prototype can use CP-SAT.

Conceptually:

```text
x(task, window) ∈ {0,1}
```

Where:

```text
x = 1
```

means task is assigned to the window.

Constraint:

```text
Σ x(task, window) <= 1
```

for each task.

Capacity:

```text
Σ duration(task) × x(task, window)
<= window_duration
```

Additional constraints handle:

- incompatible tasks
- resources
- dependencies
- operational conflicts

---

# 25. Optimization Fallback

If OR-Tools is unavailable or optimization becomes too expensive:

Use a deterministic greedy strategy:

```text
1. Sort tasks by priority descending.
2. Iterate through feasible windows.
3. Assign highest-priority compatible task.
4. Fill remaining capacity with compatible tasks.
5. Continue until all windows are processed.
6. Report unscheduled tasks.
```

This ensures the demo remains reliable.

---

# 26. Plan Generation API

## POST `/api/v1/plans/generate`

Request:

```json
{
  "start_date": "2026-10-12",
  "end_date": "2026-10-18",
  "corridor_ids": ["C01", "C02"],
  "departments": [
    "ENGINEERING",
    "SNT",
    "TRACTION"
  ],
  "optimization_profile": "BALANCED"
}
```

Response:

```json
{
  "plan_id": "uuid",
  "status": "AI_RECOMMENDED",
  "scheduled_tasks": 82,
  "unscheduled_tasks": 11,
  "blocks_created": 24,
  "block_utilization": 91.2,
  "critical_tasks_completed": 10
}
```

---

# 27. Plan Retrieval

## GET `/api/v1/plans/{plan_id}`

Response should include:

```text
plan metadata
blocks
tasks
priority
utilization
conflicts
exceptions
recommendations
KPIs
```

---

# 28. What-If API

## POST `/api/v1/plans/{plan_id}/simulate`

Input:

```json
{
  "changes": [
    {
      "type": "BLOCK_TIME",
      "block_id": "uuid",
      "new_start": "2026-10-14T12:00:00"
    }
  ]
}
```

Output:

```json
{
  "baseline": {
    "asset_availability": 96.1,
    "block_utilization": 82.0
  },
  "scenario": {
    "asset_availability": 97.0,
    "block_utilization": 91.0
  },
  "changes": [
    "1 additional task moved",
    "1 conflict resolved"
  ]
}
```

Simulation must not modify the approved plan.

---

# 29. Plan Approval API

## POST `/api/v1/plans/{plan_id}/approve`

Requirements:

- User must have planner/authorized role.
- Plan must be in reviewable state.
- All unresolved critical safety conflicts must block approval.
- Approval must create an audit record.

Response:

```json
{
  "status": "APPROVED",
  "approved_at": "..."
}
```

---

# 30. Conflict Engine

Conflict categories:

```text
TRAIN_CONFLICT
BLOCK_OVERLAP
RESOURCE_CONFLICT
DEPENDENCY_CONFLICT
CAPACITY_CONFLICT
BLOCK_TYPE_CONFLICT
SAFETY_CONFLICT
```

Severity:

```text
INFO
WARNING
CRITICAL
```

Critical conflicts cannot be ignored during approval.

---

# 31. Exception Engine

Every unscheduled task needs a reason.

Example:

```json
{
  "task_id": "SMMS-221",
  "reason": "NO_FEASIBLE_WINDOW",
  "priority": 96,
  "suggestion": "Review extended block availability"
}
```

Possible reasons:

```text
NO_FEASIBLE_WINDOW
INSUFFICIENT_DURATION
TRAIN_CONFLICT
RESOURCE_UNAVAILABLE
DEPENDENCY_NOT_MET
BLOCK_TYPE_UNAVAILABLE
SAFETY_CONSTRAINT
```

---

# 32. Recommendation Engine

Each recommendation should contain:

```text
recommendation_id
block_id
task_ids
score
priority_impact
utilization
operational_impact
reasons[]
alternatives[]
```

Example:

```json
{
  "score": 92,
  "reasons": [
    "Critical overdue task",
    "91% block utilization",
    "No train conflict",
    "Compatible multi-department work"
  ]
}
```

---

# 33. Monthly Planning

Monthly planning should not run a highly detailed operational optimization for every minute of an entire month.

Use two levels:

### Monthly level

Calculate:

```text
maintenance demand
available block capacity
critical backlog
department demand
corridor capacity
estimated downtime
```

### Weekly level

Run detailed task/block optimization.

This keeps computation and UI complexity low.

---

# 34. Dashboard API

## GET `/api/v1/dashboard/kpis`

Return:

```json
{
  "asset_availability": 96.8,
  "block_utilization": 88.2,
  "critical_pending": 12,
  "overdue_tasks": 37,
  "planned_maintenance_hours": 164,
  "conflicts": 8,
  "bundled_tasks": 24
}
```

---

# 35. Frontend Architecture

```text
frontend/
├── app/
│   ├── dashboard/
│   ├── maintenance/
│   ├── planner/
│   ├── conflicts/
│   ├── what-if/
│   └── reports/
├── components/
│   ├── kpi/
│   ├── tables/
│   ├── timeline/
│   ├── planner/
│   └── common/
├── lib/
│   ├── api.ts
│   └── types.ts
└── hooks/
```

---

# 36. Required UI Components

## KPI Cards

```text
Asset Availability
Block Utilization
Critical Pending
Overdue
Conflicts
Bundled Tasks
```

## Maintenance Table

Features:

- Search.
- Department filter.
- Corridor filter.
- Priority filter.
- Overdue filter.
- Status filter.
- Sort by priority.

## Timeline

Display:

```text
Train movement
Available window
Recommended block
Scheduled maintenance
Conflict
```

---

# 37. Planner UX

Planner should be able to:

```text
View recommendation
    ↓
Inspect reasons
    ↓
Accept / modify
    ↓
Recalculate
    ↓
Compare KPIs
    ↓
Approve
```

Avoid drag-and-drop complexity unless time permits.

Basic dropdowns and buttons are sufficient for MVP.

---

# 38. Map / Corridor View

A full GIS system is not required.

MVP can use:

```text
Corridor C01
  Station A ─── Section 1 ─── Station B
                     |
                     └── Maintenance tasks
```

Optional:

- Leaflet/OpenStreetMap visualization.
- Only if real coordinates are available.

Do not make map functionality a dependency for core planning.

---

# 39. Authentication

MVP roles:

```text
ADMIN
PLANNER
DEPARTMENT_PLANNER
OPERATIONS
VIEWER
```

Permissions:

| Action | Planner | Dept Planner | Operations | Viewer |
|---|---:|---:|---:|---:|
| View plans | ✓ | ✓ | ✓ | ✓ |
| Generate plan | ✓ | ✓ | - | - |
| Modify plan | ✓ | Department scope | - | - |
| Approve | ✓ | - | optional | - |
| Import data | ✓ | - | - | - |
| View reports | ✓ | ✓ | ✓ | ✓ |

For SIH, simple JWT authentication is enough.

---

# 40. Audit Logging

Log:

```text
LOGIN
IMPORT_DATA
GENERATE_PLAN
MODIFY_PLAN
MOVE_TASK
REMOVE_TASK
SIMULATE_PLAN
APPROVE_PLAN
REJECT_PLAN
EXPORT_PLAN
```

Example:

```json
{
  "user": "planner01",
  "action": "MOVE_TASK",
  "entity": "SMMS-087",
  "reason": "Operational constraint",
  "timestamp": "..."
}
```

---

# 41. Data Validation

Use Pydantic schemas for API validation.

Examples:

```text
duration > 0
criticality between 1 and 5
defect severity between 1 and 5
end_time > start_time
priority between 0 and 100
```

Database constraints should also protect critical fields.

---

# 42. Error Handling

API format:

```json
{
  "error": {
    "code": "INVALID_BLOCK_WINDOW",
    "message": "Block end time must be after start time",
    "details": {}
  }
}
```

HTTP codes:

```text
400 → Invalid request
401 → Unauthorized
403 → Forbidden
404 → Not found
409 → Planning conflict
422 → Validation error
500 → Internal server error
```

Do not expose stack traces to users.

---

# 43. Logging

Use structured application logs.

Log:

```text
request_id
user_id
operation
plan_id
duration_ms
status
error_code
```

Do not log:

- passwords
- tokens
- sensitive credentials
- unnecessary personal information

---

# 44. Performance Targets

For SIH demo data:

```text
300–5,000 tasks
5–50 corridors
1–30 days planning horizon
```

Target:

```text
Data import: < 5 sec
Dashboard load: < 2 sec
Priority calculation: < 2 sec
Weekly plan generation: < 10 sec
What-if simulation: < 10 sec
```

These are prototype targets, not production SLAs.

---

# 45. Optimization Performance

The planner should:

1. Filter impossible tasks first.
2. Filter incompatible windows.
3. Reduce candidate combinations.
4. Optimize only feasible candidates.
5. Apply time limits to the solver.

Example:

```text
Solver time limit = 5–10 seconds
```

If optimization reaches the limit:

```text
return best feasible solution found
```

Never return an invalid solution.

---

# 46. Security Requirements

Minimum:

- HTTPS in deployment.
- Password hashing.
- JWT/session protection.
- Input validation.
- Role-based authorization.
- Database credentials via environment variables.
- CORS restricted to frontend origin.
- No secrets committed to Git.

Environment variables:

```text
DATABASE_URL=
JWT_SECRET=
APP_ENV=
CORS_ORIGINS=
```

---

# 47. Data Privacy

The prototype should use:

- Synthetic data.
- Anonymized data.
- Non-sensitive identifiers.

Do not include real operationally sensitive railway information in public repositories or demos.

---

# 48. External System Integration Strategy

Do not tightly couple business logic to source systems.

Use adapters:

```text
TMS Adapter
SMMS Adapter
TDMS Adapter
COA Adapter
```

All produce canonical objects.

```text
TMS ──┐
SMMS ─┼──> Adapter ──> Canonical Schema
TDMS ─┤
COA ──┘
```

For SIH:

```text
CSV Adapter → Canonical Schema
```

This demonstrates integration readiness without needing unavailable production APIs.

---

# 49. API Versioning

Use:

```text
/api/v1/
```

Example:

```text
/api/v1/tasks
/api/v1/plans
/api/v1/conflicts
```

Keep versioning simple.

---

# 50. Caching

MVP does not require Redis.

Use:

- PostgreSQL queries.
- In-memory caching only where useful.
- Client-side caching via React Query/SWR if desired.

Introduce Redis only if performance testing demonstrates a need.

---

# 51. Background Jobs

Do not add Celery/Redis initially.

Plan generation can run synchronously for SIH-scale data.

If optimization becomes long-running:

```text
POST /plans/generate
        ↓
job_id
        ↓
GET /jobs/{job_id}
```

This can be added later.

---

# 52. Testing Strategy

## Unit Tests

Test:

- Priority calculations.
- Urgency calculations.
- Compatibility rules.
- Train conflict detection.
- Capacity checks.
- KPI calculations.
- Exception classification.

## Integration Tests

Test:

```text
CSV → Database → Planning Engine → API
```

## Optimization Tests

Verify:

- No task is duplicated.
- No hard constraint is violated.
- Total duration fits.
- Incompatible tasks are not bundled.
- Critical tasks are preferred when feasible.

## UI Tests

Critical flows:

```text
Login
Import data
Generate plan
View recommendation
Run what-if
Approve plan
Export report
```

---

# 53. Test Dataset

Create:

```text
data/
├── maintenance_tms.csv
├── maintenance_smms.csv
├── maintenance_tdms.csv
├── train_movements.csv
├── goods_forecast.csv
├── block_windows.csv
└── resources.csv
```

Recommended demo size:

```text
300 maintenance tasks
50 critical/overdue tasks
5 corridors
20 sections
1 week detailed train data
1 month capacity data
```

---

# 54. Required Demo Scenarios

## Scenario A — Critical Defect

Input:

```text
Critical signalling defect
14 days overdue
High-traffic corridor
```

Expected:

```text
High priority
```

---

## Scenario B — Multi-Department Bundling

Input:

```text
Engineering: 60 min
S&T: 45 min
Same corridor
Same compatible window
```

Expected:

```text
Combined block
105/120 minutes used
```

---

## Scenario C — Train Conflict

Input:

```text
Maintenance block: 11:30–13:00
Passenger train: 12:15
```

Expected:

```text
Conflict detected
Block rejected or moved
```

---

## Scenario D — Capacity Conflict

Input:

```text
Tasks = 165 minutes
Window = 120 minutes
```

Expected:

```text
Cannot fit all tasks
Planner receives alternative
```

---

## Scenario E — No Feasible Window

Expected:

```text
Task remains unscheduled
Reason shown
Suggested action shown
```

---

## Scenario F — What-If

Planner changes a block time.

Expected:

```text
Scenario plan generated
Baseline vs scenario KPIs displayed
Original plan unchanged
```

---

# 55. KPI Calculation

## Block Utilization

```text
sum(planned_task_duration)
-------------------------- × 100
block_duration
```

Example:

```text
105 / 120 × 100 = 87.5%
```

## Critical Completion

```text
critical_tasks_scheduled
------------------------ × 100
critical_tasks_total
```

## Overdue Reduction

```text
(before_overdue - after_overdue)
-------------------------------- × 100
before_overdue
```

## Estimated Asset Availability

```text
(available_time - maintenance_downtime)
--------------------------------------- × 100
available_time
```

These are planning simulation metrics and must be labeled accordingly.

---

# 56. Explainability Technical Design

Do not generate explanations from a black-box model.

Store structured reasons:

```python
RecommendationReason(
    code="CRITICALITY",
    weight=0.30,
    contribution=27.0,
    message="Critical asset"
)
```

The frontend converts them into readable text.

Example:

```text
Priority 91/100

Criticality       +30
Urgency           +18
Defect severity   +18
Asset impact      +14
Overdue           +8
Operations        +3
```

This provides transparent scoring.

---

# 57. AI/ML Boundary

## Deterministic

Use deterministic logic for:

- Safety constraints.
- Block feasibility.
- Train conflicts.
- Resource conflicts.
- Required block types.
- Priority calculation in MVP.
- Final validation.

## Optimization

Use OR-Tools/heuristic for:

- Task assignment.
- Block selection.
- Bundling.
- Schedule optimization.

## Optional ML

Only after enough historical data exists:

```text
duration prediction
delay prediction
failure risk
operational impact prediction
```

ML predictions must remain inputs to the planning engine, not replacements for safety rules.

---

# 58. Frontend State

Recommended:

```text
Server state → React Query/SWR
Local UI state → React state
Form state → React Hook Form
```

Avoid Redux unless the application becomes significantly more complex.

---

# 59. Design Requirements

Visual language should communicate:

```text
Railway operations
Reliability
Safety
Data-driven planning
```

Use:

- Clear status badges.
- Strong hierarchy.
- Dense but readable tables.
- Timeline visualization.
- Prominent conflicts.
- Clear distinction between:
  - AI recommendation
  - Planner modification
  - Approved plan

Avoid excessive animations.

---

# 60. Repository Structure

```text
automatic-block-planner/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── planning/
│   │   ├── optimization/
│   │   ├── rules/
│   │   ├── adapters/
│   │   └── auth/
│   ├── tests/
│   └── requirements.txt
│
├── data/
│   ├── maintenance_tms.csv
│   ├── maintenance_smms.csv
│   ├── maintenance_tdms.csv
│   ├── trains.csv
│   ├── goods_forecast.csv
│   └── block_windows.csv
│
├── docs/
│   ├── PRD.md
│   └── TRD.md
│
├── docker-compose.yml
├── README.md
└── .env.example
```

---

# 61. Docker Compose

Services:

```text
frontend
backend
postgres
```

That is sufficient.

Example:

```text
Browser
   |
   v
Frontend :3000
   |
   v
Backend :8000
   |
   v
PostgreSQL :5432
```

No Redis, Kafka, Elasticsearch, Kubernetes, or service mesh required for MVP.

---

# 62. Deployment

Suitable deployment options:

```text
Docker Compose VM
```

or:

```text
Frontend hosting
+
Backend container
+
Managed PostgreSQL
```

The application should support:

```text
development
staging/demo
production-like
```

through environment variables.

---

# 63. Observability

MVP:

- Application logs.
- Error logs.
- Request timing.
- Plan generation duration.
- Optimization duration.
- Number of tasks scheduled.
- Number of conflicts.

Example:

```text
PLAN_GENERATION
plan_id=abc
tasks=300
windows=120
solver_time=4.8s
scheduled=247
unscheduled=53
```

No full observability platform is required for SIH.

---

# 64. Backup / Recovery

For MVP:

- PostgreSQL database backup.
- Export generated plans to CSV/PDF.
- Preserve approved plan versions.

Important plan records should be immutable after approval except through a new version.

---

# 65. Plan Versioning

When a planner changes an approved plan:

```text
Plan v1 — APPROVED
       ↓
Plan v2 — DRAFT
```

Do not overwrite historical approved versions.

---

# 66. Data Integrity

Use database transactions for:

```text
plan generation
plan approval
plan version creation
task assignment
plan modification
```

If a plan operation fails:

```text
rollback
```

No partial plan should be committed.

---

# 67. Critical Safety Validation

Before approval:

```python
validate_plan(plan)

assert no_critical_conflicts(plan)
assert no_overlapping_incompatible_blocks(plan)
assert all_tasks_within_windows(plan)
assert all_dependencies_satisfied(plan)
assert all_block_types_valid(plan)
```

If validation fails:

```text
Approval disabled
```

and show the exact issue.

---

# 68. Security Boundary

The optimization service should never have direct access to:

```text
signalling control
traction control
field equipment
operational command systems
```

For the MVP, it only produces planning information.

---

# 69. External API Future Adapter

Future production architecture:

```text
TMS API
   ↓
TMS Adapter
   ↓
Canonical MaintenanceTask

SMMS API
   ↓
SMMS Adapter
   ↓
Canonical MaintenanceTask

TDMS API
   ↓
TDMS Adapter
   ↓
Canonical MaintenanceTask

COA API
   ↓
COA Adapter
   ↓
Canonical TrainMovement / BlockWindow
```

The planning engine remains unchanged.

This separation is important for maintainability.

---

# 70. Configuration

Create:

```text
config/
├── priority.yaml
├── constraints.yaml
└── optimization.yaml
```

Example:

```yaml
priority:
  criticality_weight: 0.30
  urgency_weight: 0.20
  defect_weight: 0.20
  asset_impact_weight: 0.15
  overdue_weight: 0.10
  operational_benefit_weight: 0.05
```

Configuration should be version-controlled for the demo.

---

# 71. API Security

Every non-public API should require authentication.

Example:

```text
Authorization: Bearer <token>
```

Authorization must be checked at service boundaries.

Never rely only on frontend route protection.

---

# 72. Rate Limiting

Not required for internal SIH demo.

If deployed publicly:

```text
100 requests/minute/user
```

can be introduced at the API gateway/reverse proxy.

Do not build a custom rate limiter for MVP.

---

# 73. Dependency Policy

Keep dependencies minimal.

Backend essentials:

```text
fastapi
uvicorn
sqlalchemy
psycopg
pydantic
pandas
ortools
pytest
reportlab
python-jose/passlib or equivalent auth libraries
```

Frontend essentials:

```text
next
react
tailwindcss
recharts
react-query
```

Pin production dependencies.

---

# 74. Development Workflow

```text
1. Create database
2. Run migrations
3. Load demo data
4. Start backend
5. Start frontend
6. Generate plan
7. Inspect conflicts
8. Run what-if
9. Approve
10. Export
```

---

# 75. Database Migration

Use Alembic.

Migration flow:

```text
models
  ↓
alembic revision
  ↓
migration
  ↓
alembic upgrade head
```

Do not manually edit production database schemas.

---

# 76. API Documentation

FastAPI should automatically expose:

```text
/api/docs
/api/redoc
```

Document:

- Request schema.
- Response schema.
- Authentication.
- Error responses.
- Example requests.

---

# 77. Frontend-to-Backend Contract

Use TypeScript interfaces matching Pydantic schemas.

Example:

```typescript
interface MaintenanceTask {
  id: string;
  department: "ENGINEERING" | "SNT" | "TRACTION";
  corridorId: string;
  priorityScore: number;
  estimatedDuration: number;
  status: string;
}
```

Avoid duplicating business logic in frontend.

The backend is authoritative for planning decisions.

---

# 78. Business Logic Ownership

## Backend

Owns:

- Priority scoring.
- Feasibility.
- Optimization.
- Conflict detection.
- KPI calculation.
- Approval validation.

## Frontend

Owns:

- Presentation.
- Filtering.
- User interaction.
- Scenario input.
- Visualization.

Never calculate a different "AI recommendation" in the frontend.

---

# 79. Failure Handling

If optimization fails:

```text
Do not produce a fake plan.
```

Return:

```text
Optimization failed
Reason
Fallback status
```

If a deterministic fallback is available:

```text
Fallback planner used
```

The UI should clearly identify the fallback.

---

# 80. Acceptance Tests

### Test 1

```text
Given:
Critical task + feasible window

Expect:
Task scheduled
```

### Test 2

```text
Given:
Task duration > block duration

Expect:
Task not scheduled
Reason = INSUFFICIENT_DURATION
```

### Test 3

```text
Given:
Incompatible train movement

Expect:
Block rejected
Reason = TRAIN_CONFLICT
```

### Test 4

```text
Given:
Two compatible tasks

Expect:
Tasks can be bundled
```

### Test 5

```text
Given:
Same crew assigned to overlapping blocks

Expect:
RESOURCE_CONFLICT
```

### Test 6

```text
Given:
No feasible window

Expect:
Task appears in exceptions
```

### Test 7

```text
Given:
What-if modification

Expect:
Scenario differs from baseline
Original plan unchanged
```

### Test 8

```text
Given:
Critical unresolved safety conflict

Expect:
Approval blocked
```

---

# 81. Definition of Technical Done

The technical MVP is complete when:

- [ ] Backend starts successfully.
- [ ] Frontend starts successfully.
- [ ] PostgreSQL schema is migrated.
- [ ] Demo data imports successfully.
- [ ] TMS/SMMS/TDMS records normalize into one schema.
- [ ] Train/block data is loaded.
- [ ] Priority engine produces scores.
- [ ] Block windows are generated/loaded.
- [ ] Hard constraints are enforced.
- [ ] Compatible tasks are bundled.
- [ ] Optimization produces a feasible plan.
- [ ] Weekly plan is generated.
- [ ] Monthly capacity view is generated.
- [ ] Conflicts are detected.
- [ ] Exceptions are generated.
- [ ] What-if simulation works.
- [ ] Planner can modify a draft.
- [ ] Approval validation works.
- [ ] Audit logs are created.
- [ ] CSV/PDF export works.
- [ ] Core unit/integration tests pass.
- [ ] No critical safety constraint can be bypassed through the UI.

---

# 82. Implementation Priority

If development time is limited, implement in this order:

```text
P0 — MUST HAVE

1. Data model
2. Demo data import
3. Priority engine
4. Block windows
5. Hard constraints
6. Optimization
7. Weekly plan
8. Conflict detection
9. Dashboard
10. Explainability

P1 — HIGH VALUE

11. What-if simulation
12. Monthly planning
13. Plan approval
14. Audit logs
15. Export

P2 — OPTIONAL

16. Map
17. Advanced ML
18. External API adapters
19. Real-time updates
20. Advanced resource optimization
```

---

# 83. Recommended Build Strategy

### Sprint 1

```text
Backend skeleton
Database
Models
Demo data
Import APIs
```

### Sprint 2

```text
Priority engine
Block feasibility
Conflict engine
```

### Sprint 3

```text
Optimization
Task bundling
Weekly plan
```

### Sprint 4

```text
Dashboard
Timeline
Recommendations
```

### Sprint 5

```text
What-if
Monthly view
Approval
Reports
```

### Sprint 6

```text
Testing
Polish
Demo data
SIH presentation
```

---

# 84. Final Technical Principle

The architecture should communicate one message:

> **Use AI/optimization where it creates planning value, deterministic rules where safety matters, and existing railway systems as data sources rather than replacing them.**

For the SIH prototype, a **modular monolith + PostgreSQL + FastAPI + Next.js + OR-Tools + explainable scoring** is sufficient.

Avoid adding infrastructure merely to make the architecture look advanced. The quality of the planning algorithm, constraint handling, explainability, and measurable improvement matters more than the number of technologies used.
