'use client'

import { useState, useEffect } from 'react'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

interface CacheConfig {
  defaultTTL: number
  maxSize: number
}

export function useBlockchainCache<T>(config: CacheConfig = { defaultTTL: 300000, maxSize: 100 }) {
  const [cache, setCache] = useState<Map<string, CacheEntry<T>>>(new Map())

  const get = (key: string): T | null => {
    const entry = cache.get(key)
    if (!entry) return null
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      cache.delete(key)
      return null
    }
    
    return entry.data
  }

  const set = (key: string, data: T, ttl: number = config.defaultTTL) => {
    // Implement LRU eviction if cache is full
    if (cache.size >= config.maxSize) {
      const oldestKey = cache.keys().next().value
      cache.delete(oldestKey)
    }
    
    cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
    
    setCache(new Map(cache))
  }

  const clear = () => {
    cache.clear()
    setCache(new Map())
  }

  const invalidate = (keyPattern: string) => {
    const keysToDelete = Array.from(cache.keys()).filter(key => 
      key.includes(keyPattern)
    )
    keysToDelete.forEach(key => cache.delete(key))
    setCache(new Map(cache))
  }

  // Auto-cleanup expired entries
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now()
      const keysToDelete: string[] = []
      
      cache.forEach((entry, key) => {
        if (now - entry.timestamp > entry.ttl) {
          keysToDelete.push(key)
        }
      })
      
      if (keysToDelete.length > 0) {
        keysToDelete.forEach(key => cache.delete(key))
        setCache(new Map(cache))
      }
    }, 60000) // Cleanup every minute
    
    return () => clearInterval(cleanup)
  }, [cache])

  return { get, set, clear, invalidate, size: cache.size }
}