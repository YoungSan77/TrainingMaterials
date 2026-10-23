// production-enum-baseline: exclude — 전면 보완 전 정적 모델 예제다. 현재 정적 모델의 원본은 code/s04/static-model이다.
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

// 교육용 범위: 원화 정수 금액, 펜 한 상품, 결제대기 주문의 승인·거절 결과.
// 실환경의 식별·영속·통신·중복 결과·실패 복구는 구현하지 않는다.
public final class DomainModelExample {
    public static void main(String[] args) {
        Product product = new Product(new Money(1000));
        OrderItem item = OrderItem.confirm(product, new Quantity(2));
        Order order = new Order(List.of(item));
        product.salePrice = new Money(1200);
        check(item.unitPrice().won() == 1000, "확정 단가");
        check(order.totalAmount().won() == 2000, "판매가 변경 후 총액");
        System.out.println("PASS 금액 보존: 단가 1000, 총액 2000");

        AtomicInteger deliveries = new AtomicInteger();
        order.pay(true, () -> {
            check(order.status() == OrderStatus.PAID, "승인 뒤 배송 요청");
            deliveries.incrementAndGet();
        });
        check(order.status() == OrderStatus.PAID, "승인 상태");
        check(deliveries.get() == 1, "승인 배송 1회");
        System.out.println("PASS 승인: PAID, 배송 요청 1회");

        Order retryOrder = new Order(List.of(OrderItem.confirm(product, new Quantity(2))));
        AtomicInteger retryDeliveries = new AtomicInteger();
        retryOrder.pay(false, retryDeliveries::incrementAndGet);
        check(retryOrder.status() == OrderStatus.PENDING_PAYMENT, "거절 상태");
        check(retryDeliveries.get() == 0, "거절 배송 금지");
        System.out.println("PASS 거절: PENDING_PAYMENT, 배송 요청 0회");
        retryOrder.pay(true, retryDeliveries::incrementAndGet);
        check(retryOrder.status() == OrderStatus.PAID, "같은 주문 재결제");
        check(retryDeliveries.get() == 1, "재결제 배송 1회");
        System.out.println("PASS 재결제: 같은 주문 PAID, 배송 요청 1회");
    }

    private static void check(boolean condition, String description) {
        if (!condition) throw new AssertionError(description);
    }
}

record Money(int won) {}
record Quantity(int count) {}

final class Product {
    Money salePrice;

    Product(Money salePrice) {
        this.salePrice = salePrice;
    }
}

final class OrderItem {
    private final Money unitPrice;
    private final Quantity quantity;

    private OrderItem(Money unitPrice, Quantity quantity) {
        this.unitPrice = unitPrice;
        this.quantity = quantity;
    }

    static OrderItem confirm(Product product, Quantity quantity) {
        return new OrderItem(new Money(product.salePrice.won()), quantity);
    }

    Money unitPrice() {
        return unitPrice;
    }

    Money totalAmount() {
        return new Money(unitPrice.won() * quantity.count());
    }
}

enum OrderStatus { PENDING_PAYMENT, PAID, IN_DELIVERY, DELIVERED, CANCELLED }

final class Order {
    private final List<OrderItem> items;
    private OrderStatus status = OrderStatus.PENDING_PAYMENT;

    Order(List<OrderItem> items) {
        if (items.isEmpty()) throw new IllegalArgumentException("주문 항목은 하나 이상");
        this.items = List.copyOf(items);
    }

    Money totalAmount() {
        return new Money(items.stream().mapToInt(item -> item.totalAmount().won()).sum());
    }

    OrderStatus status() {
        return status;
    }

    // 사전조건: 결제대기 주문에 도착한 결제 결과를 한 번 처리한다.
    void pay(boolean approved, Runnable requestDelivery) {
        if (approved) {
            onPaid();
            requestDelivery.run();
        }
    }

    private void onPaid() {
        status = OrderStatus.PAID;
    }
}
