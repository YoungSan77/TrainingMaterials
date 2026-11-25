"use strict";
const test=require('node:test'),assert=require('node:assert/strict');
const {parseXml,A,P,all}=require('../xml'),{optimizeWidths,optimizeSessionTables,naturalWidths}=require('../tableColumnMetrics'),{fitTableRows,cellWidth}=require('../tableRowMetrics');
function fixture(description){
 const cell=(t,b=false)=>`<a:tc><a:txBody><a:bodyPr/><a:p><a:pPr><a:lnSpc><a:spcPct val="100000"/></a:lnSpc><a:spcBef><a:spcPts val="0"/></a:spcBef><a:spcAft><a:spcPts val="0"/></a:spcAft></a:pPr><a:r><a:rPr sz="800" b="${b?1:0}"/><a:t>${t}</a:t></a:r></a:p></a:txBody><a:tcPr marL="81005" marR="6750" marT="54000" marB="54000"/></a:tc>`;
 return parseXml(`<p:graphicFrame xmlns:p="${P}" xmlns:a="${A}"><p:xfrm><a:off x="0" y="0"/><a:ext cx="3810000" cy="2000000"/></p:xfrm><a:graphic><a:graphicData><a:tbl><a:tblGrid>${[1,2,3].map(()=>'<a:gridCol w="1270000"/>').join('')}</a:tblGrid><a:tr h="1000000">${['번호','설명','금액'].map(t=>cell(t,true)).join('')}</a:tr><a:tr h="1000000">${cell('1')}${cell(description)}${cell('2,000원')}</a:tr></a:tbl></a:graphicData></a:graphic></p:graphicFrame>`).documentElement;
}
const widths=gf=>all(gf,A,'gridCol').map(c=>Number(c.getAttribute('w')));
test('content widths measure every 8pt cell, retain natural width when it fits, and allocate overflow above measured minima',()=>{
 const {contentWidths}=require('../tableColumnMetrics');
 const short=fixture('짧은 설명'),full=contentWidths(short,600);
 const rows=all(short,A,'tr').map(r=>all(r,A,'tc'));
 assert.deepEqual(full.widths,[0,1,2].map(i=>Math.max(...rows.map(r=>cellWidth(r[i],false,true)))));
 assert.ok(full.widths.reduce((s,w)=>s+w,0)<600);
 const long=contentWidths(fixture('주문 생성 시점의 기존 단가와 수량을 유지하고 결제 승인과 거절 후 재결제의 모든 금액을 확인한다.'),200);
 assert.ok(Math.abs(long.widths.reduce((s,w)=>s+w,0)-200)<1e-8);
 assert.ok(long.widths[1]>long.widths[0]&&long.widths[1]>long.widths[2]);
 long.widths.forEach((w,i)=>assert.ok(w>=long.minimum[i]));
});
test('10pt natural widths leave the PowerPoint hinting boundary outside a two-Hangul token',()=>{
 const gf=fixture('정상');for(const rp of all(gf,A,'rPr'))rp.setAttribute('sz','1000');
 naturalWidths([gf]);
 const c=all(gf,A,'tc')[0],padding=108000/12700;
 assert.ok(cellWidth(c)-padding>=20.5);
});
test('a minimum-bound column does not dilute the natural-width ratio between two prose columns',()=>{
 const gf=fixture('배송 요청 이후의 주문 상태와 기록 시점에 확정한 항목 단가를 확인한다.');
 all(gf,A,'t').at(-1).textContent='승인에 사용한 전체 주문 금액과 최초 판매가의 변동 시점을 따로 기록한다.';
 const {widths,natural,minimum}=require('../tableColumnMetrics').contentWidths(gf,220);
 assert.equal(widths[0],minimum[0]);
 assert.ok(widths[1]>minimum[1]&&widths[2]>minimum[2]);
 assert.ok(Math.abs(widths[1]/natural[1]-widths[2]/natural[2])<1e-8);
});
test('already fitting tables retain their exact widths',()=>{
 const gf=fixture('짧은 설명'),before=widths(gf);assert.equal(optimizeWidths([gf]).changed,false);assert.deepEqual(widths(gf),before);
});
test('natural body widths equal the longest line plus exact four-side 54000EMU margins and never refill the old frame',()=>{
 const gf=fixture('짧은 설명');naturalWidths([gf]);
 const rows=all(gf,A,'tr').map(r=>all(r,A,'tc'));
 widths(gf).forEach((w,i)=>assert.equal(w,Math.ceil(Math.max(...rows.map(r=>cellWidth(r[i])))*12700)));
 for(const pr of all(gf,A,'tcPr'))for(const k of ['marL','marR','marT','marB'])assert.equal(pr.getAttribute(k),'54000');
 assert.ok(widths(gf).reduce((a,b)=>a+b,0)<3810000);
});
test('body-table review also compacts oversized short columns when all cells originally fit',()=>{
 const gf=fixture('내용을 확인하는 설명'),before=widths(gf);
 assert.equal(optimizeWidths([gf],{compact:true}).changed,true);
 assert.ok(widths(gf)[0]<before[0]);assert.ok(widths(gf)[1]>before[1]);
});
test('measured short-value columns donate width to long descriptions while total width, cells and margins stay fixed',()=>{
 const gf=fixture('배송 승인이 완료된 같은 주문을 유지하고 이전에 확정한 금액으로 카드 결제를 다시 요청한다.'),before=widths(gf),beforeHeight=fitTableRows(gf).heightPt;
 const cells=all(gf,A,'tc').map(c=>c.toString()),result=optimizeWidths([gf]),after=widths(gf);
 assert.equal(result.changed,true);assert.equal(after.reduce((a,b)=>a+b,0),before.reduce((a,b)=>a+b,0));
 assert.ok(after[0]<before[0]);assert.ok(after[1]>before[1]);assert.ok(after[2]<before[2]);
 assert.deepEqual(all(gf,A,'tc').map(c=>c.toString()),cells);assert.ok(fitTableRows(gf).heightPt<beforeHeight);
});
test('a continued table considers all row groups and uses one identical width vector',()=>{
 const first=fixture('짧은 설명'),second=fixture('배송 요청의 이전 결과와 현재 승인 결과를 확인하여 같은 주문의 상태와 금액을 유지한다.');
 assert.equal(optimizeWidths([first,second]).changed,true);assert.deepEqual(widths(first),widths(second));
});
test('a resized table never moves the slide number or an unused template shape',()=>{
 const gf=fixture('배송 요청의 이전 결과와 현재 승인 결과를 확인하여 같은 주문의 상태와 금액을 유지한다.');
 const doc=parseXml(`<p:sld xmlns:p="${P}" xmlns:a="${A}"><p:cSld><p:spTree>${gf.toString()}<p:sp><p:nvSpPr><p:nvPr><p:ph type="sldNum"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="1000000" y="6449625"/><a:ext cx="1000000" cy="200000"/></a:xfrm></p:spPr><p:txBody><a:p><a:r><a:t>- 1 -</a:t></a:r></a:p></p:txBody></p:sp></p:spTree></p:cSld></p:sld>`);
 optimizeSessionTables([{doc,heading:'테스트',documentTablePt:8}]);
 const footer=all(doc,P,'sp')[0];assert.equal(all(footer,A,'off')[0].getAttribute('y'),'6449625');
});
