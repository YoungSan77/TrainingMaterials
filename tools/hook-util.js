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
  /(^|[^<>=!-])>{1,2}(?![=>])|\brm\b|\bmv\b|\bcp\b|\bmkdir\b|\btee\b|\btouch\b|\bsed\b[^|]*-i|\bgit\s+(checkout|restore|apply|rm|mv|clean|reset)\b|\bunzip\b|open\([^)]*['"]w|writeFileSync|appendFileSync|unlinkSync|\.write\(/;

// Recognize only simple invocations of these commands. Shell composition, expansion,
// wrappers and unrecognized options retain the conservative whole-command fallback.
// paths=null means the destination is unknown, not that the command is read-only.
function writeScope(command) {
  const fallback = () => ({ paths: WRITE_HINT.test(command) ? null : [],
    allCourses: /\bgit\b[^\n]*(?:\bclean\b|\breset\b[^\n]*--hard|\bcheckout\b|\brestore\b|\bapply\b)|\bunzip\b/.test(command) });
  // Descriptor duplication/closure writes no file. Only recognize standalone forms.
  const simple = command.replace(/(?:^|\s)[012]>&[012-](?=\s|$)/g, " ");
  if (/[;&|`$\n\\(){}]/.test(simple)) return fallback();
  const tokens = simple.match(/"[^"\n]*"|'[^'\n]*'|\d*>>?|[^\s<>"']+/g) || [];
  if (tokens.join("").replace(/\s/g, "") !== simple.replace(/\s/g, "")) return fallback();
  const words = tokens.map((s) => /^["']/.test(s) ? s.slice(1, -1) : s);
  const paths = [];
  const args = [];
  for (let i = 0; i < words.length; i++) {
    if (/^\d*>>?$/.test(tokens[i])) {
      if (!words[i + 1] || /^[<>]/.test(words[i + 1])) return fallback();
      paths.push(words[++i]);
    } else if (/[<>]/.test(words[i])) return fallback();
    else args.push(words[i]);
  }
  const [exe, ...rest] = args;
  if (exe === "git") {
    const [action, ...options] = rest;
    if (["log", "diff", "show", "status", "ls-files"].includes(action)) {
      // --output writes even on read operations. External programs/config are ambiguous.
      if (options.some((s) => /^(?:--ext-diff|--textconv|--no-index|--exec-path)/.test(s))) return fallback();
      for (let i = 0; i < options.length; i++) {
        if (options[i] === "--output") { if (!options[i + 1]) return fallback(); paths.push(options[++i]); }
        else if (options[i].startsWith("--output=")) paths.push(options[i].slice(9));
      }
      return { paths, allCourses: false };
    }
    if (["clean", "checkout", "restore"].includes(action)) {
      const separator = options.indexOf("--");
      if (separator >= 0 && separator < options.length - 1) return { paths: paths.concat(options.slice(separator + 1)), allCourses: false };
      return { paths: null, allCourses: true };
    }
    if (["reset", "apply"].includes(action)) return { paths: null, allCourses: true };
    return fallback();
  }
  if (["cat", "head", "tail", "wc", "ls", "file", "stat"].includes(exe)) return { paths, allCourses: false };
  if (exe === "cp") {
    // Restrict to plain operands: options such as --target-directory need fallback.
    if (rest.length < 2 || rest.some((s) => s.startsWith("-"))) return fallback();
    return { paths: paths.concat(rest.at(-1)), allCourses: false };
  }
  if (exe === "unzip") {
    const opts = rest.filter((s) => s.startsWith("-"));
    if (opts.length === 1 && ["-p", "-l"].includes(opts[0])) return { paths, allCourses: false };
    // Archive entries can name destinations not visible in the command line.
    return { paths: null, allCourses: true };
  }
  return fallback();
}

module.exports = { WRITE_HINT, writeScope };
