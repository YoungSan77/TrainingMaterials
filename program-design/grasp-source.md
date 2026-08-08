# GRASP·RDD 강의 소스 (교시 9 정본)

> 이 문서는 교시 9(책임 주도 설계 강의)의 **내용 정본**이다. Code는 이 소스를 슬라이드로 옮긴다 — 즉석 생성 금지. 설명 예제는 NewPOS(Larman), 실습만 Order.
> 서술 원칙: RDD가 주, GRASP·SOLID는 도구. 각 원칙 = 개념→문제→정보 소재 추론(설명 본체)→한계→다음 원칙 연결. 탈신비화(이미 하던 것의 명명).

---

## A. 책임 주도 설계 (RDD) — 본체

### A-1. 설계란 무엇인가
- 객체 설계 = **역할(객체)에게 책임을 나눠 주고, 그 책임을 완수하도록 협력을 짜는 일.** 데이터 구조를 그리는 게 아니라 책임을 배치하는 것이 설계다.
- 책임 두 종류(Larman): **doing 책임**(스스로 무언가를 함·다른 객체에 시킴)과 **knowing 책임**(자기 데이터·파생값·관계를 앎).
- 한계 인식: "무슨 클래스가 있나"가 아니라 "이 책임은 누가 지나"가 설계 질문이다.

### A-2. 왜 책임이 설계의 단위인가
- 같은 요구도 책임을 어디 두느냐로 설계가 갈린다 — 총액 계산을 바깥 서비스에 두면 절차적, Sale에 두면 객체적.
- 책임 배치는 **판단**이다. 정답표가 없다. 그래서 판단을 도울 도구가 필요하다 → GRASP.

### A-3. RDD를 하는 도구
- **GRASP**: 책임 할당 판단을 돕는 9개 관점(Larman 정리). **SOLID처럼 하나의 정돈된 틀이지 유일 정답이 아니다** — 널리 정설로 굳지 않았지만, 책임을 명료하게 사고하는 검증된 렌즈.
- **SOLID**를 함께 엮는다: GRASP가 "책임을 어디 둘까"라면 SOLID(특히 SRP·DIP)는 "그 배치가 변화에 견디나"의 원칙. 둘은 같은 OOD를 두 각도에서 본다.
- **DbC(operation contracts)**: 책임에는 계약이 따른다 — 사전조건·사후조건. Larman은 유스케이스 연산 계약에서 이를 다룬다. 책임 배치(GRASP)와 책임의 계약(DbC)이 한 쌍.

---

## B. GRASP 핵심 6 (상세 — 개념·문제·정보 소재 추론·한계·연결)

### B-1. Information Expert
- **개념**: 책임을 그 수행에 필요한 **정보를 가진 클래스**에 준다("정보 있는 곳에 행위를").
- **문제(NewPOS)**: Sale의 총액(grand total)은 누가 계산하나?
- **정보 소재 추론(설명 본체)**: 필요한 정보를 나열하고 소재를 추적한다 —
  - 모든 SalesLineItem을 아는 자 → **Sale** → 총액 책임.
  - 소계(수량×단가) 계산 정보를 가진 자 → **SalesLineItem**(수량 보유) → 소계 책임.
  - 단가를 아는 자 → **ProductDescription** → 가격 제공.
  - → 셋이 각자 아는 만큼 나눠 갖고 협력한다. **코드는 이 추론의 결론일 뿐.**
```java
class Sale {
    private List<SalesLineItem> lineItems;
    public Money getTotal() {
        Money total = Money.ZERO;
        for (SalesLineItem li : lineItems)
            total = total.add(li.getSubtotal());   // 각 라인에 물어본다
        return total;
    }
}
class SalesLineItem {
    private int quantity;
    private ProductDescription description;
    public Money getSubtotal() {
        return description.getPrice().times(quantity);
    }
}
class ProductDescription {
    private Money price;
    public Money getPrice() { return price; }
}
```
- **한계(Larman contraindication)**: 정보를 가졌다고 늘 책임을 주면 안 된다. DB 저장 책임을 "저장할 데이터를 가진" Sale에 주면 Sale이 SQL·트랜잭션을 알게 되어 **응집이 무너지고 도메인이 인프라에 결합**된다.
- **다음**: 이 한계가 **Pure Fabrication**을 부른다(저장 책임을 인공 객체로).

