"use strict";
// Port of LecturePpt.inspect()/Report: re-reads the written PPTX and checks it against the
// Manifest that produced it — the same "render, then re-read and verify" self-check the Java
// original performs before ever declaring PASS.
const { A, P, all, shape, text, body, kids, child, children, paragraph } = require("./xml");
const { readZip } = require("./zip");
const { slideParts } = require("./template");

function numberedText(sh) {
  return all(sh, A, "p").map(p => {
    const auto = all(p, A, "buAutoNum")[0];
    if (!auto) return paragraph(p);
    const n = Number(auto.getAttribute("startAt") || 1);
    const kind = auto.getAttribute("type");
    const prefix = kind === "circleNumDbPlain" ? String.fromCodePoint(0x2460 + n - 1) + " " : kind === "arabicPeriod" ? n + ". " : "";
    return prefix + paragraph(p);
  }).join("\n");
}

function reportJson(errors, slides, blocks, warnings) {
  const q = (s) => JSON.stringify(s);
  return (
    "{\n  \"status\": " + q(errors.length === 0 ? "PASS" : "FAIL") + ",\n  \"slides\": " + slides +
    ",\n  \"checked_blocks\": " + blocks + ",\n  \"visual_status\": \"NOT_VERIFIED\",\n  \"errors\": [" +
    errors.map(q).join(",") + "]" + (warnings ? ",\n  \"warnings\": [" + warnings.map(q).join(",") + "]" : "") + "\n}\n"
  );
}

function checkLayoutGate(doc, page) {
  const table = all(doc, A, "tbl");
  // 2026-11-27에 배치 게이트 세 개(draft-diagrams·draft-review·comparison)를 지웠다. 그것들은
  // 특정 교재의 표 제목·열 이름·라벨 문구("Before — 상태 기계", "판단·기준·오류·수정")를 renderer의
  // 합격 조건으로 적어 둔 것이었고, 그 표식을 쓰는 원고는 하나도 없었다. 배치는 원고의 표식이
  // 요청하고, 검사는 그 표식이 요청한 **구조**를 본다 — 교재의 문구는 보지 않는다.
  if(page.layoutGate==="notation") {
    return all(doc,P,"pic").length===1&&table.length===1
      ?null:"도식 하나와 표 하나가 같은 장에 있어야 한다.";
  }
  if(["practice-columns","answer-columns"].includes(page.layoutGate)){
    const bodyShapes=all(doc,P,"sp").filter(sp=>{
      const prop=child(sp,P,"spPr");
      const transform=prop&&child(prop,A,"xfrm");
      if(!transform)return false;
      const off=child(transform,A,"off");
      const ext=child(transform,A,"ext");
      return off&&ext&&Number(off.getAttribute("y"))>850000&&Number(off.getAttribute("y"))<6300000
        &&Number(ext.getAttribute("cx"))<914400*5.5&&all(sp,A,"t").some(t=>t.textContent.trim());
    });
    const left=bodyShapes.filter(sp=>Number(all(sp,A,"off")[0].getAttribute("x"))<3050000);
    const right=bodyShapes.filter(sp=>Number(all(sp,A,"off")[0].getAttribute("x"))>3050000);
    const tableOffsets=all(doc,P,"graphicFrame").filter(frame=>all(frame,A,"tbl").length)
      .map(frame=>Number(child(child(frame,P,"xfrm"),A,"off")?.getAttribute("x")));
    if(page.layoutGate==="answer-columns"&&(left.length||tableOffsets.some(x=>x<3050000))
      &&(right.length||tableOffsets.some(x=>x>3050000)))return null;
    const joined=shapes=>shapes.map(sp=>all(sp,A,"t").map(t=>t.textContent).join("")).join(" ");
    if(page.layoutGate==="practice-columns"&&/투입물.*진행.*결과물/.test(joined(left))&&/프롬프트.*점검/.test(joined(right)))return null;
    return "좌우 단에 필요한 본문이 없다.";
  }
  return null;
}

