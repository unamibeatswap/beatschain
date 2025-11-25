# Vercel Deployment Guide - BeatsChain 🚀

## Pre-Deployment Checklist ✅

### 1. ✅ Minting Re-enabled
- Beat upload now creates NFT metadata
- Adds beats to test data system
- Full upload functionality restored

### 2. ✅ Production Configuration
- `.env.production` created with production variables
- `vercel.json` configured for Next.js deployment
- Web3Provider updated for production URLs
- Coinbase wallet re-enabled for production

### 3. ✅ Wallet Connection Fixed
- Production URL will be whitelisted automatically
- WalletConnect project ID configured
- Metadata URLs point to production domain

## 🚀 Deployment Steps

### Step 1: Connect to Vercel
```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link project
vercel link
```

### Step 2: Set Environment Variables
In Vercel Dashboard, add these environment variables:

```env
# WalletConnect & Web3
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=aa91d5eab1d0156ff3d90cc596741756
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_NETWORK_ID=11155111

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB5YAsAbKf3aeTegpXYZPBOzCqW2abCORg
NEXT_PUBLIC_FIREBASE_PROJECT_ID=beatswap-36c32
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=beatswap-36c32.firebasestorage.app

# IPFS/Pinata
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
PINATA_API_KEY=fe02772d7097812b4b9e
PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Config
NEXT_PUBLIC_APP_NAME=BeatsChain
NEXT_PUBLIC_APP_URL=https://beatschain.vercel.app

# Feature Flags (All Enabled)
NEXT_PUBLIC_USE_WEB3_DATA=true
NEXT_PUBLIC_USE_WEB3_STORAGE=true
NEXT_PUBLIC_USE_WEB3_AUTH=true
NEXT_PUBLIC_USE_WEB3_PAYMENTS=true
```

### Step 3: Deploy
```bash
# Deploy to production
vercel --prod

# Or push to main branch (auto-deploy)
git add .
git commit -m "Production ready deployment"
git push origin main
```

## 🔧 Post-Deployment Setup

### 1. Admin Setup
1. Visit: `https://your-domain.vercel.app/admin/setup`
2. Connect your wallet
3. Click "Setup Admin Access"
4. Test data will be automatically initialized

### 2. Test Functionality
- **Marketplace**: Should show 5 test beats
- **Wallet Connection**: Should work with production URL
- **Upload**: Should work with IPFS storage
- **Admin Dashboard**: Should show populated stats

### 3. Domain Configuration (Optional)
```bash
# Add custom domain in Vercel dashboard
# Update NEXT_PUBLIC_APP_URL to custom domain
# Update WalletConnect metadata URLs
```

## 🛡️ Security Configuration

### Headers (Already Configured)
```json
{
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff", 
  "Referrer-Policy": "strict-origin-when-cross-origin"
}
```

### Environment Variables
- All sensitive keys in Vercel environment variables
- No secrets in client-side code
- Firebase admin keys server-side only

## 🎯 Production Features

### ✅ Fully Functional
- **Web3 Authentication**: SIWE wallet sign-in
- **Beat Upload**: IPFS storage + NFT metadata
- **Marketplace**: Test data populated
- **Admin Dashboard**: Wallet-based admin setup
- **Multi-token Payments**: ETH, USDC, USDT support
- **Real-time Analytics**: Blockchain-based stats

### ✅ Production Ready
- **Performance**: Optimized builds
- **Security**: Headers and environment protection
- **Scalability**: Vercel edge functions
- **Monitoring**: Built-in Vercel analytics

## 🔄 Deployment Workflow

### Automatic Deployment
```
Git Push → Vercel Build → Deploy → Live URL
```

### Manual Deployment
```bash
vercel --prod
```

### Environment Management
```bash
# Preview deployment
vercel

# Production deployment  
vercel --prod

# Check deployment status
vercel ls
```

## 📊 Expected Results

### After Deployment
- **Live URL**: `https://beatschain.vercel.app`
- **Admin Setup**: `/admin/setup` for first-time configuration
- **Populated Marketplace**: 5 test beats ready for demo
- **Working Wallet Connection**: All major wallets supported
- **Full Admin Dashboard**: Complete platform management

### Performance Targets
- **Load Time**: <3 seconds
- **Wallet Connection**: <5 seconds
- **IPFS Upload**: <30 seconds
- **Page Navigation**: <1 second

## 🚨 Troubleshooting

### Common Issues
1. **Wallet Connection Fails**: Check WalletConnect project ID
2. **IPFS Upload Fails**: Verify Pinata API keys
3. **Admin Access Denied**: Complete admin setup first
4. **Empty Marketplace**: Run admin seed data

### Debug Steps
```bash
# Check build logs
vercel logs

# Check environment variables
vercel env ls

# Redeploy if needed
vercel --prod --force
```

## 🎉 Success Checklist

### Pre-Launch Verification
- [ ] Deployment successful
- [ ] Admin setup completed
- [ ] Test data populated
- [ ] Wallet connection working
- [ ] Upload functionality tested
- [ ] Purchase flow verified
- [ ] All pages loading correctly

### Go-Live Ready
- [ ] Custom domain configured (optional)
- [ ] Analytics tracking enabled
- [ ] Error monitoring setup
- [ ] Performance optimized
- [ ] Security headers active

## 🚀 Ready for Production!

BeatsChain is now fully configured for Vercel deployment with:
- **Complete Web3 functionality**
- **Production-ready configuration**
- **Wallet connection compatibility**
- **Admin setup system**
- **Test data population**
- **Security best practices**

**Deploy command**: `vercel --prod`
**First step after deployment**: Visit `/admin/setup` to configure admin access

---

*Your decentralized music marketplace is ready to go live!* 🎵⛓️