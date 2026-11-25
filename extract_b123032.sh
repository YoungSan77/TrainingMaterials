#!/usr/bin/env bash
set -euo pipefail

COMMIT=b123032
DEST="${1:-$(pwd)/review-b123032}"
ARCHIVE="${DEST}.zip"
FILES=(
  'portfolio/governance.md'
  'guides/과정_설계_지침.md'
  'guides/커리큘럼_작성_지침.md'
  'guides/교재_작성_지침.md'
  'courses/ooad/ooad-curriculum.md'
  'courses/ooad/sessions/s01-detailed-design.md'
  'courses/ooad/sessions/s02-detailed-design.md'
)

if ! git rev-parse --verify "${COMMIT}^{commit}" >/dev/null 2>&1; then
  echo "Missing commit: $COMMIT" >&2
  exit 1
fi
if [[ -e "$DEST" || -e "$ARCHIVE" ]]; then
  echo "Refusing to overwrite existing output: $DEST or $ARCHIVE" >&2
  exit 1
fi
mkdir -p "$DEST"

echo -e 'path\tgit_sha256\textracted_sha256\tstatus' > "$DEST/SHA256_VERIFICATION.tsv"
for path in "${FILES[@]}"; do
  mkdir -p "$DEST/$(dirname "$path")"
  git show "${COMMIT}:${path}" > "$DEST/$path"
  if command -v shasum >/dev/null 2>&1; then
    source_sha=$(git show "${COMMIT}:${path}" | shasum -a 256 | awk '{print $1}')
    extracted_sha=$(shasum -a 256 "$DEST/$path" | awk '{print $1}')
  else
    source_sha=$(git show "${COMMIT}:${path}" | sha256sum | awk '{print $1}')
    extracted_sha=$(sha256sum "$DEST/$path" | awk '{print $1}')
  fi
  [[ "$source_sha" == "$extracted_sha" ]] || { echo "SHA-256 FAIL: $path" >&2; exit 1; }
  printf '%s\t%s\t%s\tPASS\n' "$path" "$source_sha" "$extracted_sha" >> "$DEST/SHA256_VERIFICATION.tsv"
done

(cd "$(dirname "$DEST")" && zip -q -r "$ARCHIVE" "$(basename "$DEST")")
echo "Extraction path: $DEST"
echo "File count: ${#FILES[@]}"
echo "SHA-256: ALL PASS"
echo "ZIP: $ARCHIVE"
