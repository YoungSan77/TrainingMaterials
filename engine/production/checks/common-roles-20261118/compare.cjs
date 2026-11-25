const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto');
const {readZip}=require('../../src/zip'),{A,P,all,child,parseXml}=require('../../src/xml');
const dir=__dirname,out=path.resolve('out/common-production-20261118');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const normalized=s=>s.replace(/[“”"]/g,'').replace(/\s+/g,'');
async function deck(file){
 const zip=await readZip(file),names=[...zip.keys()].filter(n=>/^ppt\/slides\/slide\d+\.xml$/.test(n)).sort((a,b)=>+a.match(/(\d+)\.xml/)[1]-+b.match(/(\d+)\.xml/)[1]);
 return names.map(name=>{const doc=parseXml(zip.get(name));return {name,text:all(doc,A,'t').map(t=>t.textContent).join(''),tables:all(doc,A,'tbl').map(t=>({cells:all(t,A,'tc').length,sizes:[...new Set(all(t,A,'rPr').map(r=>r.getAttribute('sz')))],margins:all(t,A,'tc').every(c=>['marL','marR','marT','marB'].every(k=>child(c,A,'tcPr')?.getAttribute(k)==='54000')),rows:all(t,A,'tr').map(r=>all(r,A,'tc').map(c=>all(c,A,'t').map(t=>t.textContent).join('')))}))};});
}
(async()=>{
 const approved=path.join(out,'s03-approved.pptx');fs.writeFileSync(approved,cp.execFileSync('git',['show','038cb6ffb291d741e643425ea19bf75f0ccf2c75:courses/ai-native/sessions/s03.pptx'],{maxBuffer:20*1024*1024}));
 const pairs=[['S03 approved',approved,path.join(out,'ai-native-s03.pptx')],['OOAD s02 before/after',path.join(out,'ooad-s02-before.pptx'),path.join(out,'ooad-s02.pptx')]];
 const comparisons=[];
 for(const [name,before,after] of pairs){const a=await deck(before),b=await deck(after);comparisons.push({name,beforeSlides:a.length,afterSlides:b.length,textDifferences:b.flatMap((p,i)=>normalized(p.text)===normalized(a[i]?.text||'')?[]:[i+1]),tableRowsEqual:JSON.stringify(a.map(p=>p.tables.map(t=>t.rows)))===JSON.stringify(b.map(p=>p.tables.map(t=>t.rows))),afterTableCells:b.flatMap(p=>p.tables).reduce((n,t)=>n+t.cells,0),afterMarginsValid:b.flatMap(p=>p.tables).every(t=>t.margins)});}
 const original=JSON.parse(fs.readFileSync(path.join(dir,'start.json'))),changes=Object.entries(original.hashes).filter(([p,h])=>fs.existsSync(p)&&hash(p)!==h).map(([p])=>p);
 const protectedPaths=Object.keys(original.hashes).filter(p=>p.startsWith('courses/')&&!p.endsWith('production-standard.md'));
 const preservation=protectedPaths.filter(p=>fs.existsSync(p)&&hash(p)!==original.hashes[p]);
 const result={at:new Date().toISOString(),comparisons,preservation:{changedCourseFiles:preservation,pass:preservation.length===0},changedTrackedFiles:changes,outputs:['ai-native-s03','ai-native-s04','ooad-s02-before','ooad-s02'].map(n=>({file:path.join(out,n+'.pptx'),sha256:hash(path.join(out,n+'.pptx')),qa:JSON.parse(fs.readFileSync(path.join(out,n+'.qa.json')))}))};
 fs.writeFileSync(path.join(dir,'comparison.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({comparisons,preservation:result.preservation},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
