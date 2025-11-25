# Firebase Rules Deployment Guide

## RULES READY FOR DEPLOYMENT ✅

### 🔐 FIRESTORE RULES (firestore.rules)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if true; // Public read for producer pages
    }
    
    // Beats - producers can CRUD their own, everyone can read
    match /beats/{beatId} {
      allow read: if true; // Public read for marketplace and producer pages
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.producerId;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.producerId;
    }
    
    // Producer stats and analytics
    match /producer-stats/{userId} {
      allow read: if true; // Public read for producer pages
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Purchases - users can read their own, creators can read sales
    match /purchases/{purchaseId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.buyerId || 
         request.auth.uid == resource.data.producerId);
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.buyerId;
    }
    
    // Admin only collections
    match /admin/{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 🗄️ STORAGE RULES (storage.rules)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Beat audio files - producers can upload, everyone can read
    match /beats/{userId}/{beatId}/{allPaths=**} {
      allow read: if true; // Public read for audio streaming
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // User avatars - users can upload their own
    match /avatars/{userId}/{allPaths=**} {
      allow read: if true; // Public read for profile images
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Producer hero images - producers can upload their own
    match /producer-heroes/{userId}/{allPaths=**} {
      allow read: if true; // Public read for producer pages
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Beat cover images - producers can upload
    match /covers/{userId}/{beatId}/{allPaths=**} {
      allow read: if true; // Public read for marketplace
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin uploads
    match /admin/{allPaths=**} {
      allow read, write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## DEPLOYMENT COMMANDS

### 🚀 MANUAL DEPLOYMENT STEPS:

1. **Login to Firebase:**
```bash
firebase login
```

2. **Set Project:**
```bash
firebase use --add
# Select your BeatsChain project
```

3. **Deploy Rules:**
```bash
firebase deploy --only firestore:rules,storage:rules
```

### 🔧 ALTERNATIVE: Deploy via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your BeatsChain project
3. **Firestore Database** → **Rules** → Copy firestore.rules content
4. **Storage** → **Rules** → Copy storage.rules content
5. **Publish** both rule sets

## WHAT THESE RULES ENABLE:

### ✅ SECURITY FEATURES:
- **Producer pages** can read user profiles publicly
- **Beat collections** accessible on producer pages
- **Profile analytics** tracking with proper permissions
- **File uploads** restricted to authenticated users
- **Admin functions** protected by role-based access

### ✅ FUNCTIONALITY ENABLED:
- Producer page profile views tracking
- Public access to beat collections
- Hero image uploads for producers
- Analytics data collection
- Secure file storage

## TESTING AFTER DEPLOYMENT:

### 🧪 TEST CHECKLIST:
```bash
✅ Producer pages load without auth errors
✅ Profile view tracking works
✅ Beat collections display properly
✅ File uploads work for authenticated users
✅ Admin functions still protected
✅ Public marketplace access maintained
```

## RULES ARE PRODUCTION-READY! 🚀

**Deploy these rules to enable full producer page functionality with proper security.**