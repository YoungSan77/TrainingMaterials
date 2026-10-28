package order;

import java.util.Objects;

import delivery.DeliveryGateway;
import delivery.DeliveryRequest;
import payment.CardApprovalRequest;
import payment.CardApprovalResult;
import payment.PaymentGateway;

public final class OrderPaymentService implements OrderPaymentUseCase {
    private final OrderRepository orderRepository;
    private final PaymentGateway paymentGateway;
    private final DeliveryGateway deliveryGateway;

    public OrderPaymentService(
        OrderRepository orderRepository,
        PaymentGateway paymentGateway,
        DeliveryGateway deliveryGateway
    ) {
        this.orderRepository = Objects.requireNonNull(orderRepository, "orderRepository must not be null");
        this.paymentGateway = Objects.requireNonNull(paymentGateway, "paymentGateway must not be null");
        this.deliveryGateway = Objects.requireNonNull(deliveryGateway, "deliveryGateway must not be null");
    }

    @Override
    public PayOrderResult payOrder(PayOrderCommand command) {
        Objects.requireNonNull(command, "command must not be null");

        Order order = orderRepository.findBy(command.orderNumber());
        if (order == null) {
            throw new IllegalArgumentException("Order must exist");
        }
        if (order.status() != OrderStatus.PENDING_PAYMENT) {
            throw new IllegalStateException("Only a pending-payment order can be paid");
        }

        // 승인 요청 금액은 주문에 확정된 주문 금액이다. 현재 판매가를 다시 묻지 않는다.
        CardApprovalResult result = paymentGateway.approve(new CardApprovalRequest(
            order.orderNumber().value(), order.totalAmount().value(), command.paymentMethod()
        ));

        switch (result) {
            case APPROVED -> {
                Order paid = order.approvePayment();
                orderRepository.save(paid);
                // 배송 요청이 실패했을 때의 처리는 정하지 않았다(docs/업무규칙.md). 복구하지 않고 그대로 전한다.
                deliveryGateway.request(new DeliveryRequest(
                    paid.orderNumber().value(), paid.shippingAddress().value()
                ));
                return new PayOrderResult(paid, result);
            }
            case DECLINED -> {
                return new PayOrderResult(order, result);
            }
            case UNCONFIRMED -> throw new UnsupportedOperationException(
                "Handling of an unconfirmed card approval is not decided (docs/업무규칙.md)"
            );
            default -> throw new IllegalStateException("Unknown card approval result: " + result);
        }
    }
}
