package order;

import java.util.List;
import delivery.Address;
import payment.Money;

// LLM 초안의 일부. cancel()은 모델에 없는 전이(결제대기 → 취소됨)를 허용한다 — 추측 ③.
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

    public void onPaid() {
        if (status != OrderStatus.PENDING_PAYMENT) throw new IllegalStateException("허용되지 않은 상태 전이");
        status = OrderStatus.PAID;
    }

    public void cancel() { status = OrderStatus.CANCELLED; }
}
