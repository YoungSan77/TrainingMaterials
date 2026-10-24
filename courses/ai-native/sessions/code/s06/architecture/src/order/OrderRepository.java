package order;
public interface OrderRepository {
    Order findBy(String orderNumber);
    void save(String orderNumber, Order order);
}
