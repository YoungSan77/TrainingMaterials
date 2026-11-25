from pathlib import Path
from PIL import Image,ImageDraw
root=Path('out/review')
for name in ['ai-native-s03','s03-approved','ai-native-s04','ooad-s02']:
    files=sorted((root/name).glob('p-*.png'))
    for start in range(0,len(files),4):
        sheet=Image.new('RGB',(1200,950),'#ddd');draw=ImageDraw.Draw(sheet)
        for j,file in enumerate(files[start:start+4]):
            im=Image.open(file).convert('RGB');im.thumbnail((600,445));x=(j%2)*600;y=(j//2)*475
            sheet.paste(im,(x,y+25));draw.text((x+8,y+5),name+' '+file.stem,fill='black')
        sheet.save(root/name/f'contact-{start//4+1:02}.jpg')
    print(name,len(files))
