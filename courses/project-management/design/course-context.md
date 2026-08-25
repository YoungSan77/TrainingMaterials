# SW Project Management Course Context

> **Course ID:** project-management
> **파이프라인 자리:** `Portfolio Design(portfolio/) + 과정 설계 지침(guides/과정_설계_지침.md) + References + Human↔LLM → Course Design(courses/project-management/design/)`.
> **권위 순서:** `portfolio/*.md`(Portfolio Canon) > 이 Course Design. legacy context v2.6은 migration provenance이며 현재 권위·입력이 아니다.
> **Primary reference basis (Baseline 원문 그대로):** PMI, *The Standard for Project Management* + *A Guide to the Project Management Body of Knowledge (PMBOK® Guide) — Eighth Edition*.
> **Greenfield 상태:** 이 과정은 아직 실제 `curriculum.md`가 없다 — OOAD/DDD/SW Architecture/MSA/Modern SWQM처럼 기존 Curriculum과 병행 작성하는 것이 아니라, 이 Course Design(승인 대상)이 향후 `courses/project-management/curriculum.md`(Stage 2) 작성의 선행 조건이 된다(`guides/과정_설계_지침.md` §6). 이 문서는 세션 번호·시간표·구체 커리큘럼 구조를 소유하지 않는다 — Baseline §15의 시간표는 Curriculum 저작 시점의 참고 입력일 뿐, 이 문서는 intended progression / topic priority / sequencing rationale / coverage intent만 프로즈로 가져온다(`guides/과정_설계_지침.md` §2-a).

---

## 1. Course Purpose

SW Project Management는 **프로젝트 관리를 계획서·산출물 생산 활동이 아니라, 조직 전략과 프로젝트를 연결하고 제한된 범위·시간·재무·자원과 불확실성 속에서 이해당사자와 함께 가치 있는 결과를 달성하도록 지속적으로 판단·조정·통제하는 활동**으로 가르친다(Course Thesis, Baseline §1). 이 과정이 소유하는 핵심 문제는 다음이다(Baseline §3):

- 프로젝트를 왜 시작하는가? 어떤 가치와 결과를 달성해야 하는가?
- 누가 승인·결정·책임지는가?
- 무엇을 범위에 포함하고 제외하는가? 언제 무엇을 완료해야 하는가?
- 얼마의 비용과 예산, 어떤 사람·자원이 필요한가?
- 누구의 참여와 의사결정이 필요한가?
- 무엇이 계획을 실패하게 만들 수 있는가? 실제 성과가 계획과 어떻게 다른가?
- 변경을 어떻게 판단·승인하며, 언제 계획을 바꿔야 하는가?
- 프로젝트 결과를 운영과 조직에 어떻게 전환하는가?
- 어떤 관리 Practice를 얼마나 적용해야 하는가(Tailoring)?

PMP 시험 대비가 아니라, PMBOK 8의 **Principle ↔ Performance Domain ↔ Focus Area ↔ Process ↔ Tailoring** 연결을 실제 SW 프로젝트 관리 판단에 사용하는 능력을 기른다(Baseline 상단 Purpose).

## 2. Target Learner

**Learner & Context Fit** (Baseline "Learner & Context Fit" 절 그대로 가져옴 — 요약·재작성하지 않음, `guides/과정_설계_지침.md` §3):

- **Audience / Work Context:** 프로젝트의 value·scope·schedule·risk·stakeholder 결정을 통합해야 하는 PM·리더.
- **Current Capability / Failure Mode:** 프로세스/산출물 준수나 개별 영역 최적화가 전체 project value를 보장한다고 오해한다.
- **Target Capability:** 전체 project system과 evidence를 기반으로 상황에 맞는 접근·계획·통제 결정을 내린다.
- **Decision Level:** Decide / Govern.
- **Transfer:** 수업 산출물과 판단을 실제 업무의 동일 유형 결정에 재사용할 수 있어야 한다.

## 3. Capability Gap

학습자는 대체로 다음 격차를 갖고 수강을 시작한다(Baseline §1 Failure Mode, §17 Anti-Patterns 역추정):

