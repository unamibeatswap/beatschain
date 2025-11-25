import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyB5YAsAbKf3aeTegpXYZPBOzCqW2abCORg',
  authDomain: 'beatswap-36c32.firebaseapp.com',
  projectId: 'beatswap-36c32',
  storageBucket: 'beatswap-36c32.firebasestorage.app',
  messagingSenderId: '750321012530',
  appId: '1:750321012530:web:1349ade6e8897015b0912b',
  measurementId: 'G-FV070RQR7K'
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Handle network connectivity
if (typeof window !== 'undefined') {
  // Enable network and handle offline scenarios
  enableNetwork(db).catch((error) => {
    console.warn('Firebase network enable failed:', error)
  })
  
  // Listen for online/offline events
  window.addEventListener('online', () => {
    enableNetwork(db).catch(console.warn)
  })
  
  window.addEventListener('offline', () => {
    console.log('App is offline, using cached data')
  })
}

export default app