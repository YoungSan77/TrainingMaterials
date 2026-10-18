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

    // 주문할 때 주문 항목을 만든다. 업무 규칙은 docs/business-rule.md를 따른다.
    // 주문 시점의 판매가를 단가로 복사해 둔다. 이후 판매가가 바뀌어도 단가는 그대로다.
    public static OrderItem confirm(Product product, Quantity quantity) {
        return new OrderItem(product.number(), quantity, product.salePrice());
    }

    public ProductNumber productNumber() { return productNumber; }
    public Quantity quantity() { return quantity; }
    public Money unitPrice() { return unitPrice; }

    // 항목 금액 = 단가 × 수량
    public Money amount() { return unitPrice.times(quantity.value()); }
}
