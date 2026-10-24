package persistence;
import java.util.Map;
import java.util.HashMap;
import order.Order;
import order.OrderRepository;
public final class MemoryOrderRepository implements OrderRepository {
    private final Map<String, Order> orders = new HashMap<>();
    public Order findBy(String orderNumber) { return orders.get(orderNumber); }
    public void save(String orderNumber, Order order) { orders.put(orderNumber, order); }
}
