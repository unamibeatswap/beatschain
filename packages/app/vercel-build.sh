#!/bin/bash

# This script is specifically for Vercel deployment

# Clean cache to reduce memory usage
echo "🧹 Cleaning Next.js cache..."
rm -rf .next/cache

# Set environment variables for optimization
export NODE_OPTIONS="--max-old-space-size=4096"
export NEXT_TELEMETRY_DISABLED=1
export NODE_ENV=production

# Build in production mode with minimal output
echo "🔧 Building for Vercel deployment..."
npx next build --no-lint || exit 1

echo "✅ Vercel build completed!"