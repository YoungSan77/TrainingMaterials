'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {Builder}=require('../builder'),{TEMPLATE_DIR}=require('../template'),{A,P,all,child,shape}=require('../xml');
const {normalizeTypography}=require('../typography'),{checkTableLayout,bounds}=require('../tableLayoutChecks');
async function fixture(){
 const b=new Builder(TEMPLATE_DIR);await b.init('77. 임의 과정 문서',{});
 const blocks=[{kind:'heading',text:'대표 값',rows:[]},{kind:'table',rows:[['식별자','값'],['OrderItem.lineAmount','2,000원'],['Order.shippingAddress','서울']]},{kind:'bullet',text:'항목 금액을 계산하면 다음과 같다.',meta:{noGlyph:true}},{kind:'bullet',text:'lineAmount = unitPrice × quantity',meta:{noGlyph:true,columnCode:true}}];
 const box={x:.4,y:1.05,w:4.45,h:5.5,space:2,document:true,tablePt:8,containedTables:true,answer:true};
 for(const block of blocks)block.depth=0;
 const page=b.fixedColumnPage([blocks,[]],'임의 문서',[box,{...box,x:5.15}]);normalizeTypography(page.doc);
 return {b,page,blocks,box};
}
test('arbitrary-course native tables serialize no mid-word breaks and position following content from measured row sum',async()=>{
 const {b,page,blocks,box}=await fixture(),table=page.items.find(i=>i.kind==='table'),gf=shape(page.doc,table.id);
 const measured=b.columnTableHeightPt(blocks[1],box),actual=bounds(gf);
 assert.ok(Math.abs(measured-actual.h)<.01);
 const next=page.items.find(i=>i.kind!=='table'&&i.text.includes('항목 금액'));
 assert.ok(Math.abs(bounds(shape(page.doc,next.id)).y-actual.y-actual.h-8)<.01);
 assert.ok(all(gf,A,'pPr').every(p=>p.getAttribute('latinLnBrk')==='0'));
 assert.deepEqual(checkTableLayout(page.doc,page).errors,[]);
});
test('QA rejects missing or enabled Latin breaking independently of slide-master defaults',async()=>{
 for(const value of [null,'1']){
  const {page}=await fixture(),gf=shape(page.doc,page.items.find(i=>i.kind==='table').id),p=all(gf,A,'pPr')[0];
  if(value===null)p.removeAttribute('latinLnBrk');else p.setAttribute('latinLnBrk',value);
  assert.ok(checkTableLayout(page.doc,page).errors.some(e=>/word-break/.test(e)));
 }
});
test('QA rejects a column that would force an identifier split even when row and frame heights agree',async()=>{
 const {page}=await fixture(),gf=shape(page.doc,page.items.find(i=>i.kind==='table').id);
 all(gf,A,'gridCol')[0].setAttribute('w',String(25*12700));
 assert.ok(checkTableLayout(page.doc,page).errors.some(e=>/identifier OrderItem.lineAmount/.test(e)));
});
test('QA rejects a later table growth or text coordinate regression that overlaps the following calculation',async()=>{
 for(const change of ['table','text']){
  const {page}=await fixture(),table=page.items.find(i=>i.kind==='table'),gf=shape(page.doc,table.id),b=bounds(gf);
  if(change==='table'){
   const row=all(gf,A,'tr').at(-1);row.setAttribute('h',String(Number(row.getAttribute('h'))+20*12700));
   child(child(gf,P,'xfrm'),A,'ext').setAttribute('cy',String(Math.round((b.h+20)*12700)));
  }else{
   const next=page.items.find(i=>i.kind!=='table'&&i.text.includes('항목 금액'));
   child(child(child(shape(page.doc,next.id),P,'spPr'),A,'xfrm'),A,'off').setAttribute('y',String(Math.round((b.y+b.h-1)*12700)));
  }
  assert.ok(checkTableLayout(page.doc,page).errors.some(e=>/overlaps text\/code/.test(e)));
 }
});
