#!/usr/bin/env node
// ============================================================================
// snapshot.js — 골든 스냅샷 (기하 회귀 안전망)
//   decks/의 각 덱을 엔진으로 렌더한 뒤, pptx 안 slideN.xml에서 모든 도형의
//   좌표(x,y,w,h)·폰트 크기·텍스트 줄 수만 뽑아 정규화 JSON으로 박제한다.
//   내용(인용 원문 대조 등)은 verify 소관이다 — 여기서는 기하만 본다.
//
//   node test/snapshot.js              기존 골든과 diff. 바뀐 슬라이드·도형만 출력, 차이 있으면 exit 1
//   node test/snapshot.js --update     골든을 현재 렌더 결과로 갱신
//   node test/snapshot.js --deck 03    특정 덱 번호만 (반복 가능, 과정 무관하게 매칭)
//   node test/snapshot.js --course qm  특정 과정만 (반복 가능)
//
//   courses/*/decks/ 아래 모든 과정을 훑는다(예전엔 courses/qm/decks/만 봤다 — 실제 운영 덱이
//   qm 5개·swqm 11개로 늘었는데 swqm은 기하 회귀망 밖에 있었다). 골든 키는 '과정/파일명'이라
//   같은 파일명(01.js 등)이 과정마다 있어도 겹치지 않는다.
//
//   의존성: Node 내장만(zlib로 pptx=zip 해제, 정규식으로 XML 파싱). pptx 렌더는
//   기존 엔진(pptxgenjs)이 담당한다 — 이 파일은 엔진을 자식 프로세스로 호출만 한다.
//   엔진·검증기는 읽기만 한다(수정하지 않는다).
// ============================================================================
'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const os = require('os');
const { execFileSync } = require('child_process');

const ROOT     = path.resolve(__dirname, '..');
const ENGINE   = path.join(ROOT, 'engine', 'master_render.js');
const COURSES_DIR = path.join(ROOT, 'courses');
const GOLDEN   = path.join(__dirname, '__snapshots__', 'geometry.json');
const EMU = 914400;

const args = process.argv.slice(2);
const UPDATE = args.includes('--update');
const only = [];
for (let i = 0; i < args.length; i++) if (args[i] === '--deck' && args[i + 1]) only.push(args[++i].replace(/\.js$/, ''));
const onlyCourse = [];
for (let i = 0; i < args.length; i++) if (args[i] === '--course' && args[i + 1]) onlyCourse.push(args[++i]);

