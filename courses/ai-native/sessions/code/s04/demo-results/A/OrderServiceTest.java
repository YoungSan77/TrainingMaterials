package order;

import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import delivery.Address;
import delivery.DeliveryGateway;
import payment.Money;
import payment.PaymentGateway;
import payment.PaymentMethod;
import product.Product;
import product.ProductNumber;

class OrderServiceTest {
    private static final OrderNumber ORDER_NUMBER = new OrderNumber("O-1");
    private static final Address ADDRESS = new Address("서울시 중구 1");
    private static final PaymentMethod CARD_X = new PaymentMethod("카드 X");
    private static final PaymentMethod CARD_Y = new PaymentMethod("카드 Y");

    private FakeOrderRepository repository;
    private FakePaymentGateway paymentGateway;
    private SpyDeliveryGateway deliveryGateway;
    private OrderService service;
    private Product pen;

    @BeforeEach
    void setUp() {
        repository = new FakeOrderRepository();
        paymentGateway = new FakePaymentGateway();
        deliveryGateway = new SpyDeliveryGateway();
        service = new OrderService(repository, paymentGateway, deliveryGateway);

        // 펜 2개, 판매가 1,000원으로 주문이 생긴다.
        pen = new Product(new ProductNumber("P-PEN"), new Money(1_000));
        repository.save(new Order(ORDER_NUMBER, List.of(OrderItem.confirm(pen, new Quantity(2))), ADDRESS));
    }

    @Test
    @DisplayName("결제 직전에 판매가가 1,200원이 되어도 주문 금액 2,000원으로 승인을 요청한다")
    void requestsApprovalWithAmountFixedAtOrderTime() {
        pen.changeSalePrice(new Money(1_200));
        paymentGateway.approve(CARD_X);

        service.pay(ORDER_NUMBER, CARD_X);

        assertEquals(List.of(new Money(2_000)), paymentGateway.requestedAmounts);
    }

    @Test
    @DisplayName("승인되면 결제완료가 되고 배송을 1건 요청한다")
    void approvedPaymentMarksPaidAndRequestsDelivery() {
        paymentGateway.approve(CARD_X);

        service.pay(ORDER_NUMBER, CARD_X);

        assertEquals(OrderStatus.PAID, repository.findBy(ORDER_NUMBER).status());
        assertEquals(List.of("O-1 -> 서울시 중구 1"), deliveryGateway.requests);
    }

    @Test
    @DisplayName("거절되면 결제대기로 남고 배송을 요청하지 않는다")
    void rejectedPaymentStaysPendingWithoutDelivery() {
        service.pay(ORDER_NUMBER, CARD_X);

        assertEquals(OrderStatus.PENDING_PAYMENT, repository.findBy(ORDER_NUMBER).status());
        assertTrue(deliveryGateway.requests.isEmpty());
    }

    @Test
    @DisplayName("카드 X가 거절된 뒤 카드 Y로 다시 결제해 승인되면 결제완료가 된다")
    void retryWithAnotherCardAfterRejection() {
        paymentGateway.approve(CARD_Y);

        service.pay(ORDER_NUMBER, CARD_X);
        assertEquals(OrderStatus.PENDING_PAYMENT, repository.findBy(ORDER_NUMBER).status());

        service.pay(ORDER_NUMBER, CARD_Y);
        assertEquals(OrderStatus.PAID, repository.findBy(ORDER_NUMBER).status());
        assertEquals(1, deliveryGateway.requests.size());
    }

    @Test
    @DisplayName("이미 결제완료된 주문은 승인을 다시 요청하지 않는다")
    void paidOrderIsNotChargedAgain() {
        paymentGateway.approve(CARD_X);
        service.pay(ORDER_NUMBER, CARD_X);

        assertThrows(IllegalStateException.class, () -> service.pay(ORDER_NUMBER, CARD_X));
        assertEquals(1, paymentGateway.requestedAmounts.size());
        assertEquals(1, deliveryGateway.requests.size());
    }

    static class FakeOrderRepository implements OrderRepository {
        private final Map<OrderNumber, Order> orders = new HashMap<>();

        @Override public Order findBy(OrderNumber number) { return orders.get(number); }
        @Override public void save(Order order) { orders.put(order.number(), order); }
    }

    // 승인할 결제 수단으로 등록한 것만 승인하고, 요청 금액을 기록한다.
    static class FakePaymentGateway implements PaymentGateway {
        private final Set<PaymentMethod> approvable = new HashSet<>();
        final List<Money> requestedAmounts = new ArrayList<>();

        void approve(PaymentMethod method) { approvable.add(method); }

        @Override
        public boolean requestApproval(Money amount, PaymentMethod method) {
            requestedAmounts.add(amount);
            return approvable.contains(method);
        }
    }

    static class SpyDeliveryGateway implements DeliveryGateway {
        final List<String> requests = new ArrayList<>();

        @Override
        public void requestDelivery(String orderNumber, Address shippingAddress) {
            requests.add(orderNumber + " -> " + shippingAddress.value());
        }
    }
}
