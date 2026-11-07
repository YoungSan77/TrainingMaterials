package order;

import java.util.Objects;

import product.ProductNumber;

/** Product and quantity selected before the current sale price is obtained. */
public record OrderItemRequest(ProductNumber productNumber, Quantity quantity) {
    public OrderItemRequest {
        Objects.requireNonNull(productNumber, "productNumber must not be null");
        Objects.requireNonNull(quantity, "quantity must not be null");
    }
}
