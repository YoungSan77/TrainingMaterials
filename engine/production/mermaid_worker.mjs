// mermaid_worker.mjs — mermaid는 ESM 전용이라 별도 subprocess(Node ESM)로 격리해서 부른다.
//   (PlantUML을 java 별도 프로세스로 부르는 render.js와 같은 격리 원칙 — jsdom이 global.document
//   등을 오염시키므로 메인 CLI 프로세스 안에서 돌리지 않는다.)
//   stdin으로 mermaid 소스를 받아 stdout으로 정리된 SVG 문자열 하나만 출력한다.
import { JSDOM } from 'jsdom';

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => (data += c));
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

async function main() {
  const source = await readStdin();
  const dom = new JSDOM('<!DOCTYPE html><html><body><div id="container"></div></body></html>', { pretendToBeVisual: true });
  const { window } = dom;
  const skip = new Set(['window', 'self', 'top', 'parent', 'frames']);
  for (const key of Object.getOwnPropertyNames(window)) {
    if (skip.has(key) || key in global) continue;
    try {
      Object.defineProperty(global, key, { value: window[key], configurable: true, enumerable: true, writable: true });
    } catch (e) { /* 할당 불가 속성은 건너뛴다 */ }
  }
  for (const key of ['navigator', 'location', 'document', 'CSSStyleSheet', 'SVGElement', 'DOMParser', 'Element', 'HTMLElement']) {
    if (window[key] !== undefined) {
      Object.defineProperty(global, key, { value: window[key], configurable: true, enumerable: true, writable: true });
    }
  }
  global.window = window;
  // 실제 브라우저 텍스트 측정(getBBox/getComputedTextLength)이 없는 headless 환경이라 근사치로
  // 폴리필한다 — 노드/글자 배치가 실제 브라우저보다 덜 정교할 수 있다(간단한 flow/relationship
  // diagram이 목표 범위라 이 근사로 충분하다는 것을 실제 렌더로 확인했다).
  if (!window.SVGElement.prototype.getBBox) {
    window.SVGElement.prototype.getBBox = () => ({ x: 0, y: 0, width: 100, height: 30 });
  }
  if (!window.SVGElement.prototype.getComputedTextLength) {
    window.SVGElement.prototype.getComputedTextLength = function () {
      return (this.textContent || '').length * 7;
    };
  }

  const mermaid = (await import('mermaid')).default;
  mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', flowchart: { htmlLabels: false } });

  const id = 'mmd' + Date.now();
  const { svg } = await mermaid.render(id, source);

  // stroke-dasharray: headless 텍스트 측정 근사치 때문에 mermaid가 음수/비정상 dash 값을
  // 계산하는 경우가 실측으로 확인됐다(예: "0 0 -4 4") — SVG 래스터라이저가 이를 non-conforming으로
  // 거부한다. 구조(노드·화살표·텍스트)에는 영향 없는 순수 장식 속성이라 안전하게 제거한다.
  const cleaned = svg
    .replace(/stroke-dasharray\s*:\s*[^;"\n]*;?/g, '')
    .replace(/\sstroke-dasharray="[^"]*"/g, '');

  process.stdout.write(cleaned);
}

main().catch((e) => { console.error(String(e && e.stack || e)); process.exit(1); });
