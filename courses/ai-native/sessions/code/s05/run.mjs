import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const base = dirname(fileURLToPath(import.meta.url));
const temp = mkdtempSync(join(tmpdir(), 'tm-acceptance-'));
  const cases = ['salePriceChanged', 'approved', 'rejected', 'paidWithAnotherCard'];
  const units = ['금액 확정', '승인', '거절', '재결제'];
  const criteria = ['판매가 변경 후에도 2000원 요청', '결제완료 뒤 서울 배송 1회', '결제대기 유지, 배송 0회', '다른 카드로 같은 주문 재결제'];
const initial = units.map((unit, i) => ({unit, acceptance: criteria[i], evidence: `AcceptanceExamples.${cases[i]}`, passes: false}));
writeFileSync(join(base, 'features.json'), JSON.stringify(initial, null, 2) + '\n');
try {
  execFileSync('javac', ['-encoding', 'UTF-8', '-d', temp, join(base, 'AcceptanceExamples.java')]);
  const output = execFileSync('java', ['-cp', temp, 'AcceptanceExamples'], { encoding: 'utf8' });
  const passed = output.trim().split('\n').map(s => s.trim());
  assert.deepEqual(passed, ['PASS 승인', 'PASS 가격 변경', 'PASS 거절', 'PASS 재결제']);
  process.stdout.write(output);
  writeFileSync(join(base, 'features.json'), JSON.stringify(units.map((unit, i) => ({unit, acceptance: criteria[i], evidence: `AcceptanceExamples.${cases[i]}`, passes: true})), null, 2) + '\n');
} finally { rmSync(temp, { recursive: true, force: true }); }
