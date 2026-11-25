from pathlib import Path
import re,json,hashlib,datetime
root=Path('courses/ai-native/checks/s04-production-20261117')
base=Path('courses/ai-native/sessions/code/s04/exercise-conversation/production-2026-11-17')
md=Path('courses/ai-native/sessions/s04.md').read_text()
response=(base/'codex-response-02.md').read_text()
model=(base/'주문한다-정적모델.md').read_bytes()
appendix=md.split('## 별첨. 실습 답\n',1)[1].split('**강사 노트**',1)[0]
def normalize(s):
    s=re.sub(r'^\*\*(실제 LLM 응답|문서 형식 — 10pt|페이지 분할)\*\*\s*','',s,flags=re.M)
    s=re.sub(r'^#+\s*','',s,flags=re.M)
    return re.sub(r'\s+','',s)
same=normalize(appendix)==normalize(response)
input_equal=(base/'input-s03.md').read_bytes()==(root/'s03-approved/주문한다-요구사항-정의서.md').read_bytes()
metas=[json.loads((base/f'codex-metadata-{i:02}.json').read_text()) for i in [1,2]]
dt=datetime.datetime.fromisoformat
saved=datetime.datetime.fromtimestamp((base/'주문한다-정적모델.md').stat().st_mtime,datetime.timezone(datetime.timedelta(hours=9))).isoformat()
previous=root/'exercise-verification.json'
checked=json.loads(previous.read_text())['handoffCheckedAt'] if previous.exists() else datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).isoformat()
stages=[{'stage':'초안','budgetSeconds':300,'start':metas[0]['started'],'end':metas[0]['finished']},
        {'stage':'근거 대조와 후속 요청 작성','budgetSeconds':540,'start':metas[0]['finished'],'end':metas[1]['started']},
        {'stage':'수정 응답 생성','budgetSeconds':420,'start':metas[1]['started'],'end':metas[1]['finished']},
        {'stage':'최종 저장과 두 MD 인계 확인','budgetSeconds':240,'start':metas[1]['finished'],'end':checked}]
for s in stages:s['elapsedSeconds']=(dt(s['end'])-dt(s['start'])).total_seconds()
checks={
'inputApprovedBytes':input_equal,'modelEqualsResponseBytes':model==(base/'codex-response-02.md').read_bytes(),
'appendixCompleteOrderWordsEmphasis':same,
'sourceMainBodyUnchangedExceptRecordedOmission':md.split('## 별첨. 실습 답')[0].replace('- 각 `OrderItem`은 정확히 하나의 `Product`를 참조한다.\n\n.....\n\n','- 각 `OrderItem`은 정확히 하나의 `Product`를 참조한다.\n')==(root/'source-before.md').read_text().split('## 별첨. 실습 답')[0],
'conceptsAndAttributes':all(s in response for s in ['Order','OrderItem','Product','unitPrice','salePrice','shippingAddress']),
'bothEndsMultiplicity':all(s in response for s in ['Order "1" -- "1..*" OrderItem','Product "1" -- "0..*" OrderItem']),
'amountAndRepresentativeOrder':all(s in response for s in ['ORD-예시-A','PENDING_PAYMENT','PAID','1,200원','1,000원','2,000원']),
'fourAcceptanceCases':all(s in response for s in ['정상 승인','가격 변경 후 승인','카드 거절','거절 후 재결제']),
'unresolvedFollowUpPolicies':all(s in response for s in ['불확정 결과가 있는 동안 재결제를 허용하는가?','배송 요청 실패 시 재시도하는가?','최종적으로 어떻게 처리하는가?']),
'diagramOriginal':re.findall(r'```mermaid\n(.*?)```',appendix,re.S)==re.findall(r'```mermaid\n(.*?)```',response,re.S)}
events=[]
for i in [1,2]:
    ev=[json.loads(line) for line in (base/f'codex-events-{i:02}.jsonl').read_text().splitlines() if line.strip()]
    events.append({'turn':i,'returncode':metas[i-1]['returncode'],'toolItems':[e for e in ev if isinstance(e.get('item'),dict) and e['item'].get('type') not in ['agent_message','reasoning']]})
result={'checks':checks,'stages':stages,'totalSeconds':sum(s['elapsedSeconds'] for s in stages),'handoff':'PASS for the two-file input, not Human content approval','events':events,'responseSHA256':hashlib.sha256(model).hexdigest(),'savedAt':saved,'handoffCheckedAt':checked,'scope':'Timing includes intervening source import and production coordination before this check, excludes subsequent final render QA. No commit performed by user instruction.'}
(root/'exercise-verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps(result,ensure_ascii=False,indent=2))
