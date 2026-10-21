from pathlib import Path
import subprocess,sys,json,datetime
base=Path(__file__).resolve().parent
turn=sys.argv[1]
prompt=(base/f'prompt-{turn}.txt').read_text()
if turn!='01':
 messages=[]
 for previous in range(1,int(turn)):
  tag=f'{previous:02}'
  messages.extend(['[사용자]',(base/f'prompt-{tag}.txt').read_text(),'[Codex 실제 응답]',(base/f'codex-response-{tag}.md').read_text()])
 if turn=='05':
  for round_dir in sorted((base/'finalization-rounds').glob('*')):
   if round_dir.is_dir():messages.extend(['[사용자 — 이전 MD 생성 요청]',(round_dir/'prompt-05.txt').read_text(),'[Codex 실제 응답 — 검토할 MD]',(round_dir/'codex-response-05.md').read_text()])
 messages.extend(['[사용자 — 이번 피드백]',prompt])
 prompt='다음 실제 대화를 이어서 마지막 사용자 메시지에 답하라.'+chr(10)+chr(10)+chr(10).join(messages)
# CLI harness saves the response as the requested MD file; no workspace write is needed.
prompt='[실행 환경] 이 실행기는 최종 응답을 Markdown 파일로 직접 저장한다. 별도 도구 호출·파일 탐색·파일 쓰기를 하지 마라. 응답에는 요청된 완성된 Markdown 문서 본문 전체만 출력하고 생성 안내나 파일 링크는 붙이지 마라.\n\n'+prompt
args=['codex','exec','--ignore-user-config','--ephemeral','--sandbox','read-only','--skip-git-repo-check','--config','project_doc_max_bytes=0','--json','--output-last-message',str(base/f'codex-response-{turn}.md'),'-']
started=datetime.datetime.now().astimezone().isoformat()
(base/f'codex-input-{turn}.txt').write_text(prompt)
with (base/f'codex-events-{turn}.jsonl').open('w') as stdout, (base/f'codex-stderr-{turn}.txt').open('w') as stderr:
 r=subprocess.run(args,input=prompt,text=True,stdout=stdout,stderr=stderr,timeout=360)
(base/f'codex-metadata-{turn}.json').write_text(json.dumps({'started':started,'finished':datetime.datetime.now().astimezone().isoformat(),'command':args,'returncode':r.returncode},ensure_ascii=False,indent=2)+'\n')
if r.returncode: raise SystemExit(f'Codex CLI failed ({r.returncode}); saved error log')
print('완료: '+str(base/f'codex-response-{turn}.md'))
