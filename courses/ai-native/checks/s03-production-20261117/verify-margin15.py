import zipfile,xml.etree.ElementTree as E,json,pathlib,re
N={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
old=zipfile.ZipFile('out/s03-before-margin15-20261117.pptx');new=zipfile.ZipFile('courses/ai-native/sessions/s03.pptx')
changed=[];checks=[]
for i in range(1,31):
 path=f'ppt/slides/slide{i}.xml';a=E.fromstring(old.read(path));b=E.fromstring(new.read(path))
 if old.read(path)!=new.read(path):changed.append(i)
 if i in [28,29]:
  before=a.findall('.//a:tc',N);after=b.findall('.//a:tc',N)
  assert len(before)==len(after)
  for x,y in zip(before,after):
   xp=x.find('a:tcPr',N);yp=y.find('a:tcPr',N)
   assert yp.get('marT')==yp.get('marB')=='54000'
   for k in ['marL','marR']:assert xp.get(k)==yp.get(k)
   for r in y.findall('.//a:rPr',N):
    assert r.get('sz')=='800'
    for f in ['latin','ea','cs']:assert r.find('a:'+f,N).get('typeface')=='맑은 고딕'
   xp.attrib.pop('marT',None);xp.attrib.pop('marB',None)
   yp.attrib.pop('marT',None);yp.attrib.pop('marB',None)
  checks.append({'page':i,'cells':len(after),'effectivePt':8,'marT':54000,'marB':54000,'horizontalMarginsPreserved':True})
 assert E.tostring(a)==E.tostring(b),('change outside target vertical margins',i)
assert changed==[28,29]
q=json.loads(pathlib.Path('courses/ai-native/sessions/s03.qa.json').read_text())
result={'slides':30,'changedPages':changed,'tables':checks,'otherSlideXMLPreserved':True,'contentOrderAndJudgmentPreserved':True,'errors':q['errors'],'warnings':len(q['warnings']),'referenceComparison':'s03(10).pptx not present in accessible repository'}
pathlib.Path('courses/ai-native/checks/s03-production-20261117/margin15-verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
print(json.dumps(result,ensure_ascii=False))
