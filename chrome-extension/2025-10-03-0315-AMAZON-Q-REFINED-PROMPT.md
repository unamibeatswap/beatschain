# Amazon Q Development Prompt - Radio Submission (Refined)
**Date: 2025-10-03 03:15 AM**
**Context: BeatsChain Chrome Extension - Reuse Existing Systems**

## 🎯 **REFINED PROMPT FOR NEW CHAT**

---

**You are Amazon Q, assisting with BeatsChain Chrome Extension development. This extension has complete NFT minting functionality with comprehensive audio analysis and ZIP generation systems that must be REUSED, not duplicated.**

### **CURRENT AUDIO ANALYSIS CAPABILITIES:**
- ✅ **Complete metadata extraction**: `extractAudioMetadata()` with duration, bitrate, quality, BPM, genre
- ✅ **Audio validation**: `validateAudioFile()` for format and size checking  
- ✅ **Audio preview**: `createAudioPreview()` with HTML5 controls
- ✅ **Quality analysis**: `estimateBitrate()`, `getQualityLevel()` for radio compliance
- ✅ **Duration formatting**: `formatDuration()` - perfect for radio length validation
- ✅ **Chrome AI integration**: Existing `chromeAI` manager for content generation
- ✅ **ZIP generation**: `createRealZip()` with proper binary format - ready to extend

### **TASK: ADD RADIO SUBMISSION FEATURES**

#### **1. Radio Submission Tab (Extend Existing Navigation)**
Add new tab to existing nav system:
```html
<button class="nav-tab" data-section="radio">📻 Radio</button>
```

#### **2. Radio Validator (Reuse Audio Analysis)**
Create `lib/radio-validator.js` that EXTENDS existing analysis:
```javascript
class RadioValidator {
    // REUSE existing beatMetadata from extractAudioMetadata()
    validateForRadio(beatMetadata) {
        return {
            duration: this.checkRadioDuration(beatMetadata.durationSeconds), // 2:30-3:30 optimal
            quality: this.checkRadioQuality(beatMetadata.estimatedBitrate),   // 320kbps min
            format: this.checkRadioFormat(beatMetadata.format),               // MP3/WAV
            profanity: this.detectProfanity(beatMetadata.title)               // Chrome AI
        };
    }
}
```

#### **3. Split Sheets Generator (New Component)**
Create `lib/split-sheets.js` for South African music context:
```javascript
class SplitSheetsManager {
    generateSplitSheet(trackData, contributors) {
        // Generate SAMRO-compliant split sheets
        // Include: artist, producer, songwriter percentages
        // Validate: total percentage = 100%
    }
}
```

#### **4. Radio ZIP Package (Extend Existing ZIP)**
EXTEND existing `generateDownloadPackage()` method:
```javascript
// ADD to BeatsChainApp class
async generateRadioSubmissionPackage() {
    const files = [];
    
    // REUSE existing audio file
    files.push({ name: 'audio.mp3', content: this.beatFile });
    
    // REUSE existing metadata, format for radio
    const radioMetadata = this.formatRadioMetadata(this.beatMetadata);
    files.push({ name: 'metadata.json', content: JSON.stringify(radioMetadata) });
    
    // NEW: Split sheets
    files.push({ name: 'split_sheet.json', content: this.generateSplitSheet() });
    
    // REUSE existing artist data for bio
    files.push({ name: 'artist_bio.txt', content: this.generateArtistBio() });
    
    // REUSE existing ZIP system
    return await this.createRealZip(files);
}
```

#### **5. Educational AI Layer (Reuse Chrome AI)**
Create `lib/music-education.js`:
```javascript
class MusicEducationAI {
    // REUSE existing chromeAI manager
    async generateQuiz(topic) {
        const prompt = `Generate 5-question quiz about ${topic} for South African music industry`;
        return await window.beatsChainApp.chromeAI.generateContent(prompt);
    }
    
    explainRoyalties() {
        // Explain SAMRO, CAPASSO, RISA differences
    }
}
```

### **CRITICAL REQUIREMENTS:**

#### **NO DUPLICATES ALLOWED:**
- ✅ **REUSE** existing `extractAudioMetadata()` - DO NOT recreate audio analysis
- ✅ **REUSE** existing `createRealZip()` - DO NOT recreate ZIP generation  
- ✅ **REUSE** existing `chromeAI` manager - DO NOT recreate AI integration
- ✅ **REUSE** existing audio preview and validation systems
- ✅ **EXTEND** existing `switchTab()` method for radio section

#### **MINIMAL NEW FILES:**
```
lib/
├── radio-validator.js      // NEW: Radio-specific validation only
├── split-sheets.js         // NEW: Split sheet generation only  
└── music-education.js      // NEW: Educational AI features only

popup/
└── radio-section.html      // NEW: Radio submission UI only
```

#### **AUTHENTICATION STATUS:**
- Authentication currently disabled for testing
- Keep disabled during radio feature development
- Profile data available for bio generation

### **IMPLEMENTATION PRIORITY:**
1. **Add radio tab** to existing navigation (extend `switchTab()`)
2. **Create RadioValidator** that reuses existing `beatMetadata`
3. **Build SplitSheetsManager** for contributor management
4. **Extend ZIP system** for radio packages (reuse `createRealZip()`)
5. **Add profanity detection** using existing Chrome AI

### **SUCCESS CRITERIA:**
- ✅ **90%+ code reuse** from existing audio analysis
- ✅ **Zero duplicate functions** - only extensions and new components
- ✅ **Radio compliance**: Duration (2:30-3:30), quality (320kbps), profanity detection
- ✅ **Professional packages**: Audio, metadata, split sheets, bio, SAMRO compliance
- ✅ **No breaking changes** to existing minting workflow

### **SOUTH AFRICAN CONTEXT:**
- SAMRO registration integration
- CAPASSO, RISA compliance
- Split sheets with contributor roles (artist, producer, songwriter)
- Educational content about SA music industry

---

**TASK: Implement radio submission features by REUSING existing audio analysis, ZIP generation, and Chrome AI systems. Create minimal new components only for radio-specific functionality. Maintain all existing minting capabilities.**