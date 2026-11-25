"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { checkStructure, practiceShape } = require("../structure");
const { parse } = require("../parse");
const { Builder } = require("../builder");
const { TEMPLATE_DIR } = require("../template");
const { styleSource } = require("../mermaidAdapter");
const { checkLayoutGate } = require("../inspect");
const { A, P, all, child, parseXml, shape } = require("../xml");
const { bounds } = require("../tableLayoutChecks");

test("explicit practice guide renders one slide with semantically assigned sides", async () => {
  const src = [
    "## 10. 실습 5 — 동적 모델", "**실습 목적** — 동적 모델을 검토한다.",
    "**실습 안내 — 좌우 2단(하나의 슬라이드)**",
    "**왼쪽 — 투입물·진행(20분)·결과물**", "- 투입 문서와 결과 파일",
    "**오른쪽 — 프롬프트·점검 기준**", "- 승인과 배송 순서 확인",
  ].join("\n\n");
  const builder = new Builder(TEMPLATE_DIR);
  await builder.init("05. 도메인 모델 — 동적 관점");
  const section = parse(src).sections[0];
  const page = builder.practicePage(section.blocks, section.title);
  assert.equal(builder.pages.length, 1);
  assert.equal(checkLayoutGate(page.doc, page), null);
  assert.match(checkLayoutGate(page.doc, {layoutGate:"notation"}), /같은 장/);
  assert.match(checkLayoutGate(page.doc, {layoutGate:"comparison"}), /4열 비교표/);
});

test("renumbering and editing earlier topics preserve a dense practice guide's geometry and type", async () => {
  const purpose="**실습 목적** — 실습 3·4의 확정 문서를 입력으로 상태 기계와 정상 승인 시퀀스를 작성하고, AI 응답의 전이·금액·순서·미정 정책을 검토한다. 문제가 없으면 승인하고 실제 문제가 있을 때만 근거를 명시해 수정한다. **실습 안내는 반드시 1장, 좌우 배치**다.";
  const practice=[purpose,"**실습 안내 — 좌우 2단(하나의 슬라이드)**",
    "**왼쪽 — 투입물·진행(20분)·결과물**","- **투입물** — 확정 요구사항 정의서와 정적 모델.",
    "- **진행** — 4분 응답, 11분 검토, 5분 확정.","- **결과물** — 동적 모델 문서.",
    "**오른쪽 — 프롬프트·점검 기준**",
    "- **① 모델 작성** — "+"같은 주문의 상태 기계와 정상 승인 시퀀스를 작성한다. ".repeat(4).trim(),
    "- **②~④ 검토** — "+"실제 불일치의 근거를 찾아 기록하고 해당 항목만 수정한다. ".repeat(5).trim(),
    "- **⑤ 확정** — 원문 전체를 저장한다.","- **점검** — 상태 전이, 순서, 확정 값, 미정 정책."].join("\n\n");
  async function layout(number,prefix){
    const title=`${number}. 실습 5 — 동적 모델`;
    const source=`## 목차\n\n01. 선행 주제\n${title}\n\n## 01. 선행 주제\n\n${prefix}\n\n## ${title}\n\n${practice}`;
    const parsed=parse(source),builder=new Builder(TEMPLATE_DIR);
    await builder.init("05. 도메인 모델 — 동적 관점");
    await builder.compose(parsed.sections,parsed.toc);
    const pages=builder.pages.filter(page=>/실습 5 — 동적 모델/.test(page.heading));
    assert.equal(pages.length,1);
    assert.equal(checkLayoutGate(pages[0].doc,pages[0]),null);
    return [8,9,10].map((id,i)=>{
      const sh=shape(pages[0].doc,id);
      assert.equal(all(sh,A,"noAutofit").length,1);
      const paragraphs=all(sh,A,"p");
      return {bounds:bounds(sh),paragraphs:paragraphs.map((p,j)=>{
        const pt=i===0||j===0?14:12;
        const props=child(p,A,"pPr");
        assert.equal(child(child(props,A,"lnSpc"),A,"spcPts").getAttribute("val"),String(pt*120));
        assert.ok(all(p,A,"rPr").every(r=>r.getAttribute("sz")===String(pt*100)));
        if(j===0&&i>0)assert.ok(all(p,A,"rPr").every(r=>r.getAttribute("b")==="1"));
        return all(p,A,"t").map(t=>t.textContent).join("");
      })};
    });
  }
  const before=await layout("10","짧은 설명.");
  const after=await layout("09","개정한 앞 절의 설명.\n\n---\n\n이어지는 설명.");
  assert.deepEqual(after,before);
  assert.ok(before[0].bounds.y+before[0].bounds.h<before[1].bounds.y);
  assert.equal(before[1].bounds.y,before[2].bounds.y);
});

