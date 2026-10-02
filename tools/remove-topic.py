"""Remove a topic from a Session Source (after its content was merged elsewhere), renumbering the
later topics, the 목차, and every 「NN. 제목」 reference -- in the same session, and in other
sessions where the reference follows that session's name ("NN. 세션명"의 「…」). References to the
removed topic point to INTO instead.

Usage: python3 tools/remove-topic.py <sessions_dir> <sNN> <number> <into_number>
Example: python3 tools/remove-topic.py courses/ooad/sessions s02 21 20"""
import re, sys, pathlib

d = pathlib.Path(sys.argv[1]); sid = sys.argv[2]; gone = int(sys.argv[3]); into = int(sys.argv[4])
f = d / f"{sid}.md"; s = f.read_text()
session_name = re.search(r"^Session 명: (.+)$", s, re.M).group(1).strip()
heads = re.findall(r"^## (\d\d)\. (.+)$", s, re.M)
titles = {int(n): t for n, t in heads}
mapping = {}
for n, t in titles.items():
    if n == gone:
        target = into if into < gone else into - 1
        mapping[f"{n:02d}. {t}"] = f"{target:02d}. {titles[into]}"
    elif n > gone:
        mapping[f"{n:02d}. {t}"] = f"{n-1:02d}. {t}"

def remap_refs(text, only_after_session):
    sub = lambda m: "「" + mapping.get(m.group(1), m.group(1)) + "」"
    if not only_after_session:
        return re.sub(r"「([^」]+)」", sub, text)
    pat = re.compile(re.escape(f'"{session_name}"') + r"의 ((?:「[^」]+」(?:[·,]\s*|과 |와 |, )?)+)")
    return pat.sub(lambda m: m.group(0)[: -len(m.group(1))] + re.sub(r"「([^」]+)」", sub, m.group(1)), text)

# drop the topic block (heading to the next "---" separator line, inclusive)
m = re.search(rf"^## {gone:02d}\. .*?(?=^## \d\d\. )", s, re.M | re.S)
s = s[: m.start()] + s[m.end():]
s = re.sub(rf"^{gone:02d}\. .*\n", "", s, count=1, flags=re.M)  # 목차 line
for n in sorted(k for k in titles if k > gone):
    s = re.sub(rf"^## {n:02d}\. ", f"## {n-1:02d}. ", s, count=1, flags=re.M)
    s = re.sub(rf"^{n:02d}\. ", f"{n-1:02d}. ", s, count=1, flags=re.M)
s = remap_refs(s, False)
f.write_text(s)
for other in sorted(d.glob("s*.md")):
    if other == f:
        continue
    t = other.read_text(); t2 = remap_refs(t, True)
    if t2 != t:
        other.write_text(t2); print("updated", other.name)
print("removed", gone, "->", into)
