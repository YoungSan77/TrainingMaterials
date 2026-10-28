package order;

import java.util.Objects;

/** Shipping address value; its detailed fields are intentionally unspecified. */
public record Address(String value) {
    public Address {
        Objects.requireNonNull(value, "value must not be null");
    }
}
