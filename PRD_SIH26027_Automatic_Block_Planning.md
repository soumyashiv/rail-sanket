# PRD — AI-Powered Automatic Block Planning for Indian Railways

**Challenge:** SIH26027  
**Ministry:** Ministry of Railways  
**Category:** Software  
**Theme:** Transportation & Logistics  
**Document status:** MVP / SIH Prototype PRD  
**Goal:** Build a practical, explainable AI-assisted system that coordinates maintenance block requests across Engineering, Traction Distribution, and Signal & Telecommunication while maximizing infrastructure availability and protecting train operations.

---

## 1. Product Vision

Transform decentralized and manual maintenance-block planning into a **single coordinated planning workflow** that combines:

- Maintenance defects and overdue work from TMS, SMMS, and TDMS
- Corridor/block availability from COA
- Train timetable and forecasted goods-train movement
- Maintenance duration, location, department, urgency, and criticality

The system produces **recommended weekly and monthly block plans**, explains why each activity was selected, detects opportunities to combine compatible work, and allows authorized planners to review, modify, approve, and export the final plan.

> **Important MVP principle:** AI recommends; railway planners remain in control. The prototype should be explainable and should never directly issue an operational block/disconnection without human approval.

---

## 2. Problem Statement

Current maintenance planning is fragmented across departments and systems. Engineering, Traction Distribution, and S&T independently submit block/disconnection requirements through BDMS. Maintenance information is also distributed across TMS, SMMS, and TDMS, while COA contains corridor availability and train-operation information.

This creates four core problems:

1. **Poor cross-department coordination** — compatible work may be planned separately instead of within the same block.
2. **Inefficient block utilization** — available block windows may be underutilized.
3. **Suboptimal maintenance prioritization** — urgent/critical work may compete with lower-impact requests without a unified priority model.
4. **Reduced asset availability** — unnecessary or poorly coordinated downtime can affect infrastructure availability and train operations.

---

## 3. Product Goals

### Primary goals

- Maximize **asset availability**.
- Minimize unnecessary **maintenance downtime**.
- Improve utilization of available block windows.
- Coordinate Engineering, S&T, and Traction maintenance.
- Prioritize work using criticality, urgency, safety impact, and operational impact.
- Generate weekly and monthly recommended block plans.
- Provide transparent reasons for every recommendation.
- Keep planners in control of final approval.

### Success indicators

The prototype should demonstrate:

- Higher percentage of available block time utilized productively.
- Lower avoidable asset downtime.
- More compatible maintenance tasks combined into the same block.
- Fewer conflicting block requests.
- Higher priority given to critical/overdue work.
- Faster preparation of a draft maintenance plan.

Exact production KPIs should be calibrated with railway domain experts and historical data.

---

## 4. Non-Goals — Avoid Over-Engineering

The MVP will **not** attempt to:

- Replace BDMS, TMS, SMMS, TDMS, or COA.
- Directly control railway signalling, traction equipment, or field assets.
- Automatically approve or issue real operational blocks.
- Build a nationwide railway digital twin.
- Train a complex deep-learning model without sufficient historical data.
- Implement real-time train control.
- Predict every possible infrastructure failure.
- Build a large microservice/Kubernetes architecture.
- Solve every railway department's workflow in the first release.

The MVP is a **decision-support and planning layer**.

---

## 5. Target Users

### Primary

**Divisional Maintenance Planner**
- Reviews maintenance tasks.
- Generates block plans.
- Resolves conflicts.
- Approves/rejects AI recommendations.

**Department Planner**
- Engineering
- S&T
- Traction Distribution

Reviews departmental work and proposed block grouping.

### Secondary

**Control Office / Operations Planner**
- Reviews operational impact.
- Provides corridor availability and train movement constraints.

**Senior Railway Manager**
- Views KPIs, exceptions, asset availability, and plan summaries.

---

## 6. Core User Journey

```text
Maintenance Data
TMS / SMMS / TDMS
        |
        v
   Data Normalization
        |
        +------ COA / Timetable / Goods Forecast
        |
        v
   Unified Work Queue
        |
        v
 AI Priority Scoring
        |
        v
 Block Window Detection
        |
        v
 Compatibility + Conflict Analysis
        |
        v
 Block Optimization
        |
        v
 Recommended Weekly / Monthly Plan
        |
        v
 Planner Review & What-If Changes
        |
        v
 Approve / Reject / Modify
        |
        v
 Export / Submit to Existing Workflow
```

