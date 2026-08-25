# 현대적 SW 품질관리 실무 — Unified Baseline v2.6

> **Course ID:** swqm  
> **Duration:** 8h 운영 기준  
> **Instructional time:** 약 400분 + 휴식 약 80분  
> **Status:** Baseline  
> **Portfolio Category:** Cross-Cutting Quality  
> **Time rule:** Topic은 동일 50분 단위가 아니며, 중요도·난이도·실습/토론량에 따라 가변 배분한다.


- **기준 시간:** 8시간 / 총 운영 480분 이내 / 권장 순수 학습 400분
- **Portfolio:** Cross-Cutting Engineering Management

## 1. Course Thesis
> 품질은 사후 검사 조직의 활동이 아니라, 요구에서 운영까지 결함을 예방하고 검증 가능한 Evidence와 Feedback으로 Engineering System을 지속 개선하는 능력이다.

## Learner & Context Fit

- **Audience / Work Context:** 품질을 QA 단계가 아니라 개발 전 과정에 내재화해야 하는 개발자·QA·PM·리더.
- **Current Capability / Failure Mode:** 검사·승인·metric을 품질 자체로 오해하고 prevention/feedback보다 사후 검출에 치우친다.
- **Target Capability:** 품질 실패 원인을 시스템 관점에서 진단하고 prevention·evidence·gate·feedback을 비용효율적으로 설계한다.
- **Decision Level:** Decide / Govern.
- **Transfer:** 수업 산출물과 판단을 실제 업무의 동일 유형 결정에 재사용할 수 있어야 한다.

## Foundational Decision Lens Alignment

- **APPLY:** Systems Thinking; Lean Thinking; Theory of Constraints; Empiricism / Scientific Thinking.
- **Why:** 품질을 flow와 system behavior로 보고 주요 defect source/constraint부터 evidence 기반으로 개선한다.
- **Rule:** 관련 없는 Lens를 과정 형식상 억지로 추가하지 않는다. Lens는 Course-owned concept를 재정의하지 않고 판단을 강화한다.

## 2. Problem It Owns
- 품질 책임이 테스트/QA 조직에 후행 집중된다.
- 요구·설계·코드 단계의 결함이 늦게 발견되어 Rework Cost가 증가한다.
- Review/Test/Static Analysis/자동화가 서로 분리된 활동으로 운영된다.
- 표준·감사·지표가 개선보다 형식 준수와 평가 수단으로 변질된다.
- Quality Gate의 통과/차단 기준이 검증 가능한 Evidence와 연결되지 않는다.
- 일정·보상·조직 구조가 예방보다 사후 수습을 장려한다.
- AI가 산출량을 늘리면서 Verification과 Evidence의 중요성이 커진다.

## 3. Core Narrative
`Quality Risk → Prevention → Verification → Evidence → Gate → Feedback → System Improvement`

QM은 다른 기술과정의 설계법을 다시 정의하지 않는다. Requirement, Domain Model, Architecture, Code, AI Output 등이 **어떤 품질위험을 만들며 무엇으로 검증할 것인가**를 다룬다.

## 4. Decisions Learner Must Make
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

## 5. Course Scope
### OWNER
- Quality as System Property
- Quality Risk / Cost of Quality / Rework
- Shift-Left / Prevention vs Detection
- Quality Planning / Quality Responsibility
- Review / Inspection의 품질 관점
- Test Strategy의 품질 포트폴리오 관점
- Static Analysis / Automated Verification의 배치 원칙
- Quality Evidence / Quality Gate
- Audit / Compliance / Traceability의 개선 관점
- Quality Metrics / Measurement System
- Organizational Incentive / System Cause
- Continuous Improvement / Quality Operating Model

### RECAP / APPLY
- Requirement example / Acceptance Criteria / BDD: Requirement 품질 Evidence 관점
- OOAD/DDD: Contract / Invariant / Model을 검증 가능한 품질 자산으로 활용
- SW Architecture: Architecture Rule / Fitness Evidence를 품질 시스템에 활용
- MSA: Contract / Failure / Observability Evidence를 품질 시스템에 활용
- AI-Native: Specification / Guardrail / Evaluation 결과를 품질 Evidence로 활용

### NON-SCOPE / FORWARD
- DDD Domain Model/UL/Ontology 정본 정의
- AI Context/Guardrail/Harness 정본 정의
- CI/CD Delivery Flow, Deployment Strategy, DORA 운영 체계 상세 → DevOps
- Platform Engineering / Team Topologies 상세 → DevOps/SWA
- 특정 Test Framework / Static Analysis Tool / ALM Tool 사용법

