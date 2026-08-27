# S06. 책임 설계 ① — RDD로 책임과 협력 보완

- **시간:** 85분
- **상태:** 검토용 초안 v0.2
- **핵심 질문:**  
  **S05에서 자신의 경험으로 만든 Initial Design을 Responsibility-Driven Design 관점에서 어떻게 설명·검증·재배치하고, 객체 간 Message와 Collaboration으로 정제할 것인가?**

---

## 1. Session Position

S05의 결과는 정답 모델이 아니다.

```text
S03 Static Analysis
        +
S04 Dynamic Analysis
        ↓
S05
Experience-based Initial Design
        ↓
S06
RDD-based Responsibility & Collaboration Refinement
        ↓
S07
Contract & Variation Refinement
```

S05: **“내 경험으로 이 책임을 여기에 배치했다.”**  
S06: **“RDD 관점에서 왜 이 객체가 이 책임을 가져야 하는지 설명할 수 있는가? 다른 배치가 더 나은가?”**

---

## 2. 조직의 R&R 비유

Responsibility를 처음 설명할 때 조직의 직원 R&R을 비유로 사용한다.

```text
조직
직원
→ Role
→ Responsibility
→ 필요한 Knowledge / Authority
→ Collaboration
```

객체 설계도 비슷한 판단을 한다.

```text
Software System
Object
→ Role
→ Responsibility
→ State / Knowledge
→ Message / Collaboration
```

> **직원=Object, 부서=Class로 1:1 모델링하자는 뜻이 아니다. 조직에서 R&R을 배치할 때 사용하는 판단 방식이 Responsibility Assignment를 이해하는 데 유사하다는 비유다.**

### Role이란 무엇인가

Role은 객체가 특정 Collaboration에서 수행하는 역할이며, 관련 Responsibility의 묶음으로 이해할 수 있다. 한 직원이 상황에 따라 "결재자" 역할과 "검토자" 역할을 각각 수행하듯, 하나의 객체도 Collaboration 맥락에 따라 여러 Role을 수행할 수 있다.

---

## 3. Responsibility-Driven Design

객체 설계를 Class/Attribute/Method 목록부터 시작하지 않는다.

```text
Responsibility
        ↓
Role / Object
        ↓
Collaboration
```

핵심 질문:

- 이 객체는 무엇을 알아야 하는가?
- 이 객체는 무엇을 해야 하는가?
- 누구와 협력해야 하는가?

---

## 4. Responsibility ≠ Method

Responsibility는 객체가 맡아야 하는 의미 있는 의무이고, Method는 그 책임을 구현하는 하나의 구체 표현이다.

S06에서는 Responsibility와 Message/Collaboration을 설계하되 구현 signature로 너무 빨리 내려가지 않는다.

---

## 5. Knowing / Doing Responsibility

### Knowing

- 자신의 상태
- 관련 객체/구성요소
- 책임 수행에 필요한 Domain knowledge

### Doing

- 계산/판단
- 상태 변화
- 다른 객체에 작업 요청
- 협력 조정

Knowing과 Doing은 암기 항목이 아니라 Responsibility owner를 검토하는 질문이다.

---

## 6. Message와 Collaboration

Message는 다른 객체에게 Responsibility 수행을 요청하는 의미 있는 통신이다.

Collaboration은 각 객체가 자신의 Responsibility를 수행하기 위해 다른 객체의 Responsibility를 사용하는 협력 구조다.

Message를 method syntax로 곧바로 고정하지 않는다.

---

## 7. CRC 관점

CRC는 Class, Responsibility, Collaborator를 함께 본다.

S06에서는 CRC Card 자체를 별도 산출물로 만들지 않는다. Class Diagram과 Sequence Diagram을 보완하기 위한 사고 관점으로 사용한다.

---

## 8. GRASP 기본 — 실습에 사용할 판단 언어

### Information Expert

