# SW 프로젝트 관리 실무 — PMBOK® Guide 8 기반
## Unified Baseline v2.6

> **Status:** Baseline  

> **Course ID:** project-management  
> **Duration:** 16h 운영 기준, 최대 960분  
> **Instructional time:** 약 800분 + 휴식 약 160분  
> **Time rule:** Topic은 동일 50분 단위가 아니다. 중요도·난이도·Case 통합 필요성에 따라 시간을 다르게 배분한다.  
> **Primary reference basis:** PMI, *The Standard for Project Management* + *A Guide to the Project Management Body of Knowledge (PMBOK® Guide) — Eighth Edition*  
> **Purpose:** PMP 시험 대비가 아니라 SW 프로젝트에서 원칙·성과 도메인·Focus Area·Process·Tailoring을 연결해 실제 관리 판단을 내리는 능력을 기른다.

---

# 1. Course Thesis

> **프로젝트 관리는 계획서와 산출물을 만드는 활동이 아니라, 조직 전략과 프로젝트를 연결하고 제한된 범위·시간·재무·자원과 불확실성 속에서 이해당사자와 함께 가치 있는 결과를 달성하도록 지속적으로 판단·조정·통제하는 활동이다.**

PMBOK 8을 과정 전체에서 다음 구조로 이해한다.

```text
Value
  ↑
6 Guiding Principles
  ↓
7 Performance Domains
  ×
5 Focus Areas
  ↓
40 Processes
  ↓
Tailoring
  ↓
Project Context
```

이 구조는 다음 질문을 연결한다.

```text
Principles
왜 / 어떤 기준으로 판단하는가?
        ↓
Performance Domains
무엇을 지속적으로 관리하는가?
        ↓
Focus Areas
언제 어떤 관리 활동에 집중하는가?
        ↓
Processes
구체적으로 무엇을 수행하는가?
        ↓
Tailoring
현재 프로젝트에서는 무엇을 얼마나 적용하는가?
```

---

## Learner & Context Fit

- **Audience / Work Context:** 프로젝트의 value·scope·schedule·risk·stakeholder 결정을 통합해야 하는 PM·리더.
- **Current Capability / Failure Mode:** 프로세스/산출물 준수나 개별 영역 최적화가 전체 project value를 보장한다고 오해한다.
- **Target Capability:** 전체 project system과 evidence를 기반으로 상황에 맞는 접근·계획·통제 결정을 내린다.
- **Decision Level:** Decide / Govern.
- **Transfer:** 수업 산출물과 판단을 실제 업무의 동일 유형 결정에 재사용할 수 있어야 한다.

## Foundational Decision Lens Alignment

- **APPLY:** Systems Thinking; Theory of Constraints; Empiricism / Scientific Thinking.
- **Why:** 부분 최적화 대신 whole project를 보고 핵심 constraint와 실제 evidence를 기준으로 재계획한다.
- **Rule:** 관련 없는 Lens를 과정 형식상 억지로 추가하지 않는다. Lens는 Course-owned concept를 재정의하지 않고 판단을 강화한다.

# 2. PMBOK 8의 핵심 변화

PMBOK 8은 원칙 중심 구조를 유지하면서 실무 적용성을 높이기 위해 다음을 결합한다.

- 6 Core Guiding Principles
- 7 Performance Domains
- 5 Project Management Focus Areas
- 40 non-prescriptive processes
- Tailoring
- Inputs / Outputs
- Tools & Techniques
- AI, PMO, Procurement 등 현대적 주제 보강

핵심 해석:

> **PMBOK 8은 Process로 회귀한 것이 아니라 Principle과 Process를 다시 연결했다.**

Process는 체크리스트가 아니라 **필요에 따라 Tailor하는 관리 building block**이다.

---

# 3. Course Ownership

이 과정이 소유하는 핵심 문제:

- 프로젝트를 왜 시작하는가?
- 어떤 가치와 결과를 달성해야 하는가?
- 누가 승인·결정·책임지는가?
- 무엇을 범위에 포함하고 제외하는가?
- 언제 무엇을 완료해야 하는가?
- 얼마의 비용과 예산이 필요한가?
- 어떤 사람·자원이 필요한가?
- 누구의 참여와 의사결정이 필요한가?
- 무엇이 계획을 실패하게 만들 수 있는가?
- 실제 성과가 계획과 어떻게 다른가?
- 변경을 어떻게 판단하고 승인하는가?
- 언제 계획을 변경해야 하는가?
- 프로젝트 결과를 운영과 조직에 어떻게 전환하는가?
- 어떤 관리 Practice를 얼마나 적용해야 하는가?