---

# 7. Functional Requirements

## FR-01 — Unified Maintenance Work Queue

The system shall normalize maintenance activities from:

- TMS — track/engineering maintenance
- SMMS — signalling maintenance
- TDMS — traction distribution maintenance

For the prototype, these can be represented using CSV/API mock adapters.

### Minimum task fields

| Field | Description |
|---|---|
| task_id | Unique task identifier |
| source_system | TMS / SMMS / TDMS |
| department | Engineering / S&T / Traction |
| asset_id | Asset identifier |
| asset_type | Track / Signal / OHE / etc. |
| location | Section / station / chainage / location code |
| corridor_id | Relevant corridor |
| task_type | Maintenance / inspection / defect repair |
| criticality | Low / Medium / High / Critical |
| defect_severity | Optional severity |
| due_date | Required completion date |
| overdue_days | Calculated |
| estimated_duration | Expected block duration |
| required_block_type | Block / power block / signalling disconnection / etc. |
| crew/resource | Required resource |
| dependencies | Optional task dependencies |
| status | Open / Scheduled / Completed |

---

## FR-02 — Corridor & Train Availability

The system shall ingest or simulate:

- Timetable train movements.
- Passenger train occupancy.
- Goods-train forecast.
- Existing/planned blocks.
- Corridor availability.
- Station/section constraints.
- Operational blackout periods.

For the SIH prototype, a simplified corridor timetable dataset is sufficient.

---

## FR-03 — AI Maintenance Priority Score

Each task receives an explainable priority score.

### Suggested MVP formula

```text
Priority Score =
    0.30 × Criticality Score
  + 0.20 × Urgency Score
  + 0.20 × Safety/Defect Score
  + 0.15 × Asset Impact Score
  + 0.10 × Overdue Score
  + 0.05 × Operational Benefit Score
```

Weights should be configurable.

### Example

A critical signalling defect that is overdue and affects a high-importance corridor should rank above routine inspection work.

### Explainability

For every task, show:

> **Why is this task high priority?**

Example:

```text
Priority: 91/100 — CRITICAL

+ Critical asset
+ 14 days overdue
+ High defect severity
+ Affects high-traffic corridor
+ Can be completed in an available block window
```

---

# 8. Block Window Generation

The system shall identify feasible block windows using:

- Timetable gaps.
- Goods-train forecast.
- Existing blocks.
- Department requirements.
- Required duration.
- Corridor restrictions.
- Safety buffers.

Example:

```text
Corridor: C01
Date: 14 Oct
Available window: 11:30–13:30
Duration: 120 min

Candidate tasks:
- TMS-104 — Track inspection — 60 min
- SMMS-087 — Signal repair — 45 min
- TDMS-031 — OHE inspection — 30 min
```

The planner should be able to see why a window is considered feasible.

---

# 9. Multi-Department Task Bundling

The system shall identify tasks that can potentially share the same block.

### Compatibility criteria

Tasks can be grouped when they:

- Are in the same or compatible corridor/section.
- Have overlapping location requirements.
- Fit within the same block window.
- Do not have conflicting dependencies.
- Require compatible block/disconnection conditions.
- Do not violate safety constraints.

### Example

```text
Block Window: 11:30–13:30

Engineering
Track maintenance — 60 min

S&T
Signal maintenance — 45 min

Traction
OHE inspection — 30 min

Total planned work: 135 min
Available block: 120 min

Result:
Not feasible as one block.
System proposes:
Block A: Engineering + S&T = 105 min
Block B: Traction = next feasible window
```

The system must **never simply combine tasks because they occur near each other**. Basic compatibility rules must be satisfied.

---

# 10. Block Optimization

The optimizer should select a schedule that balances:

### Maximize

- Critical maintenance completed.
- Asset availability.
- Block utilization.
- Multi-department coordination.
- Overdue work reduction.

### Minimize

- Total asset downtime.
- Train-operation disruption.
- Idle block time.
- Unnecessary number of blocks.
- Conflicts and rescheduling.

