# 객체지향 분석과 설계 실무 — Curriculum

## 과정 계약

- **총 instructional time:** 800분(16h, 휴식 제외)
- **Guardrail:** `courses/ooad/course-design.md`
- **목적:** 업무 요구와 변경 압력을 객체의 책임·협력·계약으로 변환하고, 설계 결정을 코드로 이어갈 수 있게 한다.
- **주 사례:** `portfolio/shared-cases/order-domain.md`의 Order. 같은 상태와 규칙을 요구에서 코드 feedback까지 발전시킨다.
- **경계:** 도메인 의미·Aggregate·Bounded Context는 DDD, 구조적 품질 선택과 architecture evaluation은 SW Architecture, 서비스 분할과 분산 실패는 MSA로 넘긴다.

## Capability와 필수 Outcome

| Capability | 과정에서 확인할 Outcome |
|---|---|
| 분석 문제와 구현 결정 구분 | black-box 요구, 분석 모델, 설계 모델과 코드가 답하는 질문을 구분한다. |
| 객체 경계 발견 | 변경되는 상태와 규칙을 보고 무엇을 감추고 어떤 메시지를 드러낼지 결정한다. |
| 책임·협력·계약으로 변경 국소화 | 책임 owner, 협력, precondition·postcondition·invariant를 일관된 설계로 만든다. |
| evidence로 설계 검토·개선 | 모델, test failure와 변경 요청을 근거로 최소 책임 이동과 refactoring을 결정한다. |

## Learning Progression

1. 절차적 Order에서 규칙 분산과 변경 파급을 관찰한다.
2. 사용자 목표와 black-box scenario에서 설계 질문을 추출한다.
3. 질문에 필요한 정적·동적 모델만 선택한다.
4. 변경될 결정과 상태를 감출 객체 경계를 찾는다.
5. 책임·협력·계약을 배치하고 원칙과 pattern을 판단 도구로 사용한다.
6. 같은 Order를 통합 설계하고 다른 변경 사례로 일관성을 검토한다.
7. test와 코드 feedback으로 책임 배치와 구조를 개선한다.
8. OOAD가 만든 결과와 남은 질문을 후속 owner에 넘긴다.

## Topic / Decision Weight

| 학습 영역 | 핵심 판단 | 시간 |
|---|---|---:|
| 문제영역과 큰 그림 | 왜 객체 경계와 책임이 필요한가 | 65분 |
| 요구와 설계 질문 | 어떤 사용자 목표와 행위를 지원하는가 | 90분 |
| Just-enough 모델 | 어떤 모델이 필요하고 무엇을 만들지 않을 것인가 | 125분 |
| 객체 경계 | 무엇을 감추고 어떤 메시지를 드러낼 것인가 | 100분 |
| 책임·협력·계약 | 누가 알고, 누가 하고, 무엇을 보장하는가 | 140분 |
| 통합 설계 | 판단을 하나의 일관된 Order 설계로 결합할 수 있는가 | 150분 |
| 설계 feedback | 새 evidence에서 어떤 최소 변경이 필요한가 | 80분 |
| 종합과 handoff | OOAD와 다음 owner의 질문은 무엇인가 | 50분 |
| **합계** |  | **800분** |

## 실습 Progression

| 실습 | 입력 | 학습자 판단과 산출물 | Feedback / 실패 기준 |
|---|---|---|---|
| Just-enough 모델 선택 | Order 취소 요구와 변경 질문 | 필요한 모델, 모델별 질문, 제외한 모델과 이유 | 모든 UML을 만들거나 표기 완성도가 목적이면 실패 |
| Order 책임 재배치 | 취소 판단이 service와 호출부에 흩어진 구조 | 책임표·협력 sketch·cancel 계약·change-impact 설명 | 클래스만 늘거나 규칙 owner가 여러 곳에 남으면 실패 |
| 설계 feedback | 새 상태 규칙, test failure와 변경 요청 | before/after 책임·최소 refactoring·근거와 비용 | 원칙이나 pattern 이름만으로 변경을 정당화하면 실패 |

