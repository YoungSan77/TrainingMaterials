package order;

import java.util.List;
import java.util.Objects;

public record CreateOrderCommand(OrderNumber orderNumber, List<OrderItemRequest> items, Address shippingAddress) {
    public CreateOrderCommand {
        Objects.requireNonNull(orderNumber, "orderNumber must not be null");
        Objects.requireNonNull(items, "items must not be null");
        Objects.requireNonNull(shippingAddress, "shippingAddress must not be null");
        if (items.isEmpty()) {
            throw new IllegalArgumentException("An order must have at least one item");
        }
        items = List.copyOf(items);
    }
}
