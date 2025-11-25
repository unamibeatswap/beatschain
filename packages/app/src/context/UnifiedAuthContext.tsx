'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useAccount } from 'wagmi'
import { useSIWE } from './SIWEContext'
import { useAuth } from './AuthContext'
import { useWeb3Profile } from '@/hooks/useWeb3Profile'

// Super admin wallets (add your wallet here)
const SUPER_ADMIN_WALLETS = [
  process.env.NEXT_PUBLIC_SUPER_ADMIN_WALLET?.toLowerCase(),
  '0xc84799a904eeb5c57abbbc40176e7db8be202c10', // Your wallet address
  // Add more super admin wallets as needed
].filter(Boolean) as string[]

interface UnifiedUser {
  address: string
  displayName: string
  email?: string
  role: 'user' | 'producer' | 'admin' | 'super_admin'
  permissions: string[]
  isVerified: boolean
  profileImage?: string
  createdAt: Date
}

interface UnifiedAuthContextType {
  user: UnifiedUser | null
  loading: boolean
  isAuthenticated: boolean
  
  // Permission checks
  hasPermission: (permission: string) => boolean
  hasRole: (role: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
  
  // Authentication methods
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  
  // Wallet info
  wallet: {
    address?: string
    isConnected: boolean
  }
}

const ROLE_PERMISSIONS = {
  user: ['browse', 'purchase', 'profile'],
  producer: ['browse', 'purchase', 'profile', 'upload', 'dashboard', 'analytics', 'producer_stats'],
  admin: ['browse', 'purchase', 'profile', 'upload', 'dashboard', 'analytics', 'producer_stats', 'admin_panel', 'user_management', 'content_moderation'],
  super_admin: ['browse', 'purchase', 'profile', 'upload', 'dashboard', 'analytics', 'producer_stats', 'admin_panel', 'user_management', 'content_moderation', 'system_settings', 'role_management']
}

const UnifiedAuthContext = createContext<UnifiedAuthContextType | undefined>(undefined)

export function UnifiedAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UnifiedUser | null>(null)
  const [loading, setLoading] = useState(false)
  
  const { address, isConnected } = useAccount()
  const siweContext = useSIWE()
  const authContext = useAuth()
  const { profile: web3Profile, loading: profileLoading } = useWeb3Profile()
  
  const { user: siweUser, signIn: siweSignIn, signOut: siweSignOut, isAuthenticated: siweAuth } = siweContext || {
    user: null, signIn: async () => {}, signOut: async () => {}, isAuthenticated: false
  }
  const { user: firebaseUser, userProfile: firebaseProfile } = authContext || {
    user: null, userProfile: null
  }

