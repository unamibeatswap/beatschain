# PayFast Setup Guide for BeatsChain

## 🇿🇦 PAYFAST ACCOUNT SETUP

### STEP 1: SIGN UP FOR PAYFAST
1. Go to: https://www.payfast.co.za/
2. Click "Sign Up" or "Get Started"
3. Choose **"Merchant Account"** (not customer)

### STEP 2: REQUIRED INFORMATION
```
BUSINESS INFORMATION:
- Business Name: BeatsChain (Pty) Ltd
- Business Type: Online Services/Digital Marketplace
- Industry: Music/Entertainment Technology
- Website: beatschain.app (when live)

CONTACT DETAILS:
- Business Address: 1033 Section 1, Madadeni, 2951
- Contact Person: Bhekithemba Simelane
- Phone: [Your SA phone number]
- Email: admin@beatschain.app

BANKING DETAILS:
- Bank Name: [Your SA bank]
- Account Type: Business Current Account
- Account Number: [Your business account]
- Branch Code: [Your branch code]
```

### STEP 3: REQUIRED DOCUMENTS
```
MANDATORY DOCUMENTS:
✅ South African ID Document
✅ Proof of Banking (Bank statement/confirmation letter)
✅ Proof of Address (Utility bill/bank statement)
✅ Business Registration (if company)
✅ FICA Documentation

OPTIONAL BUT RECOMMENDED:
- Business Plan/Website mockup
- Expected transaction volumes
- Business bank account statements
```

## 💰 PAYFAST PRICING (2025)

### TRANSACTION FEES:
```
Card Payments: 2.9% + R2.00 per transaction
EFT Payments: 1.5% + R2.00 per transaction
Instant EFT: 1.95% + R2.00 per transaction
Debit Orders: R3.50 per transaction

MONTHLY FEES:
- No monthly fees for standard accounts
- Premium features available for higher volumes
```

### SETTLEMENT:
```
- Funds settled within 2-3 business days
- Direct deposit to your business bank account
- Detailed transaction reporting
- Real-time payment notifications
```

## 🔧 TECHNICAL INTEGRATION

### REQUIRED CREDENTIALS (After Approval):
```javascript
// Environment Variables Needed:
PAYFAST_MERCHANT_ID=your_merchant_id
PAYFAST_MERCHANT_KEY=your_merchant_key
PAYFAST_PASSPHRASE=your_passphrase (optional but recommended)

// URLs to Configure:
RETURN_URL=https://beatschain.app/payment/success
CANCEL_URL=https://beatschain.app/payment/cancel
NOTIFY_URL=https://beatschain.app/api/payfast/notify
```

### SANDBOX TESTING:
```javascript
// Test Credentials (Use during development):
MERCHANT_ID: 10000100
MERCHANT_KEY: 46f0cd694581a
SANDBOX_URL: https://sandbox.payfast.co.za/eng/process

// Test Card Numbers:
Card Number: 5200000000000015
CVV: 123
Expiry: Any future date
```

## 📋 ACCOUNT APPROVAL PROCESS

### TIMELINE:
```
Application Submission: Immediate
Document Review: 1-3 business days
Account Approval: 3-5 business days
Go Live: 5-7 business days total
```

### APPROVAL REQUIREMENTS:
```
✅ Valid South African business/individual
✅ Legitimate business model
✅ Compliant website/platform
✅ All FICA documents submitted
✅ Bank account verification
```

## 🚀 BEATSCHAIN SPECIFIC SETUP

### BUSINESS DESCRIPTION FOR PAYFAST:
```
"BeatsChain is a digital marketplace connecting South African 
music producers with global artists. We facilitate the sale 
of music beats and instrumentals through our blockchain-powered 
platform. Transactions involve digital music licensing with 
clear usage rights."
```

### EXPECTED TRANSACTION PROFILE:
```
Average Transaction: R500 - R1,500
Monthly Volume: R50,000 - R200,000
Transaction Types: Digital music licensing
Customer Base: Local and international
Risk Level: Low (digital goods, no chargebacks)
```

## 📞 PAYFAST CONTACT INFORMATION

### SUPPORT:
```
Phone: 021 469 7990
Email: support@payfast.co.za
Hours: 08:00 - 17:00 (Mon-Fri)
Website: https://www.payfast.co.za/help
```

### SALES TEAM:
```
Email: sales@payfast.co.za
Phone: 021 469 7990
For business accounts and custom solutions
```

## ⚠️ IMPORTANT NOTES

### COMPLIANCE:
```
- Must comply with FICA requirements
- Business must be registered in South Africa
- All transactions subject to SARB regulations
- Anti-money laundering compliance required
```

### INTEGRATION TIPS:
```
- Use sandbox environment for testing
- Implement proper error handling
- Set up webhook notifications
- Test all payment flows thoroughly
- Monitor transaction success rates
```

## 🔗 USEFUL LINKS

- **PayFast Website**: https://www.payfast.co.za/
- **Developer Documentation**: https://developers.payfast.co.za/
- **Integration Guide**: https://developers.payfast.co.za/docs
- **Sandbox Environment**: https://sandbox.payfast.co.za/
- **Support Portal**: https://www.payfast.co.za/help

## NEXT STEPS:

1. **Sign up** for PayFast merchant account
2. **Submit** required documents
3. **Wait** for approval (3-5 days)
4. **Get** merchant credentials
5. **Update** BeatsChain environment variables
6. **Test** integration in sandbox
7. **Go live** with real payments

**PayFast is the leading South African payment processor - perfect for BeatsChain's local market focus!** 🇿🇦💳