---

# 4. Boundary With Other Courses

## Agile owns

- uncertainty-driven adaptive delivery
- small increment
- backlog / feedback / adaptation
- Scrum operating structure

PM 과정에서는 Agile을 재교육하지 않는다.

PM의 질문:

> **이 프로젝트에서 Predictive / Adaptive / Hybrid 중 어떤 접근을 어디에 적용할 것인가?**

---

## SWQM owns

- quality risk
- prevention / verification
- quality evidence
- quality gate
- software quality improvement

PM 과정에서 `Embed Quality`와 `Manage Quality Assurance`는 다루지만 SW 품질기법 자체를 재교육하지 않는다.

PM의 질문:

> **Quality 활동을 프로젝트 계획·책임·성과·변경 의사결정에 어떻게 통합할 것인가?**

---

## DevOps owns

- delivery flow
- CI/CD
- deployment
- operations feedback
- recovery
- delivery performance

PM의 질문:

> **Delivery capability가 일정·비용·위험·소싱·변경 계획에 어떤 영향을 주는가?**

---

# 5. Course Reference Map

```text
                         VALUE DELIVERY
                              │
                    ┌─────────┴─────────┐
                    │                   │
               MINDSET              CONTEXT
                    │                   │
              6 PRINCIPLES          TAILORING
                    │                   │
                    └─────────┬─────────┘
                              │
                    7 PERFORMANCE DOMAINS
                              │
   Governance · Scope · Schedule · Finance
   Stakeholders · Resources · Risk
                              │
                              ×
                              │
                       5 FOCUS AREAS
                              │
 Initiating · Planning · Executing · Monitoring & Controlling · Closing
                              │
                              ↓
                         40 PROCESSES
                              │
                              ↓
                     Evidence & Decisions
                              │
                              ↓
                           VALUE
```

---

# 6. Part I — Project Management Foundation

## Topic 01. 프로젝트 관리와 Value Delivery System — 40m

### 핵심 내용
- Project의 특성
- Project / Program / Portfolio / Operations
- Organizational Strategy
- Value Delivery System
- Outcome / Benefit / Value
- Project Success
- Organizational Governance ↔ Project Governance
- EEF
- OPA
- Project / Product / Operation relationship

### Decision Question

> **이 프로젝트가 완료되면 무엇이 존재하는가가 아니라, 어떤 결과·편익·가치가 달라져야 하는가?**

### Failure Condition
- Schedule/Cost/Scope 완료만 Project Success로 정의
- Business Case와 Delivery가 분리
- 프로젝트 종료 후 Benefit owner 없음

---

# 7. Part II — Mindset and Guiding Principles

## Topic 02. Project Management Mindset — 20m

Mindset은 Process 이전의 행동 기준이다.

핵심:

```text
Proactive
Ownership
Value-Driven
```

### 핵심 메시지

> **PM은 계획을 관리하는 사람이 아니라 결과를 위해 필요한 판단을 선제적으로 만드는 사람이다.**

---

## Topic 03. 6 Guiding Principles — 40m

### P1. Adopt a Holistic View
전체 최적화.

질문:
> 한 영역의 최적화가 프로젝트 전체를 악화시키지 않는가?

### P2. Focus on Value
Output보다 Outcome과 Value.

질문:
> 이 결정이 실제 가치에 어떤 영향을 주는가?

### P3. Embed Quality into Processes and Deliverables
품질을 사후 검사하지 않고 과정과 결과에 내재화.

질문:
> 이 문제가 마지막 검사 전에 예방·확인될 수 있는가?

### P4. Be an Accountable Leader
직위보다 Accountability.

질문:
> 이 결정과 결과에 누가 책임지는가?

### P5. Integrate Sustainability within All Project Areas
프로젝트 기간 이후까지 영향 고려.

질문:
> 프로젝트 종료 이후 발생하는 비용·사회·환경·운영 영향을 고려했는가?

### P6. Build an Empowered Culture
필요한 권한을 의사결정 지점 가까이에 둔다.

질문:
> 이 결정을 실제 정보를 가진 사람이 적시에 내릴 수 있는가?

