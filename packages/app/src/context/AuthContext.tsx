'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { doc, setDoc, getDoc, connectFirestoreEmulator } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'



interface UserProfile {
  uid: string
  email: string
  displayName: string
  role: 'user' | 'producer' | 'admin'
  walletAddress?: string
  profileImage?: string
  isVerified: boolean
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string, role?: 'user' | 'producer') => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Prevent Firebase calls during build
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
        try {
          const profileDoc = await getDoc(doc(db, 'users', user.uid))
          if (profileDoc.exists()) {
            const profileData = profileDoc.data() as UserProfile
            
            // Force admin role for owner email even if profile exists
            if (user.email === 'info@unamifoundation.org' && profileData.role !== 'admin') {
              const updatedProfile = {
                ...profileData,
                role: 'admin' as const,
                isVerified: true,
                updatedAt: new Date()
              }
              await setDoc(doc(db, 'users', user.uid), updatedProfile, { merge: true })
              setUserProfile({
                ...updatedProfile,
                createdAt: profileData.createdAt?.toDate?.() || new Date()
              })
            } else {
              setUserProfile({
                ...profileData,
                createdAt: profileData.createdAt?.toDate?.() || new Date()
              })
            }
          } else {
            // Check if this is an admin email and force admin role
            const isAdmin = user.email === 'info@unamifoundation.org'
            
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || user.email?.split('@')[0] || 'User',
              role: isAdmin ? 'admin' : 'user',
              isVerified: isAdmin,
              createdAt: new Date()
            }
            await setDoc(doc(db, 'users', user.uid), newProfile)
            setUserProfile(newProfile)
          }
        } catch (err) {
          console.warn('Firebase error, using fallback profile:', err)
          const fallbackProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
            role: 'user',
            isVerified: false,
            createdAt: new Date()
          }
          setUserProfile(fallbackProfile)
        }
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string, displayName: string, role: 'user' | 'producer' = 'user') => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      
      // Create user profile in Firestore
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName,
        role,
        isVerified: false,
        createdAt: new Date()
      }
      
      console.log('Creating profile in Firestore:', profile)
      await setDoc(doc(db, 'users', user.uid), profile)
      console.log('Profile created successfully')
      setUserProfile(profile)
      
      return user
    } catch (error) {
      console.error('SignUp error:', error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const { user } = await signInWithPopup(auth, provider)
      
      // Check if profile exists, create if not
      const profileDoc = await getDoc(doc(db, 'users', user.uid))
      if (!profileDoc.exists()) {
        // Check if this is an admin email
        const isAdmin = user.email === 'info@unamifoundation.org'
        
        const profile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || 'User',
          role: isAdmin ? 'admin' : 'user',
          profileImage: user.photoURL || undefined,
          isVerified: isAdmin,
          createdAt: new Date()
        }
        
        console.log('Creating Google profile in Firestore:', profile)
        await setDoc(doc(db, 'users', user.uid), profile)
        console.log('Google profile created successfully')
        setUserProfile(profile)
      }
      
      return user
    } catch (error) {
      console.error('Google SignIn error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      // Clear local state first
      setUser(null)
      setUserProfile(null)
      
      // Then sign out from Firebase
      await signOut(auth)
      
      // Force reload to clear any cached state
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
      // Force clear state even if Firebase fails
      setUser(null)
      setUserProfile(null)
      window.location.href = '/'
    }
  }

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) {
      throw new Error('User not authenticated')
    }
    
    // Create userProfile if it doesn't exist
    const currentProfile = userProfile || {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'User',
      role: 'user' as const,
      isVerified: false,
      createdAt: new Date()
    }
    
    const updatedProfile = { 
      ...currentProfile, 
      ...data
    }
    
    try {
      await setDoc(doc(db, 'users', user.uid), updatedProfile, { merge: true })
      setUserProfile(updatedProfile as UserProfile)
    } catch (err: any) {
      console.error('Failed to update profile:', err)
      throw err
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    // Return safe fallback instead of throwing
    console.warn('useAuth used outside provider, returning fallback')
    return {
      user: null,
      userProfile: null,
      loading: false,
      signIn: async () => {},
      signUp: async () => {},
      signInWithGoogle: async () => {},
      logout: async () => {},
      updateProfile: async () => {}
    }
  }
  return context
}