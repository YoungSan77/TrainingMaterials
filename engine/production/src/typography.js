"use strict";
const { A, all, child, children, kids, el, spacing } = require("./xml");
const FONT = "맑은 고딕";
// Body text and Korean code use Malgun Gothic. Preserve explicitly authored
// Consolas Latin code runs while normalizing other inherited font choices.
function normalizeTypography(doc) {
  for (const p of all(doc,A,"p")) {
    const pr=child(p,A,"pPr");
    const amount=tag=>{const n=pr && child(pr,A,tag); const v=n && child(n,A,"spcPts");return v?Number(v.getAttribute("val"))/100:0;};
    // Native table paragraphs do not reliably inherit the slide master's text
    // styles. Serialize the word policy on every paragraph for every viewer.
    spacing(p,amount("spcBef"),amount("spcAft"),null).setAttribute('latinLnBrk','0');
    for(const r of children(p).filter(n=>["r","fld"].includes(n.localName))) {
      if(!child(r,A,"rPr"))r.insertBefore(el(doc,A,"rPr"),r.firstChild);
    }
  }
  for(const tag of ["rPr","defRPr","endParaRPr"]) for(const rp of all(doc,A,tag)) {
    for(const script of ["latin","ea","cs"]) {
      let n=child(rp,A,script);
      if(!n) {n=el(doc,A,script);const after=children(rp).find(e=>["sym","hlinkClick","hlinkMouseOver","rtl","extLst"].includes(e.localName));rp.insertBefore(n,after||null);}
      if(!(script==='latin'&&n.getAttribute('typeface')==='Consolas'))n.setAttribute("typeface",FONT);
    }
  }
  for(const tag of ["majorFont","minorFont"])for(const group of all(doc,A,tag))for(const script of ["latin","ea","cs"]) {
    const n=child(group,A,script);if(n)n.setAttribute("typeface",FONT);
  }
  return doc;
}
module.exports={FONT,normalizeTypography};
