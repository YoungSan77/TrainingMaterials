# S07. 책임 설계 ② — 계약과 변화 대응

- **상태:** 사용자 승인본
- **핵심 질문:** 새로운 change가 기존 Object Contract와 Responsibility·Collaboration에 어떤 압력을 만드는지 발견하고, 필요한 설계 원칙으로 변화를 국소화할 수 있는가?

---

## 1. Session Position

```text
S06 Refined Design
→ Actual Change
→ Contract / Responsibility / Collaboration Stress
→ Variation Point / Stable Boundary
→ GRASP 후반 관점
→ Local Refinement
→ [실습]
→ GoF Pattern Bridge
→ S08 Holistic Design Judgment
```

- S06: Responsibility owner와 Object Contract를 정제한다.
- S07: 새로운 change가 기존 설계를 어디서 흔드는지 보고 local refinement한다.
- S08: 여러 설계 대안을 비용·효과·trade-off로 비교한다.

---

## 2. S06 Handoff

S07은 S06의 다음 산출물을 입력으로 사용한다.

- Refined Design Class Diagram
- Design Sequence Diagram의 Payment 핵심 구간
- 핵심 Message의 Object Contract
- Place Order → Payment baseline

대표 baseline:

```text
PlaceOrderController → Order : place()
PlaceOrderController → Payment : request(total, paymentMethod)
Payment → PlaceOrderController : paymentResult
PlaceOrderController → Order : reflectPayment(paymentResult)
```

S07에서는 Design by Contract를 다시 가르치지 않는다. 기존 Contract를 change stress를 관찰하는 기준으로 사용한다.

---

## 3. Learning Objectives

학습자는 다음을 할 수 있어야 한다.

1. change가 기존 Contract·Responsibility·Collaboration에 미치는 영향을 찾는다.
2. Variation Point와 Stable Boundary를 구분한다.
3. Protected Variations, Polymorphism, Pure Fabrication, Indirection을 중첩 가능한 Responsibility Assignment 관점으로 사용한다.
4. Object Composition을 collaborator 기반 behavior 구성으로 이해한다.
5. Pattern 이름 없이 local refinement한 뒤 대표 GoF Pattern과 연결한다.
6. 종합적인 설계 대안 평가는 S08로 넘긴다.

---

## 4. Scope / Boundary

### S07에서 다룬다

- Contract / Responsibility / Collaboration Stress
- Variation Point / Stable Boundary
- Protected Variations
- Polymorphism
- Pure Fabrication
- Indirection
- Object Composition
- Payment variation local refinement
- GoF Pattern cheat sheet
- Strategy / Adapter / State / Factory Method 소개

### S07에서 다루지 않는다

- DbC 기본 재강의
- GRASP 기본 5개 재강의
- SOLID 전체 평가
- GoF Pattern 심화·비교·조합
- Architecture style
- Test / Refactoring feedback

---

## 5. Change를 먼저 본다

슬라이드 핵심 메시지:

> **Pattern을 찾기 전에 무엇이 변했고 어디까지 영향이 퍼지는지 본다.**

```text
Change
→ Contract Stress
→ Responsibility Stress
→ Collaboration Stress
→ Variation Point
→ Stable Boundary
→ Local Refinement
```

대표 질문:

- 무엇이 변했는가?
- 무엇이 함께 수정되는가?
- 무엇은 그대로 유지할 수 있는가?
- 변화와 나머지 설계 사이에서 어떤 의미를 안정시킬 것인가?

---

## 6. Teaching Change — Order Cancellation / Refund

고객 요구:

> **고객은 결제가 완료된 주문을 취소할 수 있어야 하며, 이미 결제된 금액은 환불되어야 한다.**

이 요구를 이용해 다음을 관찰한다.

- 기존 Order Contract에서 새로 질문받는 부분
- Order state와 Refund collaboration의 영향
- 그대로 유지되는 Responsibility와 변경되는 Responsibility

여기서 Cancellation/Refund의 완성 설계를 만들거나 GoF Pattern을 먼저 제시하지 않는다.

---

## 7. Variation Point / Stable Boundary

### Variation Point