---

## S01. OOAD 개요 — 65분

**Outcome:** OOAD의 문제영역, 핵심 정의, 필요성, 범위와 경계를 설명하고 Order에서 과정이 해결할 질문을 식별한다.

- **실습:** 정식 실습 없음. 절차적 Order에서 취소 규칙 변경의 영향 위치를 짧게 표시한다.
- **Anchors:** `course-design.md`의 Object-Oriented Programming, Object-Oriented Analysis, Object-Oriented Design, Design Principles over UML
- **References:** Applying UML and Patterns
- **Common Standards:** `portfolio/principles.md`의 `P-DT-01`, `P-ECO-01`, `P-RISK-01`; `portfolio/shared-cases/order-domain.md`

### 핵심 Claim과 흐름

1. 절차적 Order에서는 shared state와 create·pay·ship·cancel 함수가 분리되고 취소 판단이 여러 service와 호출부에 흩어질수록 변경 영향이 넓어진다.
2. 객체 경계는 상태와 규칙을 지역적으로 보호하고 메시지로 협력하게 해 변경 영향을 책임 owner 주변으로 국소화한다.
3. OOA는 문제영역의 개념과 관계를 이해하는 판단이고, OOD는 객체 분해와 책임·협력을 결정하는 판단이다. 분석 모델을 코드 골격으로 바로 바꾸지 않는다.
4. OOAD는 UML 표기나 클래스 목록이 아니라 변화하는 행위를 책임 있는 객체와 협력으로 조직하는 판단 과정이다.
5. 과정은 요구와 scenario에서 출발해 필요한 모델을 선택하고 객체 경계·책임·협력·계약을 설계한 뒤 코드 evidence로 개선한다.
6. DDD의 도메인 의미 경계, SW Architecture의 구조적 trade-off, MSA의 서비스 분할은 이 과정에서 완결하지 않는다.

**다음 전환:** 객체 후보를 찾기 전에 사용자가 달성하려는 목표와 관찰 가능한 행위를 명확히 한다.

## S02. 요구에서 설계 질문으로 — 90분

**Outcome:** Order 취소 요구를 black-box Use Case로 표현하고 구현 결정을 섞지 않은 설계 질문을 도출한다.

- **실습:** Order 취소 Use Case 작성과 scenario variation 검토
- **Anchors:** Use Case
- **References:** Applying UML and Patterns
- **Common Standards:** `portfolio/principles.md`의 `P-DT-01`, `P-EMP-01`; `portfolio/shared-cases/order-domain.md`

### 핵심 Claim과 흐름

1. Use Case는 내부 구조가 아니라 actor에게 가치 있는 관찰 가능한 결과와 이를 만드는 행위 흐름을 기술한다.
2. main success scenario와 실패·대안 흐름은 취소 가능·불가 상태와 기대 결과를 드러내지만 책임 class나 method는 결정하지 않는다.
3. 사용자 업무 언어를 일관되게 사용하면 이후 모델과 코드가 같은 문제를 가리키는지 추적할 수 있다. 이를 DDD의 Ubiquitous Language 교육으로 확장하지 않는다.
4. 상세화의 기준은 현재 설계 위험이다. 책임과 경계 판단에 영향을 주지 않는 UI·framework·저장 세부는 제외한다.

### 실습 운영

- **준비:** Order 상태·취소 규칙과 구현 세부가 섞인 요구 문장
- **수행:** actor와 goal → black-box main flow → 취소 불가 variation → 미결정 설계 질문
- **산출물:** Use Case, 핵심 variation, “아직 결정하지 않은 것” 목록
- **Feedback:** actor 관점, 관찰 가능한 결과, class·DB·API 결정의 조기 혼입을 검토한다.

**다음 전환:** Use Case가 드러낸 질문마다 어떤 모델이 실제로 필요한지 선택한다.

## S03. 질문에 맞는 Just-enough 모델 — 125분

