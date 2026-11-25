const fs=require('fs'),crypto=require('crypto'),assert=require('assert/strict');
const root='courses/ai-native/sessions/code/s03/exercise-conversation/production-2026-11-16',source=fs.readFileSync('courses/ai-native/sessions/s03.md','utf8');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
assert.equal(source,fs.readFileSync('out/s03-or-20261117/source.md','utf8'),'source changed during production');
const demo=source.split('## 11. LLM 초안 검토')[1].match(/```text\n([\s\S]*?)\n```/)[1];
assert.equal(demo,fs.readFileSync(root+'/demo/prompt-01.txt','utf8'));
const exercise=source.split('## 15. 실습 3 —')[1].split('## 16. 요약')[0],requests=[...exercise.matchAll(/^  - (.+)$/gm)].map(m=>m[1]);
assert.ok(fs.readFileSync(root+'/exercise/prompt-01.txt','utf8').startsWith(requests[0]+'\n'));
assert.equal(requests[1],fs.readFileSync(root+'/exercise/prompt-03.txt','utf8'));
for(const [name,path] of [['주문한다-업무조건.md','courses/ai-native/sessions/code/s01/exercise-conversation/order/주문한다-업무조건.md'],['활용-방식-판단.md','courses/ai-native/sessions/code/s02/exercise-conversation/order/활용-방식-판단.md']])assert.ok(fs.readFileSync(path).equals(fs.readFileSync(root+'/exercise/'+name)));
const events=[];
for(const [kind,turn] of [['demo','01'],['exercise','01'],['exercise','02'],['exercise','03']]){
 const response=fs.readFileSync(`${root}/${kind}/codex-response-${turn}.md`,'utf8'),meta=JSON.parse(fs.readFileSync(`${root}/${kind}/codex-metadata-${turn}.json`)),log=fs.readFileSync(`${root}/${kind}/codex-events-${turn}.jsonl`,'utf8').trim().split('\n').map(JSON.parse);
 assert.equal(meta.returncode,0);assert.equal(log.filter(e=>e.item?.type==='agent_message').at(-1).item.text.trimEnd(),response.trimEnd());
 events.push({kind,turn,sha256:sha(response),returncode:meta.returncode});
}
const selected=JSON.parse(fs.readFileSync('courses/ai-native/checks/s03-production-20261117/excerpts.json'));
assert.ok(source.includes(selected.demo.text));assert.ok(source.includes(selected.exercise.text));
const result={sourceSHA256:sha(source),inputAndAttachmentsMatch:true,sourcePreserved:true,rawResponsesMatchEvents:true,existingExcerptsPreserved:true,newExecutions:0,events};
fs.writeFileSync('courses/ai-native/checks/s03-production-or-20261117/execution-verification.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
