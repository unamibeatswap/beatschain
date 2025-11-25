# Web3 Testing Guide 🧪

## Phase 1 Testing Checklist

### 🔗 IPFS Integration
```bash
# Test IPFS upload
curl -X POST http://localhost:3000/api/upload \
  -F "file=@test-audio.mp3" \
  -F "type=audio"

# Expected: { success: true, url: "ipfs://...", hash: "..." }
```

### 🔐 SIWE Authentication
```bash
# Test nonce generation
curl http://localhost:3000/api/auth/nonce

# Expected: { nonce: "random-string" }
```

### 📱 Frontend Components
1. **Web3SignIn Component**
   - Connect wallet button appears
   - Wallet connection works
   - Sign-in with Ethereum message
   - User address displayed after auth

2. **Web3BeatCard Component**
   - NFT badge shows token ID
   - IPFS images load correctly
   - Audio player works with IPFS URLs
   - Purchase modal opens

3. **Upload Form**
   - Files upload to IPFS
   - Progress indicators work
   - Error handling for failed uploads

### 🎯 Integration Points
- [ ] Wallet connection via WalletConnect
- [ ] SIWE message signing
- [ ] IPFS file uploads (audio/images)
- [ ] NFT metadata creation
- [ ] Contract interaction ready

## Testing Commands

### Start Development
```bash
cd packages/app
yarn dev
```

### Test Wallet Connection
1. Open http://localhost:3000
2. Click "Connect Wallet"
3. Connect MetaMask/WalletConnect
4. Sign SIWE message
5. Verify user address displayed

### Test File Upload
1. Go to /upload page
2. Select audio file
3. Add beat details
4. Upload - should use IPFS
5. Check console for IPFS hash

### Test Beat Display
1. Visit marketplace
2. Beats should load from Web3DataContext
3. Audio players should work with IPFS URLs
4. NFT badges should show token IDs

## Expected Behavior

### ✅ Working Features
- Wallet connection
- SIWE authentication
- IPFS file uploads
- Web3 data context
- NFT-aware UI components

### 🔄 In Progress
- Contract integration
- On-chain beat minting
- Real purchase flow
- Event-based data updates

### ❌ Not Yet Implemented
- Multi-chain support
- DAO governance
- Advanced NFT features
- Royalty distribution

## Troubleshooting

### IPFS Upload Fails
- Check Pinata API keys in .env.local
- Verify file size limits
- Check network connectivity

### Wallet Connection Issues
- Ensure WalletConnect project ID is set
- Check browser wallet extension
- Verify network configuration

### SIWE Authentication Fails
- Check nonce generation endpoint
- Verify message signing
- Check verification endpoint

## Next Phase Preparation

After Phase 1 testing passes:
1. Deploy enhanced smart contracts
2. Implement on-chain minting
3. Add real purchase transactions
4. Set up event listeners
5. Test full Web3 flow

## Success Criteria

Phase 1 is complete when:
- [x] IPFS uploads work
- [x] SIWE authentication works  
- [x] Web3 components render
- [x] No Firebase dependencies in core flow
- [x] UI/UX remains unchanged for users