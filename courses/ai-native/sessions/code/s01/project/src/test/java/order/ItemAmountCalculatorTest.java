package order;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/** 환경 검증용 테스트다. 업무 규칙의 테스트는 각 실습에서 수강생이 쓴다. */
class ItemAmountCalculatorTest {

    @Test
    @DisplayName("단가와 수량의 곱을 모두 더한다")
    void sumsUnitPriceTimesQuantity() {
        List<OrderLine> lines = List.of(new OrderLine(1000L, 2), new OrderLine(500L, 3));

        assertEquals(3500L, ItemAmountCalculator.sum(lines));
    }

    @Test
    @DisplayName("항목이 없으면 합계는 0이다")
    void sumsToZeroWhenNoLine() {
        assertEquals(0L, ItemAmountCalculator.sum(List.of()));
    }
}