- Project Success를 Scope/Cost/Schedule 준수로만 정의하고, Business Case·Benefit과 Delivery를 분리해서 본다.
- Planning을 "문서를 많이 만드는 활동"으로 오해하고, Governance를 승인 단계 증가로 오해한다.
- 40개 Process를 규범적 체크리스트/ITTO 암기 대상으로 접근하려 한다.
- Change를 실패로 인식하고, Risk Register를 작성 후 방치한다.
- Stakeholder Management와 Communication을 단방향 보고로 축소한다.

## 4. Typical Failure

Baseline §17 Anti-Patterns 중 이 과정이 반드시 교정해야 하는 대표 실패 양식(원문 그대로):

1. PMBOK 40 Process 암기 교육 / ITTO 암기 중심 교육
2. 모든 프로젝트에 모든 Process 동일 적용
3. Planning = 문서 작성
4. Project Success = Scope/Cost/Schedule 준수
5. Change = 실패
6. Risk Register 작성 후 방치
7. Stakeholder Management = 보고
8. Governance = 승인 단계 증가
9. Quality = 테스트팀 책임 / Procurement = 구매부서 책임
10. Schedule = Gantt chart / Finance = 예산 집행 확인 / Resource = 인원 수
11. Monitoring = 실적 보고 (Forecast 없음)
12. Tailoring = Process 삭제
13. Adaptive = 계획 없음 / Hybrid = 아무 방법이나 혼합
14. PM = 일정 추적자
15. 산출물 존재 = 관리 수행

## 5. Target Capability

수강 후 학습자는 다음을 할 수 있어야 한다(Baseline §16 Learning Outcomes, 원문 그대로):

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

## 6. Course Thesis / Narrative

> **프로젝트 관리는 계획서와 산출물을 만드는 활동이 아니라, 조직 전략과 프로젝트를 연결하고 제한된 범위·시간·재무·자원과 불확실성 속에서 이해당사자와 함께 가치 있는 결과를 달성하도록 지속적으로 판단·조정·통제하는 활동이다.** (Baseline §1, 원문)

**Core Narrative** (Baseline §1 / §5 Course Reference Map):

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

```text
Principles          왜 / 어떤 기준으로 판단하는가?
        ↓
Performance Domains  무엇을 지속적으로 관리하는가?
        ↓
Focus Areas          언제 어떤 관리 활동에 집중하는가?
        ↓
Processes            구체적으로 무엇을 수행하는가?
        ↓
Tailoring            현재 프로젝트에서는 무엇을 얼마나 적용하는가?
```

핵심 해석(Baseline §2, 원문):

> **PMBOK 8은 Process로 회귀한 것이 아니라 Principle과 Process를 다시 연결했다.** Process는 체크리스트가 아니라 필요에 따라 Tailor하는 관리 building block이다.

**Important Shift From PMBOK 6** (Baseline §9, 원문 — "없어진 것이 아니라 재배치된 것" 프레임을 course-context에서도 유지):

- Integration → largely Governance
- Procurement → sourcing under Governance + procurement guidance
- Communications → Stakeholders
- Quality → Guiding Principle + Governance + cross-domain concern
- Cost → Finance

**Intended Progression (baseline coverage intent — 세션 번호 아님, 서술적 진행 의도만, `guides/과정_설계_지침.md` §2-a):**

Baseline은 과정을 크게 다음 국면으로 진행하도록 의도한다.

- **Foundation & Mindset 국면:** Value Delivery System과 Project/Program/Portfolio/Operations 구분에서 출발해, 6 Guiding Principles를 슬로건이 아니라 판단 기준으로 정박한다(Baseline §6–§7).
- **Approach & Structure 국면:** Development Approach(Predictive/Iterative/Incremental/Adaptive/Hybrid) 선택 판단과 5 Focus Area, 7 Domain × 5 Focus Area × 40 Process의 통합 지도를 세운다(Baseline §8–§9). 이 국면은 뒤따르는 Domain별 깊은 학습의 좌표계를 만드는 역할이다.
- **Performance Domains 국면(세로축, 가장 무거움):** Governance(중심 통합 Domain) → Stakeholders → Scope → Schedule → Finance → Resources → Risk 순으로 각 Domain의 Process·Core Narrative·Core Decision·Failure Condition을 깊게 다룬다(Baseline §10). Baseline의 시간 배분(Governance 80m, Risk 70m, Scope 65m 등)이 보여주듯 이 블록이 과정의 핵심 anchor다.
- **Focus Area Integration 국면(가로축):** 이미 배운 7개 Domain을 Initiating & Planning → Executing → Monitoring & Controlling → Closing 축으로 다시 연결하되, Domain Topic에서 다룬 내용을 반복 설명하지 않고 **cross-domain 의사결정과 lifecycle 상호작용**만 재정박한다(Baseline §11, §19 마지막 문단).
- **Tailoring & Integration 국면:** Tailoring(4단계: Select Initial Approach → Tailor for Organization → Tailor for Project → Ongoing Improvement)과 12개월 통합 SW Project Case로 과정을 닫는다(Baseline §12–§13).

