# S08. 객체 설계의 판단 기준

- **시간:** 80분
- **상태:** 사용자 승인본
- **핵심 질문:**  
  **여러 Design Alternative가 모두 동작할 때, 실제 change evidence와 비용·효과·trade-off를 근거로 어떤 설계를 선택할 것인가?**
- **권장 본편:** 18장
- **Formal Practice:** 20분 / 본편 1장

---

## 1. Session Position

```text
S07
Actual Change
→ Contract / Responsibility / Collaboration Stress
→ Variation Point / Stable Boundary
→ Local Refinement
→ GoF Pattern Bridge
        ↓
S08
Design Alternative A / B
→ Change Impact
→ Cohesion / Coupling
→ Dependency
→ Abstraction Cost
→ Technology Leakage / POO
→ SOLID / Pattern
→ Trade-off
→ Design Decision
        ↓
S09
Integrated Design Workshop
```

- S07: 실제 change를 받아 필요한 부분을 local refinement한다.
- S08: 같은 문제를 해결하는 여러 설계 대안을 비교하고 하나를 선택한다.
- S09: 요구·분석 모델·책임·협력·계약·variation·대안 평가를 하나의 설계 판단으로 통합한다.

> **S08의 질문은 “어떤 원칙을 적용할 것인가?”가 아니라 “현재 조건에서 어느 설계를 선택할 것인가?”다.**

---

## 2. S07 Handoff / Learning Objectives / Boundary

### S07에서 받는 입력

- Payment Method variation에 대한 local refined design
- Payment Provider variation에 대한 local refined design
- Payment 관련 Class / Sequence 핵심 구조
- 실제 change와 Variation Point
- 적용한 GRASP 판단
- Strategy / Adapter 등 대표 Pattern vocabulary

대표 구조:

```text
Payment
    ↓
PaymentGateway
    ↑
ProviderAGateway
ProviderBGateway
```

S08에서는 이 구조를 만드는 방법을 다시 가르치지 않는다.

### 학습 목표

학습자는 다음을 할 수 있어야 한다.

1. 같은 요구를 만족하는 둘 이상의 Design Alternative를 구분한다.
2. change가 각 대안에 전파되는 범위를 비교한다.
3. cohesion/coupling과 dependency를 근거로 대안을 평가한다.
4. abstraction이 주는 효과와 추가 비용을 함께 판단한다.
5. technology/framework detail이 객체의 의미와 책임 설계를 지배하는지 판단한다.
6. SOLID와 Pattern을 checklist가 아니라 설계 차이를 설명하는 판단 언어로 사용한다.
7. 효과·비용·위험·가역성·evidence를 종합해 하나의 Design Decision을 내린다.

### S08에서 다룬다

- Design Alternative
- Change Impact
- Cohesion / Coupling
- Dependency
- Abstraction Cost
- Plain Old Object / Technology Leakage
- SOLID
  - SRP
  - OCP
  - LSP
  - ISP
  - DIP
- DI / IoC의 설계상 위치
- Pattern을 이용한 대안 설명
- Trade-off
- Design Decision

### S08에서 다루지 않는다

- S07 variation mechanism 재강의
- GRASP 기본/후반 항목 재강의
- GoF Pattern별 상세 적용·비교·조합
- DI Container / framework 사용법
- Architecture style / quality attribute evaluation
- Component Principles(REP/CCP/CRP/ADP/SDP/SAP) 상세
- 전체 Order 설계 재작성
- Test / Refactoring feedback
- S09 Integrated Design Workshop

---

## 3. Design Alternative — 둘 다 동작해도 같은 설계는 아니다

Provider A와 Provider B를 모두 지원한다고 하자.

### Alternative A

```java
class CardPayment {
    PaymentResult pay(Money amount, ProviderType provider) {
        if (provider == A) {
            return payWithProviderA(amount);
        }
        return payWithProviderB(amount);
    }
}
```

### Alternative B

```java
interface PaymentGateway {
    PaymentResult request(Money amount);
}

class CardPayment {
    private final PaymentGateway gateway;

    PaymentResult pay(Money amount) {
        return gateway.request(amount);
    }
}
```

둘 다 현재 기능은 구현할 수 있다.

따라서 다음은 설계 판단 근거가 아니다.

```text
interface가 있다.
Pattern을 사용했다.
Class가 더 많다.
SOLID를 더 많이 적용했다.
```

S08의 판단 흐름:

