'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process');
const root=process.cwd(),src=path.join(root,'engine/production/src'),out=path.join(root,'out/s04-final-validation-20261118');
(async()=>{
 const files=fs.readdirSync(path.join(src,'test')).filter(f=>f.endsWith('.test.js')).map(f=>path.join(src,'test',f));
 const r=cp.spawnSync(process.execPath,['--test',...files],{encoding:'utf8',maxBuffer:16*1024*1024});fs.writeFileSync(path.join(__dirname,'tests.log'),r.stdout+r.stderr);console.log((r.stdout+r.stderr).split('\n').slice(-10).join('\n'));if(r.status)process.exitCode=1;
 const {parse}=require(path.join(src,'parse')),{render}=require(path.join(src,'builder')),{TEMPLATE_DIR}=require(path.join(src,'template')),{inspect}=require(path.join(src,'inspect')),{courseInfo}=require(path.join(src,'course')),{readZip}=require(path.join(src,'zip')),{A,all,parseXml}=require(path.join(src,'xml'));
 const results=[];
 for(const [input,name] of [['courses/ai-native/sessions/s03.md','ai-native-s03'],['courses/ooad/sessions/s02.md','ooad-s02']]){
  const p=parse(fs.readFileSync(input,'utf8')),file=path.join(out,name+'-regression.pptx'),m=await render(p.sections,TEMPLATE_DIR,file,p.session,p.toc,courseInfo(input)),q=await inspect(file,m);
  const before=await readZip('out/common-production-20261118/'+name+'.pptx'),after=await readZip(file),slideNames=[...after.keys()].filter(n=>/^ppt\/slides\/slide\d+.xml$/.test(n)).sort((a,b)=>+a.match(/slide(\d+)/)[1]-+b.match(/slide(\d+)/)[1]);
  const textOf=(zip,n)=>all(parseXml(zip.get(n)),A,'t').map(t=>t.textContent).join('\n');
  const changed=slideNames.filter(n=>!before.has(n)||textOf(before,n)!==textOf(after,n));
  results.push({input,file,slides:m.pages.length,structuralErrors:q.errors,textChangedSlides:changed});
 }
 fs.writeFileSync(path.join(__dirname,'regression.json'),JSON.stringify(results,null,2));console.log(results);
 const cli=cp.spawnSync(process.execPath,['engine/production/src/cli.js','--check','courses/ai-native/sessions/s04.md'],{encoding:'utf8',maxBuffer:4*1024*1024});fs.writeFileSync(path.join(__dirname,'cli-check.log'),cli.stdout+cli.stderr);console.log('normal CLI check exit:',cli.status);
})().catch(e=>{console.error(e);process.exitCode=1;});
