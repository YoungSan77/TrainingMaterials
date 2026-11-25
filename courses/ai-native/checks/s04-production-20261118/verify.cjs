'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const root=process.cwd(),src=path.join(root,'engine/production/src'),data=require('./manifest.json'),{parse}=require(path.join(src,'parse')),{plain}=require(path.join(src,'text'));
const {A,P,all,child,shape,text,parseXml}=require(path.join(src,'xml')),{numberedText}=require(path.join(src,'inspect'));
const norm=s=>String(s).replace(/\s+/g,'');
(async()=>{
 const z=await require(path.join(src,'zip')).readZip(data.file),p=parse(fs.readFileSync(data.input,'utf8'));
 const actual=[],headers=new Set();let tables=0,cells=0,quotes=0;
 for(const page of data.pages){
  const doc=parseXml(z.get(`ppt/slides/slide${page.slide}.xml`));
  for(const q of page.quoteChecks||[]){
   const par=all(shape(doc,q.id),A,'p')[q.index];
   assert.match(par.textContent,/^“[\s\S]+”[, .]+“[\s\S]+”, \[/);
   assert.ok(child(child(par,A,'pPr'),A,'buNone'));quotes++;
  }
  if(!page.appendix)continue;
  for(const item of page.items){
   const sh=shape(doc,item.id);
   if(item.kind==='table'){
    const xf=child(sh,P,'xfrm'),off=child(xf,A,'off'),ext=child(xf,A,'ext'),x=+off.getAttribute('x'),w=+ext.getAttribute('cx');
    assert.ok([.4,5.15].some(v=>Math.abs(x-v*914400)<2));assert.ok(w<=4.45*914400+2);
    const rows=all(sh,A,'tr').map(r=>Array.from(r.childNodes).filter(n=>n.localName==='tc').map(c=>all(c,A,'t').map(t=>t.textContent).join('')));
    for(const tag of ['rPr','defRPr','endParaRPr'])for(const r of all(sh,A,tag))assert.equal(r.getAttribute('sz'),'800');
    // Pagination repeats exactly the source header; omit only those repetitions for comparison.
    const key=rows[0].join('|'),repeat=headers.has(key);headers.add(key);
    actual.push(...rows.slice(repeat?1:0).map(r=>norm(r.join('|'))));tables++;cells+=rows.reduce((n,r)=>n+r.length,0);
   }else actual.push(...(all(sh,A,'buAutoNum').length?numberedText(sh):text(sh)).split('\n').map(norm));
  }
  for(const pic of page.pictures||[])actual.push(norm(pic.source));
 }
 const expected=[];const seenHeaders=new Set();
 for(const section of p.sections.filter(s=>s.appendix))for(const b of section.blocks){
  if(b.kind==='pagebreak'||b.kind==='text'&&/^\*\*(?:문서 형식|실제 LLM 응답)/.test(b.text))continue;
  if(b.kind==='table'){
   const key=b.rows[0].map(plain).join('|'),repeat=seenHeaders.has(key);seenHeaders.add(key);
   expected.push(...b.rows.slice(repeat?1:0).map(r=>norm(r.map(plain).join('|'))));
  }else if(['mermaid','plantuml','svg','chart'].includes(b.kind))expected.push(norm(b.text));
  else expected.push(...(b.kind==='code'?b.text:plain(b.text)).split('\n').map(norm));
 }
 assert.deepEqual(actual,expected,'entire appendix text, row/cell order, original question numbers, code, omissions and diagram source');
 const originalQuotes=p.sections.flatMap(s=>s.blocks).filter(b=>b.kind==='text'&&b.text==='**인용문**'||b.kind==='bullet'&&require(path.join(src,'paragraphs')).bulletCitation(b.text)).length;
 assert.equal(quotes,originalQuotes);
 const hashes=require('./input.json').protectedFiles;const unchanged=Object.entries(hashes).every(([p,h])=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex')===h);assert.ok(unchanged);
 const report={slides:data.slides,quotes,appendixTablesIncludingContinuations:tables,appendixCellsIncludingRepeatedHeaders:cells,appendixSourceOrder:'PASS',tableContainmentAnd8pt:'PASS',quotePairAndNoBullets:'PASS',protectedInputsUnchanged:unchanged,sourceSHA256:data.inputSHA256,pptxSHA256:data.fileSHA256};
 fs.writeFileSync(path.join(__dirname,'verification.json'),JSON.stringify(report,null,2));console.log(report);
})().catch(e=>{console.error(e);process.exitCode=1;});
