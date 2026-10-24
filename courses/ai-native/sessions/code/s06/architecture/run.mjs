import { mkdtempSync, readdirSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { execFileSync, spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { inspect } from './check-architecture.mjs';
const base = dirname(fileURLToPath(import.meta.url));
const temporary = mkdtempSync(join(tmpdir(), 'tm-architecture-'));
function javaFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory()
    ? javaFiles(join(dir, e.name)) : e.name.endsWith('.java') ? [join(dir, e.name)] : []);
}
function compile(src, out) {
  mkdirSync(out, { recursive: true });
  execFileSync('javac', ['-encoding', 'UTF-8', '-d', out, ...javaFiles(src)]);
}
try {
  const classes = join(temporary, 'classes');
  compile(join(base, 'src'), classes);
  process.stdout.write(execFileSync('java', ['-cp', classes, 'test.ArchitectureExample'], { encoding: 'utf8' }));
  assert.deepEqual(inspect(classes), []);
  console.log('PASS 정상 구조: 업무의 연동·영속 의존 없음, 업무 간 허용 목록 준수, 패키지 순환 없음');
  const fixtures = [
    ['직접 import', {'order/Bad.java': 'package order; import paymentadapter.Adapter; public class Bad { Adapter adapter; }', 'paymentadapter/Adapter.java': 'package paymentadapter; public class Adapter {}'}, 'order -> paymentadapter'],
    ['완전한 이름의 의존', {'order/Bad.java': 'package order; public class Bad { persistence.Store store; }', 'persistence/Store.java': 'package persistence; public class Store {}'}, 'order -> persistence'],
    ['순환 없는 허용 목록 위반', {'payment/Bad.java': 'package payment; public class Bad { delivery.Bad delivery; }', 'delivery/Bad.java': 'package delivery; public class Bad {}'}, 'payment -> delivery: 허용 목록 밖의 업무 간 의존'],
    ['하위 패키지의 허용 목록 위반', {'payment/internal/Bad.java': 'package payment.internal; public class Bad { delivery.api.Bad delivery; }', 'delivery/api/Bad.java': 'package delivery.api; public class Bad {}'}, 'payment.internal -> delivery.api: 허용 목록 밖의 업무 간 의존'],
    ['패키지 순환', {'order/Bad.java': 'package order; public class Bad { payment.Bad payment; }', 'payment/Bad.java': 'package payment; public class Bad { order.Bad order; }'}, '순환:'],
  ];
  for (const [label, files, expected] of fixtures) {
    const dir = join(temporary, label), source = join(dir, 'src'), output = join(dir, 'classes');
    for (const [name, content] of Object.entries(files)) {
      const path = join(source, name);
      mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, content);
    }
    compile(source, output);
    const problems = inspect(output);
    assert.ok(problems.some(p => p.includes(expected)), `${label}: ${problems}`);
    const cli = spawnSync('node', [join(base, 'check-architecture.mjs'), output], { encoding: 'utf8' });
    assert.equal(cli.status, 1);
    console.log(`PASS 위반 탐지(${label}): ${problems.join('; ')}`);
  }
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
