'use strict';
// Verify per-block, per-rule exceptions against the course's saved execution.
// No source mutation and no exemption from structural/rendering checks.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {parse}=require('./parse');
const sha=text=>crypto.createHash('sha256').update(text).digest('hex');
function candidates(sections,selector){
 const found=[];
 for(const section of sections){
  if(selector.topic && section.title!==selector.topic)continue;
  let context='';
  section.blocks.forEach((block,index)=>{
   if(block.kind==='heading'||(block.kind==='text' && /^\*\*[^*]+\*\*$/.test(block.text.trim())))context=block.text.replace(/\*\*/g,'');
   if(context===selector.context && block.kind===selector.kind && (selector.text===undefined||block.text===selector.text))found.push({section,block,index});
  });
 }
 return found;
}
function verifiedRecordedChecks(inputPath,sections){
 const result={unboldedText:new WeakSet(),flatGroupItems:new WeakSet(),checks:[],warnings:[],excerpts:require('./responseExcerpts').verifyResponseExcerpts(inputPath,fs.existsSync(inputPath)?fs.readFileSync(inputPath,'utf8'):'')};
 const course=path.resolve(path.dirname(inputPath),'..'),config=path.join(course,'recorded-checks.json');
 if(!fs.existsSync(config))return result;
 const entries=JSON.parse(fs.readFileSync(config,'utf8')).entries||[];
 for(const entry of entries.filter(e=>e.session===path.basename(inputPath))){
  let evidence={id:entry.id,rule:entry.rule,topic:entry.source.topic,context:entry.source.context,record:entry.record.path,status:'MISMATCH'};
  try{
   if(!['unboldedText','flatGroupItems'].includes(entry.rule))throw Error('unsupported rule');
   const matches=candidates(sections,entry.source),candidate=matches[entry.source.occurrence??0];
   if(entry.source.occurrence===undefined && matches.length!==1)throw Error('source block missing or ambiguous');
   if(!candidate)throw Error('source block missing');
   const recordPath=path.resolve(course,entry.record.path),relative=path.relative(course,recordPath);
   if(relative.startsWith('..')||path.isAbsolute(relative))throw Error('record outside course');
   const raw=fs.readFileSync(recordPath,'utf8');let expected;
   if(entry.rule==='unboldedText'){
    if(!['first-line','full'].includes(entry.record.format))throw Error('prompt format mismatch');
    expected=entry.record.format==='first-line'?raw.split(/\r?\n/)[0]:raw;
    if(candidate.block.text!==expected)throw Error('prompt text differs from execution');
   }else{
    if(entry.record.format!=='markdown'||!candidate.section.verbatimResponse)throw Error('not a recorded response');
    const lines=raw.split(/\r?\n/),starts=lines.flatMap((line,i)=>/^#+ /.test(line)&&line.replace(/^#+ /,'')===entry.record.context?[i]:[]);
    if(starts.length!==1)throw Error('record heading missing or ambiguous');
    let end=starts[0]+1;while(end<lines.length&&!/^#+ /.test(lines[end]))end++;
    // Parse only this recorded heading's body; unrelated raw Markdown may use other indent rules.
    const recordSections=parse('## 기록\n\n### '+entry.record.context+'\n\n'+lines.slice(starts[0]+1,end).join('\n')).sections;
    const recorded=candidates(recordSections,{context:entry.record.context,kind:entry.source.kind,text:entry.source.text});
    if(recorded.length!==1)throw Error('recorded block missing or ambiguous');
    const a=candidate.section.blocks.slice(candidate.index,candidate.index+3),b=recorded[0].section.blocks.slice(recorded[0].index,recorded[0].index+3);
    const fingerprint=blocks=>blocks.map(v=>({kind:v.kind,text:v.text,depth:v.depth}));
    if(a.length!==3||a.slice(1).some(v=>v.kind!=='bullet')||JSON.stringify(fingerprint(a))!==JSON.stringify(fingerprint(b)))throw Error('response intro or first two list items differ');
    expected=candidate.block.text;evidence.followingItems=a.slice(1).map(v=>v.text);
   }
   result[entry.rule].add(candidate.block);
   evidence={...evidence,status:'MATCH',blockIndex:candidate.index,text:candidate.block.text,recordSHA256:sha(raw),blockSHA256:sha(expected),basis:entry.rule==='unboldedText'?'exact executed request':'same heading, intro and first two list items; verbatim response section'};
  }catch(error){evidence.reason=error.message;result.warnings.push(`실행 원문 대조 불일치 (${entry.id}): ${error.message}`);}
  result.checks.push(evidence);
 }
 return result;
}
module.exports={verifiedRecordedChecks};
