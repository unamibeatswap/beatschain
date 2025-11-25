'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, where, limit, startAfter, DocumentSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Producer {
  id: string
  name: string
  email: string
  avatar?: string
  genre: string
  totalBeats: number
  totalSales: number
  rating: number
  verified: boolean
  location: string
  bio?: string
  createdAt: Date
}

export function useProducers() {
  const [producers, setProducers] = useState<Producer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const getProducers = async (filters?: { genre?: string, location?: string }, pageSize = 12, isLoadMore = false) => {
    try {
      setLoading(true)
      
      let q = query(
        collection(db, 'users'),
        where('role', '==', 'producer'),
        orderBy('totalSales', 'desc'),
        limit(pageSize)
      )

      if (filters?.genre) {
        q = query(q, where('genre', '==', filters.genre))
      }

      if (isLoadMore && lastDoc) {
        q = query(q, startAfter(lastDoc))
      }

      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty && !isLoadMore) {
        // No producers in Firestore - new platform
        setProducers([])
        setHasMore(false)
        return []
      }

      const firestoreProducers: Producer[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        firestoreProducers.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        } as Producer)
      })

      if (isLoadMore) {
        setProducers(prev => [...prev, ...firestoreProducers])
      } else {
        setProducers(firestoreProducers)
      }

      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null)
      setHasMore(querySnapshot.docs.length === pageSize)
      
      return firestoreProducers
    } catch (err: any) {
      console.warn('Firestore error, using mock data:', err)
      
      // Load test data for new platform
      const { TestDataManager } = await import('@/utils/testData')
      const testProducers = TestDataManager.getTestProducers()
      const mappedProducers = testProducers.map(p => ({
        id: p.id,
        name: p.name,
        email: `${p.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
        avatar: p.profileImage,
        genre: p.genres[0] || 'Hip Hop',
        totalBeats: p.totalBeats,
        totalSales: p.totalSales,
        rating: 4.5,
        verified: p.isVerified,
        location: p.location,
        bio: p.bio,
        createdAt: p.joinedAt
      }))
      setProducers(mappedProducers)
      setError(null)
      setHasMore(false)
      return mappedProducers
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      getProducers(undefined, 12, true)
    }
  }

  useEffect(() => {
    getProducers()
  }, [])

  return {
    producers,
    loading,
    error,
    hasMore,
    getProducers,
    loadMore
  }
}