### B-2. Creator
- **개념**: B를 생성할 책임은, B를 담거나·집약하거나·긴밀히 쓰거나·초기화 정보를 가진 A에게.
- **문제(NewPOS)**: SalesLineItem을 누가 생성하나?
- **추론**: Sale이 SalesLineItem을 집약하고(포함) 생성에 필요한 정보를 안다 → **Sale이 makeLineItem() 책임.** 바깥이 조립하면 Sale 내부 구성 규칙이 밖으로 샌다.
- **한계**: 생성 로직이 복잡하거나(조건부 타입 선택) 재료가 여러 곳에 흩어지면 Creator가 억지가 된다.
- **다음**: 복잡 생성 → Factory(디자인 패턴)로. GRASP가 패턴을 부르는 첫 지점.

### B-3. Controller
- **개념**: 시스템 이벤트(UI가 던지는 요청)를 받을 첫 객체는 UI가 아니라 **도메인 경계의 컨트롤러**(전체 시스템 대표 객체 or 유스케이스 핸들러).
- **문제(NewPOS)**: enterItem·endSale 같은 시스템 연산을 누가 받나?
- **추론**: UI가 직접 도메인을 헤집으면 UI에 업무 로직이 샌다. Register(또는 ProcessSaleHandler)가 이벤트를 받아 도메인에 위임 → UI와 도메인이 분리된다.
```java
class Register {                       // Controller
    private Sale currentSale;
    public void enterItem(ItemID id, int qty) {
        ProductDescription d = catalog.find(id);
        currentSale.makeLineItem(d, qty);   // 도메인에 위임
    }
}
```
- **한계**: 한 컨트롤러가 모든 연산을 받으면 비대해진다(bloated controller) — 저응집.
- **다음**: 유스케이스별 분리 → Application Service 층으로. **아키텍처 과정의 Use Case Interactor가 여기서 재정박된다**(forward-ref).

### B-4. Low Coupling
- **개념**: 요소 간 의존을 낮게 — 한 곳의 변화가 번지지 않도록.
- **문제**: 결제 처리를 Sale이 직접 특정 결제 구현에 의존하면, 결제가 바뀔 때 Sale이 흔들린다.
- **추론**: Sale은 Payment의 **역할(인터페이스)**만 알고 구현을 모른다 → 결제 구현 교체가 Sale에 무영향.
- **한계**: 결합을 0으로 추구하면 오히려 인공 중개가 늘어 이해가 어려워진다 — 낮은 결합도 **정도의 판단**이다.
- **다음**: 변화 지점 격리 → Protected Variations·DIP(아키텍처 의존성 규칙, forward-ref).

### B-5. High Cohesion
- **개념**: 한 요소는 밀접히 관련된 책임만 — 한 가지를 잘하게.
- **문제**: 한 클래스가 주문·결제·배송·저장을 다 하면(저응집) 이해·변경·재사용이 다 어렵다.
- **추론**: 책임을 응집 단위로 쪼갠다 — Sale(주문), Payment(결제), Shipment(배송). Low Coupling과 짝: 보통 함께 개선되고 함께 판단한다.
- **한계**: 지나치게 잘게 쪼개면 협력 비용(객체 수·간접)이 커진다 — 응집도 정도의 판단.
- **다음**: 도메인에 안 맞는 응집 덩어리(예: 저장) → Pure Fabrication.

### B-6. Polymorphism
- **개념**: 타입에 따라 동작이 갈릴 때 **조건 분기 대신 다형성**으로. 타입별 변형을 인터페이스·오버라이드에 맡긴다.
- **문제(NewPOS)**: 결제 수단(현금·카드·수표)마다 처리가 다르다. `if (type==CASH)...else if(CARD)...`가 곳곳에 번진다.
- **추론**: Payment를 다형 타입으로 — CashPayment·CreditPayment가 각자 authorize()를 구현. 새 결제 수단이 생겨도 분기문을 안 고친다(추가만).
```java
interface Payment { AuthResult authorize(Money amt); }
class CashPayment   implements Payment { ... }
class CreditPayment implements Payment { ... }
// 호출부: payment.authorize(total) — 분기 없음
```
- **한계**: 변형이 하나뿐이거나 안 늘면 다형성은 과잉(불필요한 계층).
- **다음**: 변형을 인터페이스 뒤로 감추는 일반화 → **Protected Variations**, 그리고 Strategy(디자인 패턴).

