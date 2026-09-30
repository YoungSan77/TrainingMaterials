package persistence;

import java.util.List;
import order.*;
import payment.Money;
import product.ProductNumber;

// 도메인 모델과 물리 모델 사이의 매퍼. 두 모델은 서로를 모른다.
public final class OrderMapper {
    public OrderRow toRow(Order order) {
        List<ItemRow> items = order.items().stream()
                .map(i -> new ItemRow(i.productNumber().value(), i.quantity().value(), i.unitPrice().won()))
                .toList();
        return new OrderRow(order.number().value(), order.status().name(),
                order.shippingAddress().value(), items);
    }

    public Order toOrder(OrderRow row) {
        List<OrderItem> items = row.items().stream()
                .map(r -> OrderItem.restore(new ProductNumber(r.productNumber()),
                        new Quantity(r.quantity()), new Money(r.unitPriceWon())))
                .toList();
        return Order.restore(new OrderNumber(row.orderNumber()), items,
                new Address(row.shippingAddress()), OrderStatus.valueOf(row.status()));
    }
}