```text
Change Impact
→ Cohesion / Coupling
→ Dependency
→ Abstraction Cost
→ Technology Leakage / POO
→ SOLID / Pattern
→ Trade-off
→ Design Decision
```

> **Before/After는 Before=나쁨, After=좋음을 뜻하지 않는다. 구조 간 비용과 효과를 비교하기 위한 장치다.**

---

## 4. Change Impact — 무엇을 함께 바꿔야 하는가?

### 판단 질문

> **같은 change가 들어왔을 때 어떤 객체와 collaboration을 함께 수정해야 하는가?**

Provider C가 추가된다고 하자.

### Before

```java
class CardPayment {
    PaymentResult pay(Money amount, ProviderType provider) {
        if (provider == A) { ... }
        else if (provider == B) { ... }
        else if (provider == C) { ... }
    }
}
```

```text
Provider C 추가
→ CardPayment 수정
→ provider 분기 수정
→ mapping 수정
→ 기존 payment behavior 재검토
```

### After

```java
class ProviderCGateway implements PaymentGateway {
    public PaymentResult request(Money amount) {
        ...
    }
}
```

```text
Provider C 추가
→ ProviderCGateway 추가
→ 기존 CardPayment 유지
```

### 판단

After가 의미 있는 이유는 객체가 늘었기 때문이 아니다.

```text
실제 Provider variation 존재
+
새 Provider가 추가될 때
기존 핵심 Payment responsibility 수정 감소
```

라는 evidence가 있기 때문이다.

Provider가 하나뿐이고 change evidence도 없다면 같은 abstraction의 가치는 낮을 수 있다.

---

## 5. Cohesion / Coupling — 책임 집중과 협력 비용을 함께 본다

### 판단 질문

> **같은 의미와 change reason의 책임이 모여 있으며, 다른 객체의 detail을 불필요하게 알고 있지는 않은가?**

### Before

```java
class CardPayment {
    PaymentResult pay(Money amount) {
        ProviderARequest request = mapRequest(amount);
        ProviderAResponse response = providerA.pay(request);
        updatePaymentState(response);
        return mapResult(response);
    }
}
```

한 객체가 동시에 책임진다.

```text
Card payment behavior
+
Provider request/response mapping
+
Provider integration
+
Payment state
```

### After

```java
class CardPayment {
    private final PaymentGateway gateway;

    PaymentResult pay(Money amount) {
        PaymentResult result = gateway.request(amount);
        updatePaymentState(result);
        return result;
    }
}

class ProviderAGateway implements PaymentGateway {
    PaymentResult request(Money amount) {
        // Provider A mapping / integration
        ...
    }
}
```

### 얻는 것

- CardPayment의 책임이 payment behavior에 집중된다.
- Provider detail에 대한 coupling이 줄어든다.
- Provider change reason이 integration object에 모인다.

### 지불하는 것

- 객체와 collaboration이 증가한다.
- 실행 흐름을 따라갈 경로가 늘어난다.
- 이해와 유지에 indirection 비용이 생긴다.

> **High Cohesion / Low Coupling은 더 많이 분리하라는 규칙이 아니다. 분리 효과가 추가 collaboration 비용을 정당화할 때 선택한다.**

---

## 6. Dependency — 어떤 detail을 알아야 하는가?

### 판단 질문

> **이 객체가 자신의 책임을 수행하기 위해 어떤 다른 요소의 구체적인 detail까지 알아야 하는가?**

### Before

```java
class CardPayment {
    private ProviderAClient client;

    PaymentResult pay(Money amount) {
        ProviderAResponse response =
            client.pay(new ProviderARequest(amount));
        ...
    }
}
```

```text
CardPayment
→ ProviderAClient
→ ProviderARequest
→ ProviderAResponse
```

### After

```java
class CardPayment {
    private PaymentGateway gateway;

    PaymentResult pay(Money amount) {
        return gateway.request(amount);
    }
}
```

```text
CardPayment
→ PaymentGateway

ProviderAGateway
→ Provider A API
```

### 판단

- 핵심 responsibility가 volatile detail을 직접 알아야 하는가?
- 두 책임이 실제 change reason을 공유하는가?
- detail 변화가 핵심 객체까지 전파될 이유가 있는가?

> **Dependency를 줄이는 목적은 연결을 없애는 것이 아니라 불필요한 knowledge와 change propagation을 줄이는 것이다.**

