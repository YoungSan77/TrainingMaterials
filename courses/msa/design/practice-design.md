# MSA Practice Design — LLM-Integrated Practice

> **Course ID:** msa
> **Standard:** `portfolio/practice-standard.md` (필드 상세·운영 규칙의 정본 — 여기서 재정의하지 않는다)
> **Legacy migration provenance:** context v2.6 Practice Pack v1.1의 4개 Practice 전체를 `portfolio/practice-standard.md` §6 필드 스키마로 재구성했으며, 어떤 Practice도 병합·삭제하지 않았다. 각 필드 본문은 원문을 유지하고 원출처는 Git history에 보존된다.
> **Complements, does not replace:** `courses/msa/lab-design.md` — lab-design.md는 실습 대상·코드 대조쌍(로컬 포트 vs 원격 어댑터, 인프로세스 이벤트 vs 메시지)을 소유하고, 이 문서는 학습자가 LLM과 어떻게 상호작용하는가(운영 흐름·개입·평가)를 소유한다. 두 문서는 같은 Order 도메인 사례를 공유하되 서로 다른 층위를 다룬다 — 어느 한쪽도 다른 쪽을 대체하지 않는다(`guides/과정_설계_지침.md` §2-b).
> **Distribution:** Practice Pack은 Instructor-only asset이다(practice-standard.md §2). 학습자용 자료에는 각 Practice의 `Initial Instruction / Deliverable / Inputs / Timebox`까지만 배포하고, Intervention과 Recommended Prompt는 실습 진행 중 정해진 시점에만 공개한다.
>
> **Practice Count:** 4 (P1–P4) — `portfolio/practice-standard.md` §3 Portfolio Quantity/Cadence Rule의 8h 과정 기준 3–4개 범위의 상한. MSA 과정 기준시간은 8h다(`portfolio/evidence-policy.md` 하단 "Unified Portfolio Alignment v2.6" — OOAD/DDD/SWA/**MSA**/AI-Native/... = 16/8/16/**8**/16h... 순).
> **Total Practice Time:** 20+25+25+20 = 약 90분 — migration 당시 흡수한 400분 instructional-time 기준 안에 포함하며 별도 운영시간으로 추가하지 않는다. 8h 과정 총 운영 480분 한도도 넘지 않는다.
> **Common Case:** Order Domain — `courses/msa/curriculum.md`가 2–8교시에 걸쳐 이어가는 동일 Order 사례, `courses/msa/lab-design.md`의 대조쌍(로컬→원격, 인프로세스 이벤트→메시지)과 같은 도메인을 공유한다.

## Operating Rules (practice-standard.md §2, §5 적용; Pack "Operating Rules" 원문 반영)

- 실습 시작 시 Recommended Prompt를 제공하지 않는다. 학습자가 먼저 자신의 Prompt와 작업 접근을 설계한다(Phase B).
- 시작 후 5–10분에 Instructor Intervention을 제공한다(Phase C).
- 학습자는 새 과제로 재시작하지 않고 **Keep Going**하며 Prompt·산출물·판단을 개선한다(Phase D).
- 종료 시 Recommended Prompt와 Prompt Design Intent를 공개한다(Phase E). Recommended Prompt는 정답이 아니며, 자신의 Context에 맞게 유지·삭제·수정한다.
- 평가 대상은 Prompt 문장력이 아니라 **Course-owned decision, evidence, trade-off, failure condition**의 품질이다.
- LLM 사용이 Concept OWNER를 이동시키지 않는다(practice-standard.md §9) — 모든 Practice의 판단 OWNER는 MSA다. DDD/SW Architecture 개념이 Intervention에 등장해도(예: Bounded Context, Port) 그 정의 자체를 재교육하지 않는다 — MSA는 이를 APPLY로만 가져온다(`course-context.md` §8 APPLY).

## Practice Index

