'use client'

import { useState } from 'react'
import { useIPFS } from './useIPFS'
import { useSIWE } from '@/context/SIWEContext'

export function useFileUpload() {
  const [progress, setProgress] = useState(0)
  const { uploadFile, uploading, error } = useIPFS()
  const { user } = useSIWE()

  const uploadBeatAudio = async (file: File, beatId: string): Promise<string> => {
    if (!user) throw new Error('Must be logged in to upload')
    
    try {
      setProgress(25)
      
      // Convert audio to base64 for storage
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          setProgress(75)
          resolve(reader.result as string)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      
      // Store in localStorage with beat ID
      const audioKey = `beat_audio_${beatId}`
      localStorage.setItem(audioKey, base64)
      
      setProgress(100)
      return base64
    } catch (error) {
      throw new Error('Failed to upload audio file')
    }
  }

  const uploadCoverImage = async (file: File, beatId: string): Promise<string> => {
    if (!user) throw new Error('Must be logged in to upload')
    
    try {
      setProgress(25)
      
      // Convert image to base64 for storage
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          setProgress(75)
          resolve(reader.result as string)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      
      // Store in localStorage with beat ID
      const imageKey = `beat_cover_${beatId}`
      localStorage.setItem(imageKey, base64)
      
      setProgress(100)
      return base64
    } catch (error) {
      throw new Error('Failed to upload cover image')
    }
  }

  const uploadAudio = uploadBeatAudio
  const uploadImage = uploadCoverImage

  return {
    uploading,
    progress,
    error,
    uploadBeatAudio,
    uploadCoverImage,
    uploadAudio,
    uploadImage
  }
}