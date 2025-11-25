'use client'

import { useState, useRef } from 'react'
import { toast } from 'react-toastify'

interface LogoUploaderProps {
  onUpload: (file: File) => void
  currentLogo?: string
}

export default function LogoUploader({ onUpload, currentLogo }: LogoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentLogo || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }
  
  const handleDragLeave = () => {
    setIsDragging(false)
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }
  
  const handleFile = (file: File) => {
    // Check file type
    if (!file.type.match('image/png') && !file.type.match('image/jpeg')) {
      toast.error('Only PNG and JPG files are allowed')
      return
    }
    
    // Check file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB')
      return
    }
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    
    // Pass file to parent component
    onUpload(file)
  }
  
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }
  
  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {preview ? (
        <div className="mb-4">
          <img 
            src={preview} 
            alt="Logo preview" 
            className="max-h-24 mx-auto"
          />
        </div>
      ) : (
        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      
      <div className="mt-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept="image/png,image/jpeg"
          className="hidden"
        />
        <button 
          type="button" 
          onClick={triggerFileInput}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {preview ? 'Change Logo' : 'Upload Logo'}
        </button>
        <p className="mt-2 text-sm text-gray-600">PNG, JPG up to 2MB</p>
      </div>
    </div>
  )
}