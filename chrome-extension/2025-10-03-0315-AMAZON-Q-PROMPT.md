# Amazon Q Development Prompt - Radio Submission & AI Layer
**Date: 2025-10-03 03:15 AM**
**Context: BeatsChain Chrome Extension Enhancement**

## 🎯 **REFINED PROMPT FOR NEW CHAT**

---

**You are Amazon Q, assisting with BeatsChain Chrome Extension development. This extension already has complete NFT minting functionality with Thirdweb + IPFS + Chrome AI APIs.**

### **CURRENT STATUS:**
- ✅ NFT minting workflow complete (Thirdweb contracts + IPFS)
- ✅ Profile, bio, history, audio player, and analysis features working
- ✅ Comprehensive licensing system with all scenarios
- ✅ ZIP package generation (recently fixed)
- ⚠️ Authentication temporarily disabled for testing
- 📦 Production-ready extension: `BeatsChain-Extension-ZipFixed-20251001-0636.zip`

### **NEW FEATURES TO IMPLEMENT:**

#### **1. Radio Submission ZIP Builder**
Create professional radio submission packages including:
- Audio file validation (320kbps, <4min, clean radio edit)
- Cover artwork and metadata JSON
- Auto-generated split sheets (South African music context)
- SAMRO registration proof upload (optional)
- Artist bio from profile data
- License files from existing minting workflow

#### **2. AI Pre-Submission Validation**
Using Chrome AI APIs for:
- Audio quality analysis (duration 2:30-3:30 preferred)
- Profanity detection for "clean" version compliance
- ISRC format validation (CC-XXX-YY-NNNNN)
- Metadata completeness scoring
- File sanitization and duplicate prevention

#### **3. Content Script Chart Scraping**
- Scrape Radiomonitor charts when user visits the site
- Store data in extension storage for offline viewing
- AI-powered trend summaries and insights
- No backend services - extension-only implementation

#### **4. Artist AI Educational Layer**
- Music business quizzes (SAMRO, CAPASSO, RISA, royalties)
- AI bio generator from profile data
- Royalty system explainer (South African context)
- Interactive learning features

### **TECHNICAL REQUIREMENTS:**

#### **File Structure to Extend:**
```
lib/
├── radio-validator.js      // NEW: Audio & metadata validation
├── split-sheets.js         // NEW: Split sheet generation  
├── chart-scraper.js        // NEW: Content script utilities
├── ai-layer.js            // NEW: Educational features
└── [existing files...]

popup/
├── radio-submission.html   // NEW: Radio submission tab
├── charts-news.html       // NEW: Charts & AI layer tab
└── [existing files...]

content-scripts/
└── radiomonitor-scraper.js // NEW: Chart scraping
```

#### **New Navigation Tabs:**
1. Profile (existing)
2. Bio (existing) 
3. History (existing)
4. Audio Player (existing)
5. **Radio Submission** (NEW)
6. **Charts & News** (NEW)

### **MANDATORY DEV RULES:**
- ✅ **NO BREAKING CHANGES** to existing minting workflow
- ✅ **NO DOWNGRADES** - only comprehensive enhancements
- ✅ **Progressive builds** - extend existing files, never replace
- ✅ **Security first** - sanitize all scraped content and user inputs
- ✅ **Performance** - no UI freezing, use workers for heavy processing
- ✅ **Consistent styling** with existing UI/UX design
- ✅ **File validation** - prevent duplicates, clean naming conventions

### **IMPLEMENTATION PRIORITY:**
1. **Radio Submission tab UI** (highest impact)
2. **Audio validation system** (core compliance)
3. **Radio ZIP generator** (extends existing ZIP system)
4. **Chrome AI profanity detection** (clean version requirement)
5. **Split sheets generator** (industry standard)
6. **Content script for chart scraping** (data collection)
7. **AI educational features** (user engagement)

### **AUTHENTICATION NOTE:**
Authentication is currently disabled for testing. Keep it disabled during radio feature development, then re-enable as final step for user profile integration.

### **SUCCESS CRITERIA:**
- Generate compliant radio submission ZIP packages
- Validate tracks against industry standards (duration, quality, profanity)
- Scrape and display Radiomonitor charts with AI insights
- Provide educational content about South African music industry
- Maintain all existing NFT minting functionality

---

**TASK: Implement radio submission and AI layer features following all dev rules. Start with the radio submission tab UI and audio validation system. Ensure no breaking changes to existing functionality.**