package persistence;

import java.util.HashMap;
import java.util.Map;
import order.Order;
import order.OrderNumber;
import order.OrderRepository;

// 주문을 저장하는 영속. 업무 패키지는 order.OrderRepository만 알고 이 클래스를 알지 않는다.
public class OrderStore implements OrderRepository {
    private final Map<String, Order> stored = new HashMap<>();

    @Override
    public Order findBy(OrderNumber number) {
        Order order = stored.get(number.value());
        if (order == null) throw new IllegalArgumentException("없는 주문: " + number.value());
        return order;
    }

    @Override
    public void save(Order order) {
        stored.put(order.number().value(), order);
    }
}
