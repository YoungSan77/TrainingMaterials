## 01. 조건과 대표 예

**문서 형식 — 10pt**

- `salePrice`, `unitPrice`, `totalAmount`는 원 단위의 0 이상 정수다.
- `quantity`는 1 이상의 정수다.
- 하나의 `Order`에는 `OrderItem`이 1개 이상 있고 `shippingAddress`가 존재한다.
- 유효한 주문에서는 다음 합계 등식이 항상 성립한다.

  ```text
  Order.totalAmount
  = Σ(OrderItem.unitPrice × OrderItem.quantity)
  ```

- `unitPrice`는 장바구니에 담은 시점이 아니라 `Order` 생성 시점의 해당 `Product.salePrice`로 확정된다.
- 생성 이후 현재 `salePrice`가 변경되어도 기존 `unitPrice`와 `totalAmount`는 변하지 않는다.
- `PENDING_PAYMENT`인 기존 주문에서는 주문 항목의 구성, 각 항목의 `quantity`와 `unitPrice`, `shippingAddress`가 변경되지 않는다.

대표 주문과 판매가 변경 전후는 다음과 같다.

| 값 | 주문 생성 직후 | 판매가 변경 후 |
|---|---:|---:|
| 상품 | 펜 | 펜 |
| `OrderItem` 수 | 1 | 1 |
| `Product.salePrice` | 1,000원 | 1,200원 |
| `OrderItem.unitPrice` | 1,000원 | 1,000원 |
| `OrderItem.quantity` | 2 | 2 |
| `Order.totalAmount` | 2,000원 | 2,000원 |
| `Order.shippingAddress` | 서울 | 서울 |

생성 시점에는 `unitPrice = salePrice = 1,000원`이고, `totalAmount = 1,000원 × 2 = 2,000원`이다. 이후 현재 판매가가 1,200원으로 바뀌어도 기존 주문은 확정 단가 1,000원과 총액 2,000원을 유지한다.
