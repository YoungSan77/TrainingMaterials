'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=process.cwd(),src=path.join(root,'engine/production/src'),out=path.join(root,'out/s04-feedback-20261118');fs.mkdirSync(out,{recursive:true});
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const input=path.join(root,'courses/ai-native/sessions/s04.md'),file=path.join(out,'s04-feedback.pptx');
(async()=>{
 const source=fs.readFileSync(input,'utf8'),p=require(path.join(src,'parse')).parse(source),builder=require(path.join(src,'builder'));
 const m=await builder.render(p.sections,require(path.join(src,'template')).TEMPLATE_DIR,file,p.session,p.toc,require(path.join(src,'course')).courseInfo(input));
 const structural=await require(path.join(src,'inspect')).inspect(file,m),refs=require(path.join(src,'references')).checkReferences(input,source),s=require(path.join(src,'structure')),code=require(path.join(src,'codeSource')),recorded=require(path.join(src,'recordedChecks')).verifiedRecordedChecks(input,p.sections),g=require(path.join(src,'generate'));
 const errors=[...refs.errors,...s.checkStructure(input,p.session,p.sections,m.pages)],warnings=[...refs.warnings,...recorded.warnings],c=code.checkCodeSources(input,source);errors.push(...c.errors);warnings.push(...c.warnings);
 warnings.push(...s.wrappingCells(p.sections,m.pages),...s.numberedDiagramLabels(p.sections),...s.unboldedText(p.sections,recorded),...s.slideTalk(p.sections),...s.countsMatchTable(p.sections),...s.numberedBullets(p.sections),...s.flatGroupItems(p.sections,recorded),...s.unmarkedQuestionTitles(p.sections),...s.missingNotes(p.sections),...code.checkEnumConsistency(input),...s.answersOutsideAppendix(p.sections),...s.practiceShape(p.sections),...s.missingPracticeAnswer(p.sections),...s.missingModelUpdate(p.sections),...s.spelledNumbers(p.sections),...code.checkOrphanCode(input),...(m.layoutWarnings||[]),...g.sparseContinuations(m),...g.overfullPages(m),...g.overfullColumns(m));
 m.pages.forEach((p,i)=>(p.pictures||[]).forEach(pic=>{const pt=builder.pictureTextPt(pic,pic.bounds);if(pt<builder.MIN_PT-.05)warnings.push(`슬라이드 ${i+1}: 도식 글자 ${pt.toFixed(1)}pt`);}));
 const qa={status:structural.errors.length||errors.length?'FAIL':'PASS',productionStructuralStatus:structural.errors.length?'FAIL':'PASS',slides:m.pages.length,checked_blocks:structural.blocks,input,inputSHA256:sha(input),file,fileSHA256:sha(file),visual_status:'NOT_VERIFIED',structuralErrors:structural.errors,sourceErrors:errors,warnings};
 fs.writeFileSync(file.replace('.pptx','.qa.json'),JSON.stringify(qa,null,2));
 const data={...qa,tableWidthReports:m.tableWidthReports,pages:m.pages.map((p,i)=>({slide:i+1,heading:p.heading,appendix:p.appendix,containedTables:p.containedTables,columns:p.columnHeights,quoteChecks:p.quoteChecks,items:p.items,pictures:(p.pictures||[]).map(pic=>({source:pic.source,kind:pic.kind,bounds:pic.bounds,pt:builder.pictureTextPt(pic,pic.bounds)}))}))};
 fs.writeFileSync(path.join(__dirname,'manifest.json'),JSON.stringify(data,null,2));
 console.log({file,slides:qa.slides,structuralErrors:qa.structuralErrors,sourceErrors:qa.sourceErrors,warnings:qa.warnings.length});if(structural.errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