### 교육 원칙

```text
Principle ≠ Slogan
Principle = Decision Criterion
```

---

# 8. Part III — Development Approach, Life Cycle, Focus Areas

## Topic 04. Development Approach 선택 — 35m

### Predictive
높은 사전 예측 가능성, 상대적으로 안정적인 요구와 구조.

### Iterative
반복을 통해 해법을 정교화.

### Incremental
부분적으로 완성된 가치를 점진적으로 인도.

### Adaptive
짧은 Feedback과 지속적 조정.

### Hybrid
프로젝트 또는 구성요소별로 다른 접근 결합.

### Core Decision

> **미래를 더 정확히 예측하는 비용과 변화에 대응하는 비용 중 어느 쪽이 더 낮은가?**

### Tailoring Factors
- Requirement uncertainty
- Technical uncertainty
- Change cost
- Compliance
- Contract
- Stakeholder feedback availability
- Product criticality
- Delivery cadence
- Organizational capability

---

## Topic 05. 5 Focus Areas와 생명주기 — 25m

### Focus Areas

1. Initiating
2. Planning
3. Executing
4. Monitoring & Controlling
5. Closing

중요:

> **Focus Area는 Project Phase와 동일하지 않다.**

Predictive에서는 대체로:

```text
Initiating
→ Planning
→ Executing
↔ Monitoring & Controlling
→ Closing
```

Adaptive에서는:

```text
Initiate
→ High-level Plan
→ Execute
→ Monitor
→ Replan
→ Execute
→ Monitor
→ ...
→ Close
```

즉 Planning·Executing·Monitoring은 반복된다.

### Anchor

> **Focus Area는 순서표가 아니라 프로젝트 생명주기에서 필요한 관리 집중영역이다.**

---

# 9. Part IV — PMBOK 8 Integrated Structure

## Topic 06. 7 Performance Domains × 5 Focus Areas × 40 Processes — 20m

### Seven Performance Domains

1. Governance
2. Scope
3. Schedule
4. Finance
5. Stakeholders
6. Resources
7. Risk

### 40 Process Distribution

| Focus Area | Processes |
|---|---:|
| Initiating | 2 |
| Planning | 19 |
| Executing | 8 |
| Monitoring & Controlling | 10 |
| Closing | 1 |
| **Total** | **40** |

### Domain Distribution

| Domain | Processes |
|---|---:|
| Governance | 9 |
| Scope | 6 |
| Schedule | 3 |
| Finance | 4 |
| Stakeholders | 7 |
| Resources | 5 |
| Risk | 6 |
| **Total** | **40** |

### Important Shift From PMBOK 6

- Integration → largely Governance
- Procurement → sourcing under Governance + procurement guidance
- Communications → Stakeholders
- Quality → Guiding Principle + Governance + cross-domain concern
- Cost → Finance

핵심:

> **없어진 것이 아니라 재배치되거나 상위 원칙으로 이동한 것이다.**

---

# 10. Part V — Performance Domains

# Topic 07. Governance Performance Domain — 80m

Governance는 프로젝트 전체를 연결하는 중심 Domain이다.

## Processes

### Initiating
1. Initiate Project or Phase

### Planning
2. Integrate and Align Project Plans
3. Plan Sourcing Strategy

### Executing
4. Manage Project Execution
5. Manage Quality Assurance
6. Manage Project Knowledge

### Monitoring & Controlling
7. Monitor and Control Project Performance
8. Assess and Implement Changes

### Closing
9. Close Project or Phase

## Core Narrative

```text
Need / Business Case
→ Authorize
→ Align Plans
→ Source
→ Execute
→ Assure Quality / Use Knowledge
→ Measure
→ Assess Change
→ Close / Transition
```

## Core Decisions

- 프로젝트를 시작할 이유와 권한이 충분한가?
- Management Plan들이 서로 모순되지 않는가?
- 어떤 Work/Deliverable을 내부 수행하고 어떤 것을 외부 조달할 것인가?
- Quality가 프로젝트 시스템에 내재화되어 있는가?
- 현재 성과는 Value 달성 가능성을 보여주는가?
- 변경의 범위·일정·재무·자원·위험·이해당사자 영향을 통합 판단했는가?
- 종료 조건과 인수·전환이 명확한가?

