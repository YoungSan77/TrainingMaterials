# SW Project Management Practice Design — LLM-Integrated Practice

> **Course ID:** project-management
> **Standard:** `portfolio/practice-standard.md` (필드 상세·운영 규칙의 정본 — 여기서 재정의하지 않는다)
> **Legacy migration provenance:** context v2.6 Practice Pack v1.1의 **7개 Practice 전체**를 `portfolio/practice-standard.md` §6 필드 스키마로 재구성했으며, 어떤 Practice도 병합·삭제하지 않았다. 원출처는 Git history에 보존된다.
> **lab-design.md 상태:** SW Project Management에는 별도 `lab-design.md`가 없다(`guides/과정_설계_지침.md` §2-b: "`lab-design.md`가 없는 과정(swqm 포함 7개)은 Practice Pack을 실습 설계의 기준선으로 삼는다"). 이 문서가 실습 설계의 단일 기준선이다.
> **Distribution:** Practice Pack은 Instructor-only asset이다(practice-standard.md §2). 학습자용 자료에는 각 Practice의 `Initial Instruction / Deliverable / Inputs / Timebox`까지만 배포하고, Intervention과 Recommended Prompt는 실습 진행 중 정해진 시점에만 공개한다.
>
> **Practice Count:** 7 (P1–P7) — Portfolio Quantity/Cadence Rule(practice-standard.md §3)의 16h 과정 기준 6–8개 범위 안, Baseline 지정 Day 1 3개 / Day 2 4개.
> **Total Practice Time:** 약 160분 — 기존 800분 instructional time 안에 포함, 별도 운영시간으로 추가하지 않는다.
> **Common Case:** 이 Course Design에 migration으로 흡수된 "Integrated SW Project Case" — 12개월 기업 핵심 업무 시스템 구축(내부 PM + 외부 개발사, 일부 핵심 요구 불확실, 예산/납기 제약, 기존 Legacy 연계, 개인정보/보안 요구, 복수 사업부 Stakeholder, 신규 기술 일부 적용, 운영조직 별도, 일부 기능은 단계적 Release 가능). Practice Pack의 공통 Work Context("불확실성이 높은 SW 전환 프로젝트에서 가치·거버넌스·범위·일정·자원·위험·변경을 통합 관리해야 하는 상황")는 이 Integrated Case와 동일한 사례를 가리키며, 이 문서는 각 Practice의 Work Context를 이 Case에 정박해 서술한다(Case 자체의 조건을 넘어서는 세부사실은 추가하지 않는다).

## Operating Rules (practice-standard.md §2, §5 적용; Pack "Operating Rules" 원문과 일치)

- 실습 시작 시 Recommended Prompt를 제공하지 않는다. 학습자가 먼저 자신의 Prompt와 작업 접근을 설계한다(Phase B).
- 시작 후 5–10분에 Instructor Intervention을 공개한다(Phase C).
- 학습자는 새 채팅으로 재시작하지 않고 Keep Going하며 Prompt·산출물·판단을 개선한다(Phase D).
- 종료 시 Recommended Prompt와 Prompt Design Intent를 공개한다(Phase E). Recommended Prompt는 정답이 아니며 학습자의 Context에 맞게 유지·삭제·수정한다.
- 평가 대상은 Prompt 문장력이 아니라 **Course-owned decision, evidence, trade-off, failure condition**의 품질이다.
- LLM 사용이 Concept OWNER를 이동시키지 않는다(practice-standard.md §9) — 모든 Practice의 판단 OWNER는 PM이다. Agile/DevOps/SWQM의 정의·기법 자체를 이 Practice에서 재교육하지 않는다(`courses/project-management/design/course-context.md` §8 Boundary).

## Practice Index

(Baseline §14 표, 원문 그대로)

