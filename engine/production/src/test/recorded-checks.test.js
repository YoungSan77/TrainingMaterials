'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),os=require('os'),path=require('path');
const {parse}=require('../parse'),{verifiedRecordedChecks}=require('../recordedChecks');
const {unboldedText,flatGroupItems,missingModelUpdate}=require('../structure');
const prompt='저장된 요청으로 업무 규칙과 수용 기준을 작성하고 미정은 질문으로 남겨라.';
const intro='기록된 판단에 필요한 공통 사례는 다음과 같다.';
const source=`## 11. 실제 기록\n\n**기록 그대로**\n\n### 원문 조건\n\n${intro}\n\n- 첫 원문 항목\n- 둘째 원문 항목\n\n### 저자 판단\n\n저자 판단:\n\n- 저자의 점검 항목\n\n## 15. 실습\n\n**프롬프트**\n\n- ${prompt}\n\n**진행 방법**\n\n- 저자가 작성한 문장에는 판단할 핵심어를 강조해야 한다.\n`;
function fixture(){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'tm-recorded-check-'));fs.mkdirSync(path.join(root,'sessions'));
 const input=path.join(root,'sessions','s03.md');fs.writeFileSync(input,source);
 fs.writeFileSync(path.join(root,'request.txt'),prompt+'\n\n첨부 원문');
 fs.writeFileSync(path.join(root,'response.md'),'# 원문 조건\n\n'+intro+'\n\n- 첫 원문 항목\n- 둘째 원문 항목\n- 나머지 원문 항목\n');
 fs.writeFileSync(path.join(root,'recorded-checks.json'),JSON.stringify({entries:[
  {id:'request',session:'s03.md',rule:'unboldedText',source:{topic:'15. 실습',context:'프롬프트',kind:'bullet',occurrence:0},record:{path:'request.txt',format:'first-line'}},
  {id:'intro',session:'s03.md',rule:'flatGroupItems',source:{topic:'11. 실제 기록',context:'원문 조건',kind:'text',text:intro},record:{path:'response.md',format:'markdown',context:'원문 조건'}}
 ]}));return {root,input,sections:parse(source).sections};
}
test('only the matched block and named rule are exempt; author prose and list introductions in the same session stay checked',()=>{
 const {input,sections}=fixture(),proof=verifiedRecordedChecks(input,sections);
 assert.deepEqual(proof.checks.map(c=>c.status),['MATCH','MATCH']);assert.deepEqual(proof.warnings,[]);
 assert.equal(unboldedText(sections).length,2);assert.equal(unboldedText(sections,proof).length,1);
 assert.ok(unboldedText(sections,proof)[0].includes('저자가 작성한'));
 assert.equal(flatGroupItems(sections).length,2);assert.equal(flatGroupItems(sections,proof).length,1);
 assert.ok(flatGroupItems(sections,proof)[0].includes('저자 판단:'));
 const recordedHead=sections[0].blocks.find(b=>b.text===intro);
 assert.ok(proof.flatGroupItems.has(recordedHead));assert.ok(!proof.unboldedText.has(recordedHead));
 // Changing the classifier context must not turn a flatGroupItems exception into an emphasis exception.
 assert.equal(unboldedText([{title:'저자 문장',blocks:[recordedHead]}],proof).length,1);
 assert.equal(missingModelUpdate([{title:'16. 요약',blocks:[],notes:[]}]).length,1);
});
test('a changed prompt or response list item retains warnings and produces mismatch evidence',()=>{
 const {input,sections}=fixture();sections[1].blocks.find(b=>b.text===prompt).text+=' 변경';
 sections[0].blocks.find(b=>b.text==='둘째 원문 항목').text='다르게 쓴 항목';
 const proof=verifiedRecordedChecks(input,sections);
 assert.deepEqual(proof.checks.map(c=>c.status),['MISMATCH','MISMATCH']);assert.equal(proof.warnings.length,2);
 assert.equal(unboldedText(sections,proof).length,2);assert.equal(flatGroupItems(sections,proof).length,2);
});
test('missing evidence, unrecorded response, wrong session and a different author context do not grant exceptions',()=>{
 const {root,input,sections}=fixture();fs.unlinkSync(path.join(root,'request.txt'));sections[0].verbatimResponse=false;
 const proof=verifiedRecordedChecks(input,sections);assert.ok(proof.checks.every(c=>c.status==='MISMATCH'));
 assert.equal(flatGroupItems(sections,proof).length,2);
 const wrong=verifiedRecordedChecks(path.join(root,'sessions','s04.md'),sections);assert.equal(wrong.checks.length,0);
 const fresh=fixture();fresh.sections[1].blocks.find(b=>b.text==='**프롬프트**').text='**저자 지시**';
 assert.equal(verifiedRecordedChecks(fresh.input,fresh.sections).checks[0].status,'MISMATCH');
});
