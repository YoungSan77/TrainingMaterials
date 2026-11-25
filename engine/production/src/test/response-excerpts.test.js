'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),os=require('os'),path=require('path'),crypto=require('crypto');
const {checkReferences}=require('../references'),{verifyResponseExcerpts}=require('../responseExcerpts'),{parse}=require('../parse'),{verifiedRecordedChecks}=require('../recordedChecks'),{unboldedText,flatGroupItems,spelledNumbers}=require('../structure');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const original='# 실행 결과\n\nS03의 확정 규칙이다.\n\n### 확인할 항목\n\n- **첫 항목**이다.\n- 둘째 항목이다.\n- 셋째 항목이다.\n\n### 결론\n\n모든 근거는 미정 질문과 함께 다음 실습으로 인계한다.\n';
const excerpt='## 실행 결과\n\n**실제 LLM 응답**\n\n**문서 형식 — 10pt**\n\nS03의 확정 규칙이다.\n\n### 확인할 항목\n\n- **첫 항목**이다.\n- 둘째 항목이다.\n\n.....\n\n### 결론\n\n모든 근거는 미정 질문과 함께 다음 실습으로 인계한다.\n';
function fixture(body=excerpt,record=original){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'tm-response-origin-'));fs.mkdirSync(path.join(root,'sessions'));fs.mkdirSync(path.join(root,'execution'));
 const input=path.join(root,'sessions','s77.md'),file=path.join(root,'execution','final.md'),config=path.join(root,'recorded-responses.json');fs.writeFileSync(input,'## 01. 설명\n\n**저자 문장**이다.\n\n## 별첨. 실습 답\n\n'+body);fs.writeFileSync(file,record);
 fs.writeFileSync(config,JSON.stringify({version:1,responses:[{session:'s77.md',topic:'실행 결과',record:{path:'execution/final.md',sha256:sha(record)}}]}));
 return {root,input,file,config,source:()=>fs.readFileSync(input,'utf8'),qa:()=>checkReferences(input,fs.readFileSync(input,'utf8'))};
}
test('author S03 remains an error while a verified arbitrary-course response scope uses its execution provenance',()=>{
 const f=fixture();assert.deepEqual(f.qa().errors,[]);assert.equal(f.qa().responseExcerpts.evidence[0].status,'PASS');
 fs.appendFileSync(f.input,'\n**실제 LLM 응답 끝**\n\n저자 본문에서 S03을 설명한다.\n');
 assert.ok(f.qa().errors.some(e=>/S0x/.test(e)));
});
test('only marked response lines are classified; author prose before it, notes and next topics keep reference checks',()=>{
 for(const body of [excerpt.replace('**실제 LLM 응답**','저자는 S03을 먼저 설명한다.\n\n**실제 LLM 응답**'),excerpt+'\n**강사 노트**\n\nS03은 강사의 참조다.\n',excerpt+'\n## 다음 설명\n\nS03을 저자가 참조한다.\n']){
  const f=fixture(body);assert.equal(f.qa().responseExcerpts.evidence[0].status,'PASS');assert.ok(f.qa().errors.some(e=>/S0x/.test(e)));
 }
});
test('a marker alone, a missing original and an unpinned original are errors',()=>{
 for(const defect of ['config','file','hash']){const f=fixture();if(defect==='config')fs.unlinkSync(f.config);if(defect==='file')fs.unlinkSync(f.file);if(defect==='hash')fs.writeFileSync(f.config,JSON.stringify({version:1,responses:[{session:'s77.md',topic:'실행 결과',record:{path:'execution/final.md'}}]}));assert.ok(f.qa().errors.some(e=>/발췌 검증 실패/.test(e)));assert.equal(f.qa().responseExcerpts.verifiedLines.size,0);}
});
test('edited wording, emphasis, item order and missing/misplaced/spurious omissions fail provenance',()=>{
 for(const body of [excerpt.replace('확정 규칙','추정 규칙'),excerpt.replace('**첫 항목**','첫 항목'),excerpt.replace('- **첫 항목**이다.\n- 둘째 항목이다.','- 둘째 항목이다.\n- **첫 항목**이다.'),excerpt.replace('\n.....\n','\n'),excerpt.replace('- 둘째 항목이다.\n\n.....','.....\n\n- 둘째 항목이다.'),excerpt.replace('### 결론','.....\n\n### 결론')]){
  const f=fixture(body);assert.ok(f.qa().errors.some(e=>/발췌 검증 실패/.test(e)),body);assert.equal(f.qa().responseExcerpts.verifiedLines.size,0);
 }
});
test('changed source bytes and out-of-course provenance cannot validate an excerpt',()=>{
 const f=fixture();fs.appendFileSync(f.file,'\n새 문장\n');assert.ok(f.qa().errors.some(e=>/SHA-256 mismatch/.test(e)));
 const config=JSON.parse(fs.readFileSync(f.config));config.responses[0].record.path='../outside.md';fs.writeFileSync(f.config,JSON.stringify(config));assert.ok(f.qa().errors.some(e=>/outside course/.test(e)));
});
test('author emphasis and number checks resume outside the verified range; structure checks stay active inside',()=>{
 const f=fixture(excerpt+'\n**실제 LLM 응답 끝**\n\n저자가 세 가지 대안을 설명하는 충분히 긴 문장을 이 위치에 추가한다.\n');
 const p=parse(f.source()),proof=verifiedRecordedChecks(f.input,p.sections);assert.ok(unboldedText(p.sections,proof).some(w=>w.includes('저자가')));assert.ok(spelledNumbers(p.sections,proof).some(w=>w.includes('세 가지')));
 const structured=fixture(excerpt.replace('### 확인할 항목','### 확인할 항목\n\n다음과 같다.'));
 // A matching recorded list intro remains subject to the existing grouping rule.
 fs.writeFileSync(structured.file,original.replace('### 확인할 항목','### 확인할 항목\n\n다음과 같다.'));const config=JSON.parse(fs.readFileSync(structured.config));config.responses[0].record.sha256=sha(fs.readFileSync(structured.file));fs.writeFileSync(structured.config,JSON.stringify(config));
 const sections=parse(structured.source()).sections,verified=verifiedRecordedChecks(structured.input,sections);assert.equal(verified.excerpts.errors.length,0);assert.ok(flatGroupItems(sections,verified).length>0);
});
test('explicit end markers are consumed by parsing and code payload bytes must match',()=>{
 const record='# 실행 결과\n\n```text\n  S03 = 2000\n```\n',body='## 실행 결과\n\n**실제 LLM 응답**\n\n```text\n  S03 = 2000\n```\n\n**실제 LLM 응답 끝**\n\n**저자 설명**이다.\n';
 const f=fixture(body,record);assert.deepEqual(f.qa().errors,[]);assert.ok(!parse(f.source()).sections.flatMap(s=>s.blocks).some(b=>b.text.includes('실제 LLM 응답 끝')));
 fs.writeFileSync(f.input,f.source().replace('  S03 =',' S03 ='));assert.ok(f.qa().errors.some(e=>/발췌 검증 실패/.test(e)));
});
