'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto'),cp=require('child_process');
const root=process.cwd(),src=path.resolve('engine/production/src'),dir=__dirname,out='out/s04-current-review-20261119',input='courses/ai-native/sessions/s04.md',source=fs.readFileSync(input,'utf8'),sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const {parse,sourceRangeOf}=require(path.join(src,'parse')),{plain}=require(path.join(src,'text')),{A,P,all,child,kids,shape,parseXml}=require(path.join(src,'xml')),{readZip}=require(path.join(src,'zip'));
(async()=>{
 const p=parse(source),toc=p.toc.map(b=>plain(b.text)),headings=p.sections.filter(s=>/^\d\d\. /.test(s.title)).map(s=>s.title);assert.deepEqual(toc,headings);
 const references=require(path.join(src,'references')).checkReferences(path.resolve(input),source);assert.deepEqual(references.errors,[]);
 const code=require(path.join(src,'codeSource')).checkCodeSources(path.resolve(input),source);assert.deepEqual(code.errors,[]);
 const exercise=p.sections.find(s=>/^15\./.test(s.title)),prompts=exercise.blocks.filter(b=>/^[①②] /.test(b.text)).map(b=>b.text.slice(2));assert.equal(prompts.length,2);
 const record='courses/ai-native/sessions/code/s04/exercise-conversation/production-2026-11-17';
 assert.ok(fs.readFileSync(record+'/prompt-01.txt','utf8').startsWith(prompts[0]));assert.ok(fs.readFileSync(record+'/prompt-02.txt','utf8').includes(prompts[1]));
 assert.equal(sha(record+'/codex-response-02.md'),sha(record+'/주문한다-정적모델.md'));
 const approved=cp.execFileSync('git',['show','038cb6ffb291d741e643425ea19bf75f0ccf2c75:courses/ai-native/sessions/code/s03/exercise-conversation/production-2026-11-16/exercise/주문한다-요구사항-정의서.md'],{maxBuffer:4*1024*1024});assert.deepEqual(fs.readFileSync(record+'/input-s03.md'),approved);
 const terminology=p.sections.flatMap(s=>s.blocks.filter(b=>/사례|시나리오|행동 검사/.test(b.text+' '+JSON.stringify(b.rows))).map(b=>({topic:s.title,range:sourceRangeOf(b),text:b.text,rows:b.rows})));assert.ok(!source.includes('시나리오'));
 const review=p.sections.find(s=>/^10\./.test(s.title)).blocks.filter(b=>b.meta?.reviewExample).map(b=>b.text);assert.equal(review.length,4);
 const spacing={},javaStyles={};let tables=0,cells=0,appendixCells=0;
 const newer=await readZip(out+'/s04-review.pptx'),baseline=await readZip('courses/ai-native/sessions/s04.pptx');
 const changedWidths=[];let codeFonts=0;
 for(const file of ['s04-before','s04-review']){
  const zip=await readZip(`${out}/${file}.pptx`);spacing[file]=[];javaStyles[file]=[];
  for(const [name,v] of zip){
   if(!/^ppt\/slides\/slide\d+.xml$/.test(name))continue;
   const doc=parseXml(v),slide=Number(name.match(/slide(\d+)/)[1]);
   for(const par of all(doc,A,'p')){
    const pr=child(par,A,'pPr'),gap=side=>Number(child(pr&&child(pr,A,side),A,'spcPts')?.getAttribute('val')||0)/100;
    if(review.includes(par.textContent))spacing[file].push({slide,text:par.textContent,before:gap('spcBef'),after:gap('spcAft')});
    if(all(par,A,'latin').some(f=>f.getAttribute('typeface')==='Consolas'))javaStyles[file].push({text:par.textContent,before:gap('spcBef'),after:gap('spcAft'),fonts:all(par,A,'latin').map(f=>f.getAttribute('typeface')),sizes:all(par,A,'rPr').map(r=>r.getAttribute('sz'))});
   }
   if(file!=='s04-review')continue;
   for(const gf of all(doc,P,'graphicFrame')){
    const grid=all(gf,A,'gridCol');if(!grid.length)continue;tables++;cells+=all(gf,A,'tc').length;
    if(slide<28)continue;
    appendixCells+=all(gf,A,'tc').length;
    for(const r of all(gf,A,'rPr'))assert.equal(r.getAttribute('sz'),'800');
    const id=Number(all(gf,P,'cNvPr')[0].getAttribute('id')),old=shape(parseXml(baseline.get(name)),id);
    if(JSON.stringify(grid.map(c=>c.getAttribute('w')))!==JSON.stringify(all(old,A,'gridCol').map(c=>c.getAttribute('w'))))changedWidths.push({slide,id});
   }
  }
 }
 assert.equal(spacing['s04-review'].length,4);assert.ok(spacing['s04-review'].every(p=>p.before===3&&p.after===3));assert.ok(spacing['s04-before'].every(p=>p.before===6&&p.after===6));assert.deepEqual(javaStyles['s04-before'],javaStyles['s04-review']);assert.deepEqual(changedWidths,[]);
 const visible=[...newer].filter(([n])=>/^ppt\/slides\/slide\d+.xml$/.test(n)).flatMap(([,v])=>all(parseXml(v),A,'t').map(t=>t.textContent));
 const correctionMarks=visible.filter(t=>/==[^=]+==|~~.+~~|<\/?(?:ins|del)>|\*\*(?:인용문|문서 형식|실제 LLM 응답)\*\*/.test(t));assert.deepEqual(correctionMarks,[]);
 const qa=JSON.parse(fs.readFileSync(out+'/s04-review.qa.json','utf8'));assert.equal(qa.errors.length,0);assert.equal(qa.response_excerpts[0].status,'PASS');
 const result={input,inputSHA256:sha(input),deck:path.resolve(out+'/s04-review.pptx'),pptxSHA256:sha(out+'/s04-review.pptx'),slides:qa.slides,toc,headings,referenceErrors:references.errors,javaExcerptErrors:code.errors,prompts,executionInputSHA256:sha(record+'/input-s03.md'),executionResponseSHA256:sha(record+'/codex-response-02.md'),responseProof:qa.response_excerpts.map(e=>({...e,mapping:undefined})),terminology,reviewSpacing:spacing,javaFormattingUnchanged:javaStyles,correctionMarks,tables,cells,appendixCells,changedAppendixWidths:changedWidths};
 fs.writeFileSync(path.join(dir,'source-and-layout.json'),JSON.stringify(result,null,2));console.log({slides:qa.slides,toc:toc.length,reviewSpacing:spacing['s04-review'],javaFormattingUnchanged:true,cells,appendixCells,errors:qa.errors.length,warnings:qa.warnings.length});
})().catch(e=>{console.error(e);process.exitCode=1;});
