"use strict";
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),os=require('os'),path=require('path');
const {parse}=require('../parse'),{render}=require('../builder'),{TEMPLATE_DIR}=require('../template'),{A,all,child}=require('../xml');
const md=String.raw`## 01. 인용

**인용문**

확인한 **기준**을 따른다, "Follow the \"verified\" criterion.", [Example 2026]

## 03. 요구와 요구사항

**요구**와 조건을 구별한다.

- **요구** — 결과를 원한다.
### 요구사항

- **기능** — 주문한다.

## 05. 사용자 스토리

### 카드와 대화

**인용문**

확인한 문장이다, "A verified sentence.", [Example 2026]

## 08. 품질

### 외부 예문

> “정해진 조건에서 응답한다.”
`;
async function fixture(session='03. 요구사항', course={productionProfile:'ai-native-s03'}){
 const p=parse(md),out=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'tm-or-')),'out.pptx');
 const toc=p.sections.map(s=>({kind:'bullet',text:s.title,rows:[],depth:0}));
 return render(p.sections,TEMPLATE_DIR,out,session,toc,course);
}
test('S03 citations show one pair of curly quotes around translation and original, retain inner quotes and keep source outside',async()=>{
 const m=await fixture(),ps=m.pages.flatMap(p=>all(p.doc,A,'p'));
 const text=p=>all(p,A,'t').map(t=>t.textContent).join('');
 const first=ps.find(p=>text(p).includes('Follow the'));
 assert.equal(text(first),'“확인한 기준을 따른다”, “Follow the "verified" criterion.”, [Example 2026]');
 const korean=all(first,A,'r').filter(r=>r.textContent.includes('확인한')||r.textContent.includes('기준'));
 assert.ok(korean.length);for(const r of korean)assert.equal(child(r,A,'rPr').getAttribute('sz'),'1800');
 const supporting=ps.find(p=>text(p).includes('A verified sentence.'));
 assert.equal(text(supporting),'“확인한 문장이다”, “A verified sentence.”, [Example 2026]');
 assert.equal(child(all(supporting,A,'r')[0],A,'rPr').getAttribute('sz'),'1600');
 for(const p of [first,supporting])for(const r of all(p,A,'r').filter(r=>/Follow|A verified|\[Example/.test(r.textContent)))assert.equal(child(r,A,'rPr').getAttribute('sz'),'1000');
 assert.ok(ps.some(p=>text(p)==='“정해진 조건에서 응답한다.”'));
});
test('S03 requirements label remains a distinct heading with space above the requirement list',async()=>{
 const m=await fixture(),page=m.pages.find(p=>p.heading==='03. 요구와 요구사항');
 const p=all(page.doc,A,'p').find(p=>p.textContent==='요구사항'),pr=child(p,A,'pPr');
 assert.equal(child(child(pr,A,'spcBef'),A,'spcPts').getAttribute('val'),'1200');
 assert.ok(child(pr,A,'buNone'));
});
test('S03 display punctuation does not change other sessions',async()=>{
 const m=await fixture('테스트'),texts=m.pages.flatMap(p=>all(p.doc,A,'t')).map(t=>t.textContent).join('');
 assert.ok(!texts.includes('“확인한 기준을 따른다”'));
});
test('the same requirements session title in another course retains default punctuation and spacing',async()=>{
 const m=await fixture('03. 요구사항',{name:'다른 과정',sessions:[]});
 const ps=m.pages.flatMap(p=>all(p.doc,A,'p'));
 assert.ok(!ps.some(p=>p.textContent.includes('“확인한 기준을 따른다”')));
 assert.ok(m.pages.every(p=>p.paragraphSpace===6 && !p.s03Profile));
});
