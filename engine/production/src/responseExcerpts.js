'use strict';
// Provenance, not a list of ignored diagnostics: validate a whole explicitly marked
// response range against a pinned execution document before classifying its lines.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const START='**실제 LLM 응답**',END='**실제 LLM 응답 끝**';
function scopesOf(text){
 const lines=text.replace(/^\uFEFF/,'').split(/\r?\n/),scopes=[];let topic=null,topicLine=0,open=null,fence=null;
 const close=end=>{if(open){open.end=end;scopes.push(open);open=null;}};
 for(let i=0;i<lines.length;i++){
  const t=lines[i].trim(),f=/^ {0,3}(`{3,}|~{3,})/.exec(lines[i]);
  if(f){if(!fence)fence=f[1];else if(f[1][0]===fence[0]&&f[1].length>=fence.length&&lineFenceClose(lines[i],f[1]))fence=null;continue;}
  if(fence)continue;
  const h=/^## (.+)$/.exec(lines[i]);if(h){close(i);topic=h[1];topicLine=i;}
  if(t===START){close(i);open={topic,topicLine,start:i+1,marker:i};}
  if(t===END||t==='**강사 노트**')close(i);
 }
 close(lines.length);return {lines,scopes};
}
function lineFenceClose(line,run){return line.trim()===run;}
function atoms(lines,start=0,end=lines.length,presentation=false){
 const out=[];let fence=null;
 for(let i=start;i<end;i++){
  const line=lines[i],t=line.trim(),f=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
  if(f){out.push({value:line.trimStart(),line:i+1});if(!fence)fence=f[1];else if(f[1][0]===fence[0]&&f[1].length>=fence.length&&lineFenceClose(line,f[1]))fence=null;continue;}
  if(fence){out.push({value:line,line:i+1});continue;}
  if(!t)continue;
  if(presentation&&(/^\*\*문서 형식(?: — 10pt)?\*\*$/.test(t)||t==='**페이지 분할**'))continue;
  out.push({value:t.replace(/^#{1,6} /,'# '),line:i+1,omit:presentation&&t==='.....'});
 }
 return out;
}
function matchExcerpt(selected,original){
 const memo=new Map();
 function solve(i,j){
  const key=i+':'+j;if(memo.has(key))return memo.get(key);
  let paths=[];
  if(i===selected.length){if(j===original.length)paths=[[]];}
  else if(selected[i].omit){
   // Every omission consumes real source content. No implicit gaps or zero-length
   // ellipses, and repeated text may not silently choose an ambiguous mapping.
   for(let end=j+1;end<=original.length&&paths.length<2;end++)for(const tail of solve(i+1,end)){
    paths.push([{kind:'omission',excerptLine:selected[i].line,recordStart:original[j].line,recordEnd:original[end-1].line},...tail]);if(paths.length===2)break;
   }
  }else if(j<original.length&&selected[i].value===original[j].value){
   paths=solve(i+1,j+1).map(t=>[{kind:'match',excerptLine:selected[i].line,recordLine:original[j].line},...t]);
  }
  memo.set(key,paths);return paths;
 }
 const paths=solve(0,0);if(paths.length!==1)throw Error(paths.length?'ambiguous source mapping':'wording, order, emphasis, code or omission position differs from execution');return paths[0];
}
function readRecord(course,record){
 if(!record?.path||!/^[a-f0-9]{64}$/.test(record.sha256||''))throw Error('execution path and SHA-256 are required');
 const file=path.resolve(course,record.path),relative=path.relative(course,file);
 if(relative.startsWith('..')||path.isAbsolute(relative))throw Error('execution path outside course');
 const real=fs.realpathSync(file),relReal=path.relative(fs.realpathSync(course),real);
 if(relReal.startsWith('..')||path.isAbsolute(relReal))throw Error('execution symlink outside course');
 const bytes=fs.readFileSync(real),hash=sha(bytes);
 if(hash!==record.sha256)throw Error('execution SHA-256 mismatch');
 return bytes.toString('utf8').replace(/^\uFEFF/,'');
}
function verifyResponseExcerpts(inputPath,text){
 const {lines,scopes}=scopesOf(text),result={errors:[],verifiedLines:new Set(),evidence:[],records:new Map()};
 const course=path.resolve(path.dirname(inputPath),'..'),config=path.join(course,'recorded-responses.json');let entries=[];
 try{if(fs.existsSync(config)){const data=JSON.parse(fs.readFileSync(config,'utf8'));if(data.version!==1||!Array.isArray(data.responses))throw Error('unsupported provenance format');entries=data.responses.filter(e=>e.session===path.basename(inputPath));}}
 catch(e){result.errors.push('실행 응답 출처 메타데이터 오류: '+e.message);}
 const used=new Set();
 for(const scope of scopes){
  const evidence={topic:scope.topic,excerptStart:scope.start+1,excerptEnd:scope.end,status:'FAIL'};
  try{
   const matches=entries.filter(e=>e.topic===scope.topic);if(matches.length!==1)throw Error('execution provenance missing or ambiguous');const entry=matches[0];if(used.has(entry))throw Error('multiple marked ranges need distinct topics');used.add(entry);
   const response=readRecord(course,entry.record);
   const draft=entry.draft?readRecord(course,entry.draft):null;
   const original=atoms(response.split(/\r?\n/));
   const selected=[...atoms(lines,scope.topicLine,scope.topicLine+1),...atoms(lines,scope.start,scope.end,true)];
   if(!original.length||selected.length<2)throw Error('empty execution or excerpt');
   const mapping=matchExcerpt(selected,original);
   for(let i=scope.start;i<scope.end;i++)result.verifiedLines.add(i+1);
   result.verifiedLines.add(scope.topicLine+1);
   result.records.set(scope.topic,{response,draft});
   Object.assign(evidence,{status:'PASS',record:entry.record.path,recordSHA256:entry.record.sha256,matchedAtoms:mapping.filter(m=>m.kind==='match').length,omissions:mapping.filter(m=>m.kind==='omission'),mapping});
   if(entry.draft)Object.assign(evidence,{draft:entry.draft.path,draftSHA256:entry.draft.sha256});
  }catch(e){evidence.reason=e.message;result.errors.push(`원고 ${scope.marker+1}행: 실제 응답 발췌 검증 실패 (${scope.topic}): ${e.message}`);}
  result.evidence.push(evidence);
 }
 for(const e of entries)if(!used.has(e))result.errors.push(`실행 응답 출처 범위가 없다: ${e.topic}`);
 return result;
}
module.exports={verifyResponseExcerpts,matchExcerpt};
