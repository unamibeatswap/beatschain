# BeatsChain Technical Implementation Plan - July 24, 2025

## Phase 1: Critical Fixes (Week 1)

### 1. Purchase Modal Redesign

**Current Issues:**
- Modal fills entire screen
- Close button inaccessible
- No scroll functionality

**Technical Solution:**
```css
/* Modal container should be fixed with proper z-index */
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

/* Modal content should be scrollable and responsive */
.modal-content {
  max-width: 500px;
  max-height: 90vh;
  width: 100%;
  overflow-y: auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}
```

**Implementation Steps:**
1. Update PurchaseModal.enhanced.tsx with responsive design
2. Add proper scroll handling
3. Ensure close button is always visible
4. Test on mobile devices

### 2. Upload Storage Fix

**Current Problem:**
- localStorage quota exceeded for files >5MB
- No file size validation
- Poor error handling

**Technical Solution:**
1. **File Size Detection:**
```typescript
const getFileSize = (file: File): number => {
  return file.size; // in bytes
}

const formatFileSize = (bytes: number): string => {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}
```

2. **Credit Calculation Based on Size:**
```typescript
const calculateCreditsRequired = (fileSize: number, fileType: string): number => {
  const sizeMB = fileSize / (1024 * 1024);
  
  // Base credit cost by file type
  const baseCost = {
    'mp3': 1,
    'wav': 1,
    'zip': 1,
    'm4a': 1,
    'aiff': 1,
    'flac': 1,
    'ogg': 1
  }[fileType.toLowerCase()] || 1;
  
  // Size multipliers
  if (sizeMB <= 10) return baseCost;
  if (sizeMB <= 25) return baseCost * 2;
  if (sizeMB <= 50) return baseCost * 3;
  if (sizeMB <= 100) return baseCost * 5;
  
  // Files over 100MB not allowed
  throw new Error('File size exceeds 100MB limit');
}
```

3. **Storage Alternatives:**
```typescript
// Use IndexedDB for large files instead of localStorage
const storeFileInIndexedDB = async (file: File, key: string) => {
  const db = await openDB('BeatsChainStorage', 1, {
    upgrade(db) {
      db.createObjectStore('files');
    },
  });
  
  await db.put('files', file, key);
}
```

### 3. Profile Routing Fix

**Current Issues:**
- Profile save doesn't redirect properly
- Toast notifications loop
- Missing validation flow

**Technical Solution:**
1. **Proper Routing:**
```typescript
const handleProfileSave = async (profileData: any) => {
  try {
    await saveProfile(profileData);
    
    // Determine redirect based on user role
    if (profileData.role === 'producer') {
      router.push('/dashboard');
    } else if (profileData.role === 'creator') {
      router.push('/creator-dashboard');
    } else {
      router.push('/profile/verification');
    }
    
    // Show success toast only once
    toast.success('Profile saved successfully!', { toastId: 'profile-save' });
  } catch (error) {
    toast.error('Failed to save profile', { toastId: 'profile-error' });
  }
}
```

2. **Toast Notification Fix:**
```typescript
// Use toastId to prevent duplicates
toast.success('Message', { 
  toastId: 'unique-id',
  autoClose: 3000,
  hideProgressBar: false
});
```

## Phase 2: BeatNFT Credit System Enhancement

### Smart Contract Updates

**New Contract Functions Needed:**
```solidity
// Add to BeatNFTCreditSystem.sol

struct StorageUsage {
    uint256 totalBytes;
    uint256 filesCount;
    uint256 lastUpdated;
}

mapping(address => StorageUsage) public userStorage;
uint256 public constant MAX_STORAGE_PER_CREDIT = 50 * 1024 * 1024; // 50MB

function useCreditsWithStorage(
    address user, 
    uint256 credits, 
    uint256 fileSize, 
    string memory purpose
) external {
    require(msg.sender == owner() || msg.sender == user, "Not authorized");
    
    if (!hasProNFT[user]) {
        require(creditBalances[user] >= credits, "Insufficient credits");
        
        // Check storage limit
        uint256 maxStorage = creditBalances[user] * MAX_STORAGE_PER_CREDIT;
        require(userStorage[user].totalBytes + fileSize <= maxStorage, "Storage limit exceeded");
        
        creditBalances[user] -= credits;
        totalCreditsUsed[user] += credits;
    }
    
    // Update storage usage
    userStorage[user].totalBytes += fileSize;
    userStorage[user].filesCount += 1;
    userStorage[user].lastUpdated = block.timestamp;
    
    emit CreditsUsed(user, credits, purpose);
    emit StorageUsed(user, fileSize, userStorage[user].totalBytes);
}

function getStorageUsage(address user) external view returns (StorageUsage memory) {
    return userStorage[user];
}

function getAvailableStorage(address user) external view returns (uint256) {
    if (hasProNFT[user]) {
        return type(uint256).max; // Unlimited for Pro users
    }
    
    uint256 maxStorage = creditBalances[user] * MAX_STORAGE_PER_CREDIT;
    uint256 usedStorage = userStorage[user].totalBytes;
    
    return maxStorage > usedStorage ? maxStorage - usedStorage : 0;
}

event StorageUsed(address indexed user, uint256 fileSize, uint256 totalUsed);
```

