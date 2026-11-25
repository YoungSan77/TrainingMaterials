'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const dir=__dirname,out=path.resolve('out/s04-close-20261119'),file=path.join(out,'s04-close-20261119.pptx'),qaFile=file.replace('.pptx','.qa.json'),sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(async()=>{
 const oldLine='| **개념과 식별** | 타입 `Order`, 값 타입 `OrderNumber` | 결제 거절 후 재결제에서도 주문 번호가 같은지 확인한다. |';
 const newLine='| **개념과 식별** | 값 타입 `ProductNumber`, `OrderItem.productNumber()` | 주문 항목에 기록된 상품 번호가 `PEN`인지 확인한다. |';
 const input='courses/ai-native/sessions/s04.md',before=fs.readFileSync(path.join(out,'s04-before.md'),'utf8'),now=fs.readFileSync(input,'utf8');assert.equal(before.replace(oldLine,newLine),now,'only the authorized row changes');
 const baseline=require('./start.json'),allowed=new Set([input,'courses/ai-native/sessions/s04.pptx','courses/ai-native/sessions/s04.qa.json']);
 for(const [p,h] of Object.entries(baseline.protectedFiles))if(!allowed.has(p))assert.equal(sha(p),h,p);
 const target=path.resolve('courses/ai-native/sessions/s04.pptx'),targetQA=target.replace('.pptx','.qa.json');assert.equal(sha(target),baseline.protectedFiles['courses/ai-native/sessions/s04.pptx']);assert.equal(sha(targetQA),baseline.protectedFiles['courses/ai-native/sessions/s04.qa.json']);
 const q=JSON.parse(fs.readFileSync(qaFile,'utf8')),render=require('./render.json');assert.equal(q.errors.length,0);assert.equal(q.warnings.length,24);assert.equal(q.response_excerpts[0].status,'PASS');assert.equal(render.status,'PASS');assert.equal(sha(file),render.pptx_sha256);assert.equal(sha(render.pdf),render.pdf_sha256);
 const {readZip}=require(path.resolve('engine/production/src/zip')),{A,P,all,child,kids,body,shape,parseXml}=require(path.resolve('engine/production/src/xml'));
 const zip=await readZip(file),previous=await readZip('out/s04-recheck-20261119/s04-recheck-20261119.pptx');let cells=0,appendixCells=0,modelParagraphs=0,javaLines=0;const xmlChanged=[],pngChanged=[],identicalImages=[];
 const sourceStatements=['주문을 받으려면 고객이 회원이어야 한다.','주문 한 건에는 주문 항목이 0개 이상 있다.','주문 항목에는 상품과 수량을 기록한다.','주문 금액은 상품의 현재 판매가 × 수량을 항목별로 더한 값이다.'];
 for(let n=1;n<=37;n++){
  const name=`ppt/slides/slide${n}.xml`,doc=parseXml(zip.get(name));if(!zip.get(name).equals(previous.get(name)))xmlChanged.push(n);
  for(const p of all(doc,A,'p'))if(sourceStatements.includes(p.textContent)){const pr=child(p,A,'pPr');for(const s of ['spcBef','spcAft'])assert.equal(child(child(pr,A,s),A,'spcPts').getAttribute('val'),'300');modelParagraphs++;}
  for(const gf of all(doc,P,'graphicFrame'))if(all(gf,A,'tbl').length){cells+=all(gf,A,'tc').length;if(n>=28){appendixCells+=all(gf,A,'tc').length;for(const rp of all(gf,A,'rPr'))assert.equal(rp.getAttribute('sz'),'800');}}
  if([9,15,24].includes(n))for(const sh of all(doc,P,'sp'))if(all(sh,A,'latin').some(f=>f.getAttribute('typeface')==='Consolas'))for(const p of all(sh,A,'p')){const pr=child(p,A,'pPr');for(const s of ['spcBef','spcAft'])assert.equal(child(child(pr,A,s),A,'spcPts').getAttribute('val'),'0');javaLines++;}
  const image='p-'+String(n).padStart(2,'0')+'.png',a=path.resolve('out/review/s04-close-20261119',image),b=path.resolve('out/review/s04-recheck-20261119',image);if(sha(a)!==sha(b))pngChanged.push(n);else identicalImages.push({slide:n,sha256:sha(a)});
 }
 assert.deepEqual(xmlChanged,[23]);assert.deepEqual(pngChanged,[23]);assert.equal(cells,421);assert.equal(appendixCells,260);assert.equal(modelParagraphs,4);assert.ok(javaLines>0);
 const doc=parseXml(zip.get('ppt/slides/slide23.xml')),rows=all(doc,A,'tr').map(r=>kids(r,A,'tc').map(c=>all(c,A,'t').map(t=>t.textContent).join('')));assert.ok(rows.some(r=>r[0]==='개념과 식별'&&r[1]==='값 타입 ProductNumber, OrderItem.productNumber()'&&r[2]==='주문 항목에 기록된 상품 번호가 PEN인지 확인한다.'));
 const visual={status:'PASS',pages:37,pdf:render.pdf,pdf_sha256:render.pdf_sha256,all_cells:421,issues:[],changed_slide_visually_reviewed:23,identical_images_reusing_prior_visual_review:identicalImages,previous_full_visual_review:'courses/ai-native/checks/s04-recheck-20261119/README.md',model_paragraphs_3pt:modelParagraphs,java_code_paragraphs_zero_gap:javaLines,appendix_cells_8pt:appendixCells};
 fs.writeFileSync(path.join(dir,'visual-verification.json'),JSON.stringify(visual,null,2));
 const warnings='# S04 최종 원고 경고\n\n자동 원고 QA: 오류 0·경고 24. 일반 표 줄바꿈 9, 강조 11, 응답 목록 구조 1, 강사 노트 누락 2, 한글 수량 1이다. Production 제작 검증과 별도로 남긴다. SA 완료나 전체 콘텐츠 승인을 의미하지 않는다.\n\n13절의 실행 범위 불일치는 상품 번호 PEN을 실제로 확인하는 문장으로 해결했다. 재결제 전후 주문 번호 유지는 업무 사례의 기대 결과로 그대로 보존했다. Java 테스트는 변경하지 않았다.\n\n'+q.warnings.map(w=>'- '+w).join('\n')+'\n';fs.writeFileSync(path.join(dir,'source-warnings.md'),warnings);
 q.visual_status='PASS';q.production_status='PASS';q.completion_status='PRODUCTION_COMPLETE_SOURCE_WARNINGS_REMAIN';q.pptx_sha256=sha(file);q.input_sha256=sha(input);q.render_verification=visual;
 q.source_review={automatic_errors:0,automatic_warnings:24,sa_complete:false,row13_execution_scope_mismatch:'RESOLVED',change_authority:'User explicitly requested correcting this row; whole-source approval not reassessed.'};
 q.java_execution={command:'node courses/ai-native/sessions/code/s04/static-model/run.mjs',status:'PASS',checks:18,external_calls:0,test_sources_unchanged:true};
 q.publication={published:true,target,target_qa:targetQA,validated_candidate:file,validated_candidate_qa:qaFile,pptx_sha256:sha(file),previous_official_backup:baseline.backup,reason:'User authorized official reflection after Production PASS.'};
 const json=JSON.stringify(q,null,2)+'\n';fs.writeFileSync(qaFile,json);fs.writeFileSync(path.join(dir,'final.qa.json'),json);
 const staged=path.resolve('courses/ai-native/sessions/.s04-close-candidate.pptx'),stagedQA=staged.replace('.pptx','.qa.json');
 try{
  fs.copyFileSync(file,staged,fs.constants.COPYFILE_EXCL);fs.writeFileSync(stagedQA,json,{flag:'wx'});fs.renameSync(staged,target);fs.renameSync(stagedQA,targetQA);
  assert.equal(sha(target),sha(file));assert.equal(sha(targetQA),sha(qaFile));for(const [p,h] of Object.entries(baseline.protectedFiles))if(!allowed.has(p))assert.equal(sha(p),h,p);
 }catch(e){fs.copyFileSync(path.join(baseline.backup,'s04.pptx'),target);fs.copyFileSync(path.join(baseline.backup,'s04.qa.json'),targetQA);throw e;}
 const report={source:input,changedLine:725,oldLine,newLine,sourceSHA256:sha(input),target,targetQA,sha256:sha(target),qaSHA256:sha(targetQA),slides:37,automaticErrors:0,sourceWarnings:24,production:'PASS',published:true,rendererChanged:false,testCodeUnchanged:true,otherProtectedFilesUnchanged:Object.keys(baseline.protectedFiles).length-3,generationRuns:1,fullRenderRuns:1,currentVisualReviewPages:1,identicalPreviouslyReviewedPages:36};fs.writeFileSync(path.join(dir,'publication.json'),JSON.stringify(report,null,2));console.log(report);
})().catch(e=>{console.error(e);process.exitCode=1;});
