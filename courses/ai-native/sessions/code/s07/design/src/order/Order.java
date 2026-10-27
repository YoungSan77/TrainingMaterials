package order;

import java.util.List;
import java.util.Objects;
import delivery.Address;
import payment.Money;

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

    // 사후조건: 확정 단가 × 수량의 합이며, 현재 판매가를 다시 조회하지 않는다.
    public Money totalAmount() {
        Money total = Money.ZERO;
        for (OrderItem item : items) {
            total = total.plus(item.amount());
        }
        return total;
    }
    // 사전조건: 결제대기 / 사후조건: 결제완료
    public void onPaid() {
        requireState(OrderStatus.PENDING_PAYMENT);
        status = OrderStatus.PAID;
    }
    // 사전조건: 결제대기 / 사후조건: 결제대기를 유지하고 확정 값을 바꾸지 않는다
    public void onPaymentRejected() {
        requireState(OrderStatus.PENDING_PAYMENT);
    }
    // 사전조건: 결제완료 — 승인 전 배송 요청을 막는다
    public void requireDeliveryAllowed() {
        requireState(OrderStatus.PAID);
    }
    public void onDeliveryStarted() {
        requireState(OrderStatus.PAID);
        status = OrderStatus.IN_DELIVERY;
    }
    public void onDelivered() {
        requireState(OrderStatus.IN_DELIVERY);
        status = OrderStatus.DELIVERED;
    }
    private void requireState(OrderStatus expected) {
        if (status != expected) {
            throw new IllegalStateException("현재 상태에서 허용되지 않은 사건: " + status);
        }
    }
}
