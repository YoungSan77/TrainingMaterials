package product;

import payment.Money;

public class Product {
    private final ProductNumber number;
    private Money salePrice;

    public Product(ProductNumber number, Money salePrice) {
        this.number = number;
        this.salePrice = salePrice;
    }

    public ProductNumber number() { return number; }
    public Money salePrice() { return salePrice; }

    public void changeSalePrice(Money newPrice) { this.salePrice = newPrice; }
}
