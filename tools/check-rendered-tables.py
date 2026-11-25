"""Compare every native table cell in PPTX to rendered PDF words, including identifier lines.

Usage: python3 tools/check-rendered-tables.py deck.pptx rendered.pdf [report.json]
Requires pdftotext. No course/session-specific rules or OCR heuristics.
"""
import sys, re, json, hashlib, zipfile, subprocess, xml.etree.ElementTree as E
from pathlib import Path

NS={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
norm=lambda s:re.sub(r'[\s\u200b]+','',s)

def inspect_cell(expected,words,bounds):
    x,y,w,h=bounds
    selected=sorted([v for v in words if x<=(v['xMin']+v['xMax'])/2<x+w and y<=(v['yMin']+v['yMax'])/2<y+h],key=lambda v:(round(v['yMin'],1),v['xMin']))
    actual=''.join(v['text'] for v in selected)
    issues=[]
    if norm(expected)!=norm(actual):issues.append('cell text missing, reordered or intruded by another object')
    if any(v['xMin']<x-.15 or v['xMax']>x+w+.15 or v['yMin']<y-.15 or v['yMax']>y+h+.15 for v in selected):issues.append('rendered words exceed cell bounds')
    # Track each character's PDF line; whitespace may be a word boundary but
    # cannot turn one original identifier into pieces on different lines.
    chars=[];ys=[]
    for v in selected:
        for ch in norm(v['text']):chars.append(ch);ys.append((v['yMin'],v['yMax']))
    joined=''.join(chars)
    for match in re.finditer(r'[A-Za-z_][A-Za-z0-9_.]*',expected):
        token=match.group();start=0
        while True:
            at=joined.find(token,start)
            if at<0:break
            spans=ys[at:at+len(token)]
            if max(v[0] for v in spans)>=min(v[1] for v in spans):issues.append('identifier split across rendered lines: '+token)
            start=at+len(token)
    return issues

def check(pptx,pdf):
    raw=subprocess.run(['pdftotext','-bbox',str(pdf),'-'],capture_output=True,text=True,check=True).stdout
    pages=[p for p in E.fromstring(raw).iter() if p.tag.endswith('}page')]
    issues=[];cells=0;tables=0
    with zipfile.ZipFile(pptx) as z:
        rels=E.fromstring(z.read('ppt/_rels/presentation.xml.rels'))
        targets={r.get('Id'):'ppt/'+r.get('Target').lstrip('./') for r in rels}
        presentation=E.fromstring(z.read('ppt/presentation.xml'))
        slides=[targets[s.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')] for s in presentation.findall('.//p:sldId',NS)]
        if len(slides)!=len(pages):issues.append({'reason':'PDF page count differs from PPTX'})
        for number,(slide,page) in enumerate(zip(slides,pages),1):
            words=[{**{k:float(v.get(k)) for k in ['xMin','yMin','xMax','yMax']},'text':v.text or ''} for v in page.iter() if v.tag.endswith('}word')]
            doc=E.fromstring(z.read(slide))
            for gf in doc.findall('.//p:graphicFrame',NS):
                widths=[int(c.get('w'))/12700 for c in gf.findall('.//a:gridCol',NS)]
                if not widths:continue
                tables+=1;off=gf.find('p:xfrm/a:off',NS);x0=int(off.get('x'))/12700;y=int(off.get('y'))/12700
                ident=gf.find('p:nvGraphicFramePr/p:cNvPr',NS).get('id')
                for ri,row in enumerate(gf.findall('.//a:tr',NS),1):
                    x=x0;h=int(row.get('h'))/12700
                    for ci,(cell,width) in enumerate(zip(row.findall('a:tc',NS),widths),1):
                        expected=''.join(t.text or '' for t in cell.findall('.//a:t',NS));cells+=1
                        for reason in inspect_cell(expected,words,(x,y,width,h)):issues.append({'slide':number,'shape':int(ident),'row':ri,'column':ci,'reason':reason,'expected':expected})
                        x+=width
                    y+=h
    sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
    return {'status':'FAIL' if issues else 'PASS','pptx':str(Path(pptx).resolve()),'pptx_sha256':sha(pptx),'pdf':str(Path(pdf).resolve()),'pdf_sha256':sha(pdf),'pages':len(pages),'tables':tables,'cells':cells,'issues':issues}

if __name__=='__main__':
    if len(sys.argv) not in [3,4]:sys.exit(__doc__)
    result=check(*sys.argv[1:3]);serialized=json.dumps(result,ensure_ascii=False,indent=2)+'\n'
    if len(sys.argv)==4:Path(sys.argv[3]).write_text(serialized)
    print(json.dumps({k:v for k,v in result.items() if k!='issues'},ensure_ascii=False));print('issues:',len(result['issues']))
    sys.exit(1 if result['issues'] else 0)
