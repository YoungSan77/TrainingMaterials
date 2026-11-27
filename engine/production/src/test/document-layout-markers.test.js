'use strict';
// 배치는 **원고의 표식**이 요청한다 — 세션 이름이 아니다. 2026-11-27까지 이 배치들은 특정 세션명
// (`04. 도메인 모델 — 정적 관점`·`05. 도메인 모델 — 동적 관점`)에 묶여 있었고, 그 이름은 개편된
// Curriculum에 더는 없다. 표식으로 바꾸었으므로 어느 과정의 어느 세션이든 요청할 수 있다.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),os=require('os');
const {parse}=require('../parse'),{render}=require('../builder'),{inspect}=require('../inspect'),{TEMPLATE_DIR}=require('../template');
const {all,child,shape,A,P}=require('../xml');

const deck=async(source,toc,name)=>{
 const p=parse(source),file=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'tm-'+name+'-')),'out.pptx');
 return {m:await render(p.sections,TEMPLATE_DIR,file,'99. 테스트',toc),file};
};

test('`**문서 형식 — 단내 표**`는 기록 별첨의 표를 단 안에 두고 원문 행·그룹명·생략·코드를 보존한다',async()=>{
 const rows=Array.from({length:60},(_,i)=>`| 항목 ${i+1} | 주문 당시 기록한 값과 확인 근거를 순서대로 보존한다 |`).join('\n');
 const source='## 01. 인용\n\n**인용문**\n\n한글 요약, "English original.", [Example 2026]\n\n- 보조 요약, "Supporting original.", [Example 2026]\n\n## 별첨. 실습 답\n\n## 실제 문서\n\n**실제 LLM 응답**\n\n**문서 형식 — 10pt**\n\n**문서 형식 — 단내 표**\n\n### 1. 원래 그룹\n\n| 항목 | 근거 |\n|---|---|\n'+rows+'\n\n직후 설명을 보존한다.\n\n### 9.1 원래 질문\n\n19. 첫 질문\n20. 둘째 질문\n\n.....\n\n```text\nlineAmount\n= 1,000원 × 2\n= 2,000원\n```\n';
 const {m,file}=await deck(source,[{kind:'bullet',text:'01. 인용',depth:0,rows:[]}],'contained');
 assert.deepEqual((await inspect(file,m)).errors,[]);
 // 요약형 인용은 한글에 따옴표를 두지 않고 영문 원문만 표시 따옴표로 감싼다. 글머리표는 없다.
 const quotePage=m.pages.find(p=>p.quoteChecks?.length);
 for(const q of quotePage.quoteChecks){
  const par=all(shape(quotePage.doc,q.id),A,'p')[q.index];
  assert.match(par.textContent,/^.+, “.+”, \[Example 2026\]$/);
  assert.ok(child(child(par,A,'pPr'),A,'buNone'));
 }
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

test('표식이 없으면 기록 별첨의 표는 단 안에 갇히지 않는다',async()=>{
 const source='## 01. 본문\n\n**본문**이다.\n\n## 별첨. 실습 답\n\n## 실제 문서\n\n**실제 LLM 응답**\n\n**문서 형식 — 10pt**\n\n| 항목 | 근거 |\n|---|---|\n| 하나 | 확인한 값이다 |\n';
 const {m}=await deck(source,[{kind:'bullet',text:'01. 본문',depth:0,rows:[]}],'free');
 for(const page of m.pages.filter(p=>p.appendix))assert.ok(!page.containedTables,'표식 없이 단내 표를 적용하지 않는다');
});

test('`**배치 — 도식과 표 한 장**`은 도식과 표를 한 장에 두고 제목을 각 표식에서 읽는다',async()=>{
 const uml='**도식 — PlantUML — 상태 기계의 기본 표기**\n\n```plantuml:state\n@startuml\nleft to right direction\nstate "결제대기" as Pending\nstate "결제완료" as Paid\n[*] --> Pending : 주문 생성\nPending --> Paid : 승인 완료\n@enduml\n```';
 const source='## 06. 상태 기계\n\n## 상태 기계의 표기와 의미\n\n**배치 — 도식과 표 한 장**\n\n현재 상태와 사건을 **구분**한다.\n\n'+uml+'\n\n**표 — 그림에서 찾는 표기**\n| 표기 | 의미 |\n|---|---|\n| 검은 원 | 시작점 |\n| 방향 화살표 | 전이 |\n\n- 가드는 **전이가 허용되는 조건**이다.\n\n## 다른 표기\n\n다음 **표기**의 설명이다.\n';
 const {m,file}=await deck(source,[{kind:'bullet',text:'06. 상태 기계',depth:0,rows:[]}],'legend');
 assert.deepEqual((await inspect(file,m)).errors,[]);
 const pages=m.pages.filter(p=>p.heading.startsWith("상태 기계의 표기와 의미"));
 assert.equal(pages.length,1,'한 장이다');
 const page=pages[0];
 assert.equal(page.pictures.length,1);
 assert.ok(page.items.some(i=>i.kind==='table'));
 assert.ok(page.items.some(i=>i.text?.includes('가드는 전이가 허용되는 조건이다.')),'표 뒤의 설명이 같은 장에 남는다');
 // 제목은 renderer에 적힌 문구가 아니라 원고의 표식에서 온다.
 const texts=all(page.doc,A,'t').map(t=>t.textContent);
 assert.ok(texts.includes('상태 기계의 기본 표기'),texts.join(' / '));
 assert.ok(texts.includes('그림에서 찾는 표기'),texts.join(' / '));
});
