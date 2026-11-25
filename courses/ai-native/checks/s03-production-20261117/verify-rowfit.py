import zipfile,xml.etree.ElementTree as E,json,pathlib,re
N={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
base=pathlib.Path('courses/ai-native/checks/s03-production-20261117')
metrics=json.loads((base/'rowfit-measurements.json').read_text());old=zipfile.ZipFile('out/s03-before-rowfit-20261117.pptx');new=zipfile.ZipFile('courses/ai-native/sessions/s03.pptx')
target=[17,18,20,28,29];report=[];moves=[]
for page in range(1,31):
 name=f'ppt/slides/slide{page}.xml';a=E.fromstring(old.read(name));b=E.fromstring(new.read(name))
 if page not in target:assert old.read(name)==new.read(name),('outside page changed',page);continue
 expected=[t for t in metrics if t['page']==page];ats=a.findall('.//p:graphicFrame',N);bts=b.findall('.//p:graphicFrame',N)
 for idx,(ag,bg,m) in enumerate(zip(ats,bts,expected)):
  before=[int(r.get('h')) for r in ag.findall('.//a:tr',N)];after=[int(r.get('h')) for r in bg.findall('.//a:tr',N)]
  assert before==m['before'];assert after==[r['afterEMU'] for r in m['rows']]
  ext=bg.find('p:xfrm/a:ext',N);assert int(ext.get('cy'))==sum(after)
  report.append({'page':page,'table':idx+1,'beforeRowPt':[round(h/12700,4) for h in before],'afterRowPt':[round(h/12700,4) for h in after],'frameHeightPt':round(int(ext.get('cy'))/12700,4),'frameEqualsRowSum':True})
  for d in [ag,bg]:
   for r in d.findall('.//a:tr',N):r.attrib.pop('h')
   d.find('p:xfrm/a:ext',N).attrib.pop('cy')
 for asp,bsp in zip(a.findall('.//p:sp',N),b.findall('.//p:sp',N)):
  ao=asp.find('p:spPr/a:xfrm/a:off',N);bo=bsp.find('p:spPr/a:xfrm/a:off',N)
  if ao is not None and bo is not None and ao.get('y')!=bo.get('y'):
   delta=sum(sum(m['before'])-sum(r['afterEMU'] for r in m['rows']) for m in expected if m['x']==int(ao.get('x')) and m['y']<int(ao.get('y')))
   assert int(ao.get('y'))-int(bo.get('y'))==delta
   moves.append({'page':page,'text':''.join(t.text or '' for t in bsp.findall('.//a:t',N))[:60],'upPt':delta/12700})
   ao.attrib.pop('y');bo.attrib.pop('y')
 assert E.tostring(a)==E.tostring(b),('non-height/layout change',page)
result={'pages':30,'changedPages':target,'tables':report,'followingTextMoves':moves,'contentsWidthsFontsMarginsAndOutsideSlidesPreserved':True}
(base/'rowfit-verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps(result,ensure_ascii=False))
