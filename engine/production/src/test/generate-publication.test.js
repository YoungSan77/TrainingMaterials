"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { generateFile, generateBundle } = require("../generate");
const { TEMPLATE_DIR } = require("../template");

// Reuse the existing fixture's first topic; no diagrams or external course dependencies.
const fixture = fs.readFileSync(path.join(__dirname, "fixtures/reference-session.md"), "utf8");
const source = fixture.slice(0, fixture.indexOf("## 목차")) +
  "## 목차\n\n01. 세션 목표\n\n" +
  fixture.slice(fixture.indexOf("## 01. 세션 목표"), fixture.indexOf("## 02. SW 개발의 재작업"));

for (const bundle of [false, true]) {
  test(`${bundle ? "bundle" : "single"}: output pair publication`, async (t) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tm-publication-"));
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
    const input = path.join(dir, "s01.md"), output = path.join(dir, "out.pptx");
    const qa = path.join(dir, "out.qa.json");
    fs.writeFileSync(input, source);
    const run = () => bundle ? generateBundle([input], output, TEMPLATE_DIR) : generateFile(input, output, TEMPLATE_DIR);
    await run();
    const oldDeck = fs.readFileSync(output), oldQa = fs.readFileSync(qa);
    const preserved = () => {
      assert.deepEqual(fs.readFileSync(output), oldDeck);
      assert.deepEqual(fs.readFileSync(qa), oldQa);
      assert.deepEqual(fs.readdirSync(dir).sort(), ["out.pptx", "out.qa.json", "s01.md"]);
    };
    for (const failure of ["render", "inspect", "qa-write", "pptx-publish", "qa-publish"]) {
      await t.test(failure, async (st) => {
        const builder = require("../builder");
        if (failure === "render") st.mock.method(builder, bundle ? "bundle" : "render", async () => { throw Error("injected render"); });
        if (failure === "inspect") {
          const original = builder[bundle ? "bundle" : "render"];
          st.mock.method(builder, bundle ? "bundle" : "render", async (...args) => {
            const m = await original(...args);
            m.pages[0].heading = "injected mismatch";
            return m;
          });
        }
        if (failure === "qa-write") {
          const original = fs.writeFileSync;
          st.mock.method(fs, "writeFileSync", function (p, ...args) {
            if (String(p).endsWith(".qa.json")) { original.call(fs, p, "partial"); throw Error("injected qa-write"); }
            return original.call(fs, p, ...args);
          });
        }
        if (failure.endsWith("publish")) {
          const original = fs.renameSync;
          let fired = false;
          st.mock.method(fs, "renameSync", function (from, to) {
            if (!fired && to === (failure === "pptx-publish" ? output : qa)) {
              fired = true; throw Error("injected publish");
            }
            return original.call(fs, from, to);
          });
        }
        await assert.rejects(run);
        st.mock.restoreAll();
        preserved();
      });
    }
    await t.test("rollback failure retains recovery files", async (st) => {
      const original = fs.renameSync;
      st.mock.method(fs, "renameSync", function (from, to) {
        if (to === qa || String(from).endsWith("previous-0")) throw Error("injected recovery failure");
        return original.call(fs, from, to);
      });
      await assert.rejects(run, /출력 쌍 복구 실패:[\s\S]*복구 자료 보존:/);
      st.mock.restoreAll();
      const recovery = fs.readdirSync(dir).find((p) => p.startsWith(".tm-publish-"));
      assert.ok(recovery);
      assert.deepEqual(fs.readFileSync(path.join(dir, recovery, "previous-0")), oldDeck);
      assert.deepEqual(fs.readFileSync(path.join(dir, recovery, "previous-1")), oldQa);
      fs.renameSync(path.join(dir, recovery, "previous-0"), output);
      fs.rmSync(path.join(dir, recovery), { recursive: true });
      preserved();
    });
    await t.test("first publication failure leaves no output pair", async (st) => {
      fs.unlinkSync(output);
      fs.unlinkSync(qa);
      const original = fs.renameSync;
      st.mock.method(fs, "renameSync", function (from, to) {
        if (to === qa) throw Error("injected first publication failure");
        return original.call(fs, from, to);
      });
      await assert.rejects(run, /injected first publication failure/);
      st.mock.restoreAll();
      assert.deepEqual(fs.readdirSync(dir), ["s01.md"]);
    });
    fs.writeFileSync(input, source.replace("OOAD 개요", "변경된 개요")
      .replace("## 목차\n\n01. 세션 목표", "## 목차\n\n01. 세션 목표\n02. 추가 확인")
      + "\n## 02. 추가 확인\n\n**추가 내용**을 확인한다.\n");
    await run();
    assert.notDeepEqual(fs.readFileSync(output), oldDeck);
    assert.notDeepEqual(fs.readFileSync(qa), oldQa);
    const report = JSON.parse(fs.readFileSync(qa));
    assert.equal(report.status, "PASS");
    assert.equal(report.visual_status, "NOT_VERIFIED");
    assert.deepEqual(Object.keys(report), Object.keys(JSON.parse(oldQa)));
  });
}
