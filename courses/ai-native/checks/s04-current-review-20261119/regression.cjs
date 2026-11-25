'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),assert=require('assert/strict'),crypto=require('crypto');
const src=path.resolve('engine/production/src'),dir=__dirname,out=path.resolve('out/s04-current-review-20261119'),sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(async()=>{
 const test=cp.spawnSync(process.execPath,['--test',...fs.readdirSync(path.join(src,'test')).filter(f=>f.endsWith('.test.js')).map(f=>path.join(src,'test',f))],{encoding:'utf8',maxBuffer:32*1024*1024});fs.writeFileSync(path.join(dir,'tests.log'),test.stdout+test.stderr);console.log((test.stdout+test.stderr).split('\n').slice(-10).join('\n'));assert.equal(test.status,0);
 const {parse}=require(path.join(src,'parse')),{render}=require(path.join(src,'builder')),{inspect}=require(path.join(src,'inspect')),{courseInfo}=require(path.join(src,'course')),{TEMPLATE_DIR}=require(path.join(src,'template')),{readZip}=require(path.join(src,'zip'));
 const results=[];
 for(const [input,name,baseline] of [['courses/ai-native/sessions/s03.md','s03-regression','out/s04-layout-20261119/s03-after.pptx'],['courses/ooad/sessions/s02.md','ooad-s02-regression','out/s04-layout-20261119/ooad-s02-after.pptx']]){
  const p=parse(fs.readFileSync(input,'utf8')),file=path.join(out,name+'.pptx'),m=await render(p.sections,TEMPLATE_DIR,file,p.session,p.toc,courseInfo(input)),q=await inspect(file,m),a=await readZip(file),b=await readZip(baseline);
  const changed=[...a.keys()].filter(n=>/^ppt\/slides\/slide\d+.xml$/.test(n)&&String(a.get(n))!==String(b.get(n)));assert.deepEqual(q.errors,[]);assert.deepEqual(changed,[],'regression content, typography and coordinates');
  const item={input,file,slides:q.slides,errors:q.errors,baseline,changedSlides:changed,pptxSHA256:sha(file)};results.push(item);fs.writeFileSync(file.replace('.pptx','.qa.json'),JSON.stringify({status:'PASS',errors:q.errors,slides:q.slides,visual_status:'NOT_VERIFIED',table_layout:q.tableLayout},null,2));console.log(item);
 }
 fs.writeFileSync(path.join(dir,'regression.json'),JSON.stringify(results,null,2));
 const snapshot=require('./start.json').protectedFiles;
 for(const [p,h] of Object.entries(snapshot))if(p!=='guides/agentic-repository-guide.md')assert.equal(sha(p),h,p);
})().catch(e=>{console.error(e);process.exitCode=1;});
