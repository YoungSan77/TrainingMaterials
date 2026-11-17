'use strict';
const fs=require('fs'),crypto=require('crypto'),assert=require('assert/strict');
const {parse}=require('../../../engine/production/src/parse'),{verifiedRecordedChecks}=require('../../../engine/production/src/recordedChecks');
const {unboldedText,flatGroupItems,missingModelUpdate}=require('../../../engine/production/src/structure');
const {readZip}=require('../../../engine/production/src/zip'),{parseXml,all,child,kids,A,P}=require('../../../engine/production/src/xml');
const root='courses/ai-native/checks/s03-recorded-qa-20261117',sourcePath='courses/ai-native/sessions/s03.md';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),identity=p=>({path:p,sha256:sha(fs.readFileSync(p)),modified:fs.statSync(p).mtime.toISOString()});
const norm=t=>t.replace(/\s+/g,'');
async function main(){
 const source=fs.readFileSync(sourcePath,'utf8'),lines=source.split('\n'),parsed=parse(source),proof=verifiedRecordedChecks(sourcePath,parsed.sections);
 assert.equal(source,fs.readFileSync('out/s03-recorded-qa-input.md','utf8'),'source changed during production');
 assert.equal(proof.checks.length,7);assert.ok(proof.checks.every(c=>c.status==='MATCH'));assert.deepEqual(proof.warnings,[]);
 assert.equal(unboldedText(parsed.sections).length,2);assert.equal(flatGroupItems(parsed.sections).length,5);assert.deepEqual(missingModelUpdate(parsed.sections),[]);
 assert.deepEqual(unboldedText(parsed.sections,proof),[]);assert.deepEqual(flatGroupItems(parsed.sections,proof),[]);
 const audit=JSON.parse(fs.readFileSync('courses/ai-native/checks/s03-warning-links-20261117/warning-audit.json'));
 const strip=t=>t.replace(/^\s*[-+]\s+/,'').replace(/\*\*/g,'').trim();
 const resolved=audit.entries.filter(e=>e.category==='실제 원고 결함').map(e=>{
  if(e.rule==='missingModelUpdate')return {oldWarning:e.id,rule:e.rule,status:'RESOLVED',line:lines.findIndex(l=>l.includes('모델에서 보완된 것 —'))+1,text:lines.find(l=>l.includes('모델에서 보완된 것 —'))};
  const at=lines.findIndex(l=>strip(l)===strip(e.original));assert.ok(at>=0,'missing original sentence '+e.id);assert.ok(lines[at].includes('**'));
  return {oldWarning:e.id,rule:e.rule,status:'RESOLVED',line:at+1,text:lines[at]};
 });assert.equal(resolved.length,21);
 const controls=JSON.parse(JSON.stringify(parsed.sections)),practice=controls.find(s=>s.title==='15. 실습 3 — 주문 요구사항 정의서');
 practice.blocks.push({kind:'heading',text:'저자 검토',depth:0},{kind:'text',text:'저자가 확인할 결과와 기준을 명시하여 다음 작업을 판단한다.',depth:0},{kind:'text',text:'저자 검토:',depth:0},{kind:'bullet',text:'담당자가 승인한 업무 규칙을 확인한다.',depth:0});
 const controlsProof=verifiedRecordedChecks(sourcePath,controls);assert.ok(controlsProof.checks.every(c=>c.status==='MATCH'));
 assert.ok(unboldedText(controls,controlsProof).some(w=>w.includes('저자가 확인할 결과')));assert.ok(flatGroupItems(controls,controlsProof).some(w=>w.includes('저자 검토:')));
 for(const c of proof.checks){
  let start=0;if(c.rule==='flatGroupItems'){start=lines.findIndex(l=>/^#+ /.test(l)&&l.replace(/^#+ /,'')===c.context);assert.ok(start>=0);}
  const at=lines.findIndex((l,i)=>i>=start&&l.trim().replace(/^[-+] /,'')===c.text);assert.ok(at>=0);c.sourceLine=at+1;
 }
 const record='courses/ai-native/sessions/code/s03/exercise-conversation/production-2026-11-16',runs=[];
 for(const [kind,turn]of [['demo','01'],['exercise','01'],['exercise','02'],['exercise','03']]){
  const response=fs.readFileSync(`${record}/${kind}/codex-response-${turn}.md`,'utf8'),meta=JSON.parse(fs.readFileSync(`${record}/${kind}/codex-metadata-${turn}.json`)),events=fs.readFileSync(`${record}/${kind}/codex-events-${turn}.jsonl`,'utf8').trim().split('\n').map(JSON.parse);
  assert.equal(meta.returncode,0);assert.equal(response.trimEnd(),events.filter(e=>e.item?.type==='agent_message').at(-1).item.text.trimEnd());runs.push({kind,turn,returncode:0,responseSHA256:sha(response)});
 }
 const excerpts=JSON.parse(fs.readFileSync('courses/ai-native/checks/s03-production-20261117/excerpts.json'));assert.ok(source.includes(excerpts.demo.text)&&source.includes(excerpts.exercise.text));
 const pptx='courses/ai-native/sessions/s03.pptx',qaPath='courses/ai-native/sessions/s03.qa.json',z=await readZip(pptx),names=[...z.keys()].filter(n=>/^ppt\/slides\/slide\d+\.xml$/.test(n)).sort((a,b)=>+a.match(/slide(\d+)/)[1]-+b.match(/slide(\d+)/)[1]);
 const docs=names.map(n=>parseXml(z.get(n))),counts={body:0,demo:0,judgment:0,appendix:0},tables=[],before=await readZip('out/s03-recorded-qa-before.pptx');
 const changedPages=names.flatMap((n,i)=>z.get(n).equals(before.get(n))?[]:[i+1]);
 for(const [i,d]of docs.entries())for(const gf of all(d,P,'graphicFrame')){
  const cells=all(gf,A,'tc');if(!cells.length)continue;
  const kind=i>=25?'appendix':i===19?'judgment':[16,17].includes(i)?'demo':'body';
  for(const cell of cells){for(const side of ['marL','marR','marT','marB'])assert.equal(child(cell,A,'tcPr').getAttribute(side),'54000');for(const r of all(cell,A,'rPr'))assert.equal(r.getAttribute('sz'),kind==='body'?'1000':'800');}
  counts[kind]+=cells.length;
  const widths=all(gf,A,'gridCol').map(c=>+c.getAttribute('w')),ext=child(child(gf,P,'xfrm'),A,'ext');assert.ok(Math.abs(widths.reduce((a,b)=>a+b,0)-+ext.getAttribute('cx'))<=7);assert.equal(all(gf,A,'tr').reduce((n,r)=>n+ +r.getAttribute('h'),0),+ext.getAttribute('cy'));
  tables.push({page:i+1,kind,cells:cells.length,fontPt:kind==='body'?10:8,widthsPt:widths.map(w=>w/12700)});
 }
 const text=d=>norm(all(d,A,'t').map(t=>t.textContent).join('')),story='US-01. 장바구니 상품 주문',condition='장바구니의 상품을 대상으로 주문 처리를 시작할 수 있다.',tail='와 주문 생성 시점에 주문 항목에 기록된 단가는 서로 구분한다.';
 assert.ok(text(docs[16]).includes(norm(story))&&text(docs[16]).includes(norm(condition)));
 const d=docs[28],sp=all(d,P,'sp').find(s=>text(s).includes(norm(tail))),table=all(d,P,'graphicFrame').find(g=>g.textContent.includes('salePrice'));assert.ok(sp&&table);
 const off=child(child(table,P,'xfrm'),A,'off'),ext=child(child(table,P,'xfrm'),A,'ext'),soff=child(child(child(sp,P,'spPr'),A,'xfrm'),A,'off'),gapPt=(+soff.getAttribute('y')- +off.getAttribute('y')- +ext.getAttribute('cy'))/12700;assert.equal(gapPt,8);assert.equal(soff.getAttribute('x'),off.getAttribute('x'));
 const qa=JSON.parse(fs.readFileSync(qaPath));assert.equal(qa.slides,30);assert.deepEqual(qa.errors,[]);assert.deepEqual(qa.warnings,[]);
 const result={checkedAt:new Date().toISOString(),source:identity(sourcePath),pptx:identity(pptx),qa:identity(qaPath),resolvedOriginalDefects:resolved,recordedBlocks:proof.checks,recordedBlockMatches:7,originalResponseEventMatches:runs,recordedExcerptsPreserved:true,sourcePreservedDuringWork:true,authorControls:{unboldedText:'PASS: author sentence still warns',flatGroupItems:'PASS: author intro still warns',sourceModified:false},slides:30,changedPages,links:{US01AndAcceptance:17,glossaryAndDistinction:29,distinctionGapPt:gapPt},cells:counts,totalCells:Object.values(counts).reduce((a,b)=>a+b,0),tables,errors:qa.errors.length,warnings:qa.warnings.length};
 fs.writeFileSync(root+'/verification.json',JSON.stringify(result,null,2));
 console.log(JSON.stringify({...result,resolvedOriginalDefects:resolved.length,recordedBlocks:proof.checks.map(c=>({id:c.id,rule:c.rule,status:c.status,line:c.sourceLine})),tables:undefined}));
}
main().catch(e=>{console.error(e);process.exitCode=1});
