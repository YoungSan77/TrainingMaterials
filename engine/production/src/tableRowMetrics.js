"use strict";
const fs=require('fs'),path=require('path'),fontkit=require('fontkit');
const {A,P,all,child,kids,need}=require('./xml');
let fonts;
function malgun(){
 if(fonts)return fonts;
 const dirs=[process.env.TM_MALGUN_FONT_DIR,'/Applications/Microsoft PowerPoint.app/Contents/Resources/DFonts','C:/Windows/Fonts','/usr/share/fonts/truetype/malgun'].filter(Boolean);
 const dir=dirs.find(d=>fs.existsSync(path.join(d,'malgun.ttf'))&&fs.existsSync(path.join(d,'malgunbd.ttf')));
 need(dir,'8pt 표 행 계측에 맑은 고딕 원본 글꼴(malgun.ttf, malgunbd.ttf)이 필요하다. TM_MALGUN_FONT_DIR로 위치를 지정한다.');
 fonts=[fontkit.openSync(path.join(dir,'malgun.ttf')),fontkit.openSync(path.join(dir,'malgunbd.ttf'))];return fonts;
}
const widthCaches=new WeakMap();
function width(text,font,size){
 let cache=widthCaches.get(font);if(!cache){cache=new Map();widthCaches.set(font,cache);}
 const key=size+':'+text;if(cache.has(key))return cache.get(key);
 // The table template enables kerning only from 12pt; its 8/10pt cells use
 // unkerned advances. Matching that threshold keeps identifiers whole in PowerPoint.
 const result=font.layout(text,{kern:size>=12}).positions.reduce((s,p)=>s+p.xAdvance,0)*size/font.unitsPerEm;
 if(cache.size>50000)cache.clear();cache.set(key,result);return result;
}
function cellWidth(cell,minimum=false){
 const tc=child(cell,A,'tcPr'),padding=(Number(tc.getAttribute('marL')||91440)+Number(tc.getAttribute('marR')||91440))/12700;
 return padding+Math.max(0,...all(cell,A,'p').map(p=>{
  const runs=all(p,A,'rPr'),size=Number(runs[0]?.getAttribute('sz')||800)/100,font=malgun()[runs.some(r=>r.getAttribute('b')==='1')?1:0];
  const text=Array.from(p.childNodes).map(n=>n.localName==='br'?'\n':all(n,A,'t').map(t=>t.textContent).join('')).join('');
  const pieces=minimum?(text.match(/\S+/gu)||[]).filter(t=>/[A-Za-z0-9]/.test(t)&&t.length<=40):text.split(/\n|\v/);
  // Bound the displayed 10pt advances at quarter-point subpixel precision;
  // PowerPoint's hinted glyph widths can exceed the raw font-unit sum.
  const displayed=t=>size===10?font.layout(t,{kern:false}).positions.reduce((s,p)=>s+Math.ceil(p.xAdvance*size/font.unitsPerEm*4)/4,0):width(t,font,size);
  return Math.max(0,...pieces.map(displayed));
 }));
}
// The table paragraphs retain words (including Hangul words) where possible.
// Only a token wider than an empty line is broken by character.
function wrappedLines(text,widthPt,font,size){
 const tokens=text.match(/\s+|\S+/gu)||[];
 let line='',lines=1;
 for(const token of tokens){
  if(!line && /^\s+$/.test(token))continue;
  if(width(line+token,font,size)<=widthPt+0.01){line+=token;continue;}
  if(/^\s+$/.test(token)){line='';lines++;continue;}
  if(line.trim()){lines++;line='';}
  if(width(token,font,size)<=widthPt+0.01){line=token;continue;}
  for(const ch of token){if(line&&width(line+ch,font,size)>widthPt+0.01){lines++;line='';}line+=ch;}
 }
 return lines;
}
function spacingPt(pr,name,linePt){const s=pr&&child(pr,A,name);return !s?0:child(s,A,'spcPts')?Number(child(s,A,'spcPts').getAttribute('val'))/100:Number(child(s,A,'spcPct')?.getAttribute('val')||0)/100000*linePt;}
function cellHeight(cell,widthPt){
 const tc=child(cell,A,'tcPr'),available=widthPt-(Number(tc.getAttribute('marL')||91440)+Number(tc.getAttribute('marR')||91440))/12700;
 let height=0;const paragraphs=[];
 for(const p of all(cell,A,'p')){
  const pr=child(p,A,'pPr'),runs=all(p,A,'rPr'),size=Number(runs[0]?.getAttribute('sz')||800)/100;
  const font=malgun()[runs.some(r=>r.getAttribute('b')==='1')?1:0];
  const natural=(font.ascent-font.descent+font.lineGap)*size/font.unitsPerEm;
  const ln=pr&&child(pr,A,'lnSpc'),linePt=ln&&child(ln,A,'spcPts')?Number(child(ln,A,'spcPts').getAttribute('val'))/100:natural*Number(ln&&child(ln,A,'spcPct')?.getAttribute('val')||100000)/100000;
  const text=kids(p,A,'r').map(r=>all(r,A,'t').map(t=>t.textContent).join('')).join('');
  const explicit=kids(p,A,'br').length;
  const lines=wrappedLines(text,available-Number(pr?.getAttribute('marL')||0)/12700,font,size)+explicit;
  const before=spacingPt(pr,'spcBef',linePt),after=spacingPt(pr,'spcAft',linePt);
  height+=lines*linePt+before+after;paragraphs.push({text,lines,linePt,before,after,availablePt:available});
 }
 return {heightPt:height+(Number(tc.getAttribute('marT'))+Number(tc.getAttribute('marB')))/12700,paragraphs};
}
function fitTableRows(gf){
 const tbl=all(gf,A,'tbl')[0],widths=kids(child(tbl,A,'tblGrid'),A,'gridCol').map(c=>Number(c.getAttribute('w'))/12700),metrics=[];
 for(const row of kids(tbl,A,'tr')){
  const cells=kids(row,A,'tc').map((c,i)=>cellHeight(c,widths[i]));
  const height=Math.ceil(Math.max(...cells.map(c=>c.heightPt))*12700);
  metrics.push({beforeEMU:Number(row.getAttribute('h')),afterEMU:height,cells});row.setAttribute('h',String(height));
 }
 const height=metrics.reduce((s,r)=>s+r.afterEMU,0);
 child(child(gf,P,'xfrm'),A,'ext').setAttribute('cy',String(height));
 return {heightPt:height/12700,rows:metrics};
}
module.exports={fitTableRows,cellHeight,cellWidth,wrappedLines,malgun};
