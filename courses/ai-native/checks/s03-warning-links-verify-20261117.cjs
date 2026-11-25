'use strict';
const fs=require('fs'),crypto=require('crypto'),assert=require('assert/strict');
const {readZip}=require('../../../engine/production/src/zip'),{parseXml,all,child,kids,A,P}=require('../../../engine/production/src/xml');
const root='courses/ai-native/checks/s03-warning-links-20261117';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const identity=p=>({path:p,sha256:sha(fs.readFileSync(p)),modified:fs.statSync(p).mtime.toISOString()});
const sourcePath='courses/ai-native/sessions/s03.md',pptx='courses/ai-native/sessions/s03.pptx',qaPath='courses/ai-native/sessions/s03.qa.json';
const norm=s=>s.replace(/\s+/g,'');
async function main(){
 const source=fs.readFileSync(sourcePath,'utf8'),old=await readZip('out/s03-warning-links-before.pptx'),current=await readZip(pptx);
 const names=[...current.keys()].filter(n=>/^ppt\/slides\/slide\d+\.xml$/.test(n)).sort((a,b)=>+a.match(/slide(\d+)/)[1]-+b.match(/slide(\d+)/)[1]);
 const docs=names.map(n=>parseXml(current.get(n))),oldDocs=names.map(n=>parseXml(old.get(n)));
 assert.equal(sha(source),JSON.parse(fs.readFileSync('courses/ai-native/checks/s03-baseline-20261117/verification.json')).input.sha256,'approved source changed');
 const paragraphs=documents=>documents.flatMap(d=>all(d,A,'p').map(p=>JSON.stringify({text:all(p,A,'t').map(t=>t.textContent).join(''),runs:all(p,A,'r').map(r=>({text:all(r,A,'t').map(t=>t.textContent).join(''),size:child(r,A,'rPr')?.getAttribute('sz'),bold:child(r,A,'rPr')?.getAttribute('b')}))}))).sort();
 assert.deepEqual(paragraphs(docs),paragraphs(oldDocs),'text or text styles changed');
 const cells=documents=>documents.flatMap(d=>all(d,A,'tc').map(c=>c.toString())).sort();
 assert.deepEqual(cells(docs),cells(oldDocs),'table cell text or formatting changed');
 const readingOrder=(documents,first,last)=>documents.slice(first-1,last).flatMap(d=>{
  const objects=[...all(d,P,'sp'),...all(d,P,'graphicFrame')].flatMap(node=>{
   const xf=node.localName==='graphicFrame'?child(node,P,'xfrm'):child(child(node,P,'spPr'),A,'xfrm'),off=xf&&child(xf,A,'off');if(!off)return [];
   const x=+off.getAttribute('x'),y=+off.getAttribute('y');
   if(y<914400 || y>=6309360)return [];
   return [{node,x,y,col:x>=4.9*914400?1:0}];
  }).sort((a,b)=>a.col-b.col||a.y-b.y||a.x-b.x);
  return objects.flatMap(({node})=>all(node,A,'p').map(p=>all(p,A,'t').map(t=>t.textContent).join('')).filter(t=>t.trim()));
 });
 for(const [first,last]of [[17,19],[26,30]])assert.deepEqual(readingOrder(docs,first,last),readingOrder(oldDocs,first,last),'recorded response reading order changed');
 const tables=[],counts={body:0,demo:0,judgment:0,appendix:0},pageTexts=docs.map(d=>norm(all(d,A,'t').map(t=>t.textContent).join(''))),beforeTexts=oldDocs.map(d=>norm(all(d,A,'t').map(t=>t.textContent).join('')));
 const find=(texts,s)=>texts.flatMap((t,i)=>t.includes(norm(s))?[i+1]:[]);
 const story='US-01. 장바구니 상품 주문',acceptance='장바구니의 상품을 대상으로 주문 처리를 시작할 수 있다.',description='고객으로서 장바구니에 담은 상품을 주문하고 결제하고 싶다.';
 const tail='와 주문 생성 시점에 주문 항목에 기록된 단가는 서로 구분한다. 기록된 항목 단가의 영문 표기는 아직 정하지 않았다.';
 const links={before:{story:find(beforeTexts,story),description:find(beforeTexts,description),acceptance:find(beforeTexts,acceptance),glossary:find(beforeTexts,'카드 승인 완료 후 배송 시스템에 전달하는 요청'),tail:find(beforeTexts,tail)},after:{story:find(pageTexts,story),description:find(pageTexts,description),acceptance:find(pageTexts,acceptance),glossary:find(pageTexts,'카드 승인 완료 후 배송 시스템에 전달하는 요청'),tail:find(pageTexts,tail)}};
 assert.deepEqual(links.after.story,[17]);assert.deepEqual(links.after.description,[17]);assert.deepEqual(links.after.acceptance,[17]);assert.deepEqual(links.after.glossary,[29]);assert.deepEqual(links.after.tail,[29]);
 const layout=[];
 for(const [i,d]of docs.entries()){
  for(const gf of all(d,P,'graphicFrame')){
   const cells=all(gf,A,'tc');if(!cells.length)continue;
   const kind=i+1>=26?'appendix':i+1===20?'judgment':[17,18].includes(i+1)?'demo':'body';
   for(const cell of cells){for(const side of ['marL','marR','marT','marB'])assert.equal(child(cell,A,'tcPr').getAttribute(side),'54000');for(const r of all(cell,A,'rPr'))assert.equal(r.getAttribute('sz'),kind==='body'?'1000':'800');}
   counts[kind]+=cells.length;tables.push({page:i+1,kind,cells:cells.length,fontPt:kind==='body'?10:8,marginsEMU:54000});
   const widths=all(gf,A,'gridCol').map(c=>+c.getAttribute('w')),ext=child(child(gf,P,'xfrm'),A,'ext');assert.ok(Math.abs(widths.reduce((a,b)=>a+b,0)-+ext.getAttribute('cx'))<=7);
   assert.equal(all(gf,A,'tr').reduce((n,r)=>n+ +r.getAttribute('h'),0),+ext.getAttribute('cy'));
  }
 }
 for(const i of [17,29]){
  const d=docs[i-1],get=s=>all(d,P,'sp').find(sp=>norm(all(sp,A,'t').map(t=>t.textContent).join('')).includes(norm(s)));
  if(i===17){const sp=get(story);assert.ok(norm(sp.textContent).includes(norm(acceptance)));layout.push({page:i,storyAndAcceptanceInSameEditableShape:true});}
  else {const sp=get(tail),table=all(d,P,'graphicFrame').find(gf=>gf.textContent.includes('salePrice')),xf=child(table,P,'xfrm'),off=child(xf,A,'off'),ext=child(xf,A,'ext'),sxf=child(child(sp,P,'spPr'),A,'xfrm'),soff=child(sxf,A,'off');const gap=+soff.getAttribute('y')-(+off.getAttribute('y')+ +ext.getAttribute('cy'));assert.ok(gap>=0);assert.equal(soff.getAttribute('x'),off.getAttribute('x'));layout.push({page:i,tailBelowGlossary:true,gapPt:gap/12700,sameColumn:true});}
 }
 const qa=JSON.parse(fs.readFileSync(qaPath)),beforeQA=JSON.parse(fs.readFileSync(root+'/before.qa.json')),audit=JSON.parse(fs.readFileSync(root+'/warning-audit.json'));
 const removed=beforeQA.warnings.filter(w=>!qa.warnings.includes(w)),remaining=audit.entries.filter(e=>qa.warnings.includes(e.warning));
 assert.equal(qa.warnings.length,28);assert.deepEqual(qa.errors,[]);assert.equal(removed.length,23);assert.ok(remaining.every(e=>e.category!=='검사 오탐'));
 const excerpts=JSON.parse(fs.readFileSync('courses/ai-native/checks/s03-production-20261117/excerpts.json'));assert.ok(source.includes(excerpts.demo.text)&&source.includes(excerpts.exercise.text));
 const record='courses/ai-native/sessions/code/s03/exercise-conversation/production-2026-11-16';
 assert.equal(source.split('## 11. LLM 초안 검토')[1].match(/```text\n([\s\S]*?)\n```/)[1],fs.readFileSync(record+'/demo/prompt-01.txt','utf8'));
 const requests=[...source.split('## 15. 실습 3 —')[1].split('## 16. 요약')[0].matchAll(/^  - (.+)$/gm)].map(m=>m[1]);assert.ok(fs.readFileSync(record+'/exercise/prompt-01.txt','utf8').startsWith(requests[0]+'\n'));assert.equal(requests[1],fs.readFileSync(record+'/exercise/prompt-03.txt','utf8'));
 const result={checkedAt:new Date().toISOString(),source:identity(sourcePath),pptx:identity(pptx),qa:identity(qaPath),slides:docs.length,changedPages:names.flatMap((n,i)=>current.get(n).equals(old.get(n))?[]:[i+1]),sourcePreserved:true,allParagraphTextSizesAndEmphasisPreserved:true,allTableCellsAndFormattingPreserved:true,recordedResponseReadingOrderPreserved:true,executionExcerptsAndPromptsPreserved:true,links,layout,cells:counts,totalCells:Object.values(counts).reduce((a,b)=>a+b,0),tables,initialWarnings:51,classifications:audit.counts,removedFalsePositives:removed.length,finalWarnings:qa.warnings.length,errors:qa.errors};
 fs.writeFileSync(root+'/verification.json',JSON.stringify(result,null,2));console.log(JSON.stringify({...result,tables:undefined}));
}
main().catch(e=>{console.error(e);process.exitCode=1});
