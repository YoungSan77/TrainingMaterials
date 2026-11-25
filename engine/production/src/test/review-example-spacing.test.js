'use strict';
const test=require('node:test'),assert=require('assert/strict'),fs=require('fs'),os=require('os'),path=require('path');
const {parse}=require('../parse'),{render}=require('../builder'),{inspect}=require('../inspect'),{TEMPLATE_DIR}=require('../template'),{A,all,child,kids,body,shape,parseXml,xmlOut}=require('../xml'),{readZip,writeZip}=require('../zip');
const input='## 01. 임의 검토\n\n일반 안내다.\n\n**검토할 모델**\n\n- 고객의 검토 문장이다.\n- 항목의 검토 문장이다.\n\n1. 근거를 확인하라.\n\n**다른 설명**\n\n일반 설명을 유지한다.\n\n```java\nclass Sample {\n    int amount() { return 2000; }\n}\n```\n';
async function fixture(){const p=parse(input),file=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'tm-review-spacing-')),'out.pptx'),m=await render(p.sections,TEMPLATE_DIR,file,'77. 다른 세션',[{kind:'bullet',text:'01. 임의 검토',depth:0,rows:[]}],{});return {m,file};}
test('author review scope is content-based, ends before questions/code, and never changes recorded responses',()=>{
 const p=parse(input),marked=p.sections[0].blocks.filter(b=>b.meta?.reviewExample);assert.deepEqual(marked.map(b=>b.text),['고객의 검토 문장이다.','항목의 검토 문장이다.']);
 const q=parse('## 별첨. 실습 답\n\n## 응답\n\n**실제 LLM 응답**\n\n**검토할 모델**\n\n- 원문이다.\n');assert.ok(q.sections.every(s=>s.blocks.every(b=>!b.meta?.reviewExample)));
});
test('review prose has explicit 3pt on both sides while Java keeps zero internal paragraph gaps',async()=>{
 const {m,file}=await fixture();assert.deepEqual((await inspect(file,m)).errors,[]);let checks=0,code=0;
 for(const page of m.pages){
  for(const c of page.proseSpacingChecks||[]){const pr=child(kids(body(shape(page.doc,c.id)),A,'p')[c.index],A,'pPr');for(const side of ['spcBef','spcAft'])assert.equal(child(child(pr,A,side),A,'spcPts').getAttribute('val'),'300');checks++;}
  for(const it of page.items.filter(i=>i.kind==='source'))for(const p of all(shape(page.doc,it.id),A,'p')){const pr=child(p,A,'pPr');for(const side of ['spcBef','spcAft'])assert.equal(child(child(pr,A,side),A,'spcPts').getAttribute('val'),'0');code++;}
 }
 assert.equal(checks,2);assert.equal(code,3);
});
test('QA rejects a review paragraph gap regression in the final written PPTX',async()=>{
 const {m,file}=await fixture(),z=await readZip(file),pi=m.pages.findIndex(p=>p.proseSpacingChecks?.length),c=m.pages[pi].proseSpacingChecks[0],name=`ppt/slides/slide${pi+1}.xml`,doc=parseXml(z.get(name)),p=kids(body(shape(doc,c.id)),A,'p')[c.index];
 child(child(child(p,A,'pPr'),A,'spcAft'),A,'spcPts').setAttribute('val','600');z.set(name,xmlOut(doc));await writeZip(file,z);
 assert.ok((await inspect(file,m)).errors.some(e=>/review example paragraph spacing/.test(e)));
});
