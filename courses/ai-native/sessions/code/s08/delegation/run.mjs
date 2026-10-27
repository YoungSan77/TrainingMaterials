import { mkdtempSync, readdirSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';

// S08의 위임 실행이 돌려준 구현을 그대로 컴파일하고 검사한다. 실행 환경에 Java 17이 없어도
// `--release 17`로 자바 17 바이트코드를 만든다. 검사가 통과한 뒤에만 기능 목록의 통과 표식을 바꾼다.
// 실행이 돌려준 `OrderStatus`는 첫 단위가 쓰는 둘만 선언했다. 예제 원본은 관통 사례의 상태 넷을
// 유지하도록 채웠다 — 뒤 세션이 같은 이름을 다른 뜻으로 쓰지 않게 하기 위해서다(강사 노트에 밝힌다).
const base = dirname(fileURLToPath(import.meta.url));
const temporary = mkdtempSync(join(tmpdir(), 'tm-delegation-'));

function javaFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
    ? javaFiles(join(dir, entry.name))
    : entry.name.endsWith('.java') ? [join(dir, entry.name)] : []);
}

try {
  const classes = join(temporary, 'classes');
  mkdirSync(classes, { recursive: true });
  execFileSync('javac', ['--release', '17', '-encoding', 'UTF-8', '-d', classes,
    ...javaFiles(join(base, 'src'))], { stdio: 'inherit' });
  process.stdout.write(execFileSync('java', ['-ea', '-cp', classes, 'order.OrderApplicationServiceTest'],
    { encoding: 'utf8' }));

  const units = [
    ['금액 확정', '확정 단가 1,000원 × 2개로 총액 2,000원',
      'OrderApplicationServiceTest.savesPendingPaymentOrderWithFixedSalePriceAndTotalAmount'],
    ['판매가 변경', '판매가가 1,200원이 된 뒤에도 단가 1,000원·총액 2,000원',
      'OrderApplicationServiceTest.keepsFixedValuesWhenCurrentSalePriceChanges'],
    ['사전조건', '항목 0개·수량 0·배송지 누락을 거절',
      'OrderApplicationServiceTest.rejectsInvalidOrderCreationPreconditions'],
  ].map(([unit, acceptance, evidence]) => ({ unit, acceptance, evidence, passes: true }));
  writeFileSync(join(base, 'features.json'), JSON.stringify(units, null, 2) + '\n');
  console.log('PASS 기능 목록: 세 검사의 통과 표식을 실행 결과로 기록했다');
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
