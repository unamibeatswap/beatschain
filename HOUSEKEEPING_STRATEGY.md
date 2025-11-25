# 🧹 Robust Housekeeping Strategy

## 🎯 Cleanup Objectives
- Remove redundant files and dependencies
- Optimize build performance
- Streamline codebase for Web3 migration
- Establish clean development workflow

## 📋 Immediate Cleanup Tasks

### 1. Git Housekeeping
```bash
# Clean build artifacts
rm -rf packages/app/.next/
rm -rf packages/app/node_modules/.cache/
rm -rf packages/sanity/node_modules/.sanity/vite/deps/
rm -rf packages/pglite-debug.log

# Clean logs
rm -rf *.log
rm -rf packages/app/*.log
```

### 2. Dependency Cleanup
```bash
# Remove unused dependencies
yarn remove react-is use-effect-event
cd packages/app && yarn remove @sanity/client
cd packages/sanity && yarn clean-deps
```

### 3. Documentation Consolidation
```bash
# Keep essential docs, archive others
mkdir -p docs/archive/
mv CRITICAL_FIXES_*.md docs/archive/
mv PRODUCTION_*.md docs/archive/
mv PLAN_*.md docs/archive/
```

## 🗂️ File Structure Optimization

### Keep (Essential)
```
├── WEB3_MIGRATION_PLAN.md ✅
├── README.md ✅
├── VISION.md ✅
├── packages/app/ ✅
├── packages/hardhat/ ✅
├── packages/sanity/ ✅
└── docs/ ✅
```

### Remove (Redundant)
```
├── CRITICAL_FIXES_*.md ❌
├── PRODUCTION_*.md ❌
├── PLAN_*.md ❌
├── SERVER_STATUS.md ❌
├── SENTRY_SETUP.md ❌
└── build artifacts ❌
```

## 🔧 Scripts Optimization

### Essential Scripts Only
```json
{
  "dev": "yarn workspaces -pt run dev",
  "build": "yarn workspaces -pt run build", 
  "clean": "./scripts/clean.sh",
  "migrate": "./scripts/web3-migrate.sh"
}
```

### Remove Unused Scripts
- `seed-firestore.sh` (will be replaced with Web3 seeding)
- `deploy-firebase.js` (moving to Web3 deployment)
- Various setup scripts (consolidate into one)

## 🎯 Web3 Migration Prep

### Create Clean Branch Structure
```
main (stable)
├── web3-migration (active development)
├── feature/ipfs-storage
├── feature/siwe-auth
└── feature/contract-integration
```

### Environment Cleanup
```bash
# Streamline .env.local
# Keep only Web3 essentials:
- WalletConnect keys ✅
- Contract addresses ✅  
- IPFS/Pinata keys ✅
- Remove Firebase keys (phase out)
```