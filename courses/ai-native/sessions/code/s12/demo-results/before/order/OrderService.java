package order;

import delivery.DeliveryGateway;
import payment.PaymentGateway;
import payment.PaymentMethod;

// "04. 수용 기준과 검증 가능한 작업 단위" — 수용 테스트(test/PayAcceptanceTest) 4개를 통과하는 결제.
// 결제 연동과 저장은 생성자로 받는다 — 의존 규칙 센서(test/DependencyRuleTest)가 그것을 판정한다.
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
        Order order = repository.findBy(number);
        // 주문 금액 — 주문이 생길 때 확정한 단가로 계산한다
        if (paymentGateway.requestApproval(order.totalAmount(), method)) {
            order.onPaid();
            // 배송 요청 — 결제가 승인된 뒤에만
            deliveryGateway.requestDelivery(number.value(), order.shippingAddress());
        }
        // 결제 거절 — 결제대기로 남아 다른 결제 수단으로 다시 결제할 수 있다
        repository.save(order);
    }
}
