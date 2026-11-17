"use strict";
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),os=require('os'),path=require('path');
const {parse}=require('../parse'),{render}=require('../builder'),{TEMPLATE_DIR}=require('../template'),{inspect}=require('../inspect');
const {A,all,child,shape,text}=require('../xml');
const {prepareColumnBlocks}=require('../columnLayout');
async function fixture(md){const p=parse(md),file=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'tm-alignment-')),'out.pptx');const toc=p.sections.filter(s=>!s.appendix).map(s=>({kind:'bullet',text:s.title,rows:[],depth:0}));return {file,m:await render(p.sections,TEMPLATE_DIR,file,'03. 요구사항',toc,{productionProfile:'ai-native-s03'})};}
const attr=(p,name)=>Number(child(p,A,'pPr').getAttribute(name));
test('story patterns align to list text at 14pt while quotations align to the glyph',async()=>{
 const {m}=await fixture('## 05. 사용자 스토리와 업무 규칙\n\n### 문형\n\n- 역할·목표·가치를 확인한다.\n\n> As a [role], I want [goal].\n\n> **[역할]로서 목표를 달성하고 싶다.**\n\n> 고객으로서 상품을 주문하고 싶다.\n\n**인용문**\n\n요약, "Original.", [Author 2026]\n');
 const ps=m.pages.filter(p=>!p.isToc).flatMap(p=>all(p.doc,A,'p'));const bullet=ps.find(p=>p.textContent==='역할·목표·가치를 확인한다.');
 for(const pattern of ['As a','[역할]','고객으로서']) {const p=ps.find(p=>p.textContent.startsWith(pattern));assert.equal(attr(p,'marL'),attr(bullet,'marL'));assert.equal(attr(p,'indent'),0);assert.ok(all(p,A,'rPr').every(r=>r.getAttribute('sz')==='1400'));}
 const quote=ps.find(p=>p.textContent.startsWith('“요약”,'));assert.equal(attr(quote,'marL'),attr(bullet,'marL')+attr(bullet,'indent'));
});
test('recorded S03 input is one editable 12pt block aligned to the preceding list text',async()=>{
 const input='첫째 줄\n  상대 들여쓰기\n\n마지막 줄';
 const {m,file}=await fixture('## 11. LLM 초안 검토\n\n### 시연 입력\n\n입력에서 합의한 규칙을 찾는다.\n\n**기록 그대로**\n\n```text\n'+input+'\n```\n');
 assert.deepEqual((await inspect(file,m)).errors,[]);
 const page=m.pages.find(p=>p.items.some(i=>i.kind==='input')),it=page.items.find(i=>i.kind==='input'),sh=shape(page.doc,it.id);
 assert.equal(text(sh),input);assert.equal(page.items.filter(i=>i.kind==='input').length,1);
 for(const p of all(sh,A,'p')){assert.equal(attr(p,'marL'),723900);assert.equal(attr(p,'indent'),0);for(const side of ['spcBef','spcAft'])assert.equal(child(child(child(p,A,'pPr'),A,side),A,'spcPts').getAttribute('val'),'300');}
 assert.ok(all(sh,A,'rPr').every(r=>r.getAttribute('sz')==='1200'));
});
test('authored omissions are not duplicated when question numbers have gaps',()=>{
 const bs=prepareColumnBlocks([{kind:'bullet',text:'1. 질문 하나'},{kind:'text',text:'…..'},{kind:'bullet',text:'6. 질문 여섯'}],{questionGaps:true});
 assert.equal(bs.filter(b=>b.text==='…..').length,1);
});
test('10pt document height counts a full-width Korean wrap before placing a native table',()=>{
 const {columnTextHeight}=require('../columnLayout');
 const block={kind:'bullet',text:'가'.repeat(24)+' '+'나'.repeat(3),meta:{columnDepth:1}};
 // 320.4 - 14.4 - 57.6 = 248.4pt available; 273.5pt needs two lines.
 assert.equal(columnTextHeight([block],320.4,3,{document:true}),30);
});
test('a response introduction starts at the same X as its first section heading',async()=>{
 const {m}=await fixture('## 11. LLM 초안 검토\n\n입력 설명\n\n**페이지 분할**\n\n**문서 형식 — 10pt**\n\n### 원문 제목\n\n### 1. 목적\n\n응답의 첫 문단이다.\n\n### 2. 범위\n\n- 첫 조건\n');
 const page=m.pages.find(p=>p.items.some(i=>(i.text||'').includes('응답의 첫 문단')));
 const ps=all(page.doc,A,'p'),intro=ps.find(p=>p.textContent==='응답의 첫 문단이다.'),head=ps.find(p=>p.textContent==='1. 목적');
 assert.equal(attr(intro,'marL'),attr(head,'marL'));assert.equal(attr(intro,'indent'),0);assert.ok(child(child(intro,A,'pPr'),A,'buNone'));
});
test('mixed-document restyling keeps the response introduction unbulleted and heading-aligned',async()=>{
 const {Builder}=require('../builder'),{paragraphs}=require('../paragraphs'),{restyle}=require('../styleFit');
 const b=new Builder(TEMPLATE_DIR);await b.init('03. 요구사항',{productionProfile:'ai-native-s03'});const page=b.page(1,'응답');
 paragraphs(page,8,[{kind:'heading',text:'1. 목적',depth:0},{kind:'bullet',text:'응답 도입부',depth:0}],false);
 restyle(shape(page.doc,8),{uniform:true,text:10,heading:10,levels:[10,10,10],expl:x=>x,paren:x=>x,space:3,documentIndent:true,introText:'응답 도입부'});
 const ps=all(shape(page.doc,8),A,'p');assert.equal(attr(ps[0],'marL')+attr(ps[0],'indent'),attr(ps[1],'marL'));assert.ok(child(child(ps[1],A,'pPr'),A,'buNone'));assert.equal(attr(ps[1],'indent'),0);
});
test('a recorded mixed response keeps its first title and editable columns around the original diagram',async()=>{
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="160" height="80" viewBox="0 0 160 80"><text x="10" y="40" font-size="16">원문</text></svg>';
 const {m,file}=await fixture('## 11. LLM 초안 검토\n\n입력 설명\n\n**페이지 분할**\n\n**문서 형식 — 10pt**\n\n### 실제 문서 첫 제목\n\n### 1. 목적\n\n응답 도입 문장이다.\n\n- 확정 조건이다.\n\n### 원문 도식 제목\n\n```svg\n'+svg+'\n```\n\n### 2. 남은 질문\n\n- 원문 질문이다.\n');
 assert.deepEqual((await inspect(file,m)).errors,[]);
 const p=m.pages.find(p=>p.items.some(i=>(i.text||'').includes('실제 문서 첫 제목')));assert.equal(p.answerColumns,2);
 const ps=all(p.doc,A,'p'),intro=ps.find(p=>p.textContent==='응답 도입 문장이다.'),head=ps.find(p=>p.textContent==='1. 목적');assert.equal(attr(intro,'marL'),attr(head,'marL'));
 assert.ok(m.pages.some(p=>p.pictures?.some(pic=>pic.source===svg)));
 assert.ok(m.pages.find(p=>p.pictures?.some(pic=>pic.source===svg)).items.some(i=>(i.text||'').includes('원문 도식 제목')));
 assert.ok(m.pages.some(p=>p.items.some(i=>(i.text||'').includes('원문 질문이다.'))));
});
