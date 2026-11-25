const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const m=require('./manifest.json'),v=require('./verification.json'),pdf=require('./pdf-verification.json');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
assert.equal(pdf.issues.length,0);assert.equal(sha(m.file),v.pptxSHA256);
const {parseXml}=require(path.resolve('engine/production/src/xml')),doc=parseXml(fs.readFileSync('out/review/s04-feedback/bbox.html','utf8'));
const pages=Array.from(doc.getElementsByTagName('page')),words=n=>Array.from(pages[n-1].getElementsByTagName('word')).map(w=>({text:w.textContent,x:+w.getAttribute('xMin'),y:+w.getAttribute('yMin')}));
const prompt=words(26),alignment=[];
for(const marker of ['①','②']){
 const at=prompt.findIndex(w=>w.text===marker),first=prompt[at+1],nextY=Math.min(...prompt.filter(w=>w.y>first.y+2&&w.y<first.y+25).map(w=>w.y)),continued=Math.min(...prompt.filter(w=>Math.abs(w.y-nextY)<.2).map(w=>w.x));
 assert.ok(Math.abs(first.x-continued)<.01);alignment.push({marker,firstLineX:first.x,continuedLineX:continued});
}
const topic=words(19),code=topic.find(w=>w.text==='주문을'&&w.y>150&&w.y<260),question=topic.find(w=>w.text==='초안대로');assert.ok(Math.abs(code.x-question.x)<.5);
const alignmentReport={prompts:alignment,topic10ExampleFirstGlyphX:code.x,topic10NumberedBodyFirstGlyphX:question.x,originDifferenceFromGlyphBearingPt:Math.abs(code.x-question.x)};
fs.writeFileSync(path.join(__dirname,'alignment-verification.json'),JSON.stringify(alignmentReport,null,2));
const log=fs.readFileSync(path.join(__dirname,'tests.log'),'utf8');assert.match(log,/tests 324/);assert.match(log,/fail 0/);
const qa=JSON.parse(fs.readFileSync(m.file.replace('.pptx','.qa.json'),'utf8'));
qa.visual_status='REVIEWED';qa.requestedFormattingStatus='PASS';qa.visual_review={application:'Microsoft PowerPoint PDF export',slides:37,pdf:'out/review/s04-feedback/s04-feedback.pdf',tableCells:421,tableCellIssues:0,clippingOrOverlapFound:false,alignment:alignmentReport};
qa.regression={tests:324,passed:324,failed:0};qa.sourcePreservation=v;qa.publication={formalFileUpdated:false,formalFile:'courses/ai-native/sessions/s04.pptx',formalSHA256:sha('courses/ai-native/sessions/s04.pptx'),reason:'normal source-error publication gate preserved; separate verified rendering attached with overall FAIL retained'};
fs.writeFileSync(m.file.replace('.pptx','.qa.json'),JSON.stringify(qa,null,2));fs.writeFileSync(path.join(__dirname,'final.qa.json'),JSON.stringify(qa,null,2));
console.log({file:m.file,slides:37,sha256:sha(m.file),automaticQA:qa.status,sourceErrors:qa.sourceErrors.length,warnings:qa.warnings.length,alignment:alignmentReport});