> Responsibility 수행에 필요한 의미 있는 정보를 가장 자연스럽게 가진 객체는 누구인가?

DB나 Repository에 데이터가 있다는 뜻이 아니다.

### Creator

> 어떤 객체가 다른 객체의 생성과 lifecycle을 자연스럽게 책임질 수 있는가?

포함/소유, 긴밀한 사용, 초기화 정보, lifecycle 관계를 clue로 본다.

### Controller

> System Event를 받고 Use Case/System Operation의 흐름을 시작·조정할 책임은 누구에게 둘 것인가?

Framework `Controller` Class와 동일시하지 않는다. Controller가 Domain Rule owner가 되는 것도 아니다.

### High Cohesion

> 한 객체의 Responsibility들이 같은 목적과 변경 이유를 중심으로 얼마나 잘 모여 있는가?

### Low Coupling

> 필요한 Collaboration을 유지하면서 불필요한 knowledge/dependency를 얼마나 줄이는가?

---

## 9. Pattern은 Checklist가 아니다

```text
Information Expert ✓
Creator ✓
Controller ✓
High Cohesion ✓
Low Coupling ✓
```

처럼 적용 여부를 채우는 것이 목표가 아니다. 책임 하나에 여러 관점이 충돌할 수 있으므로 Pattern은 **대안을 비교하는 판단 언어**로 사용한다.

---

## 10. S05 Initial Design 회수

수강생은 자신의 S05 Initial Design Class Diagram을 다시 연다.

먼저 다음을 표시한다.

- Data-only Class
- Behavior가 집중된 Service/Manager
- owner 근거가 약한 Responsibility
- 여러 객체 내부 state를 알아야 하는 Responsibility
- Sequence와 Class 책임이 맞지 않는 부분

이 단계는 새 모델을 만드는 것이 아니라 Before 모델의 문제를 관찰하는 단계다.

---

## 11. Class Diagram과 Sequence Diagram의 왕복

```text
Design Class Diagram
        ↓ responsibility/message
Design Sequence Diagram
        ↓ 발견된 collaboration 문제
Design Class Diagram 수정
        ↓
다시 Sequence로 검증
```

Class Diagram은 Responsibility의 정적 배치를 보여주고, Sequence Diagram은 그 Responsibility가 실제 Interaction에서 어떻게 협력하는지 검증한다.

---

## 12. Responsibility–Owner Table의 위치

Responsibility–Owner Table은 설명·사고 도구로 사용할 수 있다.

| Responsibility | Candidate Owner | 판단 관점 |
|---|---|---|
| Order total 계산 | Order / OrderItem | Expert, Cohesion |
| Order 생성 | ? | Creator |
| Place Order 요청 수신 | ? | Controller |
| Payment 처리 요청 | ? | Collaboration |

그러나 **실습 필수 산출물은 아니다.** 최종 설계에서 동일 정보를 Class Diagram과 Sequence Diagram이 더 직접적으로 보여주기 때문이다.

---

## 13. Just-enough RDD

S06의 목표는 모든 Class/Method를 확정하는 것이 아니다.

충분한 결과:

- 주요 Responsibility가 적절한 owner에 배치됨
- 주요 Message와 Collaborator가 식별됨
- Class Diagram과 Sequence Diagram이 서로 일관됨
- Responsibility 이동의 이유를 RDD/GRASP 관점에서 설명 가능
- S07에서 Contract/Variation으로 검토할 질문이 남아 있음

---

# 14. [실습] RDD Responsibility & Collaboration Refinement (25~30분)

> **본편 실습 슬라이드는 1장만 사용한다.** 세부 진행과 힌트는 Slide Notes, 예시 답안은 Session 마지막 `[별첨]`으로 분리한다.

## 실습 슬라이드 — 수강생에게 보이는 내용

> 이 실습은 새 Diagram을 처음부터 작성하는 것이 아니라, 기존 S05 Class Diagram과 S04 Sequence 중 핵심 구간을 수정·발전시키는 **Existing Model Refinement**다.

