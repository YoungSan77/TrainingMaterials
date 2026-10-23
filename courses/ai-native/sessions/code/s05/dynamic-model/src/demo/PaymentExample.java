package demo;

import order.*;

// 동기·정상 응답만 재현하는 교육용 실행 예다. 운영 연동 설계가 아니다.
public final class PaymentExample {
    public record PaymentMethod(String card) {}
    public enum PaymentDecision { APPROVED, REJECTED }
    public interface PaymentGateway {
        PaymentDecision requestApproval(OrderNumber number, Money amount, PaymentMethod method);
    }
    public interface DeliveryGateway {
        void requestDelivery(OrderNumber number, Address address);
    }
    public static void pay(Order order, PaymentMethod method,
                           PaymentGateway payment, DeliveryGateway delivery) {
        if (order.status() != OrderStatus.PENDING_PAYMENT) {
            throw new IllegalStateException("결제대기 주문만 결제 가능");
        }
        PaymentDecision decision = payment.requestApproval(order.number(), order.totalAmount(), method);
        if (decision == PaymentDecision.APPROVED) {
            order.onPaid();
            order.requireDeliveryAllowed();
            delivery.requestDelivery(order.number(), order.shippingAddress());
        } else {
            order.onPaymentRejected();
        }
    }
}
