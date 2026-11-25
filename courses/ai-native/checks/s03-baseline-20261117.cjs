'use strict';
// Run from repository root. Checks the current source, saved execution and final PPTX.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const {readZip}=require('../../../engine/production/src/zip');
const {parseXml,all,child,kids,A,P}=require('../../../engine/production/src/xml');
const {cellWidth}=require('../../../engine/production/src/tableRowMetrics');
const base='courses/ai-native/checks/s03-baseline-20261117';
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const sourcePath='courses/ai-native/sessions/s03.md',source=fs.readFileSync(sourcePath,'utf8');
const execution='courses/ai-native/sessions/code/s03/exercise-conversation/production-2026-11-16';
function identity(p){const b=fs.readFileSync(p);return {path:p,sha256:sha(b),bytes:b.length,modified:fs.statSync(p).mtime.toISOString()};}
async function main(){
 fs.mkdirSync(base,{recursive:true});
 const demo=source.split('## 11. LLM 초안 검토')[1].match(/```text\n([\s\S]*?)\n```/)[1];
 assert.equal(demo,fs.readFileSync(execution+'/demo/prompt-01.txt','utf8'));
 const exercise=source.split('## 15. 실습 3 —')[1].split('## 16. 요약')[0];
 const requests=[...exercise.matchAll(/^  - (.+)$/gm)].map(m=>m[1]);
 assert.ok(fs.readFileSync(execution+'/exercise/prompt-01.txt','utf8').startsWith(requests[0]+'\n'));
 assert.equal(requests[1],fs.readFileSync(execution+'/exercise/prompt-03.txt','utf8'));
 for(const [name,original]of [['주문한다-업무조건.md','s01/exercise-conversation/order/주문한다-업무조건.md'],['활용-방식-판단.md','s02/exercise-conversation/order/활용-방식-판단.md']])assert.ok(fs.readFileSync('courses/ai-native/sessions/code/'+original).equals(fs.readFileSync(execution+'/exercise/'+name)));
 const runs=[];
 for(const [kind,turn]of [['demo','01'],['exercise','01'],['exercise','02'],['exercise','03']]){
  const response=fs.readFileSync(`${execution}/${kind}/codex-response-${turn}.md`,'utf8'),meta=JSON.parse(fs.readFileSync(`${execution}/${kind}/codex-metadata-${turn}.json`));
  const events=fs.readFileSync(`${execution}/${kind}/codex-events-${turn}.jsonl`,'utf8').trim().split('\n').map(JSON.parse);
  assert.equal(meta.returncode,0);assert.equal(events.filter(e=>e.item?.type==='agent_message').at(-1).item.text.trimEnd(),response.trimEnd());
  runs.push({kind,turn,sha256:sha(response),returncode:0});
 }
 const excerpts=JSON.parse(fs.readFileSync('courses/ai-native/checks/s03-production-20261117/excerpts.json'));
 assert.ok(source.includes(excerpts.demo.text));assert.ok(source.includes(excerpts.exercise.text));
 const design=fs.readFileSync('courses/ai-native/course-design.md','utf8');
 const schedule=[...design.matchAll(/^\| [12] \| (\d\d) \| .+? \| .+? \| (\d+)\/(\d+) \| (\d+) \|$/gm)].map(m=>({session:m[1],lecture:+m[2],practice:+m[3],concepts:+m[4]}));
 assert.equal(schedule.length,12);assert.equal(schedule.reduce((n,r)=>n+r.lecture,0),490);assert.equal(schedule.reduce((n,r)=>n+r.practice,0),210);assert.ok(schedule.every(r=>r.practice<=25));
 const details=[...design.matchAll(/^- \*\*가르칠 개념:\*\* (.+)$/gm)].map(m=>(m[1].match(/[①-⑳]/g)||[]).length);
 assert.deepEqual(details,schedule.map(r=>r.concepts));assert.equal(details.reduce((a,b)=>a+b,0),122);
 const pptx='courses/ai-native/sessions/s03.pptx',z=await readZip(pptx),slides=[...z.keys()].filter(n=>/^ppt\/slides\/slide\d+\.xml$/.test(n)).sort((a,b)=>+a.match(/slide(\d+)/)[1]-+b.match(/slide(\d+)/)[1]);
 const counts={body:0,demo:0,judgment:0,appendix:0},tables=[],groups=new Map();
 for(const [i,n]of slides.entries()){
  const doc=parseXml(z.get(n));
  for(const gf of all(doc,P,'graphicFrame')){
   const rows=all(gf,A,'tr');if(!rows.length)continue;
   const cells=all(gf,A,'tc'),sizes=[...new Set(all(gf,A,'rPr').map(r=>r.getAttribute('sz')))];
   const kind=i+1>=26?'appendix':i+1===20?'judgment':[17,18].includes(i+1)?'demo':'body';
   for(const c of cells){const pr=child(c,A,'tcPr');for(const side of ['marL','marR','marT','marB'])assert.equal(pr.getAttribute(side),'54000');}
   assert.deepEqual(sizes,[kind==='body'?'1000':'800']);counts[kind]+=cells.length;
   const widths=all(gf,A,'gridCol').map(c=>+c.getAttribute('w')),ext=child(child(gf,P,'xfrm'),A,'ext');
   assert.ok(Math.abs(widths.reduce((a,b)=>a+b,0)-+ext.getAttribute('cx'))<=7);
   assert.equal(rows.reduce((a,r)=>a+ +r.getAttribute('h'),0),+ext.getAttribute('cy'));
   tables.push({page:i+1,kind,cells:cells.length,widthsEMU:widths,fontPt:+sizes[0]/100});
   if(kind==='body'){
    const key=kids(rows[0],A,'tc').map(c=>c.textContent).join('|');
    if(!groups.has(key))groups.set(key,[]);groups.get(key).push({gf,widths,page:i+1});
   }
  }
 }
 const naturalWidths=[];
 for(const group of groups.values()){
  const rows=group.flatMap(v=>all(v.gf,A,'tr').map(r=>kids(r,A,'tc')));
  const measured=group[0].widths.map((_,i)=>Math.ceil(Math.max(...rows.map(r=>cellWidth(r[i])))*12700));
  const total=measured.reduce((a,b)=>a+b,0),available=651.97*12700,expected=total<=available?measured:measured.map(w=>Math.floor(w*available/total));
  for(const table of group)assert.deepEqual(table.widths,expected);
  naturalWidths.push({pages:group.map(t=>t.page),measuredEMU:measured,appliedEMU:expected,constrained:total>available});
 }
 const qa=JSON.parse(fs.readFileSync('courses/ai-native/sessions/s03.qa.json'));
 assert.equal(qa.slides,slides.length);assert.deepEqual(qa.errors,[]);
 const warnings={};for(const w of qa.warnings){const key=w.split(':')[0];warnings[key]=(warnings[key]||0)+1;}
 const reference='references/inputs/s03-op.pptx',rz=await readZip(reference);
 const result={checkedAt:new Date().toISOString(),input:identity(sourcePath),output:identity(pptx),qa:identity('courses/ai-native/sessions/s03.qa.json'),renderer:{node:process.version,package:JSON.parse(fs.readFileSync('engine/production/package.json')).version},schedule,details,totalConcepts:122,execution:{inputsAndAttachmentsMatch:true,responsesMatchEvents:true,excerptsMatch:true,newExecutions:0,runs},slides:slides.length,cells:counts,totalCells:Object.values(counts).reduce((a,b)=>a+b,0),allFourMarginsEMU:54000,tables,naturalWidths,automatic:{status:qa.status,errors:qa.errors,warnings:qa.warnings.length,categories:warnings},reference:{...identity(reference),slides:[...rz.keys()].filter(n=>/^ppt\/slides\/slide\d+\.xml$/.test(n)).length,role:'layout reference only; explicit current contract takes priority',missingReference:'s03_or.pptx'}};
 fs.writeFileSync(base+'/verification.json',JSON.stringify(result,null,2));
 console.log(JSON.stringify({slides:result.slides,cells:counts,concepts:result.totalConcepts,execution:'PASS; reused 4 turns',automatic:result.automatic}));
}
main().catch(e=>{console.error(e);process.exitCode=1});