실제 change 때문에 behavior 또는 implementation 차이가 기존 설계로 전파되는 지점.

### Stable Boundary

변하는 부분과 나머지 collaboration 사이에서 안정적으로 유지하려는 의미.

예:

```text
변하는 것: Payment Method
안정시키려는 의미: "금액을 지불하고 결과를 반환한다."
```

> Stable Boundary는 언어의 `interface` 문법 자체가 아니다.

---

## 8. GRASP는 중첩 가능한 Responsibility Assignment 관점이다

대표 예:

```text
Payment
   ↓
PaymentGateway
   ↑
ProviderAGateway / ProviderBGateway
```

같은 설계를 여러 관점으로 볼 수 있다.

| 관점 | 설명 |
|---|---|
| Low Coupling | Payment가 Provider API를 직접 알지 않게 한다. |
| High Cohesion | Provider integration 책임을 Payment에서 분리한다. |
| Pure Fabrication | non-domain design object에 책임을 둔다. |
| Indirection | Payment와 Provider 사이의 직접 dependency를 중재한다. |
| Protected Variations | Provider 변화로부터 Payment를 보호한다. |
| Polymorphism | Provider별 차이를 같은 role 뒤에서 처리한다. |

> 여러 Pattern을 각각 적용했다는 뜻이 아니라, 하나의 설계 결정을 여러 GRASP 관점으로 설명한 것이다.

---

## 9. Protected Variations

### 슬라이드 의도

변화가 다른 객체로 전파되지 않도록 무엇을 보호할지 판단한다.

### 예

```text
Before
Payment
 └─ Card / BankTransfer 분기

Change
+ Point

After
Payment → PaymentMethod
            ↑
    Card / BankTransfer / Point
```

### 핵심

- 실제 variation evidence를 먼저 본다.
- 안정적으로 유지할 responsibility/collaboration을 찾는다.
- 미래에 바뀔 수 있다는 이유만으로 abstraction을 만들지 않는다.

### 짧은 코드

```java
interface PaymentMethod {
    PaymentResult pay(Money amount);
}
```

---

## 10. Polymorphism

### 슬라이드 의도

같은 의미의 message에 대한 behavior 차이를 누가 책임질지 판단한다.

### Before

```java
if (type == CARD) { ... }
else if (type == POINT) { ... }
```

### After

```java
interface PaymentMethod {
    PaymentResult pay(Money amount);
}

class CardPayment implements PaymentMethod {
    public PaymentResult pay(Money amount) { ... }
}

class PointPayment implements PaymentMethod {
    public PaymentResult pay(Money amount) { ... }
}
```

### 핵심

> Polymorphism의 목적은 `if/else` 제거가 아니라 variation responsibility의 적절한 배치다.

---

## 11. Pure Fabrication

### 슬라이드 의도

Domain Object가 적절한 owner가 아닐 때 non-domain design object에 책임을 둘 수 있음을 이해한다.

### Before

```java
class Payment {
    PaymentResult pay(Money amount) {
        // Provider A request/response mapping
        ...
    }
}
```

### After

```java
interface PaymentGateway {
    PaymentResult request(Money amount);
}

class ProviderAGateway implements PaymentGateway {
    public PaymentResult request(Money amount) {
        // Provider A mapping
        ...
    }
}
```

### 핵심

- Provider integration responsibility를 별도 design object에 둔다.
- cohesion/coupling/change localization으로 정당화한다.
- `Service`, `Manager`, `Helper`를 만드는 일반 규칙이 아니다.

---

## 12. Indirection

### 슬라이드 의도

직접 dependency를 중재할 책임이 필요한지 판단한다.

### Before

```text
Payment → Provider A API
```

### After

```text
Payment → PaymentGateway → Provider A / Provider B
```

### 짧은 코드

```java
class Payment {
    private final PaymentGateway gateway;

    PaymentResult pay(Money amount) {
        return gateway.request(amount);
    }
}
```

### 핵심

- Pure Fabrication: **누가 책임을 가질 것인가?**
- Indirection: **직접 dependency를 어떻게 중재할 것인가?**

둘은 경쟁하는 Pattern이 아니다.

---

