#!/usr/bin/env python3
# chart_worker.py — chart spec(JSON, authoring가 이미 결정) -> PNG.
#   Production은 chart type/data/label을 판단하지 않는다 — stdin의 JSON을 그대로 그린다.
#   집계·변환·타입 자동선택을 하지 않는다(요청된 type/series/labels를 그대로 matplotlib에 전달).
import sys, json

def main():
    spec = json.load(sys.stdin)
    out_path = sys.argv[1]

    chart_type = spec.get("type")
    if chart_type not in ("bar", "line"):
        print(f"지원하지 않는 chart type: {chart_type!r} (bar/line만 지원, 자동 선택하지 않는다)", file=sys.stderr)
        sys.exit(1)

    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    labels = spec.get("labels", [])
    series = spec.get("series", [])
    if not series:
        print("chart spec에 series가 없다", file=sys.stderr)
        sys.exit(1)

    fig, ax = plt.subplots(figsize=(6, 4), dpi=150)
    n = len(series)
    if chart_type == "bar":
        import numpy as np
        x = np.arange(len(labels))
        width = 0.8 / max(n, 1)
        for i, s in enumerate(series):
            ax.bar(x + i * width - 0.4 + width / 2, s.get("values", []), width, label=s.get("name", f"series{i}"))
        ax.set_xticks(x)
        ax.set_xticklabels(labels)
    else:
        for s in series:
            ax.plot(labels, s.get("values", []), marker="o", label=s.get("name"))

    if spec.get("title"):
        ax.set_title(spec["title"])
    if spec.get("xlabel"):
        ax.set_xlabel(spec["xlabel"])
    if spec.get("ylabel"):
        ax.set_ylabel(spec["ylabel"])
    if n > 1 or any(s.get("name") for s in series):
        ax.legend()
    fig.tight_layout()
    fig.savefig(out_path, format="png")
    print(f"OK {out_path}", file=sys.stderr)

if __name__ == "__main__":
    main()
