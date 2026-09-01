# S09. Order 통합 설계 Workshop

- **시간:** 90분
- **상태:** 사용자 승인본
- **핵심 질문:**  
  **좋은 객체 설계는 정답 구조를 외우는 것이 아니라, 문제 의미·동적 시나리오·책임·협력·변화·비용·evidence를 함께 보고 필요한 부분만 개선하는 판단의 결과임을, 새로운 문제에 실제로 적용해 확인할 수 있는가?**

---

## 과정 목표 / Session Outcome

학습자는 S09 종료 시 다음을 할 수 있어야 한다.

- S03~S08에서 이미 배운 판단만으로 새로운 flawed/candidate model의 문제를 스스로 찾는다.
- 문제 하나를 발견했다고 전체 설계를 다시 만들지 않고, 관련된 부분만 국소적으로 개선한다.
- `Find the problem → Identify the relevant judgment → Refine locally → Re-check → Stop` 흐름을 서로 다른 판단 유형(Static↔Dynamic, Responsibility/Collaboration/Contract, Variation/Abstraction/Trade-off)에서 3번 반복 경험한다.
- 정상 Order running model과 Workshop 전용 flawed/candidate model을 구분한다.
- Design Decision이 evidence에 따라 다시 열릴 수 있음을 설명한다.

---

# 1. Session Position — Learn earlier, Apply here

```text
S02   Requirement / Event / 용어집
S03   Static Problem Understanding
S04   Dynamic Problem Understanding + Static↔Dynamic Refinement
S05   Analysis → Object Design (경험 기반 Initial Design)
S06   Responsibility / Collaboration / Object Contract
S07   Variation / Local Refinement
S08   Design Alternative Evaluation
        ↓
S09   Order 통합 설계 Workshop
```

S02~S08은 판단 유형을 하나씩 나누어 깊게 가르쳤다. S09는 새 판단 유형을 가르치는 세션이 아니다.

> **Learn earlier → Apply here.**  
> **Explain here → Practice here가 아니다.**

S09에서 다음을 처음 가르치지 않는다.

- 새로운 modeling concept(Concept/Attribute/Relationship/Multiplicity/Association Object 판단 기준)
- 새로운 GRASP 관점
- 새로운 Pattern
- 새로운 SOLID 원칙
- 새로운 architecture concept

S09가 owner session의 누락을 보충하는 자리라면 그것은 S09가 아니라 해당 owner session(S03~S08)의 문제다. S09는 그 대신 **이미 완결된 판단을 새로운 문제에 결합·적용**하는 자리다.

> **S09는 S03~S08의 모든 개념을 한 번씩 사용하는 coverage exercise가 아니다. 각 Exercise는 핵심 judgment를 선명하게 만드는 데 필요한 개념만 사용한다.**

## Session Thesis

> **좋은 객체 설계는 정답 구조를 외우는 것이 아니라, 문제 의미·동적 시나리오·책임·협력·변화·비용·evidence를 함께 보고 필요한 부분만 개선하는 판단의 결과다.**

> **한 문제를 발견했다고 전체 모델을 다시 설계하지 않는다.**

S09 전체를 관통하는 반복 judgment:

```text
Find the problem
        ↓
Identify the relevant judgment (어느 owner session의 판단인가?)
        ↓
Refine locally
        ↓
Re-check
        ↓
Stop
```

---

# 2. Engineering Judgment Map과 이 Workshop의 순서

S01의 Engineering Judgment / Abstraction Map(`Intent → Requirement → Analysis → Architecture → Design → Technical Design → Code`)과 `Course Sequence ≠ Engineering Lifecycle` 원칙을 그대로 가져온다(재강의하지 않는다).

Exercise 1 → 2 → 3의 순서는 **학습 난이도 progression**이지 실제 engineering이 밟아야 하는 lifecycle이 아니다. 실제 설계에서는 Exercise 3에서 다루는 판단(변화·대안 비교) 중에 Exercise 1의 판단(정적 구조)으로 되돌아갈 수 있다. 이 원칙은 S01에서 이미 확정했으므로 여기서는 이 한 문단으로만 확인한다.

---

# 3. Boundary — 이 Workshop이 다루지 않는 것

다음은 이 Workshop의 대상이 아니다. 다른 과정 또는 다른 Session의 owner다.