async function inspect(outputPath, m) {
  const data = await readZip(outputPath);
  const parts = slideParts(data);
  const errors = [];
  const tableLayout=[];
  const layoutGates=[];
  let blocks = 0;
  if (parts.length !== m.pages.length) errors.push("Slide count mismatch");
  const { parseXml } = require("./xml");
  for (let i = 0; i < Math.min(parts.length, m.pages.length); i++) {
    const doc = parseXml(data.get(parts[i]));
    const p = m.pages[i];
    const prefix = "Slide " + (i + 1) + ": ";
    const layout=require('./tableLayoutChecks').checkTableLayout(doc,p);
    const gateError=checkLayoutGate(doc,p);
    if(gateError)errors.push(prefix+gateError);
    if(p.strictAnswerColumns)for(const t of layout.tables){
      const {x,w}=t.bounds;
      if(![[28.8,349.2],[370.8,691.2]].some(([left,right])=>x>=left-.05&&x+w<=right+.05))
        errors.push(prefix+"별첨 표가 단의 폭을 벗어난다.");
    }
    if(p.layoutGate)layoutGates.push({slide:i+1,gate:p.layoutGate,status:gateError?"FAIL":"PASS"});
    errors.push(...layout.errors.map(e=>prefix+e));tableLayout.push({slide:i+1,tables:layout.tables});
    const ids = new Set();
    for (const nv of all(doc, P, "cNvPr")) {
      const v = nv.getAttribute("id");
      if (ids.has(v)) errors.push(prefix + "duplicate ID");
      ids.add(v);
    }
    if (text(shape(doc, 2)) !== p.heading) errors.push(prefix + "heading mismatch");
    // The cover and TOC slides intentionally carry no top-right session name (builder.js
    // `p.isCover`, `p.isToc`): neither is a "일반 슬라이드" in production-guide.md's sense.
    // An appendix slide reads "별첨: <세션명>" (builder.js appendixSessionName).
    // 묶음 덱은 세션마다 우측 상단 세션명이 다르다 — 그 장이 구성된 세션(p.session)과 견준다.
    const label = p.session || m.title;
    // 사용자 배치 지시: 구분선 위 우측 Shape 5가 세션명이고 Shape 6은 비운다.
    if (text(shape(doc, 5)) !== (p.isToc || p.isCover ? "" : p.appendix ? "별첨: " + label : label)) errors.push(prefix + "title mismatch");
    if (text(shape(doc, 6)) !== "") errors.push(prefix + "session name in the unused box");
    if (text(shape(doc, 7)) !== m.source) errors.push(prefix + "source mismatch");
    for (const item of p.items) {
      const sh = shape(doc, item.id);
      blocks++;
      if (item.kind === "table") {
        const rows = [];
        for (const row of all(sh, A, "tr")) {
          rows.push(kids(row, A, "tc").map((c) => p.strictAnswerColumns
            ?require('./tableRowMetrics').stripIdentifierBreaks(text(c)):text(c)));
          let ext = false;
          for (const c of children(row)) {
            if (c.localName === "extLst") ext = true;
            else if (ext) errors.push(prefix + "invalid table row sequence");
          }
        }
        if (JSON.stringify(rows) !== JSON.stringify(item.rows)) errors.push(prefix + "table content mismatch");
        const tablePt=require('./contentRoles').tablePt(item.role||p.contentRole);
        for (const rp of all(sh, A, "rPr")) if (rp.getAttribute("sz") !== String(tablePt*100)) errors.push(prefix + `table font !=${tablePt}pt`);
        for(const rp of all(sh,A,'endParaRPr'))if(rp.getAttribute('sz')!==String(tablePt*100))errors.push(prefix+'table paragraph end font does not match role');
        {
          // guides/production-guide.md: every content role, every cell.
          for(const c of all(sh,A,'tc'))for(const side of ['marL','marR','marT','marB'])
            {
              const expected=p.strictAnswerColumns&&['marL','marR'].includes(side)
                ?item.rows[0].length>=7?'25400':'38100':'54000';
              if(child(c,A,'tcPr')?.getAttribute(side)!==expected)errors.push(prefix+`table ${side} !=${expected}EMU`);
            }
          const frame=child(child(sh,P,'xfrm'),A,'ext');
          const width=all(sh,A,'gridCol').reduce((n,c)=>n+Number(c.getAttribute('w')),0);
          if(Math.abs(width-Number(frame?.getAttribute('cx')))>7)errors.push(prefix+'table width != column sum');
          const widths=all(sh,A,'gridCol').map(c=>Number(c.getAttribute('w'))/12700);
          for(const row of all(sh,A,'tr')){
            const needed=Math.max(...kids(row,A,'tc').map((c,j)=>require('./tableRowMetrics').cellHeight(c,widths[j],Boolean(p.containedTables)).heightPt));
            if(Number(row.getAttribute('h'))/12700+.1<needed)errors.push(prefix+'table row below measured text height');
          }
          const sum=all(sh,A,'tr').reduce((n,r)=>n+Number(r.getAttribute('h')),0);
          if(Math.abs(sum-Number(frame?.getAttribute('cy')))>7)errors.push(prefix+'table height != row sum');
        }
      } else {
        if ((all(sh, A, "buAutoNum").length ? numberedText(sh) : text(sh)) !== item.text) errors.push(prefix + "text/code mismatch");
        if (item.kind === "source") {
          for (const rp of all(sh, A, "rPr")) if (!["800", "900", "1000"].includes(rp.getAttribute("sz"))) errors.push(prefix + "source font outside 8~10pt");
          for(const rp of all(sh,A,'rPr'))if(child(rp,A,'latin')?.getAttribute('typeface')!=='Consolas'||child(rp,A,'ea')?.getAttribute('typeface')!=='맑은 고딕')errors.push(prefix+'source code font must be Consolas Latin / Malgun Gothic Korean');
        }
        if (["input","gherkin"].includes(item.kind)) {
          for(const rp of all(sh,A,"rPr"))if(rp.getAttribute("sz")!=="1200")errors.push(prefix+"editable input font must be 12pt");
          for(const p of all(sh,A,"p")) {
            const pr=child(p,A,"pPr");
            for(const side of ["spcBef","spcAft"])if(child(child(pr,A,side),A,"spcPts")?.getAttribute("val")!=="300")errors.push(prefix+"editable input paragraph spacing must be 3pt");
          }
        }
        if (["code", "tree"].includes(item.kind)) {
          for (const par of kids(body(sh), A, "p")) {
            const pr = child(par, A, "pPr");
            const tags = children(pr).map((e) => e.localName);
            for (const k of ["spcBef", "spcAft"]) {
              const e = child(pr, A, k);
              const val = e ? child(e, A, "spcPts") : null;
              if (!val || val.getAttribute("val") !== "600") errors.push(prefix + k + " !=6pt");
            }
            if (tags.indexOf("spcBef") > tags.indexOf("spcAft")) errors.push(prefix + "invalid paragraph sequence");
          }
          for (const rp of all(sh, A, "rPr")) if (rp.getAttribute("sz") !== "1000") errors.push(prefix + "code font !=10pt");
        }
      }
    }
    for(const check of p.proseSpacingChecks||[]){
      const par=kids(body(shape(doc,check.id)),A,'p')[check.index],pr=par&&child(par,A,'pPr');
      for(const side of ['spcBef','spcAft']){const gap=pr&&child(pr,A,side),pts=gap&&child(gap,A,'spcPts');if(pts?.getAttribute('val')!==String(check.space*100))errors.push(prefix+'review example paragraph spacing must be 3pt before and after');}
    }
    for(const check of p.codeParagraphChecks||[]){
      const par=kids(body(shape(doc,check.id)),A,'p')[check.index];
      if(!par||paragraph(par)!==check.text){errors.push(prefix+'document code paragraph lost');continue;}
      for(const rp of all(par,A,'rPr'))if(rp.getAttribute('sz')!=='1000'||child(rp,A,'latin')?.getAttribute('typeface')!=='Consolas'||child(rp,A,'ea')?.getAttribute('typeface')!=='맑은 고딕')errors.push(prefix+'document code font must be 10pt Consolas Latin / Malgun Gothic Korean');
    }
    for(const check of p.quoteChecks||[]){
      const par=kids(body(shape(doc,check.id)),A,'p')[check.index];
      if(!par){errors.push(prefix+'quote paragraph missing');continue;}
      let parenDepth=0;
      all(par,A,'r').forEach((r,j)=>{
        const expected=(j<check.koreanRuns?check.koreanSize:check.sourceSize)*100;
        const actual=Number(child(r,A,'rPr')?.getAttribute('sz'));
        const parenthetical=j<check.koreanRuns&&(parenDepth>0||/[()]/.test(r.textContent));
        if(j<check.koreanRuns)parenDepth+=(r.textContent.match(/\(/g)||[]).length-(r.textContent.match(/\)/g)||[]).length;
        if(actual!==expected&&!(parenthetical&&actual===expected-400))errors.push(prefix+'quote font does not match authored role');
      });
      if(!child(child(par,A,'pPr'),A,'buNone'))errors.push(prefix+'quote must not show a bullet');
    }
  }
  for (const c of m.codes) if (c.parts.join("\n") !== c.source) errors.push("Code lost during pagination");
  return { errors, slides: parts.length, blocks, tableLayout, layoutGates, json: () => reportJson(errors, parts.length, blocks) };
}

module.exports = { inspect, reportJson, numberedText, checkLayoutGate };
