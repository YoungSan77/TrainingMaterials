const fs=require('fs'),crypto=require('crypto');
const base='courses/ai-native/sessions/code/s03/exercise-conversation/production-2026-11-16';
const sourcePath='courses/ai-native/sessions/s03.md',source=fs.readFileSync(sourcePath,'utf8');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const demo=fs.readFileSync(base+'/demo/codex-response-01.md','utf8'),answer=fs.readFileSync(base+'/exercise/codex-response-03.md','utf8');
const prompt=source.split('## 11. LLM 초안 검토')[1].match(/```text\n([\s\S]*?)\n```/)[1];
const ex=source.split('## 15. 실습 3 —')[1].split('## 16. 요약')[0];const requests=[...ex.matchAll(/^  - (.+)$/gm)].map(m=>m[1]);
const checks={demoPrompt:prompt===fs.readFileSync(base+'/demo/prompt-01.txt','utf8'),firstRequest:fs.readFileSync(base+'/exercise/prompt-01.txt','utf8').startsWith(requests[0]+'\n'),finalRequest:requests[1]===fs.readFileSync(base+'/exercise/prompt-03.txt','utf8'),attachments:[],events:[]};
for(const [name,path] of [['주문한다-업무조건.md','courses/ai-native/sessions/code/s01/exercise-conversation/order/주문한다-업무조건.md'],['활용-방식-판단.md','courses/ai-native/sessions/code/s02/exercise-conversation/order/활용-방식-판단.md']])checks.attachments.push({path,match:fs.readFileSync(path).equals(fs.readFileSync(base+'/exercise/'+name))});
for(const [kind,turn] of [['demo','01'],['exercise','01'],['exercise','02'],['exercise','03']]){
 const meta=JSON.parse(fs.readFileSync(`${base}/${kind}/codex-metadata-${turn}.json`));
 const events=fs.readFileSync(`${base}/${kind}/codex-events-${turn}.jsonl`,'utf8').trim().split('\n').map(JSON.parse);
 const last=events.filter(e=>e.item?.type==='agent_message').at(-1)?.item.text;
 checks.events.push({kind,turn,returncode:meta.returncode,started:meta.started,finished:meta.finished,responseMatchesEvent:last?.trimEnd()===fs.readFileSync(`${base}/${kind}/codex-response-${turn}.md`,'utf8').trimEnd()});
}
if(!checks.demoPrompt||!checks.firstRequest||!checks.finalRequest||checks.attachments.some(x=>!x.match)||checks.events.some(x=>x.returncode||!x.responseMatchesEvent))throw Error('execution mismatch');
function excerpt(raw){const lines=raw.trimEnd().split('\n'),out=[],omitted=[];let section='',sub='';
 for(let i=0;i<lines.length;){let line=lines[i];
  if(/^```/.test(line)){const start=i++;while(i<lines.length&&!/^```/.test(lines[i]))i++;i++;if(out.at(-1)!=='.....')out.push('.....');omitted.push({kind:'diagram',from:start+1,to:i});continue;}
  const h=/^(#{1,3}) (.*)/.exec(line);if(h){if(h[1].length<=2){section=h[2];sub='';}else sub=h[2];out.push('#'.repeat(h[1].length+2)+' '+h[2]);i++;continue;}
  if(/^(?:[-+] |\d+\. )/.test(line)){
   const items=[];while(i<lines.length&&/^(?:[-+] |\d+\. )/.test(lines[i])){const unit=[lines[i++]];while(i<lines.length&&/^ +(?:[-+] |\d+\. )/.test(lines[i]))unit.push(lines[i++]);items.push(unit);}
   const keepAll=/대표 상황 비교/.test(section)||sub==='성능 시험 조건';
   out.push(...items.slice(0,keepAll?items.length:2).flat().map(l=>l.replace(/^( +)(?=[-+] |\d+\. )/,(_,s)=>' '.repeat(Math.floor(s.length/2)*2))));
   if(!keepAll&&items.length>2){out.push('.....');omitted.push({kind:'list',section,sub,kept:2,total:items.length});}continue;
  }
  out.push(line);i++;
 }
 return {text:out.join('\n'),omitted};
}
const de=excerpt(demo),ae=excerpt(answer);
fs.writeFileSync('out/s03-oq-20261117/reuse.json',JSON.stringify({...checks,hashes:{demo:sha(demo),exercise:sha(answer),sourceBefore:sha(source)}},null,2));
fs.writeFileSync('out/s03-oq-20261117/excerpts.json',JSON.stringify({demo:de,exercise:ae},null,2));
if(process.argv[2]!=='patch'){console.log(JSON.stringify(checks));process.exit(0);}
const demoAnchor='### 초안의 제안을 업무 결정과 대조한다';
const demoInsert='**기록 그대로**\n\n**문서 형식 — 10pt**\n\n'+de.text+'\n\n**페이지 분할**\n\n';
const answerAnchor='## 주문한다-요구사항-정의서\n\n**강사 노트**';
const answerInsert='## 주문한다-요구사항-정의서\n\n**실제 LLM 응답**\n\n**문서 형식 — 10pt**\n\n'+ae.text+'\n\n**강사 노트**';
const chunk=(before,after)=>'@@\n'+before.split('\n').map(l=>'-'+l).join('\n')+'\n'+after.split('\n').map(l=>'+'+l).join('\n')+'\n';
process.stdout.write('*** Begin Patch\n*** Update File: /Users/YoungSan/dev/TrainingMaterials/'+sourcePath+'\n'+chunk(demoAnchor,demoInsert+demoAnchor)+chunk(answerAnchor,answerInsert)+'*** End Patch\n');