- System architecture style, quality-attribute trade-off, deployment architecture → **SW Architecture**
- Bounded Context, Aggregate 설계, strategic DDD → **DDD**
- AI guardrail/harness → **AI-Native**
- Framework/language 구현 상세, DB physical design → 각 기술 전문 영역

S09는 **OOAD object-design judgment**(Static/Dynamic Problem Understanding, Responsibility/Collaboration/Contract, Variation/Abstraction/Trade-off)만 통합한다.

---

# 4. Running Model vs Workshop Model — 반드시 구분한다

## 정상 Running Model

S02~S08에서 누적된 Order model(`Customer`, `ShoppingCart`, `ShoppingCartItem`, `Order`, `OrderItem`, `Product`, `Payment`, S06의 Refined Design, S07의 `PaymentMethod`/`PaymentGateway`)은 **baseline이다.** S09는 이 model을 이유 없이 뒤집거나 결함 모델로 만들지 않는다.

## Workshop Flawed / Candidate Model

각 Exercise는 **별도의 작은 candidate model**을 사용한다. Domain은 `Order Cancellation / Refund`로 통일한다 — 이는 새로운 business-domain 지식이 아니라 S07에서 이미 "기존 책임·계약·협력에 가해지는 teaching용 change request"로 예고된 영역이다(course-design.md Change as Learning Device, S07 §6). S02~S06의 주 baseline(Place Order → Payment)의 대상이었던 적이 없으므로, "앞 session에서 맞다고 배운 모델이 왜 갑자기 틀렸는가?"라는 혼동이 생기지 않는다.

각 Exercise의 모델은 항상 다음 중 하나로 명시적으로 라벨링한다.

```text
[Workshop Candidate]
[Before]
[Flawed]
```

정상 Order running model(Place Order → Payment)과 절대 같은 이름으로 섞지 않는다.

---

# 5. Session Timebox (총 90분)

| 구간 | 내용 | 시간 |
|---|---|---:|
| Opening / Framing | Session Position, Thesis, Running vs Workshop Model 구분, 진행 방식 안내 | 8분 |
| Exercise 1 + Review | Static ↔ Dynamic Refinement (Owner: S03/S04) | 18분 |
| Exercise 2 + Review | Responsibility / Collaboration / Contract Refinement (Owner: S05/S06) | 24분 |
| Exercise 3 + Review | Variation / Abstraction / Alternative Evaluation (Owner: S07/S08) | 28분 |
| Final Synthesis + S10 Handoff | 세 Exercise를 관통한 공통 judgment 회수, S10 전환 | 12분 |
| **합계** | | **90분** |

Exercise별 시간이 뒤로 갈수록 늘어나는 이유는 각 Exercise가 이전 Exercise의 결과를 evidence로 함께 고려해야 하기 때문이다(§8 참고). 모든 문제 유형을 하나의 Exercise에 억지로 넣지 않는다.

---

# 6. [Exercise 1] Static ↔ Dynamic Refinement · 18분

**Owner:** S03, S04  
**사용하는 판단만:** Concept 식별, Relationship/Multiplicity, snapshot/temporal meaning(Scenario가 실제로 요구할 때만), Static↔Dynamic Cross-check(S04 §29~§33, §42와 동일한 흐름)

## 목적

제공된 `[Workshop Candidate]` Static Model이 제공된 Scenario를 설명하지 못하는 지점을 찾고, S03/S04에서 배운 판단 기준만으로 최소 수정한다.

## 입력 — `[Workshop Candidate]` Static Model (의도적으로 결함 있음)

```text
Order
--------------------------
orderNo : Text
status  : OrderStatus

Order 1 -------- 0..1 Payment
Payment
--------------------------
amount : Money
status : PaymentStatus   (PENDING, PAID, CANCELLED, REFUNDED 포함)
```

## Scenario

```text
1. Customer가 결제 완료된 Order의 취소를 요청한다.
2. 아직 배송 전이므로 System은 취소를 승인하고 환불을 시작한다.
3. 환불 처리 중 오류로 첫 시도가 실패한다.
4. Customer가 다시 취소/환불을 요청한다.
5. 두 번째 시도에서 환불이 완료된다.
6. 이후 프로모션 정산으로 Payment.amount가 조정되더라도, 이미 완료된 환불 금액은 처음 승인됐던 금액 그대로 유지되어야 한다.
```

## 과제

