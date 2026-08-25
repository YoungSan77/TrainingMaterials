# Modern SWQM — Practice Design

> **Course ID:** swqm
> **Stage:** Course Design (Stage 1 of 3) — 이 문서는 `guides/과정_설계_지침.md` §2-b 구조를 따른다.
> **Standard:** `portfolio/practice-standard.md` (필드 상세·운영 규칙의 정본 — 여기서 재정의하지 않는다) · `portfolio/concept-ownership.md` §15 (Ownership 경계).
> **Legacy migration provenance:** context v2.6 Practice Pack v1.1의 4개 Practice 전체를 `portfolio/practice-standard.md` §6 필드 스키마로 재구성했으며, 어떤 Practice도 병합·삭제·축약하지 않았다. 원문 문장은 유지하고 원출처는 Git history에 보존된다.
> **lab-design.md 관계:** swqm은 `lab-design.md`가 없는 7개 과정 중 하나다(`과정_설계_지침.md` §2-b). 이 Practice Pack이 실습 설계의 기준선이다.
> **Distribution:** Practice Pack은 Instructor-only asset이다(`practice-standard.md` §2). 학습자용 자료에는 각 Practice의 `Initial Instruction / Deliverable / Inputs / Timebox`까지만 배포하고, Intervention과 Recommended Prompt는 실습 진행 중 정해진 시점에만 공개한다.
>
> **Curriculum pointer (read-only, 정본 아님):** 실제 세션·시간표는 `courses/swqm/swqm_커리큘럼.md`(16h·2일·11세션, S01–S11)가 정본이다. 이 문서는 그 Curriculum을 재작성하거나 세션에 실습을 확정 삽입하지 않는다. 이 문서에 흡수된 Practice Pack의 Placement(T01–T10)는 legacy 8h baseline Topic 번호이며, 실제 16h/11세션 구조와 번호 체계가 다르다. 아래 §4 "Curriculum Placement Mapping"은 참고용 대응 관계이며 Curriculum Authoring 단계에서 확정한다.

---

## 1. Practice Count vs Portfolio Standard — Open Gap (확인 필요)

> **결론을 미리 밝힌다:** Practice Pack v1.1은 **4개** Practice를 정의한다. `portfolio/practice-standard.md` §3(Portfolio Quantity/Cadence Rule)은 **16h 과정에 6–8개**를 요구한다. 실제 `courses/swqm/swqm_커리큘럼.md`는 16h·11세션이므로, 이 과정은 16h 기준을 적용받는다.
>
> Practice Pack이 4개인 이유는 Pack 헤더(`Course: courses/06_swqm.md`)가 가리키는 **8h baseline** 구조를 대상으로 저작되었기 때문이다. migration 당시 함께 흡수된 Source Evidence도 "Course alignment: Modern SWQM 8h"로 같은 기준을 명시한다. 즉 Pack 자체가 실제 16h Curriculum을 기준으로 재저작된 적이 없다.
>
> **이 문서는 새 Practice를 만들어 채우지 않는다.** `과정_설계_지침.md` §0의 R&R 경계 — "내용 판단은 대화에서, 구현은 Code" / "Code 즉석 생성 금지" — 에 따라 부족분 2–4개를 여기서 즉석 저작하는 것은 Course Design 문서가 스스로 판단할 권한 밖이다. 아래 4개는 Pack 원문을 원형 그대로 보존하고, 수량 격차는 미해결 항목(§5)으로 명시한다.

---

## 2. Operating Rules (practice-standard.md §2, §5 적용 — Practice Pack v1.1 원문)

- 실습 시작 시 Recommended Prompt를 제공하지 않는다.
- 학습자가 먼저 자신의 Prompt와 작업 접근을 설계한다.
- 시작 후 5–10분에 Instructor Intervention을 제공한다.
- 학습자는 새 과제로 재시작하지 않고 **Keep Going**하며 Prompt·산출물·판단을 개선한다.
- 종료 시 Recommended Prompt와 Prompt Design Intent를 공개한다.
- Recommended Prompt는 정답이 아니며, 자신의 Context에 맞게 유지·삭제·수정한다.
- 평가 대상은 Prompt 문장력이 아니라 **Course-owned decision, evidence, trade-off, failure condition**의 품질이다.
- LLM 사용이 Concept OWNER를 이동시키지 않는다(`practice-standard.md` §9) — 모든 Practice의 판단 OWNER는 Modern SWQM이며, AI-Native 개념(Context Engineering/Guardrail/Harness)을 재정의하지 않는다(`concept-ownership.md` §15, 아래 P4 참고).