test("notation and comparison gates reject a slide with the wrong physical objects", async () => {
  const builder = new Builder(TEMPLATE_DIR);
  await builder.init("05. 도메인 모델 — 동적 관점");
  const raw = [
    "## 표기", "표기와 의미를 읽는다.",
    "**도식 — PlantUML — 예시**",
    "```plantuml:state\n@startuml\nleft to right direction\n[*] --> Ready\nReady --> Ready : retry\nReady --> Paid : approve [ready] / store\n@enduml\n```",
    "**표 — 그림에서 직접 찾는 노테이션**",
    "| 표기 | 뜻 |\n|---|---|\n| 원 | 초기점 |\n| 상자 | 상태 |\n| 화살표 | 전이 |\n| 고리 | 자기 전이 |\n| 조건 | 가드 |",
  ].join("\n\n");
  const page = await builder.compactLegendPage(parse(raw).sections[0], true);
  assert.equal(page.pictures.length, 1);
  assert.equal(page.layoutGate, "notation");
  assert.match(checkLayoutGate(page.doc, page), /같은 장/);
});

test("an implicit state layout with a labeled self-transition separates labels horizontally", () => {
  const diagram = "stateDiagram-v2\n    Pending --> Pending : 거절\n    Pending --> Paid : 승인";
  assert.equal(styleSource(diagram), diagram.replace("\n", "\n    direction LR\n"));
  const explicit = diagram.replace("\n", "\n    direction TB\n");
  assert.equal(styleSource(explicit), explicit);
  const label = 'stateDiagram-v2\n    direction LR\n    state "결제대기\\nPENDING_PAYMENT" as Pending';
  assert.equal(styleSource(label), label.replace('\\n', '<br/>'));
});

test("a guided practice can continue while an ordinary practice must fit on one slide", () => {
  const title = "10. 실습 5 — 동적 모델";
  const source = [
    "## " + title, "**투입물**", "- 요구사항",
    "**프롬프트 ① — 초안 생성**", "요청",
    "**검토 및 중간 피드백 ② — 전이**", "피드백",
    "**프롬프트 ⑤ — 결과 확정**", "최종 요청",
    "**점검 항목 — 최종 결과 판정**", "기준",
    "**결과물**", "- `model.md`",
  ].join("\n\n");
  const sections = parse(source).sections;
  const pages = [1, 2].map(n => ({ heading: `${title} (${n}/2)` }));
  assert.deepEqual(practiceShape(sections), []);
  assert.deepEqual(checkStructure("guided.md", "", sections, pages), []);

  const ordinary = parse(source.replace("**프롬프트 ⑤ — 결과 확정**", "**프롬프트**")).sections;
  assert.match(checkStructure("ordinary.md", "", ordinary, pages)[0], /한 슬라이드/);
});

test("mixed appendix measures narrow tables and reserves full width for four columns", async () => {
  const builder = new Builder(TEMPLATE_DIR);
  await builder.init("05. 도메인 모델 — 동적 관점");
  assert.equal(builder.needsFullWidthDocumentTable({rows: [["상태", "뜻"], ["PAID", "결제완료"]]}, 8), false);
  assert.equal(builder.needsFullWidthDocumentTable({rows: [["상태", "사건", "조건", "결과"]]}, 8), true);
  assert.equal(builder.needsFullWidthDocumentTable({rows: [["항목", "설명"], ["규칙", "확정된 총액으로 요청한다 ".repeat(8)]]}, 8), true);
});

