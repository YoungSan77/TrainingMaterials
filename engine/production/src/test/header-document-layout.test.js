"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("fs"),os=require("os"),path=require("path");
const {parse}=require("../parse"),{render,bundle}=require("../builder"),{inspect}=require("../inspect"),{TEMPLATE_DIR}=require("../template");
const {shape,text,all,child,A,P}=require("../xml");
const block=(text)=>({kind:"bullet",text,depth:0,rows:[],meta:null});
async function output(fn){const file=path.join(fs.mkdtempSync(path.join(os.tmpdir(),"tm-header-doc-")),"out.pptx");return fn(file);}

test("Shape 5 labels long normal, appendix and bundled pages without crossing the 20pt title box",()=>output(async file=>{
  const items=["03. 요구사항과 업무 정책 — 확정 조건과 수용 기준", "04. 모델과 책임 — 객체 관계와 상태 변화"].map(session=>{
    const p=parse('## 01. 긴 제목에서도 요구사항과 시스템 책임 및 검증 기준을 함께 확인한다\n\n본문이다.\n\n## 별첨. 실습 답\n\n## 길이가 긴 요구사항 정의서와 수용 기준의 실제 응답\n\n**실제 LLM 응답**\n\n### 규칙\n\n- 첫 조건\n- 둘째 조건\n');
    return {...p,session,toc:[block(p.sections[0].title)]};
  });
  const m=await bundle(items,TEMPLATE_DIR,file,"묶음 검증");
  assert.deepEqual((await inspect(file,m)).errors,[]);
  for(const p of m.pages){
    assert.equal(text(shape(p.doc,6)),"");
    if(p.isToc)continue;
    assert.equal(text(shape(p.doc,5)),(p.appendix?"별첨: ":"")+p.session);
    const box=id=>{const s=shape(p.doc,id),o=all(s,A,"off")[0],e=all(s,A,"ext")[0];return {x:+o.getAttribute("x"),y:+o.getAttribute("y"),w:+e.getAttribute("cx"),h:+e.getAttribute("cy")};};
    assert.ok(box(2).x+box(2).w<box(5).x || box(5).y+box(5).h<=box(2).y);
    assert.ok(box(5).y+box(5).h<54*12700);
    assert.equal(all(shape(p.doc,2),A,"rPr")[0].getAttribute("sz"),"2000");
  }
}));

test("a segment-local explicit 10pt response keeps its size without restyling the author review",()=>output(async file=>{
  const p=parse('## 01. 응답 검토\n\n### 시연 입력\n\n입력 설명이다.\n\n**페이지 분할**\n\n### 실제 응답\n\n**문서 형식 — 10pt**\n\n**그룹**\n\n- 원문 조건이다.\n\n| 용어 | 정의 |\n|---|---|\n| 주문 | 업무 거래 |\n\n**페이지 분할**\n\n### 저자의 검토\n\n판단 근거를 확인한다.\n');
  const m=await render(p.sections,TEMPLATE_DIR,file,"03. 요구사항",[block("01. 응답 검토")],{productionProfile:'ai-native-s03'});
  assert.deepEqual((await inspect(file,m)).errors,[]);
  const response=m.pages.find(p=>p.items.some(i=>(i.text||"").includes("원문 조건")));
  assert.equal(response.answerColumns,2);
  const author=m.pages.find(p=>p.items.some(i=>(i.text||"").includes("판단 근거")));
  assert.ok(all(author.doc,A,"rPr").some(r=>r.getAttribute("sz")==="1800"));
  const original=all(response.doc,A,"p").find(p=>p.textContent.includes("원문 조건"));
  assert.ok(all(original,A,"rPr").every(r=>r.getAttribute("sz")==="1000"));
}));

test("verbatim appendix keeps omissions and a native retry table in its two-column flow",()=>output(async file=>{
  const p=parse('## 01. 본문\n\n안내한다.\n\n## 별첨. 실습 답\n\n## 실제 응답\n\n**실제 LLM 응답**\n\n⟨발췌⟩\n\n### 전제\n\n- 조건 하나\n- 조건 둘\n\n…\n\n### 기대 결과\n\n| 항목 | 거절 | 승인 |\n|---|---|---|\n| 금액 | 2,000원 | 2,000원 |\n| 배송 요청 | 0회 | 1회 |\n');
  const m=await render(p.sections,TEMPLATE_DIR,file,"03. 요구사항",[block("01. 본문")],{productionProfile:'ai-native-s03'});
  assert.deepEqual((await inspect(file,m)).errors,[]);
  const ps=m.pages.filter(p=>p.appendix);
  assert.equal(ps.length,1);assert.equal(ps[0].answerColumns,2);
  assert.ok(ps[0].items.some(i=>(i.text||"").includes("…")));
  assert.equal(ps[0].items.filter(i=>i.kind==="table").length,1);
  const positions=all(ps[0].doc,A,"off").map(o=>Number(o.getAttribute("x")));
  assert.ok(positions.includes(Math.round(5.15*914400)));
}));
