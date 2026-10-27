package persistence;

import java.util.HashMap;
import java.util.Map;
import order.Order;
import order.OrderNumber;
import order.OrderRepository;

public final class MemoryOrderRepository implements OrderRepository {
    private final Map<OrderNumber, Order> orders = new HashMap<>();
    public Order findBy(OrderNumber number) { return orders.get(number); }
    public void save(Order order) { orders.put(order.number(), order); }
}