// ── 최소 ZIP 리더 (중앙 디렉터리 → 로컬 헤더 → zlib.inflateRaw) ───────────────
function unzipEntries(buf, want /* (name)=>bool */) {
    // EOCD(0x06054b50)를 끝에서 찾는다
    let eocd = -1;
    for (let i = buf.length - 22; i >= 0 && i >= buf.length - 22 - 65535; i--) {
        if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error('ZIP: EOCD를 찾지 못했다 (pptx가 아니거나 손상)');
    const count = buf.readUInt16LE(eocd + 10);
    let p = buf.readUInt32LE(eocd + 16);            // 중앙 디렉터리 시작 오프셋
    const out = {};
    for (let n = 0; n < count; n++) {
        if (buf.readUInt32LE(p) !== 0x02014b50) break;
        const method = buf.readUInt16LE(p + 10);
        const compSize = buf.readUInt32LE(p + 20);
        const fnLen = buf.readUInt16LE(p + 28);
        const exLen = buf.readUInt16LE(p + 30);
        const cmLen = buf.readUInt16LE(p + 32);
        const lho = buf.readUInt32LE(p + 42);
        const name = buf.toString('utf8', p + 46, p + 46 + fnLen);
        p += 46 + fnLen + exLen + cmLen;
        if (!want(name)) continue;
        // 로컬 헤더에서 실제 데이터 시작을 구한다(중앙 디렉터리와 extra 길이가 다를 수 있다)
        if (buf.readUInt32LE(lho) !== 0x04034b50) throw new Error(`ZIP: 로컬 헤더 불일치 (${name})`);
        const lfn = buf.readUInt16LE(lho + 26);
        const lex = buf.readUInt16LE(lho + 28);
        const start = lho + 30 + lfn + lex;
        const raw = buf.subarray(start, start + compSize);
        out[name] = method === 0 ? Buffer.from(raw) : zlib.inflateRawSync(raw);
    }
    return out;
}

// ── slideN.xml → 도형 리스트 ─────────────────────────────────────────────────
const round2 = (v) => Math.round(v / EMU * 100) / 100;
const firstNum = (block, re) => { const m = block.match(re); return m ? Number(m[1]) : null; };

function shapesOf(xml) {
    const shapes = [];
    // 최상위 도형 컨테이너: p:sp / p:cxnSp / p:pic / p:graphicFrame (엔진 출력은 중첩되지 않는다)
    const re = /<p:(sp|cxnSp|pic|graphicFrame)>([\s\S]*?)<\/p:\1>/g;
    let m;
    while ((m = re.exec(xml))) {
        const tag = m[1], block = m[0];
        const ox = firstNum(block, /<a:off\s+x="(-?\d+)"/);
        const oy = firstNum(block, /<a:off\s[^>]*y="(-?\d+)"/);
        const cx = firstNum(block, /<a:ext\s+cx="(-?\d+)"/);
        const cy = firstNum(block, /<a:ext\s[^>]*cy="(-?\d+)"/);
        if (ox === null || cx === null) continue;   // xfrm 없는 개체는 건너뛴다
        let t;
        if (tag === 'graphicFrame') t = 'table';
        else if (tag === 'pic') t = 'pic';
        else if (tag === 'cxnSp') t = 'cxn';
        else { const g = block.match(/<a:prstGeom\s+prst="([^"]+)"/); t = g ? g[1] : 'sp'; }
        const fs = [...new Set((block.match(/\ssz="(\d+)"/g) || []).map(s => Number(s.match(/\d+/)[0]) / 100))]
            .sort((a, b) => a - b);
        const lines = (block.match(/<a:p[ >]/g) || []).length + (block.match(/<a:br\b/g) || []).length;
        shapes.push({ t, x: round2(ox), y: round2(oy), w: round2(cx), h: round2(cy), fs, lines });
    }
    return shapes;
}

function extractDeck(pptxBuf) {
    const entries = unzipEntries(pptxBuf, (n) => /^ppt\/slides\/slide\d+\.xml$/.test(n));
    const slides = {};
    Object.keys(entries)
        .sort((a, b) => (a.match(/(\d+)/)[1] - b.match(/(\d+)/)[1]))
        .forEach((name) => {
            const n = name.match(/slide(\d+)\.xml/)[1];
            slides['slide' + n] = shapesOf(entries[name].toString('utf8'));
        });
    return slides;
}

// ── 덱 렌더 → pptx 버퍼 ──────────────────────────────────────────────────────
function renderDeck(deckAbs) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'snap-'));
    try {
        execFileSync('node', [ENGINE, deckAbs, '--out', tmp], { cwd: tmp, stdio: ['ignore', 'ignore', 'pipe'] });
        const out = fs.readdirSync(tmp).find((f) => /^Course_Session.*\.pptx$/.test(f));
        if (!out) throw new Error('엔진이 pptx를 만들지 않았다');
        return fs.readFileSync(path.join(tmp, out));
    } catch (e) {
        const msg = (e.stderr && e.stderr.toString().trim()) || e.message;
        throw new Error(`렌더 실패: ${msg}`);
    } finally {
        fs.rmSync(tmp, { recursive: true, force: true });
    }
}

function listDecks() {
    if (!fs.existsSync(COURSES_DIR)) return [];
    const courses = fs.readdirSync(COURSES_DIR)
        .filter((c) => fs.existsSync(path.join(COURSES_DIR, c, 'decks')))
        .filter((c) => !onlyCourse.length || onlyCourse.includes(c))
        .sort();
    const out = [];
    courses.forEach((course) => {
        const dir = path.join(COURSES_DIR, course, 'decks');
        fs.readdirSync(dir)
            .filter((f) => /^\d{2}\.js$/.test(f))
            .filter((f) => !only.length || only.includes(f.replace(/\.js$/, '')))
            .sort()
            .forEach((f) => out.push({ course, file: f, abs: path.join(dir, f), key: `${course}/${f}` }));
    });
    return out;
}

