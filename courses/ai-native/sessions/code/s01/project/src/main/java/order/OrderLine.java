package order;

/**
 * 주문 항목 하나 — 확정된 단가와 수량이다.
 *
 * <p>실습 환경을 확인하기 위한 최소 코드이며 이 과정의 설계 결과가 아니다.
 * 도메인 모델과 설계는 해당 세션의 실습에서 수강생이 도출한다.</p>
 *
 * @param unitPrice 주문이 생기는 시점의 판매가를 굳힌 값
 * @param quantity 주문한 수량
 */
public record OrderLine(long unitPrice, int quantity) {
}
