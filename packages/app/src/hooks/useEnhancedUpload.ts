'use client'

import { useState } from 'react'
import { livepeerService } from '@/lib/livepeer'
import { supabaseBeats } from '@/lib/supabase.enhanced'
import { useFileUpload } from '@/hooks/useFileUpload.enhanced'

export function useEnhancedUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentOperation, setCurrentOperation] = useState('')
  const { uploadBeatAudio } = useFileUpload()

  // Set fallback upload for Livepeer service
  livepeerService.setFallbackUpload(uploadBeatAudio)

  const uploadBeat = async (audioFile: File, beatData: any) => {
    setUploading(true)
    setProgress(0)
    
    try {
      const beatId = Date.now().toString()
      
      // Step 1: Save initial beat to Supabase
      setCurrentOperation('Creating beat record...')
      setProgress(10)
      
      const initialBeat = {
        beat_id: beatId,
        title: beatData.title,
        description: beatData.description,
        producer_address: beatData.producerAddress,
        stage_name: beatData.stageName,
        genre: beatData.genre,
        bpm: beatData.bpm,
        key: beatData.key,
        price: beatData.price,
        tags: beatData.tags,
        is_active: true,
        source: 'uploading'
      }
      
      await supabaseBeats.saveBeat(initialBeat)
      
      // Step 2: Upload to Livepeer (with IPFS fallback)
      setCurrentOperation('Uploading to Livepeer CDN...')
      setProgress(30)
      
      const uploadResult = await livepeerService.uploadFile(audioFile, {
        beatId,
        title: beatData.title,
        artist: beatData.stageName
      })
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed')
      }
      
      // Step 3: Update beat with upload results
      setCurrentOperation('Finalizing beat...')
      setProgress(80)
      
      const audioUrl = uploadResult.asset?.playbackUrl || uploadResult.fallbackUrl || ''
      const isOptimized = uploadResult.asset?.optimized || false
      
      const updatedBeat = await supabaseBeats.updateBeat(beatId, {
        playback_url: audioUrl,
        optimized_playback: isOptimized,
        source: isOptimized ? 'livepeer' : 'ipfs'
      })
      
      // Step 4: Also save to localStorage for immediate access
      setCurrentOperation('Syncing locally...')
      setProgress(90)
      
      const localBeatData = {
        id: beatId,
        ...beatData,
        audioUrl,
        livepeerAsset: uploadResult.asset,
        optimizedPlayback: isOptimized,
        createdAt: new Date().toISOString(),
        source: isOptimized ? 'livepeer' : 'ipfs'
      }
      
      const producerBeatsKey = `producer_beats_${beatData.producerAddress}`
      const existingBeats = JSON.parse(localStorage.getItem(producerBeatsKey) || '[]')
      existingBeats.unshift(localBeatData)
      localStorage.setItem(producerBeatsKey, JSON.stringify(existingBeats))
      
      setProgress(100)
      setCurrentOperation('Upload complete!')
      
      return {
        success: true,
        beatId,
        audioUrl,
        optimized: isOptimized,
        beat: updatedBeat
      }
      
    } catch (error) {
      console.error('Enhanced upload failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      }
    } finally {
      setUploading(false)
      setTimeout(() => {
        setProgress(0)
        setCurrentOperation('')
      }, 2000)
    }
  }

  return {
    uploadBeat,
    uploading,
    progress,
    currentOperation
  }
}