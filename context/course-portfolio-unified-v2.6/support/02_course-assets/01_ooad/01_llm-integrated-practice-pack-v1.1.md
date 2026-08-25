# OOAD — LLM-Integrated Practice Pack v1.1

> **Asset Class:** Instructor-only Course Asset
> **Course:** `courses/01_ooad.md`
> **Standard:** `support/01_governance/12_llm-integrated-practice-standard.md`
> **Practice Count:** 7
> **Cadence:** Day 1 3개 / Day 2 4개
> **Practice Time:** 약 160분, 기존 instructional time에 포함
> **Authority:** 과정 Baseline과 공통 Governance에 종속; 충돌 시 상위 Canon 우선
> **Common Case:** Order Domain (기존 Canon 사례 유지)

## Operating Rules

- 실습 시작 시 Recommended Prompt를 제공하지 않는다.
- 학습자가 먼저 자신의 Prompt와 작업 접근을 설계한다.
- 시작 후 5–10분에 Instructor Intervention을 제공한다.
- 학습자는 새 과제로 재시작하지 않고 **Keep Going**하며 Prompt·산출물·판단을 개선한다.
- 종료 시 Recommended Prompt와 Prompt Design Intent를 공개한다.
- Recommended Prompt는 정답이 아니며, 자신의 Context에 맞게 유지·삭제·수정한다.
- 평가 대상은 Prompt 문장력이 아니라 **Course-owned decision, evidence, trade-off, failure condition**의 품질이다.

## P1. Black-box Requirement → Use Case / Scenario

- **Placement:** S02 Requirement → Use Case
- **Timebox:** 20분
- **Course Ownership:** OOAD RECAP/APPLY input; OOAD가 책임 설계로 넘어가기 위한 requirement view를 사용
- **Decision Practiced:** 무엇을 시스템 외부 행위로 두고, 무엇을 내부 설계로 미룰 것인가?
- **Work Context:** 주문 취소 기능 요구가 stakeholder 문장과 정책 메모 형태로 주어짐
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Inputs:** actor goal, 몇 개의 business rule, 정상/예외 요구 일부
- **Deliverable:** concise Use Case + 2–3 key scenarios + unresolved questions

### Initial Instruction
주어진 주문 취소 요구를 LLM과 분석해, 설계 세부사항을 넣지 않은 black-box Use Case와 핵심 scenario를 만든다. 필요한 Prompt는 직접 작성한다.

### Intervention
- 부분 출고된 주문이 존재한다.
- 고객 취소와 운영자 강제 취소는 권한/목표가 다르다.
- “DB 상태를 Cancelled로 변경” 같은 구현 표현이 들어갔는지 검토한다.

### Evidence of Learning
- 구현 세부를 제거했는가?
- actor goal과 extension이 분리되었는가?
- LLM이 누락한 질문을 학습자가 추가했는가?

### Recommended Prompt
```text
목표: 아래 요구를 구현 설계가 아닌 black-box Use Case와 핵심 scenario로 정리한다.

입력:
[요구사항/정책 붙여넣기]

해야 할 일:
1. primary actor와 goal을 식별한다.
2. success scenario와 중요한 extension을 구분한다.
3. DB, class, API 같은 내부 구현 가정은 넣지 않는다.
4. 모호하거나 충돌하는 규칙은 임의로 확정하지 말고 질문으로 남긴다.
5. 마지막에 설계 단계로 넘길 핵심 behavior 후보만 요약한다.

출력: Use Case, 핵심 scenario, unresolved questions, behavior candidates.
```

### Prompt Design Intent
Requirement를 LLM에 “정리”시키는 것이 아니라 black-box boundary와 불확실성 판단을 명시하게 한다.

### Trade-off
완전한 요구문서보다 빠른 설계 입력을 얻지만 미해결 질문이 남는다.
### Failure Condition
요구 자체가 아직 stakeholder goal 수준에서도 합의되지 않았는데 LLM이 임의로 정책을 완성하도록 둘 때.
### Transfer
신규 기능 분석, backlog refinement, legacy feature 재구성.

---
## P2. Concept before Class — Analysis Concept Model

