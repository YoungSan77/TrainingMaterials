# 주문 금액·단가 규칙 심사 결과

판정은 보여 주신 코드 안에서만 내렸습니다. 다음 코드는 없어서 보지 못했습니다.
- `Order`의 생성자와 다른 메서드
- `Money`
- `CreateOrderResult`
- `OrderRepository`의 저장·복원 방식

## 1. 주문 금액을 정하는 곳이 한 군데인가 — **통과**

- **금액을 정하는 곳:** `order/Order.java`의 `Order.create` 한 곳뿐입니다.
  ```java
  Money totalAmount = items.stream()
      .map(OrderItem::subtotal)
      .reduce(Money.won(0), Money::add);
  ```
- **항목별 계산:** `order/OrderItem.java`의 `subtotal()`(`unitPrice.multiply(quantity.value())`)이 맡습니다. 이것은 위 합산의 일부라서 둘째 결정 지점이 아닙니다.
- **응용 서비스:** `OrderApplicationService.createOrder`는 금액을 계산하지 않습니다. 가격이 붙은 항목을 넘기기만 합니다.
- **보지 못한 위험:** `CreateOrderResult`나 저장소 복원 코드가 금액을 다시 합산하면 이 판정이 바뀝니다.

## 2. 단가가 주문 시점에 확정되는가 — **통과**

- **확정 시점:** `OrderApplicationService.createOrder`에서 `productGateway.findCurrentSalePrice(item.productNumber())`로 판매가를 한 번만 읽습니다. 그 값으로 `new PricedOrderItem(item.productNumber(), item.quantity(), salePrice)`를 만듭니다. 여기서 주문 시점의 값이 붙습니다.
- **값 보존:** `OrderItem.from`이 `item.unitPrice()`를 불변 record인 `OrderItem.unitPrice`로 복사합니다. 주문 금액도 `Order`의 `private final Money totalAmount` 필드에 생성할 때 고정됩니다.
- **판매가 재조회:** 생성 이후에는 `Order`·`OrderItem`이 `ProductGateway`를 참조하지 않습니다. 그래서 나중에 판매가가 바뀌어도 이 값들은 변하지 않습니다.
- **전제:** `Money`가 불변이어야 합니다. 저장소가 복원할 때 판매가를 다시 조회하지 않아야 합니다.

## 3. 판매가와 단가를 다른 이름으로 구별하는가 — **통과(참고 한 건)**

- **판매가:** `ProductGateway.findCurrentSalePrice`와 지역 변수 `salePrice`를 씁니다. 상품 쪽의 현재 가격입니다.
- **단가:** `PricedOrderItem.unitPrice`, `OrderItem.unitPrice`를 씁니다. 주문에 확정된 값입니다.
- **주문 금액:** `totalAmount`를 쓰고, 항목 금액은 `subtotal`입니다.
- **결론:** 식별자 가운데 한 이름이 판매가와 단가를 함께 가리키는 곳은 없습니다.
- **참고:** `PricedOrderItem`의 주석 `"An order item with the sale price fixed at order creation."`은 단가의 정의를 풀어 쓴 문장입니다. 그래서 규칙 위반은 아닙니다. 다만 필드 이름(`unitPrice`)이 아니라 "sale price"로 설명하고 있습니다. 그래서 이 필드를 판매가로 읽을 여지가 있습니다. 판매가가 단가로 바뀌는 곳도 위치 인자 `salePrice` → `unitPrice` 하나뿐이라 코드에 드러나지 않습니다.
  - 고칠 방향: 주석을 "unit price — the sale price fixed at order creation"처럼 단가라는 이름을 먼저 쓰도록 바꿉니다.

## 전체 판정

**세 항목 모두 통과입니다.** 주문 금액은 `Order.create` 한 곳에서 정해지고, 단가는 주문 시점에 확정됩니다. 판매가(`salePrice`)와 단가(`unitPrice`)도 이름으로 구별됩니다. 다듬을 곳은 `PricedOrderItem` 주석의 표현 하나뿐입니다.