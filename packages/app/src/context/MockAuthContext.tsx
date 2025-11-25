'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface MockUser {
  uid: string
  email: string
  displayName: string
}

interface MockUserProfile {
  uid: string
  email: string
  displayName: string
  role: 'user' | 'producer' | 'admin'
  walletAddress?: string
  profileImage?: string
  isVerified: boolean
  createdAt: Date
}

interface MockAuthContextType {
  user: MockUser | null
  userProfile: MockUserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<MockUserProfile>) => Promise<void>
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined)

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>({
    uid: 'mock-user-123',
    email: 'info@unamifoundation.org',
    displayName: 'Test Producer'
  })
  
  const [userProfile, setUserProfile] = useState<MockUserProfile | null>({
    uid: 'mock-user-123',
    email: 'info@unamifoundation.org',
    displayName: 'Test Producer',
    role: 'producer',
    isVerified: true,
    createdAt: new Date()
  })

  const signIn = async (email: string, password: string) => {
    // Mock sign in
    console.log('Mock sign in:', email)
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    // Mock sign up
    console.log('Mock sign up:', email, displayName)
  }

  const signInWithGoogle = async () => {
    // Mock Google sign in
    console.log('Mock Google sign in')
  }

  const logout = async () => {
    setUser(null)
    setUserProfile(null)
  }

  const updateProfile = async (data: Partial<MockUserProfile>) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, ...data })
    }
  }

  const value = {
    user,
    userProfile,
    loading: false,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    updateProfile
  }

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  )
}

export function useMockAuth() {
  const context = useContext(MockAuthContext)
  if (context === undefined) {
    throw new Error('useMockAuth must be used within a MockAuthProvider')
  }
  return context
}