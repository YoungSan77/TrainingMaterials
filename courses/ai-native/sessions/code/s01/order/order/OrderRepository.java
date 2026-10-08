package order;

public interface OrderRepository {
    Order findBy(OrderNumber number);
    void save(Order order);
}
