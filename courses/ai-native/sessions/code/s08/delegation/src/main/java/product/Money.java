package product;

import java.util.Objects;

/** A non-negative amount in Korean won. */
public record Money(long value) {
    public Money {
        if (value < 0) {
            throw new IllegalArgumentException("Money must not be negative");
        }
    }

    public static Money won(long value) {
        return new Money(value);
    }

    public Money add(Money other) {
        Objects.requireNonNull(other, "other must not be null");
        try {
            return new Money(Math.addExact(value, other.value));
        } catch (ArithmeticException exception) {
            throw new IllegalArgumentException("Money amount is too large", exception);
        }
    }

    public Money multiply(int multiplier) {
        try {
            return new Money(Math.multiplyExact(value, multiplier));
        } catch (ArithmeticException exception) {
            throw new IllegalArgumentException("Money amount is too large", exception);
        }
    }
}
