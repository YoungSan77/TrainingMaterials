package order;

import delivery.DeliveryGateway;
import payment.PaymentDecision;
import payment.PaymentGateway;
import payment.PaymentMethod;

public final class OrderService {
    private final OrderRepository repository;
    private final PaymentGateway payment;
    private final DeliveryGateway delivery;

    public OrderService(OrderRepository repository,
                        PaymentGateway payment, DeliveryGateway delivery) {
        this.repository = repository;
        this.payment = payment;
        this.delivery = delivery;
    }
    // 사전조건: 그 번호의 주문이 있고 결제대기다.
    // 사후조건: 승인이면 결제완료와 배송 요청 1회, 거절이면 결제대기 유지와 배송 0회.
    public void pay(OrderNumber number, PaymentMethod method) {
        Order order = repository.findBy(number);
        if (order == null) throw new IllegalArgumentException("없는 주문 번호: " + number.value());
        PaymentDecision decision = payment.requestApproval(order.totalAmount(), method);
        if (decision == PaymentDecision.APPROVED) {
            order.onPaid();
            order.requireDeliveryAllowed();
            delivery.requestDelivery(number.value(), order.shippingAddress());
        } else if (decision == PaymentDecision.REJECTED) {
            order.onPaymentRejected();
        } else {
            throw new IllegalStateException("확정 불가 뒤의 처리는 미정이다: " + number.value());
        }
        repository.save(order);
    }
}
