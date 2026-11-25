import zipfile,xml.etree.ElementTree as E,json,pathlib,re
N={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
old=zipfile.ZipFile('out/s03-natural-before.pptx');new=zipfile.ZipFile('courses/ai-native/sessions/s03.pptx');pages=[p for p in E.parse('out/s03-natural-bbox.html').iter() if p.tag.endswith('}page')];out=[]
for page in range(1,31):
 name=f'ppt/slides/slide{page}.xml';a=E.fromstring(old.read(name));b=E.fromstring(new.read(name))
 if page not in [3,6,7,8,9,12,13,14,15,21,23]:assert old.read(name)==new.read(name);continue
 ag=a.findall('.//p:graphicFrame',N)[0];bg=b.findall('.//p:graphicFrame',N)[0]
 widths=[int(c.get('w')) for c in bg.findall('.//a:gridCol',N)];assert sum(widths)==int(bg.find('p:xfrm/a:ext',N).get('cx'))
 for pr in bg.findall('.//a:tcPr',N):
  for k in ['marL','marR','marT','marB']:assert pr.get(k)=='5400'
 y=int(bg.find('p:xfrm/a:off',N).get('y'))/12700;x0=int(bg.find('p:xfrm/a:off',N).get('x'))/12700;words=[w for w in pages[page-1].iter() if w.tag.endswith('}word')]
 for row in bg.findall('.//a:tr',N):
  x=x0;h=int(row.get('h'))/12700
  for c,w in zip(row.findall('a:tc',N),widths):
   ws=sorted([v for v in words if x<=(float(v.get('xMin'))+float(v.get('xMax')))/2<x+w/12700 and y<=(float(v.get('yMin'))+float(v.get('yMax')))/2<y+h],key=lambda v:(round(float(v.get('yMin')),1),float(v.get('xMin'))))
   assert len(set(round(float(v.get('yMin')),1) for v in ws))<=1,(page,'unexpected wrap')
   x+=w/12700
  rw=sorted([v for v in words if x0<=(float(v.get('xMin'))+float(v.get('xMax')))/2<x0+sum(widths)/12700 and y<=(float(v.get('yMin'))+float(v.get('yMax')))/2<y+h],key=lambda v:float(v.get('xMin')))
  norm=lambda t:re.sub(r'\s+','',t)
  assert norm(''.join(v.text or '' for v in rw))==norm(''.join(t.text or '' for t in row.findall('.//a:t',N))),(page,'row text')
  y+=h
 out.append({'page':page,'beforePt':int(ag.find('p:xfrm/a:ext',N).get('cx'))/12700,'afterPt':sum(widths)/12700})
pathlib.Path('courses/ai-native/checks/s03-natural-tables-20261117.json').write_text(json.dumps(out,indent=2));print(json.dumps(out))
