# BeatsChain Extension v6 - Testing Guide

## 🚀 What's New in v6

### Critical Fixes
- ✅ **Real Blockchain Transactions**: Fixed simulated hash issue
- ✅ **Enhanced Radio Flow**: 6-step progression with cover image upload
- ✅ **Security Improvements**: Input sanitization and validation

## 📦 Installation

1. Download `BeatsChain-Extension-Production-v6.zip`
2. Extract to folder
3. Chrome → Extensions → Developer mode → Load unpacked
4. Select extracted folder

## 🧪 Testing Priorities

### 1. Blockchain Transaction Testing
**Test**: NFT Minting Flow
- Upload audio file → Generate license → Mint NFT
- **Expected**: Real transaction hash (starts with 0x)
- **Verify**: Transaction findable on Polygon Mumbai explorer
- **Check**: No more simulated hashes

### 2. Radio Submission Flow Testing
**Test**: Complete 6-step process
1. **Step 1**: Upload audio file
2. **Step 2**: Fill track information (all required fields)
3. **Step 3**: Upload cover image (min 500x500px)
4. **Step 4**: Run validation check
5. **Step 5**: Complete split sheets (must total 100%)
6. **Step 6**: Generate package

**Expected**: ZIP with audio, cover image, metadata, split sheets

### 3. Security Testing
**Test**: Input validation
- Try XSS inputs in forms
- Test file upload limits
- Verify sanitization works

## 🔍 Key Test Cases

### Blockchain Integration
```
✅ Real transaction creation
✅ Gas estimation
✅ Transaction confirmation
✅ Fallback to testnet simulation if needed
```

### Radio Flow
```
✅ Step progression works
✅ Cover image validation (size, format, dimensions)
✅ Form validation at each step
✅ Split sheets total 100%
✅ Package generation includes all files
```

### Error Handling
```
✅ Invalid file types rejected
✅ Missing required fields highlighted
✅ Network errors handled gracefully
✅ User feedback on all actions
```

## 🐛 Known Issues to Test

1. **Chrome AI**: May not be available in all browsers
2. **Network**: Polygon Mumbai testnet connectivity
3. **File Size**: Large audio files (>50MB) should be rejected
4. **Image Requirements**: Cover images must meet radio specs

## 📊 Success Criteria

- [ ] Real blockchain transactions generated
- [ ] Radio packages contain all 5 required files
- [ ] No XSS vulnerabilities in forms
- [ ] Step navigation works smoothly
- [ ] Cover image upload and validation functional
- [ ] Split sheets calculate to exactly 100%

## 🚨 Report Issues

If you find bugs, note:
1. Browser version
2. Steps to reproduce
3. Expected vs actual behavior
4. Console errors (F12)

**Version**: v6 (2025-10-04)
**Focus**: Blockchain fixes + Radio flow enhancement