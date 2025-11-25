# Wallet Security Guidelines

## ⚠️ CRITICAL SECURITY WARNING

**NEVER commit private keys or mnemonic phrases to Git repositories!**

Private keys provide full access to blockchain wallets and all funds they contain. If you commit a private key to a public repository, your funds **WILL** be stolen.

## Safe Development Practices

1. **Use Environment Variables**
   - Store private keys in `.env` files
   - Add `.env` to `.gitignore`
   - Use `.env.example` files to show required variables without real values

2. **Use Different Wallets for Development and Production**
   - Create separate wallets for development/testing
   - Keep minimal funds in development wallets
   - Never use development wallets for personal funds

3. **Hardhat Default Accounts**
   - The default Hardhat accounts are publicly known
   - Their private keys are in the Hardhat documentation
   - **NEVER** send real funds to these accounts

4. **For Local Development**
   - Use Hardhat's built-in accounts for local testing
   - These are safe for local development only
   - Example: `npx hardhat node` creates 20 test accounts

5. **For Testnet Deployment**
   - Create a dedicated testnet wallet
   - Fund it with testnet ETH only
   - Store its private key securely in `.env` (never commit)

6. **For Production Deployment**
   - Use a hardware wallet when possible
   - Consider using multi-signature wallets
   - Use deployment platforms with secure key management

## What To Do If You Accidentally Commit a Private Key

If you accidentally commit a private key to a public repository:

1. **Immediately transfer all funds** to a new, secure wallet
2. **Revoke all permissions** granted to the compromised wallet
3. **Remove the key** from the repository history using tools like BFG or git-filter-repo
4. **Rotate any API keys** that might have been in the same commit
5. **Consider the wallet permanently compromised** - never use it again

## Resources

- [Hardhat Security Best Practices](https://hardhat.org/hardhat-runner/docs/guides/best-practices)
- [OpenZeppelin Security Guidelines](https://docs.openzeppelin.com/learn/security-best-practices)
- [Web3 Security Tools](https://consensys.github.io/smart-contract-best-practices/)

Remember: Security is everyone's responsibility. When in doubt, ask for help from the security team.