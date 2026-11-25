'use strict';
const fs=require('fs'),assert=require('assert/strict');
const root='courses/ai-native/checks/s03-warning-links-20261117',source=fs.readFileSync('courses/ai-native/sessions/s03.md','utf8'),lines=source.split('\n');
const before=JSON.parse(fs.readFileSync(root+'/before.qa.json'));
const proposals={
26:'**요구사항 분석**은 시스템이 해야 할 일과 결과를 받아들일 기준을 **합의**하는 활동이다.',
52:'**주문**은 언제 생성하는가? **주문 금액**은 언제 확정하는가?',
54:'배송 시작은 배송 시스템에 **요청**하는 것인가, **실제 배송이 시작**되는 것인가?',
58:'**펜 2개(각 1,000원)**를 주문하고 배송지를 **서울**로 지정한 사례다.',
73:'**주문 생성 시점**, **금액 확정 시점**, 결제 거절 뒤의 상태, 배송 요청 조건에 따라 **구현 결과**가 달라진다.',
123:'요구사항은 시스템이 준수해야 할 **역량과 조건**을 표현한다, "Requirements are capabilities and conditions to which the system … must conform", [Larman 2004]',
134:'요구사항은 이해관계자가 **같은 뜻**으로 이해할 수 있고, 충족 여부를 **객관적으로 확인**할 수 있어야 한다. 한 문장에는 **독립적으로 판정할 수 있는 요구사항 하나**를 담는다.',
205:'‘주문한다’는 **고객 가치 단위**다. 결제 연동과 주문 기록은 **구현 기술 작업**이다.',
326:'같은 동시 요청 수와 외부 시스템 응답 조건에서 **API의 요청 수신부터 응답까지** 걸린 시간을 측정한다.',
344:'단일 스토리의 **작업 범위와 완료 조건**이 이미 명확하면 **별도 문서를 생략**할 수 있다.',
371:'기존 **요구사항과 검사**로 **변경 위험**을 통제할 수 있으면 그 자료를 활용한다.',
609:'**명세 주도 개발(SDD)**은 확정된 요구사항·업무 규칙·설계 제약·수용 기준을 **AI의 작업에 전달**하고, 결과를 **그 기준으로 검사**하는 접근 방식이다.',
632:'불일치가 생기면 **규칙 누락**, **전달 부족**, **구현 오류** 중 원인을 확인한다.',
633:'작은 변경은 **기존 요구사항과 테스트**를 **직접 참조**해도 된다.',
663:'주문 스토리 하나의 **요구사항과 수용 기준**을 AI와 함께 작성한다.',
671:'초안의 **누락·충돌**을 묻고, **확인된 답만 반영**한다.',
672:'**품질 시험 조건**은 강사가 **후속 대화**에서 제공한다.',
707:'**고객의 목적**에서 시스템의 **기능·업무 규칙·품질 조건**을 확인한다.',
708:'**사용자 스토리**로 대화하고 **구체적인 사례**로 **수용 기준**을 합의한다.',
709:'**승인·가격 변경·거절·재결제**를 확인하고, **모르는 정책**은 질문으로 남긴다.'};
const used=new Map(),entries=[];
for(const [i,warning]of before.warnings.entries()){
 const m=warning.match(/: "(.+?)"의 "(.*)"$/),topic=m?.[1]||'16. 요약',snippet=m?.[2]||'';
 let line=717;
 if(snippet){const matching=lines.flatMap((l,n)=>(!warning.startsWith('표 셀')||l.trimStart().startsWith('|'))&&l.replace(/`/g,'').includes(snippet.replace(/`/g,''))?[n+1]:[]);const key=topic+'|'+snippet,n=used.get(key)||0;used.set(key,n+1);assert.ok(matching.length,warning);line=matching[Math.min(n,matching.length-1)];}
 const original=lines[line-1];let category,reason,action,rule,proposal=null;
 if(warning.startsWith('표 셀')){category='검사 오탐';rule='wrappingCells';reason='일반 10pt/한 줄 추정과 달리 S03은 해당 시연·판단표·별첨 표를 8pt·실측 가변 행 높이로 표시한다. 직전 최종 PDF 254셀 전수 검사는 누락·행 밖 넘침 0이었다.';action='같은 profile·topic·표의 모든 행이 실제 생성 manifest의 8pt 표와 대응할 때만 한 줄 경고 제외. 다른 표·누락 행·10pt 표는 유지.';}
 else if(warning.startsWith('묶음')){category='실행 원문 보존과 충돌';rule='flatGroupItems';reason='실제 응답의 무글머리표 목록 소개 문단이다. 지침의 일반 저작 목록 규칙은 대표 응답의 문구·강조·구조 보존과 충돌한다. 머리말에 새 글머리표를 붙이는 수정은 원문 표시를 바꾼다.';action='원문·검사 모두 유지. 해당 5건은 잔여 QA에 명시; 일반 topic 전체를 제외하지 않음.';}
 else if(warning.startsWith('요약')){category='실제 원고 결함';rule='missingModelUpdate';reason='요약 노트는 현재 판매가·확정 금액과 미정 유지 원칙을 설명하지만 이 세션에서 보완된 모델을 명시하지 않는다. 자동 검사에 필요한 의미와 표식이 실제로 없다.';proposal='모델에서 보완된 것 — ‘주문한다’ 스토리의 요구사항 정의서·수용 기준과 첫 용어를 기록하고, 배송 요청 실패 정책은 미정으로 남겼다.';action='원고 수정안만 제시. 승인 원고 미수정.';}
 else if([667,691].includes(line)){category='검사 오탐';rule='unboldedText';reason='실습 번호·파일명만의 투입물 명사 목록 또는 파일명→다음 실습 입력 연결이며 저자의 주장 문장이 아니다. 짧은 명사 목록 예외에 해당한다.';action='닫힌 파일명 나열·입출력 연결 형식만 검사에서 제외. 뒤에 수행 지시가 붙으면 계속 경고.';}
 else if([676,680].includes(line)){category='실행 원문 보존과 충돌';rule='unboldedText';reason='저장 실행과 일치하는 실습 첫/최종 요청이다. 프롬프트 원문에는 강조 표식이 없으며 꾸미기 위해 기록을 고치지 않는다.';action='원문·경고 유지. 실제 입력과의 대조 증거로 구분하고 실습 topic 전체 제외는 하지 않음.';}
 else {category='실제 원고 결함';rule='unboldedText';reason=line===123?'정의 인용의 한국어 영역에도 판단 핵심어 강조를 둘 수 있으며 지침의 인용 예시도 이를 사용한다. 영어 원문은 그대로 두어야 한다.':'저자가 쓴 lead·설명·질문·요약 문장인데 판단 핵심어 강조가 없다. 실습 프롬프트·경로·실행 응답의 예외가 아니다.';proposal=proposals[line];assert.ok(proposal,warning+' @'+line);action='의미·문구를 보존한 강조 수정안만 제시. 승인 원고 미수정.';}
 const cell=m&&rule==='wrappingCells'?original.split('|').findIndex(c=>c.replace(/`/g,'').includes(snippet.replace(/`/g,''))):null;
 entries.push({id:i+1,warning,rule,ruleFile:'engine/production/src/structure.js',source:'courses/ai-native/sessions/s03.md',line,topic,tableColumn:cell,original,category,reason,action,proposal});
}
const counts={'실제 원고 결함':0,'검사 오탐':0,'실행 원문 보존과 충돌':0,'추가 확인 필요':0};for(const e of entries)counts[e.category]++;
assert.equal(entries.length,51);assert.deepEqual(Object.values(counts),[21,23,7,0]);
const groups=Object.values(entries.reduce((out,e)=>{const k=e.category+' / '+e.rule;out[k]??={category:e.category,rule:e.rule,count:0,ids:[],lines:[]};out[k].count++;out[k].ids.push(e.id);if(!out[k].lines.includes(e.line))out[k].lines.push(e.line);return out;},{}));
fs.writeFileSync(root+'/warning-audit.json',JSON.stringify({initialWarnings:51,counts,groups,entries},null,2));
let md='# 기존 QA 경고 51개 전수 분류\n\n원고는 수정하지 않았다. 원본 QA는 `before.qa.json`, 개별 판정은 `warning-audit.json`에 있다.\n\n| 분류 | 건수 | 처리 |\n|---|---:|---|\n';
for(const [c,n]of Object.entries(counts))md+=`| ${c} | ${n} | ${c==='검사 오탐'?'재현 후 검사 조건을 한정해 수정':c==='실제 원고 결함'?'해당 문장·수정안 보고':c==='실행 원문 보존과 충돌'?'원문·경고 유지':'해당 없음'} |\n`;
md+='\n검사 근거: 공통 SA 「강조(bold)」「6. 표와 목록」「실제 응답 원문 보존」, Production 「표의 행 높이와 열 너비」, 과정별 제작 기준 「S03 8pt 표 행 높이」. 인용문 자체는 강조의 일괄 예외가 아니다.\n';
md+='\n| 같은 원인의 묶음 | 건수 | 원고 행 번호 |\n|---|---:|---|\n';for(const g of groups)md+=`| ${g.category} / ${g.rule} | ${g.count} | ${g.lines.join(', ')} |\n`;
for(const e of entries){md+=`\n## W${String(e.id).padStart(2,'0')} · ${e.category}\n\n- 위치: \`${e.source}:${e.line}\`, ${e.topic}${e.tableColumn?`, 표 ${e.tableColumn}열`:''}\n- 규칙: \`${e.ruleFile}\`의 \`${e.rule}\`\n- 경고: ${e.warning}\n- 원고: ${e.original}\n- 판정 근거: ${e.reason}\n- 처리: ${e.action}\n`;if(e.proposal)md+=`- 수정안(미반영): ${e.proposal}\n`;}
fs.writeFileSync(root+'/warning-audit.md',md);console.log(JSON.stringify({counts,total:entries.length}));