| ID | Placement | Practice | Timebox | Core Decision |
|---|---|---|---:|---|
| P1 | T01/T04 | Value & Development Approach Decision | 20분 | 프로젝트 value와 uncertainty에 맞는 development approach는 무엇인가 |
| P2 | T07 | Governance & Decision Rights | 25분 | 어떤 의사결정권·승인·escalation 구조가 필요한가 |
| P3 | T08/T09 | Stakeholder + Scope Alignment | 20분 | stakeholder 기대와 scope boundary를 어떻게 함께 관리할 것인가 |
| P4 | T10/T12 | Schedule / Resource Trade-off | 25분 | 일정 압박 시 scope/resource/sequence를 어떻게 조정할 것인가 |
| P5 | T13 | Risk Response Decision | 25분 | 위험별로 어떤 response가 경제적인가 |
| P6 | T16 | Evidence / Forecast / Integrated Change | 20분 | 변경 요청이 7 domains에 미치는 영향을 어떻게 통합 판단할 것인가 |
| P7 | T18/T19 | Tailor the Management System | 25분 | 어떤 관리 practice를 유지/경량화/제거할 것인가 |

Day 1: P1–P3 (3개) · Day 2: P4–P7 (4개), 총 약 160분(Pack 상단 Cadence).

---

## P1. Value & Development Approach Decision

| Field | Content |
|---|---|
| **Practice ID / Title** | P1 — Value & Development Approach Decision |
| **Course Ownership** | PM OWNER — Value / Development Approach 선택 판단. Predictive/Iterative/Incremental/Adaptive 용어 정의 자체는 Agile OWNER이며, 이 Practice는 그 정의를 RECAP/APPLY하여 "이 프로젝트에 어디까지 어떤 접근을 적용할 것인가"만 PM 판단으로 다룬다(`course-context.md` §8). |
| **Decision Practiced** | 프로젝트 value와 uncertainty에 맞는 development approach는 무엇인가 |
| **Work Context** | Integrated SW Project Case(12개월 기업 핵심 업무 시스템 구축) — 내부 PM + 외부 개발사, 일부 핵심 요구 불확실, 예산/납기 제약, Legacy 연계, 복수 사업부 Stakeholder, 신규 기술 일부 적용, 일부 기능은 단계적 Release 가능이라는 조건에서 output-outcome-benefit-value를 구분하고 predictive/adaptive/hybrid를 선택해야 하는 상황(Placement: T01 Value Delivery System / T04 Development Approach 선택). |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명(Integrated SW Project Case), 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | output-outcome-benefit-value를 구분하고 predictive/adaptive/hybrid를 선택한다. |
| **Timebox** | 20분 |
| **Initial Instruction** | output-outcome-benefit-value를 구분하고 predictive/adaptive/hybrid를 선택한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 고정 규제 milestone과 높은 요구 불확실성을 동시에 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle(PM-01 Adopt a Holistic View, PM-02 Focus on Value)에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\napproach 이름을 선호로 고르지 말고 uncertainty, change cost, governance, delivery cadence로 대안을 비교하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 PM의 판단축(uncertainty·change cost·governance·cadence)·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정(예: Agile의 adaptive delivery mechanics 자체를 재설계)을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P2. Governance & Decision Rights

