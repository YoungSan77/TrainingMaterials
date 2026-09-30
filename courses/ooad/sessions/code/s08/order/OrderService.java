package order;

// 시스템 이벤트를 받아 주문을 찾고, 주문에게 맡기고, 저장한다.
// 업무 규칙은 주문이 갖는다.
public final class OrderService implements OrderNotice {
    private final OrderRepository repository;

    public OrderService(OrderRepository repository) { this.repository = repository; }

    public void cancelOrder(OrderNumber number) {
        Order order = repository.findBy(number);
        order.cancel();
        repository.save(order);
    }
    @Override
    public void onDeliveryStarted(OrderNumber number) {
        Order order = repository.findBy(number);
        order.onDeliveryStarted();
        repository.save(order);
    }
    @Override
    public void onRefundCompleted(OrderNumber number) {
        Order order = repository.findBy(number);
        order.onRefundCompleted();
        repository.save(order);
    }
}