## Core Practices
- Charter
- Business Case
- Integrated planning
- Governance decision rights
- Make-or-Buy
- Source selection
- Quality assurance
- Lessons learned / knowledge
- Performance reporting
- Integrated change
- Closure

## Failure Conditions
- 통합 계획서가 관리계획서 묶음에 불과함
- 계약/소싱이 Procurement 부서 문제로 분리
- 변경을 범위만 보고 승인
- 지식관리가 종료 시 Lessons Learned 문서 작성으로 끝남
- Closure가 행정 종료에 그침

---

# Topic 08. Stakeholders Performance Domain — 50m

## Processes

### Initiating
1. Identify Stakeholders

### Planning
2. Plan Stakeholder Engagement
3. Plan Communications Management

### Executing
4. Manage Stakeholder Engagement
5. Manage Communications

### Monitoring & Controlling
6. Monitor Stakeholder Engagement
7. Monitor Communications

## Core Narrative

```text
Identify
→ Analyze
→ Plan Engagement
→ Plan Communication
→ Engage / Communicate
→ Observe Response
→ Adapt
```

## Core Decision

> **누구에게 무엇을 알릴 것인가보다, 누구의 어떤 참여·행동·결정이 성공에 필요한가?**

## Techniques
- Stakeholder register
- Power / Interest
- Influence / Impact
- Engagement assessment
- Communication requirement
- Conflict management
- Negotiation
- Facilitation

## Failure Conditions
- Communication = 보고서 배포
- Stakeholder analysis = 최초 1회
- 영향력 높은 반대자를 늦게 발견
- 모든 Stakeholder에게 같은 정보를 같은 방식으로 제공

---

# Topic 09. Scope Performance Domain — 65m

## Processes

### Planning
1. Plan Scope Management
2. Elicit and Analyze Requirements
3. Define Scope
4. Develop Scope Structure

### Monitoring & Controlling
5. Monitor and Control Scope
6. Validate Scope

## Core Narrative

```text
Need
→ Requirement
→ Scope
→ Structure
→ Deliver
→ Validate
→ Change
```

## Predictive

```text
Requirements
→ Scope Definition
→ WBS / Scope Structure
→ Baseline
→ Validate / Control
```

## Adaptive

```text
Product Vision
→ Backlog
→ Prioritize
→ Increment
→ Feedback
→ Reprioritize
```

## Key Distinctions
- Requirement ≠ Scope
- Product Scope ≠ Project Scope
- Scope Verification/Quality check ≠ Scope Validation/Acceptance
- Change ≠ Scope Creep

## Core Decision

> **무엇을 해야 하는가만큼 무엇을 하지 않을 것인가가 명확한가?**

---

# Topic 10. Schedule Performance Domain — 50m

## Processes

### Planning
1. Plan Schedule Management
2. Develop Schedule

### Monitoring & Controlling
3. Monitor and Control Schedule

## Develop Schedule Logic

```text
Define Activities
→ Sequence
→ Estimate Effort / Duration
→ Resource / Constraint Adjustment
→ Schedule Model
→ Baseline / Forecast
```

## Core Topics
- Activity
- Dependency
- Milestone
- Critical Path
- Float
- Resource constraint
- Rolling-wave planning
- Forecast
- Schedule compression

### Awareness
- Fast Tracking
- Crashing

## Core Decision

> **계획된 종료일을 지키고 있는가가 아니라, 현재 정보로 언제 끝날 것으로 예측되는가?**

---

# Topic 11. Finance Performance Domain — 45m

## Processes

### Planning
1. Plan Financial Management
2. Estimate Costs
3. Develop Budget

### Monitoring & Controlling
4. Monitor and Control Finances

## Core Narrative

```text
Estimate
→ Budget
→ Baseline / Funding
→ Actual
→ Variance
→ Forecast
→ Decision
```

## Core Topics
- Cost estimate
- Basis of estimate
- Contingency reserve
- Management reserve
- Cost baseline
- Funding
- Actual cost
- Forecast

### Awareness
- Earned Value Management
- CPI / SPI
- EAC / ETC
- TCPI

## Core Decision

> **예산을 지켰는가보다 현재 남은 예산으로 남은 일을 완료할 수 있는가?**

---

# Topic 12. Resources Performance Domain — 45m

## Processes

### Planning
1. Plan Resource Management
2. Estimate Resources

