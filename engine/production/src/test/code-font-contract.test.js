'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),os=require('os'),path=require('path');
const {parse}=require('../parse'),{render}=require('../builder'),{inspect}=require('../inspect'),{TEMPLATE_DIR}=require('../template'),{A,all,child,parseXml,xmlOut}=require('../xml'),{readZip,writeZip}=require('../zip');
async function fixture(){
 const source='## 01. 코드\n\n```java\npublic int amount() { return 2000; } // 주문 금액\n```\n\n## 별첨. 실습 답\n\n## 실제 응답\n\n**실제 LLM 응답**\n\n**문서 형식 — 10pt**\n\n**문서 형식 — 단내 표**\n\n### 계산\n\n```text\nlineAmount = unitPrice × quantity\n주문 금액 = 2,000원\n```\n';
 const p=parse(source),file=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'tm-font-contract-')),'out.pptx');
 const m=await render(p.sections,TEMPLATE_DIR,file,'99. 테스트',[{kind:'bullet',text:'01. 코드',depth:0,rows:[]}]);return {m,file};
}
test('ordinary and recorded-document fenced code use Consolas Latin and Malgun Gothic Korean without changing source',async()=>{
 const {m,file}=await fixture();assert.deepEqual((await inspect(file,m)).errors,[]);
 assert.ok(m.pages.some(p=>p.codeParagraphChecks?.length===2));
 assert.ok(m.pages.some(p=>p.items.some(i=>i.kind==='source')));
});
test('QA rejects a font regression in ordinary code and in an individual recorded code paragraph',async()=>{
 const {m,file}=await fixture(),original=await readZip(file);
 for(const token of ['public int','lineAmount']){
  const data=new Map(original),name=[...data.keys()].find(n=>/^ppt\/slides\/slide\d+.xml$/.test(n)&&String(data.get(n)).includes(token));
  const doc=parseXml(data.get(name)),r=all(doc,A,'r').find(r=>r.textContent.includes(token));child(child(r,A,'rPr'),A,'latin').setAttribute('typeface','맑은 고딕');
  data.set(name,xmlOut(doc));await writeZip(file,data);assert.ok((await inspect(file,m)).errors.some(e=>e.includes('code font')));
 }
});