**Outcome:** 정적·동적 모델이 답하는 질문을 구분하고 Order 변경 판단에 필요한 최소 모델을 선택한다.

- **실습:** Just-enough 모델 선택
- **Anchors:** Object-Oriented Analysis, Object-Oriented Design, Aggregation
- **References:** Applying UML and Patterns
- **Common Standards:** `portfolio/principles.md`의 `P-ECO-01`, `P-RISK-01`; `portfolio/shared-cases/order-domain.md`

### 핵심 Claim과 흐름

1. 정적 모델은 어떤 개념과 관계가 존재하는지 답하고, 동적 모델은 사건·상태 변화·협력 순서를 답한다.
2. 개념 모델은 문제영역을 제한하며 operation, visibility, framework type 같은 구현 결정을 소유하지 않는다.
3. 상태 모델은 Order의 허용 전이를, sequence 또는 collaboration sketch는 한 scenario의 상호작용을 드러낸다.
4. 표기는 의미를 보조할 뿐 대신하지 않는다. aggregation, association과 diagram 종류만으로 설계가 정당화되지 않는다.
5. 모델 선택은 “무엇을 모두 그릴까”가 아니라 “현재 불확실성을 줄일 evidence가 무엇인가”의 판단이다.
6. 분석 모델에서 설계 모델로 이동할 때 책임·메시지·계약 판단이 추가되며 기계적인 1:1 변환은 없다.

### 실습 운영

- **준비:** S02 Use Case와 Order 변경 질문 세 가지
- **수행:** 질문별 후보 모델 비교 → 필요한 모델 선택 → 최소 범위 작성 → 제외 이유 기록
- **산출물:** 필요한 개념·상태·협력 모델의 조합과 decision note
- **Feedback:** 모델이 질문에 답하는지, 불필요한 UML과 분석·설계 혼합이 없는지 검토한다.

**다음 전환:** 모델이 드러낸 변경 규칙을 어디에 감추고 어떤 메시지를 노출할지 결정한다.

## S04. 객체 경계와 변경 국소화 — 100분

**Outcome:** 변경될 상태·규칙·결정을 찾아 객체 경계 안에 감추고 안정된 협력 면을 정의한다.

- **실습:** 절차적 Order와 객체 경계 후보 비교
- **Anchors:** Object-Oriented Programming, Information Hiding, Interface / Composition
- **References:** Applying UML and Patterns, Design Patterns
- **Common Standards:** `portfolio/principles.md`의 `P-ECO-01`, `P-RISK-01`; `portfolio/shared-cases/order-domain.md`

### 핵심 Claim과 흐름

1. Encapsulation은 field를 private으로 만드는 문법이 아니라 함께 변하는 상태와 규칙을 하나의 경계가 보호하게 하는 설계다.
2. Information Hiding은 변경 가능성이 높거나 이해하기 어려운 결정을 다른 부분에서 감추도록 경계를 정한다.
3. 객체는 상태를 외부가 꺼내 판단하게 하기보다 의미 있는 메시지로 행위를 요청받고 자신의 규칙을 지킨다.
4. Cohesion은 함께 변하는 책임을 모으는 정도이고 coupling은 변경이 다른 경계로 번지는 정도다. 둘은 책임 이동의 결과로 평가한다.
5. Interface와 composition은 변화 압력이 있을 때 협력 상대와 변형을 격리하는 선택지다. 추상화 수가 목표가 아니다.
6. Order 경계 후보는 취소 판단 정보, 상태 전이 책임과 변경 이유를 함께 보고 비교한다.

**다음 전환:** 경계를 정한 뒤 각 책임을 누가 맡고 어떤 계약으로 협력할지 결정한다.

## S05. 책임·협력·계약 설계 — 140분

**Outcome:** Order의 책임을 배치하고 협력을 구성하며 핵심 행위의 기대와 보장을 검증 가능한 계약으로 표현한다.

