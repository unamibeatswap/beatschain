#!/bin/bash

echo "🔧 BeatsChain Vercel Environment Setup"
echo "====================================="

# Check for Vercel CLI
if ! command -v vercel &> /dev/null; then
  echo "❌ Vercel CLI not found. Installing..."
  npm install -g vercel
fi

# Ensure logged in
echo "🔑 Ensuring you're logged in to Vercel..."
vercel whoami || vercel login

# Get project name
read -p "Enter your Vercel project name: " PROJECT_NAME

# Set environment variables from .env.local if it exists
if [ -f "packages/app/.env.local" ]; then
  echo "📝 Setting environment variables from .env.local..."
  while IFS= read -r line || [[ -n "$line" ]]; do
    # Skip comments and empty lines
    [[ $line =~ ^#.*$ ]] && continue
    [[ -z "$line" ]] && continue
    
    # Extract key and value
    key=$(echo "$line" | cut -d '=' -f 1)
    value=$(echo "$line" | cut -d '=' -f 2-)
    
    # Set environment variable in Vercel
    echo "Setting $key..."
    vercel env add "$key" production <<< "$value"
  done < "packages/app/.env.local"
else
  echo "⚠️ No .env.local file found. Please set environment variables manually."
  echo "Required environment variables:"
  cat packages/app/vercel.env.example
fi

echo ""
echo "✅ Environment setup complete!"
echo ""
echo "You can now deploy your project with:"
echo "vercel --prod"