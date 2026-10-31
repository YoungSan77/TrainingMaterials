#!/bin/zsh
# PowerPoint로 PPT를 PDF로 내보내고, 지정한 장만 PNG로 만든다(시각 검토용).
# 내보낸 PDF는 출력 폴더에 <sNN>.pdf로 함께 남는다 — 글의 좌표를 재려면 PNG가 아니라 이 파일을 쓴다.
# 자동 검사(오류·경고 0개)를 통과한 뒤, 도식·표·코드가 있는 장과 바뀐 장만 본다.
#
# 사용: tools/review-pdf.sh <sNN.md 또는 sNN.pptx> [장 번호 또는 범위 ...]
#   예: tools/review-pdf.sh courses/ooad/sessions/s12.md 8 10-12
#   장을 주지 않으면 장 수만 알려 주고 이미지는 만들지 않는다(전체 검토는 의도적으로 범위를 준다).
# 환경 변수: OUT(출력 폴더), DPI(기본 50), DELAY(열기 대기 초, 기본 12)
# 기본 출력 폴더는 저장소 안의 out/review/<sNN>이다(git 제외). 저장소 밖에 두면 LLM이 이미지를
# 읽지 못해(작업 폴더 밖 읽기 차단) 시각 검토를 할 수 없다.
set -euo pipefail
setopt null_glob

src=${1:?"사용: tools/review-pdf.sh <sNN.md|sNN.pptx> [장 ...]"}; shift
pptx=${src%.md}; pptx=${pptx%.pptx}.pptx
[[ -f $pptx ]] || { echo "없음: $pptx (먼저 렌더링한다)"; exit 1; }
name=${pptx:t:r}
box=~/Library/Containers/com.microsoft.Powerpoint/Data/Documents
tmp_pptx=$box/tm-review-$name.pptx
tmp_pdf=$box/tm-review-$name.pdf
repo=${0:A:h:h}
out=${OUT:-$repo/out/review/$name}
mkdir -p $out
rm -f $out/*.png $tmp_pdf
cp $pptx $tmp_pptx
trap 'rm -f $tmp_pptx $tmp_pdf' EXIT

# 다른 문서가 열려 있으면 active presentation이 그 문서가 되므로 먼저 모두 닫는다.
osascript -e "tell application \"Microsoft PowerPoint\"
  close every presentation saving no
  open POSIX file \"$tmp_pptx\"
  delay ${DELAY:-12}
  save active presentation in POSIX file \"$tmp_pdf\" as save as PDF
  close every presentation saving no
end tell" >/dev/null

[[ -s $tmp_pdf ]] || { echo "PDF 내보내기 실패 — DELAY를 늘려 다시 실행한다"; exit 1; }
# PDF도 함께 남긴다. 글이 놓인 자리는 이미지를 보는 것보다 `pdftotext -bbox`의 좌표로 재는 쪽이
# 정확하고 싸다(AGENTS.md 「수치가 답이면 먼저 잰다」).
cp $tmp_pdf $out/$name.pdf
pages=$(pdfinfo $tmp_pdf | awk '/^Pages:/ {print $2}')
if (( $# == 0 )); then
  echo "$name: ${pages}장. 볼 장을 지정한다(예: 3 8-10)."
  exit 0
fi
for spec in "$@"; do
  first=${spec%-*}; last=${spec#*-}
  pdftoppm -r ${DPI:-50} -png -f $first -l $last $tmp_pdf $out/p
done
echo "$name: ${pages}장 중 $# 범위 → $out"
ls $out/*.png
