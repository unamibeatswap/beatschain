# BeatsChain Extension - ZIP Rules & Guidelines
**Document Date**: 2025-10-22-09-58  
**Status**: Progressive Implementation Standards  
**Version**: 2.1.0

## 📦 ZIP Package Generation Rules

### Core Principles
1. **Progressive Enhancement**: All ZIP operations must gracefully degrade
2. **Security First**: All file inputs must be validated and sanitized
3. **User Priority**: User inputs always override AI suggestions
4. **Professional Standards**: Industry-compliant file structures
5. **Metadata Integrity**: Embedded metadata in all supported formats

---

## 🎯 ZIP Structure Standards

### Radio Submission Package Structure
```
Track_Title_Radio_Submission.zip
├── audio/
│   └── track_title.mp3                    # Audio with embedded metadata
├── images/
│   └── cover_art.jpg                      # Cover with embedded ISRC
├── metadata/
│   ├── track_metadata.json               # Essential track info
│   ├── broadcast_metadata.xml            # Radio station format
│   └── track_data.csv                    # Spreadsheet format
├── contact/
│   └── artist_contact.vcf                # Industry standard vCard
├── samro/
│   ├── Composer-Split-Confirmation.pdf   # SAMRO compliance
│   ├── SAMRO-Completion-Instructions.txt # Form completion guide
│   └── SAMRO-Compliance-Info.json       # Compliance metadata
└── biography/
    ├── artist_biography.txt              # Press kit text
    └── press_kit.json                    # Structured press data
```

### NFT Minting Package Structure
```
BeatsChain_Track_Title_NFT_Package.zip
├── audio/
│   └── track_title.mp3                    # Audio with embedded metadata
├── images/
│   └── track_title_cover.jpg             # Cover with embedded metadata
├── LICENSE.txt                           # License agreement with blockchain verification
├── metadata.json                         # NFT metadata (OpenSea compatible)
├── press_kit.json                       # Artist press kit (if available)
├── artist_press_kit.txt                 # Biography text format
└── README.md                            # Extension information
```

---

## 🔒 Security & Validation Rules

