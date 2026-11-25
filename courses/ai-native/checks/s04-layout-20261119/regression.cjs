'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto'),assert=require('assert/strict');
const root=process.cwd(),src=path.resolve('engine/production/src'),out=path.resolve('out/s04-layout-20261119'),sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const {parse}=require(path.join(src,'parse')),{render}=require(path.join(src,'builder')),{TEMPLATE_DIR}=require(path.join(src,'template')),{inspect}=require(path.join(src,'inspect')),{courseInfo}=require(path.join(src,'course')),{readZip}=require(path.join(src,'zip')),{A,P,all,parseXml,child,shape}=require(path.join(src,'xml'));
(async()=>{
 const tests=cp.spawnSync(process.execPath,['--test',...fs.readdirSync(path.join(src,'test')).filter(f=>f.endsWith('.test.js')).map(f=>path.join(src,'test',f))],{encoding:'utf8',maxBuffer:32*1024*1024});
 fs.writeFileSync(path.join(__dirname,'tests.log'),tests.stdout+tests.stderr);console.log((tests.stdout+tests.stderr).split('\n').slice(-10).join('\n'));assert.equal(tests.status,0,'full regression tests');
 const approved='038cb6ffb291d741e643425ea19bf75f0ccf2c75',approvedFile=path.join(out,'s03-approved.pptx');
 fs.writeFileSync(approvedFile,cp.execFileSync('git',['show',`${approved}:courses/ai-native/sessions/s03.pptx`],{maxBuffer:32*1024*1024}));
 const input='courses/ai-native/sessions/s03.md';assert.deepEqual(fs.readFileSync(input),cp.execFileSync('git',['show',`${approved}:${input}`],{maxBuffer:4*1024*1024}),'S03 source matches approved commit');
 const results=[];
 for(const [input,name,beforeFile] of [['courses/ai-native/sessions/s03.md','s03-after',approvedFile],['courses/ooad/sessions/s02.md','ooad-s02-after','out/s04-final-validation-20261118/ooad-s02-regression.pptx']]){
  const p=parse(fs.readFileSync(input,'utf8')),file=path.join(out,name+'.pptx'),saved=file.replace('.pptx','.qa.json');
  let q,quotes;
  if(fs.existsSync(saved)){const prior=JSON.parse(fs.readFileSync(saved,'utf8'));q={...prior,tableLayout:prior.table_layout};quotes=prior.quotes;}
  else {const m=await render(p.sections,TEMPLATE_DIR,file,p.session,p.toc,courseInfo(input));q=await inspect(file,m);quotes=m.pages.reduce((n,p)=>n+(p.quoteChecks||[]).length,0);}
  const before=await readZip(beforeFile),after=await readZip(file),names=[...after.keys()].filter(n=>/^ppt\/slides\/slide\d+.xml$/.test(n)).sort((a,b)=>+a.match(/slide(\d+)/)[1]-+b.match(/slide(\d+)/)[1]);
  const changes=[];let tables=0;
  for(const n of names){
   const a=parseXml(after.get(n)),b=before.has(n)?parseXml(before.get(n)):null;
   if(!b||all(a,A,'t').map(t=>t.textContent).join('\n')!==all(b,A,'t').map(t=>t.textContent).join('\n'))changes.push(n);
   tables+=all(a,A,'tbl').length;
  }
  const qa={status:q.errors.length?'FAIL':'PASS',slides:q.slides,errors:q.errors,quotes,visual_status:'NOT_VERIFIED',table_layout:q.tableLayout};fs.writeFileSync(saved,JSON.stringify(qa,null,2));
  const controlFile=input.includes('ai-native')?'out/s04-final-validation-20261118/ai-native-s03-regression.pptx':beforeFile,control=await readZip(controlFile);
  const newChanges=names.filter(n=>!control.has(n)||all(parseXml(after.get(n)),A,'t').map(t=>t.textContent).join('\n')!==all(parseXml(control.get(n)),A,'t').map(t=>t.textContent).join('\n'));
  const record={input,inputSHA256:sha(input),file,pptxSHA256:sha(file),baseline:beforeFile,baselineSHA256:sha(beforeFile),slides:q.slides,baselineSlides:[...before.keys()].filter(n=>/^ppt\/slides\/slide\d+.xml$/.test(n)).length,errors:q.errors,textChangedSlides:changes,previousRendererControl:controlFile,newTextChangedSlides:newChanges,tables,quotes};
  results.push(record);fs.writeFileSync(path.join(__dirname,'regression.json'),JSON.stringify(results,null,2));console.log(record);assert.deepEqual(q.errors,[]);assert.deepEqual(newChanges,[]);
 }
 fs.writeFileSync(path.join(__dirname,'regression.json'),JSON.stringify(results,null,2));
 const before=await readZip('courses/ai-native/sessions/s04.pptx'),after=await readZip(out+'/s04-after.pptx'),changed=[];
 for(const [name,bytes] of after){if(!/^ppt\/slides\/slide\d+.xml$/.test(name))continue;const strip=s=>String(s).replace(/ latinLnBrk="0"/g,'');if(strip(bytes)!==strip(before.get(name)))changed.push(name);}
 assert.deepEqual(changed,[],'S04 styles, geometry, widths and content preserved except explicit Latin wrapping policy');
 fs.writeFileSync(path.join(__dirname,'s04-style-comparison.json'),JSON.stringify({slides:37,changedSlidesExceptExplicitWordPolicy:changed,baselineSHA256:sha('courses/ai-native/sessions/s04.pptx'),candidateSHA256:sha(out+'/s04-after.pptx')},null,2));
 for(const [p,h] of Object.entries(require('./start.json').protectedFiles))assert.equal(sha(p),h,p);
 console.log('protected course inputs and official outputs unchanged');
})().catch(e=>{console.error(e);process.exitCode=1;});
