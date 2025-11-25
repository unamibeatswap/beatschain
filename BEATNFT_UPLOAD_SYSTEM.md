# 🧠 Amazon Q Prompt: Implement “BeatNFT Upload Credit System” in BeatsChain

---

> 🔧 **Goal:**  
Enhance the existing BeatsChain platform with a **Web3-native upload system** called **“BeatNFT Upload Credit System”**.  
This system uses `BeatNFTs` (on-chain tokens) as upload credits instead of subscription billing (no Stripe, no Firebase Auth/Storage for uploads).  

> ❗ **NOTE**: Do not remove or break existing architecture — **Sanity, IPFS, WalletConnect, and Next.js structure must remain unchanged**. This is an enhancement, not a rewrite.

---

## 🧱 Stack & Tech (Current)

- Frontend: `Next.js` + `TailwindCSS`
- Wallet connection: `WalletConnect` + `wagmi`
- CMS: `Sanity`
- Storage: `IPFS` via NFT.storage / Pinata
- Auth: Web3 wallet login (no Firebase)
- NFT logic: EVM-compatible (Polygon/Base preferred)
- Beat metadata: stored in Sanity and/or IPFS JSON

---

## 🎯 New System Name: BeatNFT Upload Credit System

---

### ✅ Core Concept

- Uploads are **paid using BeatNFTs** instead of subscriptions.
- Producers get a wallet-based credit system using:
  - `BeatNFT` tokens (ERC-1155 or 721)
  - Optional `ProNFT` token for unlimited access
- Each token = 1 upload credit, burned or locked per upload

---

## 🎚️ Upload Credit System Logic

| Upload Type        | BeatNFTs Required | File Size Limit | File Format     |
|--------------------|-------------------|------------------|-----------------|
| MP3 (Preview/Demo) | 1 BeatNFT         | ≤ 10MB           | .mp3            |
| WAV (Studio-ready) | 2 BeatNFTs        | ≤ 100MB          | .wav            |
| WAV + STEMs (ZIP)  | 3–5 BeatNFTs      | ≤ 500MB          | .zip (multi-track stems) |

---

## 🔓 Access & Tier System

| Tier        | NFT Needed         | Upload Limit      | UX Behavior                            |
|-------------|--------------------|-------------------|----------------------------------------|
| Free Tier   | 10 Free BeatNFTs   | 10 MP3 uploads    | Can upload MP3 only, show balance      |
| Pro Tier    | 1 ProNFT (once)    | Unlimited uploads | All formats, no token check required   |
| Out of Tokens | None             | 0                 | Show modal to buy or upgrade to Pro    |

---

## 🛒 How Users Acquire BeatNFTs

| Method        | Details                                 |
|---------------|-----------------------------------------|
| 🎁 Free       | 10 tokens minted on signup              |
| 💰 Purchase   | Buy via smart contract (ETH or ZAR)     |
| 🎯 Earn       | Referral, beat sales, contests, etc.    |

---

## 📦 NFT Metadata Example (per Beat)

```json
{
  "title": "Trap Banger",
  "bpm": 140,
  "key": "Gm",
  "licensePrices": {
    "basic": 399,
    "premium": 1199,
    "exclusive": 3999
  },
  "file_type": "zip",
  "nft_cost": 3,
  "ipfs_url": "ipfs://Qm..."
}
```

---

## 🧩 UI Enhancements (No Breaking Changes)

### ✅ Subscription Page
- Replace Stripe plans with 2 cards:
  - **Free Tier (10 tokens)**
  - **Pro NFT Tier (unlimited uploads)**
- Add token balance display using wagmi + ethers

### ✅ Upload Component
- New logic:
  - Detect file format → assign token cost
  - Check wallet for `BeatNFT` balance
  - Burn tokens or block upload if insufficient
  - If `ProNFT` is found → bypass all checks

### ✅ Purchase/Upgrade Modal
- When upload fails due to lack of tokens:
  - Show “Buy BeatNFTs” or “Upgrade to Pro”
  - Link to minting smart contract UI

---

## 🛠 Suggested Components/Modules

- `useBeatNFT.ts`: Custom React hook to:
  - Check balance
  - Burn tokens
  - Detect ProNFT

- `BuyBeatNFT.tsx`: Simple minting UI
  - Accept ETH/ZAR
  - Mint NFTs to wallet

- `UploaderGate.tsx`: Wrapper to enforce BeatNFT logic before uploads

- `SubscriptionPage.tsx`: Revamped UI for Free vs Pro tier

---

## 🚫 What NOT to Change

- ❌ No Firebase or Stripe logic needed anymore (can be commented but preserved)
- ❌ Do not remove Sanity usage (metadata, categories, tags remain in use)
- ❌ IPFS upload process remains as-is — just conditionally gated by NFTs

---

## 📈 Optional: Metrics & Scaling

- Add logic to estimate how much IPFS storage is being used
- Cap Free Tier total size (e.g. 250MB max lifetime unless Pro)
- Limit daily uploads to 5/day (rate limit UI)

---

## ✅ IMPLEMENTATION STATUS: COMPLETE

### 🎉 Successfully Delivered:
- ✅ **Updated Subscription Page** - BeatNFT credit system live
- ✅ **BeatNFT Logic Integrated** - Upload credit validation working
- ✅ **Token Purchase Flow** - BuyBeatNFTModal fully functional
- ✅ **NFT-Gated Upload Control** - Free/Pro tier system operational
- ✅ **Beat Metadata Updates** - Credit cost tracking implemented
- ✅ **Mobile Optimization** - Responsive design complete
- ✅ **Error Handling** - Comprehensive user feedback

### 📊 Live Features:
```typescript
// Production-Ready Components
✅ useBeatNFT.ts         → Credit management hook
✅ BuyBeatNFTModal.tsx   → Purchase interface
✅ Upload Integration    → Credit validation & consumption
✅ Subscription Overhaul → Web3-native billing display
```

### 🚀 Current Status: **PRODUCTION LIVE**
**Implementation Date**: December 2024  
**System Status**: Fully Operational  
**User Impact**: Zero Breaking Changes  
**Performance**: Optimized & Mobile-Ready  

---

*See `WEB3_BEATNFT_IMPLEMENTATION_COMPLETE.md` for detailed implementation documentation.*