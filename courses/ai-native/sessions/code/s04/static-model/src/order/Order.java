package order;

import java.util.List;
import java.util.Objects;

public final class Order {
    private final OrderNumber number;
    private final List<OrderItem> items;
    private final Address shippingAddress;
    private final OrderStatus status = OrderStatus.PENDING_PAYMENT;

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

    public Money totalAmount() {
        Money total = Money.ZERO;
        for (OrderItem item : items) {
            total = total.plus(item.unitPrice().times(item.quantity()));
        }
        return total;
    }
}
