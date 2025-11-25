#!/bin/bash

echo "🔧 BeatsChain Deployment Fix Script"
echo "=================================="

# Navigate to app directory
cd packages/app

echo "1. 📦 Installing dependencies..."
npm install

echo "2. 🔧 Setting up environment variables..."
# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ .env.production not found!"
    exit 1
fi

echo "3. 🧹 Cleaning build cache..."
rm -rf .next
rm -rf node_modules/.cache

echo "4. 🏗️ Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Deployment fixes applied:"
    echo "   - Fixed dynamic server usage in layout.tsx"
    echo "   - Added dynamic rendering for blog and CMS pages"
    echo "   - Improved Firebase Admin error handling"
    echo "   - Added missing Sanity environment variables"
    echo "   - Optimized Next.js configuration"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Update Vercel environment variables with Sanity config"
    echo "   2. Redeploy the application"
    echo "   3. Test blog and CMS pages"
else
    echo "❌ Build failed! Check the errors above."
    exit 1
fi