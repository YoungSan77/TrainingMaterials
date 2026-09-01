# S10. OOAD Next Step ① — 개발·검증·DevOps

- **시간:** 70분
- **상태:** 사용자 승인본
- **핵심 질문:**  
  **S02~S09에서 만든 OOAD 결과는 구현에서 어떻게 구체화되고, 구현 중 얻은 evidence를 필요한 수준의 판단에 feedback하며, 개발 중 Test·Pre-commit Verification·CI/CD를 거쳐 운영으로 이어지는가?**

---

## 과정 목표 / Session Outcome

학습자는 S10 종료 시 다음을 할 수 있어야 한다.

- 설계 모델이 구현과 단절된 산출물이 아니라, Code의 중요한 구조·책임·협력·계약을 이해할 수 있는 abstraction임을 설명한다.
- Design Class Diagram, Sequence Diagram, Communication Diagram의 핵심 설계 의도가 Java Code에서 어떻게 구체화되는지 추적한다.
- 모델과 Code가 기계적으로 1:1 일치해야 하는 것은 아니며, 구현에는 모델에 표현할 필요가 없는 기술적 세부가 존재할 수 있음을 설명한다.
- 구현 중 발견된 이슈를 Code/Technical Design 수준에서 해결할 것인지, Design·Analysis·Architecture·Requirement 판단까지 다시 열 것인지 구분한다.
- 개발 중 Test, Pre-commit Verification, Commit 이후 CI Verification의 목적과 책임을 구분한다.
- JUnit Test가 설계에서 정의한 expected behavior와 contract를 executable evidence로 확인하는 방법을 설명한다.
- TDD의 `Red → Green → Refactor` cycle과 장점·한계를 설명하고, TDD가 Requirement·Analysis·Architecture·Object Design을 대체하지 않음을 설명한다.
- Refactoring의 trigger를 Model–Code 차이 자체가 아니라, behavior는 맞지만 현재 구조가 이해·변경 비용을 불필요하게 높이는지 여부로 판단한다.
- Refactoring과 Change·Correction/Rework를 구분하고, 재작업을 Refactoring이라는 이름으로 미화하지 않는다.
- CI/CD가 필요한 이유와 전제조건을 설명하고, CI가 품질을 처음 만들어내는 단계가 아님을 설명한다.
- CI/CD에서 반복 검증·이관되는 대표 품질 관점과 Java 생태계의 대표 도구를 연결한다.
- DevOps를 CI/CD 도구 적용이 아니라 Dev와 Ops 사이의 flow·feedback·shared responsibility·continuous improvement를 만드는 문화와 운영 방식으로 설명한다.

---

# 1. Session Position — OOAD Core에서 실행 가능한 Software로

```text
S02   Requirement
S03   Static Problem Understanding
S04   Dynamic Problem Understanding
S05   Initial Object Design
S06   Responsibility / Collaboration / Contract
S07   Variation / Local Refinement
S08   Alternative Evaluation / Design Decision
S09   Integrated OOAD

          ↓

S10   Development / Verification / DevOps
```

S02~S09는 **OOAD Core**다.

S10은 새로운 객체 설계 기법을 추가하는 세션이 아니다.

S09까지의 판단이 실제 구현·검증·운영 이관으로 어떻게 이어지는지를 다룬다.

> **OOAD의 결과는 구현과 단절된 산출물이 아니다. 설계 모델은 구현의 중요한 구조·책임·협력·계약을 이해할 수 있는 abstraction을 제공하고, Code는 여기에 구현 세부를 더해 실행 가능한 Software로 구체화한다.**

그러나:

> **모델과 Code가 기계적으로 동일해야 하는 것은 아니다. 중요한 것은 설계 의도를 Code에서 추적할 수 있고, 필요한 경우 구현 evidence를 바탕으로 앞선 판단을 다시 검토할 수 있는가이다.**

---

# 2. Session Thesis