- **Placement:** S05 Static Modeling Workshop
- **Timebox:** 25분
- **Course Ownership:** OOAD OWNER — Analysis Modeling
- **Decision Practiced:** 어떤 개념/관계가 문제 이해에 필요하고, 어떤 구현 요소는 아직 제외할 것인가?
- **Work Context:** P1에서 정리한 주문 취소 요구를 구현 클래스에 끌려가지 않고 분석 개념과 관계로 구조화해야 하는 상황
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Inputs:** P1 scenario + domain vocabulary
- **Deliverable:** Analysis Concept Model 설명 + 핵심 associations + 제외한 후보와 이유

### Initial Instruction
P1 결과를 입력으로 사용해 문제 이해에 필요한 Concept와 관계를 모델링한다. Class 설계가 아니라 Analysis Model이어야 한다.

### Intervention
- LLM이 `OrderService`, `Repository`, `Controller`, `DTO`를 넣었다면 제거 필요성을 판단한다.
- `CancellationReason`이 attribute인지 concept인지 두 선택을 비교한다.
- 모든 noun을 concept로 만들지 말고 판단 근거를 요구한다.

### Evidence of Learning
- Concept ≠ Class를 지켰는가?
- 구현 요소를 제거했는가?
- association/multiplicity를 필요한 곳에만 사용했는가?

### Recommended Prompt
```text
아래 scenario를 이해하기 위한 Analysis Concept Model을 제안하라.

[scenario]

제약:
- software class, service, controller, repository, DTO, database 개념을 넣지 않는다.
- 명사 추출 결과를 그대로 모델로 채택하지 않는다.
- 각 concept가 왜 문제 이해에 필요한지 한 줄 근거를 제시한다.
- 중요한 association과 필요한 경우 multiplicity를 제안한다.
- attribute로 둘지 concept로 둘지 애매한 항목은 양쪽 선택의 trade-off를 비교한다.
- 마지막에 과도하거나 불필요해 제외한 후보를 표시한다.
```

### Prompt Design Intent
LLM의 과잉 생성 성향을 이용해 “무엇을 모델에 넣지 않을 것인가” 판단을 연습한다.

### Trade-off
분석 의미가 선명해지지만 구현 구조는 아직 결정하지 않는다.
### Failure Condition
모델을 코드 skeleton으로 바로 변환해야 한다고 전제하는 경우.
### Transfer
신규 도메인 분석, 요구 분석 워크숍, legacy concept recovery.

---
## P3. Just Enough Dynamic Modeling

- **Placement:** S07 Dynamic Modeling Workshop
- **Timebox:** 25분
- **Course Ownership:** OOAD OWNER — Dynamic Modeling / Collaboration framing
- **Decision Practiced:** 어떤 동적 관점이 현재 질문에 필요한가?
- **Work Context:** 주문 취소의 상태 변화와 객체 협력 중 어떤 동적 불확실성을 어떤 모델 하나로 해소할지 선택해야 하는 상황
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Inputs:** P1 scenario + P2 concept model
- **Deliverable:** 선택된 dynamic model 1개 + 선택 이유 + 의도적으로 만들지 않은 diagram

### Initial Instruction
주문 취소 scenario에서 현재 가장 중요한 설계 질문을 정하고, 그 질문을 답하는 데 필요한 동적 모델 하나만 LLM과 만든다.

### Intervention
- 상태 전이 오류가 핵심이라면 sequence만으로 충분한지 재검토한다.
- workflow, interaction ordering, state lifecycle 중 무엇이 실제 불확실성인지 명시한다.
- “모든 diagram을 만들자”는 제안을 거절할 수 있어야 한다.

### Evidence of Learning
- notation이 아니라 question-driven 선택인가?
- 선택하지 않은 모델의 이유를 설명하는가?
- 필요한 interaction/state ambiguity가 줄었는가?

### Recommended Prompt
```text
아래 scenario와 concept model에서 아직 불명확한 동적 질문을 먼저 2~3개 제시하라.

[scenario]
[concept model]

그중 설계 위험이 가장 큰 질문 하나를 선택하고,
- SSD / Sequence / State Machine / Activity 중 가장 적합한 표현 하나만 추천하라.
- 선택 이유와 다른 표현을 지금 만들지 않아도 되는 이유를 설명하라.
- 선택된 모델을 최소 정보로 작성하라.
- 모델이 새로 드러낸 질문 또는 모순을 마지막에 적어라.
```