---

## 3. Practice Index

| ID | Pack Placement (8h baseline Topic) | Timebox | Course Ownership | Core Decision |
|---|---|---:|---|---|
| P1 | T01/T02 | 20분 | OWNER — Quality as System Property; Quality Risk/Cost of Quality/Rework; Organizational Incentive/System Cause | 반복 품질 문제를 사람 문제가 아니라 시스템 위험과 feedback delay로 어떻게 진단할 것인가 |
| P2 | T05/T06 | 25분 | OWNER — Shift-Left/Prevention vs Detection; Review/Inspection의 품질 관점; Test Strategy의 품질 포트폴리오 관점; Static Analysis/Automated Verification의 배치 원칙 / APPLY — Requirement example의 품질 Evidence 관점만 | 요구·review·static check·test 중 어디서 어떤 위험을 가장 싸게 검증할 것인가 |
| P3 | T07/T08 | 25분 | OWNER — Test Strategy의 품질 포트폴리오 관점; Quality Evidence/Quality Gate | risk/speed/confidence에 맞는 test/evidence portfolio와 gate는 무엇인가 |
| P4 | T09/T10 | 20분 | OWNER — Quality Metrics/Measurement System(Goodhart 포함); Continuous Improvement/Quality Operating Model / APPLY — AI-Native Evaluation 결과를 Quality Evidence로만 사용, Context Engineering/Guardrail/Harness 재정의 금지 | 어떤 metric과 AI-specific evidence를 진단에 쓰고 무엇을 목표화하지 않을 것인가 |

Pack이 명시한 총 Practice Time은 약 90분(20+25+25+20)이며, Pack 헤더의 "약 90분, 기존 instructional time에 포함" 선언과 일치한다.

---

## P1. Quality Risk & Rework Diagnosis

| Field | Content |
|---|---|
| **Practice ID / Title** | P1 — Quality Risk & Rework Diagnosis |
| **Course Ownership** | OWNER — Quality as System Property; Quality Risk / Cost of Quality / Rework; Organizational Incentive / System Cause (`course-context.md` §11.1). `course-context.md` §13 "System over Blame" 원칙과 Lens Systems Thinking/ToC(§9)를 직접 강화한다. |
| **Decision Practiced** | 반복 품질 문제를 사람 문제가 아니라 시스템 위험과 feedback delay로 어떻게 진단할 것인가 |
| **Work Context** | 반복 결함·재작업·수동 검증·늦은 피드백이 존재하는 제품팀이 예방·검증·Evidence·Gate를 재설계하는 품질 개선 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 결함 사례에서 발생점/검출점/rework/책임 구조를 분석한다. |
| **Timebox** | 20분 |
| **Initial Instruction** | 결함 사례에서 발생점/검출점/rework/책임 구조를 분석한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 개인 실수처럼 보이지만 동일 유형이 반복된다는 evidence를 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\nblame을 피하고 defect escape, feedback delay, handoff, incentive, missing evidence 관점으로 원인 가설을 비교하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P2. Shift-left Verification Placement

| Field | Content |
|---|---|
| **Practice ID / Title** | P2 — Shift-left Verification Placement |
| **Course Ownership** | OWNER — Shift-Left / Prevention vs Detection; Review / Inspection의 품질 관점; Test Strategy의 품질 포트폴리오 관점; Static Analysis / Automated Verification의 배치 원칙 (`course-context.md` §11.1). 요구(Requirement) 검증 지점을 다룰 때는 §11.2 규정대로 **Requirement example/Acceptance Criteria를 품질 Evidence 관점에서만 APPLY**하며, 요구공학 자체(무엇을 요구로 정의할지)는 재정의하지 않는다. |
| **Decision Practiced** | 요구·review·static check·test 중 어디서 어떤 위험을 가장 싸게 검증할 것인가 |
| **Work Context** | 반복 결함·재작업·수동 검증·늦은 피드백이 존재하는 제품팀이 예방·검증·Evidence·Gate를 재설계하는 품질 개선 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 품질 위험별 verification point와 evidence를 배치한다. |
| **Timebox** | 25분 |
| **Initial Instruction** | 품질 위험별 verification point와 evidence를 배치한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 같은 검사를 여러 gate에 중복하면 비용이 증가한다는 제약을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\n각 risk를 가장 이른 유효 검증 지점에 배치하고 중복 gate, false positive, maintenance cost를 함께 비교하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P3. Test Strategy & Quality Gate