이 진행 순서(sequencing rationale)는 "Value가 Scope/Cost/Schedule보다 상위, Principle이 슬로건이 아닌 판단 기준, Domain(무엇)과 Focus Area(언제)를 별도 축으로 다룬 뒤 통합, Process는 비규범적 building block, Tailoring이 핵심 역량"이라는 Course Thesis를 시간 축으로 구현한 것이다(Baseline §19 Quality Gate와 일치). **세션 번호·정확한 시간 배분·실제 topic 개수는 향후 `courses/project-management/curriculum.md`가 소유할 정본이며, 이 문서는 이를 복제하지 않는다.**

**Topic Priority (Baseline이 명시한 무게 배분 의도):** 7 Performance Domains 블록(Governance·Stakeholders·Scope·Schedule·Finance·Resources·Risk, Baseline §10)이 과정에서 가장 무거운 topic priority를 가진다(Governance 80m·Risk 70m·Scope 65m로 Baseline §15 시간표가 명시). Focus Area Integration 국면은 Domain 내용을 반복하지 않고 cross-domain 판단만 다루므로 상대적으로 가볍다(Executing 25m·Closing 15m). Foundation/Mindset·Tailoring·Integrated Case는 각각 좌표계를 세우거나 과정을 통합·마무리하는 역할이다.

## 7. Decisions Learner Must Make

(Baseline §3 Course Ownership 질문 목록, 원문 그대로 — §1 Course Purpose와 동일 목록을 판단 프레임으로 재사용)

1. 프로젝트를 왜 시작하는가? 어떤 가치와 결과를 달성해야 하는가?
2. 누가 승인·결정·책임지는가?
3. 무엇을 범위에 포함하고 제외할 것인가?
4. 언제 무엇을 완료해야 하는가?
5. 얼마의 비용과 예산이 필요한가?
6. 어떤 사람·자원이 필요한가? 누구의 참여와 의사결정이 필요한가?
7. 무엇이 계획을 실패하게 만들 수 있는가?
8. 실제 성과가 계획과 어떻게 다른가?
9. 변경을 어떻게 판단하고 승인할 것인가? 언제 계획을 변경해야 하는가?
10. 프로젝트 결과를 운영과 조직에 어떻게 전환할 것인가?
11. 어떤 관리 Practice를 얼마나 적용해야 하는가?
12. (Baseline §8 Development Approach) 이 프로젝트에서 Predictive / Adaptive / Hybrid 중 어떤 접근을 어디에 적용할 것인가?

## 8. OWNER / APPLY / RECAP / FORWARD / NON-SCOPE

`portfolio/concept-ownership.md` "Current Concept Owners → SW Project Management"의 구체화다.

### OWNER (정의·기원·판단·적용조건·Trade-off·실패조건까지 정본 교육)

- Project value / governance / control
- PMBOK 8 Principle ↔ Performance Domain ↔ Focus Area ↔ Process reasoning
- Scope / Schedule / Finance / Resource / Risk integration
- Integrated change impact and forecast
- Project-context Tailoring
- 6 Guiding Principles (Baseline §7), 7 Performance Domains 각각의 Process·Core Decision·Failure Condition (Baseline §10)
- Development Approach **선택 판단**(어떤 프로젝트/컴포넌트에 Predictive/Adaptive/Hybrid를 적용할 것인가) — 단, 그 정의·용어 자체의 OWNER는 Agile이다(아래 RECAP/APPLY 참고)

