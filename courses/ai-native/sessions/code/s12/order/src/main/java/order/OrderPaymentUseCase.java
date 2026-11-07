package order;

public interface OrderPaymentUseCase {
    PayOrderResult payOrder(PayOrderCommand command);
}
