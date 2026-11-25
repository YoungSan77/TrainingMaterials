from pathlib import Path
import subprocess, hashlib, json, datetime

root = Path.cwd()
out = root / 'courses/ai-native/checks/s04-production-20261117'
base = root / 'courses/ai-native/sessions/code/s04/exercise-conversation/production-2026-11-17'
out.mkdir(parents=True, exist_ok=True)
base.mkdir(parents=True, exist_ok=True)
commit = '038cb6ffb291d741e643425ea19bf75f0ccf2c75'
paths = ['courses/ai-native/sessions/s03.' + ext for ext in ['md','pptx','qa.json']]
paths += ['courses/ai-native/sessions/code/s03/exercise-conversation/production-2026-11-16/README.md', 'courses/ai-native/sessions/code/s03/exercise-conversation/production-2026-11-16/exercise/주문한다-요구사항-정의서.md']
records=[]
for p in paths:
    data=subprocess.check_output(['git','show',f'{commit}:{p}'])
    target=out/'s03-approved'/Path(p).name
    target.parent.mkdir(parents=True,exist_ok=True)
    target.write_bytes(data)
    records.append({'path':p,'sha256':hashlib.sha256(data).hexdigest(),'worktree_equal':(root/p).read_bytes()==data})
source=(out/'s03-approved/주문한다-요구사항-정의서.md').read_bytes()
(base/'input-s03.md').write_bytes(source)
md=(root/'courses/ai-native/sessions/s04.md').read_text()
prompt=md.split('  + ① ')[1].split('\n')[0]
(base/'prompt-01.txt').write_text(prompt+'\n\n[실습 3의 최종 정의서 — 승인 커밋 '+commit+']\n'+source.decode())
tracked=subprocess.check_output(['git','ls-files','-z']).decode().split('\0')
hashes={p:hashlib.sha256((root/p).read_bytes()).hexdigest() for p in tracked if p and (root/p).is_file() and not p.startswith('references/')}
(out/'start.json').write_text(json.dumps({'started':datetime.datetime.now().astimezone().isoformat(),'branch':subprocess.check_output(['git','branch','--show-current']).decode().strip(),'status':subprocess.check_output(['git','status','--short']).decode(),'hashes':hashes,'approved_s03':records,'old_s04_input_equal':(root/'courses/ai-native/sessions/code/s04/exercise-conversation/order/input-s03.md').read_bytes()==source},ensure_ascii=False,indent=2))
print(json.dumps(records,ensure_ascii=False,indent=2))
