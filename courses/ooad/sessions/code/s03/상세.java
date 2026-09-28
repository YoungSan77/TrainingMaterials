// "03. 정적 모델 — 도메인 개념과 관계"의 도메인 모델 상세화를 옮긴 코드와 규칙 테스트.
// 실행: javac -encoding UTF-8 상세.java && java 도메인모델테스트
import java.util.*;

final class 규칙 {
    static void 확인(boolean 참, String 규칙) {
        if (!참) throw new IllegalArgumentException(규칙);
    }
}

record 수량(int 값) {
    수량 { 규칙.확인(값 >= 1, "수량은 1 이상"); }
}
record 금액(int 원) {
    금액 { 규칙.확인(원 >= 0, "금액은 0 이상"); }
    금액 더한다(금액 다른) { return new 금액(원 + 다른.원); }
    금액 곱한다(수량 수량) { return new 금액(원 * 수량.값()); }
}
record 주소(String 값) {}
enum 주문상태 { 결제대기, 결제완료, 배송중, 배송완료, 취소됨 }

final class 주문항목 {
    private final 상품 상품;
    private final 수량 수량;
    private final 금액 단가;

    주문항목(상품 상품, 수량 수량, 금액 단가) {
        this.상품 = 상품;
        this.수량 = 수량;
        this.단가 = 단가;
    }
    금액 금액() { return 단가.곱한다(수량); }
}

final class 결제 {
    private final 금액 결제금액;

    결제(금액 결제금액) { this.결제금액 = 결제금액; }
    금액 결제금액() { return 결제금액; }
}

final class 환불 {
    private final 결제 결제;
    private final 금액 환불금액;

    환불(결제 결제, 금액 환불금액) {
        규칙.확인(환불금액.원() <= 결제.결제금액().원(),
                "환불 금액 ≤ 결제 금액");
        this.결제 = 결제;
        this.환불금액 = 환불금액;
    }
}

final class 고객 {
    private final String 이름;

    고객(String 이름) { this.이름 = 이름; }
}

final class 상품 {
    final String 상품명;
    금액 판매가;

    상품(String 상품명, 금액 판매가) {
        this.상품명 = 상품명;
        this.판매가 = 판매가;
    }
}

final class 주문 {
    final 고객 고객;
    final List<주문항목> 항목들 = new ArrayList<>();
    주소 배송지;
    주문상태 상태 = 주문상태.결제대기;
    Optional<결제> 결제 = Optional.empty();

    주문(고객 고객, Map<상품, 수량> 담은것, 주소 배송지) {
        규칙.확인(!담은것.isEmpty(), "주문 항목은 1개 이상");
        this.고객 = 고객;
        this.배송지 = 배송지;
        담은것.forEach((상품, 수량) ->
                항목들.add(new 주문항목(상품, 수량, 상품.판매가)));
    }

    금액 주문총액() {
        금액 합계 = new 금액(0);
        for (주문항목 항목 : 항목들) 합계 = 합계.더한다(항목.금액());
        return 합계;
    }
}

class 도메인모델테스트 {
    public static void main(String[] args) {
        var 펜 = new 상품("펜", new 금액(1000));
        var 주문 = new 주문(new 고객("김"), Map.of(펜, new 수량(2)), new 주소("서울"));
        확인(주문.주문총액().equals(new 금액(2000)));

        펜.판매가 = new 금액(1500);
        확인(주문.주문총액().equals(new 금액(2000)));

        거절(() -> new 수량(0));
        거절(() -> new 주문(new 고객("김"), Map.of(), new 주소("서울")));
        거절(() -> new 환불(new 결제(new 금액(2000)), new 금액(3000)));
        System.out.println("정적 모델 규칙 확인");
    }

    static void 확인(boolean 조건) {
        if (!조건) throw new AssertionError("규칙 위반");
    }
    static void 거절(Runnable 행위) {
        try { 행위.run(); } catch (IllegalArgumentException 기대한거절) { return; }
        throw new AssertionError("거절되어야 한다");
    }
}