### Executing
3. Acquire Resources
4. Lead the Team

### Monitoring & Controlling
5. Monitor and Control Resourcing

## Resource Categories
- Human
- Equipment
- Material
- Facility
- Service / specialist

## Core Topics
- Resource requirement
- Availability
- Allocation
- Responsibility
- Team formation
- Leadership
- Conflict
- Motivation
- Empowerment
- Physical resource control

### Awareness
- RACI / RAIC
- Emotional Intelligence
- Team development models

## Core Decision

> **자원을 배정했는가가 아니라 필요한 시점에 필요한 역량과 자원이 실제 사용 가능한가?**

---

# Topic 13. Risk Performance Domain — 70m

## Processes

### Planning
1. Plan Risk Management
2. Identify Risks
3. Perform Risk Analysis
4. Plan Risk Responses

### Executing
5. Implement Risk Responses

### Monitoring & Controlling
6. Monitor Risks

## Core Narrative

```text
Uncertainty
→ Identify
→ Analyze
→ Prioritize
→ Response
→ Implement
→ Monitor
→ New Information
→ Adapt
```

## Core Topics
- Threat / Opportunity
- Individual risk / overall project risk
- Risk appetite
- Risk threshold
- Known / Unknown
- RBS
- Probability × Impact
- Qualitative analysis
- Quantitative analysis orientation
- Risk owner
- Trigger
- Response
- Reserve
- Residual / secondary risk
- Emerging risk

## Threat Responses
- Avoid
- Mitigate
- Transfer
- Accept
- Escalate

## Opportunity Responses
- Exploit
- Enhance
- Share
- Accept
- Escalate

## Core Decision

> **Risk Register가 존재하는가가 아니라 Risk 정보가 Scope·Schedule·Finance·Sourcing·Architecture·Delivery 결정을 바꾸고 있는가?**

---

# 11. Part VI — Focus Area Integration

성과 Domain을 세로축으로 배운 뒤 Focus Area를 가로축으로 다시 연결한다.

## Topic 14. Initiating & Planning — 프로젝트 약속 만들기 — 35m

### Initiating — 2 Processes

```text
Governance
Initiate Project or Phase

Stakeholders
Identify Stakeholders
```

질문:

```text
Why?
Value?
Authority?
Who?
```

### Planning — 19 Processes

Planning은 문서를 많이 만드는 단계가 아니다.

```text
Scope
↔ Schedule
↔ Finance
↔ Resources
↔ Risk
↔ Stakeholders
      ↑
  Governance
```

### Anchor

> **Planning은 미래를 맞히는 활동이 아니라, 현재 정보로 실행 가능한 약속을 만들고 새로운 정보가 들어오면 갱신하는 활동이다.**

---

# Topic 15. Executing — 계획을 실제 성과로 전환 — 25m

Executing의 목적:

```text
Plan
→ Coordinated Action
→ Deliverable / Outcome
```

핵심 관점:
- Lead work
- Acquire / use resources
- Engage stakeholders
- Communicate
- Assure quality
- Manage knowledge
- Implement risk response

### Core Decision

> **사람들이 계획된 활동을 하고 있는가가 아니라 프로젝트가 필요한 결과를 만들어 내고 있는가?**

---

# Topic 16. Monitoring & Controlling — Evidence·Forecast·Change — 40m

Monitoring & Controlling은 보고가 아니다.

```text
Actual
→ Compare
→ Variance
→ Trend
→ Forecast
→ Impact
→ Decision
→ Change
```

### Cross-Domain Change Impact

```text
Change
  ↓
Scope
Schedule
Finance
Resources
Risk
Stakeholders
Quality
Sourcing
  ↓
Integrated Decision
```

### Core Decision

> **계획 대비 얼마나 틀렸는가보다, 현재 Evidence가 앞으로 어떤 결정을 요구하는가?**

### Failure Conditions
- Status reporting만 수행
- Red/Yellow/Green만 보고 원인·예측 없음
- Change request를 행정 승인으로 처리
- 이미 발생한 variance만 설명하고 forecast 없음

---

# Topic 17. Closing — 프로젝트 결과를 조직으로 전환 — 15m

Closing은 단순 행정 종료가 아니다.

```text
Complete
→ Validate / Accept
→ Transition
→ Contract / Resource Closure
→ Knowledge Capture
→ Benefit Ownership
→ Operations
```

### Core Decision