1. 제공된 Static Model을 읽는다.
2. Scenario를 순서대로 따라간다.
3. 이 Static Model로 설명할 수 없는 지점을 찾는다.
4. 누락되었거나 잘못된 Concept, Attribute, Relationship, Multiplicity를 수정한다(전체를 새로 그리지 않는다. 문제가 있는 부분만 고친다).
5. 수정된 모델로 Scenario 전체를 다시 설명할 수 있는지 확인한다.

## Boundary — 이 Exercise에서 다루지 않는다

- Method allocation, Responsibility owner
- GRASP
- Object Contract

이것들은 Exercise 2의 판단 대상이다.

## 필수 산출물 (최소화)

```text
발견한 문제:

수정된 Static Model (해당 부분만):

수정 이유:

Scenario 재확인:
```

## Facilitator Teaching Logic

```text
문제
Payment.status만으로 여러 번의 취소/환불 시도(3~5번)와
확정 시점 금액 보존(6번)을 표현할 수 없다.

왜 문제인가
- 시도마다 시각·결과가 다른데 이를 담을 Concept이 없다.
- 관계(Order-취소시도)가 1:1이 아니라 1:N인데 flat하게 status 값 하나로만 표현했다.
- Refund 금액이 Payment.amount를 그대로 참조하면 이후 금액 변경에 영향을 받는다.

판단 기준(S03/S04에서 이미 배움)
- 이 Scenario를 현재 Static Model만으로 설명할 수 있는가?
- 반복되는 취소 요청 정보를 어디에 보존해야 하는가? (Order 1 → N CancellationRequest)
- 그 정보 중 확정 시점에 고정되어야 하는 값이 있는가? → snapshot 판단

최소 개선
CancellationRequest를 Concept으로 분리(Order 1 -- 0..* CancellationRequest),
CancellationRequest 1 -- 0..1 Refund, Refund.amount는 승인 시점 snapshot.

왜 개선됐는가
재시도(3~5번)를 CancellationRequest 여러 건으로 표현할 수 있고,
snapshot amount로 6번을 설명할 수 있다.

무엇은 바꾸지 않는가
Order/Payment의 기존 구조, Customer/Product 등 정상 running model은 그대로 둔다.
```

## Instructor Intervention (5~10분 후, 질문 형태로만)

- "이 Scenario를 지금 Static Model만으로 설명할 수 있는가?"
- "반복되는 취소 시도 정보는 어디에 보존해야 하는가?"
- "이 값은 지금 이 순간을 참조해야 하는가, 아니면 확정된 시점의 값을 보존해야 하는가?"

정답을 먼저 제공하지 않는다. 학습자가 스스로 S03의 Concept 식별·Multiplicity·snapshot 판단 기준을 떠올리게 한다.

## LLM 활용 방식

`LLM용 추천 프롬프트`

```text
이 Static Model로 Scenario 6번을 설명할 수 있는가? 설명할 수 없다면 어디가 부족한가?
내가 수정한 부분이 Concept/Attribute/Relationship/Multiplicity 중 무엇에 해당하는지 명확한가?
Method나 Responsibility 이름을 이 단계에서 앞당겨 사용한 부분이 있는가?
더 최소한의 수정으로 같은 문제를 해결할 수 있는가?
...
```

LLM에게 "정답 모델을 만들어라"라고 요청하지 않는다. 학습자가 먼저 수정한 뒤 누락·대안·정합성 검토 용도로만 사용한다.

## [별첨] 해설

```text
개선된 모델

Order 1 -------- 0..* CancellationRequest
CancellationRequest
--------------------------
requestedAt : DateTime
result      : RequestResult   (PENDING, FAILED, COMPLETED)

CancellationRequest 1 -------- 0..1 Refund
Refund
--------------------------
amount : Money     ← 승인 시점 snapshot
status : RefundStatus
```

해설 포인트:

- `CancellationRequest`는 Scenario가 반복 가능한 정보(시도 시각, 결과)를 담을 새 Concept의 부재를 드러낸 사례다. S03의 Concept 식별 판단(§12~§14)과 Multiplicity 판단(§21)을 새 문제에 재적용한 것이며, 관계는 `Order 1 → N CancellationRequest`로 충분하다. 새 규칙이 아니다.
- `Refund.amount`의 snapshot 판단은 S03 §23(`Product.price` vs `OrderItem.unitPrice`)과 정확히 같은 판단 기준이다.
- `Order`, `Payment`의 기존 구조는 변경하지 않았다 — 관련 없는 부분을 함께 재설계하지 않는다는 원칙을 지킨다.

---

