from pathlib import Path
import subprocess,zipfile,xml.etree.ElementTree as E,re,json
from PIL import Image,ImageDraw
root=Path('courses/ai-native/checks/s04-production-20261118')
box=Path('out/review/s04-final')
bbox=box/'bbox.html'
subprocess.run(['pdftotext','-bbox',str(box/'s04-final.pdf'),str(bbox)],check=True)
pages=[p for p in E.parse(bbox).iter() if p.tag.endswith('}page')]
z=zipfile.ZipFile('out/s04-production-20261118/s04-final.pptx')
ns={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
cells=0;issues=[]
for i,page in enumerate(pages,1):
    doc=E.fromstring(z.read(f'ppt/slides/slide{i}.xml'));words=[w for w in page.iter() if w.tag.endswith('}word')]
    for gf in doc.findall('.//p:graphicFrame',ns):
        widths=[int(c.get('w'))/12700 for c in gf.findall('.//a:gridCol',ns)];off=gf.find('p:xfrm/a:off',ns)
        if not widths or off is None:continue
        x0=int(off.get('x'))/12700;y=int(off.get('y'))/12700
        for row in gf.findall('.//a:tr',ns):
            x=x0;h=int(row.get('h'))/12700
            for cell,width in zip(row.findall('a:tc',ns),widths):
                found=sorted([w for w in words if x<=(float(w.get('xMin'))+float(w.get('xMax')))/2<x+width and y<=(float(w.get('yMin'))+float(w.get('yMax')))/2<y+h],key=lambda w:(round(float(w.get('yMin')),1),float(w.get('xMin'))))
                expected=''.join(t.text or '' for t in cell.findall('.//a:t',ns));actual=''.join(w.text or '' for w in found)
                same=lambda s:re.sub(r'\s+','',s)
                within=all(y-.15<=float(w.get('yMin')) and float(w.get('yMax'))<=y+h+.15 for w in found)
                cells+=1
                if same(expected)!=same(actual) or not within:issues.append({'slide':i,'expected':expected,'actual':actual,'insideRow':within})
                x+=width
            y+=h
result={'pages':len(pages),'cells':cells,'issues':issues}
(root/'pdf-verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps(result,ensure_ascii=False))
files=sorted(box.glob('p-*.png'))
for start in range(0,len(files),4):
    sheet=Image.new('RGB',(1200,950),'#ddd');draw=ImageDraw.Draw(sheet)
    for j,file in enumerate(files[start:start+4]):
        im=Image.open(file).convert('RGB');im.thumbnail((600,445));x=(j%2)*600;y=(j//2)*475
        sheet.paste(im,(x,y+25));draw.text((x+8,y+5),file.stem,fill='black')
    sheet.save(box/f'contact-{start//4+1:02}.jpg')
