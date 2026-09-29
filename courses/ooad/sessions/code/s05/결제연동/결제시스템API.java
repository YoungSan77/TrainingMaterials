package 결제연동;

// 결제 시스템이 정한 요청 형식. 이 형식은 결제 연동 밖으로 나가지 않는다.
public interface 결제시스템API {
    void 요청(String 명령, int 금액);
}
