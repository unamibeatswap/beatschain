# Producer Page Update Guide - Current Setup

## 🎯 How to Update Producer Pages (Cost-Effective Approach)

### **Current Architecture**
```
Producer Page (/producer/[id]) loads from:
1. Sanity CMS (hero images, bio, static content)
2. Smart Contract (beat collection, stats)
3. Local Storage (fallback profiles)
```

---

## 📝 **Method 1: Sanity CMS Updates (Recommended)**

### **Step 1: Access Sanity Studio**
```bash
cd packages/app
npm run sanity:studio
# Opens: http://localhost:3333
```

### **Step 2: Create/Edit Producer**
1. Navigate to **"Beat Creator"** section
2. Click **"Create new"** or edit existing
3. Fill required fields:
   - **Name**: Producer display name
   - **Slug**: URL identifier (e.g., "producer-name")
   - **Bio**: Producer description
   - **Profile Image**: Upload profile photo
   - **Cover Image**: Upload hero background
   - **Wallet Address**: Producer's ETH address
   - **Location**: Geographic location
   - **Genres**: Music specialties
   - **Social Links**: Twitter, Instagram, etc.

### **Step 3: Publish Changes**
- Click **"Publish"** in Sanity Studio
- Changes appear immediately on producer page

### **Cost**: **FREE** (using existing Sanity plan)

---

## 🔧 **Method 2: Dashboard Integration (Producer Self-Service)**

### **Step 1: Add Producer Profile Editor**
```typescript
// File: packages/app/src/components/producer/ProfileEditor.tsx
'use client'

import { useState } from 'react'
import { client } from '@/lib/sanity'

export default function ProfileEditor({ producerAddress }: { producerAddress: string }) {
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    location: '',
    genres: [],
    socialLinks: {}
  })

  const updateProfile = async () => {
    await client.createOrReplace({
      _type: 'producer',
      _id: `producer-${producerAddress}`,
      slug: { current: producerAddress.toLowerCase() },
      walletAddress: producerAddress,
      ...profile
    })
  }

  return (
    <form onSubmit={updateProfile}>
      <input 
        value={profile.name}
        onChange={(e) => setProfile({...profile, name: e.target.value})}
        placeholder="Producer Name"
      />
      <textarea 
        value={profile.bio}
        onChange={(e) => setProfile({...profile, bio: e.target.value})}
        placeholder="Bio"
      />
      <button type="submit">Update Profile</button>
    </form>
  )
}
```

### **Step 2: Add to Producer Dashboard**
```typescript
// File: packages/app/src/app/dashboard/page.tsx
import ProfileEditor from '@/components/producer/ProfileEditor'

// Add to dashboard tabs
<ProfileEditor producerAddress={user.address} />
```

### **Cost**: **FREE** (development time only)

---

## 📸 **Method 3: Image Upload System**

### **Step 1: Add Image Upload Component**
```typescript
// File: packages/app/src/components/ImageUpload.tsx
'use client'

import { useState } from 'react'

export default function ImageUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (file: File) => {
    setUploading(true)
    
    // Upload to Firebase Storage (existing setup)
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    const { url } = await response.json()
    onUpload(url)
    setUploading(false)
  }

  return (
    <input 
      type="file" 
      accept="image/*"
      onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
      disabled={uploading}
    />
  )
}
```

### **Step 2: Integrate with Profile Editor**
```typescript
<ImageUpload onUpload={(url) => setProfile({...profile, profileImage: url})} />
<ImageUpload onUpload={(url) => setProfile({...profile, coverImage: url})} />
```

### **Cost**: **FREE** (uses existing Firebase Storage)

---

## 🚀 **Method 4: Quick Producer Page Creation**

### **Step 1: Bulk Producer Creation Script**
```typescript
// File: scripts/create-producers.ts
import { client } from '../packages/app/src/lib/sanity'

const producers = [
  {
    name: 'SA Beat Maker',
    slug: 'sa-beat-maker',
    bio: 'Cape Town based producer specializing in Amapiano and Afrobeats',
    location: 'Cape Town, South Africa',
    genres: ['amapiano', 'afrobeats'],
    walletAddress: '0x1234...'
  }
  // Add more producers
]

async function createProducers() {
  for (const producer of producers) {
    await client.createOrReplace({
      _type: 'producer',
      _id: `producer-${producer.slug}`,
      slug: { current: producer.slug },
      ...producer
    })
  }
}

createProducers()
```

### **Step 2: Run Script**
```bash
cd packages/app
npx tsx scripts/create-producers.ts
```

### **Cost**: **FREE** (one-time setup)

---

## 📊 **Current vs Proposed Costs**

### **Current Setup (Recommended)**
- **Sanity CMS**: $0/month (existing plan)
- **Firebase Storage**: $0/month (existing plan)
- **Development Time**: 2-4 hours
- **Total Cost**: **$0**

### **Proposed On-Chain Setup**
- **Smart Contract Development**: ~1 ETH ($2,400)
- **Gas Fees**: 0.01 ETH per producer ($24)
- **IPFS Storage**: $20/month
- **Development Time**: 4 weeks
- **Total Cost**: **$3,000+ initial**

---

## 🎯 **Recommended Approach**

### **Phase 1: Immediate (Current Setup)**
1. **Enable producer self-service** via dashboard
2. **Add image upload** functionality
3. **Create bulk producer** creation tools
4. **Cost**: $0, 1 week development

### **Phase 2: Future (When Revenue Justifies)**
1. **Implement on-chain profiles** when platform has 500+ producers
2. **Gradual migration** from Sanity to blockchain
3. **Premium features** for paying producers

---

## 🛠️ **Implementation Steps (Current Setup)**

### **Week 1: Dashboard Integration**
```bash
# 1. Create profile editor component
touch packages/app/src/components/producer/ProfileEditor.tsx

# 2. Add image upload functionality  
touch packages/app/src/components/ImageUpload.tsx

# 3. Integrate with dashboard
# Edit: packages/app/src/app/dashboard/page.tsx
```

### **Week 2: Producer Tools**
```bash
# 1. Create bulk creation script
touch scripts/create-producers.ts

# 2. Add profile management API
touch packages/app/src/app/api/producer/profile/route.ts

# 3. Test with sample producers
```

### **Testing**
```bash
# 1. Start development server
npm run dev

# 2. Test producer page updates
# Visit: http://localhost:3000/producer/test-producer

# 3. Verify Sanity integration
npm run sanity:studio
```

---

## 📈 **Success Metrics (Current Setup)**

- [ ] Producers can update profiles via dashboard
- [ ] Image uploads work seamlessly
- [ ] Producer pages load in <2 seconds
- [ ] Zero additional infrastructure costs
- [ ] 100% compatibility with existing system

**Result**: Full producer page control for $0 additional cost using existing infrastructure.

---

**Recommendation**: Implement current setup improvements first, then consider on-chain migration when platform revenue justifies the investment.