  const buildUnifiedUser = useCallback(() => {
    if (typeof window === 'undefined') {
      setUser(null)
      setLoading(false)
      return
    }
    
    // Prevent execution if hooks failed to initialize
    if (!address && !firebaseUser) {
      setUser(null)
      setLoading(false)
      return
    }
    
    // Prevent loops by checking if user data actually changed
    const currentUserKey = `${address}-${web3Profile?.role}-${firebaseProfile?.role}`
    const lastUserKey = user ? `${user.address}-${user.role}-${user.role}` : null
    
    if (currentUserKey === lastUserKey && user) {
      setLoading(false)
      return // No change, skip rebuild
    }
    
    setLoading(true)
    
    try {
      // No wallet connected
      if (!address || !isConnected) {
        // Check if Firebase user exists (legacy support)
        if (firebaseUser && firebaseProfile) {
          const legacyUser: UnifiedUser = {
            address: firebaseProfile.walletAddress || '',
            displayName: firebaseProfile.displayName,
            email: firebaseProfile.email,
            role: firebaseProfile.role as any,
            permissions: ROLE_PERMISSIONS[firebaseProfile.role as keyof typeof ROLE_PERMISSIONS] || ROLE_PERMISSIONS.user,
            isVerified: firebaseProfile.isVerified,
            profileImage: firebaseProfile.profileImage,
            createdAt: firebaseProfile.createdAt
          }
          setUser(legacyUser)
          setLoading(false)
          return
        }
        
        setUser(null)
        setLoading(false)
        return
      }

      // Determine role with super admin priority
      let role: UnifiedUser['role'] = 'user'
      
      // HIGHEST PRIORITY: Check if wallet is in super admin list
      if (SUPER_ADMIN_WALLETS.includes(address.toLowerCase())) {
        role = 'super_admin'
      }
      // Then check Web3 profile
      else if (web3Profile?.role === 'admin' || web3Profile?.role === 'producer') {
        role = web3Profile.role as UnifiedUser['role']
      }
      // Then check Firebase profile for super admin email
      else if (firebaseProfile?.email === 'info@unamifoundation.org') {
        role = 'super_admin'
      }
      else if (firebaseProfile?.role && firebaseProfile.role !== 'user') {
        role = firebaseProfile.role as UnifiedUser['role']
      }
      else if (web3Profile?.role) {
        role = web3Profile.role as UnifiedUser['role']
      }
      
      // Build unified user from available data
      const unifiedUser: UnifiedUser = {
        address,
        displayName: web3Profile?.displayName || firebaseProfile?.displayName || `User ${address.slice(0, 6)}...${address.slice(-4)}`,
        email: firebaseProfile?.email || web3Profile?.email,
        role,
        permissions: ROLE_PERMISSIONS[role],
        isVerified: web3Profile?.isVerified || firebaseProfile?.isVerified || role === 'super_admin' || role === 'admin',
        profileImage: web3Profile?.profileImage || firebaseProfile?.profileImage,
        createdAt: web3Profile?.createdAt || firebaseProfile?.createdAt || new Date()
      }

      setUser(unifiedUser)
      
      // Auto-upgrade profile if needed
      if (role === 'super_admin' || role === 'admin') {
        upgradeProfileRole(address, role)
      }
      
      // Auto-upgrade Firebase users with admin email
      if (firebaseProfile?.email === 'info@unamifoundation.org' && role !== 'super_admin') {
        upgradeProfileRole(firebaseProfile.email, 'super_admin')
      }
      
    } catch (error) {
      console.error('Error building unified user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [address, isConnected, web3Profile?.role, firebaseProfile?.role, firebaseUser?.uid])

  useEffect(() => {
    if (typeof window === 'undefined') {
      setUser(null)
      setLoading(false)
      return
    }
    
    // Safe initialization - don't wait for profileLoading if hooks failed
    if (profileLoading === false || profileLoading === undefined) {
      buildUnifiedUser()
    }
  }, [profileLoading, buildUnifiedUser])
  
  // Listen for admin setup completion
  useEffect(() => {
    const handleAdminSetup = () => {
      setTimeout(() => buildUnifiedUser(), 100)
    }
    
    window.addEventListener('admin-setup-complete', handleAdminSetup)
    return () => window.removeEventListener('admin-setup-complete', handleAdminSetup)
  }, [buildUnifiedUser])



  const upgradeProfileRole = async (walletAddress: string, role: string) => {
    if (typeof window === 'undefined') return
    
    try {
      // Force create/update super admin profile
      const profileKey = `web3_profile_${walletAddress.toLowerCase()}`
      const newProfile = {
        address: walletAddress,
        displayName: role === 'super_admin' ? 'Super Admin' : 'Admin',
        bio: 'Platform administrator',
        role,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      localStorage.setItem(profileKey, JSON.stringify(newProfile))
      
      // Update admin config
      const adminConfig = {
        adminWallets: [walletAddress.toLowerCase()],
        setupComplete: true,
        createdAt: new Date()
      }
      localStorage.setItem('admin_config', JSON.stringify(adminConfig))
      
      // No automatic refresh to prevent loops
      
    } catch (error) {
      console.error('Error upgrading profile role:', error)
    }
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return user.permissions.includes(permission)
  }

  const hasRole = (role: string): boolean => {
    if (!user) return false
    // Super admin can access any role
    if (user.role === 'super_admin') return true
    return user.role === role
  }

  const hasAnyRole = (roles: string[]): boolean => {
    if (!user) return false
    // Super admin can access any role
    if (user.role === 'super_admin') return true
    return roles.includes(user.role)
  }

  const signIn = async () => {
    if (isConnected && address) {
      try {
        if (siweSignIn) {
          await siweSignIn()
        } else {
          console.warn('SIWE sign in not available')
        }
      } catch (error) {
        console.error('Sign in failed:', error)
      }
    }
  }

  const signOut = async () => {
    try {
      if (siweSignOut) {
        await siweSignOut()
      }
      setUser(null)
    } catch (error) {
      console.error('Sign out failed:', error)
      setUser(null)
    }
  }

  const isAuthenticated = Boolean(
    (isConnected && address && (siweAuth || SUPER_ADMIN_WALLETS.includes(address.toLowerCase()))) || // Web3 auth (super admins bypass SIWE)
    (firebaseUser && firebaseProfile) // Firebase fallback
  ) && typeof window !== 'undefined'

  const value: UnifiedAuthContextType = {
    user,
    loading,
    isAuthenticated,
    hasPermission,
    hasRole,
    hasAnyRole,
    signIn,
    signOut,
    wallet: {
      address,
      isConnected
    }
  }

  return (
    <UnifiedAuthContext.Provider value={value}>
      {children}
    </UnifiedAuthContext.Provider>
  )
}

export function useUnifiedAuth() {
  const context = useContext(UnifiedAuthContext)
  if (!context) {
    // Return safe fallback instead of throwing error
    console.warn('useUnifiedAuth used outside provider, returning fallback')
    return {
      user: null,
      loading: false,
      isAuthenticated: false,
      hasPermission: () => false,
      hasRole: () => false,
      hasAnyRole: () => false,
      signIn: async () => {},
      signOut: async () => {},
      wallet: { address: undefined, isConnected: false }
    }
  }
  return context
}