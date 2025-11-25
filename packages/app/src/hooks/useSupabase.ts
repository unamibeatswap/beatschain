'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase.enhanced'

export function useSupabase() {
  const [isAvailable, setIsAvailable] = useState(false)

  useEffect(() => {
    setIsAvailable(!!supabase)
  }, [])

  const logSuccess = async (event: {
    event: string
    status: string
    metadata?: any
  }) => {
    if (!supabase) return false
    
    try {
      const { error } = await supabase
        .from('success_logs')
        .insert({
          event_type: event.event,
          status: event.status,
          metadata: event.metadata,
          created_at: new Date().toISOString()
        })
      
      return !error
    } catch (error) {
      console.warn('Supabase log failed:', error)
      return false
    }
  }

  const trackCredit = async (data: {
    user_address: string
    credits_used: number
    operation: string
  }) => {
    if (!supabase) return false
    
    try {
      const { error } = await supabase
        .from('credit_usage')
        .insert(data)
      
      return !error
    } catch (error) {
      console.warn('Credit tracking failed:', error)
      return false
    }
  }

  const saveISRC = async (data: {
    isrc: string
    track_title: string
    artist_name: string
    used: boolean
    professional_service: boolean
  }) => {
    if (!supabase) return false
    
    try {
      const { error } = await supabase
        .from('isrc_codes')
        .insert(data)
      
      return !error
    } catch (error) {
      console.warn('ISRC save failed:', error)
      return false
    }
  }

  return {
    isAvailable,
    logSuccess,
    trackCredit,
    saveISRC
  }
}