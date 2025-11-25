#!/bin/bash

echo "🚀 BeatsChain BeatNFT Deployment Script"
echo "======================================="

cd packages/hardhat

echo "📋 Checking wallet balance..."
npx hardhat run deploy-with-gas-check.js --network sepolia

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "🔧 Don't forget to:"
    echo "1. Update NEXT_PUBLIC_CONTRACT_ADDRESS in packages/app/.env.local"
    echo "2. Update contract address in your frontend code"
    echo "3. Test the contract functionality"
else
    echo ""
    echo "❌ Deployment failed. Make sure you have:"
    echo "1. Sufficient Sepolia ETH in your wallet"
    echo "2. Valid Infura API key"
    echo "3. Correct deployer private key"
fi