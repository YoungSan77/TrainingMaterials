import zipfile,xml.etree.ElementTree as E,json,pathlib,re
N={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
z=zipfile.ZipFile('courses/ai-native/sessions/s03.pptx');old=zipfile.ZipFile('out/s03-all-margin-before.pptx');pdf=[p for p in E.parse('out/s03-all-margin-bbox.html').iter() if p.tag.endswith('}page')];counts={'body':0,'demo':0,'judgment':0,'appendix':0};changed=[]
for i in range(1,31):
 name=f'ppt/slides/slide{i}.xml';raw=z.read(name);d=E.fromstring(raw)
 if raw!=old.read(name):changed.append(i)
 for gf in d.findall('.//p:graphicFrame',N):
  kind='appendix' if i>=26 else 'judgment' if i==20 else 'demo' if i in [17,18] else 'body'
  cells=gf.findall('.//a:tc',N);counts[kind]+=len(cells)
  for c in cells:
   pr=c.find('a:tcPr',N)
   for k in ['marL','marR','marT','marB']:assert pr.get(k)=='54000',(i,k,pr.attrib)
   for rp in c.findall('.//a:rPr',N):assert rp.get('sz')==('1000' if kind=='body' else '800')
  assert abs(sum(int(c.get('w')) for c in gf.findall('.//a:gridCol',N))-int(gf.find('p:xfrm/a:ext',N).get('cx')))<=7
  assert sum(int(r.get('h')) for r in gf.findall('.//a:tr',N))==int(gf.find('p:xfrm/a:ext',N).get('cy'))
  off=gf.find('p:xfrm/a:off',N);y=int(off.get('y'))/12700;x0=int(off.get('x'))/12700;ws=[w for w in pdf[i-1].iter() if w.tag.endswith('}word')];widths=[int(c.get('w'))/12700 for c in gf.findall('.//a:gridCol',N)]
  for row in gf.findall('.//a:tr',N):
   x=x0;h=int(row.get('h'))/12700
   for c,w in zip(row.findall('a:tc',N),widths):
    words=sorted([v for v in ws if x<=(float(v.get('xMin'))+float(v.get('xMax')))/2<x+w and y<=(float(v.get('yMin'))+float(v.get('yMax')))/2<y+h],key=lambda v:(round(float(v.get('yMin')),1),float(v.get('xMin'))))
    norm=lambda t:re.sub(r'\s+','',t)
    assert norm(''.join(v.text or '' for v in words))==norm(''.join(t.text or '' for t in c.findall('.//a:t',N))),(i,'missing text')
    x+=w
   y+=h
assert counts=={'body':121,'demo':50,'judgment':18,'appendix':65}
assert changed==[17,18,20,28,29]
result={'counts':counts,'total':sum(counts.values()),'allFourMargins':54000,'changedPages':changed,'allRenderedTextPresent':True}
pathlib.Path('courses/ai-native/checks/s03-common-margins-20261117.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
