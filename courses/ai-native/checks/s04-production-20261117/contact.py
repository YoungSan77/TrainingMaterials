from pathlib import Path
from PIL import Image,ImageOps,ImageDraw
base=Path('out/review/s04')
count=len(list(base.glob('p-*.png')))
for start in range(1,count+1,4):
    sheet=Image.new('RGB',(1440,1120),'#ddd')
    draw=ImageDraw.Draw(sheet)
    for k,n in enumerate(range(start,min(start+4,count+1))):
        im=Image.open(base/f'p-{n:02}.png').convert('RGB')
        im.thumbnail((720,530))
        x=(k%2)*720;y=(k//2)*560
        sheet.paste(im,(x,y+25));draw.text((x+10,y+5),str(n),fill='black')
    sheet.save(base/f'contact-{start:02}.jpg')
print(f'{count} pages composed into contact sheets')
