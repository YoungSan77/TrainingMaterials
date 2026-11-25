const fs=require('fs'),cp=require('child_process'),path=require('path'),crypto=require('crypto');
const root=process.cwd(),evidence=__dirname,out=path.join(root,'out/common-production-20261118');fs.mkdirSync(out,{recursive:true});
const baseline=path.join(out,'baseline');fs.mkdirSync(baseline,{recursive:true});
for(const file of cp.execFileSync('git',['ls-files','engine/production/src'],{encoding:'utf8'}).trim().split('\n')){
 if(file.includes('/test/'))continue;const target=path.join(baseline,file.slice('engine/production/'.length));fs.mkdirSync(path.dirname(target),{recursive:true});
 fs.writeFileSync(target,cp.execFileSync('git',['show','HEAD:'+file]));
}
if(!fs.existsSync(path.join(baseline,'node_modules')))fs.symlinkSync(path.join(root,'engine/production/node_modules'),path.join(baseline,'node_modules'),'dir');
const {parse}=require(path.join(root,'engine/production/src/parse')),{courseInfo}=require(path.join(root,'engine/production/src/course'));
const {TEMPLATE_DIR}=require(path.join(root,'engine/production/src/template'));
async function run(input,name,old=false){
 const src=old?path.join(baseline,'src'):path.join(root,'engine/production/src');
 const p=parse(fs.readFileSync(input,'utf8')),file=path.join(out,name+'.pptx');
 const builder=require(path.join(src,'builder')),m=await builder.render(p.sections,TEMPLATE_DIR,file,p.session,p.toc,courseInfo(input));
 const qa=await require(path.join(src,'inspect')).inspect(file,m);
 const refs=require(path.join(root,'engine/production/src/references')).checkReferences(input,fs.readFileSync(input,'utf8'));
 fs.writeFileSync(file.replace('.pptx','.qa.json'),JSON.stringify({status:qa.errors.length||refs.errors.length?'FAIL':'PASS',structuralErrors:qa.errors,sourceErrors:refs.errors,sourceWarnings:refs.warnings,slides:m.pages.length,visual_status:'NOT_VERIFIED'},null,2));
 const data={input,file,slides:m.pages.length,errors:qa.errors,pages:m.pages.map((p,i)=>({slide:i+1,heading:p.heading,role:p.contentRole,tables:p.items.filter(i=>i.kind==='table'),pictures:(p.pictures||[]).map(pic=>({pt:builder.pictureTextPt(pic,pic.bounds)})),columnHeights:p.columnHeights,quoteChecks:p.quoteChecks}))};
 fs.writeFileSync(path.join(evidence,name+'.json'),JSON.stringify(data,null,2));console.log(JSON.stringify({name,slides:data.slides,errors:qa.errors}));return data;
}
(async()=>{
 const selected=process.argv[2]||'all';
 if(selected==='all'||selected==='s03')await run('courses/ai-native/sessions/s03.md','ai-native-s03');
 if(selected==='all'||selected==='s04')await run('courses/ai-native/sessions/s04.md','ai-native-s04');
 if(selected==='all'||selected==='ooad'){
  await run('courses/ooad/sessions/s02.md','ooad-s02-before',true);
  await run('courses/ooad/sessions/s02.md','ooad-s02');
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
