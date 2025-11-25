#!/bin/bash
echo "🧹 BeatsChain Housekeeping"
rm -rf packages/app/.next/
rm -rf *.log packages/app/*.log
mkdir -p docs/archive/
mv CRITICAL_FIXES_*.md PRODUCTION_*.md PLAN_*.md SERVER_STATUS.md docs/archive/ 2>/dev/null || true
echo "✅ Cleanup complete!"
