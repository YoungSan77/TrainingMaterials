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
    // 저장된 값으로 복원한다. 단가는 다시 계산하지 않고 저장된 확정 값을 쓴다.
    public static OrderItem restore(ProductNumber productNumber, Quantity quantity, Money unitPrice) {
        return new OrderItem(productNumber, quantity, unitPrice);
    }
    public ProductNumber productNumber() { return productNumber; }
    public Quantity quantity() { return quantity; }
    public Money unitPrice() { return unitPrice; }
    Money amount() { return unitPrice.times(quantity.value()); }
}
