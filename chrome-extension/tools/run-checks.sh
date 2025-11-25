#!/usr/bin/env bash
set -euo pipefail

ROOT=$(dirname "$0")/.. 
cd "$ROOT"

echo "Running BeatsChain repo quick checks..."
FAIL=0

# 1) Check manifest: oauth2.client_id present, no activeTab/tabs permission
MANIFEST="$(jq -r .oauth2.client_id manifest.json 2>/dev/null || echo '')"
if [ -z "$MANIFEST" ]; then
  echo "[FAIL] manifest.json: oauth2.client_id missing or manifest.json invalid"
  FAIL=1
else
  echo "[PASS] manifest.json: oauth2.client_id present -> $MANIFEST"
fi

# check for activeTab or tabs
if jq -e '.permissions[]? | select(.=="activeTab" or .=="tabs")' manifest.json >/dev/null 2>&1; then
  echo "[FAIL] manifest.json: contains activeTab/tabs permission (remove for least privilege)"
  FAIL=1
else
  echo "[PASS] manifest.json: no activeTab/tabs permission"
fi

# 2) Check for unconditional bypass patterns (|| true) across popup and libs
BYPASS_OCCURRENCES=$(grep -RIn "|| true" -- "popup" "lib" || true)
if [ -n "$BYPASS_OCCURRENCES" ]; then
  echo "[WARN] Found occurrences of '|| true' (possible unconditional bypass). Inspect these lines:";
  echo "$BYPASS_OCCURRENCES"
else
  echo "[PASS] No '|| true' unconditional bypass found"
fi

# 3) Find potential guest/bypass functions
GUEST_PATTERNS=$(grep -RIn "enableGuestMode\|bypassAuth\|bypass mode\|guest_mode" -- "popup" "lib" || true)
if [ -n "$GUEST_PATTERNS" ]; then
  echo "[INFO] Guest/bypass related matches (review these for dev-only gating):";
  echo "$GUEST_PATTERNS"
else
  echo "[PASS] No guest/bypass patterns found"
fi

# 4) Check script load order in popup/index.html: wallet-secure-storage should be loaded before auth.js usage
IDX_FILE="popup/index.html"
WS_INDEX=$(grep -n "../lib/wallet-secure-storage.js" -n "$IDX_FILE" | cut -d: -f1 || true)
AUTH_INDEX=$(grep -n "../lib/auth.js" -n "$IDX_FILE" | cut -d: -f1 || true)
if [ -z "$WS_INDEX" ]; then
  echo "[FAIL] popup/index.html: wallet-secure-storage.js not included"
  FAIL=1
else
  echo "[INFO] popup/index.html: wallet-secure-storage.js at line $WS_INDEX"
fi
if [ -n "$WS_INDEX" ] && [ -n "$AUTH_INDEX" ]; then
  if [ "$WS_INDEX" -lt "$AUTH_INDEX" ]; then
    echo "[PASS] wallet-secure-storage.js appears before auth.js (good)"
  else
    echo "[WARN] wallet-secure-storage.js appears after auth.js; recommend loading storage before auth usage"
  fi
fi

# 5) Ensure zip rules doc exists
if [ -f "2025-10-22-09-58-ZIP-RULES-COMPREHENSIVE.md" ]; then
  echo "[PASS] ZIP rules doc found"
else
  echo "[FAIL] ZIP rules doc not found"
  FAIL=1
fi

# 6) Basic lint: look for remaining '|| true' anywhere else
ALL_TRUE=$(grep -RIn "\|\| true" --exclude-dir=.git || true)
if [ -n "$ALL_TRUE" ]; then
  echo "[WARN] Instances of '|| true' found (list):"
  echo "$ALL_TRUE"
fi

if [ "$FAIL" -ne 0 ]; then
  echo "\nOne or more critical checks failed. See messages above."
  exit 2
fi

echo "\nAll critical checks passed or reported non-critical warnings."
exit 0
