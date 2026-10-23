package order;

import java.util.Objects;

public record OrderItem(ProductNumber productNumber,
                        Money unitPrice, Quantity quantity) {
    public OrderItem {
        Objects.requireNonNull(productNumber);
        Objects.requireNonNull(unitPrice);
        Objects.requireNonNull(quantity);
    }
    public static OrderItem confirm(Product product, Quantity quantity) {
        return new OrderItem(product.number(), product.salePrice(), quantity);
    }
}