### File Validation Requirements
```javascript
// Mandatory validation for all ZIP contents
const validateFileForZip = async (file) => {
  // 1. Size validation
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large: ${formatFileSize(file.size)}`);
  }
  
  // 2. MIME type validation
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`File type not allowed: ${file.type}`);
  }
  
  // 3. Security validation (if SecurityValidator available)
  if (window.SecurityValidator) {
    const validation = await securityValidator.validateFile(file);
    if (!validation.isValid) {
      throw new Error(`Security validation failed: ${validation.errors[0]}`);
    }
  }
  
  return true;
};
```

### Input Sanitization Rules
```javascript
// All text inputs must be sanitized before ZIP inclusion
const sanitizeInput = (input) => {
  if (!input) return '';
  
  return String(input)
    .replace(/[<>\"'&]/g, (match) => {
      const map = { 
        '<': '&lt;', '>': '&gt;', '"': '&quot;', 
        "'": '&#x27;', '&': '&amp;' 
      };
      return map[match];
    })
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
    .trim()
    .substring(0, 200); // Limit length
};
```

---

## 📝 Metadata Embedding Rules

### Audio Metadata Embedding
**Mandatory for all audio files in ZIP packages**

#### MP3 Files (ID3v2 Tags)
```javascript
const embedMP3Metadata = async (audioFile, metadata) => {
  const frames = {
    TSRC: metadata.isrc,        // ISRC code (mandatory if available)
    TIT2: metadata.title,       // Track title (mandatory)
    TPE1: metadata.artist,      // Artist name (mandatory)
    TCON: metadata.genre,       // Genre (mandatory)
    TALB: metadata.album,       // Album (optional)
    TYER: metadata.year         // Year (optional)
  };
  
  return await metadataWriter.writeAudioMetadata(audioFile, frames);
};
```

#### WAV Files (BWF Extension)
```javascript
const embedWAVMetadata = async (audioFile, metadata) => {
  const bwfData = {
    description: `${metadata.title} by ${metadata.artist}`,
    isrc: metadata.isrc,       // ISRC at BWF offset 602
    timestamp: new Date().toISOString()
  };
  
  return await metadataWriter.writeWavMetadata(audioFile, bwfData);
};
```

### Image Metadata Embedding
**Mandatory for all cover images in ZIP packages**

#### JPEG Files (EXIF Data)
```javascript
const embedJPEGMetadata = async (imageFile, metadata) => {
  const exifData = {
    UserComment: `ISRC:${metadata.isrc}`,
    Artist: metadata.artist,
    ImageDescription: metadata.title
  };
  
  return await metadataWriter.writeImageMetadata(imageFile, exifData);
};
```

#### PNG Files (tEXt Chunks)
```javascript
const embedPNGMetadata = async (imageFile, metadata) => {
  const textChunks = {
    'ISRC': metadata.isrc,
    'Title': metadata.title,
    'Artist': metadata.artist,
    'Software': 'BeatsChain Chrome Extension'
  };
  
  return await metadataWriter.writePngMetadata(imageFile, textChunks);
};
```

---

## 🎵 ISRC Integration Rules

### ISRC Generation Requirements
```javascript
// ISRC must be generated for all professional packages
const ensureISRCInPackage = async (packageData) => {
  let isrcCode = packageData.isrc;
  
  // Generate ISRC if not provided by user
  if (!isrcCode && window.ISRCManager) {
    const isrcManager = new ISRCManager();
    await isrcManager.initialize();
    isrcCode = await isrcManager.generateISRC(
      packageData.title, 
      packageData.artist
    );
  }
  
  // Validate ISRC format
  if (isrcCode && !validateISRC(isrcCode)) {
    throw new Error(`Invalid ISRC format: ${isrcCode}`);
  }
  
  return isrcCode;
};
```

### ISRC Validation Pattern
```javascript
// Strict validation for ZA-80G-YY-NNNNN format
const validateISRC = (isrc) => {
  const pattern = /^ZA-80G-\d{2}-\d{5}$/;
  return pattern.test(isrc.trim());
};
```

---

## 📊 JSON Structure Standards

### Track Metadata JSON
```javascript
// metadata/track_metadata.json
{
  "title": "sanitized_title",
  "artist": "sanitized_artist", 
  "stageName": "sanitized_stage_name",
  "genre": "sanitized_genre",
  "language": "English",
  "duration": "3:45",
  "isrc": "ZA-80G-25-01205",
  "contentRating": "Clean",
  "format": "MP3",
  "bitrate": "320 kbps",
  "quality": "High Quality",
  "bpm": "140",
  "releaseType": "Single",
  "releaseYear": 2025,
  "createdBy": "BeatsChain Chrome Extension v2.1.0",
  "generated": "2025-10-22T09:58:00.000Z"
}
```

### NFT Metadata JSON (OpenSea Compatible)
```javascript
// metadata.json
{
  "name": "sanitized_title",
  "description": "Music NFT by Artist: Title - Genre",
  "image": "ipfs://QmImageHash",
  "animation_url": "ipfs://QmAudioHash", 
  "external_url": "https://beatschain.app",
  "attributes": [
    { "trait_type": "Artist", "value": "sanitized_artist" },
    { "trait_type": "Genre", "value": "sanitized_genre" },
    { "trait_type": "ISRC", "value": "ZA-80G-25-01205" },
    { "trait_type": "Duration", "value": "3:45" },
    { "trait_type": "BPM", "value": "140" },
    { "trait_type": "Quality", "value": "High Quality" },
    { "trait_type": "Blockchain", "value": "Polygon Mumbai" }
  ],
  "properties": {
    "license_terms": "full_license_text",
    "isrc_code": "ZA-80G-25-01205",
    "metadata_embedded": true,
    "contract_address": "0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A"
  }
}
```

### SAMRO Compliance JSON
```javascript
// samro/SAMRO-Compliance-Info.json
{
  "document": "Composer-Split-Confirmation.pdf",
  "included": true,
  "autoFilled": true,
  "compliance": "SAMRO South African Music Rights Organisation",
  "purpose": "Official split sheet documentation",
  "contributors": 2,
  "totalPercentage": 100,
  "addedAt": "2025-10-22T09:58:00.000Z",
  "instructions": "See SAMRO-Completion-Instructions.txt",
  "createdBy": "BeatsChain Chrome Extension v2.1.0",
  "packageType": "Radio Submission Package",
  "website": "https://chrome.google.com/webstore/detail/beatschain"
}
```

---

## 🔄 ZIP Creation Process Rules

### Real ZIP Implementation
```javascript
// Use real ZIP format, not mock/simulation
const createRealZip = async (files) => {
  const zipParts = [];
  const centralDirectory = [];
  let offset = 0;
  
  // Process each file with proper ZIP structure
  for (const file of files) {
    const fileData = await processFileForZip(file);
    const localHeader = createLocalFileHeader(file.name, fileData);
    const centralDirEntry = createCentralDirectoryEntry(file.name, fileData, offset);
    
    zipParts.push(localHeader);
    zipParts.push(fileData);
    centralDirectory.push(centralDirEntry);
    
    offset += localHeader.byteLength + fileData.byteLength;
  }
  
  // Add central directory and end record
  const centralDirStart = offset;
  centralDirectory.forEach(entry => {
    zipParts.push(entry);
    offset += entry.byteLength;
  });
  
  const endRecord = createEndOfCentralDirectory(
    files.length, 
    offset - centralDirStart, 
    centralDirStart
  );
  zipParts.push(endRecord);
  
  return new Blob(zipParts, { type: 'application/zip' });
};
```

### File Processing Rules
```javascript
const processFileForZip = async (file) => {
  // Handle different file types
  if (file.content instanceof File || file.content instanceof Blob) {
    // Binary files (audio, images)
    return new Uint8Array(await file.content.arrayBuffer());
  } else {
    // Text files (JSON, TXT, XML, CSV)
    return new TextEncoder().encode(file.content);
  }
};
```

---

## 📁 File Naming Conventions

### Sanitized Filename Rules
```javascript
const sanitizeFilename = (filename) => {
  return filename
    .replace(/[<>:"/\\|?*]/g, '_')  // Replace invalid characters
    .replace(/\s+/g, '_')           // Replace spaces with underscores
    .replace(/_{2,}/g, '_')         // Remove multiple underscores
    .replace(/^_|_$/g, '')          // Remove leading/trailing underscores
    .substring(0, 100);             // Limit length
};
```

### Extension-Specific Rules
- **Audio Files**: `.mp3`, `.wav`, `.flac` (preserve original extension)
- **Image Files**: `.jpg`, `.png`, `.svg` (preserve original extension)
- **Text Files**: `.txt`, `.json`, `.xml`, `.csv` (force lowercase)
- **Documents**: `.pdf` (preserve case for official documents)

---

## 🎯 User Input Priority Rules

### Input Hierarchy
1. **User Form Input**: Highest priority (explicitly entered by user)
2. **Profile Data**: Medium priority (saved user preferences)
3. **AI Analysis**: Lowest priority (system-generated suggestions)

```javascript
const getUserPriorityData = (formInput, profileData, aiSuggestion) => {
  // User input always wins
  if (formInput && formInput.trim()) {
    return userInputManager.setUserInput(key, formInput, true);
  }
  
  // Profile data as fallback
  if (profileData && profileData.trim()) {
    return userInputManager.setUserInput(key, profileData, false);
  }
  
  // AI suggestion as last resort
  return aiSuggestion || 'Unknown';
};
```

---

## 🔍 Quality Assurance Rules

### Pre-ZIP Validation Checklist
```javascript
const validatePackageBeforeZip = async (packageData) => {
  const validationResults = {
    audioFile: false,
    metadata: false,
    isrc: false,
    sanitization: false,
    fileStructure: false
  };
  
  // 1. Audio file validation
  if (packageData.audioFile) {
    validationResults.audioFile = await validateAudioFile(packageData.audioFile);
  }
  
  // 2. Metadata completeness
  validationResults.metadata = validateRequiredMetadata(packageData.metadata);
  
  // 3. ISRC validation (if present)
  if (packageData.isrc) {
    validationResults.isrc = validateISRC(packageData.isrc);
  }
  
  // 4. Input sanitization
  validationResults.sanitization = validateSanitization(packageData);
  
  // 5. File structure compliance
  validationResults.fileStructure = validateFileStructure(packageData.files);
  
  return validationResults;
};
```

### Error Handling Rules
```javascript
const handleZipError = (error, packageType) => {
  // Log error for debugging
  console.error(`ZIP generation failed for ${packageType}:`, error);
  
  // Show user-friendly error
  const errorMessage = {
    'VALIDATION_FAILED': 'File validation failed. Please check your inputs.',
    'SIZE_EXCEEDED': 'Package too large. Please reduce file sizes.',
    'ISRC_INVALID': 'Invalid ISRC format. Please check the code.',
    'METADATA_MISSING': 'Required metadata missing. Please complete all fields.',
    'SECURITY_VIOLATION': 'Security check failed. Please try again.'
  };
  
  const userMessage = errorMessage[error.code] || 'Package generation failed. Please try again.';
  
  // Display error to user
  showErrorNotification(userMessage);
  
  // Reset UI state
  resetPackageGenerationUI();
};
```

---

## 📈 Performance Rules

### Optimization Guidelines
1. **Lazy Loading**: Only process files when needed
2. **Memory Management**: Clean up large objects after use
3. **Progress Feedback**: Show progress for large packages
4. **Chunked Processing**: Process large files in chunks

```javascript
const optimizedZipGeneration = async (files) => {
  // Show progress indicator
  showProgressIndicator(0, files.length);
  
  const processedFiles = [];
  
  for (let i = 0; i < files.length; i++) {
    // Process file with memory cleanup
    const processedFile = await processFileWithCleanup(files[i]);
    processedFiles.push(processedFile);
    
    // Update progress
    updateProgressIndicator(i + 1, files.length);
    
    // Yield to browser for UI updates
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  // Generate ZIP
  const zipBlob = await createRealZip(processedFiles);
  
  // Clean up processed files from memory
  processedFiles.length = 0;
  
  return zipBlob;
};
```

---

## 🎵 Audio-Specific Rules

### Audio File Processing
```javascript
const processAudioForZip = async (audioFile, metadata) => {
  // 1. Validate audio file
  await validateAudioFile(audioFile);
  
  // 2. Embed metadata if MetadataWriter available
  let processedAudio = audioFile;
  if (window.MetadataWriter) {
    try {
      const writer = new MetadataWriter();
      processedAudio = await writer.writeAudioMetadata(audioFile, {
        isrc: metadata.isrc,
        title: metadata.title,
        artist: metadata.artist,
        genre: metadata.genre
      });
    } catch (error) {
      console.warn('Metadata embedding failed, using original file:', error);
    }
  }
  
  return processedAudio;
};
```

### Audio Format Support
- **MP3**: Full ID3v2 tag support with ISRC embedding
- **WAV**: BWF extension support with ISRC at offset 602
- **FLAC**: Vorbis comment support (future enhancement)

---

## 🖼️ Image-Specific Rules

### Image File Processing
```javascript
const processImageForZip = async (imageFile, metadata) => {
  // 1. Validate image file
  await validateImageFile(imageFile);
  
  // 2. Embed ISRC in image metadata
  let processedImage = imageFile;
  if (window.MetadataWriter && metadata.isrc) {
    try {
      const writer = new MetadataWriter();
      processedImage = await writer.writeImageMetadata(imageFile, {
        isrc: metadata.isrc
      });
    } catch (error) {
      console.warn('Image metadata embedding failed, using original:', error);
    }
  }
  
  return processedImage;
};
```

### Image Format Support
- **JPEG**: EXIF UserComment field for ISRC storage
- **PNG**: tEXt chunk for ISRC and metadata storage
- **SVG**: XML metadata elements (future enhancement)

---

## 📋 Documentation Rules

### Package Documentation Requirements
Every ZIP package must include:

1. **README.md**: Extension information and version
2. **Instructions**: Format-specific completion guides
3. **Metadata Files**: Structured data in multiple formats
4. **Compliance Info**: Legal and industry compliance data

### Attribution Requirements
All generated files must include:
```javascript
const attributionText = `BeatsChain Chrome Extension v${chrome.runtime?.getManifest()?.version || '2.1.0'}`;
const websiteUrl = 'https://chrome.google.com/webstore/detail/beatschain';
```

---

## 🔧 Chrome Extension ZIP Packaging Rules

### Extension Submission Package Requirements
**CRITICAL**: Chrome extensions require specific ZIP structure to avoid "Manifest file is missing or unreadable" errors.

#### Correct Extension ZIP Structure
```
BeatsChain_Extension_Submission.zip
├── manifest.json                         # MUST be at root level
├── popup/
│   ├── index.html
│   ├── popup.js
│   ├── popup.css
│   └── [other popup files]
├── lib/
│   └── [JavaScript libraries]
├── assets/
│   └── icons/
│       ├── icon16.png
│       ├── icon32.png
│       ├── icon48.png
│       └── icon128.png
├── background/
│   └── service-worker.js
└── options/
    ├── options.html
    └── options.js
```

#### ZIP Creation Rules for Extensions
```bash
# CORRECT: Zip contents, not the folder
cd BeatsChainExtension/
zip -r "../BeatsChain_Extension_Submission.zip" . -x "*.md" "node_modules/*" ".git/*"

# INCORRECT: Zipping the folder creates nested structure
zip -r "BeatsChain_Extension_Submission.zip" BeatsChainExtension/
```

#### Manifest Validation Checklist
```javascript
// Pre-ZIP validation for Chrome extension
const validateExtensionStructure = async () => {
  const requiredFiles = [
    'manifest.json',
    'popup/index.html',
    'popup/popup.js',
    'assets/icons/icon16.png',
    'assets/icons/icon48.png',
    'assets/icons/icon128.png'
  ];
  
  for (const file of requiredFiles) {
    if (!await fileExists(file)) {
      throw new Error(`Required file missing: ${file}`);
    }
  }
  
  // Validate manifest.json structure
  const manifest = await readJSON('manifest.json');
  if (!manifest.manifest_version || !manifest.name || !manifest.version) {
    throw new Error('Invalid manifest.json structure');
  }
  
  return true;
};
```

#### Common ZIP Errors and Solutions

**Error**: "Manifest file is missing or unreadable"
**Cause**: ZIP contains folder instead of files at root
**Solution**: 
```bash
# Navigate INTO the extension directory first
cd BeatsChainExtension/
# Then zip the contents (.) not the folder name
zip -r "../Extension_Package.zip" .
```

**Error**: "Invalid manifest"
**Cause**: manifest.json has syntax errors or missing fields
**Solution**: Validate JSON syntax and required fields before zipping

**Error**: "Icons not found"
**Cause**: Icon paths in manifest don't match actual file locations
**Solution**: Verify icon paths match manifest.json declarations

#### Extension-Specific Exclusions
```bash
# Files to ALWAYS exclude from extension ZIP
-x "*.md"           # Documentation files
-x "node_modules/*"  # Dependencies
-x ".git/*"         # Git repository
-x "test/*"         # Test files
-x "scripts/*"      # Build scripts
-x "contracts/*"    # Smart contracts
-x "*.log"          # Log files
-x ".env*"          # Environment files
```

#### Automated Extension ZIP Creation
```javascript
// Automated extension packaging
const createExtensionZip = async () => {
  // 1. Validate extension structure
  await validateExtensionStructure();
  
  // 2. Create file list (exclude unwanted files)
  const files = await getExtensionFiles();
  
  // 3. Create ZIP with proper structure
  const zip = new JSZip();
  
  for (const file of files) {
    const content = await readFile(file.path);
    zip.file(file.relativePath, content);
  }
  
  // 4. Generate ZIP blob
  return await zip.generateAsync({ type: 'blob' });
};
```

---

*These ZIP rules ensure consistent, professional, and secure package generation across all BeatsChain Extension systems while maintaining progressive enhancement and user input priority.*