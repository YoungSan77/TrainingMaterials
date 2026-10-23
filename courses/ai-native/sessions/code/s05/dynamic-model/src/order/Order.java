package order;

import java.util.List;
import java.util.Objects;

public final class Order {
    private final OrderNumber number;
    private final List<OrderItem> items;
    private final Address shippingAddress;
    private OrderStatus status = OrderStatus.PENDING_PAYMENT;

    public Order(OrderNumber number, List<OrderItem> items, Address shippingAddress) {
        if (items.isEmpty()) throw new IllegalArgumentException("주문 항목은 1개 이상");
        this.number = Objects.requireNonNull(number);
        this.items = List.copyOf(items);
        this.shippingAddress = Objects.requireNonNull(shippingAddress);
    }
    public OrderNumber number() { return number; }
    public List<OrderItem> items() { return items; }
    public Address shippingAddress() { return shippingAddress; }
    public OrderStatus status() { return status; }

    public void onPaid() {
        requireState(OrderStatus.PENDING_PAYMENT);
        status = OrderStatus.PAID;
    }
    public void onPaymentRejected() {
        requireState(OrderStatus.PENDING_PAYMENT);
        // 거절 뒤에도 같은 주문의 확정 값을 유지한다.
    }
    public void onDeliveryStarted() {
        requireState(OrderStatus.PAID);
        status = OrderStatus.IN_DELIVERY;
    }
    public void onDelivered() {
        requireState(OrderStatus.IN_DELIVERY);
        status = OrderStatus.DELIVERED;
    }
    public void requireDeliveryAllowed() {
        requireState(OrderStatus.PAID);
    }
    private void requireState(OrderStatus expected) {
        if (status != expected) {
            throw new IllegalStateException("현재 상태에서 허용되지 않은 사건: " + status);
        }
    }

    public Money totalAmount() {
        Money total = Money.ZERO;
        for (OrderItem item : items) {
            total = total.plus(item.unitPrice().times(item.quantity()));
        }
        return total;
    }
}
