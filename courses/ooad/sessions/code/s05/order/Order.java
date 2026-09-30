package order;

import payment.Payment;
import delivery.Delivery;

public final class Order {
    private OrderStatus status = OrderStatus.PENDING_PAYMENT;
    private Payment payment;
    private Delivery delivery;

    public OrderStatus status() { return status; }

    public void onPaid(Payment payment, Delivery delivery) {
        transition(OrderStatus.PENDING_PAYMENT, OrderStatus.PAID);
        this.payment = payment;
        this.delivery = delivery;
    }
    public void onDeliveryStarted() { transition(OrderStatus.PAID, OrderStatus.IN_DELIVERY); }
    public void onRefundCompleted() { transition(OrderStatus.CANCELLING, OrderStatus.CANCELLED); }

    public void cancel() {
        if (status != OrderStatus.PAID)
            throw new IllegalStateException(status + "에서는 취소할 수 없다");
        if (!delivery.requestDispatchStop())
            throw new IllegalStateException("이미 출고되었다");
        payment.requestRefund();
        transition(OrderStatus.PAID, OrderStatus.CANCELLING);
    }

    private void transition(OrderStatus from, OrderStatus to) {
        if (status != from)
            throw new IllegalStateException(status + "에서는 " + to + "이 될 수 없다");
        status = to;
    }
}