**입력**

- 자신의 S05 **Initial Design Class Diagram**
- S04 **Place Order Analysis Sequence Diagram**
- 기본 범위: **Place Order → Payment**

**과제**

1. S05 Initial Design Class Diagram에서 Responsibility owner가 약한 부분을 찾아 **그 Class Diagram을 수정**한다(새 Diagram을 처음부터 그리지 않는다).
2. S04 Place Order Analysis Sequence Diagram 중 재배치된 Responsibility와 관련된 **핵심 구간 하나**를 Design Sequence로 발전시켜 Message/Collaboration을 검증한다(전체 interaction을 다시 그리지 않는다).
3. Sequence에서 발견된 문제를 Class Diagram에 feedback한다.
4. LLM에게 다른 Responsibility Assignment와 반론을 요청하고 자신의 안과 비교한다.
5. 필요한 Pattern/원칙만 선택하여 적용하고 이유를 기록한다.

**고려할 Pattern / 원칙**

> **Information Expert · Creator · Controller · High Cohesion · Low Coupling**

**주의**

> 전부 적용하는 checklist가 아니다. 현재 Responsibility 문제에 필요한 관점만 선택하고, 적용하지 않은 이유도 설명할 수 있어야 한다.

**필수 산출물**

- **Refined Design Class Diagram 1개** — S05 Initial Design을 수정한 결과
- **Design Sequence Diagram 1개** — S04 Sequence 중 재배치된 Responsibility가 드러나는 핵심 구간 하나를 발전시킨 결과(전체 interaction이 아니다)

`Responsibility–Owner Table`은 필요하면 중간 사고 도구로 사용할 수 있으나 제출 필수는 아니다.

**판단 기준**

- Responsibility owner를 근거로 설명할 수 있는가?
- Controller와 Domain Decision owner를 구분했는가?
- Data-only Object / God Service가 줄었는가?
- 필요한 Collaboration은 유지하면서 불필요한 Coupling을 줄였는가?
- Class와 Sequence가 같은 Responsibility 구조를 말하는가?

## Slide Notes — 진행 가이드

권장 시간:

- S05 Before 모델 문제 표시: 5분
- Class Diagram Responsibility 재배치(기존 Diagram 수정): 7분
- Design Sequence 작성(핵심 구간 1개로 한정): 7분
- Class↔Sequence feedback: 3분
- LLM 대안/반론 검토: 5~8분

LLM prompt 예:

```text
이 설계의 책임 배치를 RDD 관점에서 검토하라.
특히 Information Expert, Creator, Controller,
High Cohesion, Low Coupling 중 실제로 관련된 관점만 사용하라.

1. owner 근거가 약한 Responsibility
2. Data-only Object / God Service 위험
3. 불필요한 Coupling
4. 대안 Responsibility Assignment

을 제시하되 새로운 기능을 추가하지 마라.
```

강사는 LLM이 Pattern 이름을 기계적으로 붙이는지 확인하게 한다. Pattern 이름보다 실제 Responsibility/knowledge/change reason 근거가 우선이다.

---

## [별첨] 실습 해설 — RDD 적용 전/후 비교

### Before — S05에서 흔히 나오는 형태

```text
Order
- data 중심

OrderService
- createOrder
- addItem
- calculateTotal
- requestPayment
- updatePaymentStatus
```

관찰:

- Order가 Data Holder로 남을 수 있다.
- 하나의 Service에 서로 다른 Responsibility가 집중된다.
- 실제 Expert가 누구인지 드러나지 않는다.

### After — 가능한 RDD 보완 방향

```text
Order
- addItem
- calculateTotal
- reflectPayment

OrderItem
- calculateSubtotal

Payment
- payment-related state/responsibility

PlaceOrderController / Use-case role
- receive Place Order system event
- coordinate collaboration
```

이름과 세부 구조는 정답이 아니다. 해설의 핵심은 다음을 비교하는 데 있다.