| Field | Content |
|---|---|
| **Practice ID / Title** | P2 — Governance & Decision Rights |
| **Course Ownership** | PM OWNER — Governance Performance Domain(decision rights, escalation, sourcing 전체를 PM이 소유; `course-context.md` §8 OWNER). |
| **Decision Practiced** | 어떤 의사결정권·승인·escalation 구조가 필요한가 |
| **Work Context** | Integrated SW Project Case — 내부 PM + 외부 개발사 구조에서 Charter/Business Case 승인부터 Change 승인까지 프로젝트 governance map과 decision rights를 만들어야 하는 상황(Placement: T07 Governance Performance Domain). |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 프로젝트 governance map과 decision rights를 만든다. |
| **Timebox** | 25분 |
| **Initial Instruction** | 프로젝트 governance map과 decision rights를 만든다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | sponsor가 늦게 개입하고 vendor 계약 승인이 병목이라는 조건을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle(PM-04 Be an Accountable Leader, PM-06 Build an Empowered Culture)에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\ncommittee 목록보다 decision type, owner, threshold, evidence, escalation path를 설계하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 PM의 판단축(decision type·owner·threshold·evidence·escalation)·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나, Governance를 "승인 단계 증가"(Anti-pattern #9)로 단순화할 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P3. Stakeholder + Scope Alignment

| Field | Content |
|---|---|
| **Practice ID / Title** | P3 — Stakeholder + Scope Alignment |
| **Course Ownership** | PM OWNER — Stakeholders Performance Domain × Scope Performance Domain 통합 판단(`course-context.md` §8 OWNER). |
| **Decision Practiced** | stakeholder 기대와 scope boundary를 어떻게 함께 관리할 것인가 |
| **Work Context** | Integrated SW Project Case — 복수 사업부 Stakeholder가 존재하는 상황에서 요구 충돌을 분석해 engagement와 scope decision을 만들어야 하는 상황(Placement: T08 Stakeholders Performance Domain / T09 Scope Performance Domain). |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 요구 충돌을 분석해 engagement와 scope decision을 만든다. |
| **Timebox** | 20분 |
| **Initial Instruction** | 요구 충돌을 분석해 engagement와 scope decision을 만든다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 핵심 stakeholder 간 success criterion이 다르다는 조건을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle 및 Key Distinction(Requirement ≠ Scope, Change ≠ Scope Creep, `course-context.md` §9)에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\nstakeholder power/interest만 나열하지 말고 행동·의사결정 영향과 scope trade-off를 연결하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 PM의 판단축(stakeholder 행동/의사결정 영향과 scope trade-off 연결)·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나, Stakeholder Management를 보고(Anti-pattern #8)로 축소할 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P4. Schedule / Resource Trade-off

| Field | Content |
|---|---|
| **Practice ID / Title** | P4 — Schedule / Resource Trade-off |
| **Course Ownership** | PM OWNER — Schedule Performance Domain × Resources Performance Domain 통합 판단(`course-context.md` §8 OWNER). |
| **Decision Practiced** | 일정 압박 시 scope/resource/sequence를 어떻게 조정할 것인가 |
| **Work Context** | Integrated SW Project Case — 예산/납기 제약과 신규 기술 일부 적용이 겹치는 상황에서 critical dependency와 resource constraint를 기반으로 대안을 비교해야 하는 상황(Placement: T10 Schedule Performance Domain / T12 Resources Performance Domain). |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | critical dependency와 resource constraint를 기반으로 대안을 비교한다. |
| **Timebox** | 25분 |
| **Initial Instruction** | critical dependency와 resource constraint를 기반으로 대안을 비교한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 전문가 1명이 두 critical workstream에 동시에 필요하다는 조건을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Theory of Constraints Lens(제약 우선 개선, `course-context.md` §13)와 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\nfast tracking/crashing을 자동 추천하지 말고 dependency, rework risk, cost, resource contention을 비교하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 PM의 판단축(dependency·rework risk·cost·resource contention)·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나, Schedule을 Gantt chart 생성(Anti-pattern #12)·Resource를 인원 수(Anti-pattern #14)로 단순화할 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P5. Risk Response Decision

| Field | Content |
|---|---|
| **Practice ID / Title** | P5 — Risk Response Decision |
| **Course Ownership** | PM OWNER — Risk Performance Domain(`course-context.md` §8 OWNER). |
| **Decision Practiced** | 위험별로 어떤 response가 경제적인가 |
| **Work Context** | Integrated SW Project Case — 개인정보/보안 요구와 Legacy 연계가 있는 상황에서 위협/기회 후보를 평가하고 response owner/trigger를 정해야 하는 상황(Placement: T13 Risk Performance Domain). |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 위협/기회 후보를 평가하고 response owner/trigger를 정한다. |
| **Timebox** | 25분 |
| **Initial Instruction** | 위협/기회 후보를 평가하고 response owner/trigger를 정한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 확률은 낮지만 impact가 매우 큰 vendor failure를 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\nrisk score만 정렬하지 말고 exposure, proximity, response cost, controllability로 accept/mitigate/transfer/avoid 등을 판단하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 PM의 판단축(exposure·proximity·response cost·controllability)·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나, Risk Register를 작성 후 방치(Anti-pattern #7)할 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P6. Evidence / Forecast / Integrated Change

| Field | Content |
|---|---|
| **Practice ID / Title** | P6 — Evidence / Forecast / Integrated Change |
| **Course Ownership** | PM OWNER — Monitoring & Controlling Focus Area의 cross-domain change impact 판단(`course-context.md` §8 OWNER: Integrated change impact and forecast). |
| **Decision Practiced** | 변경 요청이 7 domains에 미치는 영향을 어떻게 통합 판단할 것인가 |
| **Work Context** | Integrated SW Project Case — 단계적 Release가 가능한 상황에서 새로운 변경 요청의 scope/schedule/finance/resource/risk/stakeholder 영향을 분석해야 하는 상황(Placement: T16 Monitoring & Controlling). |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 변경 요청의 scope/schedule/finance/resource/risk/stakeholder 영향을 분석한다. |
| **Timebox** | 20분 |
| **Initial Instruction** | 변경 요청의 scope/schedule/finance/resource/risk/stakeholder 영향을 분석한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 요청 자체 가치는 높지만 deadline이 고정이라는 조건을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Empiricism Lens(evidence가 결정을 바꾼다, `course-context.md` §13)와 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\nchange approval 여부보다 cross-domain impact, forecast, options, residual risk를 근거로 결정을 제안하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 PM의 판단축(cross-domain impact·forecast·options·residual risk)·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나, Change를 범위만 보고 승인하거나 Change 자체를 실패(Anti-pattern #6)로 취급할 때. Monitoring을 실적 보고로만 축소(Anti-pattern #15)할 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P7. Tailor the Management System

| Field | Content |
|---|---|
| **Practice ID / Title** | P7 — Tailor the Management System |
| **Course Ownership** | PM OWNER — Project-context Tailoring, Integrated Case(`course-context.md` §8 OWNER). |
| **Decision Practiced** | 어떤 관리 practice를 유지/경량화/제거할 것인가 |
| **Work Context** | Integrated SW Project Case — 운영조직이 별도인 상황에서 프로젝트 context에 맞는 최소 관리시스템을 설계해야 하는 상황(Placement: T18 Tailoring / T19 Integrated SW Project Case). |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 프로젝트 context에 맞는 최소 관리시스템을 설계한다. |
| **Timebox** | 25분 |
| **Initial Instruction** | 프로젝트 context에 맞는 최소 관리시스템을 설계한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 팀 규모 감소와 외부 감사 요구를 동시에 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\nprocess completeness가 아니라 risk, governance, team capability, evidence need로 keep/reduce/add를 판단하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 PM의 판단축(risk·governance·team capability·evidence need)·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나, Tailoring을 Process 삭제(Anti-pattern #16)로 오인할 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## Optional / Reference Candidates When Time Is Tight

Time-pressure Rule(practice-standard.md §11)에 따라, Core Narrative와 7개 Practice는 유지하고 다음 상세만 강의 중 생략 가능 계층으로 이동할 수 있다(삭제하지 않음, Baseline §18 Explicit Non-Scope와 일치):

- 모든 Tool & Technique 상세
- EVM/CPM 계산 상세 예제, Monte Carlo 실습
- Scrum 상세, Jira/MS Project 사용법
- Procurement 계약법 상세, 조직 PMO 운영 상세
- SWQM/DevOps forward topic의 상세 사례

## PM LLM Practice Quality Gate

Practice Pack v1.1의 "Course Practice Quality Gate" 및 Baseline §19 LLM-integrated Practice 추가 Gate를 그대로 유지한다:

- 7개 Practice가 과정 전반(T01~T19)에 분산되어 있는가?
- 모든 Practice가 15–30분 범위인가? (P1/P3/P6 20분, P2/P4/P5/P7 25분)
- Recommended Prompt를 마지막에만 공개하는가?
- Intervention이 정답이 아니라 추가 관점/제약/evidence를 제공하는가?
- 기존 OWNER/RECAP/APPLY/FORWARD 경계를 유지하는가?
- 기존 800분 instructional time 한도를 넘기지 않는가?
- 강의 상세는 삭제보다 Optional/Reference/Appendix로 보존하는가?
- Course duration(16h)에 맞는 Practice 수(6–8개)와 cadence(Day1 3 / Day2 4)를 충족하는가?
- Prompt Engineering이 아니라 Course-owned decision/evidence를 평가하는가?
- Practice 때문에 기존 Course Ownership 경계(Agile/DevOps/SWQM)가 이동하지 않는가?
