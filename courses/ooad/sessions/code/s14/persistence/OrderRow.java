package persistence;

import java.util.List;

// 물리 모델: orders 테이블의 한 행과 그 항목들. 상태는 이름으로 저장한다.
// 결제 금액·배송 번호·배송 대행사는 결제 뒤에만 값이 있다(결제 전에는 null).
public record OrderRow(String orderNumber, String status, String shippingAddress, List<ItemRow> items,
                       Integer paymentAmountWon, String deliveryNumber, String carrier) {}
