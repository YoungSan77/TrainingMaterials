from pathlib import Path
import subprocess,json,re,xml.etree.ElementTree as E
root=Path(__file__).parent
audit=json.loads((root/'source-and-layout.json').read_text())
pdf=Path('out/review/s04-review/s04-review.pdf')
xml=subprocess.run(['pdftotext','-bbox',str(pdf),'-'],text=True,capture_output=True,check=True).stdout
pages=[p for p in E.fromstring(xml).iter() if p.tag.endswith('}page')]
lines={};bottoms={}
for w in pages[18].iter():
    if w.tag.endswith('}word'):
        y=round(float(w.get('yMin')),1);lines.setdefault(y,[]).append((float(w.get('xMin')),w.text or ''));bottoms[y]=max(bottoms.get(y,0),float(w.get('yMax')))
clean=lambda s:re.sub(r'\s+','',s)
result=[]
for row in audit['reviewSpacing']['s04-review']:
    matches=[(y,sorted(words)) for y,words in lines.items() if clean(row['text']) in clean(''.join(t for x,t in sorted(words)))]
    assert len(matches)==1,row
    y,words=matches[0];result.append({**row,'pdf_text_y_pt':y,'pdf_text_bottom_pt':bottoms[y]})
pitches=[round(b['pdf_text_y_pt']-a['pdf_text_y_pt'],2) for a,b in zip(result,result[1:])]
assert all(b['pdf_text_y_pt']>a['pdf_text_bottom_pt'] for a,b in zip(result,result[1:]))
(root/'review-paragraph-render.json').write_text(json.dumps({'slide':19,'paragraphs':result,'glyph_top_pitch_pt':pitches,'explanation':'3pt before/after verified in OOXML. PDF glyph boxes differ by text/font metrics; record measured positions and verify no overlap rather than treating glyph-top distance as paragraph spacing.','status':'PASS'},ensure_ascii=False,indent=2)+'\n')
print(result,pitches)
