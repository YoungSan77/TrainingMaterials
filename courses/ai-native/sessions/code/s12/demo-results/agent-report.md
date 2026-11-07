I built the three remaining units (approval, decline, repayment) and `./gradlew check` is green. Each of the four acceptance criteria has its own test, and all four pass. I didn't touch any docs, existing tests or `build.gradle.kts`.

## 1. Files

**Created**
- `src/main/java/order/OrderPaymentService.java` — the payment flow. It sends the approval request using the order's fixed amount, without looking up the sale price again. On approval it marks the order paid, saves it, then sends one delivery request. On decline it leaves the order as it is and sends no delivery request.
- `src/main/java/order/OrderPaymentUseCase.java` — the entry point for paying an order.
- `src/main/java/order/PayOrderCommand.java` — the order number and the card. The card field is named `paymentMethod`, matching the glossary.
- `src/main/java/order/PayOrderResult.java` — the order plus the approval result.
- `src/test/java/order/OrderPaymentServiceTest.java` — four tests, one per acceptance criterion.

**Changed**
- `src/main/java/order/Order.java` — added `approvePayment()`, the only status change the docs allow here (pending payment → paid).

I put payment in a separate service instead of extending `OrderApplicationService`. The existing test uses that class's 2-argument constructor, and I'm not allowed to change that test.

## 2. Actual output of `./gradlew check`

```
> Task :compileJava
> Task :processResources NO-SOURCE
> Task :classes

> Task :coupling
결합도 — 가장 많이 아는 클래스 다섯
  order.OrderPaymentService              15
  order.OrderApplicationService          13
  order.Order                            6
  order.OrderItem                        4
  order.CreateOrderCommand               3

> Task :dependencyRules
의존 규칙 통과: 업무의 연동·영속 의존 없음, 업무 간 허용 목록 준수

> Task :compileTestJava
> Task :processTestResources NO-SOURCE
> Task :testClasses

> Task :test

OrderApplicationServiceTest > 주문 뒤 판매가가 올라도 확정 단가와 주문 금액은 그대로다 PASSED

OrderApplicationServiceTest > 주문이 생길 때의 판매가를 단가로 확정하고 총액을 계산한다 PASSED

OrderApplicationServiceTest > 주문 생성의 사전조건을 어긴 입력을 거절한다 PASSED

OrderPaymentServiceTest > 결제 직전에 판매가가 1,200원이 되어도 승인 요청 금액은 2,000원이다 PASSED

OrderPaymentServiceTest > 거절된 주문을 다른 카드로 다시 결제해 승인되면 결제완료가 되고 배송 요청은 총 1회다 PASSED

OrderPaymentServiceTest > 결제대기 주문이 승인되면 결제완료가 되고 배송 요청이 1회 나간다 PASSED

OrderPaymentServiceTest > 결제가 거절되면 주문은 결제대기로 남고 배송 요청은 0회다 PASSED

> Task :check

BUILD SUCCESSFUL in 1s
5 actionable tasks: 5 executed
Consider enabling configuration cache to speed up this build: https://docs.gradle.org/9.8.2/userguide/configuration_cache_enabling.html
```

The new `OrderPaymentService` now has the highest coupling count (15). The check treats this as a signal, not a pass/fail line, but it's worth knowing.

## 3. Questions — the docs don't decide these, so I stopped

1. **What should happen when the payment result is "unconfirmed" (neither approved nor declined)?** For now the code just throws an error, which says the handling isn't decided. It doesn't change the order or send a delivery request, and no test covers this case. I need to know: should the order stay pending, should we retry, or should we check the status again later?
2. **What should happen when the delivery request fails after approval?** The code saves the order as paid first, then sends the delivery request, and lets any failure through without recovery. That follows the rules doc's statement that the order is "already paid" by then. I didn't build a cancel, retry or notification step. Which of these should we use?
3. **Can you confirm what happens when an order is missing or isn't pending payment?** I treated both as errors and send no approval request. That reflects my reading of the state machine doc, which allows payment only from pending payment. Is that the intended behaviour?

`features.json` still says "3 tests PASSED". It isn't under `docs/`, but it looks like a record, so I left it alone; it now needs to say 7.