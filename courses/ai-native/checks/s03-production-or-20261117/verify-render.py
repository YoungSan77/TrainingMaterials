import xml.etree.ElementTree as E,json,zipfile,pathlib,re
N={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
pdf=E.parse('out/s03-or-20261117/final-bbox.html');pages=[p for p in pdf.iter() if p.tag.endswith('}page')];assert len(pages)==30
z=zipfile.ZipFile('courses/ai-native/sessions/s03.pptx');norm=lambda t:re.sub(r'\s+','',t);checked=0;issues=[]
for page in [6,14,17,18,20,28,29]:
 d=E.fromstring(z.read(f'ppt/slides/slide{page}.xml'));words=[w for w in pages[page-1].iter() if w.tag.endswith('}word')]
 for gf in d.findall('.//p:graphicFrame',N):
  off=gf.find('p:xfrm/a:off',N);y=int(off.get('y'))/12700;x0=int(off.get('x'))/12700;widths=[int(c.get('w'))/12700 for c in gf.findall('.//a:tblGrid/a:gridCol',N)]
  for ri,row in enumerate(gf.findall('.//a:tr',N)):
   h=int(row.get('h'))/12700;x=x0
   for ci,(cell,width) in enumerate(zip(row.findall('a:tc',N),widths)):
    checked+=1;ws=sorted([w for w in words if x<=(float(w.get('xMin'))+float(w.get('xMax')))/2<x+width and y<=(float(w.get('yMin'))+float(w.get('yMax')))/2<y+h],key=lambda w:(round(float(w.get('yMin')),1),float(w.get('xMin'))))
    actual=''.join(w.text or '' for w in ws);expected=''.join(t.text or '' for t in cell.findall('.//a:t',N))
    if norm(actual)!=norm(expected) or any(float(w.get('yMin'))<y or float(w.get('yMax'))>y+h for w in ws):issues.append({'page':page,'row':ri,'cell':ci,'actual':actual,'expected':expected})
    x+=width
   y+=h
result={'renderedPages':30,'checkedTableCells':checked,'allTableTextPresent':not issues,'allTextWithinRows':not issues,'issues':issues}
pathlib.Path('courses/ai-native/checks/s03-production-or-20261117/render-verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps(result,ensure_ascii=False));assert not issues