# 7. [Exercise 2] Responsibility / Collaboration / Contract Refinement · 24분

**Owner:** S05, S06  
**사용하는 판단만:** Data-only Object/God Service 위험 신호, Information Expert, Creator, Controller 경계, Low Coupling, 객체의 자기 상태 관리, Object Contract(precondition/postcondition/invariant, success/failure consistency)

## 목적

Exercise 1에서 정리된 것과 같은 형태의 Static baseline 위에서, `[Before]` Candidate Design의 잘못된 Responsibility/Collaboration을 찾아 국소적으로 옮기고 Object Contract를 재확인한다.

## 입력 1 — 이미 정리된 Static Model (수정 대상 아님, Exercise 1의 결론과 동일한 형태를 제공)

```text
Order 1 -------- 0..* CancellationRequest
CancellationRequest 1 -------- 0..1 Refund
Refund
- amount (승인 시점 snapshot)
- status
```

## 입력 2 — `[Before]` Candidate Design (의도적으로 결함 있음)

```java
class CancelOrderController {
    void cancelOrder(Order order) {
        if (order.getStatus() == PLACED || order.getStatus() == PAID) {
            order.setStatus(CANCELLED);
            Refund refund = new Refund(order.getPayment().getAmount());
            refund.setStatus(REQUESTED);
            order.getRefunds().add(refund);
        }
        // else: 아무 것도 하지 않는다
    }
}
```

## 과제

1. 잘못된 Responsibility/Collaboration을 찾는다.
2. 올바른 owner를 판단한다(Information Expert / Creator / Controller 관점 중 현재 판단에 의미 있는 것만).
3. Collaboration을 최소한으로 수정한다.
4. 핵심 Message(`cancel()` 또는 동등한 Message)의 Object Contract — precondition/postcondition/**failure**/invariant를 재확인한다.
5. Refund/CancellationRequest의 내부 구조, snapshot 처리 등 관련 없는 부분은 바꾸지 않는다.

## 필수 산출물 (최소화)

```text
잘못된 Responsibility/Collaboration:

Before / After (success/failure/invariant 포함):

Responsibility 이동 이유:

변경하지 않은 부분:
```

## Facilitator Teaching Logic

```text
문제
Controller가 취소 가능 여부(domain rule)를 직접 판단하고
order.setStatus(...)로 상태를 외부에서 직접 바꾼다.
Controller가 order.getPayment().getAmount()를 직접 읽어 Refund를 만든다.
Precondition이 충족되지 않으면 아무 관찰 가능한 결과 없이 조용히 아무 일도 하지 않는다.

왜 문제인가
- 상태 전이 규칙의 owner가 Order가 아니라 Controller에 있어 변경이 여러 곳으로 퍼질 수 있다(S05).
- Refund 생성에 필요한 정보를 자연스럽게 아는 객체가 아닌 Controller가 정보를 끌어와 사용한다(S06 Information Expert 위반).
- 성공 경로만 계약이 있고 실패 경로의 postcondition/invariant가 없다(S06에서 이미 배운 success/failure consistency).

판단 기준(S05/S06에서 이미 배움)
- 이 상태를 누가 직접 관리해야 하는가?
- 이 정보를 자연스럽게 아는 객체는 누구인가?
- 실패 시에도 invariant가 깨지지 않는가?

최소 개선
Order.cancel()이 자신의 상태 전이를 스스로 판단·수행하고,
Order.requestRefund()가 Payment 금액을 이용해 Refund를 만들며,
Controller는 조정(coordination) 역할만 남긴다.

왜 개선됐는가
Responsibility owner와 Collaboration이 각 객체가 자연스럽게 아는 정보/상태와 일치하고,
실패 시에도 상태를 바꾸지 않는 것 자체가 invariant를 지킨다.

무엇은 바꾸지 않는가
CancellationRequest/Refund의 내부 구조, snapshot 판단,
Exercise 1에서 정리된 Static Model 관계.
```

## Instructor Intervention (5~10분 후, 질문 형태로만)

- "어떤 객체가 자신의 상태를 직접 관리해야 하는가?"
- "이 정보의 owner는 누구인가?"
- "실패했을 때 이 계약은 무엇을 보장하는가, 아니면 아무것도 보장하지 않는가?"

## LLM 활용 방식

`LLM용 추천 프롬프트`

