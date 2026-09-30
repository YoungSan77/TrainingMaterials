package persistence;

import java.util.List;

// 물리 모델: orders 테이블의 한 행과 그 항목들. 상태는 이름으로 저장한다.
public record OrderRow(String orderNumber, String status, String shippingAddress, List<ItemRow> items) {}
