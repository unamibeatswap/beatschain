# Contract Deployment Guide — BeatsChain

This document describes recommended steps to deploy and verify smart contracts used by BeatsChain (Solidity / EVM and Solana programs), example commands, environment variables, verification tips, and post-deploy tasks. Include this file when migrating this extension into the main BeatsChain repo.

## Overview

- This repo contains both client-side extension code and references to smart contract sources (see `/contracts` and `/programs/beatschain-solana`).
- Deployments will usually occur from a separate deployment workspace (CLI tools, CI/CD). This guide gives the concrete steps and commands to reproduce deployments locally and in CI.

---

## 1 — Preparation & tooling

- Node.js (18+ recommended)
- Hardhat for EVM deployments
- Foundry or Solana Anchor for Solana program deployments (repo has `programs/beatschain-solana`)
- An RPC endpoint (Infura, Alchemy, QuickNode, or own node)
- Private key or deployer keypair for the target network
- Etherscan/Polygonscan API key (for contract verification)
- Solana RPC + keypair and Solana explorer/solscan access for verification

## 2 — Environment variables (example)

Create a `.env` or CI secrets for the following variables (example names):

```
# EVM
PRIVATE_KEY=0x...
RPC_URL=https://eth-mainnet.alchemyapi.io/v2/xxxxx
ETHERSCAN_API_KEY=xxxxxx

# Polygon / other
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/xxxxx
POLYGONSCAN_API_KEY=xxxxxx

# Solana
SOLANA_KEYPAIR=/path/to/id.json
SOLANA_RPC=https://api.mainnet-beta.solana.com

# Optional: deployment metadata
DEPLOYER_EMAIL=ops@beatschain.com
DEPLOY_TAG=release-v1.2.3
```

Always keep private keys or keyfiles out of source control. Use CI secret storage.

## 3 — Solidity / EVM (Hardhat) example

1. Install dependencies:

```bash
cd contracts
npm ci
```

2. Compile:

```bash
npx hardhat compile
```

3. Deploy to a network (example script `scripts/deploy.js`):

```bash
npx hardhat run --network ${NETWORK} scripts/deploy.js
# e.g. NETWORK=polygon
```

4. Verify on explorer (if plugin configured):

```bash
npx hardhat verify --network ${NETWORK} <DEPLOYED_ADDRESS> "Constructor arg1" "arg2"
```

5. CI recommendation:

- Use a dedicated deployer key with only necessary privileges.
- Save deployed addresses and ABIs to a central artifacts store (JSON) for frontends.

## 4 — Solana program (Anchor) example

1. Build the program (Anchor):

```bash
cd programs/beatschain-solana
anchor build
```

2. Create a deploy keypair and fund with test SOL (devnet) or ensure funded in mainnet.

3. Deploy to a cluster:

```bash
anchor deploy --provider.cluster mainnet
# or devnet
```

4. Post-deploy verification

- Record program id and associated accounts (PDAs).
- Update frontend config with the program id and cluster RPC URL.

## 5 — Post-deploy tasks (both EVM and Solana)

- Publish ABIs and contract addresses to a shared `deployments/` folder in the main repo.
- Tag the deployment in Git and create a release note with addresses and verification links.
- Run integration tests against the deployed contracts (smoke tests): mint, transfer, read state.

## 6 — Verifying & publishing addresses for the extension

1. Add deployed addresses to the extension `lib/` config or environment loader (`lib/env-config.js`). Keep production addresses separate from dev/test addresses.
2. For Chrome extension builds, avoid embedding private keys. Only read public addresses and RPC endpoints.

## 7 — Example CI job (High level)

- Steps:
  1. Checkout
  2. Install deps
  3. Run unit tests & static checks
  4. Build contracts and run deploy script (on release tag)
  5. Verify contracts on explorer
  6. Publish artifacts (addresses, ABIs) to an artifacts bucket or repo path

## 8 — Security notes

- Rotate keys regularly and use hardware/KMS for production deployers.
- Limit RPC endpoints and use rate limiting where possible.
- Use multi-sig for critical admin functions and governance upgrades.

---

If you want, I can add a sample `scripts/deploy.js` for Hardhat and an example Anchor deploy config — tell me which networks you target (Ethereum mainnet, Polygon, Solana mainnet). Also confirm if you want me to commit the updated migration ZIP and push (I'll do that as part of the next steps).
