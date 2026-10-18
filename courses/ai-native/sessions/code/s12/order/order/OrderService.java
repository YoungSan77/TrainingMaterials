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
        // 취소 뒤 — 취소된 주문은 다시 결제할 수 없다. 결제대기가 아니면 승인을 요청하지 않는다
        if (!order.payable()) return;
        // 주문 금액 — 주문이 생길 때 확정한 단가로 계산한다
        if (paymentGateway.requestApproval(order.totalAmount(), method)) {
            order.onPaid();
            // 배송 요청 — 결제가 승인된 뒤에만
            deliveryGateway.requestDelivery(number.value(), order.shippingAddress());
        }
        // 결제 거절 — 결제대기로 남아 다른 결제 수단으로 다시 결제할 수 있다
        repository.save(order);
    }

    public void cancel(OrderNumber number) {
        Order order = repository.findBy(number);
        // 취소할 수 없는 상태 — 배송중·배송완료·취소됨·결제대기는 아무것도 바뀌지 않는다
        // (고객에게 무엇을 안내할지는 업무 담당자가 아직 정하지 않았다 — docs/task-spec.md 「미정」)
        if (!order.cancellable()) return;
        order.cancel();
        repository.save(order);
    }
}
