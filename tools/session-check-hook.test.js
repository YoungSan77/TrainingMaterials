"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { classify } = require("./turn-record-hook");
const source = fs.readFileSync(path.join(__dirname, "session-check-hook.js"), "utf8");

// Execute the unchanged Stop hook with fake I/O. Never run Production, drain real
// events or write a real turn log (TM_HOOK_TEST alone does not isolate drain/logTurn).
function stop({ input = {}, status = " M courses/example/sessions/s01.md\n", output = "", pending = [] } = {}) {
  const handlers = {}, calls = [], logs = [];
  let drained = 0, stdout = "";
  const exit = {};
  const modules = {
    path,
    fs: {
      existsSync: () => true,
      readFileSync: (file) => JSON.stringify(String(file).endsWith("pending-sources.json")
        ? { pending: pending.map((quote) => ({ quote })) } : { pending: [] }),
    },
    child_process: { execFileSync: (exe, args) => {
      if (exe === "git") return status;
      calls.push([exe, args]);
      return output;
    } },
    "./turn-record": { drain: () => { drained++; return []; }, summary: () => "", logTurn: (s) => logs.push(s) },
  };
  vm.runInNewContext(source, {
    __dirname, require: (name) => { assert.ok(name in modules, name); return modules[name]; },
    process: { env: { TM_HOOK_TEST: "1" }, stdin: { on: (name, fn) => { handlers[name] = fn; } },
      stdout: { write: (s) => { stdout += s; } }, exit: () => { throw exit; } },
  });
  handlers.data(JSON.stringify(input));
  try { handlers.end(); } catch (error) { if (error !== exit) throw error; }
  return { calls, logs, drained, decision: stdout ? JSON.parse(stdout) : null };
}

test("existing dirty manuscript is checked even without turn write evidence", () => {
  const result = stop();
  assert.equal(result.calls.length, 1);
  assert.deepEqual(Array.from(result.calls[0][1]), ["engine/production/src/cli.js", "--check", "courses/example/sessions/s01.md"]);
  assert.equal(result.drained, 1);
  assert.equal(result.logs.length, 1);
});

test("existing event classifier cannot distinguish manuscript read and successful write", () => {
  const file_path = "courses/example/sessions/s01.md";
  assert.equal(classify("Read", { file_path }), null);
  assert.equal(classify("Write", { file_path }), null);
  assert.equal(classify("Edit", { file_path }), null);
});

test("no dirty manuscript still drains and logs; loopback skips both", () => {
  const clean = stop({ status: "" });
  assert.equal(clean.calls.length, 0);
  assert.equal(clean.drained, 1);
  assert.equal(clean.logs.length, 1);
  const repeat = stop({ input: { stop_hook_active: true } });
  assert.equal(repeat.calls.length, 0);
  assert.equal(repeat.drained, 0);
  assert.equal(repeat.logs.length, 0);
});

test("dirty manuscript checks retain warning/error blocking and pending quote exception", () => {
  for (const output of ["경고: unresolved\n", "생성 중단: invalid\n"]) {
    const result = stop({ output });
    assert.equal(result.calls.length, 1);
    assert.equal(result.decision.decision, "block");
    assert.ok(result.decision.reason.includes(output.trim()));
  }
  const quote = "A pending original quotation that needs user input.";
  assert.equal(stop({ output: "경고: " + quote, pending: [quote] }).decision, null);
});