- **실습:** Order 책임 재배치의 안내된 첫 반복
- **Anchors:** Responsibility-Driven Design, GRASP, Design by Contract, Dependency orientation, Interface / Composition
- **References:** Applying UML and Patterns, SOLID Principles, Design Patterns
- **Common Standards:** `portfolio/principles.md`의 `P-ECO-01`, `P-RISK-01`; `portfolio/shared-cases/order-domain.md`

### 핵심 Claim과 흐름

1. RDD의 출발 질문은 “어떤 class가 필요한가”가 아니라 “이 책임을 누가 져야 하는가”다.
2. 책임은 알아야 하는 것과 해야 하는 것으로 구분할 수 있고, 협력은 메시지로 책임 수행을 요청하는 구조다.
3. GRASP는 정답표가 아니라 information, cohesion, coupling과 variation을 함께 보며 책임 후보를 비교하는 판단 렌즈다.
4. SOLID는 다섯 이름의 checklist가 아니라 책임 배치가 변화에 견디는지 검토하는 principle family다.
5. Pattern은 문제·forces·gain·cost를 공유하는 반복 해법이며 이름이 익숙하다는 이유로 도입하지 않는다.
6. 계약은 호출자의 precondition, 제공자의 postcondition과 안정된 상태에서 유지할 object invariant를 명시한다.
7. Object invariant는 객체 상태의 계약이다. Aggregate와 domain consistency boundary는 DDD가 소유한다.
8. 좋은 책임 이동은 규칙 owner와 외부 지식을 줄이며, abstraction 비용보다 change-impact 감소가 커야 한다.

### 안내 실습

- 절차적 `cancel`에서 판단 정보와 규칙 위치를 표시한다.
- 책임 후보를 비교하고 information·cohesion·coupling 근거를 기록한다.
- 선택한 owner와 협력 메시지를 sketch한다.
- `cancel`의 precondition·postcondition·object invariant를 작성한다.
- 책임 이동 전후의 change impact로 선택을 설명한다.

**다음 전환:** 다른 상태 변화와 변경 요청에서도 같은 책임 구조가 유지되는지 통합 검증한다.

## S06. Order 책임·계약 통합 Workshop — 150분

**Outcome:** 분산된 Order 규칙을 일관된 책임·협력·계약으로 재설계하고 대안과 비용을 evidence로 설명한다.

- **실습:** Order 책임 재배치 통합 Workshop
- **Anchors:** Responsibility-Driven Design, GRASP, Design by Contract, Dependency orientation
- **References:** Applying UML and Patterns, SOLID Principles, Design Patterns
- **Common Standards:** `portfolio/principles.md`의 `P-ECO-01`, `P-RISK-01`, `P-EVID-01`; `portfolio/shared-cases/order-domain.md`

### Scenario

절차적 baseline은 shared Order data와 create·pay·ship·cancel service 함수를 가진다. 취소 가능 여부와 상태 전이 판단은 여러 함수와 호출부에 중복돼 있다. shared case의 규칙을 바꾸지 않고 책임 위치를 재설계한다.

### 수행과 산출물

1. 중복 규칙, 외부 상태 판단과 변경 파급 경로를 표시한다.
2. 책임 owner와 협력 구조를 최소 두 가지로 비교한다.
3. information, cohesion, coupling, abstraction cost와 reversibility로 대안을 선택한다.
4. pay·ship·cancel 중 핵심 행위의 precondition·postcondition과 Order object invariant를 작성한다.
5. CREATED·PAID·SHIPPED·CANCELLED 사례로 설계를 검증한다.
6. 책임 이동 전후 change-impact와 남은 trade-off를 기록한다.

### Feedback 기준

- 상태와 규칙의 owner가 명확한가
- 호출부가 Order 내부 상태를 꺼내 같은 판단을 반복하지 않는가
- 협력 메시지가 업무 의도를 표현하는가
- 계약이 shared rule과 일치하고 사례로 검증 가능한가
- 추가한 interface·composition·pattern이 실제 variation을 격리하는가
- DDD Aggregate나 architecture layer를 정답으로 빌려오지 않았는가