S10 전체는 다음 8개의 engineering judgment로 구성한다.

```text
1. 설계에서 구현으로 무엇이 이어지는가?
2. 구현에서 무엇을 새로 판단해야 하는가?
3. 어떻게 가장 빨리 확인하는가?
4. 언제 구조를 개선하는가?
5. 언제 공유 가능한가?
6. 공유된 변경을 어떻게 통합 검증하는가?
7. 검증된 결과를 어떻게 운영으로 전달하는가?
8. 이 전체 흐름을 조직적으로 어떻게 개선하는가?
```

각 judgment는 다음 engineering practice와 연결된다.

```text
Design Model / Code
→ Developer Test / JUnit / TDD
→ Refactoring
→ Pre-commit Verification
→ CI
→ CD
→ DevOps
```

---

# 3. Boundary — 이 Session이 다루지 않는 것

S10은 다음 내용을 전문적으로 가르치지 않는다.

- Java language 자체와 syntax 교육
- Framework 사용법
- Git/GitHub 사용법
- GitHub Actions YAML 작성
- Jenkins Pipeline 작성
- 실제 CI/CD pipeline 구축 실습
- Docker / Kubernetes / Argo CD 상세 설정
- Cloud deployment architecture
- DevOps 조직 설계
- SRE / Observability / Incident Management 상세
- Deployment strategy 상세
- Recovery / operational learning 상세
- Test technique catalog
- Refactoring catalog
- TDD를 통한 전체 application 구현

대표 Java code와 tool 이름은 **OOAD 이후 연결을 이해시키는 evidence/example**로만 사용한다.

학습자에게 갑자기 Java application 구현을 요구하지 않는다.

---

# 4. Session Timebox — 총 70분

| 구간 | 내용 | 시간 |
|---|---|---:|
| Opening | OOAD Core → Next Step, Session Thesis | 4분 |
| Design Model → Code | Class / Sequence / Communication과 Java Code 연결 | 10분 |
| Implementation Judgment | Implementation Detail vs Upstream Judgment | 6분 |
| Developer Test / JUnit | 빠른 feedback, Object Contract/Expected Behavior → JUnit | 8분 |
| TDD | Red → Green → Refactor, 장점·한계·위치 | 6분 |
| Refactoring Judgment | 언제 구조를 개선하는가, Rework와 구분 | 6분 |
| Pre-commit Verification | 공유 전 개발자 책임과 검증 기준 | 6분 |
| CI | Why CI, Quality Gate, 대표 Java 도구 | 8분 |
| CD | Why CD, Artifact → Runtime, 대표 도구 | 5분 |
| DevOps | Strong Dev/Ops vs Weak Dev/Ops, culture/flow | 5분 |
| Evaluation + Summary | 핵심 Judgment 평가, S11 Handoff | 6분 |
| **합계** | | **70분** |

Formal coding practice는 두지 않는다.

Evaluation은 같은 Order 사례를 사용한 judgment check로 구성한다.

---

# 5. Judgment 1 — 설계에서 구현으로 무엇이 이어지는가?

S09까지 사용한 Order 설계를 그대로 가져온다.

## 5.1 Design Class Model

```text
OrderService
----------------------
+ placeOrder(order)

Order
----------------------
- status
+ place()

PaymentGateway
----------------------
+ pay(order)

OrderService → PaymentGateway
OrderService → Order
```

이 모델이 말하는 핵심 설계 판단은 다음과 같다.

- `OrderService`는 Place Order 흐름을 조정한다.
- `PaymentGateway`는 결제 collaborator의 boundary다.
- `Order`는 자신의 상태 변경 behavior를 소유한다.

## 5.2 Java Code

```java
class OrderService {
    private PaymentGateway gateway;

    void placeOrder(Order order) {
        gateway.pay(order);
        order.place();
    }
}

class Order {
    private OrderStatus status;

    void place() {
        status = OrderStatus.PLACED;
    }
}

interface PaymentGateway {
    void pay(Order order);
}
```

