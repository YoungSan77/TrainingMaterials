package payment;

import java.util.Objects;
public record PaymentMethod(String value) {
    public PaymentMethod { Objects.requireNonNull(value); }
}
