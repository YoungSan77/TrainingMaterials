// "12. 명세·맥락·작업 지시의 종합 검토" — 사람이 쓴 "주문을 취소한다"의 수용 테스트.
// 기대값은 업무 담당자가 정한 것이며 에이전트는 바꾸지 않는다.
// 실행(code/s12/order에서): ./run-tests.sh
package test;

import static org.junit.jupiter.api.Assertions.*;

import java.util.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import delivery.*;
import order.*;
import payment.*;
import product.*;

class CancelAcceptanceTest {
    // 주문 — 펜 2개, 판매가 1,000원, 주문 금액 2,000원, 배송지 서울
    final Product pen = new Product(new ProductNumber("P-PEN"), new Money(1_000));
    final Order order = new Order(new OrderNumber("O-1"),
            List.of(OrderItem.confirm(pen, new Quantity(2))), new Address("서울"));
    final FakePayment payment = new FakePayment();
    final FakeDelivery delivery = new FakeDelivery();
    final OrderService service = new OrderService(new FakeOrders(order), payment, delivery);

    @Test @DisplayName("결제완료 주문을 취소하면 취소됨이다")
    void cancelPaidOrder() {
        service.pay(order.number(), new PaymentMethod("카드 X"));

        service.cancel(order.number());

        assertEquals(OrderStatus.CANCELLED, order.status());
    }

    @Test @DisplayName("결제대기 주문은 취소할 수 없고 상태가 그대로다")
    void cannotCancelPendingOrder() {
        service.cancel(order.number());

        assertEquals(OrderStatus.PENDING_PAYMENT, order.status());
    }

    @Test @DisplayName("배송중 주문은 취소할 수 없고 상태가 그대로다")
    void cannotCancelOrderInDelivery() {
        service.pay(order.number(), new PaymentMethod("카드 X"));
        order.onDeliveryStarted();

        service.cancel(order.number());

        assertEquals(OrderStatus.IN_DELIVERY, order.status());
    }

    @Test @DisplayName("취소된 주문은 다시 결제할 수 없다")
    void cannotPayCancelledOrder() {
        service.pay(order.number(), new PaymentMethod("카드 X"));
        service.cancel(order.number());
        payment.requestedAmounts.clear();

        service.pay(order.number(), new PaymentMethod("카드 Y"));

        assertEquals(OrderStatus.CANCELLED, order.status());
        assertEquals(List.of(), payment.requestedAmounts);
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