---

## 7. Abstraction Cost — 추상화도 비용이다

### 판단 질문

> **추가한 abstraction이 얻는 가치보다 더 많은 이해·구현·협력 비용을 만들지는 않는가?**

### Before

```text
CardPayment
    ↓
ProviderAClient
```

```java
class CardPayment {
    private ProviderAClient client;
}
```

### After

```text
CardPayment
    ↓
PaymentGateway
    ↑
ProviderAGateway
ProviderBGateway
```

```java
interface PaymentGateway { ... }

class ProviderAGateway implements PaymentGateway { ... }
class ProviderBGateway implements PaymentGateway { ... }
```

### 얻는 것

- change localization
- stable collaboration
- implementation substitution

### 지불하는 것

- type / object 증가
- indirection 증가
- construction / configuration 증가
- navigation 증가
- cognitive cost 증가

```text
Abstraction Benefit
vs.
Abstraction Cost
```

> **“미래에 바뀔 수도 있다”만으로 abstraction 비용을 선불로 지불하지 않는다.**

---

## 8. Plain Old Object — Technology Leakage를 평가한다

POO는 공식적인 OO Design Principle 목록으로 사용하지 않는다.

이 과정에서는 **technology leakage를 판단하기 위해 사용하는 Plain Old Object 관점**으로 사용한다.

객체 설계에는 기술적 구현 결정이 필요하다.

문제는 **기술이 존재하는 것**이 아니라 **기술 구조가 객체의 의미와 Responsibility Assignment를 지배하는 것**이다.

### Before

```java
@Entity
class PaymentEntity {

    @Autowired
    ProviderAClient client;

    @Column(name = "payment_status")
    String status;

    void pay(...) {
        ProviderAResponse response = client.request(...);
        ...
    }
}
```

한 객체에 다음이 섞여 있다.

```text
Payment responsibility
+
Persistence mapping
+
Framework DI mechanism
+
Provider API
+
DB representation
```

### After

```java
class Payment {
    private final PaymentGateway gateway;
    private PaymentStatus status;

    Payment(PaymentGateway gateway) {
        this.gateway = gateway;
    }

    PaymentResult pay(Money amount) {
        ...
    }
}
```

```text
Persistence Adapter
Provider Adapter
Framework Configuration
        ↓
Plain Object
Payment
```

### 판단 질문

- 이 객체는 business/object responsibility 때문에 존재하는가?
- framework나 DB가 바뀌면 객체의 의미까지 바뀌는가?
- persistence representation이 object boundary를 결정하고 있지 않은가?
- API DTO를 object/domain model로 그대로 사용하고 있지 않은가?
- framework lifecycle이나 annotation이 responsibility assignment를 대신하고 있지 않은가?

### POO / POJO

```text
POO  : Plain Old Object — 일반적인 설계 관점의 표현
POJO : Plain Old Java Object — Java에서의 대표적 표현
```

> **먼저 객체의 의미·상태·행위·책임·협력을 설계하고, 기술 detail은 필요한 경계에서 결합한다.**

Annotation이나 framework 사용 자체를 금지하는 규칙은 아니다.

---

## 9. SRP / OCP — Responsibility와 Change를 함께 본다

### SRP — Single Responsibility Principle

판단 질문:

> **한 객체가 서로 다른 responsibility와 change reason을 함께 떠안고 있는가?**

#### Before

```java
class CardPayment {
    PaymentResult pay(Money amount) { ... }
    ProviderARequest mapRequest(...) { ... }
    PaymentResult mapResponse(...) { ... }
}
```

```text
Card payment behavior
+
Provider A integration change
```

#### After

```java
class CardPayment {
    private PaymentGateway gateway;

    PaymentResult pay(Money amount) { ... }
}

class ProviderAGateway implements PaymentGateway {
    ...
}
```

Provider integration이 실제 독립된 change reason일 때 분리가 의미 있다.

> **SRP는 Class를 작게 만드는 규칙이 아니다.**

### OCP — Open/Closed Principle

판단 질문:

> **확인된 variation이 추가될 때 안정된 기존 behavior를 계속 수정해야 하는가?**

#### Before

```java
if (provider == A) { ... }
else if (provider == B) { ... }
else if (provider == C) { ... }
```

#### After

```java
class ProviderCGateway implements PaymentGateway {
    ...
}
```

OCP는 미래의 모든 변경으로부터 코드를 닫는다는 의미가 아니다.

