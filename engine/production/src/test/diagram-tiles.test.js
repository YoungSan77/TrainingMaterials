"use strict";
const test=require('node:test'),assert=require('node:assert/strict');
const {diagramTiles}=require('../diagramTiles'),{pictureTextPt}=require('../visualFit');
test('half-width glossary tables reserve enough width for a complete state identifier',()=>{
 const {Builder}=require('../builder'),{widthOf}=require('../text');const b=Object.create(Builder.prototype);
 const block={rows:[['용어','표기','정의'],['결제대기','PENDING_PAYMENT','주문은 생성되었지만 승인이 완료되지 않은 상태를 뜻한다.']]};
 const widths=b.columnWidthsFor(block,{w:4.45});assert.ok(widths[1]>=widthOf('PENDING_PAYMENT',10)*1.12+14.4-1e-6);assert.ok(widths.reduce((a,b)=>a+b,0)<=4.45*72+1e-6);
});
test('seven-column comparison tables retain every editable cell',async()=>{
 const fs=require('fs'),os=require('os'),path=require('path'),{parse}=require('../parse'),{render}=require('../builder'),{TEMPLATE_DIR}=require('../template'),{A,all}=require('../xml');
 const header=['상황','사건','동일 주문','주문 금액','승인 요청 금액','상태','배송 횟수'];
 const row=['승인','카드 Y','같음','2,000원','2,000원','PAID','1회'];
 const p=parse('## 01. 비교\n\n|'+header.join('|')+'|\n|'+header.map(()=> '---').join('|')+'|\n|'+row.join('|')+'|');
 const file=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'tm-seven-cols-')),'out.pptx');
 const m=await render(p.sections,TEMPLATE_DIR,file,'테스트',[{kind:'bullet',text:'01. 비교',depth:0,rows:[]}]);
 const page=m.pages.find(p=>p.items.some(i=>i.kind==='table'));assert.equal(all(page.doc,A,'tc').length,14);
 assert.deepEqual(page.items.find(i=>i.kind==='table').rows,[header,row]);
});
test('an over-tall original diagram is completely covered by overlapping 7pt viewports',()=>{
 const image={kind:'mermaid',width:400,height:4000,svgWidth:400,fontPx:16},box={x:0.4,y:1.05,w:9.2,h:5.8};
 const tiles=diagramTiles(image,box);assert.ok(tiles.length>1);
 assert.equal(tiles[0].crop.t,0);assert.equal(tiles.at(-1).crop.b,0);
 for(let i=0;i<tiles.length;i++) {const t=tiles[i];assert.ok(Math.abs(pictureTextPt({...image,crop:t.crop},t.bounds)-7)<1e-8);assert.ok(t.bounds.h<=box.h+1e-8);assert.ok(t.bounds.y+t.bounds.h<=box.y+box.h+1e-8);if(i)assert.ok(t.crop.t<1-tiles[i-1].crop.b);}
});
test('wide diagrams retain full horizontal coverage without scaling their text below 7pt',()=>{
 const image={kind:'mermaid',width:5000,height:500,svgWidth:5000,fontPx:16},box={x:0.4,y:1.05,w:9.2,h:5.8};
 const tiles=diagramTiles(image,box);assert.ok(tiles.length>1);assert.equal(tiles[0].crop.l,0);assert.equal(tiles.at(-1).crop.r,0);
 for(let i=0;i<tiles.length;i++){assert.ok(Math.abs(pictureTextPt({...image,...tiles[i]},tiles[i].bounds)-7)<1e-8);if(i)assert.ok(tiles[i].crop.l<1-tiles[i-1].crop.r);}
});
