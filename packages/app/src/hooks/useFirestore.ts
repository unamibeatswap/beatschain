'use client'

import { useState, useEffect } from 'react'
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Beat } from '@/types'

export function useFirestore() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Beats operations
  const addBeat = async (beatData: Omit<Beat, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true)
    setError(null)
    
    try {
      const docRef = await addDoc(collection(db, 'beats'), {
        ...beatData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })
      
      return docRef.id
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateBeat = async (beatId: string, updates: Partial<Beat>) => {
    setLoading(true)
    setError(null)
    
    try {
      const beatRef = doc(db, 'beats', beatId)
      await updateDoc(beatRef, {
        ...updates,
        updatedAt: Timestamp.now()
      })
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteBeat = async (beatId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      await deleteDoc(doc(db, 'beats', beatId))
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getBeats = async (filters?: { genre?: string, producerId?: string }) => {
    setLoading(true)
    setError(null)
    
    try {
      let q = query(collection(db, 'beats'), orderBy('createdAt', 'desc'))
      
      if (filters?.genre) {
        q = query(q, where('genre', '==', filters.genre))
      }
      
      if (filters?.producerId) {
        q = query(q, where('producerId', '==', filters.producerId))
      }
      
      const querySnapshot = await getDocs(q)
      const beats: Beat[] = []
      
      querySnapshot.forEach((doc) => {
        beats.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        } as Beat)
      })
      
      return beats
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getBeat = async (beatId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const docSnap = await getDoc(doc(db, 'beats', beatId))
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date()
        } as Beat
      } else {
        throw new Error('Beat not found')
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Real-time beats subscription
  const subscribeToBeats = (callback: (beats: Beat[]) => void, filters?: { genre?: string, producerId?: string }) => {
    let q = query(collection(db, 'beats'), orderBy('createdAt', 'desc'))
    
    if (filters?.genre) {
      q = query(q, where('genre', '==', filters.genre))
    }
    
    if (filters?.producerId) {
      q = query(q, where('producerId', '==', filters.producerId))
    }
    
    return onSnapshot(q, (querySnapshot) => {
      const beats: Beat[] = []
      querySnapshot.forEach((doc) => {
        beats.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        } as Beat)
      })
      callback(beats)
    })
  }

  // Purchase operations
  const addPurchase = async (purchaseData: {
    beatId: string
    buyerId: string
    producerId: string
    amount: number
    licenseType: string
    transactionHash?: string
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const docRef = await addDoc(collection(db, 'purchases'), {
        ...purchaseData,
        createdAt: Timestamp.now()
      })
      
      return docRef.id
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getUserPurchases = async (userId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const q = query(
        collection(db, 'purchases'), 
        where('buyerId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const purchases: any[] = []
      
      querySnapshot.forEach((doc) => {
        purchases.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })
      })
      
      return purchases
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    // Beat operations
    addBeat,
    updateBeat,
    deleteBeat,
    getBeats,
    getBeat,
    subscribeToBeats,
    // Purchase operations
    addPurchase,
    getUserPurchases
  }
}