test("S05 appendix keeps short and four-column tables within the column grid", async () => {
  const source = [
    "## 목차", "01. 첫 주제", "## 01. 첫 주제", "강의 본문.",
    "## 별첨. 실습 답", "## 실행 응답", "**실제 LLM 응답**",
    "### 상태", "| 상태 | 뜻 |\n|---|---|\n| PAID | 카드 승인 결과를 받아 확정 금액을 기록하고 주문을 완료한다 |", ".....",
    "### 금액", "| 값 | 뜻 |\n|---|---|\n| 2,000원 | 확정 금액 |",
    "### 전이", "| 이전 | 사건 | 조건 | 이후 |\n|---|---|---|---|\n| 결제대기 | 승인 | 승인 완료 | 결제완료 |",
  ].join("\n\n");
  const builder = new Builder(TEMPLATE_DIR);
  await builder.init("05. 도메인 모델 — 동적 관점");
  const parsed = parse(source);
  await builder.compose(parsed.sections, parsed.toc);
  const tablePages = builder.pages.filter(page => page.items.some(item => item.kind === "table"));
  assert.deepEqual(tablePages.map(page => page.items.filter(item => item.kind === "table").map(item => item.rows[0].length)), [[2, 2, 4]]);
  assert.equal(tablePages[0].containedTables, true);
  assert.ok(tablePages.every(page=>page.containedTables&&page.strictAnswerColumns));
  for(const page of tablePages)for(const item of page.items.filter(i=>i.kind==="table")){
    const {x,w}=bounds(shape(page.doc,item.id));
    assert.ok([[28.8,349.2],[370.8,691.2]].some(([left,right])=>x>=left-.01&&x+w<=right+.01));
  }
  const page=tablePages[0];
  const tables=page.items.filter(i=>i.kind==="table").map(i=>shape(page.doc,i.id));
  assert.ok(tables.every(table=>bounds(table).x===28.8),"all fitting tables stay in the left column");
  const row=all(tables[0],A,"tr").at(-1);
  assert.deepEqual(all(row,A,"t").map(t=>t.textContent).filter(Boolean),["....."]);
  assert.ok(all(row,A,"tc").every(cell=>child(child(cell,A,"tcPr"),A,"lnB")));
  const widths=all(tables[0],A,"gridCol").map(col=>Number(col.getAttribute("w")));
  assert.ok(widths[1]>widths[0],"the longer content gets a wider column");
});

test("draft review requires both paired diagram rows and the explanation below", () => {
  const transform=(x,y,w,h)=>`<p:spPr><a:xfrm><a:off x="${x*12700}" y="${y*12700}"/><a:ext cx="${w*12700}" cy="${h*12700}"/></a:xfrm></p:spPr>`;
  const pic=(x,y)=>`<p:pic>${transform(x,y,270,72)}</p:pic>`;
  const label=(x,y,value)=>`<p:sp>${transform(x,y,260,14)}<a:t>${value}</a:t></p:sp>`;
  const labels=[label(29,65,"Before — 상태 기계"),label(371,65,"After — 상태 기계"),
    label(29,158,"Before — 시퀀스"),label(371,158,"After — 시퀀스"),label(29,400,"문제 · 근거 · 수정 결과")].join("");
  const pictures=[pic(34,84),pic(390,84),pic(34,180),pic(390,180)];
  const doc=(items)=>parseXml(`<root xmlns:a="${A}" xmlns:p="${P}">${labels}${items.join("")}</root>`);
  const gate={layoutGate:"draft-diagrams"};
  assert.equal(checkLayoutGate(doc(pictures),gate),null);
  assert.match(checkLayoutGate(doc(pictures.slice(1)),gate),/Before\/After/);
  assert.match(checkLayoutGate(doc([...pictures.slice(0,3),pic(390,275)]),gate),/Before\/After/);
});

test("recorded answer overflows from left to right in source order", async () => {
  const builder=new Builder(TEMPLATE_DIR);
  await builder.init("05. 도메인 모델 — 동적 관점");
  const rows=Array.from({length:30},(_,i)=>`- 검증 항목 ${String(i+1).padStart(2,"0")}`);
  const pages=builder.columnDocumentPages(parse(`## 실습 답\n\n${rows.join("\n")}`).sections[0].blocks,
    "실습 답",{text:10,strictAnswerColumns:true,containedTables:true,responseRole:"answer"});
  assert.equal(pages.length,1);
  const columns=all(pages[0].doc,P,"sp")
    .map(sp=>({x:bounds(sp)?.x,entries:all(sp,A,"t").map(t=>t.textContent).filter(t=>t.startsWith("검증 항목"))}))
    .filter(column=>column.entries.length).sort((left,right)=>left.x-right.x);
  assert.deepEqual(columns.map(column=>column.x),[28.8,370.8]);
  assert.ok(columns[0].entries.length>columns[1].entries.length);
  assert.deepEqual(columns.flatMap(column=>column.entries),rows.map(row=>row.slice(2)));
});

