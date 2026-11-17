"use strict";
const {A,P,all,child,kids}=require('./xml'),{cellHeight,cellWidth,fitTableRows}=require('./tableRowMetrics');
const pt=n=>Number(n)/12700;
function tableRows(gf){return kids(all(gf,A,'tbl')[0],A,'tr').map(r=>kids(r,A,'tc'));}
function naturalWidths(frames){
 const rows=frames.flatMap(tableRows),grids=frames.map(g=>all(g,A,'gridCol'));
 for(const row of rows)for(const cell of row)for(const pr of all(cell,A,'tcPr'))for(const k of ['marL','marR','marT','marB'])pr.setAttribute(k,'54000');
 const widths=grids[0].map((_,i)=>Math.ceil(Math.max(...rows.map(r=>cellWidth(r[i])))*12700));
 const total=widths.reduce((s,w)=>s+w,0),available=651.97*12700;
 const applied=total<=available?widths:widths.map(w=>Math.floor(w*available/total));
 for(const gf of frames){
  const b=bounds(gf,true),xf=child(gf,P,'xfrm'),sum=applied.reduce((s,w)=>s+w,0);
  all(gf,A,'gridCol').forEach((c,i)=>c.setAttribute('w',String(applied[i])));
  child(xf,A,'ext').setAttribute('cx',String(sum));child(xf,A,'off').setAttribute('x',String(Math.round(b.x+(b.w-sum)/2)));
 }
 return {changed:true,afterPt:applied.map(pt),reason:'longest displayed line plus 54000EMU left/right margins'};
}
function optimizeWidths(frames,{compact=false}={}){
 const grids=frames.map(g=>kids(all(g,A,'tblGrid')[0],A,'gridCol')),old=grids[0].map(c=>pt(c.getAttribute('w'))),total=old.reduce((a,b)=>a+b,0),rows=frames.flatMap(tableRows),n=old.length;
 const header=frames.flatMap(g=>tableRows(g).slice(0,1));
 const natural=old.map((_,i)=>Math.max(...rows.map(r=>cellWidth(r[i]))));
 const minimum=old.map((_,i)=>Math.max(16,...header.map(r=>cellWidth(r[i])),...rows.map(r=>cellWidth(r[i],true)))+.3);
 if(header.some(r=>all(r[0],A,'t').map(t=>t.textContent).join('')==='용어'))minimum[0]=Math.max(minimum[0],...rows.map(r=>cellWidth(r[0])).filter(w=>w<=old[0]+2).map(w=>w+.3));
 if(minimum.reduce((a,b)=>a+b,0)>total)return {changed:false,reason:'unbroken headers/tokens exceed total width'};
 const cache=new Map();
 const column=(i,w)=>{const key=i+':'+w.toFixed(5);if(!cache.has(key))cache.set(key,rows.map(r=>cellHeight(r[i],w)));return cache.get(key);};
 function score(ws){
  const cols=ws.map((w,i)=>column(i,w));
  const violations=ws.reduce((s,w,i)=>s+Math.max(0,minimum[i]-w),0);
  const height=rows.reduce((s,_,r)=>s+Math.max(...cols.map(c=>c[r].heightPt)),0);
  const lines=cols.reduce((s,c)=>s+c.reduce((a,v)=>a+v.paragraphs.reduce((b,p)=>b+p.lines,0),0),0);
  const receiver=natural.indexOf(Math.max(...natural));
  const waste=ws.reduce((s,w,i)=>s+(compact&&i===receiver?0:Math.max(0,w-natural[i]-1)),0);
  return [violations,height,lines,waste];
 }
 const less=(a,b)=>{for(let i=0;i<a.length;i++){if(a[i]<b[i]-.0001)return true;if(a[i]>b[i]+.0001)return false;}return false;};
 const originalScore=score(old);
 if(!compact && originalScore[0]<.001 && rows.every((_,r)=>old.every((w,i)=>column(i,w)[r].paragraphs.every(p=>p.lines===1))))return {changed:false,reason:'all cells already fit on one line'};
 let current=old.slice(),best=originalScore;
 // Actual font measurements determine both donors and recipients. Coarse transfers find
 // wrap thresholds, then finer transfers settle them; no source text or total width changes.
 for(const step of [16,8,4,2,.5]){
  for(let round=0;round<160;round++){
   let next=null,nextScore=best;
   for(let from=0;from<n;from++)for(let to=0;to<n;to++){
    if(from===to || current[from]-step<minimum[from]-.001)continue;
    const ws=current.slice();ws[from]-=step;ws[to]+=step;
    const candidate=score(ws);if(less(candidate,nextScore)){next=ws;nextScore=candidate;}
   }
   if(!next)break;current=next;best=nextScore;
  }
 }
 // Leave marginal, visually irrelevant redistributions alone.
 const maxChange=Math.max(...old.map((w,i)=>Math.abs(w-current[i])));
 if(!less(best,originalScore)||maxChange<3 || (best[0]>=originalScore[0]-.001&&best[1]>=originalScore[1]-.001&&best[2]>=originalScore[2]&&maxChange<8))return {changed:false,reason:'no material improvement'};
 const emu=current.map(w=>Math.round(w*12700));emu[n-1]=grids[0].reduce((s,c)=>s+Number(c.getAttribute('w')),0)-emu.slice(0,-1).reduce((a,b)=>a+b,0);
 for(const grid of grids)grid.forEach((c,i)=>c.setAttribute('w',String(emu[i])));
 return {changed:true,beforePt:old,afterPt:emu.map(pt),scoreBefore:originalScore,scoreAfter:best};
}
function bounds(node,frame=false){const xf=frame?child(node,P,'xfrm'):child(child(node,P,'spPr'),A,'xfrm');if(!xf)return null;const o=child(xf,A,'off'),e=child(xf,A,'ext');return {xf,x:Number(o.getAttribute('x')),y:Number(o.getAttribute('y')),w:Number(e.getAttribute('cx')),h:Number(e.getAttribute('cy'))};}
function optimizeSessionTables(pages){
 const groups=new Map(),reports=[],pageChanges=new Map();
 for(const page of pages)for(const gf of all(page.doc,P,'graphicFrame')){
  if(!all(gf,A,'tbl').length)continue;
  const rows=tableRows(gf),grid=all(gf,A,'gridCol'),key=rows[0].map(c=>all(c,A,'t').map(t=>t.textContent).join('')).join('|')+':'+grid.reduce((s,c)=>s+Number(c.getAttribute('w')),0);
  if(!groups.has(key))groups.set(key,[]);groups.get(key).push({page,gf,before:bounds(gf,true)});
 }
 for(const group of groups.values()){
  const result=group[0].page.documentTablePt===8?optimizeWidths(group.map(v=>v.gf)):naturalWidths(group.map(v=>v.gf));reports.push({...result,heading:group[0].page.heading});if(!result.changed)continue;
  for(const item of group){
   const oldRows=all(item.gf,A,'tr').map(r=>Number(r.getAttribute('h'))),fit=fitTableRows(item.gf);
   // Ordinary 10pt tables retain the general 0.8cm row minimum; S03 response
   // tables use exact 8pt text height plus their existing 0.15cm cell margins.
   if(item.page.documentTablePt!==8){
    for(const row of all(item.gf,A,'tr'))row.setAttribute('h',String(Math.max(288000,Number(row.getAttribute('h')))));
    child(child(item.gf,P,'xfrm'),A,'ext').setAttribute('cy',String(all(item.gf,A,'tr').reduce((s,r)=>s+Number(r.getAttribute('h')),0)));
   }
   const after=bounds(item.gf,true),entry={...item,beforeRows:oldRows,afterRows:all(item.gf,A,'tr').map(r=>Number(r.getAttribute('h'))),delta:after.h-item.before.h};
   if(!pageChanges.has(item.page))pageChanges.set(item.page,[]);pageChanges.get(item.page).push(entry);
  }
 }
 for(const [page,changes] of pageChanges){
  for(const node of [...all(page.doc,P,'sp'),...all(page.doc,P,'graphicFrame')]){
   if(node.localName==='sp' && (all(node,P,'ph').some(ph=>ph.getAttribute('type')==='sldNum') || !all(node,A,'t').some(t=>t.textContent.trim())))continue;
   const b=bounds(node,node.localName==='graphicFrame');if(!b||b.y>6500000)continue;
   const shift=changes.filter(c=>c.gf!==node && b.y>=c.before.y+c.before.h-1 && b.x<c.before.x+c.before.w && b.x+b.w>c.before.x).reduce((s,c)=>s+c.delta,0);
   if(shift)child(b.xf,A,'off').setAttribute('y',String(b.y+shift));
  }
 }
 return reports;
}
module.exports={optimizeWidths,optimizeSessionTables,naturalWidths};
