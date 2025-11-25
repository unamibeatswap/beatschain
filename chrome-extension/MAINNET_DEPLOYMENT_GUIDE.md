# BeatsChain Mainnet Deployment Guide
**Date**: October 6, 2025  
**Status**: Production Ready - Awaiting Real MATIC  
**Target Network**: Polygon Mainnet (Chain ID: 137)

---

## 🎯 Current Status
- ✅ Code updated for Polygon mainnet
- ✅ RPC endpoints configured for production
- ✅ Contract ready for deployment
- ⏳ **PENDING**: Real MATIC acquisition
- ⏳ **PENDING**: Contract deployment via Thirdweb

---

## 💰 Step 1: Acquire Real MATIC

### Your Wallet Address
```
0xc84799A904EeB5C57aBBBc40176E7dB8be202C10
```

### Option A: Centralized Exchanges
1. **Coinbase**
   - Buy MATIC directly
   - Withdraw to your wallet address above
   - Network: Polygon (not Ethereum)

2. **Binance**
   - Purchase MATIC
   - Withdraw via Polygon network
   - Lower fees than Ethereum

3. **Kraken**
   - Buy MATIC
   - Withdraw to Polygon network

### Option B: DEX/Bridge
1. **Polygon Bridge** (bridge.polygon.technology)
   - Bridge ETH from Ethereum to Polygon
   - Converts to MATIC automatically

2. **Uniswap** (on Polygon)
   - Swap other tokens for MATIC
   - Requires existing Polygon tokens

### Required Amount
- **Contract Deployment**: ~0.01-0.05 MATIC
- **Testing Mints**: ~0.001 MATIC per mint
- **Recommended**: 0.1 MATIC total

---

## 🚀 Step 2: Deploy Contract via Thirdweb

### Access Thirdweb Dashboard
1. Go to `https://thirdweb.com/dashboard`
2. Connect wallet: `0xc84799A904EeB5C57aBBBc40176E7dB8be202C10`
3. Ensure wallet is on **Polygon Mainnet**

### Create NFT Collection
**Navigation**: Dashboard → Create → NFT Collection

#### Collection Info
```
Name: BeatsChain Music NFTs
Symbol: BEATS
Chain: Polygon (Mainnet)
Description: Decentralized music NFT collection with AI-generated licensing for beat creators and artists
```

#### Social URLs
```
Website: https://beatschain.app
Twitter: [Your Twitter handle]
```

#### Admin Settings
```
Admin Wallet: 0xc84799A904EeB5C57aBBBc40176E7dB8be202C10
```

#### Sales & Fees
```
Primary Sales Recipient: 0xc84799A904EeB5C57aBBBc40176E7dB8be202C10
Royalty Recipient: 0xc84799A904EeB5C57aBBBc40176E7dB8be202C10
Royalty Percentage: 5.00%
```

### Deploy Contract
1. Review all settings
2. Click **"Deploy Now"**
3. Confirm transaction in wallet
4. **COPY THE DEPLOYED CONTRACT ADDRESS**

---

## 🔧 Step 3: Update BeatsChain Configuration

### Update Contract Address
Replace in `/lib/config.js`:
```javascript
CONTRACT_ADDRESS: 'PASTE_DEPLOYED_CONTRACT_ADDRESS_HERE'
```

### Verify RPC Configuration
Ensure these mainnet endpoints are active:
```javascript
RPC_URL: 'https://polygon-mainnet.g.alchemy.com/v2/YourAlchemyKey'
RPC_FALLBACK_1: 'https://rpc.ankr.com/polygon'
RPC_FALLBACK_2: 'https://polygon-rpc.com'
RPC_FALLBACK_3: 'https://rpc-mainnet.matic.network'
```

---

## 🧪 Step 4: Test Production Deployment

### Test Mint Process
1. Load BeatsChain extension
2. Upload a test beat file
3. Generate AI licensing
4. Execute mint transaction
5. Verify on Polygonscan.com

### Verification Checklist
- [ ] Contract deployed successfully
- [ ] Contract address updated in config
- [ ] Test mint completes
- [ ] NFT appears on OpenSea
- [ ] Transaction visible on Polygonscan
- [ ] Metadata loads correctly
- [ ] Audio file plays from IPFS

---

## 📊 Production Monitoring

### Key URLs (Update after deployment)
```
Contract: https://polygonscan.com/address/[CONTRACT_ADDRESS]
OpenSea: https://opensea.io/collection/beatschain-music-nfts
Explorer: https://polygonscan.com/
```

### Transaction Costs (Mainnet)
- Contract deployment: ~$0.50-2.00 USD
- NFT mint: ~$0.05-0.20 USD per mint
- Gas optimization: Use during low network activity

### Free Minting Options
**Option 1: Gasless Transactions (Recommended)**
- Use Thirdweb Engine gasless API
- You sponsor gas fees for users
- Users sign without paying
- Cost: ~$0.05-0.20 per mint (your expense)

**Option 2: Testnet for MVP**
- Deploy on Polygon Amoy (free)
- Perfect for Chrome AI Challenge
- Real blockchain experience, no costs
- Switch to mainnet post-contest

**Option 3: Freemium Model**
- First mint free (sponsored)
- Additional mints: user pays
- Marketing budget covers initial users

---

## 🚨 Critical Notes

### Security
- Never share private keys
- Verify contract address before transactions
- Test with small amounts first

### Backup Plan
- Keep testnet version for development
- Document all contract addresses
- Maintain fallback RPC endpoints

### Support Resources
- Thirdweb Discord: discord.gg/thirdweb
- Polygon Support: polygon.technology/support
- BeatsChain Issues: GitHub repository

---

## 📅 Deployment Timeline

**Target Date**: Within 48 hours of MATIC acquisition  
**Dependencies**: 
1. Real MATIC in wallet (0.1 MATIC minimum)
2. Stable internet connection
3. Thirdweb dashboard access

**Post-Deployment**:
- Update README with live contract address
- Submit to Chrome Web Store
- Announce on social media
- Begin user onboarding

---

**Last Updated**: October 6, 2025  
**Next Review**: After successful deployment  
**Contact**: [Your contact information]