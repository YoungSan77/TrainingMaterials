package test;
import order.Order;
import order.OrderService;
import order.OrderStatus;
import payment.Money;
import payment.PaymentMethod;
import delivery.Address;
import persistence.MemoryOrderRepository;
import paymentadapter.PaymentAdapter;
import deliveryadapter.DeliveryAdapter;
import java.util.concurrent.atomic.AtomicInteger;

public final class ArchitectureExample {
    public static void main(String[] args) {
        MemoryOrderRepository repository = new MemoryOrderRepository();
        Order order = new Order(new Money(2000), new Address("서울"));
        repository.save("demo", order);
        AtomicInteger deliveries = new AtomicInteger();
        OrderService rejected = new OrderService(repository,
            new PaymentAdapter((amount, method) -> {
                check(amount.won() == 2000, "거절 요청 금액");
                return false;
            }), new DeliveryAdapter((number, address) -> deliveries.incrementAndGet()));
        rejected.pay("demo", new PaymentMethod("카드1"));
        check(order.status() == OrderStatus.PENDING_PAYMENT, "거절 상태");
        check(deliveries.get() == 0, "승인 전 배송 금지");
        System.out.println("PASS 거절: 결제대기, 배송 0회");
        OrderService approved = new OrderService(repository,
            new PaymentAdapter((amount, method) -> {
                check(amount.won() == 2000, "승인 요청 금액");
                return true;
            }), new DeliveryAdapter((number, address) -> {
                check(order.status() == OrderStatus.PAID, "상태 변경 뒤 배송");
                check(address.value().equals("서울"), "배송지");
                deliveries.incrementAndGet();
            }));
        approved.pay("demo", new PaymentMethod("카드2"));
        check(order.status() == OrderStatus.PAID, "승인 상태");
        check(deliveries.get() == 1, "배송 1회");
        System.out.println("PASS 재결제 승인: 2000원, 결제완료 후 서울 배송 1회");
    }
    private static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }
}
