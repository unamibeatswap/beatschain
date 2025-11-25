#!/bin/bash

echo "🚀 BeatsChain Manual Deployment Helper"
echo "====================================="

# Check for Vercel CLI
if ! command -v vercel &> /dev/null; then
  echo "❌ Vercel CLI not found. Installing..."
  npm install -g vercel
fi

# Build the app with optimized settings
echo "🔧 Building app with optimized settings..."
cd packages/app
export NODE_OPTIONS="--max-old-space-size=4096"
yarn build

# Prepare for deployment
echo "📦 Preparing for deployment..."
cd ../..

# Deploy to Vercel
echo "🚀 Ready for manual deployment!"
echo ""
echo "Run the following commands to deploy:"
echo "1. vercel login"
echo "2. vercel --prod"
echo ""
echo "Or deploy via Vercel dashboard: https://vercel.com/import"
echo ""
echo "Don't forget to set up your environment variables in Vercel!"