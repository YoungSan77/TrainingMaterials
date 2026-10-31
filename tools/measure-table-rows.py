"""표 칸의 글이 행의 세로 가운데에 있는지 PDF 좌표로 잰다.

사용: python3 -I tools/measure-table-rows.py <sNN.pptx> <sNN.pdf>
  PDF는 `tools/review-pdf.sh <원고> <장>`이 출력 폴더에 함께 남긴 것이다.

행마다 (행의 가운데) - (그 행 글 상자의 가운데)를 pt로 적는다. 양수면 글이 위로, 음수면 아래로
치우쳤다는 뜻이다. 눈으로 보는 이미지는 낮은 해상도에서 치우쳐 보이므로 이 좌표로 판정한다
(guides/production-guide.md 「표의 행 높이와 열 너비」).
"""
import re
import sys
import zipfile
import subprocess
import html

EMU = 914400.0
LIMIT = 0.5

if len(sys.argv) != 3:
    sys.exit(__doc__)
pptx, pdf = sys.argv[1], sys.argv[2]
z = zipfile.ZipFile(pptx)

rels = dict(re.findall(
    r'Id="([^"]+)"[^>]*Target="([^"]+)"',
    z.read("ppt/_rels/presentation.xml.rels").decode("utf-8")))
order = re.findall(r'<p:sldId[^>]*r:id="([^"]+)"',
                   z.read("ppt/presentation.xml").decode("utf-8"))
slides = ["ppt/" + rels[r].lstrip("./") for r in order]

out = subprocess.run(["pdftotext", "-bbox", pdf, "-"],
                     capture_output=True, text=True, check=True).stdout
pages = []
for pg in re.findall(r"<page\b.*?</page>", out, re.S):
    pages.append([
        (float(m.group(1)), float(m.group(2)), float(m.group(3)), float(m.group(4)),
         html.unescape(m.group(5)))
        for m in re.finditer(
            r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">(.*?)</word>', pg)
    ])

rows = []
for i, path in enumerate(slides):
    s = z.read(path).decode("utf-8")
    words = pages[i] if i < len(pages) else []
    for gf in re.findall(r"<p:graphicFrame>.*?</p:graphicFrame>", s, re.S):
        if "<a:tbl>" not in gf:
            continue
        off = re.search(r'<a:off x="(-?\d+)" y="(-?\d+)"', gf)
        x0 = int(off.group(1)) / EMU * 72
        cx = int(re.search(r'<a:ext cx="(\d+)"', gf).group(1)) / EMU * 72
        top = int(off.group(2)) / EMU * 72
        for ri, raw in enumerate(re.findall(r'<a:tr h="(\d+)"', gf)):
            h = int(raw) / EMU * 72
            lo, hi, mid = top, top + h, top + h / 2
            inside = [w for w in words
                      if lo - 1 < (w[1] + w[3]) / 2 < hi + 1
                      and x0 - 2 < w[0] and w[2] < x0 + cx + 2]
            if inside:
                d = mid - (min(w[1] for w in inside) + max(w[3] for w in inside)) / 2
                rows.append((abs(d), d, i + 1, ri, h, inside[0][4]))
            top = hi

rows.sort(reverse=True)
over = [r for r in rows if r[0] > LIMIT]
print(f"{len(rows)}개 행을 쟀다. {LIMIT}pt를 넘게 치우친 행: {len(over)}개")
for a, d, pg, ri, h, t in (over or rows)[:15]:
    print(f"  p{pg:>3} 행{ri:<2} 높이{h:6.2f}pt  치우침 {d:+6.2f}pt (+위 −아래)   {t[:24]}")
sys.exit(1 if over else 0)