## 6. Key Distinctions
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

## 7. Learning Outcomes
수강 후 학습자는:
1. Quality Risk와 Rework 구조를 시스템 관점에서 진단한다.
2. Shift-Left를 가장 싼 지점에서 예방·검증하는 원칙으로 적용한다.
3. Requirement/Review/Test/Static Analysis/Runtime Evidence를 위험에 맞게 배치한다.
4. 검증 가능한 Evidence와 Quality Gate를 연결한다.
5. ISO/CMMI/SPICE/Audit를 인증 암기가 아니라 시스템 개선 관점으로 해석한다.
6. Test Strategy를 고정 비율이 아닌 Risk/Speed/Confidence Trade-off로 설계한다.
7. Metric을 평가가 아니라 진단에 사용하고 Goodhart 효과를 방지한다.
8. 반복 품질 문제를 조직 인센티브와 시스템 제약에서 찾는다.
9. AI 생성물을 기존 Engineering Gate와 AI-specific Evaluation으로 검증한다.
10. Bottleneck 하나를 선택하여 실행 가능한 Quality Improvement 방향을 설명한다.

## 8. Principles / Trade-off / Failure Conditions
| Principle | 전제 조건 | Trade-off | Failure Condition |
|---|---|---|---|
| Prevention before Detection | 앞단에서 위험을 확인할 수 있음 | 초기 예방비용 증가 / 총 Rework 감소 | QA가 마지막 검사만 담당 |
| Shift Left selectively | 빠른 Feedback 경로가 존재 | 일부 로컬 비용 증가 / 결함 이관 비용 감소 | 동일 검사를 여러 단계에 중복 |
| Evidence before Assertion | 결과를 검증 가능한 형태로 만들 수 있음 | 수집·자동화 비용 증가 | “검토 완료” 같은 상태값만 남음 |
| Risk-based Verification | 위험을 구분할 수 있음 | 일률적 표준의 단순성 감소 | 모든 산출물에 동일 Gate 적용 |
| Metrics for Diagnosis | 지표가 의사결정에 연결됨 | 개인평가 편의성 감소 | 숫자를 목표/보상과 직접 연결 |
| System over Blame | 반복 원인을 분석할 권한이 있음 | 원인분석 비용 증가 | 사람 교체/주의 조치로 종료 |
| Continuous Improvement | 작은 실험과 Feedback 가능 | 단기 성과의 확정성 감소 | 대규모 QM 제도부터 도입 |

## 9. Learning Evidence + LLM-Integrated Practice
기존의 강의·사례·질문 중심 구조는 유지하되, Portfolio 공통 정책에 따라 4개의 짧은 LLM-integrated Practice를 포함한다. 별도 장시간 Workshop으로 전환하지 않는다.

학습자는 과정 종료 시 다음을 설명할 수 있어야 한다.
1. Quality Risk와 Feedback Delay의 관계
2. Prevention과 Detection의 비용 Trade-off
3. Requirement / Review / Static Check / Test의 적절한 배치
4. Evidence와 Quality Gate의 관계
5. Standard / Audit / Compliance의 목적과 실패조건
6. Metric과 Target의 차이 및 Gaming 위험
7. 조직 Incentive가 품질에 미치는 영향
8. AI Output을 기존 Engineering Evidence와 연결하는 방법
9. 현재 조직의 Quality Bottleneck을 찾는 관점

## LLM-Integrated Practice Design

공통 `support/01_governance/12_llm-integrated-practice-standard.md`를 적용한다. **4개**, 1일 4개, 총 약 **90분**이며 기존 instructional time 안에 포함한다.

상세 Practice Pack: `support/02_course-assets/06_swqm/01_llm-integrated-practice-pack-v1.1.md`

| ID | Placement | Practice | Time | Core Decision |
|---|---|---|---:|---|
| P1 | T01/T02 | Quality Risk & Rework Diagnosis | 20분 | 반복 품질 문제를 사람 문제가 아니라 시스템 위험과 feedback delay로 어떻게 진단할 것인가 |
| P2 | T05/T06 | Shift-left Verification Placement | 25분 | 요구·review·static check·test 중 어디서 어떤 위험을 가장 싸게 검증할 것인가 |
| P3 | T07/T08 | Test Strategy & Quality Gate | 25분 | risk/speed/confidence에 맞는 test/evidence portfolio와 gate는 무엇인가 |
| P4 | T09/T10 | Metric / AI Output Quality Decision | 20분 | 어떤 metric과 AI-specific evidence를 진단에 쓰고 무엇을 목표화하지 않을 것인가 |

