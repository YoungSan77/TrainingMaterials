package alternative;

import delivery.DeliveryGateway;
import order.OrderStatus;
import payment.PaymentDecision;
import payment.PaymentGateway;
import payment.PaymentMethod;

// 쓰지 않기로 한 안 — 상태 전이와 금지 규칙이 모두 서비스에 있다.
public final class AnemicOrderService {
    private final PaymentGateway payment;
    private final DeliveryGateway delivery;

    public AnemicOrderService(PaymentGateway payment, DeliveryGateway delivery) {
        this.payment = payment;
        this.delivery = delivery;
    }
    public void pay(String orderNumber, AnemicOrder order, PaymentMethod method) {
        if (order.getStatus() != OrderStatus.PENDING_PAYMENT) {
            throw new IllegalStateException("결제대기 주문만 결제 가능");
        }
        if (payment.requestApproval(order.getTotalAmount(), method) == PaymentDecision.APPROVED) {
            order.setStatus(OrderStatus.PAID);
            delivery.requestDelivery(orderNumber, order.getShippingAddress());
        }
    }
}
