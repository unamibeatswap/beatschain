# Deploying to Sepolia Testnet

This guide explains how to safely deploy the BeatNFTCreditSystem contract to the Sepolia testnet.

## Prerequisites

1. **Sepolia ETH**
   - You need Sepolia ETH for gas fees
   - Get from a faucet like https://sepoliafaucet.com/

2. **Infura API Key**
   - Sign up at https://infura.io/
   - Create a new project and get the API key

3. **Etherscan API Key**
   - Sign up at https://etherscan.io/
   - Create a new API key in your account settings

4. **Secure Private Key**
   - Create a new wallet specifically for Sepolia deployments
   - **NEVER** use your main wallet or hardhat default accounts

## Setup

1. **Create .env file**

   Create a `.env` file in the `packages/hardhat` directory with the following content:

   ```
   DEPLOYER_KEY=your_private_key_here_without_0x_prefix
   NEXT_PUBLIC_INFURA_KEY=your_infura_key_here
   NEXT_PUBLIC_ETHERSCAN_API_KEY=your_etherscan_key_here
   ```

   Replace the placeholders with your actual keys.

2. **Install dependencies**

   ```bash
   cd packages/hardhat
   npm install
   ```

## Deployment

1. **Deploy the contract**

   ```bash
   cd packages/hardhat
   npx hardhat run deploy-sepolia.js --network sepolia
   ```

2. **Verify the contract on Etherscan**

   After deployment, verify the contract using the command provided in the deployment output:

   ```bash
   npx hardhat verify --network sepolia CONTRACT_ADDRESS OWNER_ADDRESS
   ```

   Replace `CONTRACT_ADDRESS` and `OWNER_ADDRESS` with the values from the deployment output.

3. **Update frontend configuration**

   Update the contract address in your frontend code:

   ```typescript
   // In packages/app/src/hooks/useBeatNFT.enhanced.ts
   const BeatNFTCreditSystemAddress = {
     1: '0x0000000000000000000000000000000000000000', // Mainnet - not deployed
     11155111: 'YOUR_NEW_CONTRACT_ADDRESS', // Sepolia - deployed
     31337: '0x5fbdb2315678afecb367f032d93f642f64180aa3' // Local - deployed
   } as const
   ```

## Testing

After deployment, test the contract by:

1. Connecting to Sepolia in your frontend
2. Purchasing credits
3. Upgrading to Pro NFT
4. Verifying that credits are correctly tracked

## Security Considerations

- **NEVER** commit your `.env` file to Git
- Use a dedicated wallet for testnet deployments
- Keep minimal funds in your testnet wallet
- Regularly rotate your private keys

## Troubleshooting

- **Insufficient funds**: Make sure your wallet has enough Sepolia ETH
- **Nonce too high**: Reset your account in MetaMask
- **Contract verification fails**: Double-check the constructor arguments

For more help, see the [Hardhat documentation](https://hardhat.org/hardhat-runner/docs/guides/deploying).