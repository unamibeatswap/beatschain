#!/bin/bash

# Clean cache to reduce memory usage
echo "🧹 Cleaning Next.js cache..."
rm -rf .next/cache

# Increase Node.js memory limit for build process
export NODE_OPTIONS="--max-old-space-size=4096 --max-semi-space-size=64"

# Run Next.js build with production optimization in stages
echo "🔧 Building with increased memory limit and optimizations..."

# First pass - compile only
echo "📦 Stage 1: Compiling..."
NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production next build --no-lint || exit 1

echo "✅ Build completed successfully!"