여기서 Java syntax를 가르치지 않는다.

```text
OrderService 책임
→ OrderService.placeOrder()

Payment variation boundary
→ PaymentGateway

Order 상태 변경 책임
→ Order.place()
```

> **Class Model을 보면 Code의 중요한 static structure와 responsibility allocation을 이해할 수 있어야 한다.**

단, local variable, exception type, framework annotation, persistence detail까지 모두 Class Model에 표현해야 한다는 뜻은 아니다.

---

# 6. Dynamic Design → Code Collaboration

같은 설계를 Sequence와 Communication 관점에서 본다.

## 6.1 Sequence Diagram

```text
OrderService        PaymentGateway          Order
     |                    |                   |
     |--- pay(order) ---->|                   |
     |<-------------------|                   |
     |------------ place() ------------------>|
     |<---------------------------------------|
```

## 6.2 Communication Diagram

```text
orderService
  1: pay(order)  → paymentGateway
  2: place()     → order
```

## 6.3 Java Code

```java
void placeOrder(Order order) {
    gateway.pay(order);
    order.place();
}
```

```text
Class Diagram
= 구조와 관계

Sequence Diagram
= 시간 순서의 Message

Communication Diagram
= Object 간 Collaboration

Code
= 이 설계 판단을 실행 가능한 형태로 구체화
```

> **Design Model을 통해 Code의 중요한 구조와 실행 협력을 읽을 수 있어야 한다.**

반대로 Code에 모델보다 기술적 세부가 더 많은 것은 정상이다.

---

# 7. Judgment 2 — 구현에서 무엇을 새로 판단해야 하는가?

Model → Code는 기계적 변환이 아니다.

구현 단계에서는 다음과 같은 세부가 추가된다.

```text
Algorithm
Data Structure
Exception Handling
Framework
Persistence
Transaction
External API
Concurrency
Performance
```

대부분은 모델에 다시 올릴 필요가 없는 implementation detail일 수 있다.

> **이 구현 이슈를 현재 수준에서 해결하면 되는가, 아니면 앞선 판단을 다시 열 만큼 중요한가?**

```text
Implementation detail
→ Code / Technical Design에서 해결

Responsibility·Collaboration 문제
→ Object Design 재검토

Domain meaning 문제
→ Analysis 재검토

System boundary·quality constraint 문제
→ Architecture 재검토

Required behavior 문제
→ Requirement 재검토
```

> **앞선 판단을 다시 수행하는 것과 산출물을 반드시 갱신하는 것은 같은 말이 아니다.**

모델 변경이 이후 communication·maintenance에 실제 가치가 있을 때 갱신한다.

---

# 8. Judgment 3 — 어떻게 가장 빨리 확인하는가?

```text
Code
↔ Run
↔ Debug
↔ Developer Test
```

> **코딩된 것은 가능한 한 빨리 실행하고 확인한다.**

이 단계의 Test는 downstream inspection이 아니다.

> **제대로 만들고 있는지를 확인하는 development feedback이다.**

---

# 9. Object Contract / Expected Behavior → JUnit Test

앞에서 이미 정의된 behavior를 사용한다.

```text
Order.place()

Expected Result
- Order.status = PLACED
```

Java:

```java
void place() {
    status = OrderStatus.PLACED;
}
```

JUnit:

```java
@Test
void place_changes_order_status() {
    Order order = new Order();

    order.place();

    assertEquals(PLACED, order.getStatus());
}
```

JUnit의 핵심 구성만 설명한다.

```text
@Test
→ 하나의 executable Test case

Arrange
→ Order 준비

Act
→ order.place()

Assert
→ expected state 확인
```

```text
Design Contract / Expected Behavior
        ↓
Production Code
        ↓
JUnit Test
```

