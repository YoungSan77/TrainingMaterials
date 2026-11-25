'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),os=require('os');
const {parse}=require('../parse'),{render}=require('../builder'),{inspect}=require('../inspect'),{TEMPLATE_DIR}=require('../template');
const {all,child,shape,text,A,P}=require('../xml');
test('S04 display quotes and column-contained recorded tables preserve source rows, group names, omissions and code',async()=>{
 const rows=Array.from({length:60},(_,i)=>`| 항목 ${i+1} | 주문 당시 기록한 값과 확인 근거를 순서대로 보존한다 |`).join('\n');
 const source='## 01. 인용\n\n**인용문**\n\n한글 번역, "English original.", [Example 2026]\n\n- 보조 번역, "Supporting original.", [Example 2026]\n\n## 별첨. 실습 답\n\n## 실제 문서\n\n**실제 LLM 응답**\n\n**문서 형식 — 10pt**\n\n### 1. 원래 그룹\n\n| 항목 | 근거 |\n|---|---|\n'+rows+'\n\n직후 설명을 보존한다.\n\n### 9.1 원래 질문\n\n19. 첫 질문\n20. 둘째 질문\n\n.....\n\n```text\nlineAmount\n= 1,000원 × 2\n= 2,000원\n```\n';
 const p=parse(source),file=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'tm-s04-cols-')),'out.pptx');
 const m=await render(p.sections,TEMPLATE_DIR,file,'04. 도메인 모델 — 정적 관점',[{kind:'bullet',text:'01. 인용',depth:0,rows:[]}],{productionProfile:'ai-native-s03'});
 assert.deepEqual((await inspect(file,m)).errors,[]);
 const quotePage=m.pages.find(p=>p.quoteChecks?.length);
 for(const q of quotePage.quoteChecks){const par=all(shape(quotePage.doc,q.id),A,'p')[q.index];assert.match(par.textContent,/^“.+”, “.+”, \[Example 2026\]$/);assert.ok(child(child(par,A,'pPr'),A,'buNone'));}
 const pages=m.pages.filter(p=>p.appendix),actual=[];
 assert.ok(pages.length>1);
 for(const page of pages){
  assert.equal(page.containedTables,true);
  for(const table of page.items.filter(i=>i.kind==='table')){
   const gf=shape(page.doc,table.id),xf=child(gf,P,'xfrm'),x=+child(xf,A,'off').getAttribute('x'),w=+child(xf,A,'ext').getAttribute('cx');
   assert.ok([.4,5.15].some(v=>Math.abs(x-v*914400)<2));assert.ok(w<=4.45*914400+2);
   assert.ok(all(gf,A,'rPr').every(r=>r.getAttribute('sz')==='800'));
   actual.push(...table.rows.slice(1).map(r=>r[0]));
  }
 }
 assert.deepEqual(actual,Array.from({length:60},(_,i)=>'항목 '+(i+1)));
 const content=pages.map(p=>p.items.filter(i=>i.kind!=='table').map(i=>i.text).join('\n')).join('\n');
 assert.match(content,/9\.1 원래 질문/);assert.match(content,/19\. 첫 질문\n20\. 둘째 질문/);assert.match(content,/\.\.\.\.\./);assert.match(content,/lineAmount\n= 1,000원 × 2\n= 2,000원/);
});
test('S04 source examples align their block origin to the regular list body without changing source whitespace',async()=>{
 const {Builder}=require('../builder'),{BULLET_LEVELS}=require('../paragraphs');
 const b=new Builder(TEMPLATE_DIR);await b.init('04. 도메인 모델 — 정적 관점',{productionProfile:'ai-native-s03'});
 const code={kind:'code',text:'    public int amount() {\n        return 2000;\n    }',meta:{language:'java'}};
 const page=b.sourceCode(code,'예문',[]),item=page.items.find(i=>i.kind==='source'),sh=shape(page.doc,item.id),off=all(sh,A,'off')[0],bp=all(sh,A,'bodyPr')[0];
 assert.equal(+off.getAttribute('x')+Number(bp.getAttribute('lIns')),Math.round(.4*914400)+91440+BULLET_LEVELS[1].marL);
 assert.equal(item.text,code.text);
});
test('S04 association legend retains its quotation, original diagram, table and trailing explanation on one slide',async()=>{
 const source='## 06. 관계와 다중성\n\n## 연관명과 다중성\n\n주문 항목의 수를 읽는다.\n\n**인용문**\n\n한글 정의, "Original definition.", [Example 2026]\n\n**도식 — SVG — 주문과 주문 항목의 연관**\n\n```svg\n<svg xmlns="http://www.w3.org/2000/svg" width="600" height="100" viewBox="0 0 600 100"><rect x="1" y="1" width="598" height="98" fill="white" stroke="black"/><text x="50" y="50" font-size="20">Order 1 — 1..* OrderItem</text></svg>\n```\n\n**표 — 관계선과 양 끝의 다중성**\n| 적힌 것 | 의미 |\n|---|---|\n| 1..* | 주문 항목 한 개 이상 |\n\n- 연관명은 관계의 이름이다.\n';
 const p=parse(source+'\n## 다른 관계\n\n다음 관계의 설명이다.\n'),file=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'tm-s04-legend-')),'out.pptx');
 const m=await render(p.sections,TEMPLATE_DIR,file,'04. 도메인 모델 — 정적 관점',[{kind:'bullet',text:'06. 관계와 다중성',depth:0,rows:[]}],{productionProfile:'ai-native-s03'});
 assert.deepEqual((await inspect(file,m)).errors,[]);
 const pages=m.pages.filter(p=>p.heading.startsWith('연관명과 다중성'));assert.equal(pages.length,1);
 const page=pages[0];assert.equal(page.pictures.length,1);assert.equal(page.quoteChecks.length,1);
 assert.ok(page.items.some(i=>i.kind==='table'));assert.ok(page.items.some(i=>i.text.includes('연관명은 관계의 이름이다.')));
});
