#!/usr/bin/env python3
import json
import os
import sys
import tempfile

# matplotlib's font_manager only auto-discovers the first (Regular) face of a .ttc collection,
# so fontweight="bold" silently had no real bold face to select for "Apple SD Gothic Neo" -- the
# title rendered at regular weight regardless. Extract the TTC's actual Bold face once (cached
# alongside the matplotlib config dir chartAdapter.js already sets via MPLCONFIGDIR) and reference
# it directly by file.
def bold_font_properties():
    import matplotlib.font_manager as fm
    cache_dir = os.environ.get("MPLCONFIGDIR", tempfile.gettempdir())
    bold_path = os.path.join(cache_dir, "AppleSDGothicNeo-Bold.ttf")
    try:
        if not os.path.exists(bold_path):
            from fontTools.ttLib import TTCollection
            tc = TTCollection("/System/Library/Fonts/AppleSDGothicNeo.ttc")
            for face in tc.fonts:
                name = face["name"]
                if name.getDebugName(1) == "Apple SD Gothic Neo" and name.getDebugName(2) == "Bold":
                    os.makedirs(cache_dir, exist_ok=True)
                    face.save(bold_path)
                    break
            else:
                return None
        return fm.FontProperties(fname=bold_path)
    except Exception:
        return None

# WCAG-style relative luminance: decides whether a wedge's own label needs white text to stay
# readable against it, instead of always using the same (often illegible) color.
def is_dark(hex_color):
    hex_color = hex_color.lstrip("#")
    r, g, b = (int(hex_color[i:i + 2], 16) / 255 for i in (0, 2, 4))
    luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
    return luminance < 0.5

def main():
    spec = json.load(sys.stdin)
    output = sys.argv[1]
    chart_type = spec.get("type")
    if chart_type not in ("bar", "line", "pie"):
        raise ValueError(f"지원하지 않는 chart type: {chart_type!r}")
    labels = spec.get("labels", [])
    series = spec.get("series", [])
    if not series:
        raise ValueError("chart spec에 series가 없다")
    for item in series:
        if len(item.get("values", [])) != len(labels):
            raise ValueError("chart labels와 values 수가 일치하지 않는다")
    if chart_type == "pie" and len(series) != 1:
        raise ValueError("pie chart는 series가 정확히 하나여야 한다(비율은 하나의 전체에 대한 값이다)")

    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    import numpy as np

    plt.rcParams["font.family"] = "Apple SD Gothic Neo"
    plt.rcParams["axes.unicode_minus"] = False

    fig, ax = plt.subplots(figsize=(6, 4), dpi=150)
    colors = ["#1B3A6B", "#3A7CA5", "#70A288", "#D08C60", "#C75146"]
    if chart_type == "bar":
        x = np.arange(len(labels))
        width = 0.8 / len(series)
        for index, item in enumerate(series):
            values = item["values"]
            bars = ax.bar(x + index * width - 0.4 + width / 2, values, width,
                          label=item.get("name", f"series{index}"), color=colors[index % len(colors)])
            ax.bar_label(bars, fontsize=9, padding=2)
        ax.set_xticks(x)
        ax.set_xticklabels(labels)
    elif chart_type == "line":
        for index, item in enumerate(series):
            ax.plot(labels, item["values"], marker="o", linewidth=2,
                    label=item.get("name"), color=colors[index % len(colors)])
    else:
        # pie: 슬라이드에 줄여 넣으면 약 0.55배가 되므로 라벨은 21pt로 그려 표시 크기가 12pt에 가깝게 한다.
        # pie: 값이 하나의 전체(합계)에 대한 비율이므로 값 자체를 조각 크기로 쓴다. 원형을 강제해
        # "원에 비율만큼 표현"이 실제로 지켜지게 한다(figure 비율과 무관하게).
        values = series[0]["values"]
        wedge_colors = [colors[i % len(colors)] for i in range(len(values))]
        _, _, autotexts = ax.pie(values, labels=labels, autopct="%1.0f%%", colors=wedge_colors,
                                  startangle=90, textprops={"fontsize": 21})
        for autotext, wedge_color in zip(autotexts, wedge_colors):
            autotext.set_color("white" if is_dark(wedge_color) else "black")
        ax.axis("equal")
    bold = bold_font_properties()
    if spec.get("title"):
        if bold:
            ax.set_title(spec["title"], fontsize=13, fontproperties=bold)
        else:
            ax.set_title(spec["title"], fontsize=13, fontweight="bold")
    if spec.get("xlabel"):
        ax.set_xlabel(spec["xlabel"])
    if spec.get("ylabel"):
        ax.set_ylabel(spec["ylabel"])
    if len(series) > 1:
        ax.legend()
    if chart_type != "pie":
        ax.grid(axis="y", alpha=0.2)
    fig.tight_layout()
    fig.savefig(output, format="png", facecolor="white")
    plt.close(fig)

if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
