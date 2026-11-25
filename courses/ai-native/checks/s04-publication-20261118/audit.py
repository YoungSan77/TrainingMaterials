from pathlib import Path
import json, re, hashlib, zipfile, xml.etree.ElementTree as E

root=Path.cwd()
deck=root/'out/s04-origin-qa-20261118/s04-review.pptx'
qa=json.loads(deck.with_suffix('.qa.json').read_text())
pdf=root/'out/review/s04-review/s04-review.pdf'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
assert sha(deck)==qa['pptx_sha256']
assert sha(pdf)==qa['render_verification']['pdf_sha256']
assert sha(root/'courses/ai-native/sessions/s04.md')==qa['input_sha256']
assert qa['visual_status']=='PASS' and qa['render_verification']['visually_reviewed_pages']==37
prior=json.loads((root/'courses/ai-native/checks/s04-origin-qa-20261118/pdf-verification.json').read_text())
assert prior=={'pages':37,'cells':421,'issues':[]}
pages=[p for p in E.parse(root/'out/review/s04-review/bbox.html').iter() if p.tag.endswith('}page')]
ns={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
norm=lambda s:re.sub(r'\s+','',s)
entries=[]
with zipfile.ZipFile(deck) as z:
    for warning in qa['warnings']:
        if not warning.startswith('표 셀이 한 줄을 넘는다:'):continue
        topic,prefix=re.search(r'"([^"]+)"의 "([^"]+)"',warning).groups()
        found=[]
        for number in range(1,38):
            doc=E.fromstring(z.read(f'ppt/slides/slide{number}.xml'))
            words=[w for w in pages[number-1].iter() if w.tag.endswith('}word')]
            for frame in doc.findall('.//p:graphicFrame',ns):
                off=frame.find('p:xfrm/a:off',ns)
                widths=[int(c.get('w'))/12700 for c in frame.findall('.//a:gridCol',ns)]
                if off is None or not widths:continue
                ident=frame.find('p:nvGraphicFramePr/p:cNvPr',ns).get('id')
                x0,y=int(off.get('x'))/12700,int(off.get('y'))/12700
                for ri,row in enumerate(frame.findall('.//a:tr',ns),1):
                    x=x0;h=int(row.get('h'))/12700
                    for ci,(cell,width) in enumerate(zip(row.findall('a:tc',ns),widths),1):
                        text=''.join(t.text or '' for t in cell.findall('.//a:t',ns))
                        if text.startswith(prefix):
                            actual=sorted([w for w in words if x<=(float(w.get('xMin'))+float(w.get('xMax')))/2<x+width and y<=(float(w.get('yMin'))+float(w.get('yMax')))/2<y+h],key=lambda w:(round(float(w.get('yMin')),1),float(w.get('xMin'))))
                            same=norm(text)==norm(''.join(w.text or '' for w in actual))
                            inside=all(x-.15<=float(w.get('xMin')) and float(w.get('xMax'))<=x+width+.15 and y-.15<=float(w.get('yMin')) and float(w.get('yMax'))<=y+h+.15 for w in actual)
                            line_ys=sorted(set(round(float(w.get('yMin')),1) for w in actual))
                            found.append({'warning':warning,'topic':topic,'slide':number,'shape_id':int(ident),'row':ri,'column':ci,'text':text,'font_sizes_pt':sorted(set(int(r.get('sz'))/100 for r in cell.findall('.//a:rPr',ns) if r.get('sz'))),'cell_width_pt':width,'row_height_pt':h,'rendered_lines':len(line_ys),'rendered_line_y_pt':line_ys,'text_matches':same,'within_cell':inside,'status':'PASS' if same and inside else 'FAIL'})
                        x+=width
                    y+=h
        assert len(found)==1,(warning,len(found))
        entries.extend(found)
assert len(entries)==9
assert all(e['status']=='PASS' and e['font_sizes_pt']==[10.0] for e in entries)
result={'pptx':str(deck),'pptx_sha256':sha(deck),'input_sha256':qa['input_sha256'],'pdf':str(pdf),'pdf_sha256':sha(pdf),'slides':37,'existing_full_render_review':'PASS','all_cells':421,'all_cell_issues':[],'table_wrap_warnings':entries,'status':'PASS','new_generation_runs':0,'new_render_runs':0,'rechecked_render_pages':[17,20,23],'guides':{p:sha(root/p) for p in ['guides/production-guide.md','courses/ai-native/production-standard.md']}}
(Path(__file__).parent/'table-wrap-review.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'status':result['status'],'warnings_reviewed':len(entries),'slides':sorted(set(e['slide'] for e in entries)),'line_counts':[e['rendered_lines'] for e in entries]},ensure_ascii=False))
