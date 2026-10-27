package payment;

public record Money(long won) {
    public static final Money ZERO = new Money(0);
    public Money {
        if (won < 0) throw new IllegalArgumentException("금액은 0 이상");
    }
    public Money plus(Money other) {
        return new Money(Math.addExact(won, other.won));
    }
    public Money times(int quantity) {
        return new Money(Math.multiplyExact(won, quantity));
    }
}
