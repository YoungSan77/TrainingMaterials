package product;

import java.util.Objects;

/** Product identifier; its format and generation rule are intentionally unspecified. */
public record ProductNumber(String value) {
    public ProductNumber {
        Objects.requireNonNull(value, "value must not be null");
    }
}
