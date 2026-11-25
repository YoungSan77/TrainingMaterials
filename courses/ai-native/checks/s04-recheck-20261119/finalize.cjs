'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const dir=__dirname,v=require('./verification.json'),r=require('./render.json'),m=require('./manifest.json'),sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(async()=>{
 const {A,P,all,child,shape,parseXml}=require(path.resolve('engine/production/src/xml')),{readZip}=require(path.resolve('engine/production/src/zip'));
 const z=await readZip(v.file),baseline=await readZip('courses/ai-native/sessions/s04.pptx');let appendixCells=0,quotes=0;
 for(let i=0;i<m.pages.length;i++){
  const page=m.pages[i],name=`ppt/slides/slide${i+1}.xml`,doc=parseXml(z.get(name));quotes+=(page.quoteChecks||[]).length;
  if(!page.appendix)continue;
  const strip=b=>String(b).replace(/ latinLnBrk="0"/g,'');assert.equal(strip(z.get(name)),strip(baseline.get(name)),name);
  for(const item of page.items.filter(t=>t.kind==='table')){
   const gf=shape(doc,item.id);appendixCells+=all(gf,A,'tc').length;
   for(const rp of all(gf,A,'rPr'))assert.equal(rp.getAttribute('sz'),'800');
  }
 }
 assert.equal(appendixCells,260);assert.equal(quotes,9);assert.equal(r.status,'PASS');assert.equal(sha(v.file),r.pptx_sha256);assert.equal(sha(r.pdf),r.pdf_sha256);
 const finding={source:'courses/ai-native/sessions/s04.md:725',slide:23,table:'모델 규칙과 코드·테스트의 대응',row:'개념과 식별',row_number_excluding_header:1,column:'테스트에서 확인할 내용',column_number:3,original:'결제 거절 후 재결제에서도 주문 번호가 같은지 확인한다.',verdict:'NOT_TESTED_IN_CURRENT_JAVA',reason:'StaticModelTest.java creates OrderNumber at line 13 but never asserts order.number() or executes rejection/retry. Its identifier assertion at line 15 checks ProductNumber, not OrderNumber.',proposal:'현재 Java 테스트는 재결제 전후의 주문 번호 유지를 검사하지 않는다. 같은 주문 번호 유지는 재결제 사례의 기대 결과이며, 행동 검사에서 확인해야 한다.'};
 const qaPath=v.file.replace('.pptx','.qa.json'),q=JSON.parse(fs.readFileSync(qaPath,'utf8'));assert.equal(q.errors.length,0);assert.equal(q.warnings.length,24);
 q.visual_status='PASS';q.production_status='PASS';q.pptx_sha256=sha(v.file);q.input_sha256=v.inputSHA256;q.guides=v.guides;
 q.render_verification={...r,visually_reviewed_pages:37,quotes,appendix_cells_8pt:appendixCells,appendix_layout_and_content_match_formal_baseline_except_word_policy:true};
 q.review_example_spacing=v.reviewSpacing;q.java_execution={status:'PASS',checks:18,external_calls:0,log:path.join(dir,'java.log'),excerpt_errors:v.javaExcerptErrors,internal_paragraph_spacing_pt:0};
 q.source_review={automatic_errors:0,automatic_warnings:24,status:'NEEDS_AUTHOR_REVIEW',findings:[finding],content_approval:'NOT_REASSESSED'};
 q.renderer_changed=false;q.representative_regression={rerun:false,reason:'No renderer or test changes in this verification run.'};q.publication={published:false,reason:'Review output only; official PPTX and QA preserved.'};
 fs.writeFileSync(qaPath,JSON.stringify(q,null,2));fs.writeFileSync(path.join(dir,'final.qa.json'),JSON.stringify(q,null,2));fs.writeFileSync(path.join(dir,'table13-finding.json'),JSON.stringify(finding,null,2));
 const before=require('./start.json').protectedFiles;for(const [p,h] of Object.entries(before))assert.equal(sha(p),h,p);
 fs.writeFileSync(path.join(dir,'completion.json'),JSON.stringify({pptx:v.file,qa:qaPath,sha256:sha(v.file),slides:37,sourceErrors:0,sourceWarnings:24,production:'PASS',sourceReview:'NEEDS_AUTHOR_REVIEW',rendererChanged:false,protectedFilesUnchanged:Object.keys(before).length,officialPPTX_SHA256:sha('courses/ai-native/sessions/s04.pptx'),officialQA_SHA256:sha('courses/ai-native/sessions/s04.qa.json'),generationRuns:1,fullRenderRuns:1,visuallyReviewedPages:37},null,2));
 console.log({pptx:v.file,qa:qaPath,sha256:sha(v.file),slides:37,sourceErrors:0,sourceWarnings:24,production:'PASS',protectedFilesUnchanged:Object.keys(before).length});
})().catch(e=>{console.error(e);process.exitCode=1;});
