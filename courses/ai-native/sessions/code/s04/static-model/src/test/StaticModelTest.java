package test;

import order.*;
import java.util.ArrayList;
import java.util.List;

public final class StaticModelTest {
    private static int passed;
    public static void main(String[] args) {
        Product pen = new Product(new ProductNumber("PEN"), new Money(1000));
        OrderItem item = OrderItem.confirm(pen, new Quantity(2));
        var inputItems = new ArrayList<>(List.of(item));
        Order order = new Order(new OrderNumber("ORDER"), inputItems, new Address("서울"));
        equal(new Money(2000), order.totalAmount(), "단가×수량의 합");
        equal(new ProductNumber("PEN"), item.productNumber(), "상품 식별자 유지");
        equal(new Address("서울"), order.shippingAddress(), "배송지 유지");
        equal(OrderStatus.PENDING_PAYMENT, order.status(), "생성 상태");

        pen.changeSalePrice(new Money(1200));
        equal(new Money(1200), pen.salePrice(), "상품의 현재 판매가 변경");
        equal(new Money(1000), item.unitPrice(), "기존 항목의 확정 단가 유지");
        equal(new Money(2000), order.totalAmount(), "가격 변경 후 기존 주문 총액 유지");
        equal(new Money(1200), OrderItem.confirm(pen, new Quantity(2)).unitPrice(),
              "이후 확정하는 항목은 현재 판매가 사용");

        inputItems.clear();
        equal(1, order.items().size(), "호출자의 목록 변경과 분리");
        rejects(UnsupportedOperationException.class, () -> order.items().clear(),
                "조회한 목록으로 항목 제거 불가");
        rejects(IllegalArgumentException.class,
                () -> new Order(new OrderNumber("EMPTY"), List.of(), new Address("서울")),
                "빈 주문 거절");
        rejects(IllegalArgumentException.class, () -> new Quantity(0), "0 수량 거절");
        rejects(IllegalArgumentException.class, () -> new Quantity(-1), "음수 수량 거절");
        rejects(IllegalArgumentException.class, () -> new Money(-1), "음수 금액 거절");
        equal(new Money(0), new Money(0).times(new Quantity(2)), "0원 허용 경계");
        rejects(ArithmeticException.class,
                () -> new Money(Long.MAX_VALUE).times(new Quantity(2)), "곱셈 범위 초과 검출");
        rejects(ArithmeticException.class,
                () -> new Money(Long.MAX_VALUE).plus(new Money(1)), "덧셈 범위 초과 검출");
        // 대표 한 건으로 합계 구현을 다 확인할 수 없으므로, 업무 범위가 아닌 계산 입력을 바꾼다.
        for (int count = 1; count <= 20; count++) {
            List<OrderItem> lines = new ArrayList<>();
            for (int i = 0; i < count; i++) {
                lines.add(new OrderItem(pen.number(), new Money(1000), new Quantity(2)));
            }
            Order calculation = new Order(new OrderNumber("CALCULATION"), lines, new Address("서울"));
            if (!new Money(2000L * count).equals(calculation.totalAmount())) {
                throw new AssertionError("전 항목 합산: " + count);
            }
        }
        passed++;
        System.out.println("PASS: 계산 입력 1~20개 전 항목 합산 (중복 상품 업무 정책을 확정하는 검사가 아님)");
        System.out.println("PASS: " + passed + " checks; external calls=0");
    }
    private static void equal(Object expected, Object actual, String name) {
        if (!expected.equals(actual)) throw new AssertionError(name + ": " + actual);
        passed++;
        System.out.println("PASS: " + name);
    }
    private static void rejects(Class<? extends Throwable> type, Runnable action, String name) {
        try { action.run(); }
        catch (Throwable error) {
            if (!type.isInstance(error)) throw new AssertionError(name, error);
            passed++;
            System.out.println("PASS: " + name);
            return;
        }
        throw new AssertionError(name + ": 예외 없음");
    }
}
