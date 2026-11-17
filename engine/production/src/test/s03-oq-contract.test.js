"use strict";
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),os=require('os'),path=require('path');
const {parse}=require('../parse'),{render}=require('../builder'),{TEMPLATE_DIR}=require('../template'),{inspect}=require('../inspect');
const {A,P,all,child,shape,body,kids}=require('../xml');
const md='## 11. LLM 초안 검토\n\n입력\n\n**페이지 분할**\n\n**문서 형식 — 10pt**\n\n### 원문 첫 제목\n\n### 1. 목적\n\n시연 첫 문단.\n\n### 2. 범위\n\n목록을 소개하는 문장.\n\n- 원문 첫 항목\n- 원문 둘째 항목\n\n.....\n\n**페이지 분할**\n\n판단한다.\n\n## 별첨. 실습 답\n\n## 응답\n\n**실제 LLM 응답**\n\n**문서 형식 — 10pt**\n\n### 문서 제목\n\n### 1. 목적\n\n답의 첫 문단.\n\n- 첫째 조건\n- 둘째 조건\n\n.....\n\n| 상황 | 사건 | 동일 주문 | 금액 | 요청 금액 | 상태 | 배송 |\n|---|---|---|---|---|---|---|\n| 정상 | 승인 | 같음 | 2000 | 2000 | PAID | 1 |\n';
async function fixture(){const p=parse(md),file=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'tm-oq-')),'out.pptx');const m=await render(p.sections,TEMPLATE_DIR,file,'03. 요구사항',[{kind:'bullet',text:'11. LLM 초안 검토',rows:[],depth:0}],{productionProfile:'ai-native-s03'});return {m,file};}
test('S03 recorded answers keep text at 10pt and appendix table cells alone at Malgun Gothic 8pt',async()=>{
 const {m,file}=await fixture();assert.deepEqual((await inspect(file,m)).errors,[]);
 const ps=m.pages.filter(p=>p.appendix||p.items.some(i=>(i.text||'').includes('원문 첫 제목')));
 for(const page of ps)for(const item of page.items){if(!item.text&&item.kind!=='table')continue;for(const rp of all(shape(page.doc,item.id),A,'rPr'))assert.equal(rp.getAttribute('sz'),item.kind==='table'&&page.appendix?'800':'1000');}
 assert.equal(m.pages.filter(p=>p.appendix).flatMap(p=>p.items).filter(i=>i.kind==='table').length,1);
 for(const page of m.pages)for(const gf of all(page.doc,P,'graphicFrame'))for(const rp of all(gf,A,'rPr')){
  assert.equal(rp.getAttribute('sz'),'800');
  for(const name of ['latin','ea','cs'])assert.equal(child(rp,A,name).getAttribute('typeface'),'맑은 고딕');
 }
 for(const page of m.pages)for(const gf of all(page.doc,P,'graphicFrame'))for(const tcPr of all(gf,A,'tcPr')){
  for(const k of ['marL','marR','marT','marB'])assert.equal(tcPr.getAttribute(k),'54000');
 }
});
test('the S03 exception covers half-width appendix and demo tables',async()=>{
 const source=md.replace('시연 첫 문단.','시연 첫 문단.\n\n| 이름 | 값 |\n|---|---|\n| 시연 | 원문 |').replace('답의 첫 문단.','답의 첫 문단.\n\n| 이름 | 값 |\n|---|---|\n| 별첨 | 원문 |');
 const p=parse(source),file=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'tm-oq-cells-')),'out.pptx');
 const m=await render(p.sections,TEMPLATE_DIR,file,'03. 요구사항',[{kind:'bullet',text:'11. LLM 초안 검토',rows:[],depth:0}],{productionProfile:'ai-native-s03'});
 let demo=0,answer=0;
 for(const page of m.pages)for(const gf of all(page.doc,P,'graphicFrame')){
  const appendix=gf.textContent.includes('별첨')||gf.textContent.includes('동일 주문');
  for(const rp of all(gf,A,'rPr'))assert.equal(rp.getAttribute('sz'),'800');
  for(const tcPr of all(gf,A,'tcPr')){
   assert.equal(tcPr.getAttribute('marT'),'54000');assert.equal(tcPr.getAttribute('marB'),'54000');
  }
  appendix?answer++:demo++;
 }
 assert.equal(demo,1);assert.equal(answer,2);
});
test('S03 judgment tables use 8pt and 0.15cm vertical margins while their explanation stays 10pt',async()=>{
 const source=md.replace('판단한다.','판단한다.\n\n| 관찰 | 판단 |\n|---|---|\n| 원문 근거 | 사람이 확정 |');
 const p=parse(source),file=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'tm-oq-judgment-')),'out.pptx');
 const m=await render(p.sections,TEMPLATE_DIR,file,'03. 요구사항',[{kind:'bullet',text:'11. LLM 초안 검토',rows:[],depth:0}],{productionProfile:'ai-native-s03'});
 assert.deepEqual((await inspect(file,m)).errors,[]);
 const page=m.pages.find(p=>all(p.doc,A,'t').some(t=>t.textContent.includes('원문 근거')));
 for(const gf of all(page.doc,P,'graphicFrame')){
  for(const rp of all(gf,A,'rPr'))assert.equal(rp.getAttribute('sz'),'800');
  for(const pr of all(gf,A,'tcPr')){assert.equal(pr.getAttribute('marT'),'54000');assert.equal(pr.getAttribute('marB'),'54000');}
 }
 for(const sp of all(page.doc,P,'sp'))if(sp.textContent.includes('판단한다.'))for(const rp of all(sp,A,'rPr'))assert.equal(rp.getAttribute('sz'),'1000');
});
test('demo introduction aligns with its first section, while an unbulleted list introduction aligns with the glyph',async()=>{
 const {m}=await fixture(),page=m.pages.find(p=>p.items.some(i=>(i.text||'').includes('원문 첫 제목')));
 const ps=all(page.doc,A,'p'),get=t=>ps.find(p=>p.textContent===t),pr=p=>child(p,A,'pPr'),n=(p,k)=>Number(pr(p).getAttribute(k));
 assert.equal(n(get('시연 첫 문단.'),'marL'),n(get('1. 목적'),'marL'));assert.equal(n(get('시연 첫 문단.'),'indent'),0);
 const intro=get('목록을 소개하는 문장.'),bullet=get('원문 첫 항목');assert.equal(n(intro,'marL'),n(bullet,'marL')+n(bullet,'indent'));assert.ok(child(pr(intro),A,'buNone'));
});
test('five ASCII omission dots remain editable, unbulleted and aligned with list body text',async()=>{
 const {m}=await fixture();let count=0;
 for(const page of m.pages)for(const sp of all(page.doc,P,'sp'))for(const p of kids(body(sp),A,'p'))if(p.textContent==='.....'){
  count++;const pr=child(p,A,'pPr');assert.ok(child(pr,A,'buNone'));assert.equal(pr.getAttribute('indent'),'0');
 }
 assert.equal(count,2);
});
test('inspection rejects a wrong margin in the last cell on each side and a wrong table frame width',async()=>{
 const {m,file}=await fixture(),{readZip,writeZip}=require('../zip'),{parseXml,xmlOut}=require('../xml');
 const original=await readZip(file),name=[...original.keys()].find(n=>/^ppt\/slides\/slide\d+\.xml$/.test(n)&&String(original.get(n)).includes('<a:tc>'));
 assert.ok(name);
 for(const side of ['marL','marR','marT','marB','width']){
  const data=new Map(original),doc=parseXml(data.get(name));
  if(side==='width')child(child(all(doc,P,'graphicFrame')[0],P,'xfrm'),A,'ext').setAttribute('cx','1');
  else all(doc,A,'tcPr').at(-1).setAttribute(side,'1');
  data.set(name,xmlOut(doc));await writeZip(file,data);
  assert.ok((await inspect(file,m)).errors.some(e=>e.includes(side==='width'?'table width':`table ${side}`)),side);
 }
});