```text
이 Responsibility를 수행하는 데 필요한 정보를 가장 자연스럽게 가진 객체는 누구인가?
Controller가 Domain Rule까지 소유하고 있는가?
실패 경로에서 이 계약이 여전히 지켜지는가?
다른 Responsibility 배치는 가능한가? GRASP 이름을 붙이지 말고 실제 근거로 반론하라.
...
```

## [별첨] 해설

```java
class Order {
    void cancel() {
        if (!isCancellable()) return;
        this.status = CANCELLED;
    }
    boolean isCancellable() { return status == PLACED || status == PAID; }
    Refund requestRefund() { return new Refund(payment.amount()); }
}

class CancelOrderController {
    void cancelOrder(Order order) {
        order.cancel();
        if (order.isCancelled()) {
            Refund refund = order.requestRefund();
            ...
        }
    }
}
```

핵심 Message Object Contract:

```text
Order.cancel()
Precondition : status가 PLACED 또는 PAID다.
Postcondition(success) : status가 CANCELLED로 바뀐다.
Failure      : precondition이 충족되지 않으면 status를 바꾸지 않는다.
Invariant    : cancel() 시도의 성공/실패와 무관하게 status는 항상 정의된 값 중 하나이며, 실패 시 이전 상태와 모순되지 않는다.
```

해설 포인트:

- 이 Before/After는 S06 §10의 Information Expert/Controller Before/After와 동일한 판단 언어를 새 문제에 적용한 것이다.
- Failure 항목은 S06에서 이미 보강된 성공/실패 일관성 판단(§6)을 그대로 재사용한다. 새로운 개념이 아니다.

---

# 8. [Exercise 3] Variation / Abstraction / Alternative Evaluation · 28분

**Owner:** S07, S08  
**사용하는 판단만:** Variation evidence 우선, variation이 기존 abstraction의 의미 경계와 일치하는지 확인, 현재 decision을 실제로 가르는 기준(Change Impact/Abstraction Cost가 우선 후보이며 필요할 때만 Coupling/Dependency 추가), SOLID/Pattern은 진단 언어로만, Trade-off, evidence 기반 재검토

이 Exercise는 앞의 두 Exercise보다 더 많은 배경(Order Cancellation/Refund 흐름 전체, S07/S08에서 이미 구축된 `PaymentGateway` 구조)을 동시에 고려한다.

## 목적

기존에 이미 만들어진(재교육하지 않는) `PaymentGateway` 구조 위에, 카드 결제 Provider 환불 처리라는 새로운 요구가 왔을 때 이 evidence가 `PaymentGateway`의 의미 경계와 일치하는지 먼저 확인한 뒤, 두 개의 동작 가능한 대안을 evidence 기반으로 비교하고 선택한다.

## 현재 Evidence (제공)

```text
카드 결제의 환불은 Provider API를 통해 처리해야 한다.
현재 카드 결제는 Provider A와 Provider B 두 곳을 실제로 사용 중이다.
두 Provider의 환불 API 요청/응답 형식이 다르다.

(계좌이체·포인트 환불은 이번 evidence의 범위가 아니다.
 이 판단은 PaymentMethod 차이가 아니라 같은 카드 결제 안의 Provider 차이다.)
```

## Alternative A — CardPayment에 Provider 직접 분기

```java
class CardPayment {
    RefundResult refund(Money amount) {
        if (provider == PROVIDER_A) return providerAClient.refund(amount);
        else if (provider == PROVIDER_B) return providerBClient.refund(amount);
    }
}
```

## Alternative B — 기존 PaymentGateway 확장(S07/S08에서 이미 구축된 구조 재사용)

```java
interface PaymentGateway {
    PaymentResult request(Money amount);
    RefundResult refund(Money amount);   // 기존 인터페이스 확장
}
class ProviderAGateway implements PaymentGateway { /* refund 구현 */ }
class ProviderBGateway implements PaymentGateway { /* refund 구현 */ }

class CardPayment {
    RefundResult refund(Money amount) { return gateway.refund(amount); }
}
```

## 과제

1. 현재 evidence가 어떤 variation인지 확인한다 — payment-method 차이인가, 같은 결제수단 안의 provider 차이인가.
2. 이 evidence가 기존 `PaymentGateway`가 다루는 의미 경계(provider 차이)와 일치하는지 확인한다.
3. 두 alternative가 모두 현재 요구를 동작 가능하게 만족함을 확인한다(Bad vs Good으로 만들지 않는다).
4. 두 대안 중 현재 evidence에서 결정을 실제로 가르는 기준은 무엇인가? 필요한 기준만 선택해 비교한다(모든 축을 다 채우지 않아도 된다).
5. Trade-off를 정리하고 하나를 선택한다.
6. 이 결정을 바꿀 수 있는 새로운 evidence를 최소 1개 제시한다.

