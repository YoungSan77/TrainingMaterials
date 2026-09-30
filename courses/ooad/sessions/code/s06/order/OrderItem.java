package order;

import payment.Money;
import product.Product;
import product.ProductNumber;

public final class OrderItem {
    private final ProductNumber productNumber;
    private final Quantity quantity;
    private final Money unitPrice;

    private OrderItem(ProductNumber productNumber, Quantity quantity, Money unitPrice) {
        this.productNumber = productNumber;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }
    // 주문 시점의 판매가를 단가로 옮겨 적는다.
    public static OrderItem confirm(Product product, Quantity quantity) {
        return new OrderItem(product.number(), quantity, product.salePrice());
    }
    Money amount() { return unitPrice.times(quantity.value()); }
}