| Field | Content |
|---|---|
| **Practice ID / Title** | P3 — Test Strategy & Quality Gate |
| **Course Ownership** | OWNER — Test Strategy의 품질 포트폴리오 관점; Quality Evidence / Quality Gate (`course-context.md` §11.1). Test Pyramid/70:20:10 비율을 다룰 경우 `references/verified-sources.md` Q02의 Teaching correction(비율을 정책·KPI로 고정하지 않는다)을 따른다. |
| **Decision Practiced** | risk/speed/confidence에 맞는 test/evidence portfolio와 gate는 무엇인가 |
| **Work Context** | 반복 결함·재작업·수동 검증·늦은 피드백이 존재하는 제품팀이 예방·검증·Evidence·Gate를 재설계하는 품질 개선 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 고정 pyramid가 아닌 위험 기반 test portfolio와 CI gate를 설계한다. |
| **Timebox** | 25분 |
| **Initial Instruction** | 고정 pyramid가 아닌 위험 기반 test portfolio와 CI gate를 설계한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 느린 E2E와 flaky test, 배포 빈도 요구를 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\ntest level별 purpose, feedback time, confidence, maintenance cost를 비교해 최소 evidence set과 gate criteria를 제안하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P4. Metric / AI Output Quality Decision

| Field | Content |
|---|---|
| **Practice ID / Title** | P4 — Metric / AI Output Quality Decision |
| **Course Ownership** | OWNER — Quality Metrics / Measurement System (Goodhart 포함); Continuous Improvement / Quality Operating Model (`course-context.md` §11.1). **AI 산출물 부분은 APPLY 경계를 명시적으로 지킨다:** `concept-ownership.md` §15와 `course-context.md` §11.4(Ownership Boundary Risk)에 따라 이 Practice는 Context Engineering / Guardrail / Harness를 정의하거나 재정의하지 않는다. 다루는 것은 "생성물의 품질을 어떤 기존 Engineering Evidence + 추가 AI Evaluation으로 검증할 것인가"라는 QM 고유 판단(책임·검증·Evidence)이며, AI-Native의 Specification/Guardrail/Evaluation 결과는 **Quality Evidence로만 APPLY**한다. |
| **Decision Practiced** | 어떤 metric과 AI-specific evidence를 진단에 쓰고 무엇을 목표화하지 않을 것인가 |
| **Work Context** | 반복 결함·재작업·수동 검증·늦은 피드백이 존재하는 제품팀이 예방·검증·Evidence·Gate를 재설계하는 품질 개선 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | metric gaming 위험과 AI output 검증 방안을 설계한다. |
| **Timebox** | 20분 |
| **Initial Instruction** | metric gaming 위험과 AI output 검증 방안을 설계한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 경영진이 단일 KPI를 보상에 연결하려는 조건을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\nmetric의 decision use와 gaming risk를 구분하고 AI output은 기존 engineering evidence + 필요한 AI-specific eval로 검증하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## 4. Curriculum Placement Mapping (참고용, 비정본)

Practice Pack의 Placement(T01–T10)는 8h baseline Topic 번호다. 실제 `courses/swqm/swqm_커리큘럼.md`는 16h·S01–S11 구조로 재편되어 있어 번호가 1:1로 대응하지 않는다. 아래는 이 문서와 `references/verified-sources.md`에 흡수된 "8h Curriculum Evidence Map"의 Topic 설명을 실제 세션 제목과 대조한 **참고 매핑**이며, 세션에 실습을 확정 배치하는 것은 Curriculum Authoring 단계(`과정_설계_지침.md` §6)의 몫이다.

