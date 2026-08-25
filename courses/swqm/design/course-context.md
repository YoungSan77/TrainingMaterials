# Modern SWQM — Course Context

> **Course ID:** swqm
> **Stage:** Course Design (Stage 1 of 3) — 이 문서는 `guides/과정_설계_지침.md` §2-a 구조를 따른다.
> **Authority:** `portfolio/practice-standard.md` · `portfolio/evidence-policy.md` · `portfolio/concept-ownership.md` §15 · `portfolio/cross-course-framework.md` §9 (portfolio-wide 정본).
> **Baseline source:** `context/course-portfolio-unified-v2.6/courses/06_swqm.md`(progression/priority/rationale/coverage-intent만 추출, 커리큘럼 백본은 옮기지 않음).
> **Curriculum pointer (read-only, 정본 아님):** 이 과정은 저장소에 이미 `courses/swqm/swqm_커리큘럼.md`(16시간·2일·11세션, S01–S11)로 존재한다. 이 Course Context는 그 Curriculum을 대체하거나 재정의하지 않으며, 세션 번호·시간표·명제 목록을 복제하지 않는다. Curriculum과 이 문서가 다른 시간 단위(baseline 8h vs 실제 16h)를 언급하는 경우, **실제 Curriculum이 우선**하며 이 문서의 baseline 인용은 진행 순서·우선순위·근거·커버리지 의도를 설명하는 배경 자료로만 쓴다.

---

## 1. Course Purpose

품질은 사후 검사 조직의 활동이 아니라, 요구에서 운영까지 결함을 예방하고 검증 가능한 Evidence와 Feedback으로 Engineering System을 지속 개선하는 능력이라는 것을 학습자가 스스로의 조직에 적용할 수 있게 한다. 이 과정은 각 기술 분야(OOAD/DDD/SWA/MSA/AI-Native)의 설계법을 가르치지 않는다 — 각 분야가 품질에 어디서 닿는지 보여주고, 학습자가 자기 자리에서 무엇을 결정할지 정하게 한다.

## 2. Target Learner

- 품질을 QA 단계가 아니라 개발 전 과정에 내재화해야 하는 개발자·QA·PM·리더·아키텍트·BA/TA/DA. 기준은 중간 수준 실무자.
- Decision Level: **Decide / Govern.**

## 3. Capability Gap

학습자는 현재 검사·승인·metric을 품질 자체로 오해하고, prevention/feedback보다 사후 검출에 치우쳐 있다. 반복 결함·재작업·수동 검증·늦은 피드백이 시스템 문제가 아니라 개인 문제로 다뤄진다.

## 4. Typical Failure

- 품질 책임이 테스트/QA 조직에 후행 집중된다.
- 요구·설계·코드 단계의 결함이 늦게 발견되어 Rework Cost가 증가한다.
- Review/Test/Static Analysis/자동화가 서로 분리된 활동으로 운영된다.
- 표준·감사·지표가 개선보다 형식 준수와 평가 수단으로 변질된다.
- Quality Gate의 통과/차단 기준이 검증 가능한 Evidence와 연결되지 않는다.
- 일정·보상·조직 구조가 예방보다 사후 수습을 장려한다.
- AI가 산출량을 늘리면서 Verification과 Evidence의 중요성이 커지는데, 이를 반영하지 못한다.

## 5. Target Capability

품질 실패 원인을 시스템 관점에서 진단하고, prevention·evidence·gate·feedback을 비용효율적으로 설계할 수 있다.

---

## 6. Course Thesis

> 품질은 사후 검사 조직의 활동이 아니라, 요구에서 운영까지 결함을 예방하고 검증 가능한 Evidence와 Feedback으로 Engineering System을 지속 개선하는 능력이다.

## 7. Course Narrative

```text
Quality Risk → Prevention → Verification → Evidence → Gate → Feedback → System Improvement
```

QM은 다른 기술과정의 설계법을 다시 정의하지 않는다. Requirement, Domain Model, Architecture, Code, AI Output 등이 **어떤 품질위험을 만들며 무엇으로 검증할 것인가**를 다룬다.

