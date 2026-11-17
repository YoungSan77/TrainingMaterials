"""Check every rendered table cell and adjacent-page viewport without editing source."""
import xml.etree.ElementTree as E, zipfile, pathlib, re, json, hashlib
root=pathlib.Path('courses/ai-native/checks/s03-recorded-qa-20261117')
ns={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
pptx=pathlib.Path('courses/ai-native/sessions/s03.pptx');pdf=pathlib.Path('out/review/s03/s03.pdf')
pages=[p for p in E.parse('out/review/s03/s03-bbox.html').iter() if p.tag.endswith('}page')]
z=zipfile.ZipFile(pptx);checks=[];issues=[];identifier=[]
norm=lambda t:re.sub(r'\s+','',t)
for i,page in enumerate(pages,1):
    doc=E.fromstring(z.read(f'ppt/slides/slide{i}.xml'));words=[v for v in page.iter() if v.tag.endswith('}word')]
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
                headers=[''.join(t.text or '' for t in c.findall('.//a:t',ns)) for c in gf.findall('.//a:tr',ns)[0].findall('a:tc',ns)]
                if headers==['용어','표기','정의'] and expected=='PENDING_PAYMENT':
                    ys=sorted(set(round(float(v.get('yMin')),1) for v in found))
                    identifier.append({'page':i,'text':actual,'lines':len(ys),'columnWidthPt':w,'words':[v.text for v in found]})
                    assert actual=='PENDING_PAYMENT' and len(ys)==1
                x+=w
            y+=h
    for word in words:
        if float(word.get('xMin'))<0 or float(word.get('yMin'))<0 or float(word.get('xMax'))>float(page.get('width'))+.1 or float(word.get('yMax'))>float(page.get('height'))+.1:issues.append({'page':i,'outsidePage':word.text})
assert len(pages)==30;assert len(checks)==254;assert len(identifier)==1
result={'pdf':str(pdf),'pdfSHA256':hashlib.sha256(pdf.read_bytes()).hexdigest(),'pptxSHA256':hashlib.sha256(pptx.read_bytes()).hexdigest(),'renderedPages':len(pages),'renderedCellsChecked':len(checks),'glossaryIdentifier':identifier,'columnAdjustmentNeeded':False,'issues':issues,'status':'PASS' if not issues else 'FAIL','visuallyReviewedPages':[2,3,4,5,6,8,13,14,15,16,17,18,19,22,24,25,28,29,30],'visualReview':'Reviewed all 12 source-change slides and 7 connection/adjacent slides. US-01 complete on 17; glossary distinction follows the table on 29; no new loss, overlap or clipping observed.'}
(root/'render-verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps(result,ensure_ascii=False));assert not issues,issues
