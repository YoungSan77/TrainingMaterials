"""Verify the S03 appendix-only table font exception against the prior candidate."""
import zipfile,xml.etree.ElementTree as E,json,pathlib,re,hashlib
N={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
before=zipfile.ZipFile('out/s03-before-table8-20261117.pptx')
after=zipfile.ZipFile('courses/ai-native/sessions/s03.pptx')
slides=sorted([x for x in after.namelist() if re.fullmatch(r'ppt/slides/slide\d+.xml',x)],key=lambda x:int(re.search(r'(\d+)\.xml',x)[1]))
changed=[];tables=[];unchanged=[]
for i,path in enumerate(slides,1):
 old=E.fromstring(before.read(path));new=E.fromstring(after.read(path))
 if before.read(path)==after.read(path):unchanged.append(i)
 else:changed.append(i)
 for gf in new.findall('.//p:graphicFrame',N):
  tbl=gf.find('.//a:tbl',N)
  if tbl is None:continue
  expected=800 if i>=26 else 1000
  cells=tbl.findall('.//a:tc',N);count=0
  for cell in cells:
   for run in cell.findall('.//a:r',N):
    rp=run.find('a:rPr',N)
    assert rp is not None and int(rp.get('sz'))==expected,(i,E.tostring(run))
    if expected==800:
     for face in ['latin','ea','cs']:assert rp.find('a:'+face,N).get('typeface')=='맑은 고딕'
    count+=1
  tables.append({'page':i,'rows':len(tbl.findall('a:tr',N)),'cells':len(cells),'runs':count,'effectivePt':expected/100,'font':'맑은 고딕'})
 # Ignore the target cell text-format attributes only; all surrounding layout and words must match.
 if i>=26:
  for doc in [old,new]:
   for gf in doc.findall('.//p:graphicFrame',N):
    for tag in ['rPr','defRPr','endParaRPr']:
     for rp in gf.findall('.//a:'+tag,N):
      rp.attrib.pop('sz',None)
      for face in ['latin','ea','cs']:
       for f in rp.findall('a:'+face,N):rp.remove(f)
 assert E.tostring(old)==E.tostring(new),('non-font change',i)
 # Response text outside tables remains 10pt (header/footer excluded).
 if i in [17,18,19,26,27,28,29,30]:
  for sp in new.findall('.//p:sp',N):
   off=sp.find('p:spPr/a:xfrm/a:off',N)
   if off is None or int(off.get('y'))<800000 or int(off.get('y'))>6000000:continue
   for rp in sp.findall('.//a:rPr',N):
    if rp.get('sz'):assert rp.get('sz')=='1000',(i,rp.attrib)
assert changed==[28,29],changed
source=pathlib.Path('courses/ai-native/sessions/s03.md').read_text();ex=json.loads(pathlib.Path('courses/ai-native/checks/s03-production-20261117/excerpts.json').read_text())
assert ex['demo']['text'] in source and ex['exercise']['text'] in source
base=pathlib.Path('courses/ai-native/sessions/code/s03/exercise-conversation/production-2026-11-16')
reuse=json.loads(pathlib.Path('courses/ai-native/checks/s03-production-20261117/reuse.json').read_text())
for key,path in [('demo',base/'demo/codex-response-01.md'),('exercise',base/'exercise/codex-response-03.md')]:assert hashlib.sha256(path.read_bytes()).hexdigest()==reuse['hashes'][key]
result={'slides':len(slides),'changedPages':changed,'unchangedPages':unchanged,'tables':tables,'responseText10pt':True,'nonFontChanges':False,'sourceExcerptsAndExecutionPreserved':True}
pathlib.Path('courses/ai-native/checks/s03-production-20261117/table8-verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
print(json.dumps(result,ensure_ascii=False))
