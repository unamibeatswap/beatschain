'use client'

import { useState, useCallback } from 'react'
import { toast } from 'react-toastify'

interface OptimisticUpdate<T> {
  id: string
  data: T
  timestamp: number
  confirmed: boolean
}

export function useOptimisticUpdates<T>() {
  const [updates, setUpdates] = useState<Map<string, OptimisticUpdate<T>>>(new Map())

  const addOptimisticUpdate = useCallback((id: string, data: T) => {
    const update: OptimisticUpdate<T> = {
      id,
      data,
      timestamp: Date.now(),
      confirmed: false
    }
    
    setUpdates(prev => new Map(prev.set(id, update)))
    
    // Auto-remove after 30 seconds if not confirmed
    setTimeout(() => {
      setUpdates(prev => {
        const current = prev.get(id)
        if (current && !current.confirmed) {
          const newMap = new Map(prev)
          newMap.delete(id)
          toast.warning('Transaction taking longer than expected')
          return newMap
        }
        return prev
      })
    }, 30000)
    
    return update
  }, [])

  const confirmUpdate = useCallback((id: string, confirmedData?: T) => {
    setUpdates(prev => {
      const update = prev.get(id)
      if (update) {
        const confirmed = {
          ...update,
          confirmed: true,
          data: confirmedData || update.data
        }
        return new Map(prev.set(id, confirmed))
      }
      return prev
    })
  }, [])

  const revertUpdate = useCallback((id: string) => {
    setUpdates(prev => {
      const newMap = new Map(prev)
      newMap.delete(id)
      return newMap
    })
    toast.error('Transaction failed - changes reverted')
  }, [])

  const getOptimisticData = useCallback((baseData: T[], getId: (item: T) => string): T[] => {
    const optimisticData = [...baseData]
    
    updates.forEach(update => {
      const existingIndex = optimisticData.findIndex(item => getId(item) === update.id)
      if (existingIndex >= 0) {
        optimisticData[existingIndex] = update.data
      } else {
        optimisticData.unshift(update.data)
      }
    })
    
    return optimisticData
  }, [updates])

  const clearConfirmedUpdates = useCallback(() => {
    setUpdates(prev => {
      const newMap = new Map()
      prev.forEach((update, id) => {
        if (!update.confirmed) {
          newMap.set(id, update)
        }
      })
      return newMap
    })
  }, [])

  return {
    addOptimisticUpdate,
    confirmUpdate,
    revertUpdate,
    getOptimisticData,
    clearConfirmedUpdates,
    pendingUpdates: Array.from(updates.values()).filter(u => !u.confirmed).length
  }
}