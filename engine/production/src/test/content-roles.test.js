"use strict";
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),os=require('os'),path=require('path');
const {parse}=require('../parse'),{render}=require('../builder'),{TEMPLATE_DIR}=require('../template'),{inspect}=require('../inspect');
const {A,P,all,child,shape}=require('../xml'),roles=require('../contentRoles');
const source=`## 01. 일반 설명

일반 표다.

| 값 | 뜻 |
|---|---|
| 식별자 | 같은 대상을 구별한다 |

## 02. 응답 검토

**기록 그대로**

입력이다.

**페이지 분할**

**문서 형식 — 10pt**

### 실제 문서

| 용어 | 정의 |
|---|---|
| 주문 | 기록된 거래 |

**페이지 분할**

| 실제 응답 | 사람의 판단 |
|---|---|
| 발견한 조건 | 근거로 확인 |

## 별첨. 실습 답

## 저장된 응답

**실제 LLM 응답**

**문서 형식 — 10pt**

### 결과

| 이름 | 의미 |
|---|---|
| 같은 주문 | 기존 금액을 유지한다 |
`;
async function fixture(session='04. 임의 세션',course={name:'다른 과정',sessions:[]}){
 const p=parse(source),file=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'tm-role-')),'out.pptx');
 const toc=p.sections.filter(s=>/^\d\d\./.test(s.title)).map(s=>({kind:'bullet',text:s.title,depth:0,rows:[]}));
 return {file,m:await render(p.sections,TEMPLATE_DIR,file,session,toc,course)};
}
test('the same content roles apply in arbitrary sessions and unrelated courses, including every header/body cell',async()=>{
 for(const [session,course] of [['03. 요구사항',{name:'다른 과정',sessions:[]}],['99. 응답',{name:'기계학습',sessions:[]}]]){
  const {m,file}=await fixture(session,course);assert.deepEqual((await inspect(file,m)).errors,[]);
  const seen=new Set();
  for(const p of m.pages)for(const item of p.items.filter(i=>i.kind==='table')){
   seen.add(item.role);const table=shape(p.doc,item.id),size=roles.isRecorded(item.role)?'800':'1000';
   for(const rp of all(table,A,'rPr'))assert.equal(rp.getAttribute('sz'),size);
   for(const rp of all(table,A,'endParaRPr'))assert.equal(rp.getAttribute('sz'),size);
   const cells=all(table,A,'tc');assert.ok(cells.length);
   for(const c of cells)for(const side of ['marL','marR','marT','marB'])assert.equal(child(c,A,'tcPr').getAttribute(side),'54000');
  }
  for(const role of [roles.LECTURE,roles.RECORDED,roles.REVIEW])assert.ok(seen.has(role),role);
 }
});
test('QA catches corruption in every cell side, measured last-row height and an independent citation run',async()=>{
 const {m,file}=await fixture();const {readZip,writeZip}=require('../zip'),{parseXml,xmlOut}=require('../xml');
 const original=await readZip(file),target=[...original.keys()].find(n=>/^ppt\/slides\/slide\d+.xml$/.test(n)&&String(original.get(n)).includes('같은 주문'));
 for(const defect of ['marL','marR','marT','marB','rowHeight']){
  const data=new Map(original),doc=parseXml(data.get(target));
  if(defect==='rowHeight')all(doc,A,'tr').at(-1).setAttribute('h','1');
  else all(doc,A,'tcPr').at(-1).setAttribute(defect,'1');
  data.set(target,xmlOut(doc));await writeZip(file,data);
  assert.ok((await inspect(file,m)).errors.length,defect);
 }
});
test('an independent marked citation following prose stays 18pt while an authored bullet citation follows its list size',async()=>{
 const p=parse('## 01. 인용\n\n설명이다.\n\n**인용문**\n\n독립 **인용**이다, "Independent quote.", [Example 2026]\n\n- 목록 인용이다, "Supporting quote.", [Example 2026]\n');
 const file=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'tm-role-quote-')),'out.pptx');
 const m=await render(p.sections,TEMPLATE_DIR,file,'04. 다른 과정',[{kind:'bullet',text:'01. 인용',depth:0,rows:[]}]);
 assert.deepEqual((await inspect(file,m)).errors,[]);
 const page=m.pages.find(p=>p.quoteChecks?.length);assert.equal(page.quoteChecks.length,2);
 assert.deepEqual(page.quoteChecks.map(c=>c.koreanSize),[18,16]);
 const {readZip,writeZip}=require('../zip'),{parseXml,xmlOut}=require('../xml');
 const data=await readZip(file),name=[...data.keys()].find(n=>/^ppt\/slides\/slide\d+.xml$/.test(n)&&String(data.get(n)).includes('Independent quote'));
 const doc=parseXml(data.get(name)),r=all(doc,A,'r').find(r=>r.textContent.includes('독립'));
 child(r,A,'rPr').setAttribute('sz','1600');data.set(name,xmlOut(doc));await writeZip(file,data);
 assert.ok((await inspect(file,m)).errors.some(e=>e.includes('quote font')));
});
test('a review table does not overwrite the independent citation embedded in its author explanation',async()=>{
 const source='## 01. 검토\n\n설명한다.\n\n**인용문**\n\n독립 인용, "Independent.", [Example 2026]\n\n| 초안이 쓴 말 | 사람이 결정한 것 |\n|---|---|\n| 결과 | 근거 |\n';
 const p=parse(source),file=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'tm-review-quote-')),'out.pptx');
 const m=await render(p.sections,TEMPLATE_DIR,file,'99. 검토',[{kind:'bullet',text:'01. 검토',depth:0,rows:[]}]);
 assert.deepEqual((await inspect(file,m)).errors,[]);
 assert.ok(m.pages.some(p=>p.contentRole===roles.REVIEW));
 assert.ok(m.pages.flatMap(p=>p.quoteChecks||[]).every(q=>q.koreanSize===18));
});
test('long recorded inputs retain every source line across editable 12pt pages',async()=>{
 const {Builder}=require('../builder');const b=new Builder(TEMPLATE_DIR);await b.init('99. 입력');
 const text=Array.from({length:70},(_,i)=>`${i+1}. 실제 입력의 문장과 공백을 그대로 보존한다.`).join('\n');
 b.gherkin({kind:'code',text,meta:{language:'recordedInput'}},'입력',[]);
 assert.ok(b.pages.length>1);
 const parts=b.pages.flatMap(p=>p.items.filter(i=>i.kind==='input').map(i=>i.text));assert.equal(parts.join('\n'),text);
 for(const p of b.pages)for(const it of p.items.filter(i=>i.kind==='input'))for(const rp of all(shape(p.doc,it.id),A,'rPr'))assert.equal(rp.getAttribute('sz'),'1200');
});
