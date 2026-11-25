'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const src=path.resolve('engine/production/src'),m=require('./manifest.json'),{parse}=require(path.join(src,'parse')),{plain}=require(path.join(src,'text')),{A,P,all,child,shape,text,parseXml}=require(path.join(src,'xml')),{numberedText}=require(path.join(src,'inspect'));
const norm=s=>String(s).replace(/\s+/g,''),sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(async()=>{
 const {readZip}=require(path.join(src,'zip')),z=await readZip(m.file),before=await readZip('out/s04-feedback-20261118/s04-before.pptx');
 const source=fs.readFileSync(m.input,'utf8'),p=parse(source),actual=[],expected=[],headers=new Set();let tables=0,cells=0,quotes=0,codeBlocks=0;
 const nativeTables=(zip,n)=>all(parseXml(zip.get(`ppt/slides/slide${n}.xml`)),P,'graphicFrame').filter(g=>all(g,A,'tbl').length).map(g=>({header:all(g,A,'tr').slice(0,1).flatMap(r=>Array.from(r.childNodes).filter(n=>n.localName==='tc').map(c=>all(c,A,'t').map(t=>t.textContent).join(''))),widths:all(g,A,'gridCol').map(c=>+c.getAttribute('w')/12700)}));
 const afterTables=[];
 for(const page of m.pages){
  const doc=parseXml(z.get(`ppt/slides/slide${page.slide}.xml`));
  for(const q of page.quoteChecks||[]){const par=all(shape(doc,q.id),A,'p')[q.index];assert.match(par.textContent,/^“[\s\S]+”[, .]+“[\s\S]+”, \[/);assert.ok(child(child(par,A,'pPr'),A,'buNone'));quotes++;}
  for(const item of page.items.filter(i=>i.kind==='source')){
   const sh=shape(doc,item.id),off=all(sh,A,'off')[0],bp=all(sh,A,'bodyPr')[0];
   const expected=page.heading.startsWith('10.')?1036320:1181100;
   assert.equal(+off.getAttribute('x')+Number(bp.getAttribute('lIns')),expected);codeBlocks++;
  }
  if(!page.appendix)continue;
  afterTables.push(...nativeTables(z,page.slide).map(t=>({...t,page:page.slide})));
  for(const item of page.items){
   const sh=shape(doc,item.id);
   if(item.kind==='table'){
    const xf=child(sh,P,'xfrm'),off=child(xf,A,'off'),ext=child(xf,A,'ext'),x=+off.getAttribute('x'),w=+ext.getAttribute('cx');assert.ok([.4,5.15].some(v=>Math.abs(x-v*914400)<2));assert.ok(w<=4.45*914400+2);
    const rows=all(sh,A,'tr').map(r=>Array.from(r.childNodes).filter(n=>n.localName==='tc').map(c=>all(c,A,'t').map(t=>t.textContent).join('')));
    for(const tag of ['rPr','defRPr','endParaRPr'])for(const r of all(sh,A,tag))assert.equal(r.getAttribute('sz'),'800');
    const key=rows[0].join('|'),repeat=headers.has(key);headers.add(key);actual.push(...rows.slice(repeat?1:0).map(r=>norm(r.join('|'))));tables++;cells+=rows.reduce((n,r)=>n+r.length,0);
   }else actual.push(...(all(sh,A,'buAutoNum').length?numberedText(sh):text(sh)).split('\n').map(norm));
  }
  for(const pic of page.pictures||[])actual.push(norm(pic.source));
 }
 const seen=new Set();for(const section of p.sections.filter(s=>s.appendix))for(const b of section.blocks){
  if(b.kind==='pagebreak'||b.kind==='text'&&/^\*\*(?:문서 형식|실제 LLM 응답)/.test(b.text))continue;
  if(b.kind==='table'){const key=b.rows[0].map(plain).join('|'),repeat=seen.has(key);seen.add(key);expected.push(...b.rows.slice(repeat?1:0).map(r=>norm(r.map(plain).join('|'))));}
  else if(['mermaid','plantuml','svg','chart'].includes(b.kind))expected.push(norm(b.text));else expected.push(...(b.kind==='code'?b.text:plain(b.text)).split('\n').map(norm));
 }
 assert.deepEqual(actual,expected,'appendix words, row/cell order, question numbers, code, omissions and diagram source');
 const attachment=fs.readFileSync('/Users/YoungSan/Downloads/s04-topic-10.md','utf8').trim(),topic=source.slice(source.indexOf('## 10. 요구사항으로 모델 검토하기'),source.indexOf('## 11. AI에게')).trim();assert.equal(topic,attachment);
 assert.ok(!/요구사항으로 모델 초안 검토하기|判定|판정 근거와 수정안/.test(source));
 assert.equal(m.pages.filter(p=>p.heading.startsWith('연관명과 다중성')).length,1);
 for(const [p,h] of Object.entries(require('./start.json').protectedFiles))assert.equal(sha(p),h,p);
 const comparisons=[33,34].flatMap(n=>nativeTables(before,n).map(old=>{const matches=afterTables.filter(t=>t.header.join('|')===old.header.join('|'));assert.ok(matches.length);return {oldPage:n,header:old.header,beforePt:old.widths,after:matches};}));
 const reports=m.tableWidthReports;assert.equal(reports.length,10);
 // Repeated source headers (attribute tables) are distinguished by their original row data;
 // each original table's width vector was computed before splitting, not from fragments.
 for(const t of afterTables)assert.ok(reports.some(r=>r.header.join('|')===t.header.join('|')&&r.widths.every((w,i)=>Math.abs(w-t.widths[i])<.0001)));
 const result={slides:m.slides,quotes,appendixTables:tables,appendixCells:cells,sourceOrder:'PASS',attachmentExactMatch:true,protectedInputsUnchanged:true,codeBlocksAligned:codeBlocks,tableWidthComputations:reports.length,comparisons,sourceSHA256:sha(m.input),pptxSHA256:sha(m.file)};
 fs.writeFileSync(path.join(__dirname,'verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