> **실제로 반복되는 variation에서 안정된 영역의 수정을 줄일 가치가 있을 때 적용한다.**

---

## 10. LSP / ISP — 같은 Role이 같은 약속을 지키는가?

### LSP — Liskov Substitution Principle

판단 질문:

> **같은 role의 implementation을 바꿔도 caller가 기대하는 contract가 유지되는가?**

### Before

```java
class PointPayment implements PaymentMethod {
    PaymentResult pay(Money amount) {
        if (insufficientPoints()) {
            throw new UnsupportedOperationException();
        }
        ...
    }
}
```

### After

```java
class PointPayment implements PaymentMethod {
    PaymentResult pay(Money amount) {
        if (insufficientPoints()) {
            return PaymentResult.rejected();
        }
        ...
    }
}
```

핵심은 exception 제거가 아니다.

```text
PaymentMethod라는 같은 role
→ caller가 기대하는 contract 유지
```

실제 payment type마다 본질적으로 다른 contract가 필요하다면 공통 abstraction 자체를 다시 검토한다.

### ISP — Interface Segregation Principle

판단 질문:

> **client가 사용하지 않는 responsibility까지 하나의 interface 때문에 의존하고 있는가?**

### Before

```java
interface PaymentGateway {
    PaymentResult pay(Money amount);
    RefundResult refund(Money amount);
    InstallmentResult installment(...);
}
```

```java
class PointGateway implements PaymentGateway {
    InstallmentResult installment(...) {
        throw new UnsupportedOperationException();
    }
}
```

### After

```java
interface PaymentGateway {
    PaymentResult pay(Money amount);
}

interface RefundGateway {
    RefundResult refund(Money amount);
}

interface InstallmentGateway {
    InstallmentResult installment(...);
}
```

### 판단

실제 client별 responsibility가 다르고 불필요한 dependency가 문제일 때 분리한다.

> **ISP는 interface의 Method 수를 줄이는 규칙이 아니다.**

---

## 11. DIP — Dependency Direction을 판단한다

### 판단 질문

> **핵심 policy가 바뀌기 쉬운 concrete detail을 직접 알아야 하는가?**

### Before

```java
class Payment {
    private ProviderAClient client;

    PaymentResult pay(Money amount) {
        ProviderAResponse response = client.pay(...);
        return translate(response);
    }
}
```

```text
Payment Policy
      ↓
Provider A Detail
```

### After

```java
interface PaymentGateway {
    PaymentResult request(Money amount);
}

class Payment {
    private final PaymentGateway gateway;

    PaymentResult pay(Money amount) {
        return gateway.request(amount);
    }
}

class ProviderAGateway implements PaymentGateway {
    private ProviderAClient client;

    public PaymentResult request(Money amount) {
        ProviderAResponse response = client.pay(...);
        return translate(response);
    }
}
```

```text
Payment
   ↓
PaymentGateway
   ↑
ProviderAGateway
   ↓
Provider A API
```

### 얻는 것

- 핵심 Payment responsibility와 Provider detail을 분리한다.
- Provider implementation change를 국소화한다.
- 같은 collaboration을 여러 구현이 제공할 수 있다.

### 지불하는 것

- abstraction 증가
- indirection 증가
- construction/configuration 증가

### 실패 조건

```text
Provider 하나
+
variation evidence 없음
+
stable boundary도 없음
```

이라면 추가 abstraction이 비용만 늘릴 수 있다.

> **DIP는 concrete class마다 interface를 만드는 규칙이 아니다.**

---

## 12. DIP에서 DI로 — Dependency Direction과 Wiring은 다르다

DIP로 abstraction을 만들었다고 dependency 선택 책임까지 자동으로 분리되는 것은 아니다.

### 판단 질문

> **실제 collaborator는 누가 선택하고 공급할 것인가?**

### Before

```java
class Payment {
    private PaymentGateway gateway =
        new ProviderAGateway();
}
```

```text
Payment → PaymentGateway

하지만 Payment가
ProviderAGateway까지 직접 선택
```

### After

```java
class Payment {
    private final PaymentGateway gateway;

    Payment(PaymentGateway gateway) {
        this.gateway = gateway;
    }
}
```

```java
Payment payment =
    new Payment(new ProviderAGateway());
```

### 구분

- **DIP:** 무엇에 의존할 것인가?
- **DI:** 필요한 collaborator를 누가 공급할 것인가?
- **IoC:** control의 일부를 외부가 소유하는 더 넓은 개념