> **Test는 설계와 별개로 생기는 산출물이 아니라, 구현된 behavior를 executable evidence로 확인하는 수단이다.**

---

# 10. Development-time Test

개발 중에는 다음 feedback loop를 가능한 짧게 유지한다.

```text
Code
→ Compile / Run
→ Debug
→ JUnit
→ Fix
→ Re-run
```

여기에서 개발자가 확인할 수 있는 문제를 CI까지 넘기지 않는다.

---

# 11. TDD — Feedback Loop를 짧게 운영하는 방법 중 하나

```text
RED
→ Test가 실패

GREEN
→ 필요한 behavior 구현

REFACTOR
→ 필요할 때 구조 개선
```

TDD의 contribution은:

> **Test를 executable feedback으로 개발 cycle의 매우 앞쪽에 둔 것**

이다.

하지만:

> **TDD는 Requirement·Analysis·Architecture·Object Design을 대체하지 않는다.**

좋은 OOAD 없이 Test만 먼저 작성한다고 좋은 구조가 자동으로 만들어지는 것도 아니다.

### 장점

- 빠른 executable feedback
- 작은 increment
- regression safety 조기 확보
- expected behavior 명시
- 변경에 대한 confidence 증가

### 한계

- 좋은 Requirement/Analysis/Design을 자동으로 만들지 않는다.
- local behavior에 과도하게 집중할 수 있다.
- testability 자체를 목표로 불필요한 abstraction을 만들 수 있다.
- 모든 개발 상황에 동일하게 적용할 필요는 없다.

---

# 12. Judgment 4 — 언제 구조를 개선하는가?

Refactoring의 질문은:

> **Model과 Code가 같은가?**

가 아니다.

> **현재 behavior는 맞지만 현재 코드 구조 때문에 앞으로의 이해·변경 비용이 불필요하게 높은가?**

Evidence 예:

- duplicated logic
- unnecessary coupling
- low cohesion
- confusing responsibility
- repeated change impact
- 지나치게 복잡한 method
- 안전한 변경을 어렵게 하는 구조

`duplicated logic`은 문법적으로 비슷한 코드 자체(Duplicate Syntax)가 아니라 같은 business rule이 여러 곳에서 각자 표현되고 있는지(Duplicate Knowledge)를 본다. 우연히 비슷해 보이는 코드까지 기계적으로 통합하지 않는다.

필요하면 설계 모델도 판단 evidence로 사용할 수 있다.

그러나 Model–Code 차이 자체가 Refactoring trigger는 아니다.

### 짧은 예

```java
void placeOrder(Order order) {
    gateway.pay(order);
    order.place();
    audit(order);
    notifyCustomer(order);
}
```

이 코드만 보고 즉시 분리하지 않는다.

```text
현재 구조가 아직 충분히 단순한가?
변경이 반복되면서 이 method가 계속 커지고 있는가?
책임 분리가 실제 변경 비용을 줄이는가?
새 abstraction의 비용보다 효과가 큰가?
```

필요성이 evidence로 확인될 때만 구조를 개선한다.

> **Refactoring은 behavior를 보존하면서 구조를 더 경제적으로 만드는 판단이다.**

---

# 13. Refactoring / Rework / Change 구분

```text
잘못 만든 behavior를 다시 고침
→ Correction / Rework

새 behavior 추가·변경
→ Change

Observable behavior 유지
+ Internal structure 개선
→ Refactoring
```

잘못된 Requirement·Analysis·Design·Implementation 때문에 다시 하는 작업에서 Refactoring technique을 사용할 수도 있다.

그러나 그 경제적 원인은 Rework다.

> **재작업을 Refactoring이라는 이름으로 미화하지 않는다.**

Refactoring은 iteration마다 반드시 수행하는 quota가 아니다.

---

# 14. Judgment 5 — 언제 공유 가능한가? Pre-commit Verification

```text
Development
    ↓
Developer Test
    ↓
Pre-commit Verification
    ↓
Commit
```

