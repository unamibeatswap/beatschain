# 🚀 Deploy BeatNFT Contract - Step by Step

## **Prerequisites**

1. **Get your wallet private key** (the one that owns 0xc84799A904EeB5C57aBBBc40176E7dB8be202C10)
2. **Get Infura API key** from https://infura.io (free account)
3. **Ensure you have Sepolia ETH** for gas fees

## **Step 1: Set Environment Variables**

Add these to `packages/app/.env.local`:

```bash
# Replace with your actual private key (without 0x prefix)
DEPLOYER_KEY=your_private_key_here

# Replace with your Infura project ID
NEXT_PUBLIC_INFURA_KEY=your_infura_project_id
```

## **Step 2: Install Dependencies**

```bash
cd packages/hardhat
npm install
```

## **Step 3: Compile Contract**

```bash
npm run build
```

## **Step 4: Deploy to Sepolia**

```bash
npx hardhat run deploy-beatnft.js --network sepolia
```

## **Step 5: Update Frontend**

After successful deployment, update these files:

### **A. Update .env.local**
```bash
# Replace 0x0000... with your deployed contract address
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

### **B. Update BeatNFT.ts**
```typescript
// In packages/app/src/contracts/BeatNFT.ts
export const BeatNFTAddress = {
  1: '0x0000000000000000000000000000000000000000', // Mainnet (later)
  11155111: '0xYourDeployedContractAddress', // Sepolia
  31337: '0x5FbDB2315678afecb367f032d93F642f64180aa3' // Local
}
```

## **Alternative: Deploy with Ignition**

```bash
npm run deploy:beatnft
```

## **Verify Deployment**

Check your contract on Sepolia Etherscan:
https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS

## **Test Contract**

```bash
# Test locally first
npx hardhat console --network sepolia

# In console:
const BeatNFT = await ethers.getContractFactory('BeatNFT')
const contract = BeatNFT.attach('YOUR_CONTRACT_ADDRESS')
await contract.name() // Should return "BeatNFT"
await contract.platformFeePercentage() // Should return 1500 (15%)
```

## **Troubleshooting**

### **Error: Insufficient funds**
- Add Sepolia ETH to your wallet: https://sepoliafaucet.com

### **Error: Invalid private key**
- Ensure private key is without 0x prefix
- Check the key corresponds to your wallet address

### **Error: Network connection**
- Verify Infura API key is correct
- Check internet connection

## **Quick Deploy Commands**

```bash
# Navigate to hardhat directory
cd packages/hardhat

# Deploy in one command
DEPLOYER_KEY=your_key NEXT_PUBLIC_INFURA_KEY=your_infura_key npx hardhat run deploy-beatnft.js --network sepolia
```

## **Success Indicators**

✅ Contract deployed successfully  
✅ Contract name is "BeatNFT"  
✅ Platform fee is 1500 (15%)  
✅ Owner is your wallet address  
✅ Contract verified on Etherscan  

---

**Ready to deploy? Run the commands above!** 🚀