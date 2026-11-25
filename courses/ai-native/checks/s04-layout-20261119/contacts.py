from pathlib import Path
import sys
from PIL import Image,ImageDraw
for name in sys.argv[1:]:
    box=Path('out/review')/name;files=sorted(box.glob('p-*.png'))
    for start in range(0,len(files),4):
        sheet=Image.new('RGB',(1200,950),'#ddd');draw=ImageDraw.Draw(sheet)
        for j,file in enumerate(files[start:start+4]):
            im=Image.open(file).convert('RGB');im.thumbnail((600,445));x=(j%2)*600;y=(j//2)*475
            sheet.paste(im,(x,y+25));draw.text((x+8,y+5),file.stem,fill='black')
        sheet.save(box/f'contact-{start//4+1:02}.jpg')
    print(name,len(files))
