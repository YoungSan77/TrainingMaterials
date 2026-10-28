package order;

import java.util.Objects;

/** Order identifier; its format and generation rule are intentionally unspecified. */
public record OrderNumber(String value) {
    public OrderNumber {
        Objects.requireNonNull(value, "value must not be null");
    }
}