### RECAP / APPLY (OWNER 정의를 바꾸지 않고 PM 판단에 사용)

- **Predictive / Iterative / Incremental / Adaptive 구분(용어 정의)** — `portfolio/concept-ownership.md` §16A에서 Agile OWNER로 명시. PM은 이 정의를 재정의하지 않고 프로젝트 접근 선택 판단에 RECAP/APPLY한다.
- **Quality 통합 판단** — `Embed Quality`(Principle)와 `Manage Quality Assurance`(Governance Process)는 PM이 다루지만, SW 품질기법 자체는 SWQM OWNER다(Baseline §4). PM의 질문은 "Quality 활동을 프로젝트 계획·책임·성과·변경 의사결정에 어떻게 통합할 것인가?"로 한정한다.
- **Delivery capability의 계획 영향** — DevOps가 delivery flow/CI-CD/deployment/operations feedback을 OWNER로 소유한다(Baseline §4). PM의 질문은 "Delivery capability가 일정·비용·위험·소싱·변경 계획에 어떤 영향을 주는가?"로 한정한다.
- Requirement/Scope 입력으로서의 요구 elicitation 기본 개념(상세 기법 자체는 비소유)

### FORWARD (후속/인접 과정에서 다룰 개념의 필요성만 예고, 정본 교육하지 않음)

- Adaptive delivery mechanics(backlog·sprint·increment 운영)의 상세 실행 → Agile
- CI/CD·deployment·recovery의 delivery flow 상세 → DevOps
- Quality evidence/gate 설계 상세 → SWQM
- 프로젝트 산출물이 Proposal의 customer decision argument로 재사용되는 경로 → SW Proposal(`portfolio/concept-ownership.md` "SW Proposal Boundary": "PM owns detailed project planning/control")

### NON-SCOPE (Baseline §18 Explicit Non-Scope, 원문 그대로)

- PMP 시험 대비
- ITTO 암기
- 모든 Tool & Technique 상세
- EVM 계산 집중 훈련 / CPM 계산 집중 훈련 / Monte Carlo 실습
- Scrum 상세
- Jira / MS Project 사용법
- Procurement 계약법 상세
- 조직 PMO 운영 상세
- Agile Coach / Scrum Master 역할 교육
- SWQM 품질기법 재교육
- DevOps delivery pipeline 재교육

필요한 것은 개념·판단·대표 기법 수준에서만 다룬다(Baseline §18).

## 9. Key Distinctions

`portfolio/terminology.md` 및 Baseline 중 이 과정에 해당하는 쌍:

| A | B | 핵심 차이 |
|---|---|---|
| Performance Domain (PMBOK 8) | Focus Area (PMBOK 8) | 지속적으로 관리해야 하는 성과 영역(무엇) vs 생애주기에서 관리 노력이 집중되는 영역(언제) — `portfolio/terminology.md` |
| Focus Area | Project Phase | 관리 집중영역 vs 순차적 project phase; 동일하지 않으며 Predictive/Adaptive/Hybrid에 따라 중첩·반복 가능(terminology.md, Baseline §8 Topic 05) |
| Predictive | Adaptive | 사전 예측·계획 후 실행 관리 vs 새 Evidence/Feedback에 따라 다음 계획을 조정 — 정의 OWNER는 Agile(`portfolio/terminology.md` §H2), PM은 approach 선택 판단에 APPLY |
| Requirement | Scope | 요구 표현 vs 합의된 작업 경계(Baseline Topic09 Key Distinctions) |
| Product Scope | Project Scope | 산출물 자체의 범위 vs 그 산출물을 만들기 위한 project 작업 범위 |
| Scope Verification/Quality check | Scope Validation/Acceptance | 품질 기준 충족 확인 vs 고객/스폰서의 공식 인수 |
| Change | Scope Creep | 통합 영향분석을 거친 통제된 변경 결정 vs 승인 없는 범위 확장(Baseline Topic09, Anti-Pattern #6) |
| Output | Outcome / Benefit / Value | 산출물의 존재 vs 조직·이해당사자에게 실제로 발생한 결과·편익·가치(Baseline §1 Topic01 Decision Question) |
| Process (40개) | ITTO 암기 체크리스트 | 비규범적 관리 building block vs 규범적 절차 암기(Baseline §2, §18) |

## 10. Course-specific Principles

`portfolio/principles.md` §C9 (Project Value & Governance — SW Project Management)의 Child Principle 목록. **Primary Parent Lenses: Systems Thinking / Theory of Constraints / Empiricism**(principles.md §C9, Baseline "Foundational Decision Lens Alignment"와 일치).

| Principle | Baseline Anchor | 핵심 판단 |
|---|---|---|
| PM-01. Adopt a Holistic View | Baseline Topic03 P1 | 한 영역의 최적화가 프로젝트 전체 value와 outcome을 악화시키지 않는가? |
| PM-02. Focus on Value | Baseline Topic03 P2 | Output completion보다 stakeholder/organization에 필요한 value/outcome을 기준으로 판단하는가? |
| PM-03. Embed Quality into Processes and Deliverables | Baseline Topic03 P3 | 품질을 사후 검사로 분리하지 않고 planning·execution·verification에 내재화했는가? |
| PM-04. Be an Accountable Leader | Baseline Topic03 P4 | 직위보다 결정과 결과에 대한 accountability·escalation·ownership이 명확한가? |
| PM-05. Integrate Sustainability across the Project | Baseline Topic03 P5 | 프로젝트 종료 이후의 운영·유지·사회·환경 영향까지 lifecycle consequence로 보는가? |
| PM-06. Build an Empowered Culture | Baseline Topic03 P6 | 정보가 있는 지점 가까이에 적절한 decision right와 feedback을 두었는가? |

교육 원칙(Baseline Topic03, 원문):

> **Principle ≠ Slogan / Principle = Decision Criterion**

## 11. Trade-offs / Failure Conditions

(Baseline §10 각 Topic의 Failure Condition, §17 Anti-Patterns, §19 Quality Gate에서 발췌 재구성)

| Principle / Decision | Trade-off | Failure Condition |
|---|---|---|
| PM-02 Focus on Value | value 판단에 추가 근거·논의 비용이 들지만 output-only 완료로 인한 실패를 막는다 | Project Success = Scope/Cost/Schedule 준수로 정의(Anti-pattern #5) |
| PM-01 Adopt a Holistic View | 부분 최적화 속도를 늦추지만 전체 project value 훼손을 막는다 | 한 Domain 최적화가 다른 Domain을 악화시킴에도 발견하지 못함 |
| Governance as integration hub | 통합 계획·소싱 조정 비용이 들지만 계획 간 모순을 막는다 | 통합 계획서가 개별 관리계획서 묶음에 불과함(Baseline Topic07 Failure Condition) |
| Change ≠ Failure (통합 영향분석) | 변경통제 프로세스 비용이 들지만 무분별한 scope creep과 임의 승인을 막는다 | Change를 범위만 보고 승인하거나, Change 자체를 실패로 취급(Baseline Topic07 Failure Condition, Anti-pattern #6) |
| Monitoring & Controlling as Forecast | Forecast 판단 비용이 들지만 뒤늦은 surprise를 막는다 | Status reporting/실적 보고만 수행하고 원인·예측이 없음(Baseline Topic16 Failure Condition, Anti-pattern #15) |
| Tailoring | 관리강도 선택에 판단 비용이 들지만 불필요한 process overhead를 제거한다 | Tailoring = Process 삭제로 오인(Anti-pattern #16) |
| Stakeholder Engagement as behavior/decision management | 개별화된 참여 설계 비용이 들지만 영향력 있는 반대자를 늦게 발견하는 실패를 막는다 | Communication = 보고서 배포, Stakeholder analysis = 최초 1회(Baseline Topic08 Failure Condition) |
| Risk response economics | 대응 설계·reserve 비용이 들지만 Risk Register 방치를 막는다 | Risk Register 작성 후 방치(Anti-pattern #7) |

## 12. Cross-course Interfaces

### Bridges Forward / Boundary (`portfolio/concept-ownership.md` "Current Concept Owners → SW Project Management" Boundary, Baseline §4)

```text
PM
Project Governance / Integrated Control
        ↕
Agile / DevOps
Delivery Execution

SWQM
Quality Evidence / Gate Governance
        ↕
PM
Quality Integration into Project Decisions

SW Proposal
Customer Decision / Commitment
        ← applies evidence from PM (detailed project planning/control)
```

- **Agile owns** uncertainty-driven adaptive delivery, small increment, backlog/feedback/adaptation, Scrum operating structure. PM 과정에서는 Agile을 재교육하지 않는다. PM의 질문: "이 프로젝트에서 Predictive / Adaptive / Hybrid 중 어떤 접근을 어디에 적용할 것인가?"(Baseline §4)
- **SWQM owns** quality risk, prevention/verification, quality evidence, quality gate, software quality improvement. PM 과정에서 `Embed Quality`와 `Manage Quality Assurance`는 다루지만 SW 품질기법 자체를 재교육하지 않는다. PM의 질문: "Quality 활동을 프로젝트 계획·책임·성과·변경 의사결정에 어떻게 통합할 것인가?"(Baseline §4)
- **DevOps owns** delivery flow, CI/CD, deployment, operations feedback, recovery, delivery performance. PM의 질문: "Delivery capability가 일정·비용·위험·소싱·변경 계획에 어떤 영향을 주는가?"(Baseline §4)
- **SW Proposal**: PM owns detailed project planning/control; Proposal course owns how those commitments become a credible customer decision argument(`portfolio/concept-ownership.md` "SW Proposal" Boundary).

### Related Courses

- **Key interactions:** Agile, DevOps, SWQM, SW Proposal(`portfolio/concept-ownership.md` Cross-Course Bridge Summary).
- Prerequisite Policy는 `portfolio/concept-ownership.md` §11이 정본이며, 이 문서는 별도 선수과목을 신규 지정하지 않는다.

## 13. Foundational Decision Lens Fit

`portfolio/principles.md` §A 5개 Lens 중 PM의 실제 판단을 강화하는 것만 적용한다. migration 당시 흡수·검증된 판정은 "09 Project Management | Systems, ToC, Empiricism | holistic project view, constraint, re-planning evidence를 강화한다. 적절함."이다:

- **APPLY:** Systems Thinking — 부분 최적화 대신 whole project를 본다(PM-01 Adopt a Holistic View와 직결); Theory of Constraints — 핵심 constraint(critical path/resource contention/limiting factor)를 먼저 개선한다; Empiricism/Scientific Thinking — 실제 evidence·forecast를 기준으로 재계획한다(Monitoring & Controlling과 직결).
- **Rule:** 관련 없는 Lens를 과정 형식상 억지로 추가하지 않는다(Baseline "Rule", `guides/과정_설계_지침.md` §4). Lean Thinking과 Design Thinking Lens는 이 과정의 핵심 판단을 직접 강화하지 않으므로 형식적으로 추가하지 않는다.

## 14. Source Baseline

PMI, *The Standard for Project Management* + *A Guide to the Project Management Body of Knowledge (PMBOK® Guide) — Eighth Edition*을 Primary reference로 사용한다(Baseline 상단, `portfolio/evidence-policy.md` §13 "SW Project Management" Source Precedence: 1. stable project-management principles and decision needs, 2. PMI PMBOK® Guide / The Standard for Project Management는 primary reference, 3. secondary training material은 explanation aid). 상세 근거·evidence classification·40 Process Reference Map은 `courses/project-management/design/references/verified-sources.md`가 소유한다.

## 15. Curriculum Authoring Gate

`guides/과정_설계_지침.md` §6에 따라, 이 Course Design 문서(`course-context.md`, `practice-design.md`)가 승인되기 전에는 다음이 금지된다:

- `courses/project-management/curriculum.md` 등 curriculum/session 재작성 신규 저작
- source/deck 생성
- renderer/course-specific logic 변경

이 과정은 기존 Curriculum과 병행 작성하는 5개 과정(OOAD/DDD/SW Architecture/MSA/Modern SWQM)과 달리 **아직 curriculum.md가 존재하지 않는 greenfield 과정**이다. 따라서 이 Gate는 "새 Curriculum을 만들지 않는다"가 아니라 **"이 Course Design 승인 전에는 Curriculum을 아직 만들지 않는다"**를 의미한다. Course Design 승인 후 Stage 2(`커리큘럼_작성_지침.md`)에서 실제 세션·시간표·명제를 갖는 `curriculum.md`를 새로 작성한다.
