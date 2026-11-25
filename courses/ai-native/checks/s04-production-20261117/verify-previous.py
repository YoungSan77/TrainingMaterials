from pathlib import Path
import json,re,hashlib
root=Path('courses/ai-native/checks/s04-production-20261117')
base=Path('courses/ai-native/sessions/code/s04/exercise-conversation/order')
md=Path('courses/ai-native/sessions/s04.md').read_text()
norm=lambda s:re.sub(r'\s+','',s)
records=[]
for i in range(1,6):
    files={kind:base/f'{prefix}-{i:02}.{ext}' for kind,prefix,ext in [('prompt','prompt','txt'),('input','codex-input','txt'),('response','codex-response','md'),('metadata','codex-metadata','json')]}
    contents={k:p.read_text() for k,p in files.items()}
    records.append({'turn':i,'files':{k:{'path':str(p),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for k,p in files.items()},'promptInInput':contents['prompt'] in contents['input'],'metadata':json.loads(contents['metadata'])})
oldFirst=(base/'codex-response-01.md').read_text()
excerpt=md.split('## 이전 실행의 첫 응답\n')[1].split('**강사 노트**')[0]
excerpt=re.sub(r'^\*\*(기록 그대로|문서 형식 — 10pt)\*\*\s*','',excerpt,flags=re.M)
parts=[norm(p) for p in re.split(r'\n\s*\n',excerpt) if p.strip() and not re.fullmatch(r'[.\s]+',p)]
parts=[re.sub(r'^#+','',p) for p in parts]
source=norm(re.sub(r'^#+\s*','',oldFirst,flags=re.M));pos=0;issues=[]
for part in parts:
    at=source.find(part,pos)
    if at<0:issues.append(part)
    else:pos=at+len(part)
result={'records':records,'inputEqualsApproved':(base/'input-s03.md').read_bytes()==(root/'s03-approved/주문한다-요구사항-정의서.md').read_bytes(),'finalEqualsResponse':(base/'주문한다-정적모델.md').read_bytes()==(base/'codex-response-05.md').read_bytes(),'firstExcerptSequenceIssues':issues,'correctedOmission':'Added ..... after the first two relationship bullets; original omitted third Product relationship is not rewritten. Original source snapshot retained.','currentPromptEqualsPrevious':False,'reuseDecision':'NOT REUSED: approved S03 input and current prompt differ. Preserved as prior execution.'}
(root/'previous-verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps({k:v for k,v in result.items() if k!='records'},ensure_ascii=False,indent=2))
