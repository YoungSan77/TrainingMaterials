package product;

import java.util.Objects;

public record Product(ProductNumber productNumber, Money salePrice) {
    public Product {
        Objects.requireNonNull(productNumber, "productNumber must not be null");
        Objects.requireNonNull(salePrice, "salePrice must not be null");
    }
}
