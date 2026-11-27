"use strict";
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),os=require('os'),path=require('path');
const {parse}=require('../parse'),{render}=require('../builder'),{TEMPLATE_DIR}=require('../template'),{inspect}=require('../inspect');
const {A,P,all,child,shape,text,body,kids}=require('../xml');
const {prepareColumnBlocks,OMISSION}=require('../columnLayout');
test('omission gaps apply to original question numbers, never section numbers',()=>{
 const bs=prepareColumnBlocks([{kind:'heading',text:'4. 업무 규칙'},{kind:'table',rows:[['규칙'],['승인']]},{kind:'heading',text:'6. 미정 질문'},{kind:'bullet',text:'1. 언제 생성하는가?'},{kind:'heading',text:'결제'},{kind:'bullet',text:'6. 승인 뒤 상태는?'}],{questionGaps:true});
 assert.equal(bs[1].kind,'table');assert.equal(bs.filter(b=>b.text===OMISSION).length,1);
});
const code='Scenario: 같은 주문 재결제\n  Given 금액은 2,000원이다\n    And 첫 카드는 거절된다\n  When 다른 카드로 결제한다\n  Then 결제완료다\n    And 배송 요청은 총 1회다';
const source='## 01. 사례\n\n### 기준\n\n> 한글 문형과 English original.\n\n- 같은 수준의 항목\n\n**인용문**\n\n한글 요약, "English with \\"internal\\" quotes.", [Author 2026]\n\n```gherkin\n'+code+'\n```\n\n## 별첨. 실습 답\n\n## 실제 응답\n\n**실제 LLM 응답**\n\n⟨대표 실행 B 발췌 — 설명⟩\n\n### 스토리\n\n> 주문하고 싶다.\n\n…\n\n**페이지 분할**\n\n### 결제 규칙\n\n- 승인 뒤 배송\n\n**페이지 분할**\n\n### 재결제\n\n- 같은 주문이다.\n\n**기대 결과**\n\n| 항목 | 거절 | 승인 |\n|---|---|---|\n| 배송 요청 | 0회 | 1회 |\n\n**페이지 분할**\n\n### 품질\n\n- 성능 기준을 확인한다.\n\n⟨중간 내용 생략⟩\n';
async function fixture(){const p=parse(source),file=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'tm-uo-')),'out.pptx');const m=await render(p.sections,TEMPLATE_DIR,file,'99. 테스트',[{kind:'bullet',text:'01. 사례',depth:0,rows:[]}]);return {m,file};}
test('all visible text uses Malgun Gothic and every paragraph explicitly uses 100% leading',async()=>{
 const {m,file}=await fixture();assert.deepEqual((await inspect(file,m)).errors,[]);
 for(const page of m.pages)for(const p of all(page.doc,A,'p')){
  assert.equal(child(child(child(p,A,'pPr'),A,'lnSpc'),A,'spcPct').getAttribute('val'),'100000');
  for(const r of kids(p,A,'r'))if(all(r,A,'t').some(t=>t.textContent))for(const tag of ['latin','ea','cs'])assert.equal(child(child(r,A,'rPr'),A,tag).getAttribute('typeface'),'맑은 고딕');
 }
});
test('Gherkin is one editable shape and keeps every source space, line and requested style',async()=>{
 const {m}=await fixture(),page=m.pages.find(p=>p.items.some(i=>i.kind==='gherkin')),it=page.items.find(i=>i.kind==='gherkin'),s=shape(page.doc,it.id);
 assert.equal(text(s),code);assert.equal(kids(body(s),A,'p').length,6);
 const bp=child(body(s),A,'bodyPr');assert.equal(bp.getAttribute('lIns'),'91440');assert.equal(bp.getAttribute('rIns'),'91440');
 for(const p of kids(body(s),A,'p')){
  const pr=child(p,A,'pPr');assert.equal(pr.getAttribute('marL'),'723900');assert.equal(pr.getAttribute('indent'),'0');assert.ok(child(pr,A,'buNone'));
  for(const side of ['spcBef','spcAft'])assert.equal(child(child(pr,A,side),A,'spcPts').getAttribute('val'),'300');
  assert.ok(all(p,A,'rPr').every(r=>r.getAttribute('sz')==='1200'));
 }
});
test('a no-glyph quotation starts at its same-level bullet glyph',async()=>{
 const {m}=await fixture(),page=m.pages.find(p=>!p.isToc&&!p.appendix);
 const ps=all(page.doc,A,'p'),quote=ps.find(p=>p.textContent.includes('한글 문형')),bullet=ps.find(p=>p.textContent.includes('같은 수준의 항목'));
 const a=child(quote,A,'pPr'),b=child(bullet,A,'pPr');assert.equal(Number(a.getAttribute('marL')),Number(b.getAttribute('marL'))+Number(b.getAttribute('indent')));assert.equal(a.getAttribute('indent'),'0');assert.ok(child(a,A,'buNone'));assert.ok(Number(b.getAttribute('indent'))<0);
});
test('recorded answer segments fill columns at the common size without losing source or omissions',async()=>{
 const {m}=await fixture(),ps=m.pages.filter(p=>p.appendix);assert.equal(ps.length,1);
 for(const p of ps){const bodies=p.items.filter(i=>i.kind==='body'&&i.text);assert.ok(bodies.length>=1);for(const it of bodies){const sh=shape(p.doc,it.id);assert.ok(kids(body(sh),A,'p').length>=2);}}
 assert.equal(ps[0].items.filter(i=>i.kind==='table').length,1);
 const printed=ps.flatMap(p=>p.items.map(i=>i.text||'')).join('\n');assert.ok(printed.includes('대표 실행 B'));assert.equal((printed.match(/…\.\./g)||[]).length,2);
});
test('recorded answer groups keep their table and original order at the common size',async()=>{
 const answer='## 별첨. 실습 답\n\n## 응답\n\n**실제 LLM 응답**\n\n### 스토리\n\n- 고객의 가치\n\n### 주문 생성\n\n- 배송지 확정\n\n### 금액\n\n- 생성 시 확정\n\n### 결제\n\n'+Array(8).fill('- 카드 승인과 거절의 처리 규칙을 확인한다.').join('\n')+'\n\n### 배송\n\n- 승인 뒤 요청\n\n**페이지 분할**\n\n### 재결제\n\n- 같은 주문\n\n**기대 결과**\n\n| 관찰 | 거절 | 승인 |\n|---|---|---|\n| 배송 | 0 | 1 |\n\n### 성능 시험\n\n'+Array(6).fill('- 같은 시험 환경에서 응답 시간을 측정한다.').join('\n')+'\n\n### 배송 실패\n\n- 정책은 미정\n';
 const p=parse('## 01. 사례\n\n본문\n\n'+answer),file=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'tm-answer-pages-')),'out.pptx');
 const m=await render(p.sections,TEMPLATE_DIR,file,'99. 테스트',[{kind:'bullet',text:'01. 사례',depth:0,rows:[]}]);
 const pages=m.pages.filter(p=>p.appendix);assert.equal(pages.length,1);
 assert.ok(pages[0].items.filter(i=>i.kind==='body'&&i.text).length>=1);
 const table=pages[0].items.find(i=>i.kind==='table');assert.ok(table);
 assert.ok(all(pages[0].doc,A,'tbl').length===1);
 assert.deepEqual((await inspect(file,m)).errors,[]);
 for(const page of pages)for(const it of page.items.filter(i=>i.kind==='body'&&i.text)) {
  for(const p of kids(body(shape(page.doc,it.id)),A,'p')) {
   const pr=child(p,A,'pPr'),head=pr.getAttribute('marL')==='0';
   assert.ok(all(p,A,'rPr').every(r=>r.getAttribute('sz')==='1000'));
   if(head){assert.ok(child(pr,A,'buNone'));assert.ok(all(p,A,'rPr').every(r=>r.getAttribute('b')==='1'));}
  }
 }
});
test('numbered events retain their original start values as native PowerPoint lists',async()=>{
 const bs=prepareColumnBlocks([{kind:'bullet',text:'1. 주문을 생성한다.'},{kind:'bullet',text:'3. 같은 주문에 다시 요청한다.'}]);
 assert.ok(bs.every(b=>b.meta.autoNumber));
 const {Builder}=require('../builder'),b=new Builder(TEMPLATE_DIR);await b.init('테스트');
 const page=b.fixedColumnPage([bs,[]],'사건',[{x:0.4,y:1.05,w:4.45,h:5.8},{x:5.15,y:1.05,w:4.45,h:5.8}]);
 assert.deepEqual(all(page.doc,A,'buAutoNum').map(n=>n.getAttribute('startAt')),['1','3']);
 assert.ok(all(page.doc,A,'p').filter(p=>p.textContent.includes('주문')).every(p=>Number(child(p,A,'pPr').getAttribute('indent'))<0));
});
// 본문의 문단 앞뒤 간격은 모든 세션에서 6pt이고, 글 높이 계산도 그 값을 쓴다. 2026-11-27까지는
// 세션명이 `03. 요구사항`이면 3pt였다 — 세션명으로 조판을 가르지 않는다.
test('본문의 문단 간격은 6pt이고 글 높이 계산이 그 값을 쓴다',async()=>{
 const {Builder}=require('../builder');const b=new Builder(TEMPLATE_DIR);await b.init('03. 요구사항');
 const bs=[{kind:'text',text:'짧은 본문',rows:[],depth:0}];
 const page=b.page(1,'본문');paragraphsForTest(page,bs);
 const pr=child(all(page.doc,A,'p').find(p=>p.textContent==='짧은 본문'),A,'pPr');
 for(const side of ['spcBef','spcAft'])assert.equal(child(child(pr,A,side),A,'spcPts').getAttribute('val'),'600');
 assert.ok(Math.abs(b.printedTextHeightPt(bs)-(18*1.2+12))<0.01);
});
function paragraphsForTest(page,bs){require('../paragraphs').paragraphs(page,8,bs,false);}
