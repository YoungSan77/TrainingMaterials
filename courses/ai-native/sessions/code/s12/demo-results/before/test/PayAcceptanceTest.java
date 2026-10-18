// "04. 수용 기준과 검증 가능한 작업 단위" — 사람이 쓴 주문한다의 수용 테스트. 에이전트는 기대값을 바꾸지 않는다.
// 실행(code/s04/order에서): ./run-tests.sh
package test;

import static org.junit.jupiter.api.Assertions.*;

import java.util.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import delivery.*;
import order.*;
import payment.*;
import product.*;

class PayAcceptanceTest {
    // 주문 — 펜 2개, 판매가 1,000원, 주문 금액 2,000원, 배송지 서울. 외부 시스템은 테스트 대역이다.
    final Product pen = new Product(new ProductNumber("P-PEN"), new Money(1_000));
    final Order order = new Order(new OrderNumber("O-1"),
            List.of(OrderItem.confirm(pen, new Quantity(2))), new Address("서울"));
    final FakePayment payment = new FakePayment();
    final FakeDelivery delivery = new FakeDelivery();
    final OrderService service = new OrderService(new FakeOrders(order), payment, delivery);

    @Test @DisplayName("승인되면 결제완료이고 배송을 1건 요청한다")
    void approved() {
        service.pay(order.number(), new PaymentMethod("카드 X"));

        assertEquals(OrderStatus.PAID, order.status());
        assertEquals(1, delivery.requests);
    }

    @Test @DisplayName("판매가가 1,200원으로 바뀌어도 2,000원의 승인을 요청한다")
    void salePriceChanged() {
        // Given — 펜 2개 주문(위의 준비), 판매가가 1,200원으로 바뀌었다
        pen.changeSalePrice(new Money(1_200));
        // When — 카드로 결제한다
        service.pay(order.number(), new PaymentMethod("카드 X"));
        // Then — 2,000원의 승인을 요청한다
        assertEquals(List.of(new Money(2_000)), payment.requestedAmounts);
    }

    @Test @DisplayName("거절되면 결제대기로 남고 배송을 요청하지 않는다")
    void rejected() {
        payment.reject("카드 X");

        service.pay(order.number(), new PaymentMethod("카드 X"));

        assertEquals(OrderStatus.PENDING_PAYMENT, order.status());
        assertEquals(new Money(2_000), order.totalAmount());
        assertEquals(0, delivery.requests);
    }

    @Test @DisplayName("거절 뒤 다른 카드로 승인되면 결제완료다")
    void paidWithAnotherCard() {
        payment.reject("카드 X");

        service.pay(order.number(), new PaymentMethod("카드 X"));
        service.pay(order.number(), new PaymentMethod("카드 Y"));

        assertEquals(OrderStatus.PAID, order.status());
        assertEquals(1, delivery.requests);
    }

    // 테스트 대역 — 결제 시스템은 거절할 카드만 거절한다
    static class FakePayment implements PaymentGateway {
        final Set<String> rejectedCards = new HashSet<>();
        final List<Money> requestedAmounts = new ArrayList<>();

        void reject(String card) { rejectedCards.add(card); }

        public boolean requestApproval(Money amount, PaymentMethod method) {
            requestedAmounts.add(amount);
            return !rejectedCards.contains(method.value());
        }
    }

    static class FakeDelivery implements DeliveryGateway {
        int requests;

        public void requestDelivery(String orderNumber, Address shippingAddress) { requests++; }
    }

    record FakeOrders(Order order) implements OrderRepository {
        public Order findBy(OrderNumber number) { return order; }
        public void save(Order o) {}
    }
}
