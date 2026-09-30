package order;

import java.util.List;
import payment.Payment;
import payment.Money;
import delivery.Delivery;

// 불변 조건: 주문 항목은 1개 이상이고, 상태는 transition으로만 바뀐다.
public final class Order {
    private final OrderNumber number;
    private final List<OrderItem> items;
    private Address shippingAddress;
    private OrderStatus status = OrderStatus.PENDING_PAYMENT;
    private Payment payment;
    private Delivery delivery;

    public Order(OrderNumber number, List<OrderItem> items, Address shippingAddress) {
        if (items.isEmpty())
            throw new IllegalArgumentException("주문 항목은 1개 이상");
        this.number = number;
        this.items = List.copyOf(items);
        this.shippingAddress = shippingAddress;
    }
    public OrderNumber number() { return number; }
    public OrderStatus status() { return status; }

    public Money totalAmount() {
        Money total = new Money(0);
        for (OrderItem item : items) total = total.plus(item.amount());
        return total;
    }

    public void onPaid(Payment payment, Delivery delivery) {
        transition(OrderStatus.PENDING_PAYMENT, OrderStatus.PAID);
        this.payment = payment;
        this.delivery = delivery;
    }
    public void onDeliveryStarted() { transition(OrderStatus.PAID, OrderStatus.IN_DELIVERY); }
    public void onRefundCompleted() { transition(OrderStatus.CANCELLING, OrderStatus.CANCELLED); }

    // 사전조건: 결제 완료이고 출고 중단이 수락된다.
    // 사후조건: 취소 처리 중이 되고, 출고 중단과 환불을 이 순서로 요청했다.
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
