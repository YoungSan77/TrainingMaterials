package order;

import java.util.Objects;
public record ProductNumber(String value) {
    public ProductNumber { Objects.requireNonNull(value); }
}
