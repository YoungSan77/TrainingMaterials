import xml.etree.ElementTree as E,json,zipfile,pathlib,re
base=pathlib.Path('courses/ai-native/checks/s03-production-20261117');metrics=json.loads((base/'rowfit-measurements.json').read_text());pdf=E.parse('out/s03-table-rowfit-bbox.html');pages=[p for p in pdf.iter() if p.tag.endswith('}page')]
z=zipfile.ZipFile('courses/ai-native/sessions/s03.pptx');N={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
cells=0;issues=[]
# PowerPoint's PDF glyph box origin differs from the typographic line-box origin
# by at most 0.299pt in this export. Cell margins themselves are checked in OOXML.
tolerance=1/3
for page in [17,18,20,28,29]:
 doc=E.fromstring(z.read(f'ppt/slides/slide{page}.xml'));words=[w for w in pages[page-1].iter() if w.tag.endswith('}word')]
 for ti,gf in enumerate(doc.findall('.//p:graphicFrame',N)):
  m=[m for m in metrics if m['page']==page][ti];off=gf.find('p:xfrm/a:off',N);y=int(off.get('y'))/12700;x0=int(off.get('x'))/12700
  widths=[int(c.get('w'))/12700 for c in gf.findall('.//a:tblGrid/a:gridCol',N)]
  for ri,row in enumerate(gf.findall('.//a:tr',N)):
   h=int(row.get('h'))/12700;x=x0
   for ci,(cell,width) in enumerate(zip(row.findall('a:tc',N),widths)):
    cells+=1;pr=cell.find('a:tcPr',N);top=y+int(pr.get('marT'))/12700;bottom=y+h-int(pr.get('marB'))/12700
    ws=sorted([w for w in words if x<=(float(w.get('xMin'))+float(w.get('xMax')))/2<x+width and y<=(float(w.get('yMin'))+float(w.get('yMax')))/2<y+h],key=lambda w:(round(float(w.get('yMin')),1),float(w.get('xMin'))))
    actual=''.join(w.text or '' for w in ws);expected=''.join(t.text or '' for t in cell.findall('.//a:t',N));norm=lambda t:re.sub(r'\s+','',t)
    lines=len(set(round(float(w.get('yMin')),1) for w in ws));wanted=sum(p['lines'] for p in m['rows'][ri]['cells'][ci]['paragraphs'])
    if norm(actual)!=norm(expected) or lines!=wanted or any(float(w.get('yMin'))<top-tolerance or float(w.get('yMax'))>bottom+tolerance for w in ws):issues.append({'page':page,'row':ri,'cell':ci,'actual':actual,'expected':expected,'lines':lines,'wanted':wanted,'top':top,'bottom':bottom,'boxes':[w.attrib for w in ws]})
    x+=width
   y+=h
result={'checkedCells':cells,'allTextAndWrapsMatch':not issues,'textWithinVerticalMargins':not issues,'glyphBoxOriginTolerancePt':tolerance,'issues':issues}
(base/'rowfit-render-verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps(result,ensure_ascii=False));assert not issues
