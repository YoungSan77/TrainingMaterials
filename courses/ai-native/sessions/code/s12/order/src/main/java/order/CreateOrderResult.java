package order;

import java.util.Objects;

public record CreateOrderResult(Order order) {
    public CreateOrderResult {
        Objects.requireNonNull(order, "order must not be null");
    }
}
