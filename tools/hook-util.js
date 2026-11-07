#!/usr/bin/env node
// hook이 함께 쓰는 판정. 같은 정규식을 두 hook에 복사해 두었다가 한쪽만 고치는 일을 막는다
// (`guides/agentic-repository-guide.md` 5절 — 지침에 없는 계약은 지켜지지 않는다).
"use strict";

// Bash 명령이 파일을 **바꾸는** 낌새. 읽기 전용 명령(cat·sed -n·grep·ls·find·head·wc·--check)은
// 통과시킨다.
//
// 2026-11-07: 예전 정규식은 리다이렉션을 `[^<>]>{1,2}[^>]`로 찾아서, 화살표 함수(`h=>h.cmd`)와
// 비교 연산자(`i>=0`)가 든 `node -e` 한 줄을 쓰기로 판정해 거절했다. 설정 파일을 **읽는** 명령이
// 쓰기로 막히는 것을 실제로 겪어 고쳤다 — 리다이렉션의 `>` 앞에는 `=`·`-`·`!`가 오지 않고,
// 뒤에는 `=`가 오지 않는다.
const WRITE_HINT =
  /(^|[^<>=!-])>{1,2}(?![=>])|\brm\b|\bmv\b|\bcp\b|\bmkdir\b|\btee\b|\btouch\b|\bsed\b[^|]*-i|\bgit\s+(checkout|restore|apply|rm|mv)\b|open\([^)]*['"]w|writeFileSync|appendFileSync|unlinkSync|\.write\(/;

module.exports = { WRITE_HINT };
