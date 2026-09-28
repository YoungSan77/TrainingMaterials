// "03. 정적 모델 — 도메인 개념과 관계"의 관계 유형을 옮긴 코드.
// 실행: javac -encoding UTF-8 관계유형.java
import java.util.*;

final class 고객 {
    private final String 이름;
    고객(String 이름) { this.이름 = 이름; }
}
final class 상품 {
    private final String 상품명;
    상품(String 상품명) { this.상품명 = 상품명; }
}
final class 주문항목 {
    private final 상품 상품;
    private final int 수량;
    주문항목(상품 상품, int 수량) { this.상품 = 상품; this.수량 = 수량; }
}
interface 할인정책 { int 할인액(주문 주문); }

class 상품카탈로그 {
    final List<상품> 상품들 = new ArrayList<>();
}

class 주문 {
    final 고객 고객;
    final List<주문항목> 항목들 = new ArrayList<>();
    주문(고객 고객) { this.고객 = 고객; }
    void 담는다(상품 상품, int 수량) {
        항목들.add(new 주문항목(상품, 수량));
    }
    int 할인액(할인정책 정책) { return 정책.할인액(this); }
}

abstract class 결제 {}
class 카드결제 extends 결제 {}

interface 결제시스템 { boolean 승인한다(int 금액); }
class 결제대행 implements 결제시스템 {
    public boolean 승인한다(int 금액) { return true; }
}
