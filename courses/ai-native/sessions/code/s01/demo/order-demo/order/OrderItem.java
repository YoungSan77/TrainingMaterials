package order;

import product.Product;
import product.ProductNumber;

public class OrderItem {
    private final ProductNumber productNumber;
    private final Quantity quantity;

    private OrderItem(ProductNumber productNumber, Quantity quantity) {
        this.productNumber = productNumber;
        this.quantity = quantity;
    }

    // 주문할 때 주문 항목을 만든다. 업무 규칙은 docs/business-rule.md를 따른다.
    public static OrderItem confirm(Product product, Quantity quantity) {
        throw new UnsupportedOperationException("구현 필요");
    }

    public ProductNumber productNumber() { return productNumber; }
    public Quantity quantity() { return quantity; }
}