- `Order` / `OrderItem`이 자신의 의미 있는 Responsibility를 가지는 이유
- Controller가 Domain Rule을 소유하지 않는 이유
- Payment 관련 Responsibility와 Order Responsibility를 어디까지 분리할지
- Class Diagram의 Responsibility가 Sequence Message와 일치하는지

---

## 15. Feedback 기준

1. S05 모델의 변경 이유를 설명할 수 있는가?
2. Responsibility를 Method name으로만 판단하지 않았는가?
3. Information Expert를 DB/Data location으로 오해하지 않았는가?
4. Creator를 자동 생성 규칙으로 쓰지 않았는가?
5. Controller를 framework class와 동일시하지 않았는가?
6. Controller에 Domain Rule을 몰아넣지 않았는가?
7. High Cohesion/Low Coupling을 숫자나 checklist로 사용하지 않았는가?
8. Class Diagram과 Sequence Diagram 사이의 feedback이 있었는가?
9. LLM이 만든 Pattern/객체를 근거 없이 채택하지 않았는가?
10. S07에서 검토할 Contract/Variation 질문이 남아 있는가?

---

## 16. Failure Conditions

- S05 모델을 거의 그대로 두고 Pattern 이름만 붙인다.
- GRASP를 checklist로 적용한다.
- 모든 Responsibility를 `OrderService`에 둔다.
- 모든 Behavior를 Entity 하나에 몰아넣는다.
- Controller가 Domain Rule을 직접 판단한다.
- Repository가 Domain Expert가 된다.
- Sequence Diagram을 기존 Class Diagram을 정당화하는 그림으로만 사용한다.
- Sequence에서 드러난 문제를 Class 책임에 feedback하지 않는다.
- Class/Sequence/Responsibility Table에 같은 내용을 반복 작성하는 것을 산출물 품질로 착각한다.
- LLM이 제안한 Manager/Policy/Service를 근거 없이 추가한다.
- S07에서 다룰 Contract/Variation을 미리 과도하게 소비한다.

---

## 17. Anchor / Reference

### Responsibility-Driven Design / CRC

S06의 핵심 관점은 Responsibility, Role, Collaboration이다.

### GRASP / Larman

S06 실습의 기본 판단 언어:

- Information Expert
- Creator
- Controller
- High Cohesion
- Low Coupling

Pattern 자체를 암기하는 것이 아니라 **Responsibility Assignment 대안을 설명·비교하는 데 사용**한다.

---

## 18. Session Summary

```text
S05
Experience-based Initial Design
        ↓
S06
RDD
Responsibility / Role / Collaboration
        ↓
GRASP Basic
        ↓
Responsibility Reassignment
        ↓
Design Class Diagram
↔
Design Sequence Diagram
        ↓
Refined Design
```

> **S06의 목적은 S05 설계를 Pattern으로 장식하는 것이 아니라 Responsibility owner와 Collaboration을 근거 있게 다시 설계하는 것이다.**

> **Class Diagram은 책임의 정적 배치를, Sequence Diagram은 그 책임의 동적 협력을 검증한다.**

> **GRASP는 checklist가 아니라 Responsibility Assignment 대안을 비교하는 판단 언어다.**

---

## 19. S07로 넘기는 질문

S07에서는 다음을 묻는다.

```text
이 책임을 수행하기 전에 무엇이 참이어야 하는가?
수행 후 무엇을 보장해야 하는가?
새로운 variation이 생기면 어떤 책임과 협력이 흔들리는가?
변화를 어디에서 흡수해야 하는가?
```

S07에서는 S06 Refined Design에 **Order Cancellation / Refund 변화 요구**를 투입하고 다음 관점을 필요에 따라 사용한다.

> **Polymorphism · Indirection · Protected Variations · Pure Fabrication · Design by Contract · 필요 시 Interface/Composition**

이 목록도 checklist가 아니다.
