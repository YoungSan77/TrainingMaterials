import zipfile,xml.etree.ElementTree as E,json,re,pathlib
b=pathlib.Path('out/s03-oq-20261117'); n={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
def docs(path):
 z=zipfile.ZipFile(path);return [E.fromstring(z.read(f'ppt/slides/slide{i}.xml')) for i in range(1,len([x for x in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+.xml',x)])+1)]
def ts(d):return [''.join(p.itertext()) for p in d.findall('.//a:t',n)]
old=docs('out/s03-oq-20261117-before.pptx');new=docs('courses/ai-native/sessions/s03.pptx')
def normalized(d):
 s=E.tostring(d,encoding='unicode');s=re.sub(r' - \d+ - ',' - PAGE - ',s);return s
preserved=[]
for oi,ni in [(i,i) for i in range(1,16)]+[(26,21),(27,22),(28,23),(30,25)]:
 # Footer page numbers are the only permitted change in these original slides.
 def sig(d):return [re.sub(r'^-\s*\d+\s*-\s*$','PAGE',x) for x in ts(d)]
 assert sig(old[oi-1])==sig(new[ni-1]),(oi,ni)
 # Compare every coordinate and formatting attribute; footer text normalization only.
 a=E.tostring(old[oi-1],encoding='unicode');c=E.tostring(new[ni-1],encoding='unicode')
 a=re.sub(r'>- \d+ -\s*<','>PAGE<',a);c=re.sub(r'>- \d+ -\s*<','>PAGE<',c)
 a=re.sub(r'mermaid(?: Diagram |Image)\d+','DIAGRAM',a);c=re.sub(r'mermaid(?: Diagram |Image)\d+','DIAGRAM',c)
 assert a==c,('xml',oi,ni)
 preserved.append([oi,ni])
src=pathlib.Path('courses/ai-native/sessions/s03.md').read_text();ex=json.loads((b/'excerpts.json').read_text())
assert ex['demo']['text'] in src and ex['exercise']['text'] in src
positions=[]
bullets=[]
for s in new[16].findall('.//p:sp',n):
 for p in s.findall('p:txBody/a:p',n):
  t=''.join(x.text or '' for x in p.findall('.//a:t',n));pr=p.find('a:pPr',n)
  if t=='1. 목적' or t.startswith('고객이 장바구니에 담은 상품을 주문하고 결제할 수 있도록'):
   off=s.find('p:spPr/a:xfrm/a:off',n);bp=s.find('p:txBody/a:bodyPr',n)
   positions.append({'text':t,'start':int(off.get('x'))+int(bp.get('lIns','91440'))+int(pr.get('marL','0'))+int(pr.get('indent','0')),'indent':pr.get('indent')})
assert len(positions)==2 and positions[0]['start']==positions[1]['start']
for page in [17,26]:
 for s in new[page-1].findall('.//p:sp',n):
  for p in s.findall('p:txBody/a:p',n):
   pr=p.find('a:pPr',n)
   if pr is None or pr.find('a:buChar',n) is None:continue
   off=s.find('p:spPr/a:xfrm/a:off',n);bp=s.find('p:txBody/a:bodyPr',n)
   x=int(off.get('x'))+int(bp.get('lIns','91440'))+int(pr.get('marL','0'))
   bullets.append({'page':page,'glyphPt':(x+int(pr.get('indent','0')))/12700,'bodyPt':x/12700});break
  if bullets and bullets[-1]['page']==page:break
fontchecks=[]
for i in [17,18,19,26,27,28,29,30]:
 d=new[i-1];runs=[]
 for s in list(d.findall('.//p:sp',n))+list(d.findall('.//p:graphicFrame',n)):
  off=s.find('p:spPr/a:xfrm/a:off',n)
  if off is not None and int(off.get('y'))<800000:continue
  for rp in s.findall('.//a:rPr',n):
   if rp.get('sz'):runs.append(rp.get('sz'))
 # Header/footer and inherited empty shapes are outside the document content.
 fontchecks.append({'page':i,'sizes':sorted(set(runs))})
 assert set(runs)=={'1000'},(i,set(runs))
result={'pages':len(new),'preserved':preserved,'sourceExcerptsExact':True,'intro':positions,'bullets':bullets,'fonts':fontchecks}
(b/'verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps(result,ensure_ascii=False))
