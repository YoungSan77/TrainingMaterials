package order;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import delivery.DeliveryGateway;
import delivery.DeliveryRequest;
import payment.CardApprovalData;
import payment.CardApprovalRequest;
import payment.CardApprovalResult;
import payment.PaymentGateway;
import product.Money;
import product.ProductGateway;
import product.ProductNumber;

class OrderPaymentServiceTest {
    private static final ProductNumber PEN = new ProductNumber("pen");
    private static final TestCard CARD_X = new TestCard("X");
    private static final TestCard CARD_Y = new TestCard("Y");

    private final InMemoryProductGateway productGateway = new InMemoryProductGateway(Map.of(PEN, Money.won(1_000)));
    private final InMemoryOrderRepository orderRepository = new InMemoryOrderRepository();
    private final ScriptedPaymentGateway paymentGateway = new ScriptedPaymentGateway(Map.of(
        CARD_X, CardApprovalResult.DECLINED,
        CARD_Y, CardApprovalResult.APPROVED
    ));
    private final RecordingDeliveryGateway deliveryGateway = new RecordingDeliveryGateway();
    private final OrderApplicationService orderService = new OrderApplicationService(orderRepository, productGateway);
    private final OrderPaymentService paymentService =
        new OrderPaymentService(orderRepository, paymentGateway, deliveryGateway);

    @Test
    @DisplayName("결제대기 주문이 승인되면 결제완료가 되고 배송 요청이 1회 나간다")
    void approvedPaymentMarksOrderPaidAndRequestsDeliveryOnce() {
        OrderNumber orderNumber = placePenOrder("order-1");

        PayOrderResult result = paymentService.payOrder(new PayOrderCommand(orderNumber, CARD_Y));

        assertEquals(CardApprovalResult.APPROVED, result.cardApprovalResult(), "결제 승인 결과");
        assertEquals(OrderStatus.PAID, orderRepository.findBy(orderNumber).status(), "승인 뒤 상태");
        assertEquals(List.of(new DeliveryRequest("order-1", "Seoul")), deliveryGateway.requests(), "배송 요청");
    }

    @Test
    @DisplayName("결제 직전에 판매가가 1,200원이 되어도 승인 요청 금액은 2,000원이다")
    void approvalRequestUsesFixedTotalAmountEvenWhenSalePriceChanges() {
        OrderNumber orderNumber = placePenOrder("order-2");
        productGateway.changeSalePrice(PEN, Money.won(1_200));

        paymentService.payOrder(new PayOrderCommand(orderNumber, CARD_Y));

        assertEquals(1, paymentGateway.requests().size(), "승인 요청 횟수");
        assertEquals(2_000, paymentGateway.requests().get(0).amount(), "승인 요청 금액");
        assertEquals(1, productGateway.calls(), "결제할 때는 판매가를 다시 조회하지 않는다");
    }

    @Test
    @DisplayName("결제가 거절되면 주문은 결제대기로 남고 배송 요청은 0회다")
    void declinedPaymentKeepsOrderPendingAndRequestsNoDelivery() {
        OrderNumber orderNumber = placePenOrder("order-3");

        PayOrderResult result = paymentService.payOrder(new PayOrderCommand(orderNumber, CARD_X));

        Order order = orderRepository.findBy(orderNumber);
        assertEquals(CardApprovalResult.DECLINED, result.cardApprovalResult(), "결제 승인 결과");
        assertEquals(OrderStatus.PENDING_PAYMENT, order.status(), "거절 뒤 상태");
        assertEquals(Money.won(1_000), order.items().get(0).unitPrice(), "거절 뒤 확정 단가");
        assertEquals(Money.won(2_000), order.totalAmount(), "거절 뒤 주문 금액");
        assertEquals(0, deliveryGateway.requests().size(), "배송 요청 횟수");
    }

    @Test
    @DisplayName("거절된 주문을 다른 카드로 다시 결제해 승인되면 결제완료가 되고 배송 요청은 총 1회다")
    void declinedOrderCanBePaidAgainWithAnotherCard() {
        OrderNumber orderNumber = placePenOrder("order-4");

        paymentService.payOrder(new PayOrderCommand(orderNumber, CARD_X));
        PayOrderResult result = paymentService.payOrder(new PayOrderCommand(orderNumber, CARD_Y));

        assertEquals(CardApprovalResult.APPROVED, result.cardApprovalResult(), "재결제 승인 결과");
        assertEquals(OrderStatus.PAID, orderRepository.findBy(orderNumber).status(), "재결제 뒤 상태");
        assertEquals(List.of(CARD_X, CARD_Y),
            paymentGateway.requests().stream().map(CardApprovalRequest::cardApprovalData).toList(), "결제에 쓴 카드");
        assertEquals(List.of(2_000L, 2_000L),
            paymentGateway.requests().stream().map(CardApprovalRequest::amount).toList(), "같은 주문의 승인 요청 금액");
        assertEquals(List.of(new DeliveryRequest("order-4", "Seoul")), deliveryGateway.requests(), "배송 요청");
    }

    private OrderNumber placePenOrder(String number) {
        OrderNumber orderNumber = new OrderNumber(number);
        orderService.createOrder(new CreateOrderCommand(
            orderNumber,
            List.of(new OrderItemRequest(PEN, new Quantity(2))),
            new Address("Seoul")
        ));
        return orderNumber;
    }

    private record TestCard(String name) implements CardApprovalData {
    }

    private static final class InMemoryOrderRepository implements OrderRepository {
        private final Map<OrderNumber, Order> orders = new HashMap<>();

        @Override
        public Order findBy(OrderNumber orderNumber) {
            return orders.get(orderNumber);
        }

        @Override
        public void save(Order order) {
            orders.put(order.orderNumber(), order);
        }
    }

    private static final class InMemoryProductGateway implements ProductGateway {
        private final Map<ProductNumber, Money> salePrices;
        private int calls;

        private InMemoryProductGateway(Map<ProductNumber, Money> salePrices) {
            this.salePrices = new HashMap<>(salePrices);
        }

        @Override
        public Money findCurrentSalePrice(ProductNumber productNumber) {
            calls++;
            return salePrices.get(productNumber);
        }

        private void changeSalePrice(ProductNumber productNumber, Money salePrice) {
            salePrices.put(productNumber, salePrice);
        }

        private int calls() {
            return calls;
        }
    }

    private static final class ScriptedPaymentGateway implements PaymentGateway {
        private final Map<CardApprovalData, CardApprovalResult> resultsByCard;
        private final List<CardApprovalRequest> requests = new ArrayList<>();

        private ScriptedPaymentGateway(Map<CardApprovalData, CardApprovalResult> resultsByCard) {
            this.resultsByCard = resultsByCard;
        }

        @Override
        public CardApprovalResult approve(CardApprovalRequest request) {
            requests.add(request);
            return resultsByCard.get(request.cardApprovalData());
        }

        private List<CardApprovalRequest> requests() {
            return requests;
        }
    }

    private static final class RecordingDeliveryGateway implements DeliveryGateway {
        private final List<DeliveryRequest> requests = new ArrayList<>();

        @Override
        public void request(DeliveryRequest request) {
            requests.add(request);
        }

        private List<DeliveryRequest> requests() {
            return requests;
        }
    }
}
