package order;

import java.util.Objects;

public final class Product {
    private final ProductNumber number;
    private Money salePrice;

    public Product(ProductNumber number, Money salePrice) {
        this.number = Objects.requireNonNull(number);
        this.salePrice = Objects.requireNonNull(salePrice);
    }
    public ProductNumber number() { return number; }
    public Money salePrice() { return salePrice; }
    public void changeSalePrice(Money salePrice) {
        this.salePrice = Objects.requireNonNull(salePrice);
    }
}
