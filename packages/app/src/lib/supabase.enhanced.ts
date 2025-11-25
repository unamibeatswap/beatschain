'use client'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export interface Beat {
  id: string
  beat_id: string
  title: string
  description?: string
  producer_address: string
  stage_name?: string
  genre: string
  bpm?: number
  key?: string
  price: number
  tags?: string[]
  livepeer_asset_id?: string
  playback_url?: string
  optimized_playback?: boolean
  ipfs_audio_url?: string
  cover_image_url?: string
  professional_services?: any
  plays?: number
  is_active?: boolean
  source?: string
  created_at?: string
}

export interface BeatPlay {
  beat_id: string
  user_address?: string
  source?: string
  optimized?: boolean
}

export class SupabaseBeatsService {
  private client = supabase

  async isAvailable(): Promise<boolean> {
    return !!this.client
  }

  // Beat management
  async saveBeat(beat: Omit<Beat, 'id' | 'created_at'>): Promise<Beat | null> {
    if (!this.client) return null
    
    const { data, error } = await this.client
      .from('beats')
      .insert(beat)
      .select()
      .single()
    
    if (error) {
      console.error('Supabase beat save error:', error)
      return null
    }
    
    return data
  }

  async updateBeat(beatId: string, updates: Partial<Beat>): Promise<Beat | null> {
    if (!this.client) return null
    
    const { data, error } = await this.client
      .from('beats')
      .update(updates)
      .eq('beat_id', beatId)
      .select()
      .single()
    
    if (error) {
      console.error('Supabase beat update error:', error)
      return null
    }
    
    return data
  }

  async getBeat(beatId: string): Promise<Beat | null> {
    if (!this.client) return null
    
    const { data, error } = await this.client
      .from('beats')
      .select('*')
      .eq('beat_id', beatId)
      .eq('is_active', true)
      .single()
    
    if (error) return null
    return data
  }

  async getBeats(limit = 20, offset = 0): Promise<Beat[]> {
    if (!this.client) return []
    
    const { data, error } = await this.client
      .from('beats')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) {
      console.error('Supabase beats fetch error:', error)
      return []
    }
    
    return data || []
  }

  async getProducerBeats(producerAddress: string): Promise<Beat[]> {
    if (!this.client) return []
    
    const { data, error } = await this.client
      .from('beats')
      .select('*')
      .eq('producer_address', producerAddress)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) return []
    return data || []
  }

  // Analytics
  async trackPlay(play: BeatPlay): Promise<boolean> {
    if (!this.client) return false
    
    const { error } = await this.client
      .from('beat_plays')
      .insert(play)
    
    if (error) {
      console.error('Play tracking error:', error)
      return false
    }

    // Increment play count
    await this.client.rpc('increment_beat_plays', { beat_id: play.beat_id })
    
    return true
  }

  async getAnalytics(): Promise<any> {
    if (!this.client) return null
    
    const [beatsResult, playsResult] = await Promise.all([
      this.client
        .from('beats')
        .select('count(*), optimized_playback')
        .eq('is_active', true),
      this.client
        .from('beat_plays')
        .select('count(*), optimized')
    ])
    
    return {
      totalBeats: beatsResult.data?.[0]?.count || 0,
      optimizedBeats: beatsResult.data?.filter(b => b.optimized_playback)?.length || 0,
      totalPlays: playsResult.data?.[0]?.count || 0,
      optimizedPlays: playsResult.data?.filter(p => p.optimized)?.length || 0
    }
  }
}

export const supabaseBeats = new SupabaseBeatsService()