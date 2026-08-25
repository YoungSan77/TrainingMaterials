# Agile Practice Design — LLM-Integrated Practice

> **Course ID:** agile
> **Standard:** `portfolio/practice-standard.md` (필드 상세·운영 규칙의 정본 — 여기서 재정의하지 않는다)
> **Legacy migration provenance:** context v2.6 Practice Pack v1.1의 4개 Practice 전체를 `portfolio/practice-standard.md` §6 필드 스키마로 재구성했으며, 어떤 Practice도 병합·삭제·축약하지 않았다. 원출처는 Git history에 보존된다.
> **No `lab-design.md`:** Agile은 `guides/과정_설계_지침.md` §2-b가 말하는 "`lab-design.md`가 없는 과정"에 해당한다. 이 문서(Practice Pack 기반)가 실습 설계의 기준선이다.
> **Distribution:** Practice Pack은 Instructor-only asset이다(practice-standard.md §2). 학습자용 자료에는 각 Practice의 `Initial Instruction / Deliverable / Inputs / Timebox`까지만 배포하고, Intervention과 Recommended Prompt는 실습 진행 중 정해진 시점에만 공개한다.
>
> **Practice Count:** 4 (P1–P4) — Portfolio Quantity/Cadence Rule(practice-standard.md §3)의 8h 과정 기준 3–4개 범위 안, 1일 4개.
> **Total Practice Time:** 약 90분 — 기존 약 400분 instructional time 안에 포함, 별도 운영시간으로 추가하지 않는다.
> **Common Case:** 제품팀이 큰 요구, 늦은 피드백, 불안정한 개발 규율 속에서 Agile/Scrum 적용 방식을 재설계하는 실제 개선 상황(baseline `07_agile.md` §13 Exercise Evidence의 공통 Case: 요구 불확실, 외부 개발 의존, 고객 Feedback 장주기, Build/Test 자동화 낮음, 후반 결함 집중, 경영진이 전사 Scrum 도입을 지시한 프로젝트).

## Operating Rules (practice-standard.md §2, §5 적용)

- 실습 시작 시 Recommended Prompt를 제공하지 않는다. 학습자가 먼저 자신의 Prompt와 작업 접근을 설계한다(Phase B).
- 시작 후 5–10분에 Instructor Intervention을 제공한다(Phase C).
- 학습자는 새 과제로 재시작하지 않고 **Keep Going**하며 Prompt·산출물·판단을 개선한다(Phase D).
- 종료 시 Recommended Prompt와 Prompt Design Intent를 공개한다(Phase E). Recommended Prompt는 정답이 아니며, 자신의 Context에 맞게 유지·삭제·수정한다.
- 평가 대상은 Prompt 문장력이 아니라 **Course-owned decision, evidence, trade-off, failure condition**의 품질이다.
- LLM 사용이 Concept OWNER를 이동시키지 않는다(practice-standard.md §9) — 모든 Practice의 판단 OWNER는 Agile이다.

## Practice Index

| ID | Placement | Practice | Timebox | Core Decision |
|---|---|---|---:|---|
| P1 | T01/T02 | Diagnose before Agile | 20분 | 문제가 uncertainty/feedback/engineering/governance 중 무엇이며 Agile이 무엇을 해결하지 못하는가 |
| P2 | T04 | Slice for Value & Feedback | 25분 | 큰 요구를 어떤 vertical increment로 쪼개야 빠른 학습이 가능한가 |
| P3 | T05/T06 | Scrum Mechanism Repair | 25분 | Scrum 요소가 왜 무력화됐고 최소 어떤 구조를 고칠 것인가 |
| P4 | T07/T08 | Pilot / Scale / Stop Decision | 20분 | 어떤 pilot을 하고 어떤 evidence로 확대·수정·중단할 것인가 |

---

## P1. Diagnose before Agile

| Field | Content |
|---|---|
| **Practice ID / Title** | P1 — Diagnose before Agile |
| **Course Ownership** | Agile OWNER — Agile Diagnosis |
| **Decision Practiced** | 문제가 uncertainty/feedback/engineering/governance 중 무엇이며 Agile이 무엇을 해결하지 못하는가 |
| **Work Context** | 제품팀이 큰 요구, 늦은 피드백, 불안정한 개발 규율 속에서 Agile/Scrum 적용 방식을 재설계하는 실제 개선 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 사례를 분류하고 Agile 적용/비적용 범위를 결정한다. |
| **Timebox** | 20분 |
| **Initial Instruction** | 사례를 분류하고 Agile 적용/비적용 범위를 결정한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 약한 build/test 자동화와 긴 승인 체계를 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\nframework를 추천하기 전에 문제를 uncertainty, feedback, engineering capability, organization, governance로 분리하고 Agile이 해결 못할 항목을 명시하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P2. Slice for Value & Feedback

