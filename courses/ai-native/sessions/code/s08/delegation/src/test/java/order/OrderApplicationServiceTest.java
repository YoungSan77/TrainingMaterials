package order;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import product.Money;
import product.ProductGateway;
import product.ProductNumber;

public final class OrderApplicationServiceTest {
    public static void main(String[] args) {
        run("saves a PENDING_PAYMENT order with the accepted price and total", OrderApplicationServiceTest::savesPendingPaymentOrderWithFixedSalePriceAndTotalAmount);
        run("keeps the fixed price and total after the sale price changes", OrderApplicationServiceTest::keepsFixedValuesWhenCurrentSalePriceChanges);
        run("rejects inputs that break order-creation preconditions", OrderApplicationServiceTest::rejectsInvalidOrderCreationPreconditions);
        System.out.println("OrderApplicationServiceTest passed");
    }

    private static void savesPendingPaymentOrderWithFixedSalePriceAndTotalAmount() {
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
        assertEquals(saved, result.order(), "saved order must be returned");
        assertEquals(OrderStatus.PENDING_PAYMENT, saved.status(), "new order status");
        assertEquals(address, saved.shippingAddress(), "shipping address");
        assertEquals(1, saved.items().size(), "item count");
        assertEquals(Money.won(1_000), saved.items().get(0).unitPrice(), "fixed unit price");
        assertEquals(new Quantity(2), saved.items().get(0).quantity(), "quantity");
        assertEquals(Money.won(2_000), saved.totalAmount(), "total amount");
        assertEquals(1, productGateway.calls(), "sale price lookup count");
    }

    private static void keepsFixedValuesWhenCurrentSalePriceChanges() {
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

        assertEquals(Money.won(1_000), order.items().get(0).unitPrice(), "unit price after price change");
        assertEquals(Money.won(2_000), order.totalAmount(), "total amount after price change");
    }

    private static void rejectsInvalidOrderCreationPreconditions() {
        assertThrows(IllegalArgumentException.class, () -> new Quantity(0), "quantity must be positive");
        assertThrows(IllegalArgumentException.class, () -> Money.won(-1), "money must be non-negative");
        assertThrows(IllegalArgumentException.class, () -> new CreateOrderCommand(
            new OrderNumber("order-3"), List.of(), new Address("Seoul")
        ), "order must contain an item");
        assertThrows(NullPointerException.class, () -> new CreateOrderCommand(
            new OrderNumber("order-4"),
            List.of(new OrderItemRequest(new ProductNumber("pen"), new Quantity(1))),
            null
        ), "shipping address must be present");

        OrderApplicationService service = new OrderApplicationService(
            new InMemoryOrderRepository(), new InMemoryProductGateway(Map.of())
        );
        assertThrows(IllegalStateException.class, () -> service.createOrder(new CreateOrderCommand(
            new OrderNumber("order-5"),
            List.of(new OrderItemRequest(new ProductNumber("unavailable"), new Quantity(1))),
            new Address("Seoul")
        )), "current sale price must be available");
    }

    private static void run(String name, Runnable test) {
        test.run();
        System.out.println("PASS: " + name);
    }

    private static void assertEquals(Object expected, Object actual, String message) {
        if (!expected.equals(actual)) {
            throw new AssertionError(message + ": expected=" + expected + ", actual=" + actual);
        }
    }

    private static void assertThrows(Class<? extends Throwable> type, Runnable action, String message) {
        try {
            action.run();
        } catch (Throwable throwable) {
            if (type.isInstance(throwable)) {
                return;
            }
            throw new AssertionError(message + ": unexpected exception " + throwable, throwable);
        }
        throw new AssertionError(message + ": expected " + type.getSimpleName());
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
