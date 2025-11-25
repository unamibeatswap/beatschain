'use client'

import { useState } from 'react'
import { IPFSClient, IPFSUploadResult } from '@/lib/ipfs'

export function useIPFS() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadFile = async (file: File, folder?: string): Promise<IPFSUploadResult | null> => {
    setUploading(true)
    setError(null)
    
    try {
      const result = await IPFSClient.uploadFile(file, folder)
      return result
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setUploading(false)
    }
  }

  const uploadMetadata = async (metadata: object, name?: string): Promise<IPFSUploadResult | null> => {
    setUploading(true)
    setError(null)
    
    try {
      const result = await IPFSClient.uploadJSON(metadata, name)
      return result
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setUploading(false)
    }
  }

  return {
    uploadFile,
    uploadMetadata,
    uploading,
    error
  }
}