| Field | Content |
|---|---|
| **Practice ID / Title** | P2 — Slice for Value & Feedback |
| **Course Ownership** | Agile OWNER — Increment / Feedback |
| **Decision Practiced** | 큰 요구를 어떤 vertical increment로 쪼개야 빠른 학습이 가능한가 |
| **Work Context** | 제품팀이 큰 요구, 늦은 피드백, 불안정한 개발 규율 속에서 Agile/Scrum 적용 방식을 재설계하는 실제 개선 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 기능 묶음을 2~3개 vertical slice로 분해하고 feedback question을 만든다. |
| **Timebox** | 25분 |
| **Initial Instruction** | 기능 묶음을 2~3개 vertical slice로 분해하고 feedback question을 만든다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | UI만/DB만 나누는 layer slice 제안을 거절하는 조건을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\n각 slice가 end-to-end value와 검증 가능한 feedback을 만들도록 분해하고 dependency와 non-sliceable 제약을 표시하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P3. Scrum Mechanism Repair

| Field | Content |
|---|---|
| **Practice ID / Title** | P3 — Scrum Mechanism Repair |
| **Course Ownership** | Agile OWNER — Scrum Application |
| **Decision Practiced** | Scrum 요소가 왜 무력화됐고 최소 어떤 구조를 고칠 것인가 |
| **Work Context** | 제품팀이 큰 요구, 늦은 피드백, 불안정한 개발 규율 속에서 Agile/Scrum 적용 방식을 재설계하는 실제 개선 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 보고회화/발표회화/권한 부족 사례를 진단해 intervention을 정한다. |
| **Timebox** | 25분 |
| **Initial Instruction** | 보고회화/발표회화/권한 부족 사례를 진단해 intervention을 정한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | Sprint Goal과 DoD가 형식적으로만 존재한다는 조건을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\nScrum 이벤트/역할 이름을 바꾸기보다 transparency-inspection-adaptation loop가 막힌 원인을 찾아 최소 변경을 제안하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P4. Pilot / Scale / Stop Decision

| Field | Content |
|---|---|
| **Practice ID / Title** | P4 — Pilot / Scale / Stop Decision |
| **Course Ownership** | Agile OWNER — Agile Adoption |
| **Decision Practiced** | 어떤 pilot을 하고 어떤 evidence로 확대·수정·중단할 것인가 |
| **Work Context** | 제품팀이 큰 요구, 늦은 피드백, 불안정한 개발 규율 속에서 Agile/Scrum 적용 방식을 재설계하는 실제 개선 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 외부 개발·다중팀 환경에서 90일 pilot과 scale gate를 설계한다. |
| **Timebox** | 20분 |
| **Initial Instruction** | 외부 개발·다중팀 환경에서 90일 pilot과 scale gate를 설계한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 조직이 SAFe 같은 scaling부터 요구한다는 조건을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\nsingle-team feedback이 먼저 작동하는 pilot을 설계하고 outcome/evidence로 scale, adapt, stop 조건을 명시하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## Optional / Reference Candidates When Time Is Tight

Time-pressure Rule(practice-standard.md §11)에 따라, Core Narrative와 4개 Practice는 유지하고 다음 상세만 강의 중 생략 가능 계층으로 이동할 수 있다(삭제하지 않음) — baseline(`07_agile.md` §12 Awareness Topics)의 각 항목:

- XP(TDD/Refactoring/CI의 engineering practice 위치)
- Kanban(Flow 중심 대안)
- Story Point / Planning Poker(Relative Estimation)
- Velocity / Burn-down / Burn-up(진행 가시화, KPI 금지)
- Jira 등 Tool(Backlog/Workflow 지원 도구일 뿐 Agile 자체 아님)
- Nexus / LeSS / SAFe(Multi-team / 조직 규모 Scaling 접근)
- Hybrid(Predictive + Adaptive 조합)
- DevOps(Delivery/Operations Feedback으로의 확장)

## Agile LLM Practice Quality Gate

Practice Pack v1.1의 Quality Gate를 그대로 유지한다:

- 4개 Practice가 과정 전반에 분산되어 있는가?
- 모든 Practice가 15–30분 범위인가?
- Recommended Prompt를 마지막에만 공개하는가?
- Intervention이 정답이 아니라 추가 관점/제약/evidence를 제공하는가?
- 기존 OWNER/RECAP/APPLY/FORWARD 경계를 유지하는가?
- 기존 instructional time 한도를 넘기지 않는가?
- 강의 상세는 삭제보다 Optional/Reference/Appendix로 보존하는가?
