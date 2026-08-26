# Shared Case — Order

## Status and Consumers

Order는 OOAD, DDD와 MSA가 서로 다른 판단을 연습할 때 사용하는 공통 사례다. 이 문서는 세 과정이 공유하는 최소 vocabulary, 상태와 규칙만 소유하며 과정별 설계 결론은 소유하지 않는다. Curriculum은 해당 과정의 Course Design이 Order 사례를 실제 학습 흐름에 사용할 때만 이 문서를 Common Standard로 선택한다.

## Shared Vocabulary

- Order: 고객의 주문
- OrderLine: 상품과 수량
- Payment: 결제 결과
- Shipment: 배송 처리

## State

```text
CREATED → PAID → SHIPPED
   └────→ CANCELLED
PAID ───→ CANCELLED
```

## Rules

- Order는 한 개 이상의 OrderLine을 가진다.
- 수량은 양수다.
- 결제된 Order만 배송할 수 있다.
- CREATED 또는 PAID 상태에서만 취소할 수 있다.
- SHIPPED 또는 CANCELLED 상태에서는 취소할 수 없다.
- 취소된 Order는 결제·배송할 수 없다.

## Course Questions

- OOAD: 이 상태와 규칙을 어떤 객체 책임·협력·계약으로 국소화할 것인가?
- DDD: 어떤 규칙이 불변식이며 어떤 일관성 경계가 필요한가?
- MSA: 분산이 필요하다면 서비스·데이터 소유와 consistency/failure를 어떻게 설계할 것인가?

각 과정은 이 규칙을 바꾸지 않는다. 다른 사례나 추가 규칙이 필요하면 Course Design이 소유한다.