---

## 8. Learner & Context Fit

> baseline(`06_swqm.md`)이 이미 채운 절이므로 요약하거나 다시 짓지 않고 그대로 가져온다 (`guides/과정_설계_지침.md` §3).

- **Audience / Work Context:** 품질을 QA 단계가 아니라 개발 전 과정에 내재화해야 하는 개발자·QA·PM·리더.
- **Current Capability / Failure Mode:** 검사·승인·metric을 품질 자체로 오해하고 prevention/feedback보다 사후 검출에 치우친다.
- **Target Capability:** 품질 실패 원인을 시스템 관점에서 진단하고 prevention·evidence·gate·feedback을 비용효율적으로 설계한다.
- **Decision Level:** Decide / Govern.
- **Transfer:** 수업 산출물과 판단을 실제 업무의 동일 유형 결정에 재사용할 수 있어야 한다.

## 9. Foundational Decision Lens Fit

> `portfolio/principles.md` §A의 5개 Lens 중 이 과정에 실제로 강화되는 것만 채택한다. 판정은 `context/.../support/04_audit/01_portfolio-integrity-audit-v2.6.md` §4의 기존 판단을 그대로 옮긴 것이며, 여기서 새로 판정하지 않는다.

- **APPLY:** Systems Thinking; Lean Thinking; Theory of Constraints; Empiricism / Scientific Thinking.
- **Why:** 품질을 flow와 system behavior로 보고, 주요 defect source/constraint부터 evidence 기반으로 개선한다.
- **Rule:** 관련 없는 Lens를 과정 형식상 억지로 추가하지 않는다. Lens는 Course-owned concept를 재정의하지 않고 판단을 강화한다.
- (Design Thinking Lens는 이 과정에서 채택하지 않는다 — baseline이 명시한 4개 외 추가하지 않는다.)

---

## 10. Decisions Learner Must Make

1. 어떤 Quality Risk를 가장 앞에서 예방해야 하는가?
2. Prevention과 Detection에 어느 정도 비용을 배분할 것인가?
3. 어떤 Verification을 Human Review / Test / Static Check / Runtime Evidence로 배분할 것인가?
4. 어떤 Evidence가 다음 단계 진행·Release·Acceptance 판단에 충분한가?
5. Quality Gate는 어디에 두며 실패 시 무엇을 멈추고 무엇을 피드백할 것인가?
6. 어떤 Metric이 시스템 진단에 유효하며 어떤 Metric이 Gaming을 유발하는가?
7. 표준·감사·Compliance를 어떻게 품질 개선과 연결할 것인가?
8. 반복 결함이 개인이 아니라 어떤 시스템 제약·인센티브에서 발생하는가?
9. AI 생성물의 품질을 어떤 기존 Engineering Evidence와 추가 Evaluation으로 검증할 것인가?
10. 현재 Quality System의 가장 큰 Bottleneck은 무엇이며 어떤 개선 우선순위를 선택할 것인가?

---

## 11. Course Scope — OWNER / APPLY / RECAP / FORWARD / NON-SCOPE

### 11.1 OWNER

Modern SWQM은 다음을 **자체 소유 판단**으로 가르친다 (`concept-ownership.md` §15, `06_swqm.md` §5, `cross-course-framework.md` §9와 일치):

- Quality as System Property
- Quality Risk / Cost of Quality / Rework
- Shift-Left / Prevention vs Detection
- Quality Planning / Quality Responsibility
- Review / Inspection의 품질 관점
- Test Strategy의 품질 포트폴리오 관점
- Static Analysis / Automated Verification의 배치 원칙
- Quality Evidence / Quality Gate
- Audit / Compliance / Traceability의 개선 관점
- Quality Metrics / Measurement System (Goodhart 포함)
- Organizational Incentive / System Cause
- Continuous Improvement / Quality Operating Model

### 11.2 APPLY / RECAP ONLY (다른 과정의 OWNER 개념 — 재정의 금지)

