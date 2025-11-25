# BeatSwap Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Run Setup Script
```bash
./setup.sh
```

### 2. Configure Environment Variables

Edit `packages/app/.env.local`:

**Required:**
```env
# Get from https://cloud.walletconnect.com/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

**Firebase (for full functionality):**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Start Development
```bash
yarn dev
```

This starts:
- Frontend: http://localhost:3000
- Hardhat node: http://localhost:8545

### 4. Deploy Smart Contract (Optional)
```bash
cd packages/hardhat
npx hardhat ignition deploy ./ignition/modules/BeatNFT.ts --network localhost
```

## 🔗 Essential Links

- **WalletConnect Cloud**: https://cloud.walletconnect.com/
- **Firebase Console**: https://console.firebase.google.com/
- **Sanity Studio**: Already configured with project ID `3tpr4tci`

## 🎯 What's Included

✅ **Web3 Integration**
- Wallet connection (MetaMask, WalletConnect, etc.)
- Smart contract interaction
- SIWE authentication

✅ **Smart Contracts**
- BeatNFT contract with royalty support
- Deployment scripts
- Test framework

✅ **Frontend Foundation**
- Next.js 14 with App Router
- Tailwind CSS + daisyUI
- TypeScript support

✅ **Backend Services**
- Firebase configuration
- Sanity CMS integration
- IPFS setup for NFT metadata

## 🛠️ Development Workflow

1. **Frontend Development**: Work in `packages/app/src/`
2. **Smart Contracts**: Develop in `packages/hardhat/contracts/`
3. **Content Management**: Use Sanity Studio for CMS
4. **Testing**: Run `yarn test` for contract tests

## 📋 Next Steps

Follow the [Implementation Plan](./IMPLEMENTATION_PLAN1.md) to build out:

1. **Authentication System** - Firebase + SIWE integration
2. **Beat Upload** - Audio file handling and metadata
3. **Marketplace** - Browse, search, and purchase beats
4. **NFT Minting** - Convert beats to NFTs with royalties
5. **Dashboards** - Producer, buyer, and admin interfaces

## 🆘 Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Review the [Implementation Plan](./IMPLEMENTATION_PLAN1.md) for development roadmap
- Create an issue if you encounter problems

Happy coding! 🎵