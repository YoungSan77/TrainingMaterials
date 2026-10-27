package order;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import product.Money;
import product.ProductGateway;
import product.ProductNumber;

class OrderApplicationServiceTest {

    @Test
    @DisplayName("주문이 생길 때의 판매가를 단가로 확정하고 총액을 계산한다")
    void savesPendingPaymentOrderWithFixedSalePriceAndTotalAmount() {
        ProductNumber pen = new ProductNumber("pen");
        InMemoryProductGateway productGateway = new InMemoryProductGateway(Map.of(pen, Money.won(1_000)));
        InMemoryOrderRepository orderRepository = new InMemoryOrderRepository();
        OrderApplicationService service = new OrderApplicationService(orderRepository, productGateway);

        OrderNumber orderNumber = new OrderNumber("order-1");
        Address address = new Address("Seoul");
        CreateOrderResult result = service.createOrder(new CreateOrderCommand(
            orderNumber,
            List.of(new OrderItemRequest(pen, new Quantity(2))),
            address
        ));

        Order saved = orderRepository.findBy(orderNumber);
        assertEquals(saved, result.order(), "저장한 주문을 그대로 돌려준다");
        assertEquals(OrderStatus.PENDING_PAYMENT, saved.status(), "새 주문의 상태");
        assertEquals(address, saved.shippingAddress(), "배송지");
        assertEquals(1, saved.items().size(), "항목 수");
        assertEquals(Money.won(1_000), saved.items().get(0).unitPrice(), "확정 단가");
        assertEquals(new Quantity(2), saved.items().get(0).quantity(), "수량");
        assertEquals(Money.won(2_000), saved.totalAmount(), "주문 금액");
        assertEquals(1, productGateway.calls(), "판매가 조회 횟수");
    }

    @Test
    @DisplayName("주문 뒤 판매가가 올라도 확정 단가와 주문 금액은 그대로다")
    void keepsFixedValuesWhenCurrentSalePriceChanges() {
        ProductNumber pen = new ProductNumber("pen");
        InMemoryProductGateway productGateway = new InMemoryProductGateway(new HashMap<>(Map.of(pen, Money.won(1_000))));
        InMemoryOrderRepository orderRepository = new InMemoryOrderRepository();
        OrderApplicationService service = new OrderApplicationService(orderRepository, productGateway);

        Order order = service.createOrder(new CreateOrderCommand(
            new OrderNumber("order-2"),
            List.of(new OrderItemRequest(pen, new Quantity(2))),
            new Address("Seoul")
        )).order();
        productGateway.changeSalePrice(pen, Money.won(1_200));

        assertEquals(Money.won(1_000), order.items().get(0).unitPrice(), "판매가 변경 뒤의 확정 단가");
        assertEquals(Money.won(2_000), order.totalAmount(), "판매가 변경 뒤의 주문 금액");
    }

    @Test
    @DisplayName("주문 생성의 사전조건을 어긴 입력을 거절한다")
    void rejectsInvalidOrderCreationPreconditions() {
        assertThrows(IllegalArgumentException.class, () -> new Quantity(0), "수량은 1 이상이다");
        assertThrows(IllegalArgumentException.class, () -> Money.won(-1), "금액은 0 이상이다");
        assertThrows(IllegalArgumentException.class, () -> new CreateOrderCommand(
            new OrderNumber("order-3"), List.of(), new Address("Seoul")
        ), "주문에는 항목이 하나 이상 있다");
        assertThrows(NullPointerException.class, () -> new CreateOrderCommand(
            new OrderNumber("order-4"),
            List.of(new OrderItemRequest(new ProductNumber("pen"), new Quantity(1))),
            null
        ), "배송지가 있어야 한다");

        OrderApplicationService service = new OrderApplicationService(
            new InMemoryOrderRepository(), new InMemoryProductGateway(Map.of())
        );
        assertThrows(IllegalStateException.class, () -> service.createOrder(new CreateOrderCommand(
            new OrderNumber("order-5"),
            List.of(new OrderItemRequest(new ProductNumber("unavailable"), new Quantity(1))),
            new Address("Seoul")
        )), "판매가를 조회할 수 있어야 한다");
    }

    private static final class InMemoryOrderRepository implements OrderRepository {
        private final Map<OrderNumber, Order> orders = new HashMap<>();

        @Override
        public Order findBy(OrderNumber orderNumber) {
            return orders.get(orderNumber);
        }

        @Override
        public void save(Order order) {
            orders.put(order.orderNumber(), order);
        }
    }

    private static final class InMemoryProductGateway implements ProductGateway {
        private final Map<ProductNumber, Money> salePrices;
        private int calls;

        private InMemoryProductGateway(Map<ProductNumber, Money> salePrices) {
            this.salePrices = new HashMap<>(salePrices);
        }

        @Override
        public Money findCurrentSalePrice(ProductNumber productNumber) {
            calls++;
            return salePrices.get(productNumber);
        }

        private void changeSalePrice(ProductNumber productNumber, Money salePrice) {
            salePrices.put(productNumber, salePrice);
        }

        private int calls() {
            return calls;
        }
    }
}
