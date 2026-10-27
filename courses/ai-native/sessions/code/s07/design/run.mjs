import { mkdtempSync, readdirSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
const base = dirname(fileURLToPath(import.meta.url));
const temporary = mkdtempSync(join(tmpdir(), 'tm-design-'));
function javaFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory()
    ? javaFiles(join(dir, e.name)) : e.name.endsWith('.java') ? [join(dir, e.name)] : []);
}
try {
  const classes = join(temporary, 'classes');
  mkdirSync(classes, { recursive: true });
  execFileSync('javac', ['-encoding', 'UTF-8', '-d', classes, ...javaFiles(join(base, 'src'))]);
  for (const main of ['test.ContractTest', 'test.FalseGreenExample']) {
    process.stdout.write(execFileSync('java', ['-cp', classes, main], { encoding: 'utf8' }));
  }
  // 네 검사가 모두 통과한 뒤에만 기능 목록의 통과 표식을 바꾼다.
  const units = [
    ['금액 확정', '확정 단가 1,000원 × 2개로 총액 2,000원', 'ContractTest.confirmedAmount'],
    ['승인', '승인 뒤 결제완료, 서울 배송 1회', 'ContractTest.approved'],
    ['거절', '거절 뒤 결제대기, 배송 0회', 'ContractTest.rejected'],
    ['재결제', '거절 뒤 다른 카드로 승인, 배송 총 1회', 'ContractTest.paidAgainWithAnotherCard'],
  ].map(([unit, acceptance, evidence]) => ({ unit, acceptance, evidence, passes: true }));
  writeFileSync(join(base, 'features.json'), JSON.stringify(units, null, 2) + '\n');
  console.log('PASS 기능 목록: 네 단위의 통과 표식을 실행 결과로 기록했다');
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
