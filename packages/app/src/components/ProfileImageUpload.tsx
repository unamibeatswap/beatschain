'use client'

import { useState } from 'react'

interface ProfileImageUploadProps {
  currentImage?: string
  onImageUpdate: (imageUrl: string) => void
  size?: 'sm' | 'md' | 'lg'
}

export default function ProfileImageUpload({ 
  currentImage, 
  onImageUpdate, 
  size = 'md' 
}: ProfileImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24', 
    lg: 'w-32 h-32'
  }

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'profile')
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const { url } = await response.json()
        onImageUpdate(url)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <div className={`${sizeClasses[size]} rounded-full bg-gray-200 overflow-hidden relative group cursor-pointer`}>
        {currentImage ? (
          <img 
            src={currentImage} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
            👤
          </div>
        )}
        
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-xs">Uploading...</div>
          </div>
        )}
        
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
          className="absolute inset-0 opacity-0 cursor-pointer"
          disabled={uploading}
        />
      </div>
      
      <div>
        <p className="text-sm text-gray-600">Click to upload profile picture</p>
        <p className="text-xs text-gray-400">JPG, PNG up to 5MB</p>
      </div>
    </div>
  )
}