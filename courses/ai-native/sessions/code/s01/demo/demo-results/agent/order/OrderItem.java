package order;

import payment.Money;
import product.Product;
import product.ProductNumber;

public class OrderItem {
    private final ProductNumber productNumber;
    private final Money unitPrice;
    private final Quantity quantity;

    private OrderItem(ProductNumber productNumber, Money unitPrice, Quantity quantity) {
        this.productNumber = productNumber;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
    }

    // 주문할 때 주문 항목을 만든다. 단가는 이때의 판매가로 정하고 그 뒤로 바뀌지 않는다.
    public static OrderItem confirm(Product product, Quantity quantity) {
        return new OrderItem(product.number(), product.salePrice(), quantity);
    }

    public ProductNumber productNumber() { return productNumber; }
    public Money unitPrice() { return unitPrice; }
    public Quantity quantity() { return quantity; }

    // 단가 × 수량
    public Money amount() { return unitPrice.times(quantity.value()); }
}
