#!/bin/zsh
# PowerPoint로 PPT를 PDF로 내보내고, 지정한 장만 PNG로 만든다(시각 검토용).
# 내보낸 PDF는 출력 폴더에 <sNN>.pdf로 함께 남는다 — 글의 좌표를 재려면 PNG가 아니라 이 파일을 쓴다.
# 자동 검사(오류·경고 0개)를 통과한 뒤, 도식·표·코드가 있는 장과 바뀐 장만 본다.
#
# 사용: tools/review-pdf.sh <sNN.md 또는 sNN.pptx> [장 번호 또는 범위 ...]
#   예: tools/review-pdf.sh courses/ooad/sessions/s12.md 8 10-12
#   장을 주지 않으면 장 수만 알려 주고 이미지는 만들지 않는다(전체 검토는 의도적으로 범위를 준다).
# 환경 변수: OUT(출력 폴더), DPI(기본 50), DELAY(열기 대기 초, 기본 8), TIMEOUT(AppleEvent 상한 초, 기본 600)
# 기본 출력 폴더는 저장소 안의 out/review/<sNN>이다(git 제외). 저장소 밖에 두면 LLM이 이미지를
# 읽지 못해(작업 폴더 밖 읽기 차단) 시각 검토를 할 수 없다.
#
# 2026-11-27: PowerPoint 컨테이너(~/Library/Containers/…)에 파일을 복사하던 방식을 버렸다.
# macOS가 다른 앱의 컨테이너 쓰기를 막아(`Operation not permitted`) 시각 검토 자체가 되지 않았다.
# PowerPoint는 저장소 경로의 파일을 그대로 열고 그 옆에 PDF를 쓸 수 있으므로 복사가 필요 없다.
# AppleScript는 `with timeout`으로 감싼다 — 열기·내보내기가 기본 AppleEvent 상한을 넘으면
# 내보내기에 성공해도 -1712로 실패한 것처럼 보인다.
set -euo pipefail
setopt null_glob

src=${1:?"사용: tools/review-pdf.sh <sNN.md|sNN.pptx> [장 ...]"}; shift
pptx=${src%.md}; pptx=${pptx%.pptx}.pptx
[[ -f $pptx ]] || { echo "없음: $pptx (먼저 렌더링한다)"; exit 1; }
name=${pptx:t:r}
repo=${0:A:h:h}
out=${OUT:-$repo/out/review/$name}
pdf=$out/$name.pdf
mkdir -p $out
rm -f $out/*.png $pdf

# 다른 문서가 열려 있어도 그대로 둔다. 2026-11-27에 「문서가 열려 있으면 거절」을 넣었던 이유는
# `save active presentation`이 **맨 앞 문서**를 내보내서 엉뚱한 파일이 나오는 것이었다. 그 전제가
# 틀렸다 — 내보낼 문서를 **이름으로 가리키면** 맨 앞이 무엇이든 상관없다. 사람의 작업을 말없이
# 닫지도 않고, 사람에게 닫으라고 하지도 않는다(2026-11-28).
#
# 다만 **같은 파일이 이미 열려 있으면** 거절한다. 그 창의 내용은 렌더 전의 것일 수 있고(디스크를
# 덮어써도 열린 창은 갱신되지 않는다), 그것을 내보내면 **옛 덱을 새 덱으로 착각한 PDF**가 나온다.
# 그 하나만 사람이 닫는다 — 저장하지 않은 편집이 있을 수 있으므로 스크립트가 닫지 않는다.
same_open=$(osascript -e "with timeout of 120 seconds
tell application \"Microsoft PowerPoint\"
  set hits to 0
  repeat with p in presentations
    try
      if (name of p) is \"${pptx:t}\" then set hits to hits + 1
    end try
  end repeat
  return hits
end tell
end timeout" 2>/dev/null || echo 0)
if [[ $same_open != 0 ]]; then
  echo "PowerPoint에 ${pptx:t}가 열려 있다. 그 창을 닫은 뒤 다시 실행한다."
  echo "(열린 창의 내용은 렌더 전의 것일 수 있어 그대로 내보내면 옛 덱이 PDF로 나온다."
  echo " 다른 파일이 열려 있는 것은 상관없다.)"
  exit 1
fi

osascript -e "with timeout of ${TIMEOUT:-600} seconds
tell application \"Microsoft PowerPoint\"
  open POSIX file \"${pptx:A}\"
  delay ${DELAY:-8}
  set target to presentation \"${pptx:t}\"
  save target in POSIX file \"$pdf\" as save as PDF
  delay 2
  close target saving no
end tell
end timeout" >/dev/null 2>&1 || true

if [[ ! -s $pdf ]]; then
  echo "PDF 내보내기 실패."
  # PowerPoint는 샌드박스 앱이다. 자기 컨테이너 밖 폴더에 파일을 **만들** 때는 「파일 액세스 부여」
  # 창을 띄우고 사람이 고를 때까지 모든 AppleEvent가 막힌다(-9074·-50으로 보인다). 열기는
  # `open POSIX file`이 그 파일 하나에 대한 의사로 통하지만, 쓰기는 폴더 권한이 필요하다.
  if osascript -e 'tell application "System Events" to tell process "Microsoft PowerPoint" to name of windows' 2>/dev/null | grep -q "파일 액세스 부여"; then
    echo "PowerPoint에 「파일 액세스 부여」 창이 떠 있다. 사람이 한 번 허용해야 한다:"
    echo "  [선택...]을 누르고 $repo/out 폴더를 고른다. 한 번 허용하면 이후 세션에서는 묻지 않는다."
  else
    echo "TIMEOUT을 늘려 다시 실행한다. 창이 떠 있으면 먼저 처리한다."
  fi
  exit 1
fi
pages=$(pdfinfo $pdf | awk '/^Pages:/ {print $2}')
if (( $# == 0 )); then
  echo "$name: ${pages}장. 볼 장을 지정한다(예: 3 8-10)."
  exit 0
fi
for spec in "$@"; do
  first=${spec%-*}; last=${spec#*-}
  pdftoppm -r ${DPI:-50} -png -f $first -l $last $pdf $out/p
done
echo "$name: ${pages}장 중 $# 범위 → $out"
ls $out/*.png