### Prompt Design Intent
Diagram production을 줄이고 Modeling Decision을 강화한다.

### Trade-off
문서 완전성은 낮지만 판단 속도와 집중도가 높아진다.
### Failure Condition
규제/계약상 특정 전체 모델 세트가 필수 deliverable인 상황.
### Transfer
design review, incident flow 분석, 복잡한 state/workflow 확인.

---
## P4. Hide the Change — Information Hiding / Cohesion / Coupling

- **Placement:** S08 Modularity / Information Hiding / Cohesion / Coupling
- **Timebox:** 20분
- **Course Ownership:** OOAD OWNER
- **Decision Practiced:** 어떤 변화 가능성을 어디에 숨겨 change impact를 국소화할 것인가?
- **Work Context:** 주문 취소 규칙과 외부 의존성의 변경 가능성이 커져 무엇을 숨기고 어떤 인터페이스를 안정화할지 결정해야 하는 상황
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Inputs:** 주문 취소 규칙 + 간단한 초기 object/module responsibility sketch
- **Deliverable:** volatility list + hiding decision + before/after responsibility allocation

### Initial Instruction
향후 바뀔 가능성이 있는 주문 취소 정책을 보고 어떤 지식을 어떤 object/module 안에 숨길지 LLM과 검토한다.

### Intervention
- 취소 가능 시간 정책이 자주 바뀐다.
- 외부 결제사업자 규칙도 바뀌지만 도메인 규칙과 같은 변경축은 아니다.
- coupling을 0으로 만드는 것이 목표가 아님을 반영한다.

### Evidence of Learning
- 변화 원인별로 책임을 구분했는가?
- getter/setter 추가를 encapsulation으로 착각하지 않는가?
- indirection 비용을 인정하는가?

### Recommended Prompt
```text
아래 설계에서 변경 가능성이 높은 지식과 그 변경 원인을 식별하라.

[초기 설계]
[변경 시나리오]

각 변경축마다:
1. 무엇을 숨겨야 하는가?
2. 어떤 object/module이 그 지식의 후보 owner인가?
3. 그 선택이 cohesion/coupling/change impact에 주는 효과는 무엇인가?
4. 추가 indirection 비용은 무엇인가?

마지막에 가장 단순한 개선안을 제시하되 coupling 0이나 무조건적인 abstraction을 목표로 삼지 마라.
```

### Prompt Design Intent
Information Hiding을 syntax가 아니라 change economics로 판단하게 한다.

### Trade-off
변경 국소화를 얻고 간접 계층/설계 비용을 지불한다.
### Failure Condition
실제 변동성이 거의 없는 단순 코드에 abstraction을 선제적으로 쌓을 때.
### Transfer
변경 영향 분석, module 설계, refactoring 후보 선정.

---
## P5. SOLID / DIP — Improve Only Where Pressure Exists

- **Placement:** S10 SOLID / Dependency Principles
- **Timebox:** 20분
- **Course Ownership:** OOAD OWNER; SW Architecture dependency rule은 FORWARD
- **Decision Practiced:** 어떤 원칙 위반이 실제 변화/대체 가능성에 문제를 만들며, 어디는 그대로 둘 것인가?
- **Work Context:** 변경 압력이 실제로 발생한 주문 취소 설계에서 SOLID/DIP를 어디에 적용하고 어디에는 적용하지 않을지 판단하는 상황
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Inputs:** 작은 object design/code sketch
- **Deliverable:** 문제 1–2개, 최소 개선안, 적용하지 않은 SOLID 원칙과 이유

### Initial Instruction
제공된 설계를 SOLID checklist로 전부 고치지 말고, 실제 변경 압력이 있는 부분만 찾아 개선한다.

### Intervention
- 결제 방식은 추가될 가능성이 높다.
- 할인 계산은 현재 한 종류이며 변경 evidence가 없다.
- DI framework 사용 여부와 DIP 준수 여부를 분리해 판단한다.

### Evidence of Learning
- “모든 SOLID 적용”을 거절했는가?
- stable policy와 volatile detail 관계를 설명하는가?
- 불필요한 interface를 만들지 않았는가?

