package order;

import java.util.List;
import java.util.Objects;

import product.Money;
import product.ProductGateway;

public final class OrderApplicationService implements OrderPlacementUseCase {
    private final OrderRepository orderRepository;
    private final ProductGateway productGateway;

    public OrderApplicationService(OrderRepository orderRepository, ProductGateway productGateway) {
        this.orderRepository = Objects.requireNonNull(orderRepository, "orderRepository must not be null");
        this.productGateway = Objects.requireNonNull(productGateway, "productGateway must not be null");
    }

    @Override
    public CreateOrderResult createOrder(CreateOrderCommand command) {
        Objects.requireNonNull(command, "command must not be null");

        List<PricedOrderItem> pricedItems = command.items().stream()
            .map(item -> {
                Money salePrice = productGateway.findCurrentSalePrice(item.productNumber());
                if (salePrice == null) {
                    throw new IllegalStateException("Current sale price must be available");
                }
                return new PricedOrderItem(item.productNumber(), item.quantity(), salePrice);
            })
            .toList();

        Order order = Order.create(command.orderNumber(), pricedItems, command.shippingAddress());
        orderRepository.save(order);
        return new CreateOrderResult(order);
    }
}