## 13. Object Composition

### 슬라이드 의도

behavior를 collaborator의 조합으로 구성할 수 있음을 이해한다.

### 예

```text
Payment
 ├─ PointPayment
 └─ CardPayment
```

### 짧은 코드

```java
class Payment {
    private List<PaymentMethod> methods;

    PaymentResult pay(Money amount) {
        ...
    }
}
```

### 핵심

- 여러 collaborator를 조합해 behavior를 구성할 수 있다.
- **Object Composition ≠ UML filled-diamond Composition**

---

# 14. [실습] Payment Variation Local Refinement

> **본편 실습 슬라이드는 1장만 사용한다.**

**입력**  
S06 Refined Design의 Payment 관련 Class / Sequence

**변경 요구**  
> 고객은 포인트와 카드를 함께 사용해 결제할 수 있어야 한다. 또한 카드 결제 대행사를 변경하거나 추가하더라도 주문·결제 핵심 로직의 수정은 최소화되어야 한다.

**과제**
1. 변경이 기존 설계에 미치는 영향을 찾는다.
2. S07에서 배운 설계 원칙을 적용해 **Payment 관련 부분만** 수정한다.
3. Class와 Sequence의 일관성을 확인한다.

**산출물**
- Payment 관련 Class Diagram 수정본
- Sequence 핵심 구간 수정본
- 설계 변경 이유

**LLM Prompt 예시**
- `이 변경이 기존 설계 어디까지 영향을 주는지 검토하라.`
- `변경 영향을 충분히 국소화했는지 평가하라.`
- `더 단순한 설계 대안을 제안하라.`
- `불필요한 추상화나 객체가 있는지 검토하라.`

---

## [별첨] 실습 해설 — Payment Method

```text
Payment
    ↓ uses one or more
PaymentMethod
    ↑
CardPayment
PointPayment
```

- Protected Variations: Payment Method 변화가 caller로 퍼지는 것을 줄인다.
- Polymorphism: 각 Payment Method가 자신의 behavior를 책임진다.
- Object Composition: Point + Card 결제를 여러 collaborator의 조합으로 구성한다.
- Pure Fabrication / Indirection은 별도 근거가 없다면 추가하지 않는다.

---

## [별첨] 실습 해설 — Payment Provider

```text
Payment
    ↓
PaymentGateway
    ↑
ProviderAGateway
ProviderBGateway
```

같은 설계를 다음 관점으로 설명할 수 있다.

- Low Coupling
- High Cohesion
- Pure Fabrication
- Indirection
- Protected Variations
- Polymorphism

---

## 15. GoF Pattern Bridge

실습이 끝난 뒤 처음 Pattern 이름을 연결한다.

> **앞에서 Pattern 이름 없이 만든 설계 구조 중 일부는 반복되는 문제에 대한 GoF Pattern과 연결된다.**

### GRASP와 GoF

| GRASP | GoF Design Pattern |
|---|---|
| Responsibility Assignment를 보는 관점 | 반복되는 특정 문제의 solution structure |
| 여러 관점이 하나의 결정에 중첩 가능 | 문제와 solution structure를 연결 |
| 설계 판단의 근거 | 알려진 설계 vocabulary |

---

## 16. GoF Cheat Sheet

한 장에 23개 Pattern을 분류해 보여준다.

- **Creational:** Abstract Factory, Builder, Factory Method, Prototype, Singleton
- **Structural:** Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy
- **Behavioral:** Chain of Responsibility, Command, Interpreter, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor

> 목적은 암기가 아니라 Pattern catalog의 지도를 제공하는 것이다.

---

## 17. Strategy

### 슬라이드 의도

교체 가능한 behavior를 별도 object로 캡슐화하는 대표 Pattern을 이해한다.

### 설명

Payment Method variation처럼 같은 목적의 behavior가 여러 방식으로 달라질 때 사용한다.

### 샘플 코드

```java
interface PaymentStrategy {
    PaymentResult pay(Money amount);
}

class CardStrategy implements PaymentStrategy {
    public PaymentResult pay(Money amount) { ... }
}

class Payment {
    private PaymentStrategy strategy;

    PaymentResult pay(Money amount) {
        return strategy.pay(amount);
    }
}
```

