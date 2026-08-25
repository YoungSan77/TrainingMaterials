# DT→AX Practice Design — LLM-Integrated Practice

> **Course ID:** dt-to-ax
> **Standard:** `portfolio/practice-standard.md`(필드 상세·운영 규칙의 정본 — 여기서 재정의하지 않는다)
> **Legacy migration provenance:** context v2.6 Practice Pack v1.1의 4개 Practice 전체를 `portfolio/practice-standard.md` §6 필드 스키마로 재구성했으며, 어떤 Practice도 병합·삭제·축약하지 않았다. 원출처는 Git history에 보존된다.
> **No lab-design.md:** 이 과정에는 `lab-design.md`가 없다(`guides/과정_설계_지침.md` §2-b: "lab-design.md가 없는 과정(swqm 포함 7개)은 Practice Pack을 실습 설계의 기준선으로 삼는다"). 이 문서가 DT→AX 실습 설계의 유일한 기준선이다.
> **Distribution:** Practice Pack은 Instructor-only asset이다(`practice-standard.md` §2). 학습자용 자료에는 각 Practice의 `Initial Instruction / Deliverable / Inputs / Timebox`까지만 배포하고, Intervention과 Recommended Prompt는 실습 진행 중 정해진 시점(시작 후 5–10분 / Debrief)에만 공개한다.
>
> **Practice Count:** 4 (P1–P4) — Portfolio Quantity/Cadence Rule(`practice-standard.md` §3)의 8h 과정 기준 3–4개 범위 안, 1일 4개.
> **Total Practice Time:** 약 90분 — 기존 400분 instructional time 안에 포함, 별도 운영시간으로 추가하지 않는다.
> **Common Case:** baseline(`11_dt-to-ax.md` §20) Integrated DT→AX Case — 중견 서비스 기업(Legacy 시스템 혼재, 데이터 품질 편차, 부서 Silo, 반복 수작업, 경영진의 "전사 AI 도입" 선언, 부서별 Chatbot/Agent PoC 요청, 책임·보안·데이터 접근정책 불명확). 4개 Practice 모두 이 동일 사례를 누적 사용한다(Pack "Work Context" 반복 문구와 일치).

## Operating Rules (Pack "Operating Rules", `practice-standard.md` §2/§5 적용)

- 실습 시작 시 Recommended Prompt를 제공하지 않는다. 학습자가 먼저 자신의 Prompt와 작업 접근을 설계한다(Phase B).
- 시작 후 5–10분에 Instructor Intervention을 제공한다(Phase C).
- 학습자는 새 과제로 재시작하지 않고 **Keep Going**하며 Prompt·산출물·판단을 개선한다(Phase D).
- 종료 시 Recommended Prompt와 Prompt Design Intent를 공개한다(Phase E). Recommended Prompt는 정답이 아니며, 자신의 Context에 맞게 유지·삭제·수정한다.
- 평가 대상은 Prompt 문장력이 아니라 **Course-owned decision, evidence, trade-off, failure condition**의 품질이다.
- LLM 사용이 Concept OWNER를 이동시키지 않는다(`practice-standard.md` §9) — 모든 Practice의 판단 OWNER는 DT→AX다(Readiness / AI Use Case Portfolio / Operating Model·Governance / Transformation Roadmap).

## Practice Index

| ID | Placement | Practice | Timebox | Core Decision |
|---|---|---|---:|---|
| P1 | T04 | Transformation Readiness Diagnosis | 20분 | 현재 문제를 기술 도입이 아니라 value/operating model/data/people/governance readiness로 어떻게 진단할 것인가 |
| P2 | T06 | AI Use Case Portfolio Decision | 25분 | AI use case를 가치·실행가능성·위험으로 어떻게 선택할 것인가 |
| P3 | T08/T09 | Human + AI Operating Model & Governance | 25분 | 어떤 일을 인간/AI가 나누고 decision rights와 oversight를 어디에 둘 것인가 |
| P4 | T11/T12/T13 | Roadmap of Bets → Value Evidence | 20분 | 어떤 pilot을 어떤 evidence로 scale/stop할 것인가 |

운영은 `Learner Prompt → First Run → Instructor Intervention → Keep Going → Recommended Prompt Reveal → Compare/Adapt` 순서다(baseline §"LLM-Integrated Practice Design"). Recommended Prompt는 정답이 아니며, 평가는 Prompt 문장력이 아니라 해당 과정의 전문적 판단 Evidence를 기준으로 한다.

---

## P1. Transformation Readiness Diagnosis

| Field | Content |
|---|---|
| **Practice ID / Title** | P1 — Transformation Readiness Diagnosis |
| **Course Ownership** | DT→AX OWNER — Readiness |
| **Decision Practiced** | 현재 문제를 기술 도입이 아니라 value/operating model/data/people/governance readiness로 어떻게 진단할 것인가 |
| **Work Context** | 기존 DT 투자 위에서 AI use case를 확대하려는 조직이 가치·준비도·운영모델·거버넌스를 함께 판단해야 하는 transformation 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 조직 사례의 readiness bottleneck과 선행조건을 찾는다. |
| **Timebox** | 20분 |
| **Initial Instruction** | 조직 사례의 readiness bottleneck과 선행조건을 찾는다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | AI 예산은 충분하지만 process ownership과 data quality가 약하다는 조건을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\ntechnology enthusiasm과 readiness를 분리하고 value, process, data, architecture, people, governance별 bottleneck을 우선순위화하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P2. AI Use Case Portfolio Decision

