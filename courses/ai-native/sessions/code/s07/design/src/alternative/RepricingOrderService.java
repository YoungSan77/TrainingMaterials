package alternative;

import delivery.DeliveryGateway;
import order.Order;
import order.OrderItem;
import order.OrderNumber;
import order.OrderRepository;
import payment.Money;
import payment.PaymentDecision;
import payment.PaymentGateway;
import payment.PaymentMethod;
import product.ProductGateway;

// 쓰지 않기로 한 구현 — 결제 직전에 현재 판매가를 다시 조회해 요청 금액을 만든다(업무 규칙 "주문 금액" 위반).
public final class RepricingOrderService {
    private final OrderRepository repository;
    private final ProductGateway product;
    private final PaymentGateway payment;
    private final DeliveryGateway delivery;

    public RepricingOrderService(OrderRepository repository, ProductGateway product,
                                 PaymentGateway payment, DeliveryGateway delivery) {
        this.repository = repository;
        this.product = product;
        this.payment = payment;
        this.delivery = delivery;
    }
    public void pay(OrderNumber number, PaymentMethod method) {
        Order order = repository.findBy(number);
        Money amount = Money.ZERO;
        for (OrderItem item : order.items()) {
            amount = amount.plus(new Money(product.salePrice(item.productNumber())).times(item.quantity().value()));
        }
        if (payment.requestApproval(amount, method) == PaymentDecision.APPROVED) {
            order.onPaid();
            delivery.requestDelivery(number.value(), order.shippingAddress());
        }
        repository.save(order);
    }
}
