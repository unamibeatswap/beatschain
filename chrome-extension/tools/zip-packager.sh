#!/usr/bin/env bash
set -euo pipefail

# Simple ZIP packager following core ZIP rules (local testing helper)
# Usage: ./tools/zip-packager.sh <source-folder> <output-zip>
# Source folder should already follow BeatsChain ZIP structure (audio/, images/, metadata/, samro/, contact/, biography/)

SRC="$1"
OUT="$2"

if [ ! -d "$SRC" ]; then
  echo "Source folder not found: $SRC"
  exit 2
fi

# Basic validations
MAX_AUDIO_BYTES=$((50 * 1024 * 1024)) # 50 MB
ALLOWED_MIMES=("audio/mpeg" "audio/wav" "audio/x-wav" "audio/flac" "image/jpeg" "image/png" "application/pdf" "text/plain" "application/json" "text/csv" "text/vcard" "text/vcf" "application/xml" "text/xml")

check_mime() {
  local file="$1"
  mime=$(file --mime-type -b "$file" 2>/dev/null || echo "unknown")
  for a in "${ALLOWED_MIMES[@]}"; do
    if [ "$mime" = "$a" ]; then
      return 0
    fi
  done
  # allow generic text/*
  if [[ "$mime" == text/* ]]; then
    return 0
  fi
  return 1
}

# Iterate files and validate
bad=0
while IFS= read -r -d '' f; do
  rel=${f#$SRC/}
  echo "Validating: $rel"
  size=$(stat -c%s "$f")
  # audio size check
  if [[ "$rel" == audio/* ]]; then
    if (( size > MAX_AUDIO_BYTES )); then
      echo "ERROR: audio file too large: $rel ($size bytes)"
      bad=1
    fi
  fi
  if ! check_mime "$f"; then
    echo "WARNING: Unrecognized/unsupported MIME for $rel: $(file --mime-type -b "$f")"
  fi
  # sanitize filenames - disallow control chars
  if [[ "$rel" =~ [[:cntrl:]] ]]; then
    echo "ERROR: Control characters in filename: $rel"
    bad=1
  fi
done < <(find "$SRC" -type f -print0)

if (( bad != 0 )); then
  echo "Validation failed; aborting zip creation. Fix the issues above."
  exit 3
fi

# Create zip
rm -f "$OUT"
( cd "$SRC" && zip -r "$OUT" . )

echo "ZIP created: $OUT"
exit 0
