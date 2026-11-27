package order;

import java.util.List;

/**
 * 주문 항목의 금액 합계를 계산한다.
 *
 * <p>실습 환경을 확인하기 위한 최소 코드다. 컴파일·정적 검사·테스트가 실제로
 * 돌아가는지 보는 것이 목적이며, 금액 계산 책임의 위치는 설계 실습에서 정한다.</p>
 */
public final class ItemAmountCalculator {

    private ItemAmountCalculator() {
    }

    /**
     * 단가와 수량의 곱을 모두 더한다.
     *
     * @param lines 주문 항목
     * @return 상품 금액 합계
     */
    public static long sum(List<OrderLine> lines) {
        long total = 0;
        for (OrderLine line : lines) {
            total += line.unitPrice() * line.quantity();
        }
        return total;
    }
}