## 필수 산출물 (최소화)

```text
현재 evidence:

Alternative A / B:

비교 기준(선택한 것만):

선택:

비용/Trade-off:

decision을 바꾸게 할 새로운 evidence:
```

## Facilitator Teaching Logic

```text
문제
카드 결제 환불이 Provider마다(A/B) API 형식이 다르다는 evidence가 왔다.
어디에 이 변화를 흡수할 것인가?

왜 문제인가
CardPayment에 Provider별 분기를 추가하면(A) 새 Provider가 추가될 때마다
CardPayment 핵심 코드를 계속 수정해야 한다.
반대로 PaymentGateway를 확장하면(B) interface 변경 비용이 든다.

판단 기준(S07/S08에서 이미 배움) — 순서대로 확인한다
1. 이 evidence는 payment-method 차이가 아니라
   같은 카드 결제 안의 provider 차이다
   → PaymentGateway가 다루는 의미 경계와 일치한다.
2. 이 abstraction은 이미 존재하는가, 새로 만드는가?
   (PaymentGateway는 S07/S08에서 이미 만들어졌고 그 비용은 이미 지불됐다)
3. 어느 쪽이 change impact를 더 국소화하는가?

최소 개선/선택
B: 의미 경계가 일치하는 기존 PaymentGateway를 확장한다.
새 abstraction을 만드는 것이 아니라 이미 지불된 abstraction의 재사용이므로
추가 비용이 A 대비 낮다.

왜 개선됐는가
Provider별 환불 차이를 Gateway 구현체 안에 국소화하고
CardPayment 핵심 코드는 새 Provider가 추가돼도 수정 범위가 줄어든다.

무엇은 바꾸지 않는가
Order/CancellationRequest/Refund의 책임 배치(Exercise 2 결과),
PaymentMethod 구조(Card/BankTransfer/Point 자체는 건드리지 않는다).
```

## 결정을 바꿀 수 있는 evidence(예시, 학습자가 직접 판단)

```text
만약 실제로는 Provider가 하나뿐이고
추가 Provider 계획도 없다면,
B의 interface 확장 비용은 정당화되지 않을 수 있다.
그 경우 A가 더 경제적인 선택일 수 있다.
```

## Instructor Intervention (5~10분 후, 질문 형태로만)

- "이 evidence는 PaymentGateway가 다루는 경계(provider 차이)와 같은 종류인가?"
- "이 변화가 실제로 두 번째 사례인가, 상상한 미래인가?"
- "이 abstraction의 비용은 이미 지불됐는가, 지금 새로 지불하는가?"

## LLM 활용 방식

`LLM용 추천 프롬프트`

```text
내 선택에 대한 가장 강한 반론을 제시하라.
내 판단에서 evidence 없이 가정한 부분을 찾아라.
더 단순한 대안으로 충분한지 검토하라.
Pattern이나 SOLID 이름 자체를 근거로 사용한 부분이 있는지 찾아라.
...
```

## [별첨] 해설 — 대표 판단

```text
선택: Alternative B

핵심 근거
1. 이 evidence는 payment-method 차이가 아니라 같은 카드 결제 안의
   provider 차이이며, PaymentGateway가 다루는 의미 경계와 일치한다.
2. 실제로 Provider A/B 두 곳이 존재하고 API 형식이 다르다.
3. PaymentGateway 추상화는 이미 S07/S08에서 만들어져 그 비용을 지불했다.
4. 새 Provider 추가 시 CardPayment 핵심 코드 수정 범위가 줄어든다.

Alternative A의 장점
- 지금 당장은 더 단순하다.
- 새 interface 변경이 없다.

현재 판단
- 지금은 B를 선택한다.
- Provider가 하나뿐이고 추가 계획이 없다는 evidence가 확인되면
  A도 유효한 선택이 될 수 있다.
```

---

# 9. Feedback 기준 (Workshop 공통)

