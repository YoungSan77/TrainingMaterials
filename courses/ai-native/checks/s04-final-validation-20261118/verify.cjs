'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const src=path.resolve('engine/production/src'),m=require('./candidate.manifest.json'),{parse}=require(path.join(src,'parse')),{plain}=require(path.join(src,'text')),{A,P,all,child,shape,text,parseXml}=require(path.join(src,'xml')),{numberedText}=require(path.join(src,'inspect'));
const norm=s=>String(s).replace(/\s+/g,''),sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(async()=>{
 const {readZip}=require(path.join(src,'zip')),z=await readZip(m.file),old=await readZip('out/s04-feedback-20261118/s04-feedback.pptx'),source=fs.readFileSync(m.input,'utf8'),p=parse(source),actual=[],expected=[],headers=new Set();let tables=0,cells=0,quotes=0,codeBlocks=0,codeParagraphs=0;
 const style=[];
 for(const page of m.pages){
  const name=`ppt/slides/slide${page.slide}.xml`,doc=parseXml(z.get(name)),previous=parseXml(old.get(name));
  assert.equal(all(doc,A,'t').map(t=>t.textContent).join('\n'),all(previous,A,'t').map(t=>t.textContent).join('\n'),'37-slide style source content');
  for(const q of page.quoteChecks||[]){const par=all(shape(doc,q.id),A,'p')[q.index];assert.match(par.textContent,/^“[\s\S]+”[, .]+“[\s\S]+”, \[/);assert.ok(child(child(par,A,'pPr'),A,'buNone'));quotes++;}
  for(const item of page.items.filter(i=>i.kind==='source')){
   const sh=shape(doc,item.id),off=all(sh,A,'off')[0],bp=all(sh,A,'bodyPr')[0];assert.equal(+off.getAttribute('x')+Number(bp.getAttribute('lIns')),page.heading.startsWith('10.')?1036320:1181100);codeBlocks++;
   for(const rp of all(sh,A,'rPr'))assert.equal(child(rp,A,'latin').getAttribute('typeface'),'Consolas');
  }
  codeParagraphs+=(page.codeParagraphChecks||[]).length;
  if(!page.appendix)continue;
  for(const item of page.items){
   const sh=shape(doc,item.id);
   if(item.kind==='table'){
    const xf=child(sh,P,'xfrm'),off=child(xf,A,'off'),ext=child(xf,A,'ext'),x=+off.getAttribute('x'),w=+ext.getAttribute('cx');assert.ok([.4,5.15].some(v=>Math.abs(x-v*914400)<2));assert.ok(w<=4.45*914400+2);
    const rows=all(sh,A,'tr').map(r=>Array.from(r.childNodes).filter(n=>n.localName==='tc').map(c=>all(c,A,'t').map(t=>t.textContent).join(''))),widths=all(sh,A,'gridCol').map(c=>+c.getAttribute('w')/12700);
    const oldShape=shape(previous,item.id);assert.deepEqual(widths,all(oldShape,A,'gridCol').map(c=>+c.getAttribute('w')/12700),'measured widths unchanged from style reference');
    assert.ok(m.tableWidthReports.some(r=>r.header.join('|')===rows[0].join('|')&&r.widths.every((v,i)=>Math.abs(v-widths[i])<.0001)));
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
 assert.deepEqual(actual,expected,'appendix text, question order, code, omissions and diagram source');
 const recordLines=fs.readFileSync(m.originalEvidence[0].record,'utf8').split(/\r?\n/),groups=[];
 const appendix=p.sections.find(s=>s.appendix&&s.verbatimResponse);
 for(let n=1;n<=7;n++){
  const at=appendix.blocks.findIndex(b=>b.kind==='heading'&&b.text.startsWith(`9.${n} `)),head=appendix.blocks[at],recordAt=recordLines.findIndex(l=>l===`### ${head.text}`);assert.ok(recordAt>=0);
  let end=recordAt+1;while(end<recordLines.length&&!/^#+ /.test(recordLines[end]))end++;
  const first=recordLines.slice(recordAt+1,end).filter(l=>/^\d+\. /.test(l)).slice(0,2),selected=appendix.blocks.slice(at+1,at+4);assert.deepEqual(selected.slice(0,2).map(b=>b.text),first);assert.equal(selected[2].text,'.....');groups.push({name:head.text,firstTwo:first,omission:'.....'});
 }
 for(const [p,h] of Object.entries(require('./start.json').protectedFiles))assert.equal(sha(p),h,p);
 assert.equal(m.originalEvidence.length,5);assert.ok(m.originalEvidence.every(e=>e.exactLineMatch));assert.equal(m.executionFinalMatchesSavedMD,true);
 const result={slides:m.slides,quotes,codeBlocks,codeParagraphs,appendixTables:tables,appendixCells:cells,questionGroups:groups,allAppendixContentAndOrder:'PASS',styleReferenceWordsAndTableWidths:'PASS',sourceReferencesVerifiedAgainstExecution:5,protectedInputsAndFormalOutputsUnchanged:true,inputSHA256:sha(m.input),pptxSHA256:sha(m.file)};
 fs.writeFileSync(path.join(__dirname,'verification.json'),JSON.stringify(result,null,2));console.log(result);
})().catch(e=>{console.error(e);process.exitCode=1;});
