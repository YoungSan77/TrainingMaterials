package order;

import java.util.List;
import payment.Money;

public class Order {
    private final List<OrderItem> items;

    public Order(List<OrderItem> items) {
        if (items.isEmpty()) throw new IllegalArgumentException("주문 항목은 1개 이상");
        this.items = List.copyOf(items);
    }

    public List<OrderItem> items() { return items; }

    // 주문 금액. 업무 규칙은 docs/business-rule.md를 따른다.
    public Money totalAmount() {
        return items.stream().map(OrderItem::amount).reduce(Money.ZERO, Money::plus);
    }
}
