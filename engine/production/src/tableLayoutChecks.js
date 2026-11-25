'use strict';
const {A,P,all,child,kids,shape}=require('./xml');
const {cellWidth}=require('./tableRowMetrics');
function bounds(node){
 const xf=node.localName==='graphicFrame'?child(node,P,'xfrm'):child(child(node,P,'spPr'),A,'xfrm');
 if(!xf)return null;
 const o=child(xf,A,'off'),e=child(xf,A,'ext');
 return {x:Number(o.getAttribute('x'))/12700,y:Number(o.getAttribute('y'))/12700,w:Number(e.getAttribute('cx'))/12700,h:Number(e.getAttribute('cy'))/12700};
}
function checkTableLayout(doc,page){
 const errors=[],tables=[];
 for(const item of page.items.filter(i=>i.kind==='table')){
  const gf=shape(doc,item.id),b=bounds(gf),widths=all(gf,A,'gridCol').map(c=>Number(c.getAttribute('w'))/12700);
  const rows=all(gf,A,'tr'),height=rows.reduce((s,r)=>s+Number(r.getAttribute('h'))/12700,0);
  const checks={shape:item.id,bounds:b,rowSumPt:height,protectedTokens:0,followingObjects:[]};
  for(const row of rows)kids(row,A,'tc').forEach((cell,i)=>{
   for(const p of all(cell,A,'p')){
    if(child(p,A,'pPr')?.getAttribute('latinLnBrk')!=='0')errors.push(`table ${item.id}: Latin word-break policy must be explicit 0`);
    const value=all(p,A,'t').map(t=>t.textContent).join('');
    // Check each lexical identifier using its real cell font and margins. Prose
    // wraps normally; an identifier must fit without arbitrary character splits.
    for(const token of value.match(/[A-Za-z_][A-Za-z0-9_.]*/g)||[]){
     const clone=cell.cloneNode(true),paragraph=all(clone,A,'p')[0];
     for(const other of all(clone,A,'p').slice(1))other.parentNode.removeChild(other);
     const ts=all(paragraph,A,'t');if(!ts.length)continue;
     ts[0].textContent=token;for(const t of ts.slice(1))t.textContent='';
     const needed=cellWidth(clone,false,Boolean(page.containedTables));checks.protectedTokens++;
     if(needed>widths[i]+.05)errors.push(`table ${item.id}: identifier ${token} needs ${needed.toFixed(2)}pt, column has ${widths[i].toFixed(2)}pt`);
    }
   }
  });
  for(const next of page.items.filter(i=>i.id!==item.id&&i.text?.trim())){
   const other=bounds(shape(doc,next.id));if(!other)continue;
   const horizontal=Math.min(b.x+b.w,other.x+other.w)-Math.max(b.x,other.x);
   const vertical=Math.min(b.y+b.h,other.y+other.h)-Math.max(b.y,other.y);
   if(horizontal>.05&&vertical>.05)errors.push(`table ${item.id}: overlaps text/code object ${next.id} by ${vertical.toFixed(2)}pt`);
   if(horizontal>.05&&other.y>=b.y+b.h-.05)checks.followingObjects.push({shape:next.id,gapPt:other.y-(b.y+b.h)});
  }
  tables.push(checks);
 }
 return {errors,tables};
}
module.exports={checkTableLayout,bounds};
