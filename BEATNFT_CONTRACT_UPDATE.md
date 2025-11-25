# BeatNFT Contract Update - 15% Platform Fee

## **Contract Changes Made**

### **1. NFT Name Updated**
```solidity
// OLD
ERC721("BeatSwap NFT", "BEAT")

// NEW  
ERC721("BeatNFT", "BEATNFT")
```

### **2. Platform Fee Updated to 15%**
```solidity
// OLD
uint256 public platformFeePercentage = 250; // 2.5%

// NEW
uint256 public platformFeePercentage = 1500; // 15%
```

### **3. Fee Validation Updated**
```solidity
// OLD
require(_platformFeePercentage <= 1000, "Fee too high"); // Max 10%

// NEW
require(_platformFeePercentage <= 1500, "Fee too high"); // Max 15%
```

## **Deployment Required**

The contract needs to be redeployed with these changes:

1. **Deploy Updated Contract**
   ```bash
   cd packages/hardhat
   npx hardhat run scripts/deploy.js --network sepolia
   ```

2. **Update Frontend Contract Address**
   ```typescript
   // In packages/app/src/contracts/BeatNFT.ts
   export const BeatNFTAddress = {
     1: '0x[NEW_MAINNET_ADDRESS]',
     11155111: '0x[NEW_SEPOLIA_ADDRESS]',
     31337: '0x[NEW_LOCAL_ADDRESS]'
   }
   ```

3. **Verify Contract on Etherscan**
   ```bash
   npx hardhat verify --network sepolia [CONTRACT_ADDRESS] [CONSTRUCTOR_ARGS]
   ```

## **Gas Estimation Fix**

The gas estimation error should be resolved after:
1. Deploying the updated contract
2. Updating the contract address in the frontend
3. Ensuring the ABI matches the deployed contract

## **Revenue Split After Update**

With 15% platform fee:
- **Producer Earnings**: 85% of sale price
- **Platform Fee**: 15% of sale price
- **Royalties**: Deducted from producer earnings (if resale)

## **Testing Checklist**

After deployment:
- [ ] Contract deploys successfully
- [ ] Platform fee is set to 15% (1500 basis points)
- [ ] NFT name shows as "BeatNFT" 
- [ ] NFT symbol shows as "BEATNFT"
- [ ] Gas estimation works for transactions
- [ ] Minting works correctly
- [ ] Purchasing works with correct fee split
- [ ] Frontend displays correct contract data

## **Contract Verification**

To verify the contract is working correctly:

```javascript
// Check platform fee
await contract.platformFeePercentage() // Should return 1500

// Check NFT name
await contract.name() // Should return "BeatNFT"

// Check NFT symbol  
await contract.symbol() // Should return "BEATNFT"
```

---

**Status**: Ready for deployment with BeatNFT name and 15% platform fee