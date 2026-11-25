'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const root=process.cwd(),file=path.resolve('out/s04-origin-qa-20261118/s04-review.pptx'),qa=JSON.parse(fs.readFileSync(file.replace('.pptx','.qa.json'),'utf8')),sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(async()=>{
 const {readZip}=require(path.join(root,'engine/production/src/zip')),{A,P,all,child,shape,parseXml}=require(path.join(root,'engine/production/src/xml'));
 const baseline=require('../s04-final-validation-20261118/start.json').protectedFiles;
 for(const [p,h] of Object.entries(baseline))if(!p.startsWith('guides/'))assert.equal(sha(p),h,p);
 const original='out/s04-final-validation-20261118/s04-candidate.pptx';assert.equal(sha(file),sha(original),'QA-only changes must preserve the already verified rendering bytes');
 const zip=await readZip(file),manifest=require('../s04-final-validation-20261118/candidate.manifest.json');let cells=0;
 for(const page of manifest.pages){
  const doc=parseXml(zip.get(`ppt/slides/slide${page.slide}.xml`));
  for(const item of page.items.filter(i=>i.kind==='table')){
   const gf=shape(doc,item.id),pt=page.appendix?8:item.tablePt;
   for(const rp of all(gf,A,'rPr'))assert.equal(rp.getAttribute('sz'),String(pt*100));
   cells+=all(gf,A,'tc').length;
  }
 }
 assert.equal(qa.errors.length,0);assert.equal(qa.response_excerpts.length,1);assert.equal(qa.response_excerpts[0].status,'PASS');
 const result={file,pptxSHA256:sha(file),slides:qa.slides,tableCells:cells,identicalToPreviouslyRenderedDeck:true,protectedSourceAndOfficialOutputsUnchanged:true,excerpt:{...qa.response_excerpts[0],mapping:undefined},warnings:qa.warnings.length,inputSHA256:sha('courses/ai-native/sessions/s04.md')};
 fs.writeFileSync(path.join(__dirname,'verification.json'),JSON.stringify(result,null,2));console.log(result);
})().catch(e=>{console.error(e);process.exitCode=1;});
