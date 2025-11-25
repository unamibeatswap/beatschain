import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { getStorage } from 'firebase-admin/storage'

// Use environment variables for Firebase Admin config
const getServiceAccount = () => {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
    const projectId = process.env.FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    
    if (!privateKey || !projectId || !clientEmail) {
      console.warn('Firebase Admin credentials missing')
      return null
    }
    
    // Handle different private key formats
    let formattedPrivateKey = privateKey
    if (privateKey.includes('\\n')) {
      formattedPrivateKey = privateKey.replace(/\\n/g, '\n')
    }
    
    // Ensure proper BEGIN/END format
    if (!formattedPrivateKey.includes('-----BEGIN PRIVATE KEY-----')) {
      console.warn('Invalid private key format')
      return null
    }
    
    return {
      type: "service_account",
      project_id: projectId,
      private_key: formattedPrivateKey,
      client_email: clientEmail,
    }
  } catch (error) {
    console.warn('Firebase Admin config error:', error)
    return null
  }
}

const serviceAccount = getServiceAccount()

let app: any = null
let adminDb: any = null
let adminAuth: any = null
let adminStorage: any = null

try {
  if (serviceAccount && serviceAccount.private_key && serviceAccount.private_key.length > 100) {
    const firebaseAdminConfig = {
      credential: cert(serviceAccount as any),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    }
    
    app = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0]
    adminDb = getFirestore(app)
    adminAuth = getAuth(app)
    adminStorage = getStorage(app)
    console.log('Firebase Admin initialized successfully')
  } else {
    console.warn('Firebase Admin not initialized - missing or invalid credentials')
  }
} catch (error) {
  console.warn('Firebase Admin initialization failed:', error)
}

export { adminDb, adminAuth, adminStorage }

export default app