### Recommended Prompt
```text
아래 설계를 SOLID 위반 탐지 게임처럼 평가하지 마라.

[설계/코드]
[예상 변경]

1. 실제 변경 압력 또는 대체 가능성이 있는 지점을 먼저 찾는다.
2. SRP/OCP/LSP/ISP/DIP 중 문제를 설명하는 데 필요한 원칙만 사용한다.
3. 최소 변경으로 responsibility/dependency를 개선하는 대안을 제시한다.
4. 새 abstraction/interface가 만드는 비용을 적는다.
5. 적용하지 않은 원칙 또는 그대로 둔 부분과 이유를 명시한다.
6. DI framework 사용과 DIP 준수를 구분한다.
```

### Prompt Design Intent
원칙 catalog 암기 대신 evidence-based design change를 연습한다.

### Trade-off
과잉 설계를 줄이지만 미래 변화 일부는 다시 수정해야 할 수 있다.
### Failure Condition
이미 알려진 강한 변동성을 “YAGNI”로 무시할 때.
### Transfer
code review, design review, refactoring prioritization.

---
## P6. Responsibility → Owner → Contract → Pattern

- **Placement:** S11 Responsibility-Driven Design / GRASP / DbC / Patterns, S12 workshop의 입력으로 연결
- **Timebox:** 25분
- **Course Ownership:** OOAD OWNER
- **Decision Practiced:** 핵심 behavior의 owner를 고르고 contract와 collaboration을 설계하며 pattern은 필요할 때만 선택
- **Work Context:** 주문 취소 핵심 behavior를 어떤 객체가 책임지고 어떤 계약과 협력으로 수행할지 결정해야 하는 설계 상황
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Inputs:** Order cancellation behavior + candidate objects
- **Deliverable:** responsibility allocation, GRASP rationale, one object contract, collaboration, optional pattern decision

### Initial Instruction
“주문을 취소한다” behavior를 중심으로 class 목록이 아니라 responsibility부터 시작해 owner, collaboration, contract를 설계한다.

### Intervention
- Information Expert 후보와 낮은 coupling 후보가 다를 수 있다.
- 이미 완료된 주문은 취소할 수 없다.
- 취소 정책이 교체될 가능성이 있을 때만 Strategy 같은 pattern을 검토한다.
- Pattern을 쓰지 않는 것도 유효한 결정이다.

### Evidence of Learning
- Responsibility before Class인가?
- owner 선택에 trade-off가 있는가?
- pre/post/invariant가 test case와 혼동되지 않는가?
- pattern 이름이 problem/forces 뒤에 나오는가?

### Recommended Prompt
```text
아래 behavior를 Responsibility-Driven Design 관점에서 설계한다.

Behavior: [주문 취소]
Context: [scenario / concept / constraints]

순서:
1. 필요한 Doing/Knowing responsibility를 식별한다.
2. 각 responsibility의 candidate owner를 2개 이내로 비교한다.
3. Information Expert, High Cohesion, Low Coupling 등 필요한 GRASP 근거로 owner를 선택한다.
4. 핵심 operation 하나에 대해 Precondition / Postcondition / Object Invariant를 작성한다.
5. 필요한 message/collaboration을 최소로 설계한다.
6. 반복되는 변화 문제가 있을 때만 design pattern을 후보로 제시하고, pattern을 쓰지 않는 선택과 trade-off도 비교한다.

출력은 최종 class catalog가 아니라 결정과 근거 중심으로 작성한다.
```

### Prompt Design Intent
OOAD의 핵심 Backbone 전체를 한 decision chain으로 연결한다.

### Trade-off
설계 판단이 명시되지만 빠른 CRUD 구현보다 초기 사고 비용이 크다.
### Failure Condition
behavior/rule이 거의 없는 단순 data transformation에 rich object collaboration을 강제할 때.
### Transfer
domain object 설계, code review, API contract discussion.

---
## P7. Test Evidence → Design Feedback → Refactoring Decision

