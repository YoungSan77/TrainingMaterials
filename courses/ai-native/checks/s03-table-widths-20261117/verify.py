import zipfile,xml.etree.ElementTree as E,json,pathlib,re,hashlib
base=pathlib.Path('courses/ai-native/checks/s03-table-widths-20261117');N={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
old=zipfile.ZipFile('out/s03-widths-20261117/before.pptx');new=zipfile.ZipFile('courses/ai-native/sessions/s03.pptx')
def pdfpages(path):return [p for p in E.parse(path).iter() if p.tag.endswith('}page')]
beforePDF=pdfpages('out/s03-widths-20261117/before-bbox.html');afterPDF=pdfpages('out/s03-widths-20261117/final-bbox.html')
assert len(afterPDF)==30
def cellwords(gf,pdf):
 words=[w for w in pdf.iter() if w.tag.endswith('}word')];off=gf.find('p:xfrm/a:off',N);y=int(off.get('y'))/12700;x0=int(off.get('x'))/12700;widths=[int(c.get('w'))/12700 for c in gf.findall('.//a:gridCol',N)];result=[]
 for row in gf.findall('.//a:tr',N):
  x=x0;h=int(row.get('h'))/12700;rr=[]
  for c,w in zip(row.findall('a:tc',N),widths):
   ws=sorted([v for v in words if x<=(float(v.get('xMin'))+float(v.get('xMax')))/2<x+w and y<=(float(v.get('yMin'))+float(v.get('yMax')))/2<y+h],key=lambda v:(round(float(v.get('yMin')),1),float(v.get('xMin'))))
   expected=''.join(t.text or '' for t in c.findall('.//a:t',N));actual=''.join(v.text or '' for v in ws);norm=lambda t:re.sub(r'\s+','',t)
   assert norm(expected)==norm(actual),(expected,actual)
   assert all(y-.01<=float(v.get('yMin')) and float(v.get('yMax'))<=y+h+.01 for v in ws)
   rr.append({'text':expected,'lines':len(set(round(float(v.get('yMin')),1) for v in ws)),'words':[v.text for v in ws]});x+=w
  result.append(rr);y+=h
 return result
changed=[];tables=[];cells=0;tablecount=0
for page in range(1,31):
 name=f'ppt/slides/slide{page}.xml';a=E.fromstring(old.read(name));b=E.fromstring(new.read(name))
 if old.read(name)!=new.read(name):changed.append(page)
 assert ''.join(t.text or '' for t in a.findall('.//a:t',N))==''.join(t.text or '' for t in b.findall('.//a:t',N))
 for ti,(ag,bg) in enumerate(zip(a.findall('.//p:graphicFrame',N),b.findall('.//p:graphicFrame',N))):
  tablecount+=1;aw=[int(c.get('w')) for c in ag.findall('.//a:gridCol',N)];bw=[int(c.get('w')) for c in bg.findall('.//a:gridCol',N)]
  assert sum(aw)==sum(bw)
  assert ag.find('p:xfrm/a:ext',N).get('cx')==bg.find('p:xfrm/a:ext',N).get('cx')
  assert abs(sum(bw)-int(bg.find('p:xfrm/a:ext',N).get('cx')))<=len(bw)
  ar=[int(r.get('h')) for r in ag.findall('.//a:tr',N)];br=[int(r.get('h')) for r in bg.findall('.//a:tr',N)]
  assert sum(br)==int(bg.find('p:xfrm/a:ext',N).get('cy'))
  oldWords=cellwords(ag,beforePDF[page-1]);newWords=cellwords(bg,afterPDF[page-1]);cells+=sum(len(r) for r in newWords)
  if aw!=bw:
   tables.append({'page':page,'table':ti+1,'beforePt':[round(w/12700,3) for w in aw],'afterPt':[round(w/12700,3) for w in bw],'beforeLines':[[c['lines'] for c in r] for r in oldWords],'afterLines':[[c['lines'] for c in r] for r in newWords],'beforeHeightPt':sum(ar)/12700,'afterHeightPt':sum(br)/12700})
  # Fonts, actual cell margins, text and alignment are byte-for-byte preserved.
  assert [E.tostring(c) for c in ag.findall('.//a:tc',N)]==[E.tostring(c) for c in bg.findall('.//a:tc',N)]
  if page in [17,18,20,28,29]:
   for pr in bg.findall('.//a:tcPr',N):assert pr.get('marT')==pr.get('marB')=='54000'
   for rp in bg.findall('.//a:rPr',N):assert rp.get('sz')=='800'
  if page in [28,29]:
   for r in newWords:
    for c in r:
     if 'PENDING_PAYMENT' in c['text']:assert any('PENDING_PAYMENT' in w for w in c['words']),c
  for gf in [ag,bg]:
   for c in gf.findall('.//a:gridCol',N):c.attrib.pop('w')
   for r in gf.findall('.//a:tr',N):r.attrib.pop('h')
   gf.find('p:xfrm/a:ext',N).attrib.pop('cy')
 assert E.tostring(a)==E.tostring(b),('change outside table widths/heights',page)
assert changed==[20,28,29],changed
source=pathlib.Path('courses/ai-native/sessions/s03.md').read_bytes();assert source==pathlib.Path('out/s03-widths-20261117/source.md').read_bytes()
execution=json.loads(pathlib.Path('courses/ai-native/checks/s03-production-or-20261117/execution-verification.json').read_text());assert hashlib.sha256(source).hexdigest()==execution['sourceSHA256']
for event in execution['events']:
 p=pathlib.Path('courses/ai-native/sessions/code/s03/exercise-conversation/production-2026-11-16')/event['kind']/('codex-response-'+event['turn']+'.md');assert hashlib.sha256(p.read_bytes()).hexdigest()==event['sha256']
q=json.loads(pathlib.Path('courses/ai-native/sessions/s03.qa.json').read_text())
result={'slides':30,'changedPages':changed,'reviewedTables':tablecount,'verifiedRenderedCells':cells,'tables':tables,'allTextFontsMarginsPreserved':True,'outsideSlidesPreserved':True,'identifiersUnbroken':True,'sourceAndExecutionsPreserved':True,'errors':q['errors'],'warnings':len(q['warnings'])}
(base/'verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps(result,ensure_ascii=False))
