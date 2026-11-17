'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {wrappingCells,unboldedText}=require('../structure');
const {Builder}=require('../builder'),{TEMPLATE_DIR}=require('../template');
const {A,P,all,shape,child}=require('../xml');
const block=(text,kind='text')=>({kind,text,depth:0,rows:[]});
test('one-line warning keeps ordinary violations but recognises only emitted S03 measured 8pt table rows',()=>{
 const rows=[['항목','내용'],['조건','주문을 생성한 시점의 판매가와 수량으로 계산한 주문 금액을 이후 가격 변경과 관계없이 유지한다.'.repeat(5)]];
 const sections=[{title:'11. LLM 초안 검토',blocks:[{kind:'table',rows}]}];
 const page={heading:'11. LLM 초안 검토 (5/5)',s03Profile:true,documentTablePt:8,items:[{kind:'table',rows}]};
 assert.ok(wrappingCells(sections).length);
 assert.deepEqual(wrappingCells(sections,[page]),[]);
 for(const p of [{...page,s03Profile:false},{...page,documentTablePt:10},{...page,heading:'다른 주제'},{...page,items:[{kind:'table',rows:[rows[0]]}]}])assert.ok(wrappingCells(sections,[p]).length);
 assert.deepEqual(wrappingCells([{title:'짧은 정상 표',blocks:[{kind:'table',rows:[['항목','값'],['주문','확정']]}]}]),[]);
});
test('artifact noun lists and input-output mappings are exempt, while prose and unbolded definition citations remain violations',()=>{
 const check=t=>unboldedText([{title:'실습',blocks:[block(t,'bullet')]}]);
 for(const s of ['실습 1 `주문한다-업무조건.md`, 실습 2 `활용-방식-판단.md`','`docs/주문한다-요구사항-정의서.md` → 실습 4 입력'])assert.deepEqual(check(s),[]);
 for(const s of ['실습 1 `주문한다-업무조건.md`를 읽고 업무 조건을 확정한다.','`docs/주문한다-요구사항-정의서.md` → 실습 4 입력으로 검토하고 고친다.','요구사항은 시스템이 준수해야 할 역량과 조건을 표현한다, "Requirements are capabilities and conditions", [Example 2026]'])assert.equal(check(s).length,1);
 assert.deepEqual(check('**합의한 기준**으로 업무 결과를 검증하고 기록한다.'),[]);
});
test('S03 keeps a recorded US-01 title, description and acceptance conditions together when the group fits an empty column',async()=>{
 const b=new Builder(TEMPLATE_DIR);await b.init('03. 요구사항',{productionProfile:'ai-native-s03'});
 const cap=(b.contentBottomY()-1.05)*72,count=2*Math.floor(cap/16)-3;
 const story=[block('US-01. 장바구니 상품 주문','heading'),block('고객으로서 상품을 주문하고 싶다.'),block('인수 조건:'),block('카드 승인 뒤 배송을 요청한다.','bullet'),block('주문 금액을 유지한다.','bullet')];
 const pages=b.columnDocumentPages([...Array.from({length:count},()=>block('앞 절의 기록.')), ...story],'11. LLM 초안 검토',{text:10,responseRole:'demo',tablePt:8});
 const text=p=>all(p.doc,A,'t').map(t=>t.textContent).join('');
 const owner=pages.find(p=>text(p).includes('US-01.'));
 for(const item of story)assert.ok(text(owner).includes(item.text),item.text);
 assert.equal(pages.filter(p=>text(p).includes('US-01.')).length,1);
 assert.equal(pages.flatMap(p=>all(p.doc,A,'t')).filter(t=>t.textContent==='앞 절의 기록.').length,count);
});
test('S03 glossary planning uses its actual 8pt height and retains the following explanation below the table',async()=>{
 const b=new Builder(TEMPLATE_DIR);await b.init('03. 요구사항',{productionProfile:'ai-native-s03'});
 const table={kind:'table',rows:[['용어','표기','정의'],...Array.from({length:9},(_,i)=>['용어'+i,'name'+i,'업무 기록의 뜻'])]};
 const box={x:.4,y:1.05,w:4.45,h:b.contentBottomY()-1.05,document:true,answer:true,space:2,tablePt:8};
 const measured=b.columnTableHeightPt(table,box),legacy=table.rows.reduce((sum,row)=>sum+b.rowHeight(row,b.columnWidthsFor(table,box)),0);
 assert.ok(measured<legacy);
 const tail='판매가와 주문 생성 시점에 기록한 단가는 서로 구분한다.';
 const [page]=b.columnDocumentPages([block('8. 용어','heading'),table,block(tail)],'별첨 응답',{text:10,responseRole:'answer',tablePt:8});
 const gf=all(page.doc,P,'graphicFrame')[0],sp=all(page.doc,P,'sp').find(s=>s.textContent.includes(tail));
 assert.ok(sp);assert.ok(Number(child(child(child(sp,P,'spPr'),A,'xfrm'),A,'off').getAttribute('y'))>Number(child(child(gf,P,'xfrm'),A,'off').getAttribute('y')));
 b.s03Profile=false;assert.equal(b.columnTableHeightPt(table,box),legacy);
});
