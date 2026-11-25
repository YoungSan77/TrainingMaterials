import zipfile,xml.etree.ElementTree as E,pathlib,json,re
N={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
old=zipfile.ZipFile('out/s03-cm-before.pptx');new=zipfile.ZipFile('courses/ai-native/sessions/s03.pptx');target=[3,6,7,8,9,12,13,14,15,21,23];tables=[];cells=0
pages=[p for p in E.parse('out/s03-cm-bbox.html').iter() if p.tag.endswith('}page')]
for i in range(1,31):
 name=f'ppt/slides/slide{i}.xml';a=E.fromstring(old.read(name));b=E.fromstring(new.read(name))
 if i not in target:assert old.read(name)==new.read(name),i;continue
 ag=a.findall('.//p:graphicFrame',N)[0];bg=b.findall('.//p:graphicFrame',N)[0];widths=[int(c.get('w')) for c in bg.findall('.//a:gridCol',N)]
 assert sum(widths)==int(bg.find('p:xfrm/a:ext',N).get('cx'))
 for x,y in zip(ag.findall('.//a:tc',N),bg.findall('.//a:tc',N)):
  cells+=1
  for k in ['marL','marR','marT','marB']:assert y.find('a:tcPr',N).get(k)=='54000'
  for c in [x,y]:
   for k in ['marL','marR','marT','marB']:c.find('a:tcPr',N).attrib.pop(k,None)
  assert E.tostring(x)==E.tostring(y)
 y=int(bg.find('p:xfrm/a:off',N).get('y'))/12700;x0=int(bg.find('p:xfrm/a:off',N).get('x'))/12700;words=[w for w in pages[i-1].iter() if w.tag.endswith('}word')]
 for row in bg.findall('.//a:tr',N):
  h=int(row.get('h'))/12700;rw=sorted([w for w in words if x0<=(float(w.get('xMin'))+float(w.get('xMax')))/2<x0+sum(widths)/12700 and y<=(float(w.get('yMin'))+float(w.get('yMax')))/2<y+h],key=lambda w:float(w.get('xMin')))
  norm=lambda t:re.sub(r'\s+','',t)
  assert norm(''.join(w.text or '' for w in rw))==norm(''.join(t.text or '' for t in row.findall('.//a:t',N))),i
  assert len(set(round(float(w.get('yMin')),1) for w in rw))==1,(i,'unexpected wrap')
  y+=h
 assert sum(int(r.get('h')) for r in bg.findall('.//a:tr',N))==int(bg.find('p:xfrm/a:ext',N).get('cy'))
 tables.append({'page':i,'cells':len(bg.findall('.//a:tc',N)),'widthPt':sum(widths)/12700})
result={'pages':30,'targetPages':target,'tables':tables,'verifiedCells':cells,'allFourMargins':54000,'protectedSlidesIdentical':True,'fontsAndContentsPreserved':True,'renderAllRowsSingleLine':True}
pathlib.Path('courses/ai-native/checks/s03-cm-margins-20261117.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