### Frontend Integration

**Updated useBeatNFT Hook:**
```typescript
const canUpload = (file: File): { allowed: boolean; cost: number; reason?: string; storageNeeded: number } => {
  const fileSize = file.size;
  const fileType = file.name.split('.').pop() || '';
  
  try {
    const cost = calculateCreditsRequired(fileSize, fileType);
    const storageNeeded = fileSize;
    
    // Pro users can upload anything under 100MB
    if (balance.hasProNFT) {
      if (fileSize > 100 * 1024 * 1024) {
        return { 
          allowed: false, 
          cost: 0, 
          storageNeeded,
          reason: 'File size exceeds 100MB limit' 
        };
      }
      return { allowed: true, cost: 0, storageNeeded };
    }
    
    // Check credits
    if (balance.credits < cost) {
      return { 
        allowed: false, 
        cost, 
        storageNeeded,
        reason: `Need ${cost} BeatNFT credits. You have ${balance.credits}.`
      };
    }
    
    // Check storage availability (if we track it)
    const availableStorage = balance.credits * 50 * 1024 * 1024; // 50MB per credit
    if (storageNeeded > availableStorage) {
      return {
        allowed: false,
        cost,
        storageNeeded,
        reason: `File too large. Need ${Math.ceil(storageNeeded / (50 * 1024 * 1024))} credits for this file size.`
      };
    }
    
    return { allowed: true, cost, storageNeeded };
  } catch (error) {
    return { 
      allowed: false, 
      cost: 0, 
      storageNeeded: fileSize,
      reason: error.message 
    };
  }
}
```

## Phase 3: UI/UX Improvements

### Upload Flow Enhancements

**Progress Indicators:**
```typescript
const FileUploadProgress = ({ file, progress, onComplete, onError }) => {
  return (
    <div className="upload-progress">
      <div className="file-info">
        <span className="file-name">{file.name}</span>
        <span className="file-size">{formatFileSize(file.size)}</span>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="progress-text">
        {progress < 100 ? `${progress}%` : '✓ Complete'}
      </div>
    </div>
  );
};
```

**Image Thumbnail Preview:**
```typescript
const ImagePreview = ({ file }) => {
  const [preview, setPreview] = useState<string | null>(null);
  
  useEffect(() => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, [file]);
  
  return preview ? (
    <div className="image-preview">
      <img src={preview} alt="Cover preview" className="thumbnail" />
    </div>
  ) : null;
};
```

### Dashboard Navigation Fix

**Missing Pages to Create:**
1. `/dashboard/beats` - Beat management page
2. `/dashboard/analytics` - Analytics dashboard
3. `/dashboard/earnings` - Earnings overview
4. `/dashboard/negotiations` - License negotiations

**Route Structure:**
```typescript
// app/dashboard/beats/page.tsx
// app/dashboard/analytics/page.tsx
// app/dashboard/earnings/page.tsx
// app/dashboard/negotiations/page.tsx
```

### Social Media Metadata Fix

**OG Image Generation:**
```typescript
// app/beat/[id]/opengraph-image.tsx
export default async function Image({ params }: { params: { id: string } }) {
  const beat = await getBeat(params.id);
  
  // Use beat cover image if available
  if (beat?.coverImageUrl) {
    const response = await fetch(beat.coverImageUrl);
    const imageBuffer = await response.arrayBuffer();
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
      },
    });
  }
  
  // Fallback to generated image
  return generateFallbackImage(beat);
}
```

## Implementation Timeline

### Week 1: Critical Fixes
- Day 1-2: Purchase Modal Redesign
- Day 3-4: Upload Storage Fix
- Day 5: Profile Routing Fix

### Week 2: Credit System Enhancement
- Day 1-3: Smart Contract Updates
- Day 4-5: Frontend Integration
- Day 6-7: Testing & Deployment

### Week 3: UI/UX Polish
- Day 1-2: Dashboard Navigation
- Day 3-4: Upload Flow Improvements
- Day 5: Social Media Metadata
- Day 6-7: Testing & Bug Fixes

## Testing Strategy

### Unit Tests
- File size calculation functions
- Credit calculation logic
- Storage quota validation

### Integration Tests
- Upload flow end-to-end
- Purchase modal functionality
- Profile save and routing

### User Acceptance Tests
- Mobile responsiveness
- Cross-browser compatibility
- Performance under load

## Deployment Strategy

### Staging Environment
1. Deploy smart contract updates to Sepolia
2. Test all functionality thoroughly
3. Performance testing with large files

### Production Deployment
1. Smart contract deployment to mainnet
2. Frontend deployment with feature flags
3. Gradual rollout to users
4. Monitor metrics and user feedback

---

*This implementation plan provides a structured approach to addressing all identified issues while maintaining platform stability and user experience.*