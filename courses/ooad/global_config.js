// global_config.js — OOAD 과정 공통(book·curriculum·meta). courses/ooad/decks/의 순수 덱이 이걸 병합한다.
// curriculum은 지금 1교시(부 0)만 반영한다 — 부 1~5(교시 2~16)를 만들 때마다 items를 늘린다.
module.exports = {
  book: { title: '객체지향 분석·설계(OOAD)', subtitle: 'Order로 배우는 요구에서 설계까지' },
  curriculum: [
    { day: 'Day 1 — OOAD 개요와 분석', items: ['OOAD 개요'] }
  ],
  meta: { quotes: 'ooad-curriculum.md' },
};
