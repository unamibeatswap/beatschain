'use client'

import { useState } from 'react'
import { useIPFS } from './useIPFS'
import { useSIWE } from '@/context/SIWEContext'

export function useFileUpload() {
  const [progress, setProgress] = useState(0)
  const [retryCount, setRetryCount] = useState(0)
  const [currentOperation, setCurrentOperation] = useState<string | null>(null)
  const { uploadFile, uploading: ipfsUploading, error: ipfsError } = useIPFS()
  const { user } = useSIWE()
  
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadBeatAudio = async (file: File, beatId: string): Promise<string> => {
    if (!user) throw new Error('Must be logged in to upload')
    
    setUploading(true)
    setProgress(0)
    setError(null)
    setCurrentOperation('Preparing audio file')
    
    try {
      // Check if IPFS is configured
      const hasIPFSConfig = process.env.NEXT_PUBLIC_PINATA_JWT && process.env.NEXT_PUBLIC_IPFS_GATEWAY
      
      // Debug logging
      console.log('🔍 IPFS Config Check:')
      console.log('JWT:', process.env.NEXT_PUBLIC_PINATA_JWT ? 'SET' : 'MISSING')
      console.log('Gateway:', process.env.NEXT_PUBLIC_IPFS_GATEWAY ? 'SET' : 'MISSING')
      console.log('IPFS Ready:', hasIPFSConfig ? 'YES' : 'NO')
      
      if (hasIPFSConfig) {
        try {
          setCurrentOperation('Uploading to IPFS')
          setProgress(10)
          
          const ipfsResult = await uploadFile(file)
          if (ipfsResult) {
            // Store IPFS URL in localStorage as backup
            const audioKey = `beat_audio_${beatId}`
            localStorage.setItem(audioKey, ipfsResult.url)
            
            setProgress(100)
            setUploading(false)
            return ipfsResult.url
          }
        } catch (ipfsError) {
          console.warn('IPFS upload failed, falling back to local storage:', ipfsError)
          // Continue with fallback
        }
      } else {
        console.warn('⚠️ IPFS not configured - Environment variables missing:')
        console.warn('Required: NEXT_PUBLIC_PINATA_JWT, NEXT_PUBLIC_IPFS_GATEWAY')
        console.warn('Falling back to localStorage (4MB limit)')
      }
      
      // Fallback to base64 storage
      setCurrentOperation('Processing audio file')
      setProgress(25)
      
      // Convert audio to base64 for storage
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          setProgress(75)
          resolve(reader.result as string)
        }
        reader.onerror = (e) => {
          console.error('FileReader error:', e)
          reject(new Error('Failed to read audio file'))
        }
        reader.readAsDataURL(file)
      })
      
      // Store in localStorage with beat ID (with size check)
      const audioKey = `beat_audio_${beatId}`
      try {
        localStorage.setItem(audioKey, base64)
      } catch (storageError) {
        // Clear some old data and retry
        const keys = Object.keys(localStorage).filter(key => key.startsWith('beat_audio_'))
        keys.slice(0, 5).forEach(key => localStorage.removeItem(key))
        
        try {
          localStorage.setItem(audioKey, base64)
        } catch (retryError) {
          const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
          throw new Error(`File too large for localStorage (${sizeMB}MB). IPFS configuration required. Check environment variables: NEXT_PUBLIC_PINATA_JWT, NEXT_PUBLIC_IPFS_GATEWAY`)
        }
      }
      
      setProgress(100)
      setUploading(false)
      return base64
    } catch (error: any) {
      console.error('Audio upload failed:', error)
      setError(`Failed to upload audio: ${error.message || 'Unknown error'}`)
      throw new Error('Failed to upload audio file')
    } finally {
      setUploading(false)
    }
  }

  const uploadCoverImage = async (file: File, beatId: string): Promise<string> => {
    if (!user) throw new Error('Must be logged in to upload')
    
    setUploading(true)
    setProgress(0)
    setError(null)
    setCurrentOperation('Preparing cover image')
    
    try {
      // First try IPFS upload if available
      try {
        setCurrentOperation('Uploading to IPFS')
        setProgress(10)
        
        const ipfsResult = await uploadFile(file)
        if (ipfsResult) {
          // Store IPFS URL in localStorage as backup
          const imageKey = `beat_cover_${beatId}`
          localStorage.setItem(imageKey, ipfsResult.url)
          
          setProgress(100)
          setUploading(false)
          return ipfsResult.url
        }
      } catch (ipfsError) {
        console.warn('IPFS upload failed, falling back to local storage:', ipfsError)
        // Continue with fallback
      }
      
      // Fallback to base64 storage
      setCurrentOperation('Processing image')
      setProgress(25)
      
      // Convert image to base64 for storage
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          setProgress(75)
          resolve(reader.result as string)
        }
        reader.onerror = (e) => {
          console.error('FileReader error:', e)
          reject(new Error('Failed to read image file'))
        }
        reader.readAsDataURL(file)
      })
      
      // Store in localStorage with beat ID
      const imageKey = `beat_cover_${beatId}`
      localStorage.setItem(imageKey, base64)
      
      setProgress(100)
      setUploading(false)
      return base64
    } catch (error: any) {
      console.error('Cover image upload failed:', error)
      setError(`Failed to upload cover image: ${error.message || 'Unknown error'}`)
      throw new Error('Failed to upload cover image')
    } finally {
      setUploading(false)
    }
  }

  const uploadAudio = uploadBeatAudio
  const uploadImage = uploadCoverImage

  return {
    uploading,
    progress,
    error,
    currentOperation,
    uploadBeatAudio,
    uploadCoverImage,
    uploadAudio,
    uploadImage
  }
}