DI는 DIP와 동일하지 않다.

Framework나 DI Container도 필수가 아니다.

```text
Assembler / Composition Root
        ↓ inject
Payment → PaymentGateway
             ↑
       ProviderAGateway
```

> **`new`가 문제인 것이 아니다. 핵심 객체가 volatile implementation 선택까지 책임져야 하는지가 판단 대상이다.**

---

## 13. Pattern — Problem / Effect / Cost로 평가한다

S07에서는 Pattern vocabulary를 이미 연결했다.

S08에서는 Pattern을 다시 배우지 않는다.

### 판단 질문

> **현재 problem이 그 Pattern이 해결하는 문제와 실제로 일치하며, 얻는 효과가 추가 구조 비용을 정당화하는가?**

Provider API가 서로 다르다고 하자.

### Before

```java
class CardPayment {
    ProviderAClient a;
    ProviderBClient b;

    PaymentResult pay(..., ProviderType type) {
        ...
    }
}
```

### After

```java
interface PaymentGateway {
    PaymentResult request(Money amount);
}

class ProviderAAdapter implements PaymentGateway { ... }
class ProviderBAdapter implements PaymentGateway { ... }
```

### 판단

```text
Problem
Provider별 incompatible API

Effect
내부 Payment collaboration을
PaymentGateway 의미로 안정

Cost
Adapter object / mapping / indirection 증가
```

Provider API가 이미 동일하고 variation도 거의 없다면 Adapter 구조의 가치는 낮아질 수 있다.

Strategy도 같은 방식으로 평가한다.

```text
실제 behavior variation 존재
→ 교체 가능한 behavior object의 가치가 있음

variation 하나
+
교체 evidence 없음
→ abstraction 비용이 더 클 수 있음
```

> **Pattern 이름은 Design Decision의 출발점이 아니다. Problem과 evidence가 먼저다.**

---

## 14. Trade-off — 얻는 것과 잃는 것을 함께 본다

대표 비교:

| 판단 | Alternative A — 직접 분기 | Alternative B — Gateway |
|---|---|---|
| 현재 구현 단순성 | 높음 | 낮음 |
| 객체/타입 수 | 적음 | 많음 |
| Provider change localization | 낮음 | 높음 |
| Provider detail coupling | 높음 | 낮음 |
| indirection cost | 낮음 | 높음 |
| 새 Provider 추가 | 기존 코드 수정 | 구현 추가 중심 |
| 초기 이해 비용 | 낮음 | 높음 |
| variation 증가 시 유지 비용 | 증가 | 상대적으로 안정 |

실제 evidence를 겹친다.

```text
현재 Provider 수
실제 추가/교체 요구
API 차이
change frequency
핵심 Payment responsibility의 안정성
team이 감당할 abstraction 비용
결정의 가역성
```

최종 판단:

```text
Effect
+
Cost
+
Risk
+
Reversibility
+
Evidence
```

> **설계 품질은 한 특성을 최대화하는 문제가 아니라 현재 문제에서 감당할 trade-off를 선택하는 문제다.**

---

## 15. Design Decision — 판단 구조

Design Decision은 원칙 이름이나 Pattern 이름으로 끝나지 않는다.

```text
Evidence
→ Alternative Difference
→ Effect / Cost
→ Trade-off
→ Decision
```

### 판단할 때 확인한다

- 어떤 실제 evidence가 있는가?
- Alternative 사이의 구조적 차이는 무엇인가?
- 그 차이가 change impact, responsibility, dependency에 어떤 효과를 만드는가?
- 그 효과를 얻기 위해 어떤 abstraction·indirection·이해 비용을 지불하는가?
- 선택하지 않은 대안의 장점은 무엇인가?
- evidence가 달라지면 결정을 바꿀 수 있는가?

> **Design Decision은 “무슨 원칙을 적용했다”가 아니라 “왜 지금 이 비용을 지불하는가”를 설명한다.**

특정 Alternative에 대한 대표 선택과 해설은 Formal Practice 이후 `[별첨]`에서 다룬다.

---

# 16. [실습] 어느 설계를 선택할 것인가? — 20분

### 입력

앞에서 제시한 **Design Alternative A / B**와 현재 조건

### 과제

앞에서 배운 객체 설계 판단 기준을 사용해 **A 또는 B 중 하나를 선택한다.**

