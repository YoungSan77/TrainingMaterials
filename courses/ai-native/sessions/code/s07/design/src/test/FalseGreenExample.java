package test;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import alternative.RepricingOrderService;
import delivery.Address;
import delivery.DeliveryGateway;
import order.Order;
import order.OrderItem;
import order.OrderNumber;
import order.Quantity;
import payment.PaymentDecision;
import payment.PaymentGateway;
import payment.PaymentMethod;
import persistence.MemoryOrderRepository;
import product.ProductGateway;
import product.ProductNumber;

// 대역이 포트의 계약을 지키지 않으면 검사가 녹색인데도 업무 규칙이 깨진다.
public final class FalseGreenExample {
    private static final ProductNumber PEN = new ProductNumber("PEN");
    private static final OrderNumber NUMBER = new OrderNumber("2026-0001");
    private static final PaymentMethod CARD_X = new PaymentMethod("카드X");
    // 결제 직전에 펜 값이 1,200원이 되었다.
    private static final ProductGateway REPRICED = number -> 1200;

    public static void main(String[] args) {
        AtomicInteger requested = new AtomicInteger();
        PaymentGateway loose = (amount, method) -> {
            requested.set((int) amount.won());
            return PaymentDecision.APPROVED;
        };
        run(loose);
        System.out.println("PASS(거짓) 느슨한 대역: 요청 금액을 보지 않고 승인 — "
            + String.format("%,d", requested.get()) + "원으로 요청한 구현이 통과했다");

        PaymentGateway contracted = (amount, method) -> {
            if (amount.won() != 2000) {
                throw new IllegalStateException("사전조건 위반 — 요청 "
                    + String.format("%,d", amount.won()) + "원 ≠ 주문 총액 2,000원");
            }
            return PaymentDecision.APPROVED;
        };
        try {
            run(contracted);
            throw new AssertionError("계약 대역이 사전조건 위반을 잡지 못했다");
        } catch (IllegalStateException caught) {
            System.out.println("PASS 계약 대역: " + caught.getMessage());
        }
    }

    private static void run(PaymentGateway payment) {
        Order order = new Order(NUMBER, List.of(OrderItem.confirm(PEN, 1000, new Quantity(2))),
            new Address("서울"));
        MemoryOrderRepository repository = new MemoryOrderRepository();
        repository.save(order);
        DeliveryGateway delivery = (orderNumber, address) -> { };
        new RepricingOrderService(repository, REPRICED, payment, delivery).pay(NUMBER, CARD_X);
    }
}
