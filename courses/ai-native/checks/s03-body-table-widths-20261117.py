import zipfile,xml.etree.ElementTree as E,json,pathlib,re
N={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
old=zipfile.ZipFile('out/s03-body-before.pptx');new=zipfile.ZipFile('courses/ai-native/sessions/s03.pptx');pages=[p for p in E.parse('out/s03-body-bbox.html').iter() if p.tag.endswith('}page')];report=[];changed=[];count=0
for i in range(1,31):
 name=f'ppt/slides/slide{i}.xml';a=E.fromstring(old.read(name));b=E.fromstring(new.read(name))
 if old.read(name)!=new.read(name):changed.append(i)
 for ag,bg in zip(a.findall('.//p:graphicFrame',N),b.findall('.//p:graphicFrame',N)):
  aw=[int(c.get('w')) for c in ag.findall('.//a:gridCol',N)];bw=[int(c.get('w')) for c in bg.findall('.//a:gridCol',N)];assert sum(aw)==sum(bw)
  assert [E.tostring(c) for c in ag.findall('.//a:tc',N)]==[E.tostring(c) for c in bg.findall('.//a:tc',N)]
  if aw!=bw:report.append({'page':i,'headers':[''.join(t.text or '' for t in c.findall('.//a:t',N)) for c in bg.findall('.//a:tr',N)[0].findall('a:tc',N)],'beforePt':[round(x/12700,1) for x in aw],'afterPt':[round(x/12700,1) for x in bw]})
  y=int(bg.find('p:xfrm/a:off',N).get('y'))/12700;x0=int(bg.find('p:xfrm/a:off',N).get('x'))/12700;words=[w for w in pages[i-1].iter() if w.tag.endswith('}word')]
  for row in bg.findall('.//a:tr',N):
   x=x0;h=int(row.get('h'))/12700
   for c,w in zip(row.findall('a:tc',N),bw):
    count+=1;ws=sorted([t for t in words if x<=(float(t.get('xMin'))+float(t.get('xMax')))/2<x+w/12700 and y<=(float(t.get('yMin'))+float(t.get('yMax')))/2<y+h],key=lambda t:(round(float(t.get('yMin')),1),float(t.get('xMin'))))
    expected=''.join(t.text or '' for t in c.findall('.//a:t',N));actual=''.join(t.text or '' for t in ws);norm=lambda t:re.sub(r'\s+','',t);assert norm(actual)==norm(expected),(i,expected,actual)
    assert all(y-.01<=float(t.get('yMin')) and float(t.get('yMax'))<=y+h+.01 for t in ws)
    x+=w/12700
   y+=h
  for gf in [ag,bg]:
   for c in gf.findall('.//a:gridCol',N):c.attrib.pop('w')
   for r in gf.findall('.//a:tr',N):r.attrib.pop('h')
   gf.find('p:xfrm/a:ext',N).attrib.pop('cy')
 assert E.tostring(a)==E.tostring(b),i
assert changed==[3,6,7,8,9,12,13,14,15,21,23]
result={'changedPages':changed,'tables':report,'verifiedRenderedCells':count,'allCellsPreserved':True,'outsideSlidesIdentical':True}
pathlib.Path('courses/ai-native/checks/s03-body-table-widths-20261117.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps(result,ensure_ascii=False))