**다음 전환:** 새 변경과 실패 evidence에서 무엇을 유지하고 무엇을 옮길지 판단한다.

## S07. 코드 Evidence와 설계 Feedback — 80분

**Outcome:** test failure와 변경 요청을 evidence로 해석해 동작을 보존하면서 최소 책임 이동과 refactoring을 결정한다.

- **실습:** 설계 feedback
- **Anchors:** Refactoring, Dependency orientation, Interface / Composition
- **References:** SOLID Principles, Design Patterns
- **Common Standards:** `portfolio/principles.md`의 `P-FLOW-01`, `P-ECO-01`, `P-EVID-01`; `portfolio/shared-cases/order-domain.md`

### 핵심 Claim과 흐름

1. Test는 계약 자체가 아니라 구현이 기대 행위와 계약을 충족하는지 보여주는 evidence다.
2. Refactoring은 관찰 가능한 행위를 유지하면서 내부 구조를 더 이해하고 변경하기 쉽게 만든다.
3. 새 변경 요청은 기존 책임 owner와 variation 가정이 여전히 유효한지 검토하게 한다.
4. SOLID·GRASP·pattern은 변경 방향의 보조 렌즈이고 test와 change-impact가 선택의 evidence다.
5. 현재 위험에 충분한 최소 책임 이동과 검증 범위를 선택한다.

### 실습 운영

- **입력:** S06 설계, 새 상태 규칙 또는 취소 정책 변경, 실패 test
- **수행:** 실패 원인과 owner 연결 → 대안 비교 → 최소 refactoring → 계약과 test 갱신
- **산출물:** before/after 책임과 협력, 변경한 계약, 보존된 행위, 선택 근거
- **Feedback:** shared rule을 구현에 맞춰 바꾸지 않았는지, 이름이 아니라 evidence로 변경을 정당화했는지 검토한다.

**다음 전환:** 요구에서 feedback까지의 판단을 회수하고 OOAD 밖에 남은 질문을 넘긴다.

## S08. OOAD 종합과 Handoff — 50분

**Outcome:** Order의 진화를 통해 OOAD capability를 종합하고 DDD·SW Architecture·MSA가 소유할 후속 질문을 구분한다.

- **실습:** 개인 decision review와 동료 설명
- **Anchors:** OO Design → DDD
- **References:** Applying UML and Patterns
- **Common Standards:** `portfolio/concept-ownership.md`; `portfolio/shared-cases/order-domain.md`

### 핵심 Claim과 흐름

1. 과정의 결과는 diagram이나 pattern 목록이 아니라 요구에서 책임 owner, 협력, 계약과 개선 근거를 설명하는 능력이다.
2. Order는 절차적 규칙 분산에서 black-box scenario, 필요한 모델, 객체 경계, 책임·협력·계약과 code feedback으로 발전했다.
3. domain consistency boundary는 DDD가 다룬다. OOAD의 object boundary를 Bounded Context나 Aggregate로 부르지 않는다.
4. quality attribute를 위한 구조 선택과 평가는 SW Architecture가 다룬다. OOAD가 architecture style을 결정하지 않는다.
5. 독립 배포 가치, 분산 비용과 서비스·데이터 소유는 MSA가 다룬다. 객체 경계를 서비스 경계로 자동 확대하지 않는다.

### 종합 확인

학습자는 최종 Order 설계를 사용해 다음을 설명한다.

- 분석 문제와 구현 결정의 차이
- 선택한 모델과 제외한 모델의 이유
- 상태와 규칙의 책임 owner
- 핵심 협력과 계약
- change-impact를 줄였다는 evidence와 지불한 비용
- OOAD로 답하지 않고 후속 owner에 넘길 질문

---

## 시간 검증

| Session | 시간 |
|---|---:|
| S01 | 65분 |
| S02 | 90분 |
| S03 | 125분 |
| S04 | 100분 |
| S05 | 140분 |
| S06 | 150분 |
| S07 | 80분 |
| S08 | 50분 |
| **합계** | **800분** |
