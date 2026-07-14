# TrainingMaterials

LLM 기반 교재 데이터(JS) 생성 → PPTX 렌더링 파이프라인.

## 구조
- `engine/`  렌더 엔진·검증기·폭 모델·인용 파서 (도메인 독립)
- `course/`  계약·규격 템플릿·세션 브리프·인용 자산 (교재 의존)
- `decks/`   세션 데이터 NN.js (LLM 산출물)
- `out/`     PPTX 산출물 (재생성 가능 — Git 제외)
- `test/`    골든 스냅샷 + 실패 코퍼스 (회귀 안전망)

## 원칙
진실은 한 곳에만 산다. 폭=measure.js, 인용=quotes.md, 계약=엔진 헤더, 규칙=verify.js.
엔진은 도메인을 모른다. 측정되지 않는 것은 회피되거나 왜곡된다.

## 흐름
1. `npm run check decks/NN.js`   — 엔진 주입 전 검증(하네스)
2. `npm run build decks/NN.js`   — PPTX 렌더 → out/
3. `npm run snap`                — 현 렌더가 골든 기준선과 같은지 회귀 확인
