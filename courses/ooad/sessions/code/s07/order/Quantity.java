package order;

public record Quantity(int value) {
    public Quantity {
        if (value < 1) throw new IllegalArgumentException("수량은 1 이상");
    }
}
