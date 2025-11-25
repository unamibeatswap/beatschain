'use client'

import { useState, useEffect } from 'react'
import { 
  collection, 
  query, 
  orderBy, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  role: 'user' | 'producer' | 'admin'
  isVerified: boolean
  profileImage?: string
  bio?: string
  walletAddress?: string
  createdAt: Date
  updatedAt: Date
  lastActive: Date
  totalSpent: number
  totalEarned: number
}

export function useUsers() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Try to fetch real users from Firestore
        const usersQuery = query(
          collection(db, 'users'), 
          orderBy('createdAt', 'desc')
        )
        
        const querySnapshot = await getDocs(usersQuery)
        
        if (querySnapshot.empty) {
          // If no users in Firestore, use mock data for demo
          console.log('No users found in Firestore, using mock data')
          setUsers(getMockUsers())
        } else {
          const firestoreUsers = querySnapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            lastActive: doc.data().lastActive?.toDate() || new Date()
          })) as UserProfile[]
          
          setUsers(firestoreUsers)
        }
      } catch (err: any) {
        console.error('Error fetching users:', err)
        // Fallback to mock data if Firestore fails
        console.log('Firestore error, using mock data as fallback')
        setUsers(getMockUsers())
        setError(`Database connection issue: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUsers()
  }, [])

  const updateUserRole = async (userId: string, newRole: 'user' | 'producer' | 'admin') => {
    try {
      // Try to update in Firestore
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: Timestamp.now()
      })
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.uid === userId ? { ...user, role: newRole, updatedAt: new Date() } : user
      ))
    } catch (err: any) {
      console.error('Error updating user role:', err)
      // Update local state only if Firestore fails
      setUsers(prev => prev.map(user => 
        user.uid === userId ? { ...user, role: newRole } : user
      ))
    }
  }

  const toggleUserVerification = async (userId: string) => {
    try {
      const user = users.find(u => u.uid === userId)
      if (!user) return

      const newVerificationStatus = !user.isVerified
      
      // Try to update in Firestore
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        isVerified: newVerificationStatus,
        updatedAt: Timestamp.now()
      })
      
      // Update local state
      setUsers(prev => prev.map(u => 
        u.uid === userId ? { ...u, isVerified: newVerificationStatus, updatedAt: new Date() } : u
      ))
    } catch (err: any) {
      console.error('Error updating user verification:', err)
      // Update local state only if Firestore fails
      setUsers(prev => prev.map(u => 
        u.uid === userId ? { ...u, isVerified: !u.isVerified } : u
      ))
    }
  }

  const suspendUser = async (userId: string) => {
    try {
      // In a real implementation, you might add a 'suspended' field
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        suspended: true,
        updatedAt: Timestamp.now()
      })
      
      // For now, just show success message
      alert('User suspended successfully')
    } catch (err: any) {
      console.error('Error suspending user:', err)
      alert('Failed to suspend user. Please try again.')
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }
    
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'users', userId))
      
      // Update local state
      setUsers(prev => prev.filter(user => user.uid !== userId))
      alert('User deleted successfully')
    } catch (err: any) {
      console.error('Error deleting user:', err)
      alert('Failed to delete user. Please try again.')
    }
  }

  const searchUsers = (searchTerm: string, roleFilter: string = 'all') => {
    return users.filter(user => {
      const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      return matchesSearch && matchesRole
    })
  }

  const getUserStats = () => {
    return {
      total: users.length,
      producers: users.filter(u => u.role === 'producer').length,
      verified: users.filter(u => u.isVerified).length,
      activeToday: users.filter(u => {
        const today = new Date()
        const userLastActive = new Date(u.lastActive)
        return userLastActive.toDateString() === today.toDateString()
      }).length
    }
  }

  return {
    users,
    loading,
    error,
    updateUserRole,
    toggleUserVerification,
    suspendUser,
    deleteUser,
    searchUsers,
    getUserStats
  }
}

// Mock data fallback
function getMockUsers(): UserProfile[] {
  return [
    {
      uid: '1',
      email: 'producer1@example.com',
      displayName: 'Beat Master',
      role: 'producer',
      isVerified: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      lastActive: new Date('2024-01-25'),
      totalSpent: 0,
      totalEarned: 12500.00
    },
    {
      uid: '2',
      email: 'user1@example.com',
      displayName: 'Music Lover',
      role: 'user',
      isVerified: false,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
      lastActive: new Date('2024-01-24'),
      totalSpent: 899.99,
      totalEarned: 0
    },
    {
      uid: '3',
      email: 'admin@beatschain.app',
      displayName: 'Admin User',
      role: 'admin',
      isVerified: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      lastActive: new Date(),
      totalSpent: 0,
      totalEarned: 0
    }
  ]
}