package order;

public interface OrderPlacementUseCase {
    CreateOrderResult createOrder(CreateOrderCommand command);
}
