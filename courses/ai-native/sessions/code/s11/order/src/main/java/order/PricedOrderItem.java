package order;

import java.util.Objects;

import product.Money;
import product.ProductNumber;

/** An order item with the sale price fixed at order creation. */
public record PricedOrderItem(ProductNumber productNumber, Quantity quantity, Money unitPrice) {
    public PricedOrderItem {
        Objects.requireNonNull(productNumber, "productNumber must not be null");
        Objects.requireNonNull(quantity, "quantity must not be null");
        Objects.requireNonNull(unitPrice, "unitPrice must not be null");
    }
}
