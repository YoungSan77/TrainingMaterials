package test;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import delivery.Address;
import delivery.DeliveryGateway;
import order.Order;
import order.OrderItem;
import order.OrderNumber;
import order.OrderService;
import order.OrderStatus;
import order.Quantity;
import payment.PaymentDecision;
import payment.PaymentGateway;
import payment.PaymentMethod;
import persistence.MemoryOrderRepository;
import product.ProductNumber;

public final class ContractTest {
    private static final ProductNumber PEN = new ProductNumber("PEN");
    private static final OrderNumber NUMBER = new OrderNumber("2026-0001");
    private static final PaymentMethod CARD_X = new PaymentMethod("카드X");
    private static final PaymentMethod CARD_Y = new PaymentMethod("카드Y");

    public static void main(String[] args) {
        confirmedAmount();
        approved();
        rejected();
        paidAgainWithAnotherCard();
        preconditions();
        unconfirmed();
    }

    // 작업 단위 "금액 확정" — 확정 단가로 계산한다. 주문 서비스는 상품 포트를 들지 않아 현재 판매가를 볼 수 없다.
    private static void confirmedAmount() {
        Order order = order();
        check(order.totalAmount().won() == 2000, "확정 단가 × 수량");
        MemoryOrderRepository repository = save(order);
        AtomicInteger requested = new AtomicInteger();
        AtomicInteger deliveries = new AtomicInteger();
        OrderService service = new OrderService(repository, (amount, method) -> {
            requested.set((int) amount.won());
            return PaymentDecision.APPROVED;
        }, countingDelivery(order, deliveries));
        service.pay(NUMBER, CARD_X);
        check(requested.get() == 2000, "확정 단가로 만든 요청 금액");
        System.out.println("PASS 금액 확정: 확정 단가 1,000원 × 2개 = 2,000원, 승인 요청도 2,000원");
    }

    // 작업 단위 "승인" — 상태를 바꾼 뒤에 배송을 요청한다.
    private static void approved() {
        Order order = order();
        MemoryOrderRepository repository = save(order);
        AtomicInteger deliveries = new AtomicInteger();
        OrderService service = new OrderService(repository,
            contractedPayment(order, PaymentDecision.APPROVED),
            countingDelivery(order, deliveries));
        service.pay(NUMBER, CARD_X);
        check(order.status() == OrderStatus.PAID, "승인 뒤 결제완료");
        check(deliveries.get() == 1, "배송 요청 1회");
        System.out.println("PASS 승인: 요청 2,000원 → 결제완료, 요청 시점에 결제완료, 서울 배송 1회");
    }

    // 작업 단위 "거절" — 상태와 확정 값을 지키고 배송을 요청하지 않는다.
    private static void rejected() {
        Order order = order();
        MemoryOrderRepository repository = save(order);
        AtomicInteger deliveries = new AtomicInteger();
        OrderService service = new OrderService(repository,
            contractedPayment(order, PaymentDecision.REJECTED),
            countingDelivery(order, deliveries));
        service.pay(NUMBER, CARD_X);
        check(order.status() == OrderStatus.PENDING_PAYMENT, "거절 뒤 결제대기");
        check(order.totalAmount().won() == 2000, "거절 뒤 총액 유지");
        check(deliveries.get() == 0, "승인 전 배송 금지");
        System.out.println("PASS 거절: 결제대기 유지, 총액 2,000원 유지, 배송 0회");
    }

    // 작업 단위 "재결제" — 같은 주문을 다른 카드로 결제한다.
    private static void paidAgainWithAnotherCard() {
        Order order = order();
        MemoryOrderRepository repository = save(order);
        AtomicInteger deliveries = new AtomicInteger();
        new OrderService(repository, contractedPayment(order, PaymentDecision.REJECTED),
            countingDelivery(order, deliveries)).pay(NUMBER, CARD_X);
        new OrderService(repository, contractedPayment(order, PaymentDecision.APPROVED),
            countingDelivery(order, deliveries)).pay(NUMBER, CARD_Y);
        check(order.status() == OrderStatus.PAID, "재결제 뒤 결제완료");
        check(deliveries.get() == 1, "재결제 뒤 배송 1회");
        System.out.println("PASS 재결제: 거절 뒤 다른 카드로 승인 → 결제완료, 배송 1회");
    }

    // 사전조건 — 어긴 호출은 거절된다.
    private static void preconditions() {
        Order paid = order();
        paid.onPaid();
        check(rejects(paid::onPaid), "결제완료 주문의 재승인 거절");
        Order pending = order();
        check(rejects(pending::requireDeliveryAllowed), "승인 전 배송 요청 거절");
        System.out.println("PASS 사전조건: 결제완료 주문의 재승인 거절, 승인 전 배송 요청 거절");
    }

    // 확정 불가 — 뒤의 처리가 미정이므로 어떤 전이도 하지 않고 멈춘다.
    private static void unconfirmed() {
        Order order = order();
        MemoryOrderRepository repository = save(order);
        AtomicInteger deliveries = new AtomicInteger();
        OrderService service = new OrderService(repository,
            contractedPayment(order, PaymentDecision.UNCONFIRMED),
            countingDelivery(order, deliveries));
        check(rejects(() -> service.pay(NUMBER, CARD_X)), "확정 불가에서 멈춘다");
        check(order.status() == OrderStatus.PENDING_PAYMENT, "확정 불가 뒤 결제대기");
        check(deliveries.get() == 0, "확정 불가 뒤 배송 0회");
        System.out.println("PASS 확정 불가: 상태를 바꾸지 않고 멈춘다 — 결제대기, 배송 0회");
    }

    private static Order order() {
        return new Order(NUMBER, List.of(OrderItem.confirm(PEN, 1000, new Quantity(2))),
            new Address("서울"));
    }
    private static MemoryOrderRepository save(Order order) {
        MemoryOrderRepository repository = new MemoryOrderRepository();
        repository.save(order);
        return repository;
    }
    // 계약을 지키는 대역 — 사전조건(요청 금액이 그 주문의 확정 총액)을 검사한다.
    private static PaymentGateway contractedPayment(Order order, PaymentDecision decision) {
        return (amount, method) -> {
            check(amount.won() == order.totalAmount().won(), "요청 금액 = 주문 총액");
            return decision;
        };
    }
    // 계약을 지키는 대역 — 사전조건(요청 시점에 결제완료)을 검사한다.
    private static DeliveryGateway countingDelivery(Order order, AtomicInteger deliveries) {
        return (orderNumber, address) -> {
            check(order.status() == OrderStatus.PAID, "배송 요청 시점의 상태");
            check(address.value().equals("서울"), "확정 배송지");
            deliveries.incrementAndGet();
        };
    }
    private static boolean rejects(Runnable call) {
        try {
            call.run();
            return false;
        } catch (IllegalStateException expected) {
            return true;
        }
    }
    private static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }
}
