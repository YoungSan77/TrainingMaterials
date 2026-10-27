package order;

import java.util.Objects;

import product.Money;
import product.ProductNumber;

public record OrderItem(ProductNumber productNumber, Quantity quantity, Money unitPrice) {
    public OrderItem {
        Objects.requireNonNull(productNumber, "productNumber must not be null");
        Objects.requireNonNull(quantity, "quantity must not be null");
        Objects.requireNonNull(unitPrice, "unitPrice must not be null");
    }

    public static OrderItem from(PricedOrderItem item) {
        Objects.requireNonNull(item, "item must not be null");
        return new OrderItem(item.productNumber(), item.quantity(), item.unitPrice());
    }

    public Money subtotal() {
        return unitPrice.multiply(quantity.value());
    }
}
