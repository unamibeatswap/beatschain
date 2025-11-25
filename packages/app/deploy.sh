#!/bin/bash

# BeatsChain Deployment Script
# This script handles the deployment process for BeatsChain

ENV=${1:-production}
echo "🚀 Deploying BeatsChain to $ENV environment"
echo "========================================"

# Check if environment is valid
if [[ "$ENV" != "production" && "$ENV" != "staging" ]]; then
  echo "❌ Invalid environment. Use 'production' or 'staging'"
  exit 1
fi

# Build the application
echo "🔨 Building application..."
yarn build

if [ $? -ne 0 ]; then
  echo "❌ Build failed. Aborting deployment."
  exit 1
fi

# Run tests
echo "🧪 Running tests..."
node scripts/test-dynamic-pages.js

if [ $? -ne 0 ]; then
  echo "⚠️ Tests failed. Do you want to continue with deployment? (y/n)"
  read -r continue
  if [[ "$continue" != "y" && "$continue" != "Y" ]]; then
    echo "❌ Deployment aborted."
    exit 1
  fi
fi

# Deploy to the specified environment
echo "📦 Deploying to $ENV..."

if [ "$ENV" == "production" ]; then
  # Production deployment
  echo "🚀 Deploying to production..."
  yarn deploy:production
else
  # Staging deployment
  echo "🚀 Deploying to staging..."
  yarn deploy:staging
fi

if [ $? -ne 0 ]; then
  echo "❌ Deployment failed."
  exit 1
fi

echo "✅ Deployment to $ENV completed successfully!"
echo ""
echo "🔍 Post-deployment tasks:"
echo "1. Verify all pages are loading correctly"
echo "2. Check that Sanity content is displayed properly"
echo "3. Test navigation and links"
echo "4. Monitor error logs for any issues"