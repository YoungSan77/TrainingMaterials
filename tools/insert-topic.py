"""Insert a topic into a Session Source after topic AFTER, renumbering the later topics, the
목차, and every 「NN. 제목」 reference to them -- in the same session, and in other sessions where
the reference follows that session's name ("NN. 세션명"의 「…」).

Usage: python3 tools/insert-topic.py <sessions_dir> <sNN> <after_number> <new_topic.md>
  new_topic.md starts with '## XX. 제목' (XX is replaced) and ends without the '---' separator.
Example: python3 tools/insert-topic.py courses/ooad/sessions s12 06 /tmp/topic.md"""
import re, sys, pathlib

d = pathlib.Path(sys.argv[1]); sid = sys.argv[2]; after = int(sys.argv[3]); body = pathlib.Path(sys.argv[4]).read_text()
f = d / f"{sid}.md"; s = f.read_text()
session_name = re.search(r"^Session 명: (.+)$", s, re.M).group(1).strip()
heads = re.findall(r"^## (\d\d)\. (.+)$", s, re.M)
mapping = {}
for num, title in heads:
    n = int(num)
    if n > after:
        mapping[f"{num}. {title}"] = f"{n+1:02d}. {title}"
new_title = re.match(r"## XX\. (.+)", body).group(1).strip()
new_label = f"{after+1:02d}. {new_title}"

def remap_refs(text, only_after_session):
    def sub(m):
        inner = m.group(1)
        return "「" + mapping.get(inner, inner) + "」"
    if not only_after_session:
        return re.sub(r"「([^」]+)」", sub, text)
    # other files: only refs in a span that starts with the session name
    out = []; pos = 0
    pat = re.compile(re.escape(f'"{session_name}"') + r"의 ((?:「[^」]+」(?:[·,]\s*|과 |와 |, )?)+)")
    for m in pat.finditer(text):
        out.append(text[pos:m.start(1)]); out.append(re.sub(r"「([^」]+)」", sub, m.group(1))); pos = m.end(1)
    out.append(text[pos:])
    return "".join(out)

# headings and TOC in the session itself (descending to avoid collisions)
for old, new in sorted(mapping.items(), reverse=True):
    s = s.replace(f"## {old}\n", f"## {new}\n")
    s = re.sub(rf"^{re.escape(old)}$", new, s, flags=re.M)
s = remap_refs(s, False)
# insert TOC line and topic
prev = [h for h in heads if int(h[0]) == after][0]
prev_label = f"{prev[0]}. {prev[1]}"
s = re.sub(rf"^{re.escape(prev_label)}$", prev_label + "\n" + new_label, s, count=1, flags=re.M)
nxt = "\n" + f"## {after+2:02d}. "
new_topic = body.replace("## XX.", f"## {after+1:02d}.").rstrip()
if nxt in s:
    idx = s.index(nxt) + 1
    s = s[:idx] + new_topic + "\n\n---\n\n" + s[idx:]
else:  # after the last topic
    s = s.rstrip() + "\n\n---\n\n" + new_topic + "\n"
f.write_text(s)
for g in d.glob("s*.md"):
    if g.name == f.name: continue
    t = g.read_text(); t2 = remap_refs(t, True)
    if t2 != t: g.write_text(t2); print("updated refs in", g.name)
print("inserted", new_label, "; shifted", len(mapping))
