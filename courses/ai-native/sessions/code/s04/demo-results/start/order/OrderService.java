package order;

import delivery.DeliveryGateway;
import payment.PaymentGateway;
import payment.PaymentMethod;

public class OrderService {
    private final OrderRepository repository;
    private final PaymentGateway paymentGateway;
    private final DeliveryGateway deliveryGateway;

    public OrderService(OrderRepository repository, PaymentGateway paymentGateway, DeliveryGateway deliveryGateway) {
        this.repository = repository;
        this.paymentGateway = paymentGateway;
        this.deliveryGateway = deliveryGateway;
    }

    public void pay(OrderNumber number, PaymentMethod method) {
        throw new UnsupportedOperationException("구현 전");
    }
}