### 경계

`if/else`가 있다는 이유만으로 Strategy를 쓰지 않는다.

---

## 18. Adapter

### 슬라이드 의도

외부 interface 차이를 내부 collaboration 의미에 맞추는 대표 Pattern을 이해한다.

### 설명

Provider마다 API가 달라도 내부에서는 동일한 `PaymentGateway` 의미로 협력하게 한다.

### 샘플 코드

```java
interface PaymentGateway {
    PaymentResult request(Money amount);
}

class ProviderAAdapter implements PaymentGateway {
    private ProviderA api;

    public PaymentResult request(Money amount) {
        ProviderAResponse r = api.pay(...);
        return translate(r);
    }
}
```

### 경계

단순 wrapper가 아니라 **incompatible interface를 adaptation**하는 문제일 때 사용한다.

---

## 19. State

### 슬라이드 의도

상태에 따라 behavior와 transition rule이 달라지는 문제를 object로 분리하는 대표 Pattern을 이해한다.

### 설명

Order의 `Paid`, `Cancelled` 상태별 허용 behavior가 복잡해질 때 적용할 수 있다.

### 샘플 코드

```java
interface OrderState {
    void cancel(Order order);
}

class PaidState implements OrderState {
    public void cancel(Order order) {
        order.requestRefund();
        order.changeState(new CancelledState());
    }
}
```

### 경계

status enum이 있다는 이유만으로 State Pattern을 적용하지 않는다.

---

## 20. Factory Method

### 슬라이드 의도

객체 생성 책임 자체가 variation이 될 때 creation을 분리하는 대표 Pattern을 이해한다.

### 샘플 코드

```java
abstract class PaymentCreator {
    abstract PaymentMethod create();
}

class CardPaymentCreator extends PaymentCreator {
    PaymentMethod create() {
        return new CardPayment();
    }
}
```

### 경계

`new`를 감추기 위해 Factory를 만드는 것이 아니다. 생성 방식이나 concrete type 선택이 실제 variation일 때 검토한다.

---

## 21. Design Pattern Handoff

S07에서는 다음까지만 다룬다.

- GoF Pattern이 특정 반복 문제와 solution structure를 연결한다는 점
- Strategy / Adapter / State / Factory Method의 대표 사례
- Pattern catalog의 전체 지도

다음은 별도 Design Pattern 과정으로 넘긴다.

- Pattern별 상세 Intent / Applicability / Participants / Consequences
- Pattern 간 비교와 조합
- Implementation Variation
- Refactoring to Patterns
- Pattern Language

---

## 22. Feedback / Failure Conditions

### 확인

- Change를 Pattern보다 먼저 보았는가?
- 변하지 않는 Responsibility를 유지했는가?
- GRASP를 상호배타적 선택 목록으로 사용하지 않았는가?
- Pure Fabrication과 Indirection의 질문 차이를 설명할 수 있는가?
- Object Composition과 UML Composition을 구분했는가?
- Pattern 이름 없이 먼저 local refinement했는가?

### 실패

- 모든 variation에 abstraction을 만든다.
- GRASP를 checklist로 사용한다.
- Service/Manager/Helper를 근거 없이 추가한다.
- Pattern 이름만 늘고 change propagation은 줄지 않는다.
- GoF 소개가 Pattern 심화 강의로 확장된다.
- S08의 holistic comparison을 선행한다.

---

## 23. Session Summary / S08 Handoff

```text
Actual Change
→ Contract / Responsibility / Collaboration Stress
→ Variation Point / Stable Boundary
→ GRASP 후반 관점
→ Local Refinement
→ [실습]
→ GoF Pattern Bridge
→ S08 Holistic Design Judgment
```

핵심:

> **GRASP는 하나의 Responsibility Assignment를 여러 각도에서 보는 중첩 가능한 관점이다.**

> **GoF Pattern은 특정 반복 문제에 대한 알려진 solution structure다.**

S08에서는 다음을 판단한다.

- abstraction cost
- change impact
- cohesion / coupling
- dependency
- SOLID
- Pattern
- trade-off
