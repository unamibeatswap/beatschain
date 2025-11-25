#!/bin/bash

echo "🎵 BeatSwap Setup Script"
echo "========================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if yarn is installed
if ! command -v yarn &> /dev/null; then
    echo "❌ Yarn is not installed. Please install Yarn first."
    exit 1
fi

echo "✅ Node.js and Yarn are installed"

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

# Setup environment files
echo "⚙️  Setting up environment files..."
if [ ! -f "packages/app/.env.local" ]; then
    cp packages/app/.env.local packages/app/.env.local
    echo "✅ Created .env.local file"
    echo "⚠️  Please update the environment variables in packages/app/.env.local"
else
    echo "✅ .env.local already exists"
fi

# Install Hardhat dependencies
echo "🔨 Installing Hardhat dependencies..."
cd packages/hardhat
yarn install
cd ../..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update environment variables in packages/app/.env.local"
echo "2. Get a WalletConnect Project ID from https://cloud.walletconnect.com/"
echo "3. Configure Firebase project"
echo "4. Run 'yarn dev' to start development servers"
echo ""
echo "📚 Check README.md for detailed setup instructions"