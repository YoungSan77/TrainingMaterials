// "05. 구조적 경계와 의존성"의 패키지 경계와 의존 방향을 옮긴 코드와 테스트.
// 실행(code/s05에서): javac -encoding UTF-8 -d out $(find . -name "*.java") && java -cp out 테스트.경계테스트
package 테스트;

import java.nio.file.*;
import java.util.*;
import 결제.결제;
import 결제.결제시스템;
import 결제.금액;
import 배송.배송;
import 배송.배송시스템;
import 배송연동.배송연동;
import 배송연동.배송시스템API;
import 주문.주문;
import 주문.주문상태;

public class 경계테스트 {
    public static void main(String[] args) throws Exception {
        // 1. 연동 없이 주문 규칙을 검증한다 — 가짜 결제·배송 시스템
        var 요청 = new ArrayList<String>();
        결제시스템 가짜결제 = 금액 -> 요청.add("환불 " + 금액.원());
        배송시스템 가짜배송 = 번호 -> { 요청.add("출고 중단"); return true; };

        var 주문 = new 주문();
        주문.결제되었다(new 결제(new 금액(2000), 가짜결제), new 배송("배송-1", 가짜배송));
        주문.취소한다();
        확인(주문.상태() == 주문상태.취소처리중);
        확인(요청.equals(List.of("출고 중단", "환불 2000")));

        // 2. 배송 연동은 외부 형식을 주문의 사건으로 옮긴다
        var 외부요청 = new ArrayList<String>();
        배송시스템API api = (명령, 번호) -> { 외부요청.add(명령 + " " + 번호); return "ACCEPTED"; };
        var 연동 = new 배송연동(api);
        var 배송될주문 = new 주문();
        배송될주문.결제되었다(new 결제(new 금액(1000), 가짜결제), new 배송("배송-2", 연동));
        연동.통보를받는다("PICKING", 배송될주문);
        확인(배송될주문.상태() == 주문상태.결제완료);
        연동.통보를받는다("DISPATCHED", 배송될주문);
        확인(배송될주문.상태() == 주문상태.배송중);

        // 3. 구조 제약 — 업무 패키지는 연동 패키지를 import하지 않는다
        for (String 업무 : List.of("주문", "결제", "배송"))
            try (var 파일들 = Files.list(Path.of(업무))) {
                for (Path 파일 : 파일들.toList()) {
                    String 원본 = Files.readString(파일);
                    확인(!원본.contains("import 결제연동") && !원본.contains("import 배송연동"));
                }
            }
        System.out.println("경계 확인");
    }

    static void 확인(boolean 조건) {
        if (!조건) throw new AssertionError("규칙 위반");
    }
}
