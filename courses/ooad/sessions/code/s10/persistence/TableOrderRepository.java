package persistence;

import java.util.HashMap;
import java.util.Map;
import order.Order;
import order.OrderNumber;
import order.OrderRepository;

// 주문 저장소의 실현. 테이블은 행의 맵으로 흉내 낸다(교육용).
public final class TableOrderRepository implements OrderRepository {
    private final Map<String, OrderRow> orders = new HashMap<>();
    private final OrderMapper mapper = new OrderMapper();

    @Override
    public Order findBy(OrderNumber number) {
        return mapper.toOrder(orders.get(number.value()));
    }
    @Override
    public void save(Order order) {
        orders.put(order.number().value(), mapper.toRow(order));
    }
}
