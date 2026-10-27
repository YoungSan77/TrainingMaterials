package delivery;

import java.util.Objects;
public record Address(String value) {
    public Address { Objects.requireNonNull(value); }
}
