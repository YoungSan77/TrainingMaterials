from pathlib import Path
from PIL import Image
import json

root=Path.cwd();qa=json.loads((root/'out/s04-layout-20261119/s04-after.qa.json').read_text());results=[]
for slide,ident,search in [(33,11,(200,550)),(34,9,(220,485))]:
    im=Image.open(root/f'out/s04-layout-20261119/attachment-{slide}.png').convert('RGB')
    table=next(t for p in qa['table_layout'] if p['slide']==slide for t in p['tables'] if t['shape']==ident)
    b=table['bounds'];scale=im.width/720
    lo,hi=round(b['x']*scale)+2,round((b['x']+b['w'])*scale)-2
    lines=[]
    for y in range(*search):
        count=sum(1 for x in range(lo,hi) if (lambda c:max(c)-min(c)<3 and 70<=c[0]<=200)(im.getpixel((x,y))))
        if count/(hi-lo)>.7:lines.append(y)
    assert lines
    bottom=max(lines);expected=(b['y']+b['h'])*scale
    results.append({'slide':slide,'shape':ident,'attachment':f'out/s04-layout-20261119/attachment-{slide}.png','image_width_px':im.width,'slide_width_pt':720,'pixels_per_pt':scale,'table_horizontal_rules_y_px':lines,'attachment_bottom_px':bottom,'pptx_bottom_px':expected,'table_growth_pt':bottom/scale-(b['y']+b['h']),'pptx_following_top_pt':b['y']+b['h']+min(v['gapPt'] for v in table['followingObjects']),'source_following_gap_pt':8,'method':'horizontal gray table rule coverage >70% (allows text crossing the bottom rule), using actual PPTX x/width and slide/image scale; this does not identify screenshot renderer'})
(Path(__file__).parent/'attachment-measurements.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(results,ensure_ascii=False,indent=2))