> **프로젝트 작업이 끝났는가가 아니라 Deliverable과 책임이 조직·사용자·운영에 실제로 전환되었는가?**

---

# 12. Part VII — Tailoring

## Topic 18. Tailoring — Context에 맞게 관리 강도 선택 — 35m

PMBOK 8의 Tailoring은 네 단계로 이해한다.

```text
1. Select Initial Development Approach
              ↓
2. Tailor for Organization
              ↓
3. Tailor for Project
              ↓
4. Implement Ongoing Improvement
```

Tailor 대상:
- Life cycle / development approach
- Processes
- Engagement
- Methods / artifacts / controls
- cadence
- formality
- decision rights

### Tailoring Factors
- size
- uncertainty
- complexity
- criticality
- regulation
- contract
- sourcing model
- stakeholder structure
- team capability
- organizational governance
- technology
- geographical distribution
- delivery cadence

### Anchor

> **Tailoring은 프로세스를 빼는 일이 아니라, 프로젝트의 가치와 위험에 맞춰 관리 강도와 방식을 결정하는 일이다.**

---

# 13. Part VIII — Integrated SW Project Case

## Topic 19. Integrated Case — 65m

### Case

12개월 기업 핵심 업무 시스템 구축.

조건:
- 내부 PM + 외부 개발사
- 일부 핵심 요구 불확실
- 예산/납기 제약
- 기존 Legacy 연계
- 개인정보/보안 요구
- 복수 사업부 Stakeholder
- 신규 기술 일부 적용
- 운영조직 별도
- 일부 기능은 단계적 Release 가능

### Step 1 — Value
- Business need?
- Expected outcomes?
- Success evidence?

### Step 2 — Principles
- 어떤 원칙이 충돌하는 결정을 해결하는가?

### Step 3 — Development Approach
- Predictive?
- Adaptive?
- Hybrid?
- 어디에 각각 적용?

### Step 4 — Seven Domains
각 Domain의 가장 중요한 판단 1개.

### Step 5 — Focus Areas
- 무엇을 Initiate?
- 무엇을 Plan?
- 무엇을 Execute?
- 무엇을 Monitor / Control?
- 무엇을 Close / Transition?

### Step 6 — Tailoring
- 강화할 프로세스
- 단순화할 프로세스
- 반복할 프로세스
- Evidence / review cadence

### Final Output

```text
Project Value
+ Development Approach
+ Governance Model
+ Domain Decisions
+ Top Risks
+ Integrated Baseline / Forecast
+ Change Decision Rule
+ Tailoring Decisions
+ Success Evidence
```

---

# 14. 40 Process Reference Map

## Governance — 9
1. Initiate Project or Phase — Initiating
2. Integrate and Align Project Plans — Planning
3. Plan Sourcing Strategy — Planning
4. Manage Project Execution — Executing
5. Manage Quality Assurance — Executing
6. Manage Project Knowledge — Executing
7. Monitor and Control Project Performance — Monitoring & Controlling
8. Assess and Implement Changes — Monitoring & Controlling
9. Close Project or Phase — Closing

## Scope — 6
10. Plan Scope Management — Planning
11. Elicit and Analyze Requirements — Planning
12. Define Scope — Planning
13. Develop Scope Structure — Planning
14. Monitor and Control Scope — Monitoring & Controlling
15. Validate Scope — Monitoring & Controlling

## Schedule — 3
16. Plan Schedule Management — Planning
17. Develop Schedule — Planning
18. Monitor and Control Schedule — Monitoring & Controlling

## Finance — 4
19. Plan Financial Management — Planning
20. Estimate Costs — Planning
21. Develop Budget — Planning
22. Monitor and Control Finances — Monitoring & Controlling

## Stakeholders — 7
23. Identify Stakeholders — Initiating
24. Plan Stakeholder Engagement — Planning
25. Plan Communications Management — Planning
26. Manage Stakeholder Engagement — Executing
27. Manage Communications — Executing
28. Monitor Stakeholder Engagement — Monitoring & Controlling
29. Monitor Communications — Monitoring & Controlling

## Resources — 5
30. Plan Resource Management — Planning
31. Estimate Resources — Planning
32. Acquire Resources — Executing
33. Lead the Team — Executing
34. Monitor and Control Resourcing — Monitoring & Controlling