| Practice | Pack Placement | Baseline Topic 설명 (Source Evidence §10) | 실제 세션 후보 (`swqm_커리큘럼.md`) | 비고 |
|---|---|---|---|---|
| P1 | T01/T02 | Quality as system / Shift-Left / responsibility | S01 품질 문제의 원인 → S02 품질관리의 정의와 이해당사자 | 연속 배치 가능 |
| P2 | T05/T06 | requirement quality / review & static verification | S03 요구사항과 품질 계획 → S04 동료검토와 감리/감사 | 연속 배치 가능 |
| P3 | T07/T08 | test strategy / quality pipeline / evidence & gate | S05 테스팅 전략 → S06 자동화와 CI·CD 도입 | 연속 배치 가능 |
| P4 | T09/T10 | metrics / system incentives (T09) + AI output quality + QM operating model (T10) | S08 표준화·내재화와 보상 (metrics 부분) / S10 AI 시대의 품질관리 (AI 부분) | **비연속** — S09(지속적 개선)가 두 세션 사이에 들어와 있어 Pack이 가정한 인접 배치와 다르다. 하나의 Practice로 유지할지 S08/S10 두 개로 분리할지는 미해결(§5). |

Baseline T03/T04(QMS/maturity/audit & evidence, 실제 S04/S08과 근접)에는 Pack이 정의한 Practice가 없다 — Pack 자체의 공백이며 이 문서가 새로 채우지 않는다.

---

## 5. Open Items for Curriculum Authoring Stage (미해결, Youngon 판단 필요)

1. **수량 격차:** Practice Pack 4개 vs `practice-standard.md` §3의 16h 기준 6–8개. 부족분을 새 Practice 저작으로 채울지, 8h 시절 설계를 그대로 유지할 근거가 있는지는 대화(Youngon)에서 결정한다.
2. **P4 비연속 배치:** S08(metrics)과 S10(AI) 사이에 S09(지속적 개선)가 있어 Pack이 전제한 "T09/T10 인접" 구조가 깨진다. 하나의 Practice를 유지한 채 배치만 옮길지, metrics 부분과 AI 부분을 두 개의 별도 Practice로 분리할지 결정이 필요하다.
3. **Practice 시간의 세션 내 편입:** `practice-standard.md` §3 "Practice 시간은 기존 instructional time 안에 포함한다"에 따라 90분(P1–P4 합)을 어느 세션의 몇 분 안에 넣을지는 Curriculum Authoring에서 각 세션 분량(S01 70분·S02 80분 등)과 함께 재계산해야 한다. 이 문서는 세션 시간표를 수정하지 않았으므로 편입 여부는 미확정이다.
4. **T03/T04 공백:** QMS/maturity/audit & evidence 영역(대략 S04 2부·S08과 겹침)에 해당하는 Practice가 Pack에 없다. 8h 기준 4개 중 QMS/Audit 축이 빠져 있었다는 뜻이며, 위 1번 수량 격차와 함께 검토 대상이다.

---

## 6. Course Practice Quality Gate (Practice Pack v1.1 원문 — swqm 적용)

- 4개 Practice가 과정 전반에 분산되어 있는가? → 위 §4 매핑상 S01–S06 구간에 3개(P1–P3)가 몰려 있고 S08/S10에 P4가 걸쳐 있다. **8h 기준 4개 분산**이며 16h·11세션 전체 분산은 아니다(§5-1과 연결된 gap).
- 모든 Practice가 15–30분 범위인가? → 예 (20/25/25/20분).
- Recommended Prompt를 마지막에만 공개하는가? → 예, Pack 설계상 Debrief 단계 공개.
- Intervention이 정답이 아니라 추가 관점/제약/evidence를 제공하는가? → 예, 4개 모두 "관점 확장형" 제약 추가.
- 기존 OWNER/RECAP/APPLY/FORWARD 경계를 유지하는가? → 예, §3·P1–P4 Course Ownership 필드에서 확인. P4는 AI-Native 경계를 명시적으로 재확인했다.
- 기존 instructional time 한도를 넘기지 않는가? → **미확정** — §5-3 참고, 세션 편입 계산이 Curriculum Authoring 단계에 남아 있다.
- 강의 상세는 삭제보다 Optional/Reference/Appendix로 보존하는가? → 해당 사항 Curriculum Authoring 단계 소관, 이 문서는 강의 상세를 다루지 않는다.