test("S05 table excerpts keep the source width of the values grid and readable eight-column events", async () => {
  const builder=new Builder(TEMPLATE_DIR);
  await builder.init("05. 도메인 모델 — 동적 관점");
  const small=[["항목","값"],["상품","펜"],["수량","2개"],["확정 주문 금액 `totalAmount`","2,000원"],["주문 생성 시 판매가","개당 1,000원"]];
  const wide=[
    ["순서","사건 또는 행위","설명용 `orderNumber`","기록 단가","확정 주문 금액","배송지","주문 상태","누적 배송 요청"],
    ["1","배송지 지정에 따른 주문 생성","`ORD-예시-A`","1,000원","2,000원","서울","`PENDING_PAYMENT`","0회"],
    ["2","카드 X 승인 요청","`ORD-예시-A`","1,000원","2,000원","서울","`PENDING_PAYMENT`","0회"],
    ["3","카드 승인 거절","`ORD-예시-A`","1,000원","2,000원","서울","`PENDING_PAYMENT`","0회"],
    ["4","카드 Y로 재결제 요청","`ORD-예시-A`","1,000원","2,000원","서울","`PENDING_PAYMENT`","0회"],
    ["5","카드 승인 완료","`ORD-예시-A`","1,000원","2,000원","서울","`PAID`","0회"],
    ["6","같은 `PAID` 주문의 서울 배송 요청","`ORD-예시-A`","1,000원","2,000원","서울","`PAID`","1회"],
  ];
  const visible=rows=>({kind:"table",text:"",rows:rows.slice(0,3)});
  const marker={kind:"text",text:"....."};
  const pages=builder.columnDocumentPages([visible(small),marker,visible(wide),marker],"실습 답",{
    text:10,tablePt:8,strictAnswerColumns:true,containedTables:true,responseRole:"answer",recordedTables:[{rows:small},{rows:wide}],
  });
  const tables=pages.flatMap(p=>all(p.doc,P,"graphicFrame").filter(f=>all(f,A,"tbl").length));
  assert.equal(tables.length,2);
  assert.ok(bounds(tables[0]).w>72 && bounds(tables[0]).w<320.41,"measure the small grid with its omitted values");
  assert.ok(Math.abs(bounds(tables[1]).w-320.4)<.01);
  const widths=all(tables[1],A,"gridCol").map(col=>Number(col.getAttribute("w"))/12700);
  const eventCell=all(all(tables[1],A,"tr")[1],A,"tc")[1];
  const {cellHeight,stripIdentifierBreaks}=require("../tableRowMetrics");
  const eventLines=cellHeight(eventCell,widths[1],true).paragraphs[0].lines;
  assert.ok(eventLines<=5,`event wraps to ${eventLines} lines at ${widths[1]}pt`);
  const stateCell=all(all(tables[1],A,"tr")[1],A,"tc")[6];
  const displayed=all(stateCell,A,"t").map(t=>t.textContent).join("");
  assert.match(displayed,/PENDING_\u200bPAYMENT/);
  assert.equal(stripIdentifierBreaks(displayed),wide[1][6]);
  const measured=builder.containedWidthReports.find(report=>report.header.length===8);
  assert.ok(measured.minimum[6]<measured.natural[6]);
  for(const table of tables)assert.equal(all(table,A,"tr").length,4,"omitted source rows affect width only");
});

test("draft review selects the same external approval window and rejects invented lines", () => {
  const builder=Builder.prototype;
  const prefix="sequenceDiagram\n    actor Customer as 고객\n";
  const approval="    Order->>Payment: 카드 승인 요청\n    Payment-->>Order: 카드 승인 완료\n";
  const delivery="    Order->>Delivery: 배송 요청";
  const extra="\n    Delivery-->>Order: 배송 요청 성공\n    Order-->>Customer: 주문 결과";
  const draft=prefix+"    Customer->>Order: 주문 생성\n"+approval+delivery+extra;
  const final=prefix+"    Customer->>Order: 카드 결제 요청\n"+approval+"    Order->>Order: PAID 반영\n"+delivery;
  assert.equal(builder.draftSequenceWindow(draft),prefix+approval+delivery+extra);
  assert.equal(builder.draftSequenceWindow(final),prefix+approval+delivery);
  assert.equal(builder.isDiagramExcerpt(prefix+approval+delivery+extra,draft),true);
  assert.equal(builder.isDiagramExcerpt(prefix+approval+delivery+extra.replace("성공","실패"),draft),false);
});

