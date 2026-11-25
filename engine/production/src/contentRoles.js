"use strict";
// guides/production-guide.md: formatting follows the content role, never a session number.
const RECORDED='recorded-response', REVIEW='response-review', DOCUMENT='document', LECTURE='lecture';
function roleFor(section){
  if(section.scopedDocument)return section.verbatimResponse?RECORDED:DOCUMENT;
  if(section.appendix&&section.verbatimResponse)return RECORDED;
  if(section.verbatimResponse&&section.blocks.some(b=>b.kind==='text'&&/^\*\*문서 형식/.test(b.text)))return RECORDED;
  if(section.blocks.some(b=>b.kind==='table'&&b.rows[0].some(c=>/판단|사람이.*결정/.test(c)))
    && (section.verbatimResponse||section.blocks.some(b=>b.kind==='table'&&b.rows[0].some(c=>/응답|원문|초안|관찰/.test(c)))))return REVIEW;
  return LECTURE;
}
const isRecorded=role=>role===RECORDED||role===REVIEW;
const tablePt=role=>isRecorded(role)?8:10;
// Explicit author group labels identify prose examples without using a session,
// topic number or sentence text. Actual recorded responses and fenced code keep
// their own immutable formatting contracts. Questions start a separate scope.
function markReviewExamples(sections){
 for(const section of sections){
  if(section.verbatimResponse)continue;
  let active=false;
  for(const block of section.blocks){
   const t=String(block.text||'').trim();
   if(block.kind==='heading'||/^\*\*[^*]+\*\*$/.test(t)){
    active=/^(?:검토할|검토용) (?:모델|예문|예시)$/.test(t.replace(/^\*\*|\*\*$/g,''));continue;
   }
   if(!['text','bullet'].includes(block.kind)||/^(?:\d+\.|[①-⑤])\s/.test(t)){active=false;continue;}
   if(active)block.meta={...(block.meta||{}),reviewExample:true};
  }
 }
}
module.exports={RECORDED,REVIEW,DOCUMENT,LECTURE,roleFor,isRecorded,tablePt,markReviewExamples};
