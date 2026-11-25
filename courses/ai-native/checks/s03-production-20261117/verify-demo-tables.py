import zipfile,xml.etree.ElementTree as E,json,pathlib
N={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
old=zipfile.ZipFile('out/s03-before-demo-table8-20261117.pptx');new=zipfile.ZipFile('courses/ai-native/sessions/s03.pptx')
target=[17,18,20,28,29];changed=[];pages=[]
for i in range(1,31):
 name=f'ppt/slides/slide{i}.xml';a=E.fromstring(old.read(name));b=E.fromstring(new.read(name))
 if old.read(name)!=new.read(name):changed.append(i)
 if i in target:
  ac=a.findall('.//a:tc',N);bc=b.findall('.//a:tc',N);assert len(ac)==len(bc)
  rowHeights=[int(r.get('h')) for r in b.findall('.//a:tr',N)]
  spacing=[]
  for x,y in zip(ac,bc):
   xp=x.find('a:tcPr',N);yp=y.find('a:tcPr',N)
   assert yp.get('marT')==yp.get('marB')=='54000'
   for k in ['marL','marR']:assert xp.get(k)==yp.get(k)
   for rp in y.findall('.//a:rPr',N):
    assert rp.get('sz')=='800'
    for face in ['latin','ea','cs']:assert rp.find('a:'+face,N).get('typeface')=='맑은 고딕'
   for pr in y.findall('.//a:pPr',N):spacing.append({k:E.tostring(pr.find('a:'+k,N),encoding='unicode') if pr.find('a:'+k,N) is not None else 'inherited' for k in ['spcBef','spcAft']})
  pages.append({'page':i,'tables':len(b.findall('.//a:tbl',N)),'cells':len(bc),'fontPt':8,'marT':54000,'marB':54000,'rowHeightsEMU':rowHeights,'paragraphSpacing':spacing})
  # Only target table font/margins and judgment explanation size may change.
  for doc in [a,b]:
   for gf in doc.findall('.//p:graphicFrame',N):
    for pr in gf.findall('.//a:tcPr',N):
     for k in ['marT','marB']:pr.attrib.pop(k,None)
    for tag in ['rPr','defRPr','endParaRPr']:
     for rp in gf.findall('.//a:'+tag,N):
      rp.attrib.pop('sz',None)
      for face in ['latin','ea','cs']:
       for f in rp.findall('a:'+face,N):rp.remove(f)
   if i==20:
    for sp in doc.findall('.//p:sp',N):
     ident=sp.find('p:nvSpPr/p:cNvPr',N).get('id')
     if ident not in ['2','5','6','7','8']:
      for rp in sp.findall('.//a:rPr',N):
       if doc is b:assert rp.get('sz')=='1000'
       rp.attrib.pop('sz',None)
 assert E.tostring(a)==E.tostring(b),('unauthorized XML change',i)
assert changed==[17,18,20],changed
result={'slides':30,'changedPages':changed,'verifiedTargetPages':pages,'contentOrderJudgmentAndOtherSlidesPreserved':True,'referenceComparison':'Attachment s03(20261116-231043).pptx not available in repository'}
pathlib.Path('courses/ai-native/checks/s03-production-20261117/demo-tables-verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps({**result,'verifiedTargetPages':[{k:v for k,v in p.items() if k!='paragraphSpacing'} for p in pages]},ensure_ascii=False))
