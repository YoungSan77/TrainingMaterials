package order;

import java.util.function.Consumer;

// 시스템 이벤트를 받아 주문을 찾고, 주문에게 맡기고, 저장한다.
// 업무 규칙은 주문이 갖는다.
public final class OrderService implements OrderNotice {
    private final OrderRepository repository;

    public OrderService(OrderRepository repository) { this.repository = repository; }

    public void cancelOrder(OrderNumber number) { apply(number, Order::cancel); }
    @Override
    public void onDeliveryStarted(OrderNumber number) { apply(number, Order::onDeliveryStarted); }
    @Override
    public void onRefundCompleted(OrderNumber number) { apply(number, Order::onRefundCompleted); }

    // 찾고, 맡기고, 저장한다 — 세 오퍼레이션에 같던 순서를 한 곳에 둔다.
    private void apply(OrderNumber number, Consumer<Order> operation) {
        Order order = repository.findBy(number);
        operation.accept(order);
        repository.save(order);
    }
}
