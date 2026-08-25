# DDD Practice Design — LLM-Integrated Practice

> **Course ID:** ddd
> **Standard:** `portfolio/practice-standard.md` (필드 상세·운영 규칙의 정본 — 여기서 재정의하지 않는다)
> **Legacy migration provenance:** context v2.6 Practice Pack v1.1의 4개 Practice 전체를 `portfolio/practice-standard.md` §6 필드 스키마로 재구성했으며, 어떤 Practice도 병합·삭제하지 않았다. 원출처는 Git history에 보존된다.
> **Complements, does not replace:** `courses/ddd/lab-design.md` — lab-design.md는 실습 대상·대조쌍·모델·상황 구성(무엇을 실습 소재로 쓰는가: 스토밍 벽 비교, 애그리거트 경계 대조쌍 D-1/D-2, 컨텍스트 지도 대조)을 소유하고, 이 문서는 학습자가 LLM과 어떻게 상호작용하는가(운영 흐름·개입·평가)를 소유한다. 두 문서는 같은 Order/Payment/Inventory 도메인 사례를 공유하되 서로 다른 층위를 다룬다 — lab-design.md의 "모델 대면"(대조쌍 관찰)과 이 문서의 Practice(LLM과의 판단 순환)는 상호 대체하지 않는다.
> **Distribution:** Practice Pack은 Instructor-only asset이다(practice-standard.md §2). 학습자용 자료에는 각 Practice의 `Initial Instruction / Deliverable / Inputs / Timebox`까지만 배포하고, Intervention과 Recommended Prompt는 실습 진행 중 정해진 시점에만 공개한다.
>
> **Practice Count:** 4 (P1–P4) — Portfolio Quantity/Cadence Rule(practice-standard.md §3)의 8h 과정 기준 3–4개 범위 안.
> **Total Practice Time:** 약 90분 — 기존 480분(1일 8교시) instructional time 안에 포함, 별도 운영시간으로 추가하지 않는다.
> **Common Case:** Order / Payment / Inventory Domain (기존 Canon 사례 유지 — `courses/ddd/curriculum.md`, `courses/ddd/lab-design.md`와 동일 사례).

## Operating Rules (practice-standard.md §2, §5 적용)

- Recommended Prompt는 실습 시작 시 제공하지 않는다. 학습자가 먼저 자신의 Prompt와 작업 접근을 설계한다(Phase B).
- Intervention은 시작 후 5–10분 시점에 공개한다(Phase C).
- 학습자는 새 채팅으로 재시작하지 않고 Keep Going하며 Prompt·산출물·판단을 개선한다(Phase D).
- 종료 시 Recommended Prompt와 Prompt Design Intent를 공개한다(Phase E). Recommended Prompt는 정답이 아니며 학습자의 Context에 맞게 유지·삭제·수정한다.
- 평가 대상은 Prompt 문장력이 아니라 DDD의 도메인 언어·모델링·경계 판단(Course-owned decision, evidence, trade-off, failure condition)이다.
- LLM 사용이 Concept OWNER를 이동시키지 않는다(practice-standard.md §9) — Ubiquitous Language를 판단하면 DDD OWNER, Aggregate boundary를 판단하면 DDD OWNER다.

## Placement Note — Practice Pack 원표기와 현재 curriculum.md의 관계

Practice Pack v1.1의 Placement는 `T02 / T04 / T05 / T07-T08` 형식(Unified Baseline v2.6의 topic 번호)으로 기록되어 있다. 이는 `courses/ddd/curriculum.md`의 실제 1일 8교시 구조(교시 1–8)와 번호 체계가 다르며, 이 문서는 curriculum.md를 수정하지 않으므로 Placement를 curriculum.md의 교시 번호로 임의 재기입하지 않는다. 대신 Pack 원표기를 보존하고, 현재 curriculum.md 상 가장 가까운 대응 구간을 **참고 정보로만** 병기한다.

- **P1 (T02)** — curriculum.md 부1 "발견: 이벤트 스토밍"(교시 2–3)과 취지가 가장 가깝다. 다만 Pack의 P1은 Ubiquitous Language/Discovery 판단이고 curriculum.md 교시 2–3은 이벤트 흐름 발견에 초점이 있어 완전히 동일한 세션은 아니다.
- **P2 (T04)** — **현재 curriculum.md에 대응하는 교시가 없다.** `courses/ddd/design/course-context.md` §14 "Known Gap"이 이미 명시했듯, Entity/Value Object/Domain Invariant의 정본 이름과 정의는 canonical OWNER(concept-ownership.md §4)임에도 현재 8교시 구성에는 없다. 이 문서는 그 gap을 메우거나 curriculum.md에 세션을 추가하지 않는다 — Pack 원표기(T04)를 그대로 보존하고, 배치는 Stage 2(Curriculum Authoring)의 판단으로 남긴다.
- **P3 (T05)** — curriculum.md 부2 "애그리거트 경계 설계"(교시 4–6, 특히 교시 5 "애그리거트 경계 긋기")와 가장 밀접하게 대응한다. 과정의 무게 중심(curriculum.md "무게 배분" 참조)과 일치한다.
- **P4 (T07/T08)** — curriculum.md 부3 "컨텍스트 매핑"(교시 7)과 대응한다. Pack 제목의 "Model Evolution" 부분은 curriculum.md 부4 "종합"(교시 8, 회고)에서 다뤄질 수 있으나 별도 실습 교시로 명시되어 있지는 않다.