---

## C. GRASP 개념 3 (간단 — 의도적 조작 부류: 원칙을 일부러 거스른다)
> 이 셋은 정보에 충실한 배치가 아니라, 그 배치가 결합·응집을 해칠 때 **일부러 도메인에 없는 인공물·간접층을 만드는** 의도적 조작이다(DIP처럼).

### C-1. Pure Fabrication
- 정의: 도메인 개념이 아닌 **인공 클래스**를 지어 책임을 맡긴다 — 응집·재사용·낮은 결합을 위해.
- 예(NewPOS): 영속성. Sale에 저장을 두면 응집이 깨지니, `PersistentStorage`/Repository라는 도메인 밖 인공물에 저장 책임을 위임. (B-1의 한계가 부른 해법)
- 왜: 정보 전문가 배치(Expert)가 응집을 해칠 때, 순수 조작 객체가 도메인 순수성을 지킨다.

### C-2. Indirection
- 정의: 두 요소의 **직접 결합을 피하려 중개자**를 둔다.
- 예: Controller가 UI와 도메인 사이에 서는 것, Adapter가 도메인과 외부 API 사이에 서는 것.
- 왜: 직접 의존을 끊어 변화 격리 — Pure Fabrication과 자주 겹친다(중개자가 곧 인공물).

### C-3. Protected Variations
- 정의: **변화가 예상되는 지점을 안정된 인터페이스로 감싸** 그 변화가 밖으로 번지지 않게 한다.
- 예: 결제 구현 변화를 Payment 인터페이스로, 외부 세금 계산 변화를 어댑터로 감싼다.
- 왜: Low Coupling·Polymorphism·Indirection의 상위 동기 — **DIP·OCP와 같은 뿌리.** 아키텍처의 의존성 규칙이 이 원칙의 구조 수준 실현.

---

## D. 원칙에서 패턴으로 (강의 닫기 — 다음 단계 복선)
- 원칙은 **단일 관점**의 판단이다. 현실 문제는 여러 관점이 얽혀 원칙 하나로 안 풀린다.
- 원칙들의 긴장을 상황에 맞게 조합한 정형 해법이 **디자인 패턴**(Factory=복잡 Creator, Strategy=Polymorphism+PV, Adapter=Indirection…), 더 큰 조합이 **아키텍처 패턴**.
- 그래서 순서: GRASP(원칙) → 디자인 패턴 → 아키텍처 패턴. **원칙을 알면 패턴을 유도하고, 모르면 암기한다.**
- **DDD를 부르는 복선**: GRASP/RDD는 "책임을 어디 둘까"까지 준다. 그러나 "무엇을 하나의 모델 단위(경계)로 볼까" — VO·Aggregate의 경계 — 는 안 준다. 이 공백이 다음 층(DDD)을 부른다. 개발자들은 이 문제를 이미 풀어왔지만 이름·일관성이 없었고, 에반스가 명명·패턴화했다.

---

## 슬라이드 변환 지침 (Code에게)
- A(RDD)를 강의 앞머리로 세운다 — RDD가 주, GRASP는 그 도구. RDD 없이 원칙부터 던지지 않는다.
- 핵심 6은 각 1~2장(개념+정보소재 추론+코드+한계). 코드는 NewPOS, 폰트를 낮춰서라도 실질 코드를 담는다(얇은 4줄 금지).
- 개념 3은 묶어서 1~2장(정의+한 예+왜). "의도적 조작 부류"임을 명시.
- D(원칙→패턴, DDD 복선)를 닫는 장으로.
- 자세·명제는 canon-stance 참조(교시1에서 선언, 여기선 반복 안 함).
- 분량이 1교시를 넘으면 강의를 2교시로 나눈다 — 시수는 소스 분량이 정한다(억지 압축 금지).
