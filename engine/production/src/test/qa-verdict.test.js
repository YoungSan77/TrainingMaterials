"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const { reportJson } = require("../inspect");
const { generateFile, generateBundle } = require("../generate");
const { TEMPLATE_DIR } = require("../template");
const fixture = fs.readFileSync(path.join(__dirname, "fixtures/reference-session.md"), "utf8");
const source = fixture.slice(0, fixture.indexOf("## 목차")) + "## 목차\n\n01. 세션 목표\n\n" +
  fixture.slice(fixture.indexOf("## 01. 세션 목표"), fixture.indexOf("## 02. SW 개발의 재작업"));

test("QA JSON retains error-only verdict, fields and unverified visuals", () => {
  for (const [errors, warnings, status] of [[[], [], "PASS"], [[], ["warning"], "PASS"], [["error"], [], "FAIL"]]) {
    assert.deepEqual(JSON.parse(reportJson(errors, 2, 3, warnings)), {
      status, slides: 2, checked_blocks: 3, visual_status: "NOT_VERIFIED", errors, warnings,
    });
  }
});

for (const bundle of [false, true]) {
  test(`${bundle ? "bundle" : "single"}: console distinguishes errors, warnings and visual verification`, async (t) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tm-verdict-"));
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
    const input = path.join(dir, "s01.md"), output = path.join(dir, "out.pptx");
    for (const warnings of [false, true]) {
      fs.writeFileSync(input, warnings ? source.slice(0, source.indexOf("**강사 노트**")) : source);
      const result = spawnSync(process.execPath, [path.join(__dirname, "../cli.js"),
        ...(bundle ? ["--bundle", output] : ["--output", output]), input], { encoding: "utf8" });
      assert.equal(result.status, 0, result.stderr);
      const qa = JSON.parse(fs.readFileSync(path.join(dir, "out.qa.json")));
      // Bundle intentionally checks layout only, as before.
      assert.equal(qa.status, "PASS");
      if (!bundle) assert.equal(qa.warnings.length > 0, warnings);
      assert.ok(result.stdout.includes(`자동 검사 PASS: 오류 0개, 경고 ${qa.warnings.length}개`));
      assert.match(result.stdout, /시각 검증: NOT_VERIFIED \(미완료\)/);
      assert.match(result.stdout, /교육자료 제작 완료 판정이 아니다/);
      // Same line matcher used by session-check-hook.js; summary must not become a warning.
      const consumed = result.stdout.split("\n").filter((l) => /^(생성 중단|경고):/.test(l.trim()));
      assert.equal(consumed.length, qa.warnings.length);
    }
    fs.writeFileSync(input, source);
    const builder = require("../builder"), method = bundle ? "bundle" : "render";
    const original = builder[method];
    t.mock.method(builder, method, async (...args) => {
      const m = await original(...args);
      m.pages[0].heading = "injected mismatch";
      return m;
    });
    const lines = [];
    t.mock.method(console, "log", (...args) => lines.push(args.join(" ")));
    await assert.rejects(() => bundle ? generateBundle([input], output, TEMPLATE_DIR) : generateFile(input, output, TEMPLATE_DIR), /heading mismatch/);
    assert.match(lines.join("\n"), /자동 검사 FAIL: 오류 1개, 경고 0개/);
    assert.match(lines.join("\n"), /시각 검증: NOT_VERIFIED/);
    assert.equal(lines.some((l) => l.startsWith("생성:")), false);
    t.mock.restoreAll();
    // CLI failure marker and nonzero status used by --check consumers stay intact.
    fs.writeFileSync(input, source.replace("01. 세션 목표\n\n##", "99. 잘못된 목차\n\n##"));
    const failed = spawnSync(process.execPath, [path.join(__dirname, "../cli.js"), "--check", input], { encoding: "utf8" });
    assert.equal(failed.status, 1);
    assert.match(failed.stderr, /^생성 중단:/m);
  });
}
