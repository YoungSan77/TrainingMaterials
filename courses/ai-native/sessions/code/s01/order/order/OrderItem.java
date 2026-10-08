package order;

import payment.Money;
import product.Product;
import product.ProductNumber;

public class OrderItem {
    private final ProductNumber productNumber;
    private final Quantity quantity;
    private final Money unitPrice;

    private OrderItem(ProductNumber productNumber, Quantity quantity, Money unitPrice) {
        this.productNumber = productNumber;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    // 주문 시점의 판매가를 단가로 확정한다(용어집: 단가).
    public static OrderItem confirm(Product product, Quantity quantity) {
        return new OrderItem(product.number(), quantity, product.salePrice());
    }

    public ProductNumber productNumber() { return productNumber; }
    public Quantity quantity() { return quantity; }
    public Money unitPrice() { return unitPrice; }
}
