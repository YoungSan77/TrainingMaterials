import xml.etree.ElementTree as E, zipfile, pathlib, re, json, hashlib
root=pathlib.Path('courses/ai-native/checks/s04-production-20261117')
ns={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
pptx=pathlib.Path('courses/ai-native/sessions/s04.pptx');pdf=pathlib.Path('out/review/s04/s04.pdf')
pages=[p for p in E.parse('out/review/s04/s04-bbox.html').iter() if p.tag.endswith('}page')]
z=zipfile.ZipFile(pptx);checks=[];issues=[];quotes=[];empty=[];titles=[]
source=pathlib.Path('courses/ai-native/sessions/s04.md').read_text()
quoteTargets=[]
for part in source.split('**인용문**')[1:]:
    paragraph=part.strip().split('\n\n')[0]
    match=re.search(r'"([^"]+)"',paragraph)
    if match:quoteTargets.append(match[1])
norm=lambda t:re.sub(r'\s+','',t)
for i,page in enumerate(pages,1):
    doc=E.fromstring(z.read(f'ppt/slides/slide{i}.xml'));words=[v for v in page.iter() if v.tag.endswith('}word')]
    titles.append(''.join(t.text or '' for t in doc.findall('.//p:sp',ns)[0].findall('.//a:t',ns)))
    for body in doc.findall('.//p:txBody',ns):
        if body.find('a:p',ns) is None:empty.append(i)
    for para in doc.findall('.//a:p',ns):
        text=''.join(t.text or '' for t in para.findall('.//a:t',ns))
        if any(s in text for s in quoteTargets):
            runs=[]
            for r in para.findall('a:r',ns):
                t=r.find('a:t',ns);rp=r.find('a:rPr',ns)
                runs.append({'text':t.text if t is not None else '', 'size':rp.get('sz') if rp is not None else None})
            quotes.append({'page':i,'runs':runs})
    for gf in doc.findall('.//p:graphicFrame',ns):
        widths=[int(c.get('w'))/12700 for c in gf.findall('.//a:gridCol',ns)];off=gf.find('p:xfrm/a:off',ns)
        if off is None or not widths:continue
        x0=int(off.get('x'))/12700;y=int(off.get('y'))/12700
        for row in gf.findall('.//a:tr',ns):
            x=x0;h=int(row.get('h'))/12700
            for cell,w in zip(row.findall('a:tc',ns),widths):
                found=sorted([v for v in words if x<=(float(v.get('xMin'))+float(v.get('xMax')))/2<x+w and y<=(float(v.get('yMin'))+float(v.get('yMax')))/2<y+h],key=lambda v:(round(float(v.get('yMin')),1),float(v.get('xMin'))))
                expected=''.join(t.text or '' for t in cell.findall('.//a:t',ns));actual=''.join(v.text or '' for v in found)
                ok=norm(expected)==norm(actual);within=all(y-.1<=float(v.get('yMin')) and float(v.get('yMax'))<=y+h+.1 for v in found)
                checks.append({'page':i,'textMatch':ok,'insideRow':within})
                if not ok or not within:issues.append({'page':i,'expected':expected,'actual':actual,'insideRow':within})
                x+=w
            y+=h
    for word in words:
        if float(word.get('xMin'))<0 or float(word.get('yMin'))<0 or float(word.get('xMax'))>float(page.get('width'))+.1 or float(word.get('yMax'))>float(page.get('height'))+.1:issues.append({'page':i,'outsidePage':word.text})
s03=zipfile.ZipFile(root/'s03-approved/s03.pptx')
s03order=[]
for n in sorted([n for n in s03.namelist() if re.fullmatch(r'ppt/slides/slide\d+.xml',n)],key=lambda n:int(re.search(r'(\d+)\.xml',n)[1])):
    doc=E.fromstring(s03.read(n));text=' '.join(t.text or '' for t in doc.findall('.//a:t',ns));s03order.append({'slide':len(s03order)+1,'text':text})
quoteIssues=[{'page':q['page'],'actualKoreanSizes':sorted(set(r['size'] for r in q['runs'] if re.search('[가-힣]',r['text']) and not r['text'].startswith('['))),'expectedKoreanSize':'1800'} for q in quotes if any(re.search('[가-힣]',r['text']) and not r['text'].startswith('[') and r['size']!='1800' for r in q['runs'])]
result={'pdfSHA256':hashlib.sha256(pdf.read_bytes()).hexdigest(),'pptxSHA256':hashlib.sha256(pptx.read_bytes()).hexdigest(),'renderedPages':len(pages),'tableCells':len(checks),'issues':issues,'emptyTextBodies':empty,'quoteSourceGroups':len(quoteTargets),'quoteRenderedGroups':len(quotes),'quoteTypographyIssues':quoteIssues,'quotes':quotes,'s03ReadOnlySlideOrder':s03order}
(root/'render-verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps({k:v for k,v in result.items() if k not in ['quotes','s03ReadOnlySlideOrder']},ensure_ascii=False))