Pre-commit에서 가능한 범위의 품질을 확인한다.

```text
Compile / Build
JUnit / Regression
Coding Standard
Static Analysis
Dependency / Security Check
```

예:

```text
mvn test
mvn verify
```

> **Commit은 “CI에서 한번 검사해 달라”는 요청이 아니라, 개발자가 이 변경을 공유 가능한 상태라고 판단하는 경계다.**

---

# 15. Judgment 6 — 왜 CI인가?

여러 개발자의 변경이 합쳐진다.

```text
Developer A
Developer B
Developer C
      ↓
Shared Product
```

개별 변경이 정상이어도 integration에서는 깨질 수 있다.

```text
Commit / Push
    ↓
GitHub Actions / Jenkins
    ↓
Maven / Gradle
    ↓
JUnit
JaCoCo
Checkstyle
SpotBugs / PMD
SonarQube
SAST
SCA / OWASP Dependency-Check
    ↓
Build / Package
```

도구 사용법을 가르치는 것이 아니다.

> **무엇을 지속적으로 통합하고 어떤 품질 기준을 반복 검증해야 하는가?**

핵심 전제:

> **CI가 개발 품질을 처음 만드는 곳이 되어서는 안 된다.**

---

# 16. Judgment 7 — 왜 CD인가?

```text
Verified Artifact
→ Repository / Registry
→ Deployment
→ Runtime
```

대표 흐름:

```text
JAR / Container Image
        ↓
Artifact Repository / Container Registry
        ↓
GitHub Actions / Jenkins / Argo CD
        ↓
Runtime / Kubernetes
        ↓
Operation
```

S10에서는 각각의 사용법은 다루지 않는다.

> **검증된 결과를 운영 환경으로 반복 가능하고 일관되게 어떻게 전달할 것인가?**

---

# 17. CI/CD의 전제조건

```text
Analysis / Design Quality
        ↓
Development Quality
        ↓
Developer Test
        ↓
Pre-commit Quality
        ↓
CI Verification
        ↓
CD Delivery
```

> **CI에서 처음 품질을 만드는 것이 아니다.**

개발 단계에서 가능한 범위의 품질을 먼저 확보한다.

CI는 팀 전체가 동일한 기준으로 그것을 반복 확인한다.

---

# 18. Judgment 8 — DevOps

## Case A — DevOps가 의미 있는 경우

```text
Strong Dev              Strong Ops
   │                       │
   └────── Silo ───────────┘
             ↓
      Slow Flow / Feedback
             ↓
           DevOps
```

## Case B — 연결보다 내부 문제가 더 큰 경우

```text
Weak Dev              Weak Ops
   │                      │
   └──── Automation ──────┘
             ↓
       Faster Instability
```

> **Dev와 Ops 각각의 기본 역량이 불안정하다면 연결보다 내부 안정화가 우선이다.**

> **취약한 Dev와 Ops를 자동화로 연결하면 취약성을 더 빠르게 전달할 수 있다.**

---

# 19. DevOps ≠ Tool Adoption

```text
Git
+ Jenkins
+ Docker
+ Kubernetes
≠ DevOps
```

> **DevOps는 Development와 Operations 사이의 flow를 개선하고, feedback을 빠르게 만들며, 품질과 운영 결과에 대한 shared responsibility와 continuous improvement를 만드는 문화와 운영 방식이다.**

CI/CD는 이를 지원하는 중요한 engineering practice이지 DevOps 전체와 동의어가 아니다.

---

# 20. Evaluation — 같은 Order 사례로 판단한다

새로운 domain이나 coding 실습을 추가하지 않는다.

입력:

- Design Class Diagram
- Sequence Diagram
- Communication Diagram
- 짧은 Java Code
- JUnit 결과
- Pre-commit / CI 결과 일부

## Judgment A — Design → Code

