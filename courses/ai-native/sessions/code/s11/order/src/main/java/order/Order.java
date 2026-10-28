package order;

import java.util.List;
import java.util.Objects;

import product.Money;

public final class Order {
    private final OrderNumber orderNumber;
    private final List<OrderItem> items;
    private final Money totalAmount;
    private final Address shippingAddress;
    private final OrderStatus status;

    private Order(
        OrderNumber orderNumber,
        List<OrderItem> items,
        Money totalAmount,
        Address shippingAddress,
        OrderStatus status
    ) {
        this.orderNumber = orderNumber;
        this.items = items;
        this.totalAmount = totalAmount;
        this.shippingAddress = shippingAddress;
        this.status = status;
    }

    public static Order create(
        OrderNumber orderNumber,
        List<PricedOrderItem> pricedItems,
        Address shippingAddress
    ) {
        Objects.requireNonNull(orderNumber, "orderNumber must not be null");
        Objects.requireNonNull(pricedItems, "pricedItems must not be null");
        Objects.requireNonNull(shippingAddress, "shippingAddress must not be null");
        if (pricedItems.isEmpty()) {
            throw new IllegalArgumentException("An order must have at least one item");
        }

        List<OrderItem> items = pricedItems.stream().map(OrderItem::from).toList();
        Money totalAmount = items.stream()
            .map(OrderItem::subtotal)
            .reduce(Money.won(0), Money::add);

        return new Order(orderNumber, items, totalAmount, shippingAddress, OrderStatus.PENDING_PAYMENT);
    }

    public Order approvePayment() {
        if (status != OrderStatus.PENDING_PAYMENT) {
            throw new IllegalStateException("Only a pending-payment order can be paid");
        }
        return new Order(orderNumber, items, totalAmount, shippingAddress, OrderStatus.PAID);
    }

    public OrderNumber orderNumber() {
        return orderNumber;
    }

    public List<OrderItem> items() {
        return items;
    }

    public Money totalAmount() {
        return totalAmount;
    }

    public Address shippingAddress() {
        return shippingAddress;
    }

    public OrderStatus status() {
        return status;
    }
}
