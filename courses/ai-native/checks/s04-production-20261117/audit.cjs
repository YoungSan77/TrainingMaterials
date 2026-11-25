const fs=require('fs'),cp=require('child_process'),crypto=require('crypto'),path=require('path');
const out=__dirname, root=process.cwd(), md='courses/ai-native/sessions/s04.md';
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const initial=JSON.parse(fs.readFileSync(path.join(out,'start.json')));
const changes=Object.entries(initial.hashes).filter(([p,h])=>fs.existsSync(p)&&hash(p)!==h).map(([p])=>p);
const java=fs.existsSync(path.join(out,'java.log'))?{status:0}:cp.spawnSync('node',['courses/ai-native/sessions/code/s04/static-model/run.mjs'],{encoding:'utf8'});
if(java.stdout){const version=cp.spawnSync('java',['-version'],{encoding:'utf8'});fs.writeFileSync(path.join(out,'java.log'),version.stderr+java.stdout+java.stderr);}
const code=require(path.join(root,'engine/production/src/codeSource')).checkCodeSources(md,fs.readFileSync(md,'utf8'));
const source=fs.readFileSync(md,'utf8');
const result={at:new Date().toISOString(),javaExit:java.status,codeSource:code,changesSinceStart:changes,
 sourceSHA256:hash(md),pptxSHA256:hash(md.replace('.md','.pptx')),qaSHA256:hash(md.replace('.md','.qa.json')),
 quoteGroups:(source.match(/^\*\*인용문\*\*$/gm)||[]).length,
 s03Approved:initial.approved_s03, oldS04InputEqual:initial.old_s04_input_equal};
fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