```text
이 Code에서 중요한 설계 의도를 추적할 수 있는가?
추가된 부분은 정상적인 implementation detail인가?
앞선 판단을 다시 열어야 하는 문제가 있는가?
```

## Judgment B — Verification Level

```text
현재 문제는
Development-time에 해결해야 하는가?
Pre-commit에서 막아야 하는가?
CI가 integration 수준에서 발견할 문제인가?
```

## Judgment C — Refactoring

```text
현재 구조 개선이 실제 필요한가?
필요하다면 Refactoring인가?
아니면 Rework / Change인가?
그 비용을 정당화하는 evidence가 있는가?
```

코딩 산출물을 강제하지 않는다.

---

# 21. Session Summary

```text
Design Model
→ Code로 구체화
→ Implementation Judgment
→ Developer Test / JUnit
→ TDD
→ Refactoring Judgment
→ Pre-commit Verification
→ Commit
→ CI
→ CD
→ DevOps
```

핵심은 topic coverage가 아니다.

```text
무엇이 구현으로 이어지는가?
무엇을 다시 판단해야 하는가?
어떻게 가장 빨리 확인하는가?
언제 구조를 개선하는가?
언제 공유 가능한가?
어떻게 통합 검증하는가?
어떻게 운영으로 전달하는가?
어떻게 조직 전체의 flow와 feedback을 개선하는가?
```

---

# 22. S11 Handoff

```text
OOAD
→ Development
→ Verification
→ CI/CD
→ Operation
```

그러나 OOAD 이후에는 또 다른 방향의 확장이 있다.

```text
System 전체 구조와 quality attribute는?
→ Software Architecture

복잡한 domain의 language·model·boundary를 어떻게 지속적으로 관리할 것인가?
→ DDD

어디를 독립적인 service boundary로 나눌 것인가?
→ MSA

Human과 Agent가 분석·설계·구현·검증을 어떻게 나누고 통제할 것인가?
→ AI-Native
```

> **OOAD가 제공한 판단 기반 위에서 Software Architecture·DDD·MSA·AI-Native는 무엇을 추가로 다루는가?**

→ **S11. OOAD Next Step ② — 고급 설계와 AI-Native**

---

# 23. Slide Architecture — v0.2

현재는 Detailed Design 초안 기준의 임시 추정이다.

| # | Slide | 핵심 역할 |
|---:|---|---|
| 1 | S10 Title / Core Question | 세션 전환 |
| 2 | OOAD Core → Next Step | S10 위치 |
| 3 | Eight Engineering Judgments | 세션 backbone |
| 4 | Design Class Model → Java | 구조·책임 trace |
| 5 | Sequence / Communication → Java | collaboration trace |
| 6 | Model ≠ Code Copy | abstraction vs implementation detail |
| 7 | Implementation Detail vs Upstream Judgment | feedback scope |
| 8 | Fast Feedback | Run / Debug / Developer Test |
| 9 | Object Contract / Expected Behavior → JUnit | executable evidence |
| 10 | Development-time Test | 개발 중 검증 |
| 11 | TDD | Red → Green → Refactor |
| 12 | TDD Strength / Limit | positioning |
| 13 | Refactoring Judgment | 언제 구조를 개선하는가 |
| 14 | Rework ≠ Refactoring | 경계 |
| 15 | Pre-commit Verification | 공유 전 책임 |
| 16 | Why CI | integration problem |
| 17 | CI Quality Gate | Java 대표 도구 |
| 18 | Why CD | artifact → runtime |
| 19 | Strong Dev/Ops vs Weak Dev/Ops | DevOps prerequisite |
| 20 | DevOps ≠ Tool Adoption | culture / flow / feedback |
| 21 | Evaluation | same Order evidence |
| 22 | Summary + S11 Handoff | 회수/전환 |

**초안 추정: 20~22장.**

실제 PPT 작성 단계에서 claim density, code readability, diagram readability, evaluation 시간을 기준으로 재산정한다.
