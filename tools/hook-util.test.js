"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

test("active course hook: read operands and write destinations", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "tm-hook-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, "courses"));
  fs.writeFileSync(path.join(root, "courses/ACTIVE"), "current\n");
  const before = fs.readdirSync(root);
  const cases = [
    ["git log -- courses/other/rm/file.md", false],
    ["git diff -- courses/other/cp/file.md", false],
    ["git diff -- courses/other/s01.md > /tmp/tm-diff.txt", false],
    ["git log -- courses/other/s01.md 2>/dev/null", false],
    ["git diff -- courses/other/s01.md 2>&1", false],
    ["cat courses/other/s01.md > /tmp/tm-copy.txt", false],
    ["cat /tmp/input > courses/other/s01.md", true],
    ["git diff --output=courses/other/report.txt", true],
    ["git clean -fd -- courses/other/", true],
    ["git reset --hard HEAD -- courses/other/", true],
    ["git reset --hard HEAD", true],
    ["git clean -fd", true],
    ["unzip archive.zip -d courses/other/", true],
    ["unzip archive.zip", true],
    ["unzip -p courses/other/book.pptx ppt/slides/slide1.xml", false],
    ["unzip -l courses/other/book.pptx", false],
    ["cp courses/other/input.md /tmp/output.md", false],
    ["cp /tmp/input.md courses/other/output.md", true],
    ["mv courses/other/input.md /tmp/output.md", true],
    ["rm courses/other/file.md", true],
    ["sed -i '' s/a/b/ courses/other/file.md", true],
    ["git checkout -- courses/other/file.md", true],
    ["git restore courses/other/file.md", true],
    ["git apply courses/other/patch.diff", true],
    ["node -e 'fs.writeFileSync(\"courses/other/file.md\", \"x\")'", true],
    ["git diff -- courses/other/file.md && touch courses/other/new.md", true],
    ["touch courses/current/file.md", false],
    ["git diff -- courses/other/file.md > courses/current/report.txt", false],
    ["git diff -- courses/other/file.md > courses/other/report.txt", true],
    ["git restore -- courses/current/file.md", false],
    ["git clean -fd -- courses/current/", false],
    ["cat 'courses/other/s01.md' > '/tmp/with spaces.txt'", false],
    ["cat /tmp/input > courses/current/../other/s01.md", true],
    ["git -C . reset --hard HEAD", true],
    ["unzip -p courses/other/book.pptx > courses/other/copy.xml", true],
  ];
  for (const [command, denied] of cases) {
    const result = spawnSync(process.execPath, [path.join(__dirname, "active-course-hook.js")], {
      input: JSON.stringify({ tool_name: "Bash", tool_input: { command } }), encoding: "utf8",
      env: { ...process.env, CLAUDE_PROJECT_DIR: root, TM_HOOK_TEST: "1" },
    });
    assert.equal(result.status, 0, result.stderr);
    const actual = result.stdout ? JSON.parse(result.stdout).hookSpecificOutput.permissionDecision === "deny" : false;
    assert.equal(actual, denied, command);
  }
  for (const tool_name of ["Write", "Edit"]) {
    for (const [course, denied] of [["current", false], ["other", true]]) {
      const result = spawnSync(process.execPath, [path.join(__dirname, "active-course-hook.js")], {
        input: JSON.stringify({ tool_name, tool_input: { file_path: `courses/${course}/file.md` } }), encoding: "utf8",
        env: { ...process.env, CLAUDE_PROJECT_DIR: root, TM_HOOK_TEST: "1" },
      });
      assert.equal(result.status, 0, result.stderr);
      assert.equal(Boolean(result.stdout), denied, `${tool_name}: ${course}`);
    }
  }
  assert.deepEqual(fs.readdirSync(root), before);
  assert.equal(fs.readFileSync(path.join(root, "courses/ACTIVE"), "utf8"), "current\n");
});

test("settings protection shares destination checks and preserves read prohibition", (t) => {
  const cases = [
    ["cat .claude/settings.json > /tmp/settings-copy.json", false],
    ["git diff -- .claude/settings.json 2>/dev/null", false],
    ["git log -- .claude/settings.json > /tmp/settings-log", false],
    ["cat .claude/settings.json 2>&1", false],
    ["cp .claude/settings.json /tmp/settings-copy.json", false],
    ["cat /tmp/input > .claude/settings.json", true],
    ["cat /tmp/input > .claude/tmp/../settings.json", true],
    ["cp /tmp/input .claude/settings.json", true],
    ["git diff --output=.claude/settings.json", true],
    ["git reset --hard HEAD", true],
    ["git clean -fd", true],
    ["unzip archive.zip", true],
    ["node -e 'const h = x=>x; const i=1; console.log(i>=0)' .claude/settings.json", false],
    ["node -e 'fs.writeFileSync(\".claude/settings.json\", \"x\")'", true],
    ["cat .claude/settings.json && touch .claude/settings.json", true],
  ];
  for (const [command, denied] of cases) {
    const result = spawnSync(process.execPath, [path.join(__dirname, "protected-path-hook.js")], {
      input: JSON.stringify({ tool_name: "Bash", tool_input: { command } }), encoding: "utf8",
      env: { ...process.env, TM_HOOK_TEST: "1" },
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(Boolean(result.stdout), denied, command);
  }
  // Feed path names as hook data only; no protected file is opened or changed.
  for (const [tool_name, tool_input, denied] of [
    ["Read", { file_path: ".claude/settings.json" }, false],
    ["Edit", { file_path: ".claude/settings.json" }, true],
    ["Read", { file_path: "references/" + "production/example.pptx" }, true],
    ["Grep", { path: ".", pattern: "references/" + "production" }, false],
  ]) {
    const result = spawnSync(process.execPath, [path.join(__dirname, "protected-path-hook.js")], {
      input: JSON.stringify({ tool_name, tool_input }), encoding: "utf8",
      env: { ...process.env, TM_HOOK_TEST: "1" },
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(Boolean(result.stdout), denied, tool_name);
  }
});
