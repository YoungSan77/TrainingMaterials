"use strict";
// 슬라이드의 이름 — topic 제목으로 실습·실습 답을 알아보고, 우측 상단 세션명을 만든다
// (production-guide.md 「Session 명」, session-authoring-guide.md 「사례·가정·실습」).
const { wide, codePoints } = require("./text");

// A practice assignment topic ("NN. 실습 M — …", M being the practice's own number in the course;
// "NN. 실습 — …" without it is still accepted), one slide; an older review example ("… 검토 예시")
// may run longer.
function isPractice(title) {
  return /^\d\d\. 실습(?: \d+)? — /.test(title) && !/검토 예시/.test(title);
}
// Its answer, a topic titled "<산출물> (안)".
function isAnswer(title) {
  return /\(안\)$/.test(String(title).trim());
}
// Slides of the appendix after the summary (practice answers) carry "별첨: " before the session name.
function appendixSessionName(session) {
  return "별첨: " + session;
}
// The TOC slide title uses only the session name before its " — " subtitle
// ("03. 정적 모델 — 도메인 개념과 관계" -> "03. 정적 모델"); every other slide's top-right session
// name keeps the full name.
function tocSessionName(session) {
  return String(session).split(/\s+—\s+/)[0].trim();
}

// The top-right session name stays on one line. The placeholder is 3699901 EMU (~291pt) wide at
// 14pt bold; a longer name shrinks (0.5pt steps, not below 9pt) instead of wrapping into the title.
const SESSION_BOX_PT = 3699901 / 12700;
const SESSION_PT = 14;
const SESSION_MIN_PT = 9;
function sessionNamePt(session) {
  let em = 0;
  for (const cp of codePoints(String(session))) em += wide(cp) ? 1 : 0.6;
  if (em * SESSION_PT <= SESSION_BOX_PT) return SESSION_PT;
  return Math.max(SESSION_MIN_PT, Math.floor((SESSION_BOX_PT / em) * 2) / 2);
}

module.exports = { isPractice, isAnswer, appendixSessionName, tocSessionName, sessionNamePt, SESSION_PT };
