package order;

// 주문을 찾고 저장하는 약속. 저장 기술은 이 약속 밖에 둔다.
public interface OrderRepository {
    Order findBy(OrderNumber number);
    void save(Order order);
}