## Risk — 6
35. Plan Risk Management — Planning
36. Identify Risks — Planning
37. Perform Risk Analysis — Planning
38. Plan Risk Responses — Planning
39. Implement Risk Responses — Executing
40. Monitor Risks — Monitoring & Controlling

---

## LLM-Integrated Practice Design

공통 `support/01_governance/12_llm-integrated-practice-standard.md`를 적용한다. **7개**, Day 1 3개 / Day 2 4개, 총 약 **160분**이며 기존 instructional time 안에 포함한다.

상세 Practice Pack: `support/02_course-assets/09_project-management/01_llm-integrated-practice-pack-v1.1.md`

| ID | Placement | Practice | Time | Core Decision |
|---|---|---|---:|---|
| P1 | T01/T04 | Value & Development Approach Decision | 20분 | 프로젝트 value와 uncertainty에 맞는 development approach는 무엇인가 |
| P2 | T07 | Governance & Decision Rights | 25분 | 어떤 의사결정권·승인·escalation 구조가 필요한가 |
| P3 | T08/T09 | Stakeholder + Scope Alignment | 20분 | stakeholder 기대와 scope boundary를 어떻게 함께 관리할 것인가 |
| P4 | T10/T12 | Schedule / Resource Trade-off | 25분 | 일정 압박 시 scope/resource/sequence를 어떻게 조정할 것인가 |
| P5 | T13 | Risk Response Decision | 25분 | 위험별로 어떤 response가 경제적인가 |
| P6 | T16 | Evidence / Forecast / Integrated Change | 20분 | 변경 요청이 7 domains에 미치는 영향을 어떻게 통합 판단할 것인가 |
| P7 | T18/T19 | Tailor the Management System | 25분 | 어떤 관리 practice를 유지/경량화/제거할 것인가 |

운영은 `Learner Prompt → First Run → Instructor Intervention → Keep Going → Recommended Prompt Reveal → Compare/Adapt` 순서다. Recommended Prompt는 정답이 아니며, 평가는 Prompt 문장력이 아니라 해당 과정의 전문적 판단 Evidence를 기준으로 한다.

# 15. Topic-Based Curriculum — 800 Instructional Minutes

> **Authority:** 아래 시간표가 과정 운영의 단일 정본이다. Topic은 50분 운영 블록과 동일하지 않으며 필요하면 휴식 경계를 가로질러 이어진다.

| # | Topic | Time |
|---:|---|---:|
| 01 | 프로젝트 관리와 Value Delivery System | 40m |
| 02 | Project Management Mindset | 20m |
| 03 | 6 Guiding Principles | 40m |
| 04 | Development Approach 선택 | 35m |
| 05 | 5 Focus Areas와 생명주기 | 25m |
| 06 | 7 Domains × 5 Focus Areas × 40 Processes 통합 지도 | 20m |
| 07 | Governance | 80m |
| 08 | Stakeholders | 50m |
| 09 | Scope | 65m |
| 10 | Schedule | 50m |
| 11 | Finance | 45m |
| 12 | Resources | 45m |
| 13 | Risk | 70m |
| 14 | Initiating & Planning 통합 | 35m |
| 15 | Executing | 25m |
| 16 | Monitoring & Controlling | 40m |
| 17 | Closing | 15m |
| 18 | Tailoring | 35m |
| 19 | Integrated SW Project Case | 65m |
|  | **Total instructional time** | **800m** |

운영 기준:

```text
800m instruction
+ 약 160m break
= 960m / 16h
```

Domain Topic에서 개별 Process의 의미를 다루고, Focus Area 통합 Topic에서는 동일 내용을 반복 설명하지 않고 **cross-domain 의사결정과 lifecycle 상호작용**만 재정박한다.

---

# 16. Learning Outcomes

수강 후 학습자는 다음을 할 수 있어야 한다.