Placement는 이 문서에 흡수된 Pack 원문의 Topic 좌표(T0x, legacy 8-Topic Backbone 기준)를 `courses/msa/curriculum.md`의 실제 8교시에 내용 기준으로 매핑한 것이다 — curriculum.md를 수정하지 않고, 그 교시 번호를 그대로 인용한다.

| ID | Placement (교시) | Pack Placement | Practice | Timebox | Core Decision |
|---|---|---|---:|---|---|
| P1 | 교시1(왜·언제 MSA) / 교시3(모듈러 모놀리스, 실습) | T01/T03 | Should We Distribute? | 20분 | 분산이 실제로 비용을 지불할 가치가 있는가 |
| P2 | 교시4(Order 모놀리스를 모듈로 분할) | T04 | Service Boundary & Data Ownership | 25분 | 서비스 경계와 데이터 소유를 어디에 둘 것인가 |
| P3 | 교시5(서비스 추출) / 교시6(분산 패턴① 동기 vs 이벤트) | T05/T06 | Contract, Compatibility & Consistency | 25분 | 변경 호환성과 consistency 요구를 어떻게 함께 설계할 것인가 |
| P4 | 교시7(분산 패턴② Saga·Outbox) / 교시8(종합·판단 프레임) | T07/T08 | Failure + Observability + Ops Cost | 20분 | 장애 설계와 관찰성, 운영비용을 어떻게 한 결정으로 볼 것인가 |

**P4 배치 관련 알려진 격차:** `course-context.md` §9(Known Gap vs Current Curriculum)는 Idempotency·Failure/Resilience·Distributed Observability·Operational Complexity가 canonical OWNER 개념임에도 현재 8교시에 이를 다루는 독립 교시가 없다고 이미 기록했다. P4는 이 격차 위에서 운영된다 — 교시7(Saga/Outbox)의 compensation 논의와 교시8(종합·판단 프레임: "언제 MSA를 안 하나")이 현재 커리큘럼에서 P4의 판단축(장애·관찰성·운영비용)에 가장 가까운 자리이며, P4의 Deliverable("MSA 유지 여부를 재판단")은 교시8의 주제와 직접 연결된다. 이 배치가 격차를 메우지는 않는다 — 격차 해소는 curriculum.md 개정 대상이며 이 문서의 범위 밖이다.

---

## P1. Should We Distribute?

| Field | Content |
|---|---|
| **Practice ID / Title** | P1 — Should We Distribute? |
| **Course Ownership** | MSA OWNER — MSA Adoption/Rejection Decision, Modular Monolith (`course-context.md` §8 OWNER) |
| **Decision Practiced** | 분산이 실제로 비용을 지불할 가치가 있는가 |
| **Work Context** | 모듈러 모놀리스가 성장하면서 팀 자율성·변경 독립성 요구와 분산시스템 비용 사이에서 서비스 분리를 판단하는 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 모놀리스 유지/모듈화/서비스 분리 대안을 비교한다. |
| **Timebox** | 20분 |
| **Initial Instruction** | 모놀리스 유지/모듈화/서비스 분리 대안을 비교한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 독립 배포 필요성과 운영 인력 부족을 동시에 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\n독립 배포·확장·소유 이득과 network/operation 비용을 비교해 가장 단순한 배치 형태를 선택하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P2. Service Boundary & Data Ownership

| Field | Content |
|---|---|
| **Practice ID / Title** | P2 — Service Boundary & Data Ownership |
| **Course Ownership** | MSA OWNER — Service Boundary Evaluation/Extraction, Data Ownership (`course-context.md` §8 OWNER) |
| **Decision Practiced** | 서비스 경계와 데이터 소유를 어디에 둘 것인가 |
| **Work Context** | 모듈러 모놀리스가 성장하면서 팀 자율성·변경 독립성 요구와 분산시스템 비용 사이에서 서비스 분리를 판단하는 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 후보 capability를 서비스로 추출할지와 데이터 소유를 결정한다. |
| **Timebox** | 25분 |
| **Initial Instruction** | 후보 capability를 서비스로 추출할지와 데이터 소유를 결정한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 공유 DB를 유지해야 한다는 기존 제약을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\n경계의 autonomy가 공유 데이터로 훼손되는지 분석하고 module/service 대안을 trade-off로 비교하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P3. Contract, Compatibility & Consistency