- Requirement example / Acceptance Criteria / BDD: Requirement 품질 Evidence 관점에서만 APPLY.
- OOAD/DDD: Contract / Invariant / Model을 검증 가능한 품질 자산으로 RECAP/APPLY. **OOAD object/design principles 자체는 재정의하지 않는다.**
- DDD: **Domain Model / Ubiquitous Language / Ontology need**는 RECAP/APPLY만. DDD가 OWNER다.
- SW Architecture: **Architecture / Quality Attribute의 정본 정의**는 RECAP/APPLY만. SWA가 OWNER다. Architecture Rule / Fitness Evidence는 품질 시스템에 활용(APPLY)한다.
- MSA: distributed design patterns는 RECAP/APPLY만. Contract / Failure / Observability Evidence는 품질 시스템에 활용(APPLY)한다.
- AI-Native: **Context Engineering / Guardrail / Harness / Agent definitions**는 RECAP/APPLY만. Specification / Guardrail / Evaluation 결과는 품질 Evidence로 APPLY하되 정의 자체는 재정의하지 않는다.

### 11.3 NON-SCOPE / FORWARD

- DDD Domain Model / Ubiquitous Language / Ontology 정본 정의 → DDD가 소유.
- AI Context / Guardrail / Harness 정본 정의 → AI-Native가 소유.
- CI/CD Delivery Flow, Deployment Strategy, DORA 운영 체계 상세 → DevOps로 forward.
- Platform Engineering / Team Topologies 상세 → DevOps/SWA로 forward.
- 특정 Test Framework / Static Analysis Tool / ALM Tool 사용법 → out of scope (vendor-independent, `evidence-policy.md` §9).

### 11.4 Ownership Boundary Risk — 명시적 경고

> **`portfolio/concept-ownership.md` §15와 `portfolio/cross-course-framework.md` §9가 명시적으로 금지한다:**
> Modern SWQM은 **Context Engineering, Rich Domain Model, Ubiquitous Language, Ontology, Guardrail, Harness**를 자체 OWNER 개념으로 재정의하지 않는다. 이 여섯 개념을 QM에서 OWNER처럼 재정의하면 **ownership violation**이다.
>
> 이 과정의 실제 커리큘럼(`courses/swqm/swqm_커리큘럼.md` S10 "AI 시대의 품질관리")을 대조 확인한 결과, 해당 세션은 이 여섯 개념 중 어느 것도 정의하거나 재정의하지 않는다 — "생성 코드의 품질 책임", "검토 기준 동일성", "판정 기준 명확성" 등 QM 고유 OWNER 판단(책임·검증·Evidence)만 다룬다. 이는 Course Design 기준으로 **경계 위반 없음**으로 확인되나, Curriculum이 향후 개정될 때도 이 경계가 유지되도록 이 절을 Curriculum Authoring의 참조 기준으로 남긴다.
>
> 만약 향후 Curriculum이 AI 생성물의 "Context"나 "Guardrail"이라는 용어를 QM 고유 개념처럼 정의하려 한다면, 그것은 AI-Native RECAP/APPLY로만 인용해야 하며 QM이 그 정의의 정본이 되어서는 안 된다.

---

## 12. Key Distinctions

`portfolio/terminology.md`의 "반드시 구분할 쌍" 중 이 과정에 해당하는 것 (baseline `06_swqm.md` §6):

- Quality ≠ Testing
- QA ≠ Test Department
- Prevention ≠ Bureaucracy
- Shift-Left ≠ 모든 활동을 무조건 앞단으로 이동
- Evidence ≠ Assertion
- Quality Gate ≠ Approval Meeting
- Metric ≠ Target
- Audit ≠ Documentation Inspection Only
- Test Coverage ≠ Test Quality
- Quality Pipeline ≠ CI/CD Pipeline 전체
- AI Evaluation ≠ LLM에게 다시 검토시키기

---

## 13. Course-specific Principles / Trade-offs / Failure Conditions

Parent Lens(§9)를 이 과정에서 구체화한 Child principle이다.