선택한 이유와 **선택하지 않은 대안의 장점 또는 비선택 이유**를 설명한다.

### 필수 산출물

```text
선택: Alternative A / B

핵심 근거:
1.
2.
3.

비선택 대안:
-
```

### LLM용 추천 프롬프트

- `내 설계 선택에 대한 가장 강한 반론을 제시하라.`
- `내 판단에서 evidence 없이 가정한 부분을 찾아라.`
- `더 단순한 대안으로 충분한지 검토하라.`
- `원칙이나 Pattern 이름 자체를 근거로 사용한 부분이 있는지 찾아라.`
- `...`

---

## [별첨] 실습 해설 — Alternative Comparison

### Alternative A

```text
CardPayment
 ├─ Provider A API
 └─ Provider B API
```

장점:

- 구조가 단순하다.
- 객체와 interface 수가 적다.
- 실행 흐름을 따라가기 쉽다.

단점:

- CardPayment가 Provider-specific detail을 안다.
- Provider integration change와 payment responsibility가 함께 수정된다.
- Provider 추가 시 기존 CardPayment를 수정한다.

### Alternative B

```text
CardPayment
      ↓
PaymentGateway
      ↑
ProviderAGateway
ProviderBGateway
```

장점:

- Provider detail을 국소화한다.
- CardPayment와 Provider API 사이 dependency를 줄인다.
- Provider variation 추가 시 기존 핵심 코드의 수정 가능성이 감소한다.

단점:

- interface와 implementation object가 증가한다.
- indirection이 생긴다.
- configuration / construction 비용이 추가된다.

### 현재 evidence에서의 대표 판단

**Alternative B**

결정적 근거:

1. 실제로 두 Provider가 존재하고 API도 다르다.
2. Provider-specific change를 Gateway로 국소화할 수 있다.
3. 추가 abstraction 비용보다 현재 확인된 variation을 흡수하는 효과가 크다.

그러나 다음 조건이면 A가 더 경제적일 수 있다.

```text
Provider 하나
+
추가 variation evidence 없음
+
integration 단순
```

---

## [별첨] 실습 해설 — Design Decision

```text
선택: Alternative B

핵심 근거
1. Provider change가 CardPayment로 직접 전파되는 범위를 줄인다.
2. payment responsibility와 provider integration change reason을 분리한다.
3. abstraction과 indirection 비용이 추가되지만,
   이미 존재하는 두 Provider와 API 차이가 이를 정당화한다.

Alternative A의 장점
- 단순하다.
- 객체와 indirection이 적다.

현재 판단
- 지금은 B를 선택한다.
- evidence가 달라지면 A도 유효한 선택이 될 수 있다.
```

핵심 연결:

```text
Evidence
→ Alternative Difference
→ Effect / Cost
→ Trade-off
→ Design Decision
```

---

## 17. Feedback / Failure Conditions

### 확인

1. 두 Alternative가 모두 현재 기능을 만족할 수 있음을 인정했는가?
2. Before/After를 Bad/Good으로 자동 해석하지 않았는가?
3. Change Impact를 실제 수정 범위로 설명했는가?
4. Cohesion/Coupling을 객체 수로만 판단하지 않았는가?
5. Dependency가 어떤 detail knowledge를 만드는지 설명했는가?
6. abstraction의 효과와 비용을 함께 보았는가?
7. technology/framework detail이 객체 responsibility를 지배하는지 검토했는가?
8. SOLID에서 현재 문제와 관련 있는 원칙만 사용했는가?
9. Pattern 이름보다 problem/effect/cost를 먼저 보았는가?
10. 선택하지 않은 Alternative의 장점도 설명할 수 있는가?
11. 최종 선택이 실제 evidence에 연결되는가?

### 실패

- interface가 많으면 좋은 설계라고 판단한다.
- SOLID 적용 개수를 세어 대안을 선택한다.
- Pattern을 사용한 대안을 자동으로 우선한다.
- 모든 dependency에 abstraction을 추가한다.
- 미래 change를 evidence 없이 가정한다.
- SRP를 Class 크기 규칙으로 사용한다.
- OCP를 모든 미래 변경을 예측하는 원칙으로 사용한다.
- LSP를 inheritance 문법 문제로만 본다.
- ISP를 interface Method 수를 줄이는 규칙으로 사용한다.
- DIP를 concrete class마다 interface를 만드는 규칙으로 사용한다.
- DI를 DI Container나 framework 사용과 동일시한다.
- annotation/framework 사용 자체를 POO 위반으로 판단한다.
- DB Entity나 API DTO를 별도 판단 없이 객체 설계 모델로 그대로 사용한다.
- abstraction / indirection cost를 무시한다.
- 현재 선택을 영구적인 정답으로 취급한다.
- S07 local refinement를 다시 수행한다.
- Order 전체 설계를 재작성해 S09 Workshop을 선행한다.

