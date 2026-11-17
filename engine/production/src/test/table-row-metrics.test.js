"use strict";
const test=require('node:test'),assert=require('node:assert/strict');
const {parseXml,all,child,A,P}=require('../xml'),{fitTableRows}=require('../tableRowMetrics');
test('table wrapping retains Hangul words and measures the rendered acceptance case as three lines',()=>{
 const {wrappedLines,malgun}=require('../tableRowMetrics');
 assert.equal(wrappedLines('2,000원으로 주문을 생성한 뒤 현재 판매가가 1,200원으로 상승하고 카드 Y 승인',154.5627559055118,malgun()[0],8),3);
});
test('8pt table rows use their tallest wrapped cell, paragraph spacing and exact vertical margins, without retaining a fixed frame height',()=>{
 const cell=(text,space=false)=>`<a:tc><a:txBody><a:bodyPr/><a:p><a:pPr><a:lnSpc><a:spcPct val="100000"/></a:lnSpc><a:spcBef><a:spcPts val="${space?100:0}"/></a:spcBef><a:spcAft><a:spcPts val="${space?200:0}"/></a:spcAft></a:pPr><a:r><a:rPr sz="800"/><a:t>${text}</a:t></a:r></a:p></a:txBody><a:tcPr marL="0" marR="0" marT="54000" marB="54000"/></a:tc>`;
 const d=parseXml(`<p:graphicFrame xmlns:p="${P}" xmlns:a="${A}"><p:xfrm><a:ext cx="812800" cy="9000000"/></p:xfrm><a:graphic><a:graphicData><a:tbl><a:tblGrid><a:gridCol w="406400"/><a:gridCol w="406400"/></a:tblGrid><a:tr h="4500000">${cell('하나')}${cell('둘')}</a:tr><a:tr h="4500000">${cell('가나다라마바사아',true)}${cell('하나')}</a:tr></a:tbl></a:graphicData></a:graphic></p:graphicFrame>`);
 const gf=d.documentElement,out=fitTableRows(gf),rows=all(gf,A,'tr'),line=10.640625,pad=108000/12700;
 assert.equal(Number(rows[0].getAttribute('h')),Math.ceil((line+pad)*12700));
 assert.equal(Number(rows[1].getAttribute('h')),Math.ceil((line*2+3+pad)*12700));
 assert.equal(Number(child(child(gf,P,'xfrm'),A,'ext').getAttribute('cy')),out.rows.reduce((s,r)=>s+r.afterEMU,0));
 assert.equal(out.rows[1].cells[0].paragraphs[0].lines,2);
 assert.ok(out.heightPt<9000000/12700);
});