## Practice Index

| ID | Pack Placement | Practice | Timebox | Core Decision |
|---|---|---|---:|---|
| P1 | T02 | Domain Language from Messy Requirements | 20분 | 어떤 용어·개념을 공유 언어로 채택하고 무엇을 질문으로 남길 것인가 |
| P2 | T04 (Known Gap — 아래 Placement Note 참조) | Entity / Value Object / Invariant Decision | 25분 | 정체성·값·불변식 기준으로 모델 요소를 어떻게 구분할 것인가 |
| P3 | T05 | Aggregate Boundary under Consistency Pressure | 25분 | 어떤 규칙이 즉시 함께 지켜져야 하며 aggregate 경계를 어디에 둘 것인가 |
| P4 | T07/T08 | Bounded Context & Model Evolution | 20분 | 의미 충돌을 어떤 context 경계로 보호하고 통합 관계를 어떻게 둘 것인가 |

---

## P1. Domain Language from Messy Requirements

| Field | Content |
|---|---|
| **Practice ID / Title** | P1 — Domain Language from Messy Requirements |
| **Course Ownership** | DDD OWNER — Ubiquitous Language / Discovery (`course-context.md` §9 OWNER) |
| **Decision Practiced** | 어떤 용어·개념을 공유 언어로 채택하고 무엇을 질문으로 남길 것인가 |
| **Work Context** | 주문·결제·배송 업무에서 용어 충돌과 복잡한 규칙이 발생해 도메인 모델과 경계를 정리해야 하는 제품 개발 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 요구·회의 메모에서 핵심 용어와 의미 충돌을 찾고 working glossary와 질문을 만든다. |
| **Timebox** | 20분 |
| **Initial Instruction** | 요구·회의 메모에서 핵심 용어와 의미 충돌을 찾고 working glossary와 질문을 만든다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 동일 단어가 영업과 운영에서 다른 의미를 가진다는 조건을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle(DDD-02 Ubiquitous Language Is Executable Alignment)에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\n용어를 임의 통합하지 말고 의미 충돌·관계·미해결 질문을 구분해 제시하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P2. Entity / Value Object / Invariant Decision

| Field | Content |
|---|---|
| **Practice ID / Title** | P2 — Entity / Value Object / Invariant Decision |
| **Course Ownership** | DDD OWNER (canonical, `concept-ownership.md` §4) — Entity / Value Object / Domain Invariant. **주의:** 현재 `courses/ddd/curriculum.md`(8교시)에는 이 개념군의 정본 정의를 다루는 세션이 없다 — `course-context.md` §14 "Known Gap"이 이미 기록한 gap과 동일하다. 이 Practice는 canonical ownership을 그대로 보존해 Pack에서 옮기며, curriculum.md의 gap을 대신 메우지 않는다. |
| **Decision Practiced** | 정체성·값·불변식 기준으로 모델 요소를 어떻게 구분할 것인가 |
| **Work Context** | 주문·결제·배송 업무에서 용어 충돌과 복잡한 규칙이 발생해 도메인 모델과 경계를 정리해야 하는 제품 개발 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 후보 개념을 Entity/VO로 판단하고 domain invariant를 명시한다. |
| **Timebox** | 25분 |
| **Initial Instruction** | 후보 개념을 Entity/VO로 판단하고 domain invariant를 명시한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 주소 변경과 가격 스냅샷처럼 identity와 immutability 요구가 다른 사례를 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\n각 후보를 identity, lifecycle, equality, mutability, invariant 관점으로 비교하고 선택 근거를 제시하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P3. Aggregate Boundary under Consistency Pressure

| Field | Content |
|---|---|
| **Practice ID / Title** | P3 — Aggregate Boundary under Consistency Pressure |
| **Course Ownership** | DDD OWNER — Aggregate / Domain Invariant (`course-context.md` §9 OWNER; 과정의 무게 중심, curriculum.md "무게 배분" 참조) |
| **Decision Practiced** | 어떤 규칙이 즉시 함께 지켜져야 하며 aggregate 경계를 어디에 둘 것인가 |
| **Work Context** | 주문·결제·배송 업무에서 용어 충돌과 복잡한 규칙이 발생해 도메인 모델과 경계를 정리해야 하는 제품 개발 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 주문-결제-재고 후보 경계를 비교하고 aggregate와 consistency scope를 결정한다. |
| **Timebox** | 25분 |
| **Initial Instruction** | 주문-결제-재고 후보 경계를 비교하고 aggregate와 consistency scope를 결정한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 동시 주문 증가와 외부 결제 실패를 추가해 큰 aggregate 비용을 드러낸다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle(DDD-03 Invariants Define Consistency Boundaries)에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\n즉시 일관성이 필요한 invariant와 나중에 맞춰도 되는 규칙을 분리하고 최소 aggregate 경계를 제안하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

