import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public final class AcceptanceExamples {
    public static void main(String[] args) {
        approved();
        salePriceChanged();
        rejected();
        paidWithAnotherCard();
    }

    static void approved() {
        Fixture f = new Fixture();
        f.service.pay(new PaymentMethod("카드 X"));
        equal(OrderStatus.PAID, f.order.status, "승인 상태");
        equal(List.of(new Money(2000)), f.payment.requestedAmounts, "승인 요청 금액");
        equal(1, f.delivery.requests, "승인 후 배송 횟수");
        equal("서울", f.delivery.shippingAddress.value(), "배송지");
        System.out.println("PASS 승인");
    }

    static void salePriceChanged() {
        Fixture f = new Fixture();
        f.pen.salePrice = new Money(1200);
        f.service.pay(new PaymentMethod("카드 X"));
        equal(new Money(1000), f.order.items.get(0).unitPrice, "확정 단가");
        equal(new Money(2000), f.order.totalAmount(), "주문 금액");
        equal(List.of(new Money(2000)), f.payment.requestedAmounts, "요청 금액");
        System.out.println("PASS 가격 변경");
    }

    static void rejected() {
        Fixture f = new Fixture();
        f.payment.rejectedCards = Set.of("카드 X");
        f.service.pay(new PaymentMethod("카드 X"));
        equal(OrderStatus.PENDING_PAYMENT, f.order.status, "거절 상태");
        equal(new Money(2000), f.order.totalAmount(), "거절 뒤 금액");
        equal(0, f.delivery.requests, "승인 전 배송 금지");
        System.out.println("PASS 거절");
    }

    static void paidWithAnotherCard() {
        Fixture f = new Fixture();
        f.payment.rejectedCards = Set.of("카드 X");
        f.service.pay(new PaymentMethod("카드 X"));
        equal(OrderStatus.PENDING_PAYMENT, f.order.status, "재결제 전 상태");
        equal(0, f.delivery.requests, "거절 뒤 배송 금지");
        f.service.pay(new PaymentMethod("카드 Y"));
        equal(OrderStatus.PAID, f.order.status, "같은 주문 재결제 상태");
        equal(List.of("카드 X", "카드 Y"), f.payment.requestedCards, "다른 카드 사용");
        equal(1, f.delivery.requests, "재결제 승인 뒤 배송 횟수");
        System.out.println("PASS 재결제");
    }

    static void equal(Object expected, Object actual, String meaning) {
        if (!expected.equals(actual)) {
            throw new AssertionError(meaning + ": expected=" + expected + ", actual=" + actual);
        }
    }

    record Money(int won) {}
    record Quantity(int value) {}
    record Address(String value) {}
    record PaymentMethod(String value) {}
    enum OrderStatus { PENDING_PAYMENT, PAID, IN_DELIVERY, DELIVERED, CANCELLED }

    static final class Product {
        Money salePrice;
        Product(Money salePrice) { this.salePrice = salePrice; }
    }
    static final class OrderItem {
        final Money unitPrice;
        final Quantity quantity;
        private OrderItem(Money unitPrice, Quantity quantity) {
            this.unitPrice = unitPrice;
            this.quantity = quantity;
        }
        static OrderItem confirm(Product product, Quantity quantity) {
            return new OrderItem(new Money(product.salePrice.won()), quantity);
        }
    }
    static final class Order {
        final String number;
        final List<OrderItem> items;
        final Address shippingAddress;
        OrderStatus status = OrderStatus.PENDING_PAYMENT;
        Order(String number, List<OrderItem> items, Address shippingAddress) {
            this.number = number;
            if (items.isEmpty()) throw new IllegalArgumentException("항목 하나 이상");
            this.items = List.copyOf(items);
            this.shippingAddress = shippingAddress;
        }
        Money totalAmount() {
            return new Money(items.stream().mapToInt(i -> i.unitPrice.won() * i.quantity.value()).sum());
        }
        void onPaid() { status = OrderStatus.PAID; }
    }
    interface PaymentGateway {
        boolean requestApproval(Money amount, PaymentMethod method);
    }
    interface DeliveryGateway {
        void requestDelivery(String orderNumber, Address shippingAddress);
    }
    static final class OrderService {
        final Order order;
        final PaymentGateway payment;
        final DeliveryGateway delivery;
        OrderService(Order order, PaymentGateway payment, DeliveryGateway delivery) {
            this.order = order;
            this.payment = payment;
            this.delivery = delivery;
        }
        void pay(PaymentMethod method) {
            if (payment.requestApproval(order.totalAmount(), method)) {
                order.onPaid();
                delivery.requestDelivery(order.number, order.shippingAddress);
            }
        }
    }
    static final class FakePayment implements PaymentGateway {
        Set<String> rejectedCards = Set.of();
        final List<Money> requestedAmounts = new ArrayList<>();
        final List<String> requestedCards = new ArrayList<>();
        public boolean requestApproval(Money amount, PaymentMethod method) {
            requestedAmounts.add(amount);
            requestedCards.add(method.value());
            return !rejectedCards.contains(method.value());
        }
    }
    static final class FakeDelivery implements DeliveryGateway {
        final Order order;
        int requests;
        Address shippingAddress;
        FakeDelivery(Order order) { this.order = order; }
        public void requestDelivery(String orderNumber, Address shippingAddress) {
            equal(order.number, orderNumber, "배송 요청 주문 식별");
            equal(OrderStatus.PAID, order.status, "상태 변경 뒤 배송");
            requests++;
            this.shippingAddress = shippingAddress;
        }
    }
    static final class Fixture {
        final Product pen = new Product(new Money(1000));
        final Order order = new Order("demo", List.of(OrderItem.confirm(pen, new Quantity(2))), new Address("서울"));
        final FakePayment payment = new FakePayment();
        final FakeDelivery delivery = new FakeDelivery(order);
        final OrderService service = new OrderService(order, payment, delivery);
    }
}
