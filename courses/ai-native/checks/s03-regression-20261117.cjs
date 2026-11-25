'use strict';
const fs=require('fs'),assert=require('assert/strict');
const {generateFile}=require('../../../engine/production/src/generate');
const {TEMPLATE_DIR}=require('../../../engine/production/src/template');
const {readZip}=require('../../../engine/production/src/zip');
const {parseXml,all,A}=require('../../../engine/production/src/xml');
(async()=>{
 const input='courses/ooad/sessions/s02.md',output='out/ai-native-baseline-20261117/ooad-s02.pptx';
 const before=fs.readFileSync(input);
 if(process.argv[2]!=='--inspect')await generateFile(input,output,TEMPLATE_DIR);
 const report=JSON.parse(fs.readFileSync(output.replace(/\.pptx$/,'.qa.json')));
 assert.ok(before.equals(fs.readFileSync(input)));
 const z=await readZip(output),slides=[...z.keys()].filter(n=>/^ppt\/slides\/slide\d+\.xml$/.test(n));
 let cells=0;for(const name of slides)for(const r of all(parseXml(z.get(name)),A,'tc')){
  cells++;for(const p of all(r,A,'rPr'))assert.equal(p.getAttribute('sz'),'1000');
 }
 fs.writeFileSync('courses/ai-native/checks/s03-baseline-20261117/regression.json',JSON.stringify({input,output,sourcePreserved:true,slides:slides.length,cells,tableFontPt:10,report},null,2));
 console.log(JSON.stringify({input,slides:slides.length,cells,sourcePreserved:true,report}));
})().catch(e=>{console.error(e);process.exitCode=1});