1. 학습자가 각 Exercise에서 사용한 판단이 실제로 해당 owner session(S03/S04, S05/S06, S07/S08)의 것인가?
2. 새로운 개념을 스스로 만들어내거나 LLM이 제안한 새 개념을 근거 없이 채택하지 않았는가?
3. 문제 하나를 발견하고 전체 모델을 다시 설계하지 않았는가?
4. Before/After가 필요한 곳에서 실제 판단 논리(문제→왜 문제인가→기준→개선→왜 개선됐는가)가 드러나는가?
5. Pattern/SOLID 이름이 정답이나 checklist로 사용되지 않았는가?
6. evidence/trade-off/cost가 실제 선택 근거로 사용됐는가?
7. 정상 Running Model과 이번 Workshop Candidate Model을 혼동하지 않았는가?
8. "무엇을 바꾸지 않았는가"를 각 Exercise마다 명시했는가?

---

# 10. Failure Conditions

- Exercise 1에서 Method/Responsibility/GRASP/Contract를 앞당겨 판단한다.
- Exercise 2에서 새로운 Concept/Attribute/Relationship 문제를 다시 연다(Exercise 1의 범위를 재론한다).
- Exercise 3에서 GRASP 기본 5개나 GoF Pattern을 처음부터 다시 설명한다.
- 어느 Exercise든 "Bad Model → Good Model" 하나만 만들고 다른 대안을 비교하지 않는다.
- 문제를 하나 발견했다고 CancellationRequest/Refund/Order 전체 구조를 처음부터 다시 그린다.
- 정상 Order running model을 이 Workshop의 결함 예시로 사용한다.
- Facilitator가 실습 시작과 동시에 정답이나 추천 prompt부터 제공한다.
- LLM에게 "정답 모델을 만들어라"라고 요청한다.
- Architecture/DDD/AI-Native/framework 구현/DB physical design으로 논의가 확장된다.

---

# 11. Session Summary

```text
Exercise 1 (S03/S04)
Flawed Static Model → Scenario → 설명 안 되는 지점 발견
→ Concept/Relationship/Multiplicity/snapshot 최소 수정 → 재확인
        ↓
Exercise 2 (S05/S06)
Candidate Design → 잘못된 Responsibility/Collaboration 발견
→ owner 재판단 → Collaboration 수정 → Object Contract(success/failure) 재확인
        ↓
Exercise 3 (S07/S08)
Evidence → 기존 abstraction과의 의미 경계 확인 → 두 Alternative
→ 결정을 실제로 가르는 기준만 비교 → Trade-off → Decision → 새 evidence로 재검토 가능성 확인
```

핵심 Claim:

> **Find the problem → Identify the relevant judgment → Refine locally → Re-check → Stop.**

> **S09는 새 개념을 가르치는 자리가 아니라 이미 배운 판단을 새 문제에 결합·적용하는 자리다.**

> **한 문제를 발견했다고 전체 모델을 다시 설계하지 않는다.**

> **Design Decision은 한 번 내리면 끝나는 것이 아니라 evidence가 바뀌면 다시 열릴 수 있다.**

---

# 12. S10 Handoff

S09까지 Requirement·Analysis·Object Design·change response·alternative evaluation을 하나의 OOAD 판단으로 통합했다.

다음 질문:

> **이 OOAD 결과는 실제 개발에서 어떻게 자연스럽게 Code로 구체화되고, 개발 중 검증과 Commit 이후 통합 검증을 거쳐 운영 이관까지 어떻게 이어지는가?**

S09는 OOAD Core를 여기서 마무리한다. Design Decision은 구현 중 evidence에 의해 다시 열릴 수 있으며, 문제가 발견되면 Code에 국한할지 Requirement·Analysis·Architecture·Design 수준까지 다시 판단할지 결정한다. 실제 산출물을 항상 갱신한다는 뜻은 아니지만, 필요한 경우 해당 수준의 사고와 판단은 반복한다.

S10이 소유할 다음 내용은 여기서 먼저 가르치지 않는다.

- Model → Code Mapping
- 구현 중 Feedback 범위(Code / Design / Analysis / Architecture 중 어디까지 재판단할지)
- 개발 중 Test(Debugging/Developer Test/Local Regression 포함)와 Commit 이후 Test/Verification의 구분
- TDD와 Red → Green → Refactor
- Refactoring과 Rework의 경계
- Why CI / Why CD와 CI/CD 전제조건
- CI Quality Gate가 확인하는 품질 관점과 대표 도구 예시
- DevOps의 flow·feedback·shared responsibility·culture positioning

→ **S10. OOAD Next Step ① — 개발·검증·DevOps**
