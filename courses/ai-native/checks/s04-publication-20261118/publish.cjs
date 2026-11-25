'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict'),cp=require('child_process');
const root=process.cwd(),dir=__dirname;
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
assert.equal(cp.execFileSync('git',['branch','--show-current'],{encoding:'utf8'}).trim(),'migration/portfolio-v2.6-absorb');
const audit=require('./table-wrap-review.json');
assert.equal(audit.status,'PASS');assert.equal(audit.table_wrap_warnings.length,9);
assert.equal(sha(audit.pptx),audit.pptx_sha256);assert.equal(sha(audit.pdf),audit.pdf_sha256);
assert.equal(sha('courses/ai-native/sessions/s04.md'),audit.input_sha256);
for(const [file,hash] of Object.entries(audit.guides))assert.equal(sha(file),hash);
const qaSource=audit.pptx.replace('.pptx','.qa.json'),q=JSON.parse(fs.readFileSync(qaSource,'utf8'));
assert.equal(q.errors.length,0);assert.equal(q.warnings.length,35);assert.equal(q.visual_status,'PASS');
assert.equal(q.response_excerpts[0].status,'PASS');
const target=path.resolve('courses/ai-native/sessions/s04.pptx'),targetQA=target.replace('.pptx','.qa.json');
const baseline=require('../s04-final-validation-20261118/start.json').protectedFiles;
const protectedFiles=Object.fromEntries(Object.keys(baseline).filter(p=>!['courses/ai-native/sessions/s04.pptx','courses/ai-native/sessions/s04.qa.json'].includes(p)).map(p=>[p,sha(p)]));
const previous={pptx:sha(target),qa:sha(targetQA)};
assert.equal(previous.pptx,'661279151b017f4bcbddefe0d3fa10799f572397847ad69258f183aaffeea238');
const backup=path.resolve('out/s04-publication-20261118/previous-official');fs.mkdirSync(backup,{recursive:true});
for(const p of [target,targetQA]){const b=path.join(backup,path.basename(p));if(fs.existsSync(b))assert.equal(sha(b),sha(p));else fs.copyFileSync(p,b,fs.constants.COPYFILE_EXCL);}
q.completion_status='PRODUCTION_VERIFIED_SA_PENDING';
q.production_status='PASS';q.ready_to_publish=true;
q.production_verification={status:'PASS',mandatory_failures:[],mandatory_unverified:[],existing_full_render_pages:37,all_table_cells:421,table_wrap_review:path.join(dir,'table-wrap-review.json'),table_wrap_warnings:9,table_wrap_render_defects:0,new_generation_runs:0,new_render_runs:0};
q.authoring_status={status:'NOT_COMPLETE',automatic_errors:0,automatic_warnings:35,table_wrap_warnings:9,other_source_warnings:26,reason:'Source warnings remain unchanged. Production verification and SA completion are separate.'};
q.content_approval={status:'NOT_VERIFIED',reason:'This operation records production verification and publication authorization, not new Human approval of content.'};
q.final_presentation_approval={status:'NOT_VERIFIED',reason:'User authorized reflecting the verified deck when mandatory production verification passes; no new Human visual approval is inferred.'};
q.publication={published:true,published_at:new Date().toISOString(),target,target_qa:targetQA,source_pptx:audit.pptx,source_qa:qaSource,pptx_sha256:audit.pptx_sha256,previous,previous_backup:backup,authorization:'2026-11-18 user request: use existing verified 37-slide deck and corresponding QA, distinguish authoring warnings and content approval.'};
const json=JSON.stringify(q,null,2)+'\n';
// Stage the exact reviewed bytes; roll back both official files if publication fails.
const staged=path.join(path.dirname(target),'.s04-publication.pptx'),stagedQA=path.join(path.dirname(target),'.s04-publication.qa.json');
try{
 fs.copyFileSync(audit.pptx,staged,fs.constants.COPYFILE_EXCL);fs.writeFileSync(stagedQA,json,{flag:'wx'});
 fs.renameSync(staged,target);fs.renameSync(stagedQA,targetQA);
 assert.equal(sha(target),audit.pptx_sha256);assert.deepEqual(JSON.parse(fs.readFileSync(targetQA,'utf8')).warnings,q.warnings);
 for(const [p,h] of Object.entries(protectedFiles))assert.equal(sha(p),h,p);
}catch(error){fs.copyFileSync(path.join(backup,'s04.pptx'),target);fs.copyFileSync(path.join(backup,'s04.qa.json'),targetQA);throw error;}
fs.writeFileSync(path.join(dir,'final.qa.json'),json);
const record={...q.publication,qa_sha256:sha(targetQA),slides:q.slides,errors:0,warnings:35,production_status:'PASS',authoring_status:q.authoring_status.status,protected_files_unchanged:protectedFiles,guides:audit.guides};
fs.writeFileSync(path.join(dir,'publication.json'),JSON.stringify(record,null,2)+'\n');
console.log({target,qa:targetQA,sha256:sha(target),slides:q.slides,errors:0,warnings:35,production_status:'PASS',authoring_status:q.authoring_status.status});
