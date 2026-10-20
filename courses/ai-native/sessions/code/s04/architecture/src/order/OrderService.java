package order;
import payment.PaymentGateway;
import payment.PaymentMethod;
import delivery.DeliveryGateway;

public final class OrderService {
    private final OrderRepository repository;
    private final PaymentGateway payment;
    private final DeliveryGateway delivery;

    public OrderService(OrderRepository repository,
                        PaymentGateway payment, DeliveryGateway delivery) {
        this.repository = repository;
        this.payment = payment;
        this.delivery = delivery;
    }
    public void pay(String orderNumber, PaymentMethod method) {
        Order order = repository.findBy(orderNumber);
        if (payment.requestApproval(order.totalAmount(), method)) {
            order.onPaid();
            delivery.requestDelivery(orderNumber, order.shippingAddress());
        }
        repository.save(orderNumber, order);
    }
}
