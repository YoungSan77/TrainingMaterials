package test;

import order.*;
import demo.PaymentExample;
import demo.PaymentExample.*;
import java.util.*;

public final class DynamicModelTest {
    private static Order order() {
        Product pen = new Product(new ProductNumber("PEN"), new Money(1000));
        return new Order(new OrderNumber("ORDER"),
            List.of(OrderItem.confirm(pen, new Quantity(2))), new Address("서울"));
    }
    private static void check(boolean value, String message) {
        if (!value) throw new AssertionError(message);
    }
    private static void forbidden(Runnable event, String message) {
        try { event.run(); } catch (IllegalStateException expected) { return; }
        throw new AssertionError(message);
    }
    public static void main(String[] args) {
        Order approved = order();
        List<String> events = new ArrayList<>();
        PaymentGateway payment = (number, amount, method) -> {
            check(amount.equals(new Money(2000)), "승인 요청 금액은 확정 금액 2000원");
            events.add("승인 결과");
            return PaymentDecision.APPROVED;
        };
        DeliveryGateway delivery = (number, address) -> {
            check(approved.status() == OrderStatus.PAID, "배송 요청 시점에는 결제완료");
            check(address.equals(new Address("서울")), "확정 배송지 사용");
            events.add("배송 요청");
        };
        PaymentExample.pay(approved, new PaymentMethod("Y"), payment, delivery);
        check(events.equals(List.of("승인 결과", "배송 요청")), "승인 뒤 배송 요청 1회");
        System.out.println("PASS 승인 뒤 상태와 요청 순서·금액·배송지");

        Order retried = order();
        List<String> cards = new ArrayList<>();
        int[] deliveries = {0};
        PaymentGateway retryPayment = (number, amount, method) -> {
            check(number.equals(retried.number()), "같은 주문으로 재결제");
            check(amount.equals(new Money(2000)), "재결제에도 확정 금액");
            cards.add(method.card());
            return method.card().equals("X") ? PaymentDecision.REJECTED : PaymentDecision.APPROVED;
        };
        DeliveryGateway countDelivery = (number, address) -> deliveries[0]++;
        PaymentExample.pay(retried, new PaymentMethod("X"), retryPayment, countDelivery);
        check(retried.status() == OrderStatus.PENDING_PAYMENT && deliveries[0] == 0, "거절이면 결제대기·배송 0회");
        check(retried.totalAmount().equals(new Money(2000)), "거절 뒤 금액 유지");
        System.out.println("PASS 거절 뒤 같은 주문과 확정 값 유지·배송 없음");
        PaymentExample.pay(retried, new PaymentMethod("Y"), retryPayment, countDelivery);
        check(retried.status() == OrderStatus.PAID && deliveries[0] == 1, "다른 카드 승인 뒤 배송 총 1회");
        check(cards.equals(List.of("X", "Y")), "거절 뒤 다른 카드");
        System.out.println("PASS 거절 뒤 다른 카드 재결제");

        Order pending = order();
        forbidden(pending::requireDeliveryAllowed, "승인 전 배송 금지");
        forbidden(pending::onDeliveryStarted, "결제대기에서 배송 시작 금지");
        check(pending.status() == OrderStatus.PENDING_PAYMENT, "금지된 사건은 상태 보존");
        System.out.println("PASS 승인 전 배송 요청·배송 시작 금지");

        approved.onDeliveryStarted();
        check(approved.status() == OrderStatus.IN_DELIVERY, "배송 시작 뒤 배송중");
        approved.onDelivered();
        check(approved.status() == OrderStatus.DELIVERED, "배송 완료 뒤 배송완료");
        forbidden(approved::onPaid, "배송완료에서 승인 사건 금지");
        forbidden(approved::onDelivered, "중복 배송 완료는 예제 범위에서 금지");
        System.out.println("PASS 배송 생애주기와 허용되지 않은 전이");

        Product pen = new Product(new ProductNumber("PEN"), new Money(1000));
        Order fixed = new Order(new OrderNumber("FIXED"), List.of(OrderItem.confirm(pen, new Quantity(2))), new Address("서울"));
        Product changed = new Product(pen.number(), new Money(1200));
        check(changed.salePrice().equals(new Money(1200)), "현재 판매가 변경");
        PaymentExample.pay(fixed, new PaymentMethod("Y"), payment, (number, address) -> {});
        check(fixed.totalAmount().equals(new Money(2000)), "정적 조건은 전이 뒤에도 유지");
        System.out.println("PASS 판매가 변경·승인 뒤 확정 총액 보존");
        System.out.println("6개 검사 묶음 PASS");
    }
}
