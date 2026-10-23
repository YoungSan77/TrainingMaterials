// production-enum-baseline: exclude — 첫 시도에서 AI가 만든 취소 상태를 보여 주는 의도적 오답 예시다.
package order;

public enum OrderStatus { PENDING_PAYMENT, PAID, IN_DELIVERY, DELIVERED, CANCELLED }