### MVP optimization approach

Use a **constraint-based optimization / weighted scoring approach** rather than an unnecessarily complex AI model.

A practical objective can be:

```text
Maximize:

  Maintenance Value
+ Criticality Value
+ Block Utilization
+ Bundling Benefit
- Operational Disruption
- Asset Downtime
- Conflict Penalty
```

The exact implementation can use a lightweight optimization library such as OR-Tools, or a deterministic heuristic if library availability is constrained.

---

# 11. Hard Constraints

The optimizer must never violate:

1. Block window availability.
2. Task duration.
3. Required block type.
4. Task dependencies.
5. Safety constraints.
6. Corridor restrictions.
7. Operational blackout windows.
8. Resource availability where explicitly provided.
9. No overlapping incompatible work.
10. Required buffer before/after operations.

Hard constraints always override optimization preferences.

---

# 12. Soft Constraints

Where multiple valid plans exist, prefer:

- Higher criticality work.
- More overdue work.
- Higher asset impact.
- Better block utilization.
- More compatible tasks per block.
- Lower train disruption.
- Fewer separate blocks.
- Better resource utilization.

---

# 13. Weekly Planning

The weekly planner should show:

- Date.
- Corridor.
- Available block windows.
- Recommended blocks.
- Tasks inside each block.
- Department.
- Duration.
- Priority.
- Operational impact.
- Utilization percentage.
- Planner status.

Example:

```text
WEEKLY PLAN — 12–18 OCT

14 OCT
C01 | 11:30–13:15 | 87.5% utilized
  ✓ ENG-104 Track repair       60m
  ✓ SNT-087 Signal maintenance 45m

15 OCT
C02 | 14:00–15:00 | 100% utilized
  ✓ TD-031 OHE inspection      60m

Exceptions:
  ! ENG-221 overdue — no suitable window found
```

---

# 14. Monthly Planning

Monthly planning should provide a higher-level view:

- Maintenance backlog.
- Critical tasks.
- Expected block demand.
- Available capacity.
- Corridor-level availability.
- Department workload.
- Unscheduled critical work.
- Expected asset downtime.

The monthly plan can be less precise than the weekly operational plan.

---

# 15. Planner Dashboard

### KPI cards

- Asset Availability %
- Block Utilization %
- Critical Tasks Pending
- Overdue Tasks
- Planned Maintenance Hours
- Conflicts Detected
- Tasks Bundled

### Main views

1. **Plan Overview**
2. **Calendar / Timeline**
3. **Map / Corridor View**
4. **Maintenance Queue**
5. **AI Recommendations**
6. **Conflicts & Exceptions**
7. **What-If Simulator**
8. **Reports**

---

# 16. AI Recommendation Panel

For each proposed block:

```text
RECOMMENDED BLOCK

Corridor: C01
Date: 14 Oct
Time: 11:30–13:15

AI Confidence: High

Why recommended?
• 105 minutes of compatible work
• 87.5% block utilization
• Includes 1 high-criticality task
• Reduces estimated asset downtime
• No timetable conflict detected

Alternative:
15:00–16:45
Operational impact: Higher
```

The system should explain recommendations instead of presenting a black-box result.

---

# 17. What-If Simulator

Planner can modify:

- Block duration.
- Block time.
- Task priority.
- Task selection.
- Corridor.
- Train constraint.
- Department.

Then click:

**Recalculate Plan**

The system returns:

```text
Current Plan
Asset Availability: 96.1%
Block Utilization: 82%

Scenario Plan
Asset Availability: 97.0%
Block Utilization: 91%

Impact
+0.9% asset availability
+9% block utilization
1 additional block required
```

This is a high-value SIH demo feature.

---

# 18. Conflict Detection

The system should flag:

### Operational conflict

```text
BLOCK-023 overlaps with scheduled passenger movement.
```

### Resource conflict

```text
Same S&T crew assigned to two overlapping tasks.
```

### Corridor conflict

```text
Two incompatible maintenance activities request the same section.
```

### Capacity issue

```text
Requested work = 165 min
Available window = 120 min
```

Each conflict should include a suggested resolution.

---

# 19. Exceptions

The system should clearly surface work that cannot be scheduled.

Example:

```text
UNSCHEDULED CRITICAL TASK

Task: SMMS-221
Priority: 96/100
Reason:
No feasible block window in next 7 days.

Suggested action:
Request extended block / review operational constraints.
```

This is preferable to silently dropping tasks.

---

# 20. Data Architecture

Keep the architecture simple.

```text
             +------------------+
             | TMS / SMMS / TDMS|
             +--------+---------+
                      |
                      v
              +---------------+
              | Data Adapter   |
              | & Normalizer   |
              +-------+-------+
                      |
       +--------------+--------------+
       |                             |
       v                             v
Maintenance DB                Corridor/Train DB
       |                             |
       +--------------+--------------+
                      |
                      v
             +------------------+
             | Planning Engine  |
             |                  |
             | Priority Scoring |
             | Rules/Constraints|
             | Optimization     |
             +--------+---------+
                      |
                      v
             +------------------+
             | Planner API      |
             +--------+---------+
                      |
                      v
             +------------------+
             | Web Dashboard    |
             +------------------+
```

### Recommended MVP stack

**Frontend**
- React / Next.js
- Tailwind CSS
- Recharts or equivalent

**Backend**
- Python
- FastAPI

**Data**
- PostgreSQL for realistic prototype
- CSV import for demo datasets

**Optimization**
- OR-Tools or lightweight heuristic

**AI**
- Start with explainable scoring/rules.
- Optionally add a small ML model only if historical labeled data is available.

**Deployment**
- Docker
- One deployable backend + one frontend is enough.

Do not introduce microservices unless required.

---

# 21. Data Model

### MaintenanceTask

```text
id
source_system
department
asset_id
asset_type
corridor_id
location
task_type
criticality
defect_severity
due_date
overdue_days
estimated_duration
required_block_type
crew_id
dependencies
status
```

### TrainMovement

```text
id
train_no
date
corridor_id
section
arrival_time
departure_time
train_type
priority
forecast_confidence
```

### BlockWindow

```text
id
date
corridor_id
section
start_time
end_time
block_type
availability_status
operational_risk
```

### ScheduledBlock

```text
id
date
corridor_id
start_time
end_time
block_type
status
utilization
operational_impact
```

### ScheduledTask

```text
block_id
task_id
sequence
planned_start
planned_end
```

---

# 22. API Requirements

Minimal API surface:

```text
GET  /tasks
POST /tasks/import

GET  /corridors
GET  /train-movements

GET  /block-windows

POST /plans/generate
GET  /plans/{plan_id}

POST /plans/{plan_id}/recalculate
POST /plans/{plan_id}/approve
POST /plans/{plan_id}/reject

GET  /recommendations
GET  /conflicts

GET  /dashboard/kpis
```

No need for dozens of microservice APIs.

---

# 23. Plan Generation Logic

High-level algorithm:

```text
1. Load maintenance tasks.
2. Normalize task fields.
3. Calculate urgency and overdue metrics.
4. Calculate task priority score.
5. Load timetable and corridor constraints.
6. Generate feasible block windows.
7. Remove windows violating hard constraints.
8. Find compatible task combinations.
9. Score candidate schedules.
10. Optimize across candidate schedules.
11. Generate weekly plan.
12. Generate monthly capacity plan.
13. Identify unscheduled tasks.
14. Generate explanations and conflicts.
15. Present plan to planner.
```

---

# 24. Simple Pseudocode

```python
tasks = load_tasks()
trains = load_train_movements()
windows = generate_block_windows(trains)

for task in tasks:
    task.priority = calculate_priority(task)

candidates = []

for window in windows:
    compatible = [
        task for task in tasks
        if is_compatible(task, window)
    ]

    candidates.extend(
        build_task_combinations(compatible, window)
    )

plan = optimize(
    candidates,
    maximize=[
        "critical_tasks_completed",
        "block_utilization",
        "asset_availability",
        "bundling_benefit"
    ],
    minimize=[
        "operational_disruption",
        "asset_downtime",
        "idle_block_time",
        "conflicts"
    ]
)

return explain(plan)
```

---

# 25. Explainable AI Requirement

Every AI-assisted decision must be understandable.

The system should expose:

- Priority score.
- Top factors affecting priority.
- Why a block was selected.
- Why a task was not selected.
- Why two tasks were/weren't combined.
- Operational impact.
- Alternative windows.

Avoid claims such as:

> "The neural network decided this is optimal."

Prefer:

> "This plan was selected because it completes a critical overdue task, uses 91% of the available block, and avoids a scheduled passenger movement."

---

# 26. ML Strategy

### MVP

Use deterministic scoring + optimization.

This is intentional.

Railway maintenance datasets may not contain enough reliable historical labels for a sophisticated ML model. A transparent scoring model is easier to validate and demonstrate.

### Future ML layer

When historical data becomes available, ML can predict:

- Expected maintenance duration.
- Probability of task delay.
- Asset failure risk.
- Expected operational impact.
- Likelihood of a block being extended.
- Best time window.

ML should enhance the planner, not replace operational rules.

---

# 27. Security & Access

MVP requirements:

- Login/authentication.
- Role-based access:
  - Planner
  - Department Planner
  - Operations
  - Senior Viewer
- Audit trail for:
  - Plan generation
  - Manual changes
  - Approval/rejection
  - Block/task reassignment

Do not build enterprise IAM infrastructure for the prototype.

---

# 28. Safety Requirements

Safety has the highest priority.

The system must:

- Never override hard operational constraints.
- Never recommend an invalid block.
- Clearly distinguish AI recommendations from approved plans.
- Require human approval before finalization.
- Preserve an audit trail.
- Show conflicts rather than hiding them.
- Allow manual override with a reason.

A recommendation engine must be treated as **decision support**, not an autonomous railway control system.

---

# 29. Demo Dataset

For SIH demonstration, create synthetic but realistic data:

### Example scale

- 5 corridors
- 20 sections
- 300 maintenance tasks
- 50 critical/overdue tasks
- 1 week of train movements
- 1 month of planning capacity
- 100+ potential block windows

Include tasks from all three departments.

### Important demo cases

1. Critical overdue task.
2. Two departments needing the same corridor.
3. Tasks that can be bundled.
4. Task that cannot fit in a block.
5. Train conflict.
6. Resource conflict.
7. No feasible window.
8. What-if rescheduling.

---

# 30. MVP Screens

## Screen 1 — Dashboard

```text
Asset Availability     96.8%
Block Utilization      88.2%
Critical Pending       12
Overdue                37
Conflicts              8
Bundled Tasks          24
```

## Screen 2 — Maintenance Queue

Filters:

- Department
- Corridor
- Criticality
- Overdue
- Status

Columns:

```text
Task | Department | Asset | Corridor | Priority | Due | Duration | Status
```

## Screen 3 — Auto Block Planner

Timeline:

```text
08:00 | Train
09:00 | Available
10:00 | Available
11:30 | RECOMMENDED BLOCK █████████
13:15 | Train
14:00 | Available
```

## Screen 4 — Recommendation Detail

Shows tasks, score, utilization, impact, and explanation.

## Screen 5 — Conflicts

List conflicts with suggested actions.

## Screen 6 — What-If

Change a planning decision and compare KPIs.

## Screen 7 — Monthly Overview

Corridor and department-level maintenance capacity.

---

# 31. Reports

MVP export:

- Weekly block plan CSV/PDF.
- Monthly maintenance summary.
- Unscheduled critical tasks.
- Block utilization report.
- Asset availability report.
- Conflict report.

The exported plan should be clearly marked:

**DRAFT / AI-RECOMMENDED** until approved.

---

# 32. Acceptance Criteria

The MVP is successful when:

### Data

- [ ] Tasks from TMS, SMMS, and TDMS can be represented/imported.
- [ ] Train and corridor data can be loaded.
- [ ] Block windows can be generated.

### Intelligence

- [ ] Tasks receive explainable priority scores.
- [ ] Critical and overdue work is prioritized.
- [ ] Compatible tasks can be bundled.
- [ ] Invalid combinations are rejected.
- [ ] Candidate plans are scored/optimized.

### Planning

- [ ] Weekly plan is generated.
- [ ] Monthly plan/capacity view is generated.
- [ ] Conflicts are detected.
- [ ] Unscheduled tasks are reported.
- [ ] Planner can modify and recalculate a plan.

### UX

