package order;

import java.util.Objects;
import payment.Money;
import product.ProductNumber;

public record OrderItem(ProductNumber productNumber, Money unitPrice, Quantity quantity) {
    public OrderItem {
        Objects.requireNonNull(productNumber);
        Objects.requireNonNull(unitPrice);
        Objects.requireNonNull(quantity);
    }
    // 사후조건: 단가는 확정한 그 시점의 판매가이며 이후 판매가 변경에 따라 바뀌지 않는다.
    public static OrderItem confirm(ProductNumber productNumber, long salePrice, Quantity quantity) {
        return new OrderItem(productNumber, new Money(salePrice), quantity);
    }
    public Money amount() {
        return unitPrice.times(quantity.value());
    }
}