**Relation to lab-design.md:** 이 Practice는 `lab-design.md` 부2(애그리거트 경계 설계)의 대조쌍 D-1(경계 너무 큼 vs 맞음)·D-2(불변식이 경계를 정한다)를 실습 소재로 재사용할 수 있다. lab-design.md는 대조쌍을 보고 판단하는 모델 대면 활동을 소유하고, 이 Practice는 그 판단을 LLM과의 순환(Prompt → Output → Intervention → Keep Going)으로 확장한다. 어느 한쪽도 다른 쪽을 대체하지 않는다.

---

## P4. Bounded Context & Model Evolution

| Field | Content |
|---|---|
| **Practice ID / Title** | P4 — Bounded Context & Model Evolution |
| **Course Ownership** | DDD OWNER — Bounded Context / Context Mapping (`course-context.md` §9 OWNER). NON-SCOPE: Bounded Context = Microservice 결정은 이 Practice의 범위 밖이다(§9 NON-SCOPE, DDD-05). |
| **Decision Practiced** | 의미 충돌을 어떤 context 경계로 보호하고 통합 관계를 어떻게 둘 것인가 |
| **Work Context** | 주문·결제·배송 업무에서 용어 충돌과 복잡한 규칙이 발생해 도메인 모델과 경계를 정리해야 하는 제품 개발 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 판매·배송·정산의 모델 충돌을 분석해 BC 후보와 context relationship을 만든다. |
| **Timebox** | 20분 |
| **Initial Instruction** | 판매·배송·정산의 모델 충돌을 분석해 BC 후보와 context relationship을 만든다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 조직도와 현재 서비스 경계가 domain boundary와 다르다는 조건을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle(DDD-04 Boundary Protects Meaning, DDD-05 Domain Boundary ≠ Deployment Boundary)에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\n조직/서비스 구조를 복사하지 말고 언어·모델의 의미 일관성 기준으로 BC 후보와 관계를 비교하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

**Relation to lab-design.md:** 이 Practice는 `lab-design.md` 부3(컨텍스트 매핑)의 대조쌍(경계가 뭉개진 지도 vs 관계가 명시된 지도)을 실습 소재로 재사용할 수 있다. lab-design.md는 "매핑만, 서비스로 자르지 않는다(MSA 소유)"를 명시하며, 이 Practice의 NON-SCOPE 경계와 일치한다.

---

## Optional / Reference Candidates When Time Is Tight

Time-pressure Rule(practice-standard.md §11)에 따라, Core Narrative와 4개 Practice는 유지하고 다음 상세만 강의 중 생략 가능 계층으로 이동할 수 있다(삭제하지 않음):

- Event Storming notation의 세부 표기(정책/읽기모델 기호 등) 추가 예시
- Context Mapping 관계 유형(고객-공급자·순응자·ACL 등)의 전체 카탈로그 상세 설명
- Aggregate 크기·성능 trade-off의 추가 사례
- Ontology / Explicit Semantics BRIDGE 주제의 상세 사례(AI-Native forward)
- SW Architecture / MSA로 FORWARD되는 주제의 상세 사례

## DDD LLM Practice Quality Gate

Practice Pack v1.1의 Course Practice Quality Gate를 그대로 유지하고, practice-standard.md §13 Practice Quality Gate와 합성한다:

- 4개 Practice가 과정 전반(발견 → 경계 설계 → 컨텍스트 매핑)에 분산되어 있는가?
- 모든 Practice가 15–30분 범위(20–25분 중심)인가?
- Recommended Prompt를 마지막에만 공개하는가? 정답이 아님을 명시하는가?
- Intervention이 정답이 아니라 추가 관점/제약/evidence를 제공하는가?
- 기존 OWNER/RECAP/APPLY/FORWARD 경계를 유지하는가? (`course-context.md` §9)
- Bounded Context = Microservice 결정으로 넘어가지 않는가? (NON-SCOPE)
- 기존 instructional time(480분) 한도를 넘기지 않는가?
- 강의 상세는 삭제보다 Optional/Reference/Appendix로 보존하는가?
- Prompt 품질이 아니라 Ubiquitous Language/모델/불변식/경계 판단을 평가하는가?
- P2(T04)의 Known Gap이 curriculum.md를 조용히 수정하는 방식으로 해소되지 않았는가? (Placement Note 참조)
