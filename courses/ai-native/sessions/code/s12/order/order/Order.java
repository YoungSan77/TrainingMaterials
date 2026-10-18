package order;

import java.util.List;
import delivery.Address;
import payment.Money;

public class Order {
    private final OrderNumber number;
    private final List<OrderItem> items;
    private final Address shippingAddress;
    private OrderStatus status = OrderStatus.PENDING_PAYMENT;

    public Order(OrderNumber number, List<OrderItem> items, Address shippingAddress) {
        if (items.isEmpty()) throw new IllegalArgumentException("주문 항목은 1개 이상");
        this.number = number;
        this.items = List.copyOf(items);
        this.shippingAddress = shippingAddress;
    }

    public OrderNumber number() { return number; }
    public List<OrderItem> items() { return items; }
    public Address shippingAddress() { return shippingAddress; }
    public OrderStatus status() { return status; }

    public Money totalAmount() {
        Money total = Money.ZERO;
        for (OrderItem item : items) total = total.plus(item.unitPrice().times(item.quantity().value()));
        return total;
    }

    // 결제대기 → 결제완료 : 결제 승인됨
    public boolean payable() { return status == OrderStatus.PENDING_PAYMENT; }

    public void onPaid() {
        if (status != OrderStatus.PENDING_PAYMENT) throw new IllegalStateException("허용되지 않은 상태 전이");
        status = OrderStatus.PAID;
    }

    // 결제완료 → 배송중 : 배송 시작 통보
    public void onDeliveryStarted() {
        if (status != OrderStatus.PAID) throw new IllegalStateException("허용되지 않은 상태 전이");
        status = OrderStatus.IN_DELIVERY;
    }

    // 취소할 수 있는 상태 — 결제완료인 주문만 취소할 수 있다
    public boolean cancellable() { return status == OrderStatus.PAID; }

    // 결제완료 → 취소됨 : 주문을 취소한다
    public void cancel() {
        if (!cancellable()) throw new IllegalStateException("허용되지 않은 상태 전이");
        status = OrderStatus.CANCELLED;
    }
}
