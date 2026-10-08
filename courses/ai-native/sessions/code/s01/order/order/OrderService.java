package order;

import delivery.DeliveryGateway;
import payment.Money;
import payment.PaymentGateway;
import payment.PaymentMethod;
import product.ProductGateway;

// 첫 시도 — 에이전트가 요청 한 줄("장바구니에 담은 상품을 결제하면 주문이 되고 배송이 시작되게 해 주세요")만 받고 만든 결제 코드다.
// 업무 규칙 셋(주문 금액, 배송 요청, 결제 거절)을 모두 추측으로 채웠다.
public class OrderService {
    private final OrderRepository repository;
    private final ProductGateway productGateway;
    private final PaymentGateway paymentGateway;
    private final DeliveryGateway deliveryGateway;

    public OrderService(OrderRepository repository, ProductGateway productGateway,
                        PaymentGateway paymentGateway, DeliveryGateway deliveryGateway) {
        this.repository = repository;
        this.productGateway = productGateway;
        this.paymentGateway = paymentGateway;
        this.deliveryGateway = deliveryGateway;
    }

    public void pay(OrderNumber number, PaymentMethod method) {
        Order order = repository.findBy(number);
        Money amount = Money.ZERO;
        for (OrderItem item : order.items()) {
            // ① 결제 시점의 판매가로 다시 계산
            Money salePrice = productGateway.salePriceOf(item.productNumber());
            amount = amount.plus(salePrice.times(item.quantity().value()));
        }
        // ② 승인 전에 배송 요청
        deliveryGateway.requestDelivery(number.value(), order.shippingAddress());
        if (paymentGateway.requestApproval(amount, method)) order.onPaid();
        else order.cancel();   // ③ 거절되면 취소됨
        repository.save(order);
    }
}
