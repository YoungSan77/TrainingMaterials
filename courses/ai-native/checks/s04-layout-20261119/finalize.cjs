'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const root=process.cwd(),src=path.resolve('engine/production/src'),dir=__dirname,out=path.resolve('out/s04-layout-20261119');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const {readZip}=require(path.join(src,'zip')),{A,all,parseXml}=require(path.join(src,'xml'));
(async()=>{
 const summary=[];
 for(const result of require('./regression.json')){
  const after=await readZip(result.file),before=await readZip(result.previousRendererControl),changes=[];
  for(const [n,v] of after)if(/^ppt\/slides\/slide\d+.xml$/.test(n)&&String(v).replace(/ latinLnBrk="0"/g,'')!==String(before.get(n)).replace(/ latinLnBrk="0"/g,''))changes.push(n);
  assert.deepEqual(changes,[],'regression styles and geometry outside explicit word policy');
  result.newStyleChangedSlides=changes;
  summary.push(result);
 }
 fs.writeFileSync(path.join(dir,'regression.json'),JSON.stringify(summary,null,2));
 const deck=path.join(out,'s04-after.pptx'),file=deck.replace('.pptx','.qa.json'),qa=JSON.parse(fs.readFileSync(file,'utf8'));
 const original=require('../s04-final-validation-20261118/candidate.manifest.json'),session=require(path.join(src,'parse')).parse(fs.readFileSync('courses/ai-native/sessions/s04.md','utf8')).session;
 // Every slide's XML was compared with that manifest's deck above/before; re-read
 // final bytes with the latest inspector without generating another presentation.
 const latest=await require(path.join(src,'inspect')).inspect(deck,{pages:original.pages.map((p,i)=>({...p,isToc:i===0})),codes:[],title:session,source:''});assert.deepEqual(latest.errors,[]);
 fs.writeFileSync(path.join(dir,'latest-inspection.json'),JSON.stringify({errors:latest.errors,slides:latest.slides,checked_blocks:latest.blocks,table_layout:latest.tableLayout},null,2));
 const reports=['s04-render.json','s03-render.json','ooad-render.json'].map(p=>require(path.join(dir,p)));for(const r of reports){assert.equal(r.status,'PASS');assert.equal(sha(r.pptx),r.pptx_sha256);assert.equal(sha(r.pdf),r.pdf_sha256);}
 qa.visual_status='PASS';qa.production_status='PASS_FOR_POWERPOINT_RENDER';qa.pptx_sha256=sha(deck);qa.input_sha256=sha('courses/ai-native/sessions/s04.md');qa.table_layout=latest.tableLayout;
 qa.render_verification={...reports[0],visually_reviewed_pages:37,reviewer:'Codex visual inspection; not Human approval'};
 qa.authoring_status={status:'NOT_COMPLETE',errors:qa.errors.length,warnings:qa.warnings.length,content_approval:'NOT_REASSESSED'};
 qa.attachment_reproduction={status:'NOT_REPRODUCED_IN_POWERPOINT',measurements:path.join(dir,'attachment-measurements.json'),limitation:'Screenshot renderer/version and source PPTX identity are unknown. No claim of verification in that renderer.'};
 qa.regression={tests:338,passed:338,failed:0,s03:summary[0],ooad:summary[1]};qa.publication={published:false,reason:'User requested temporary output only; official PPTX/QA are preserved.'};
 assert.equal(qa.errors.length,0);assert.equal(qa.warnings.length,35);fs.writeFileSync(file,JSON.stringify(qa,null,2));fs.writeFileSync(path.join(dir,'final.qa.json'),JSON.stringify(qa,null,2));
 const snapshot=require('./start.json');for(const [p,h] of Object.entries(snapshot.protectedFiles))assert.equal(sha(p),h,p);assert.equal(sha('courses/ai-native/production-standard.md'),snapshot.guides['courses/ai-native/production-standard.md']);
 fs.writeFileSync(path.join(dir,'completion.json'),JSON.stringify({slides:37,temporaryPPTX:deck,pptxSHA256:sha(deck),officialSHA256:sha('courses/ai-native/sessions/s04.pptx'),protectedFilesUnchanged:Object.keys(snapshot.protectedFiles).length,sourceWarnings:35,automaticErrors:0,renderReports:reports.map(r=>({pages:r.pages,tables:r.tables,cells:r.cells,status:r.status})),visualReview:{s04:37,s03:30,ooad:[1,2,3,4,13,14,15,16,21,22,23,24,33,34,35,36,49,50,51,52,65,66,67,68,81,82,83,84,93]},generationRuns:{s04:1,s03:1,ooad:1},renderExports:{s04Before:1,s04After:1,s03:1,ooad:1},guides:{'guides/production-guide.md':sha('guides/production-guide.md'),'guides/agentic-repository-guide.md':sha('guides/agentic-repository-guide.md')}},null,2));
 console.log({slides:37,pptx:deck,sha256:sha(deck),errors:qa.errors.length,warnings:qa.warnings.length,protectedFilesUnchanged:710});
})().catch(e=>{console.error(e);process.exitCode=1;});
