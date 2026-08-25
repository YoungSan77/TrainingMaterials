# SW Architecture Canon Stance v1.0

> **Status:** Course-level canon candidate
> **Purpose:** SW Architecture 과정의 기준점을 Clean Architecture 하나로 축소하지 않으면서 구조·품질·진화를 일관된 판단 체계로 만든다.

## 1. Thesis

> **Architecture는 중요한 Quality Attribute와 Constraint를 만족하도록 정책과 세부사항의
> 경계·의존성을 선택하고, 그 선택을 evidence로 검증하며 변화에 따라 지속적으로 진화시키는 일이다.**

## 2. Three Anchors

### A. Decision Basis — Quality Attribute Reasoning
Architecture Driver / Quality Attribute Scenario / Constraint가 구조 선택보다 먼저다.

`Driver → Scenario → Options → Trade-off → Decision`

### B. Structural Baseline — Clean Architecture
Clean Architecture를 기본 structural lens로 사용한다.

핵심:
- Separation of Concerns
- Policy vs Detail
- Dependency Rule
- Use Case / Application boundary
- Framework / UI / DB를 replaceable detail로 취급

**가르치지 않을 방식:**
- 동심원 그림 암기
- 4개 layer 이름 강제
- 모든 시스템에 동일 package structure 강제
- Clean Architecture = 모든 Software Architecture

### C. Time Dimension — Evolutionary Architecture
Architecture는 고정 blueprint가 아니다.

핵심:
- guided incremental change
- architectural characteristics
- fitness functions
- continuous evaluation
- multiple dimensions of change

`Decision → Implement → Measure → Fitness → Adapt`

## 3. Course Spine

```text
Why
Drivers / Quality / Constraints
        ↓
Protect
Policy vs Detail
        ↓
Structure
Boundary / Dependency / Port / Adapter
        ↓
Choose
Style / Pattern / Alternative / Trade-off
        ↓
Enforce
Rule / Fitness / Conformance
        ↓
Evaluate
Scenario / Evidence / Risk
        ↓
Evolve
Incremental Change / Re-decision
```

## 4. Relationship to DDD

DDD가 Domain Model을 소유한다.
SWA는 이미 정의된 Domain Model / Use Case policy를 **어디에 배치하고 무엇으로부터 보호할지**를 다룬다.

`DDD Domain Model → SWA Protection / Placement`

## 5. Relationship to MSA

SWA는 분산 여부의 구조·품질 trade-off를 준비한다.
MSA가 Service Boundary, distributed contract, failure, operation을 소유한다.

## 6. Relationship to QM

SWA가 Architecture Fitness / Conformance의 기술적 의미를 소유한다.
QM은 이러한 evidence/gate가 조직의 quality system에서 지속 실행되는 방식을 다룬다.

## 7. Failure Conditions

- Clean Architecture package 이름만 복제하고 dependency direction은 위반
- Quality Attribute 없이 style을 먼저 선택
- Architecture Decision을 다이어그램으로 대체
- Fitness Function 없이 "evolutionary"라는 이름만 사용
- 미래 변화 전체를 예측하려는 과잉 추상화
- 변화 대응을 이유로 architecture governance를 제거
