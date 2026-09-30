package payment;

public record Money(int won) {
    public Money {
        if (won < 0) throw new IllegalArgumentException("금액은 0 이상");
    }
    public Money plus(Money other) { return new Money(won + other.won); }
    public Money times(int multiplier) { return new Money(won * multiplier); }
}