// ── diff ─────────────────────────────────────────────────────────────────────
function diffShape(a, b) {
    const out = [];
    for (const k of ['t', 'x', 'y', 'w', 'h', 'lines']) if (a[k] !== b[k]) out.push(`${k}: ${a[k]}→${b[k]}`);
    if (JSON.stringify(a.fs) !== JSON.stringify(b.fs)) out.push(`fs: [${a.fs}]→[${b.fs}]`);
    return out;
}

function diffDecks(oldSnap, curSnap) {
    const changes = [];
    const decks = new Set([...Object.keys(oldSnap), ...Object.keys(curSnap)]);
    for (const d of [...decks].sort()) {
        const o = oldSnap[d], c = curSnap[d];
        if (!o) { changes.push(`+ 덱 추가: ${d}`); continue; }
        if (!c) { changes.push(`- 덱 삭제: ${d}`); continue; }
        const slides = new Set([...Object.keys(o), ...Object.keys(c)]);
        for (const s of [...slides].sort((a, b) => a.slice(5) - b.slice(5))) {
            const os_ = o[s], cs = c[s];
            if (!os_) { changes.push(`  ${d} ${s}: 추가됨`); continue; }
            if (!cs) { changes.push(`  ${d} ${s}: 삭제됨`); continue; }
            if (os_.length !== cs.length) changes.push(`  ${d} ${s}: 도형 수 ${os_.length}→${cs.length}`);
            const n = Math.max(os_.length, cs.length);
            for (let i = 0; i < n; i++) {
                if (!os_[i]) { changes.push(`  ${d} ${s} #${i}: 새 도형 ${cs[i].t}`); continue; }
                if (!cs[i]) { changes.push(`  ${d} ${s} #${i}: 사라진 도형 ${os_[i].t}`); continue; }
                const dd = diffShape(os_[i], cs[i]);
                if (dd.length) changes.push(`  ${d} ${s} #${i} (${os_[i].t}): ${dd.join(', ')}`);
            }
        }
    }
    return changes;
}

// ── main ─────────────────────────────────────────────────────────────────────
(function main() {
    const decks = listDecks();
    if (!decks.length) { console.error(`[중단] courses/*/decks/에서 대상 덱(NN.js)을 찾지 못했다: ${COURSES_DIR}`); process.exit(2); }

    const cur = {};
    let failed = 0;
    for (const d of decks) {
        try {
            cur[d.key] = extractDeck(renderDeck(d.abs));
            const nSl = Object.keys(cur[d.key]).length;
            const nSh = Object.values(cur[d.key]).reduce((a, s) => a + s.length, 0);
            console.log(`  렌더 ${d.key}: 슬라이드 ${nSl} · 도형 ${nSh}`);
        } catch (e) { console.error(`  ✗ ${d.key}: ${e.message}`); failed++; }
    }
    if (failed) { console.error(`[중단] ${failed}개 덱 렌더 실패 — 스냅샷을 신뢰할 수 없다.`); process.exit(1); }

    if (UPDATE) {
        fs.mkdirSync(path.dirname(GOLDEN), { recursive: true });
        fs.writeFileSync(GOLDEN, JSON.stringify(cur, null, 2) + '\n');
        console.log(`\n[갱신] 골든 저장: ${path.relative(ROOT, GOLDEN)} (덱 ${decks.length})`);
        return;
    }

    if (!fs.existsSync(GOLDEN)) {
        console.error(`\n[중단] 골든이 없다: ${path.relative(ROOT, GOLDEN)} — 먼저 'npm run snap:update'로 현재 동작을 박제한다.`);
        process.exit(1);
    }
    const old = JSON.parse(fs.readFileSync(GOLDEN, 'utf8'));
    const changes = diffDecks(old, cur);
    if (!changes.length) { console.log('\n[일치] 기하 변화 없음.'); return; }
    console.log(`\n[변화 ${changes.length}] 골든과 다르다 (의도한 변경이면 snap:update):`);
    changes.forEach((c) => console.log(c));
    process.exit(1);
})();