- [ ] Dashboard shows key KPIs.
- [ ] Timeline/calendar shows blocks.
- [ ] AI recommendations include explanations.
- [ ] What-if comparison works.
- [ ] Plan can be exported.

### Safety

- [ ] Human approval is required.
- [ ] Hard constraints cannot be overridden by optimization.
- [ ] Changes are auditable.

---

# 33. Key Product Metrics

The prototype should calculate:

### Block Utilization

```text
Planned Maintenance Time
------------------------ × 100
Available Block Time
```

### Critical Task Completion

```text
Critical Tasks Scheduled
----------------------- × 100
Critical Tasks Available
```

### Overdue Reduction

```text
Before Plan - After Plan
----------------------- × 100
Before Plan
```

### Asset Availability

A simplified prototype metric can estimate:

```text
Available Time - Maintenance Downtime
------------------------------------- × 100
Available Time
```

These metrics are for planning simulation and should not be presented as official railway operational KPIs without domain validation.

---

# 34. SIH Demonstration Story

The demo should tell one simple story.

### Step 1 — Current situation

Show:

```text
300 maintenance tasks
37 overdue
12 critical
Multiple departments requesting blocks
```

### Step 2 — Manual planning problem

Show conflicting requests:

```text
Engineering → 11:30–13:00
S&T         → 11:30–12:30
Traction    → 12:00–13:00
```

### Step 3 — AI analysis

System identifies:

```text
Compatible:
Engineering + S&T

Not compatible:
Traction due to block requirement
```

### Step 4 — Optimization

System creates:

```text
11:30–12:45
Engineering + S&T

13:30–14:15
Traction
```

### Step 5 — Result

Show:

```text
Block Utilization: 68% → 91%
Critical Tasks Completed: 7 → 10
Avoidable Downtime: reduced
Conflicts: reduced
```

### Step 6 — What-if

Planner changes a train constraint.

System instantly recalculates and proposes another feasible plan.

### Step 7 — Approval

Planner reviews explanations and approves the draft.

---

# 35. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Inconsistent source data | Normalize into a common schema |
| Insufficient historical ML data | Use explainable scoring for MVP |
| Incorrect recommendations | Enforce hard constraints |
| Operational complexity | Keep planner in control |
| Conflicting departmental priorities | Shared scoring + explicit priorities |
| No feasible window | Surface exception instead of hiding it |
| Over-engineering | Modular monolith architecture |
| Poor user trust | Explain every recommendation |

---

# 36. Future Enhancements

After MVP validation:

1. Real API integration with TMS/SMMS/TDMS/COA/BDMS.
2. Historical ML models.
3. Failure-risk prediction.
4. Better goods-train forecasting.
5. Crew/resource optimization.
6. Multi-division planning.
7. Real-time disruption replanning.
8. Mobile planner interface.
9. Advanced GIS/corridor visualization.
10. Integration with official railway approval workflows.

These are **future phases**, not MVP requirements.

---

# 37. Recommended Implementation Phases

## Phase 1 — Foundation

- Database schema.
- Synthetic data.
- Data normalization.
- Basic dashboard.

## Phase 2 — Planning Engine

- Priority scoring.
- Block window generation.
- Compatibility rules.
- Conflict detection.

## Phase 3 — Optimization

- Candidate schedule generation.
- Weighted optimization.
- Weekly plan.
- Monthly capacity plan.

## Phase 4 — Planner UX

- Timeline.
- Recommendation explanations.
- What-if simulator.
- Manual editing.

## Phase 5 — Demo & Validation

- KPI comparison.
- Export.
- Audit trail.
- SIH demo scenario.
- Performance and constraint testing.

---

# 38. Definition of Done

The MVP is considered complete when a planner can:

> **Import maintenance + train/corridor data → generate a prioritized work queue → automatically create feasible block recommendations → combine compatible departmental work → detect conflicts → compare alternatives → review AI explanations → modify the plan → approve/export the final draft.**

The solution should demonstrate that coordinated, explainable automation can improve block utilization and asset availability without replacing existing railway systems or operational decision-makers.

---

## Final Product Principle

**Simple architecture. Strong optimization. Explainable AI. Human approval.**

The winning prototype should focus on solving the actual planning problem rather than building a large technology stack.
