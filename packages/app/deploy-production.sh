#!/bin/bash

echo "🚀 BeatsChain Production Deployment"
echo "=================================="

# Check environment
if [ -z "$VERCEL_TOKEN" ]; then
    echo "❌ VERCEL_TOKEN not set"
    exit 1
fi

# Use production config
cp next.config.production.js next.config.js

# Build with production settings
echo "📦 Building for production..."
npm run build

# Check build success
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
npx vercel --prod --token $VERCEL_TOKEN

echo "✅ Deployment complete!"
echo "🌐 Live at: https://beatschain.vercel.app"