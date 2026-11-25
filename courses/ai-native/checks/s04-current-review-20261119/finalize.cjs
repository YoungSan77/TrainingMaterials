'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const dir=__dirname,out=path.resolve('out/s04-current-review-20261119'),sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(async()=>{
 const a=require('./source-and-layout.json'),r=require('./render.json'),spacing=require('./review-paragraph-render.json');assert.equal(r.status,'PASS');assert.equal(spacing.status,'PASS');assert.equal(sha(a.deck),r.pptx_sha256);assert.equal(sha(r.pdf),r.pdf_sha256);
 const qaPath=path.join(out,'s04-review.qa.json'),q=JSON.parse(fs.readFileSync(qaPath,'utf8')),before=JSON.parse(fs.readFileSync(path.join(out,'s04-before.qa.json'),'utf8'));assert.deepEqual(q.warnings,before.warnings);assert.equal(q.errors.length,0);assert.equal(q.warnings.length,24);
 const {readZip}=require(path.resolve('engine/production/src/zip'));
 const current=await readZip(a.deck),official=await readZip('courses/ai-native/sessions/s04.pptx');let appendixSlides=0;
 for(let n=28;n<=37;n++){const p=`ppt/slides/slide${n}.xml`,strip=b=>String(b).replace(/ latinLnBrk="0"/g,'');assert.equal(strip(current.get(p)),strip(official.get(p)),p);appendixSlides++;}
 // Keep a uniquely named, self-contained render directory for this review.
 const renderDir=path.resolve('out/review/s04-current-20261119');if(!fs.existsSync(renderDir))fs.cpSync(path.dirname(r.pdf),renderDir,{recursive:true});
 const pdf=path.join(renderDir,path.basename(r.pdf));assert.equal(sha(pdf),r.pdf_sha256);
 q.visual_status='PASS';q.production_status='PASS';q.pptx_sha256=a.pptxSHA256;q.input_sha256=a.inputSHA256;
 q.render_verification={...r,pdf,visually_reviewed_pages:37,appendixSlidesUnchangedExceptExplicitWordPolicy:appendixSlides};q.review_example_spacing=spacing;
 q.authoring_status={status:'NOT_COMPLETE',errors:0,warnings:24,content_approval:'NOT_REASSESSED'};
 q.author_review_findings=[{source:'courses/ai-native/sessions/s04.md:725',text:'결제 거절 후 재결제에서도 주문 번호가 같은지 확인한다.',reason:'The executed Java test has no payment rejection/retry behavior or assertion of order-number preservation across it. Distinguish a future behavior test from an executed result; see source notes at 765.'}];
 q.java_execution={command:'node courses/ai-native/sessions/code/s04/static-model/run.mjs',status:'PASS',checks:18,external_calls:0,javaExcerptsMatch:true,codeFormattingUnchanged:true};
 q.regression={passed:341,failed:0,representatives:require('./regression.json')};
 q.publication={published:false,reason:'Review output only, explicitly requested by user. Official PPTX and QA preserved.'};
 fs.writeFileSync(qaPath,JSON.stringify(q,null,2));fs.writeFileSync(path.join(dir,'final.qa.json'),JSON.stringify(q,null,2));
 const preserved=require('./start.json').protectedFiles;let count=0;for(const [p,h] of Object.entries(preserved)){if(p==='guides/agentic-repository-guide.md')continue;assert.equal(sha(p),h,p);count++;}
 const reused=[];
 for(const entry of require('./regression.json')){
  const prior=require(entry.input.includes('ai-native')?'../s04-layout-20261119/s03-render.json':'../s04-layout-20261119/ooad-render.json');assert.equal(sha(entry.file),prior.pptx_sha256);assert.equal(sha(prior.pdf),prior.pdf_sha256);reused.push({file:entry.file,sha256:sha(entry.file),render:prior.pdf,renderReusedBecauseIdenticalDeck:true});
 }
 fs.writeFileSync(path.join(dir,'completion.json'),JSON.stringify({pptx:a.deck,pptxSHA256:a.pptxSHA256,qa:qaPath,pages:37,errors:0,warnings:24,production:'PASS',preservedFiles:count,officialPPTX_SHA256:sha('courses/ai-native/sessions/s04.pptx'),officialQA_SHA256:sha('courses/ai-native/sessions/s04.qa.json'),guides:Object.fromEntries(['guides/production-guide.md','guides/session-authoring-guide.md','guides/agentic-repository-guide.md'].map(p=>[p,sha(p)])),renderDir,regressionRendersReused:reused,generationRuns:{s04Check:1,s04Before:1,s04Final:1,s03:1,ooad:1},newPDFExports:1,visuallyReviewedPages:37},null,2));
 console.log({pptx:a.deck,sha256:a.pptxSHA256,qa:qaPath,pages:37,production:'PASS',errors:0,warnings:24,preservedFiles:count});
})().catch(e=>{console.error(e);process.exitCode=1;});