| Field | Content |
|---|---|
| **Practice ID / Title** | P3 — Contract, Compatibility & Consistency |
| **Course Ownership** | MSA OWNER — API/Event/Schema Contract 및 Compatibility/Contract Evolution, Sync vs Async, Distributed Consistency/Transaction (`course-context.md` §8 OWNER) |
| **Decision Practiced** | 변경 호환성과 consistency 요구를 어떻게 함께 설계할 것인가 |
| **Work Context** | 모듈러 모놀리스가 성장하면서 팀 자율성·변경 독립성 요구와 분산시스템 비용 사이에서 서비스 분리를 판단하는 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | API/event 변화와 동기/비동기 consistency 대안을 설계한다. |
| **Timebox** | 25분 |
| **Initial Instruction** | API/event 변화와 동기/비동기 consistency 대안을 설계한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 중복 메시지와 지연 허용시간을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\ncontract evolution, idempotency, consistency time bound를 함께 고려하고 반드시 즉시 일관적이어야 하는 invariant만 분리하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P4. Failure + Observability + Ops Cost

| Field | Content |
|---|---|
| **Practice ID / Title** | P4 — Failure + Observability + Ops Cost |
| **Course Ownership** | MSA OWNER — Failure/Resilience(Partial Failure, Retry/Isolation/Fallback), Distributed Observability, Deployment/Scaling/Operational Complexity, MSA Adoption/Rejection Decision(재판단) (`course-context.md` §8 OWNER) |
| **Decision Practiced** | 장애 설계와 관찰성, 운영비용을 어떻게 한 결정으로 볼 것인가 |
| **Work Context** | 모듈러 모놀리스가 성장하면서 팀 자율성·변경 독립성 요구와 분산시스템 비용 사이에서 서비스 분리를 판단하는 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | timeout/retry/observability/runbook 후보를 설계하고 MSA 유지 여부를 재판단한다. |
| **Timebox** | 20분 |
| **Initial Instruction** | timeout/retry/observability/runbook 후보를 설계하고 MSA 유지 여부를 재판단한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 재시도 폭주와 on-call 부담 조건을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\nfailure mode별 대응과 관측 evidence를 연결하고 운영 복잡도가 분산의 가치보다 큰지 최종 판단하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## Optional / Reference Candidates When Time Is Tight

Time-pressure Rule(practice-standard.md §11)에 따라, Core Narrative와 4개 Practice는 유지하고 다음 상세만 강의 중 생략 가능 계층으로 이동할 수 있다(삭제하지 않음). 목록은 migration 당시 흡수된 "Awareness 1~5분" 항목이다 — 이 문서가 새로 만든 범위가 아니다.

- Choreography vs Orchestration의 상세 비교
- API Gateway 상세 기능
- Service Mesh
- Kubernetes
- Platform Engineering

이 항목들은 위치와 목적만 소개하며(Awareness 1–5분), Tool/Vendor Catalog로 확대하지 않는다(`portfolio/evidence-policy.md` §9 Vendor/Product/LLM Independence).

## MSA LLM Practice Quality Gate

Practice Pack v1.1의 Course Practice Quality Gate를 그대로 유지한다:

- 4개 Practice가 과정 전반에 분산되어 있는가?
- 모든 Practice가 15–30분 범위인가?
- Recommended Prompt를 마지막에만 공개하는가?
- Intervention이 정답이 아니라 추가 관점/제약/evidence를 제공하는가?
- 기존 OWNER/RECAP/APPLY/FORWARD 경계를 유지하는가?
- 기존 instructional time 한도를 넘기지 않는가?
- 강의 상세는 삭제보다 Optional/Reference/Appendix로 보존하는가?