---

## 18. Session Summary / S09 Handoff

```text
S07
Actual Change
→ Local Refinement
→ Pattern Vocabulary
        ↓
S08
Design Alternative A / B
        ↓
Change Impact
        ↓
Cohesion / Coupling
        ↓
Dependency
        ↓
Abstraction Cost
        ↓
Technology Leakage / POO
        ↓
SOLID / Pattern
        ↓
Trade-off
        ↓
Design Decision
        ↓
S09
Integrated Design Workshop
```

핵심:

> **좋은 설계는 원칙을 많이 적용한 설계가 아니다.**

> **객체 설계는 기술을 배제하는 것이 아니라 기술이 객체의 의미와 책임을 지배하지 않도록 한다.**

> **현재 evidence에서 얻는 효과가 추가 비용을 정당화하는 설계를 선택한다.**

> **SOLID와 Pattern은 결정을 대신하는 checklist가 아니라 대안의 차이와 trade-off를 설명하는 판단 언어다.**

S09에서는 S08의 평가 기법을 더 확장하지 않는다.

앞선 결과를 하나의 일관된 설계 판단으로 통합한다.

```text
Requirement
→ Static / Dynamic Problem Understanding
→ Object Boundary
→ Responsibility
→ Collaboration
→ Object Contract
→ Variation
→ Design Alternative Evaluation
→ Integrated Design
```

---

## Recommended Slides

**본편 18장**

| Slide | 내용 |
|---:|---|
| 1 | Session Position |
| 2 | S07 Handoff / Learning Objectives / Boundary |
| 3 | Design Alternative / Evaluation Flow |
| 4 | Change Impact — Before / After |
| 5 | Cohesion / Coupling — Before / After |
| 6 | Dependency — Before / After |
| 7 | Abstraction Cost — Before / After |
| 8 | POO / Technology Leakage — Before / After |
| 9 | SRP / OCP — Before / After |
| 10 | LSP / ISP — Before / After |
| 11 | DIP — Before / After |
| 12 | DIP → DI / IoC — Before / After |
| 13 | Pattern Evaluation — Before / After |
| 14 | Trade-off |
| 15 | Design Decision — 판단 구조 |
| 16 | **[실습] 어느 설계를 선택할 것인가?** |
| 17 | Feedback / Failure Conditions |
| 18 | Session Summary / S09 Handoff |

**별첨 2장**

- 실습 해설 — Alternative Comparison
- 실습 해설 — Design Decision

### Slide Density 판단

18장은 Session Architecture의 초기 추정 `14~17`보다 1장 많다.

증가 이유는 DIP와 별개로 **DI / IoC의 역할과 dependency wiring 판단을 명확히 구분할 필요가 있기 때문**이다.

POO는 별도 SOLID overview 장을 만들지 않고 대안 평가 기준 중 하나로 배치했으므로 추가적인 slide 증가 요인은 아니다.

Formal Practice는 본편 1장을 유지하며, 앞 슬라이드에서 이미 배운 판단 기준을 다시 복제하지 않고 **선택 + 핵심 근거 2~3개 + 비선택 대안 평가 + LLM 반론 검토**에만 집중한다.

---

## S07 / S09 Boundary Check

### S07 중복

없음.

S07에서 이미 다룬 다음 내용은 재강의하지 않는다.

- Protected Variations
- Polymorphism
- Pure Fabrication
- Indirection
- Object Composition
- Strategy / Adapter / State / Factory Method

S08에서는 해당 구조의 **효과와 비용을 평가하는 데 필요한 경우만 회수**한다.

### S09 침범

없음.

S08은 제공된 Alternative를 비교하고 Design Decision을 내리는 데서 끝난다.

다음은 S09에 남긴다.

- Requirement 재검토
- Static/Dynamic Model 선택·통합
- 객체 경계 재설계
- Responsibility / Collaboration / Contract 통합
- 전체 Order Design 통합
