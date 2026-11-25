const fs=require('fs'),Zip=require('../../../../engine/production/node_modules/jszip'),assert=require('assert/strict');
const {parseXml,all,child,kids,A,P}=require('../../../../engine/production/src/xml');
const {summaryParts,citationParts,displayQuote}=require('../../../../engine/production/src/paragraphs'),{plain}=require('../../../../engine/production/src/text'),{fitTableRows}=require('../../../../engine/production/src/tableRowMetrics');
const base='courses/ai-native/checks/s03-production-or-20261117';
(async()=>{
 const old=await Zip.loadAsync(fs.readFileSync('out/s03-or-20261117/before.pptx')),z=await Zip.loadAsync(fs.readFileSync('courses/ai-native/sessions/s03.pptx'));
 const source=fs.readFileSync('courses/ai-native/sessions/s03.md','utf8'),docs=[],changed=[],unchanged=[],tables=[],citationChecks=[];
 for(let i=1;i<=30;i++){
  const name=`ppt/slides/slide${i}.xml`,bytes=await z.file(name).async('nodebuffer');
  ((await old.file(name).async('nodebuffer')).equals(bytes)?unchanged:changed).push(i);docs.push(parseXml(bytes));
 }
 const texts=docs.map(d=>all(d,A,'t').map(t=>t.textContent).join(''));
 assert.ok(texts.every(t=>!/==[\s\S]*?==/.test(t)));
 for(const line of source.split('\n')){
  const parts=citationParts(line)||summaryParts(line);if(!parts||!/^\[.+\]$/.test(parts[3]))continue;
  const expected=plain(`${displayQuote(parts[1])}${parts[5]||', '}${parts[2]?displayQuote(parts[2])+', ':''}${parts[3]}`);
  const ps=docs.flatMap((d,i)=>all(d,A,'p').map(p=>({p,page:i+1}))),found=ps.find(({p})=>all(p,A,'t').map(t=>t.textContent).join('')===expected);
  assert.ok(found,expected);
  const sizes=all(found.p,A,'rPr').map(r=>r.getAttribute('sz'));
  assert.ok(sizes.every(s=>['1000','1200','1400','1600','1800'].includes(s)));
  for(const r of kids(found.p,A,'r'))if(r.textContent.includes(parts[2])||r.textContent.includes(parts[3]))assert.equal(child(r,A,'rPr').getAttribute('sz'),'1000');
  citationChecks.push({page:found.page,text:expected,sizes:[...new Set(sizes)]});
 }
 assert.equal(citationChecks.length,3);
 const heading=all(docs[4],A,'p').find(p=>p.textContent==='요구사항');assert.ok(heading);assert.equal(child(child(child(heading,A,'pPr'),A,'spcBef'),A,'spcPts').getAttribute('val'),'1200');
 for(const [page,section] of [[3,'02. 주문 요청'],[13,'08. 품질']]){
  const part=source.split(`## ${section}`)[1],value=part.match(/^> (.+)$/m)[1];assert.ok(texts[page-1].includes(value));assert.ok(!texts[page-1].includes('“'+value+'”'));
 }
 const tablePages=[17,18,20,28,29];
 for(const page of tablePages)for(const gf of all(docs[page-1],P,'graphicFrame')){
  const rowHeights=all(gf,A,'tr').map(r=>Number(r.getAttribute('h'))),ext=child(child(gf,P,'xfrm'),A,'ext');assert.equal(Number(ext.getAttribute('cy')),rowHeights.reduce((a,b)=>a+b,0));
  for(const rp of all(gf,A,'rPr'))assert.equal(rp.getAttribute('sz'),'800');
  for(const tc of all(gf,A,'tcPr')){assert.equal(tc.getAttribute('marT'),'54000');assert.equal(tc.getAttribute('marB'),'54000');}
  const widths=all(gf,A,'gridCol').map(c=>Number(c.getAttribute('w')));const measured=fitTableRows(gf);assert.deepEqual(measured.rows.map(r=>r.afterEMU),rowHeights);
  tables.push({page,cells:all(gf,A,'tc').length,widthsEMU:widths,rowHeightsEMU:rowHeights,frameEqualsRowSum:true});
 }
 for(const page of [6,14])for(const gf of all(docs[page-1],P,'graphicFrame'))tables.push({page,widthsPt:all(gf,A,'gridCol').map(c=>Number(c.getAttribute('w'))/12700),fontPt:10});
 const norm=t=>t.replace(/\s/g,'');
 for(const [page,language] of [[11,'gherkin'],[16,'text']]){
  const code=source.split(page===11?'### Given–When–Then으로 재결제 사례를 기록한다':'## 11. LLM 초안 검토')[1].match(new RegExp('```'+language+'\\n([\\s\\S]*?)\\n```'))[1];
  assert.ok(norm(texts[page-1]).includes(norm(code)));
  const sp=all(docs[page-1],P,'sp').find(s=>s.textContent.includes(code.split('\n')[0]));assert.ok(sp);
  for(const rp of all(sp,A,'rPr'))assert.equal(rp.getAttribute('sz'),'1200');
  for(const p of all(sp,A,'p')){
   const pr=child(p,A,'pPr');for(const k of ['spcBef','spcAft'])assert.equal(child(child(pr,A,k),A,'spcPts').getAttribute('val'),'300');
  }
 }
 // The same retry example is kept in the acceptance row, the editable source of
 // the rendered mapping, and the final Gherkin (not a substitute first-payment case).
 assert.ok(texts[8].includes('X 거절 뒤 같은 주문에 Y 승인'));
 assert.ok(source.includes('사례: 2,000원 주문에서 카드 X 거절, 배송 요청 0회')&&source.includes('사례: 같은 주문에 카드 Y 승인, 결제완료, 누적 배송 요청 1회'));
 assert.ok(texts[10].includes('거절 뒤 같은 주문에 카드 Y로 다시 요청한다'));
 const judgmentRows=all(docs[19],A,'tr').slice(1).map(r=>kids(r,A,'tc').map(c=>all(c,A,'t').map(t=>t.textContent).join('')));
 assert.equal(judgmentRows.length,5);
 assert.ok(texts[17].includes('BR-01')&&texts[17].includes('BR-08'));
 assert.ok(texts[18].includes('배송 시스템이 요청을 거절하거나 응답하지 않으면 재시도하는가?'));
 for(const us of ['US-01','US-02','US-03','US-04'])assert.ok(texts.slice(16,19).some(t=>t.includes(us)));
 const result={slides:30,changedPages:changed,unchangedPages:unchanged,citations:citationChecks,tableChecks:tables,externalQuotesSinglePair:true,requirementsHeading:true,noReviewMemos:true,sourceCodePreserved:true,retryExampleContinuous:true,judgmentRowsEvidencePresent:true,judgmentRows};
 fs.writeFileSync(base+'/output-verification.json',JSON.stringify(result,null,2));console.log(JSON.stringify({...result,judgmentRows:undefined,citations:citationChecks.map(c=>({page:c.page,sizes:c.sizes}))}));
})();
