"use strict";
const { plain } = require("./text");
const OMISSION = "…..";
const COLUMN_BODY_INDENT = 360363;
const COLUMN_GROUP = /^\*\*[^*]+\*\*$/;

function prepareColumnBlocks(blocks, { omitExcerpt = false, questionGaps = false } = {}) {
  const out=[];
  for(let i=0;i<blocks.length;i++) {
    const b=blocks[i],t=String(b.text||"").trim();
    if(b.kind==="pagebreak") {out.push(b);continue;}
    if(b.kind==="text" && /^\*\*(?:문서 형식(?: — 10pt)?|기록 그대로|실제 LLM 응답)\*\*$/.test(t))continue;
    if(omitExcerpt && /^⟨대표 실행 B 발췌/.test(t))continue;
    if(/^⟨중간 내용 생략⟩$|^[.…]+$/.test(t)) {out.push({...b,kind:"bullet",text:t==='.....'?t:OMISSION,depth:0,meta:{...(b.meta||{}),noGlyph:true,noHang:true,omission:true}});continue;}
    if(b.kind==="table") {out.push(b);continue;}
    const head=b.kind==="heading" || (COLUMN_GROUP.test(t) && blocks[i+1] && blocks[i+1].kind!=="pagebreak");
    const quoted=/^>\s/.test(t);
    const numbered=b.kind==="bullet" && /^(?:\d+\.|[①-⑤])\s/.test(t);
    out.push({...b,kind:head?"heading":"bullet",text:quoted?t.replace(/^>\s*/,""):b.text,depth:0,
      meta:{...(b.meta||{}),columnDepth:b.depth||0,columnHead:head,noGlyph:head||quoted||numbered||(b.kind==="text" && !COLUMN_GROUP.test(t)),noHang:true,autoNumber:numbered}});
  }
  if(questionGaps) {
    const numbered=out.map((b,i)=>({i,n:b.kind==='bullet'?/^(\d+)\.\s/.exec(b.text):null})).filter(x=>x.n);
    for(let j=numbered.length-2;j>=0;j--) {
      const a=numbered[j],b=numbered[j+1];
      if(Number(b.n[1])>Number(a.n[1])+1 && !out.slice(a.i+1,b.i).some(x=>x.text===OMISSION))out.splice(a.i+1,0,{kind:"bullet",text:OMISSION,rows:[],depth:0,meta:{noGlyph:true,noHang:true}});
    }
  }
  return out;
}

function columnIndent(b,style={}) {
  if(style.document){
    if(b.kind==='heading')return style.answer?0:182880;
    if(b.meta?.columnIntro)return 182880;
    const body=style.answer?COLUMN_BODY_INDENT:(b.meta?.columnDepth?731520:411480);
    return b.meta?.noGlyph && !b.meta.autoNumber && !b.meta.omission?body-176213:body;
  }
  return b.kind==='heading'?0:COLUMN_BODY_INDENT;
}
function columnTextHeight(blocks, widthPt, space=3,style={}) {
  return blocks.reduce((sum,b)=> {
    const size=style.document?10:b.kind==="heading"?14:12;
    const available=widthPt-14.4-columnIndent(b,style)/12700;
    const t=plain(b.text).replace(/^>\s*/,"");
    // PowerPoint's rendered Malgun Gothic document text has 1em Korean glyphs
    // and .35em spaces. Using the compact answer estimate undercounts wrapped
    // document lines and lets the following native table cover its heading.
    let width=0;for(const ch of Array.from(t))width+=size*(ch.codePointAt(0)>=0x1100?(style.document?1:0.9):ch===" "?(style.document?0.35:0.25):0.56);
    return sum+Math.max(1,Math.ceil(width/available))*size*1.2+space*2;
  },0);
}
module.exports={OMISSION,COLUMN_BODY_INDENT,prepareColumnBlocks,columnTextHeight,columnIndent};
