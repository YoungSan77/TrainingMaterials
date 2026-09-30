package persistence;

// 물리 모델: order_items 테이블의 한 행. 단가는 확정 값 그대로 저장한다.
public record ItemRow(String productNumber, int quantity, int unitPriceWon) {}
