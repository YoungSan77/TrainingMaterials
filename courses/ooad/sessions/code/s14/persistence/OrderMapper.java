package persistence;

import java.util.List;
import java.util.Map;
import order.*;
import payment.Money;
import payment.Payment;
import payment.PaymentSystem;
import delivery.Delivery;
import delivery.DeliverySystem;
import product.ProductNumber;

// 도메인 모델과 물리 모델 사이의 매퍼. 결제·배송은 저장된 값과 조립된 약속으로 복원한다.
public final class OrderMapper {
    private final PaymentSystem paymentSystem;
    private final Map<String, DeliverySystem> carriers;

    public OrderMapper(PaymentSystem paymentSystem, Map<String, DeliverySystem> carriers) {
        this.paymentSystem = paymentSystem;
        this.carriers = carriers;
    }

    public OrderRow toRow(Order order) {
        List<ItemRow> items = order.items().stream()
                .map(i -> new ItemRow(i.productNumber().value(), i.quantity().value(), i.unitPrice().won()))
                .toList();
        Payment payment = order.payment();
        Delivery delivery = order.delivery();
        return new OrderRow(order.number().value(), order.status().name(), order.shippingAddress().value(), items,
                payment == null ? null : payment.paymentAmount().won(),
                delivery == null ? null : delivery.deliveryNumber(),
                delivery == null ? null : delivery.carrier());
    }

    public Order toOrder(OrderRow row) {
        List<OrderItem> items = row.items().stream()
                .map(r -> OrderItem.restore(new ProductNumber(r.productNumber()),
                        new Quantity(r.quantity()), new Money(r.unitPriceWon())))
                .toList();
        Payment payment = row.paymentAmountWon() == null ? null
                : new Payment(new Money(row.paymentAmountWon()), paymentSystem);
        // 배송 대행사는 저장된 이름으로 고른다. 선택 규칙을 다시 적용하지 않는다.
        Delivery delivery = row.deliveryNumber() == null ? null
                : new Delivery(row.deliveryNumber(), row.carrier(), carriers.get(row.carrier()));
        return Order.restore(new OrderNumber(row.orderNumber()), items, new Address(row.shippingAddress()),
                OrderStatus.valueOf(row.status()), payment, delivery);
    }
}