test("S05 answer 2.2, 6 and 9 allocate measured widths before validating row heights", async () => {
  const builder=new Builder(TEMPLATE_DIR);
  await builder.init("05. 도메인 모델 — 동적 관점");
  const scenarios=[
    [["사건","현재 상태","결과 상태","의미"],
      ["배송지 지정에 따른 주문 생성","주문 없음","PENDING_PAYMENT","배송지가 확정되면 주문을 생성한다. 생성 시점의 판매가를 기록 단가로 보존하고 주문 금액을 확정한다."],
      ["카드 승인 거절","PENDING_PAYMENT","PENDING_PAYMENT","명시적 거절을 청구 완료로 취급하지 않고 같은 주문과 상태를 유지한다."],
      ["카드 승인 완료","PENDING_PAYMENT","PAID","같은 주문을 결제완료로 전이시킨다."]],
    [["번호","전이 이름","현재 상태","다음 상태","확정된 동작과 제약"],
      ["T1","배송지 지정에 따른 주문 생성","주문 없음","PENDING_PAYMENT","배송지가 확정되면 새 주문을 생성한다. 생성 시점의 판매가를 기록하고 주문 금액을 확정한다."],
      ["T2","카드 승인 거절","PENDING_PAYMENT","PENDING_PAYMENT","명시적 거절을 청구 완료로 취급하지 않는다. 같은 주문 식별자, 주문 항목, 배송지와 확정 금액을 유지한다."],
      ["T3","카드 승인 완료","PENDING_PAYMENT","PAID","같은 주문을 결제완료로 전이시킨다."]],
    [["항목","값"],["상품","펜"],["수량","2개"],["확정 주문 금액 totalAmount","2,000원"]],
  ];
  for(const rows of scenarios){
    const blocks=[{kind:"table",text:"",rows:rows.slice(0,3)},{kind:"text",text:"....."}];
    const [page]=builder.columnDocumentPages(blocks,"실습 답",{
      text:10,tablePt:8,strictAnswerColumns:true,containedTables:true,responseRole:"answer",recordedTables:[{rows}],
    });
    const {widths,natural,minimum,availablePt}=builder.containedWidthReports.at(-1);
    const free=widths.map((w,i)=>({w,i})).filter(({w,i})=>w>minimum[i]+1e-6);
    assert.ok(free.length>=1);
    for(const {w,i} of free)assert.ok(Math.abs(w/natural[i]-free[0].w/natural[free[0].i])<1e-8);
    assert.ok(Math.abs(widths.reduce((a,b)=>a+b,0)-Math.min(availablePt,natural.reduce((a,b)=>a+b,0)))<1e-8);
    const gf=shape(page.doc,page.items.find(item=>item.kind==="table").id);
    const {cellHeight}=require("../tableRowMetrics");
    if(rows[0][1]==="전이 이름"){
      const eventCell=all(all(gf,A,"tr")[1],A,"tc")[1];
      assert.ok(widths[1]>=50,"give a short multiword transition label room within the column");
      assert.ok(cellHeight(eventCell,widths[1],true).paragraphs[0].lines<=3);
    }
    for(const row of all(gf,A,"tr").slice(0,3)){
      const heights=all(row,A,"tc").map((cell,i)=>cellHeight(cell,widths[i],true).heightPt);
      assert.ok(Number(row.getAttribute("h"))/12700+.01>=Math.max(...heights));
    }
  }
});

test("appendix diagram display excerpt keeps state transitions and sequence messages", () => {
  const excerpt=Builder.prototype.answerDiagramExcerpt;
  const state="stateDiagram-v2\n    A --> A : rejected\n    A --> B : approved\n    note right of A\n        Context\n    end note";
  assert.equal(excerpt(state).trim(),"stateDiagram-v2\n    A --> A : rejected\n    A --> B : approved");
  const sequence="sequenceDiagram\n    participant A\n    Note over A: Context\n    A->>B: Request\n    B-->>A: Reply";
  assert.equal(excerpt(sequence),"sequenceDiagram\n    participant A\n    A->>B: Request\n    B-->>A: Reply");
});