| Field | Content |
|---|---|
| **Practice ID / Title** | P2 — AI Use Case Portfolio Decision |
| **Course Ownership** | DT→AX OWNER — AI Use Case Portfolio |
| **Decision Practiced** | AI use case를 가치·실행가능성·위험으로 어떻게 선택할 것인가 |
| **Work Context** | 기존 DT 투자 위에서 AI use case를 확대하려는 조직이 가치·준비도·운영모델·거버넌스를 함께 판단해야 하는 transformation 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 후보 use case를 prioritize하고 pilot 1~2개를 선택한다. |
| **Timebox** | 25분 |
| **Initial Instruction** | 후보 use case를 prioritize하고 pilot 1~2개를 선택한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 높은 가치지만 낮은 verifiability use case를 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\n기술 가능성만 점수화하지 말고 value, data/context readiness, risk, reversibility, verification cost, adoption friction을 비교하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P3. Human + AI Operating Model & Governance

| Field | Content |
|---|---|
| **Practice ID / Title** | P3 — Human + AI Operating Model & Governance |
| **Course Ownership** | DT→AX OWNER — Operating Model / Governance |
| **Decision Practiced** | 어떤 일을 인간/AI가 나누고 decision rights와 oversight를 어디에 둘 것인가 |
| **Work Context** | 기존 DT 투자 위에서 AI use case를 확대하려는 조직이 가치·준비도·운영모델·거버넌스를 함께 판단해야 하는 transformation 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | work decomposition과 human oversight 구조를 설계한다. |
| **Timebox** | 25분 |
| **Initial Instruction** | work decomposition과 human oversight 구조를 설계한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | AI가 추천은 잘하지만 오류 시 고객 피해가 큰 의사결정을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\ntask를 분해하고 human/AI 역할, decision rights, approval, exception, evidence, accountability를 risk에 맞춰 배치하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. 이 Practice에서는 특히 Context/Guardrail/Agent 구현 mechanics(AI-Native SE OWNER)로 판단이 미끄러지지 않도록 한다 — 여기서 다루는 것은 조직적 업무·권한 배치이지 엔지니어링 구현이 아니다(`course-context.md` §11.4). |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P4. Roadmap of Bets → Value Evidence

| Field | Content |
|---|---|
| **Practice ID / Title** | P4 — Roadmap of Bets → Value Evidence |
| **Course Ownership** | DT→AX OWNER — Transformation Roadmap |
| **Decision Practiced** | 어떤 pilot을 어떤 evidence로 scale/stop할 것인가 |
| **Work Context** | 기존 DT 투자 위에서 AI use case를 확대하려는 조직이 가치·준비도·운영모델·거버넌스를 함께 판단해야 하는 transformation 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 3-horizon roadmap과 KPI/evidence/stop criteria를 만든다. |
| **Timebox** | 20분 |
| **Initial Instruction** | 3-horizon roadmap과 KPI/evidence/stop criteria를 만든다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 경영진이 adoption 숫자를 성공 KPI로 요구한다는 조건을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\nadoption을 outcome으로 착각하지 말고 value, flow, quality, economics, risk, learning evidence로 pilot의 scale/adapt/stop 조건을 정하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## Optional / Reference Candidates When Time Is Tight

Time-pressure Rule(`practice-standard.md` §11)에 따라, Core Narrative와 4개 Practice는 유지하고 다음 상세만 강의 중 생략 가능 계층으로 이동할 수 있다(삭제하지 않음) — baseline §9(Topic 02) "Reduce" 및 §25 Explicit Non-Scope와 일치:

- 상세 ISP 공정도
- 상세 ISMP 산출물 목록
- Zachman / EA framework 상세, TOGAF 교육
- BPR 방법론 상세
- NIST AI RMF / ISO/IEC 42001의 조항별 상세(인증교육 아님)
- 산업별 사례 catalog

## DT→AX LLM Practice Quality Gate

Practice Pack v1.1의 "Course Practice Quality Gate"를 그대로 유지한다:

- 4개 Practice가 과정 전반에 분산되어 있는가?
- 모든 Practice가 15–30분 범위인가?
- Recommended Prompt를 마지막에만 공개하는가?
- Intervention이 정답이 아니라 추가 관점/제약/evidence를 제공하는가?
- 기존 OWNER/RECAP/APPLY/FORWARD 경계를 유지하는가?
- 기존 instructional time(400분) 한도를 넘기지 않는가?
- 강의 상세는 삭제보다 Optional/Reference/Appendix로 보존하는가?

추가로(`portfolio/practice-standard.md` §13/§14, baseline "LLM-integrated Practice 추가 Gate"):

- Course duration(8h)에 맞는 Practice 수(3–4개)와 cadence를 충족하는가? — 충족(4개, 1일 4개).
- 모든 Practice가 기존 instructional time 안에 포함되는가? — 충족(약 90분 / 400분 안).
- Recommended Prompt 없이 시작하고 Intervention 후 Keep Going하는가? — 충족.
- Prompt Engineering이 아니라 Course-owned decision/evidence를 평가하는가? — 충족.
- Practice 때문에 기존 Course Ownership 경계가 이동하지 않는가? — 충족(P3에 명시적 경계 주의 포함, §11.4 상호 참조).
