package payment;

public record Money(long won) {
    public static final Money ZERO = new Money(0);

    public Money plus(Money other) { return new Money(won + other.won); }

    public Money times(int count) { return new Money(won * count); }
}
