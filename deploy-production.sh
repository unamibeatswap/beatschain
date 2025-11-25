#!/bin/bash

# BeatsChain Production Deployment Script
set -e

echo "🚀 Starting BeatsChain Production Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the project root"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --frozen-lockfile

# Build the application
echo "🔨 Building application..."
cd packages/app
npm run build

# Run tests (if they exist)
if [ -f "package.json" ] && grep -q "test" package.json; then
    echo "🧪 Running tests..."
    npm test
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
npx vercel --prod

# Deploy MCP Server (if configured)
if [ -f "../mcp-server/package.json" ]; then
    echo "🔧 Deploying MCP Server..."
    cd ../mcp-server
    # Add your MCP server deployment logic here
    # Example: heroku deploy or docker deploy
fi

echo "✅ Deployment completed successfully!"
echo "🔗 Your app should be live at: https://beatschain.app"