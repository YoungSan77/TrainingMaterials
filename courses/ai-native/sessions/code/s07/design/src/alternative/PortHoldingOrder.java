package alternative;

import delivery.Address;
import delivery.DeliveryGateway;
import order.OrderStatus;
import payment.Money;
import payment.PaymentDecision;
import payment.PaymentGateway;
import payment.PaymentMethod;

// 쓰지 않기로 한 안 — 주문이 결제·배송 포트를 들고 직접 부른다.
public final class PortHoldingOrder {
    private final Money totalAmount;
    private final Address shippingAddress;
    private final PaymentGateway payment;
    private final DeliveryGateway delivery;
    private OrderStatus status = OrderStatus.PENDING_PAYMENT;

    public PortHoldingOrder(Money totalAmount, Address shippingAddress,
                            PaymentGateway payment, DeliveryGateway delivery) {
        this.totalAmount = totalAmount;
        this.shippingAddress = shippingAddress;
        this.payment = payment;
        this.delivery = delivery;
    }
    public OrderStatus status() { return status; }
    public void pay(String orderNumber, PaymentMethod method) {
        if (payment.requestApproval(totalAmount, method) == PaymentDecision.APPROVED) {
            status = OrderStatus.PAID;
            delivery.requestDelivery(orderNumber, shippingAddress);
        }
    }
}
