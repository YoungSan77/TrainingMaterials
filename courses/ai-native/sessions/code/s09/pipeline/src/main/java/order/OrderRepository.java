package order;

public interface OrderRepository {
    Order findBy(OrderNumber orderNumber);

    void save(Order order);
}
