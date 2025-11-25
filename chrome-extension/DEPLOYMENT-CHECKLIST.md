
# BeatsChain Deployment Checklist

## Pre-Deployment Setup

### Ethereum (Polygon Mumbai)
- [ ] Install Hardhat: `npm install --save-dev hardhat`
- [ ] Configure networks in hardhat.config.js
- [ ] Set up private key in .env (TEST_WALLET_PRIVATE_KEY)
- [ ] Get Mumbai MATIC from faucet: https://faucet.polygon.technology/
- [ ] Deploy contract: `npx hardhat run scripts/deploy.js --network mumbai`
- [ ] Verify contract on PolygonScan
- [ ] Update CONTRACT_ADDRESS in .env

### Solana (Devnet)
- [ ] Install Solana CLI: https://docs.solana.com/cli/install-solana-cli-tools
- [ ] Install Anchor: `npm install -g @coral-xyz/anchor-cli`
- [ ] Generate keypair: `solana-keygen new`
- [ ] Get devnet SOL: `solana airdrop 2`
- [ ] Build program: `anchor build`
- [ ] Deploy program: `anchor deploy`
- [ ] Update program ID in Anchor.toml and lib.rs

## Frontend Integration
- [ ] Update contract addresses in .env
- [ ] Test ThirdwebManager dual-chain support
- [ ] Verify Solana Web3.js integration
- [ ] Test blockchain selector UI
- [ ] Verify wallet switching functionality
- [ ] Test real minting on both chains

## Testing Checklist
- [ ] Run integration tests: `node test-contract-integration.js`
- [ ] Run deployment verification: `node verify-deployments.js`
- [ ] Test in browser console with browser-integration-tests.js
- [ ] Verify transaction confirmations on block explorers
- [ ] Test error handling and edge cases

## Production Deployment
- [ ] Switch to mainnet configurations
- [ ] Update RPC endpoints to production
- [ ] Deploy to mainnet (Ethereum) and mainnet-beta (Solana)
- [ ] Update Chrome extension manifest
- [ ] Test with real funds (small amounts first)
- [ ] Monitor transaction success rates

## Security Checklist
- [ ] Audit smart contracts
- [ ] Verify no private keys in code
- [ ] Test wallet security
- [ ] Verify HTTPS endpoints
- [ ] Test rate limiting
- [ ] Verify error messages don't leak sensitive info