- **Placement:** S13 TDD / Refactoring as Design Feedback
- **Timebox:** 25분
- **Course Ownership:** OOAD APPLY — test는 evidence, test engineering 자체는 비소유
- **Decision Practiced:** 실패한/불편한 test evidence가 어떤 design smell을 의미하는지 판단하고 최소 refactoring을 선택
- **Work Context:** 테스트 실패와 변경 요구가 드러낸 설계 문제를 refactoring으로 연결하되 관찰 가능한 동작은 보존해야 하는 상황
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Inputs:** P6 design + 몇 개의 test/evidence symptoms
- **Deliverable:** evidence interpretation + refactoring decision + unchanged behavior/contract statement

### Initial Instruction
테스트가 어렵거나 실패하는 증상을 보고 LLM과 설계 문제 가능성을 분석한 뒤, observable behavior를 유지하는 최소 refactoring을 선택한다.

### Intervention
- mock이 과도하게 필요하다.
- 한 규칙 변경이 여러 test와 object를 함께 깨뜨린다.
- test 실패가 항상 design defect는 아니며 test 자체가 잘못된 경우도 있다.

### Evidence of Learning
- test = contract라고 단정하지 않는가?
- 증상→가능 원인→추가 evidence→refactoring 순서인가?
- behavior 보존 조건이 명시되었는가?

### Recommended Prompt
```text
아래 test/evidence 증상을 바로 refactoring 처방으로 연결하지 말고 진단하라.

[design]
[test/evidence symptoms]

1. 각 증상이 나타날 수 있는 가능한 원인을 나열한다: design issue / test issue / requirement ambiguity.
2. 원인을 구분하기 위해 추가로 확인할 evidence를 제시한다.
3. OO responsibility, cohesion/coupling, information hiding, contract 관점에서 가장 가능성 높은 design pressure를 설명한다.
4. observable behavior와 contract를 유지하는 최소 refactoring을 제안한다.
5. refactoring 후 어떤 evidence로 개선 여부를 확인할지 정의한다.
```

### Prompt Design Intent
LLM의 빠른 처방을 그대로 채택하지 않고 evidence-driven feedback loop를 만든다.

### Trade-off
진단 비용이 늘지만 잘못된 refactoring 위험을 줄인다.
### Failure Condition
production defect를 즉시 복구해야 하는 긴급 상황에서 장시간 구조 개선을 먼저 수행할 때.
### Transfer
TDD feedback, code review, legacy refactoring, defect recurrence analysis.

---

## Integration with Existing S12 Core Workshop

S12의 100분 Order Responsibility & Contract Workshop은 유지한다. P6는 S12를 대체하지 않고 **입력 설계 가설을 만드는 LLM-integrated practice**다.

S12에서는 다음을 사람 중심으로 통합 검토한다.
- 책임 배치의 일관성
- collaboration의 불필요한 복잡성
- contract 충돌
- GRASP rationale
- pattern 과잉 적용 여부
- P1~P6 산출물 간 trace

LLM 사용은 허용하지만 workshop의 핵심은 최종 설계 판단과 동료/강사 critique다.

## Optional / Reference Candidates When Time Is Tight

Core Narrative를 유지하면서 다음 상세를 강의 중 생략 가능 계층으로 이동할 수 있다.
- UML notation의 희귀 표기 상세
- GRASP 전체 pattern catalog의 부가 예시
- SOLID 각 원칙의 추가 코드 예제
- GoF pattern 다수 비교 예제
- TDD 역사/도구별 상세
- Architecture/DDD/MSA forward topic의 상세 사례

삭제하지 않고 교재의 `Optional / Reference / Appendix`로 유지한다.

## OOAD LLM Practice Quality Gate

- 7개 Practice가 Analysis → Design → Feedback 전반에 분산되어 있는가?
- Day 1 3개 / Day 2 4개인가?
- 각 Practice가 20–25분 중심이며 15–30분 범위인가?
- Prompt 없이 시작하는가?
- Intervention이 OOAD 판단을 강화하는가?
- Recommended Prompt가 마지막에만 공개되는가?
- Recommended Prompt가 정답이 아님을 명시하는가?
- Analysis Model과 Design Model 경계가 유지되는가?
- DDD/SWA/MSA/AI-Native OWNER를 침범하지 않는가?
- Prompt 품질이 아니라 responsibility/model/contract/design decision을 평가하는가?