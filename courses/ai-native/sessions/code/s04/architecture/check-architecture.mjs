import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export function inspect(classes) {
  const output = execFileSync('jdeps', ['-verbose:package', '-filter:none', classes], { encoding: 'utf8' });
  const graph = new Map();
  const problems = [];
  const business = new Set(['order', 'payment', 'delivery', 'product', 'subscription']);
  for (const line of output.split('\n')) {
    const edge = /^\s+([\w.]+)\s+->\s+([\w.]+)\s+/.exec(line);
    if (!edge) continue;
    const [, from, to] = edge;
    if (from === to || to.startsWith('java.')) continue;
    if (!graph.has(from)) graph.set(from, new Set());
    graph.get(from).add(to);
    const root = from.split('.')[0];
    const target = to.split('.')[0];
    if (business.has(root) && (target.endsWith('adapter') || target === 'persistence')) {
      problems.push(`${from} -> ${to}: 업무에서 연동·영속 의존 금지`);
    }
  }
  const done = new Set(), active = [];
  function visit(node) {
    if (active.includes(node)) {
      problems.push(`순환: ${[...active.slice(active.indexOf(node)), node].join(' -> ')}`);
      return;
    }
    if (done.has(node)) return;
    active.push(node);
    for (const next of graph.get(node) || []) visit(next);
    active.pop();
    done.add(node);
  }
  for (const node of graph.keys()) visit(node);
  return [...new Set(problems)];
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (!process.argv[2]) throw new Error('사용: node check-architecture.mjs <컴파일된 클래스 폴더>');
  const problems = inspect(process.argv[2]);
  for (const problem of problems) console.error(problem);
  if (problems.length) process.exitCode = 1;
  else console.log('PASS: 업무의 연동·영속 의존 없음, 패키지 순환 없음');
}