운영은 `Learner Prompt → First Run → Instructor Intervention → Keep Going → Recommended Prompt Reveal → Compare/Adapt` 순서다. Recommended Prompt는 정답이 아니며, 평가는 Prompt 문장력이 아니라 해당 과정의 전문적 판단 Evidence를 기준으로 한다.

## 10. Curriculum Backbone — 10 Topics / 권장 순수 학습 400분
1. **품질은 시스템 문제다 — Quality, CoQ, Rework, Shift-Left** — **45분**
2. **품질 책임과 R&R — Worker / QA / Management, Blameless System Thinking** — **30분**
3. **품질경영 시스템·표준·성숙도 — ISO 9001, PDCA, CMMI/SPICE Orientation** — **35분**
4. **Audit와 Continuous Compliance — Evidence 기반 독립 검토** — **30분**
5. **요구사항 품질과 조기 검증 — Example, Acceptance Criteria, 3 Amigos, Traceability** — **40분**
6. **Peer Review와 Static Verification — Walkthrough / Inspection / PR / Static Analysis** — **35분**
7. **현대적 Test Strategy — Risk/Speed/Confidence 기반 Portfolio** — **45분**
8. **Quality Pipeline / Evidence / Gate — Local → Pre-commit → CI Quality Check** — **55분**
9. **Metrics와 조직 시스템 — Goodhart, Incentive, Local Optimization** — **40분**
10. **AI 시대의 Quality Assurance + QM Operating Model — Verification / Evidence / Feedback / Improvement** — **45분**

## 11. Awareness Topics — 1~5분 원칙
ISO 9001, CMMI, SPICE, V-Model, Test Pyramid, TDD, SAST/SCA, DORA, Continuous Compliance, DevSecOps, AI Evaluation 등은 과정의 판단 구조에 필요한 위치에서만 짧게 소개하고 제품·도구 교육으로 확장하지 않는다.

## 12. Related Course Boundaries
| Course | Relationship | Boundary Rule |
|---|---|---|
| OOAD | Contract/Test Evidence 사용 | 객체설계는 OOAD가 소유 |
| DDD | Invariant/Model Evidence 사용 | Domain 의미·경계는 DDD가 소유 |
| SW Architecture | Fitness/Conformance Evidence 사용 | Architecture Decision은 SWA가 소유 |
| MSA | Contract/Failure/Observability Evidence 사용 | 분산 설계는 MSA가 소유 |
| AI-Native | AI Evaluation/Stage Evidence 사용 | Context/Guardrail/Harness는 AI-Native가 소유 |
| Agile | 짧은 Feedback과 DoD 접점 | Adaptive Delivery/Scrum은 Agile이 소유 |
| DevOps | Quality Gate를 Delivery Flow가 소비 | CI/CD/Deployment/Operation Flow는 DevOps가 소유 |

## 13. Quality Gate
Curriculum 승인 전 모두 YES여야 한다.
- 품질이 Test Department 역할로 축소되지 않는가?
- Shift-Left가 무조건 앞단 이동으로 오해되지 않는가?
- 각 기술과정의 OWNER 개념을 QM이 재정의하지 않는가?
- Test Pyramid 비율을 규범으로 강제하지 않는가?
- Quality Pipeline이 DevOps CI/CD 전체를 소유하지 않는가?
- Metric이 KPI/보상 목표로 고정되지 않는가?
- Audit/Standard가 문서·인증 활동으로 축소되지 않는가?
- Evidence와 Gate가 명시적으로 연결되는가?
- AI Quality가 AI-Native mini-course로 변질되지 않는가?
- 마지막이 대규모 제도 도입이 아니라 Bottleneck 기반 개선 우선순위와 Feedback으로 끝나는가?

---


LLM-integrated Practice 추가 Gate:
- Course duration에 맞는 Practice 수와 cadence를 충족하는가?
- 모든 Practice가 기존 instructional time 안에 포함되는가?
- Recommended Prompt 없이 시작하고 Intervention 후 Keep Going하는가?
- Prompt Engineering이 아니라 Course-owned decision/evidence를 평가하는가?
- Practice 때문에 기존 Course Ownership 경계가 이동하지 않는가?
## Portfolio Alignment v2.6
- **OWNER:** Quality Risk, Prevention, Verification Strategy, Quality Evidence, Quality Gate governance, Feedback and System Improvement.
- **Cross-Cutting Role:** Applies across every engineering/delivery course.
- **Boundary:** DevOps owns where/how delivery pipeline executes; SWQM owns why/what evidence and gate criteria establish quality confidence.
