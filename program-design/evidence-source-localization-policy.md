# Evidence, Source & Localization Policy v1.0

> **Status:** Canon candidate
> **Scope:** 모든 현재/향후 과정, curriculum, source, quote, slide, exercise
> **Purpose:** 지역 관행·2차 자료·vendor narrative가 Global Engineering Principle로 오염되는 것을 방지한다.

## 1. Default Position

교재는 원칙적으로 **Global Principle / Global Best Practice 중심**으로 작성한다.
한국의 사례는 필요한 경우 `Korea BP`, `Korea WP`, `Local Context`로 제한적으로 포함한다.

> **Precedence Rule:** Global Principle / Global BP와 국내 관행이 충돌하면
> **교육 정본·권고·판단 기준은 Global Principle / Global BP를 우선한다.**
> 국내 관행은 그 원칙을 바꾸는 근거가 아니라 Local Constraint, Korea BP 또는 Korea WP로 설명한다.

**한국에서 흔하다 ≠ Best Practice**
**국내 관행과 충돌한다 ≠ Global Principle을 수정할 이유**

## 2. Source Hierarchy

### Tier 1 — Global Primary
우선 사용:
- 국제 표준 원문
- 개념/원칙 원저자 저작
- peer-reviewed paper / 권위 있는 연구기관의 원 보고서
- 공식 project/framework specification
- 원 조직이 직접 공개한 case evidence

### Tier 2 — Global Authoritative Secondary
- 전문기관 분석
- 학술/산업 survey
- 신뢰 가능한 기술 출판물
- 원출처를 명확히 추적할 수 있는 자료

### Tier 3 — Korea Primary
지역 적용에 필요할 때:
- 법령/행정규칙/공공기관 원문
- 국가표준/공식 통계
- 정부/공공기관 연구 원문
- 기업/기관이 직접 공개한 case/result

### Tier 4 — Korea Secondary
- 국내 전문 기사/협회/연구 해설
- 국내 기술서/교육자료

Tier 4는 **지역 맥락 보조자료**로 사용하며 Global Principle의 단독 근거로 쓰지 않는다.

### Avoid as Canon Evidence
- 출처 없는 블로그
- 재인용만 있는 한글 자료
- vendor marketing
- 검색 요약/커뮤니티 주장
- "국내 대부분이 이렇게 한다" 식 무근거 일반화

## 3. Classification

### [Global BP]
국가 독립적으로 재사용 가능한 engineering practice.
표준·원전·축적된 evidence에 의해 지지되어야 한다.

### [Korea BP]
한국 환경에서 효과와 맥락이 확인된 좋은 적용 사례.
Global BP로 자동 일반화하지 않는다.

### [Korea WP]
한국 환경에서 관찰되는 실패/왜곡/비효율 사례.
반면교사로 사용하며 한국 전체를 일반화하지 않는다.

### [Local Context]
법, 조달, 계약, 조직 구조, 시장 특성 등 적용 조건.
좋고 나쁨보다 **constraint**다.

## 4. Korean Source Rules

1. 한글 자료가 편하다는 이유로 우선하지 않는다.
2. 원개념이 해외 원전이면 가능한 한 원전을 확인한다.
3. 번역된 quote는 원문과 attribution을 확인한다.
4. 국내 기사가 표준/보고서를 인용하면 원 표준/보고서를 확인한다.
5. 국내 관행과 Global Principle / Global BP가 충돌하면 **Global Principle / Global BP를 우선**한다.
   국내 관행은 Local Constraint 또는 Korea WP로 분리하고, 차이와 원인을 명시한다.
6. `한국에서는 현실적으로...`를 공학 원칙의 예외 면허로 사용하지 않는다.
7. 법적/계약적 제약은 BP가 아니라 constraint로 표시한다.
8. Korea WP를 "한국형 방법론"처럼 정상화하지 않는다.

## 5. Evidence Requirements for Cases

사례를 BP로 부르려면 가능한 범위에서 확인:
- Context
- Problem
- Intervention / Practice
- Outcome
- Metric/Evidence
- Trade-off
- Transferability limit

위가 없으면 "사례", "관행", "보고된 접근"으로 표현하고 BP라고 단정하지 않는다.

## 6. Quote / Principle Rule

- Principle과 verbatim quote를 분리한다.
- Quote는 `ko / en / author / source / locator / status`를 유지한다.
- paraphrase는 따옴표를 사용하지 않는다.
- `[원전]`과 `[귀속]`을 구분한다.
- 번역문은 교육용 자연스러움보다 의미 정확성을 우선한다.
- slide에서는 한글 번역을 주 메시지로, 영문 원문·저자·출처를 작은 글자로 표시한다.

## 7. Course Application

### OOAD / DDD / SWA / MSA / AI-Native
원리·패턴·개념 계보는 Global primary를 기본으로 한다.

### Modern QM
한국의 품질/아웃소싱/감사/산출물 중심 관행을 다룰 수 있으나:
- Global quality principle을 기준점으로 삼는다.
- Korea WP를 BP처럼 소개하지 않는다.
- 제도/계약 제약과 engineering practice를 분리한다.

### Future Agile / DevOps / Proposal / DT / AT
동일 규칙을 적용한다. 특히 국내에서 관행화된 process/tool adoption을
Global BP로 승격하지 않는다.

## 8. Authoring Checklist

- [ ] 이 주장은 Global Principle인가 Local Practice인가?
- [ ] 가장 강한 원출처를 사용했는가?
- [ ] 한국 사례가 필요해서 넣은 것인가, 단지 쉽게 찾을 수 있어 넣은 것인가?
- [ ] Korea BP/WP/Local Context를 구분했는가?
- [ ] 결과 evidence 없이 BP라고 부르지 않았는가?
- [ ] vendor/tool 사례가 원칙을 대신하지 않는가?
- [ ] 번역·귀속을 원문과 대조했는가?


## 9. Precedence Rule — Non-Negotiable

다음 우선순위를 적용한다.

```text
Global Principle / Global BP
        ↓
Engineering Recommendation / Curriculum Canon
        ↓
Local Constraint 확인
        ↓
Korea BP / Korea WP / Local Adaptation
```

### 충돌 시 처리
1. Global Principle / Global BP를 교육의 기본 기준으로 유지한다.
2. 국내 법·규제·계약 때문에 그대로 적용할 수 없으면 이를 **Local Constraint**로 명시한다.
3. 국내에서 효과가 확인된 적응 사례는 **Korea BP**로 소개하되 Global BP를 대체하지 않는다.
4. 국내에서 널리 쓰이지만 원칙을 훼손하는 관행은 **Korea WP**로 분류한다.
5. "한국 현실상 어쩔 수 없다"는 표현만으로 공학 원칙의 예외를 정당화하지 않는다.

이 우선순위는 모든 현재/향후 과정에 공통 적용한다.
