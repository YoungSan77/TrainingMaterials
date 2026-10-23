package order;

import java.util.Objects;
public record OrderNumber(String value) {
    public OrderNumber { Objects.requireNonNull(value); }
}