| Principle | 전제 조건 | Trade-off | Failure Condition | Parent Lens |
|---|---|---|---|---|
| Prevention before Detection | 앞단에서 위험을 확인할 수 있음 | 초기 예방비용 증가 / 총 Rework 감소 | QA가 마지막 검사만 담당 | Lean / ToC |
| Shift Left selectively | 빠른 Feedback 경로가 존재 | 일부 로컬 비용 증가 / 결함 이관 비용 감소 | 동일 검사를 여러 단계에 중복 | Lean |
| Evidence before Assertion | 결과를 검증 가능한 형태로 만들 수 있음 | 수집·자동화 비용 증가 | "검토 완료" 같은 상태값만 남음 | Empiricism |
| Risk-based Verification | 위험을 구분할 수 있음 | 일률적 표준의 단순성 감소 | 모든 산출물에 동일 Gate 적용 | ToC / Systems |
| Metrics for Diagnosis | 지표가 의사결정에 연결됨 | 개인평가 편의성 감소 | 숫자를 목표/보상과 직접 연결 | Empiricism |
| System over Blame | 반복 원인을 분석할 권한이 있음 | 원인분석 비용 증가 | 사람 교체/주의 조치로 종료 | Systems Thinking |
| Continuous Improvement | 작은 실험과 Feedback 가능 | 단기 성과의 확정성 감소 | 대규모 QM 제도부터 도입 | Lean / Empiricism |

---

## 14. Cross-course Interfaces

### 14.1 Position (bridges from)

```text
OOAD ─┐
DDD ──┤
SWA ──┼──→ Modern SWQM: Prevention / Evidence / Gate / Feedback / Improvement
MSA ──┤
AI ───┘
```

Modern SWQM은 기술과정의 다음 단계가 아니라 **cross-cutting professional course**다 (`cross-course-framework.md` §9). QM에서 묻는 질문:
- 요구/계약/품질 기준은 어떻게 검증 가능한가?
- 결함을 어디에서 예방·탐지하는 것이 비용 효과적인가?
- 어떤 evidence가 gate를 통과시키는가?
- feedback이 process/system improvement로 연결되는가?

### 14.2 Uses (Related Course Boundaries)

| Course | Relationship | Boundary Rule |
|---|---|---|
| OOAD | Contract/Test Evidence 사용 | 객체설계는 OOAD가 소유 |
| DDD | Invariant/Model Evidence 사용 | Domain 의미·경계는 DDD가 소유 |
| SW Architecture | Fitness/Conformance Evidence 사용 | Architecture Decision은 SWA가 소유 |
| MSA | Contract/Failure/Observability Evidence 사용 | 분산 설계는 MSA가 소유 |
| AI-Native | AI Evaluation/Stage Evidence 사용 | Context/Guardrail/Harness는 AI-Native가 소유 |
| Agile | 짧은 Feedback과 DoD 접점 | Adaptive Delivery/Scrum은 Agile이 소유 |
| DevOps | Quality Gate를 Delivery Flow가 소비 | CI/CD/Deployment/Operation Flow는 DevOps가 소유 |

### 14.3 Forward (다른 과정이 QM으로부터 가져가는 것)

- DevOps는 QM이 정의한 Quality Gate 기준을 Delivery Pipeline에 소비한다 (QM은 "왜/무엇을" evidence, DevOps는 "어디서/어떻게" 실행을 소유).

---

## 15. Portfolio Alignment Summary

- **OWNER:** Quality Risk, Prevention, Verification Strategy, Quality Evidence, Quality Gate governance, Feedback and System Improvement.
- **Cross-Cutting Role:** Applies across every engineering/delivery course.
- **Boundary:** DevOps owns where/how delivery pipeline executes; SWQM owns why/what evidence and gate criteria establish quality confidence.
- **Rollout order (portfolio-wide):** `practice-standard.md` §15 — OOAD → DDD → SW Architecture → MSA → AI-Native → **Modern SWQM** → Agile → DevOps → SW Project Management → SW Proposal → DT→AX.