1. 프로젝트의 Output, Outcome, Benefit, Value를 구분한다.
2. PMBOK 8의 6개 원칙을 실제 의사결정 기준으로 적용한다.
3. Predictive / Iterative / Incremental / Adaptive / Hybrid 접근을 프로젝트 맥락에 맞게 선택한다.
4. 7개 Performance Domain의 책임과 상호작용을 설명한다.
5. 5개 Focus Area를 Project Phase가 아니라 반복 가능한 관리 집중영역으로 이해한다.
6. 40개 Process를 암기하는 대신 Domain × Focus Area 맥락에서 필요한 Process를 선택한다.
7. Scope·Schedule·Finance·Resources·Risk 간 상호 영향을 분석한다.
8. Stakeholder 참여와 Communication을 보고가 아닌 행동·의사결정 관리로 설계한다.
9. 변경 요청에 대해 통합 영향분석을 수행한다.
10. 프로젝트 상황에 맞게 Process와 관리 강도를 Tailor한다.
11. Evidence와 Forecast를 기반으로 프로젝트 관리 결정을 내린다.
12. SW 프로젝트에 PMBOK 8을 적용한 통합 관리방안을 수립한다.

---

# 17. Anti-Patterns

1. PMBOK 40 Process 암기 교육
2. ITTO 암기 중심 교육
3. 모든 프로젝트에 모든 Process 동일 적용
4. Planning = 문서 작성
5. Project Success = Scope/Cost/Schedule 준수
6. Change = 실패
7. Risk Register 작성 후 방치
8. Stakeholder Management = 보고
9. Governance = 승인 단계 증가
10. Quality = 테스트팀 책임
11. Procurement = 구매부서 책임
12. Schedule = Gantt chart
13. Finance = 예산 집행 확인
14. Resource = 인원 수
15. Monitoring = 실적 보고
16. Tailoring = Process 삭제
17. Adaptive = 계획 없음
18. Hybrid = 아무 방법이나 혼합
19. PM = 일정 추적자
20. 산출물 존재 = 관리 수행

---

# 18. Explicit Non-Scope

- PMP 시험 대비
- ITTO 암기
- 모든 Tool & Technique 상세
- EVM 계산 집중 훈련
- CPM 계산 집중 훈련
- Monte Carlo 실습
- Scrum 상세
- Jira / MS Project 사용법
- Procurement 계약법 상세
- 조직 PMO 운영 상세
- Agile Coach / Scrum Master 역할 교육
- SWQM 품질기법 재교육
- DevOps delivery pipeline 재교육

필요한 것은 개념·판단·대표 기법 수준에서 다룬다.

---

# 19. Quality Gate

과정 승인 전 모두 YES여야 한다.

- Value가 Scope/Cost/Schedule보다 상위에 있는가?
- 6 Principles가 암기 항목이 아니라 판단 기준인가?
- 7 Performance Domains가 과정의 세로축인가?
- 5 Focus Areas가 과정의 가로축인가?
- Focus Area와 Project Phase를 혼동하지 않는가?
- 40 Process를 비규범적 building block으로 설명하는가?
- Predictive / Adaptive / Hybrid 모두 적용 가능한가?
- Governance가 단순 승인체계로 축소되지 않는가?
- Quality를 별도 소유 Domain처럼 잘못 복원하지 않는가?
- Procurement가 사라졌다고 설명하지 않는가?
- Communication이 사라졌다고 설명하지 않는가?
- Change impact가 cross-domain으로 분석되는가?
- Monitoring에 Forecast가 포함되는가?
- Tailoring이 핵심 역량으로 다뤄지는가?
- SWQM / Agile / DevOps Course Ownership을 침범하지 않는가?
- Topic 시간이 동일 50분으로 강제되지 않는가?
- 순수 학습시간이 약 800분인가?
- 총 운영시간이 960분 이내인가?

---


LLM-integrated Practice 추가 Gate:
- Course duration에 맞는 Practice 수와 cadence를 충족하는가?
- 모든 Practice가 기존 instructional time 안에 포함되는가?
- Recommended Prompt 없이 시작하고 Intervention 후 Keep Going하는가?
- Prompt Engineering이 아니라 Course-owned decision/evidence를 평가하는가?
- Practice 때문에 기존 Course Ownership 경계가 이동하지 않는가?
# 20. Final Course Message

> **좋은 프로젝트 관리는 PMBOK 프로세스를 많이 수행하는 것이 아니라, 가치와 맥락을 이해하고 원칙에 따라 판단하며 필요한 관리 활동을 적절한 강도로 적용하고 Evidence에 따라 계속 조정하는 것이다.**

최종 질문:

> **“PMBOK에서 무엇을 해야 하는가?”가 아니라  
> “이 프로젝트에서 무엇을 왜 관리해야 하며, 어떤 Evidence를 보고 언제 계획과 행동을 바꿀 것인가?”**
