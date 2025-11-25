'use client'

import { useState, useRef } from 'react'

interface LogoUploadProps {
  currentLogo?: string
  onLogoChange: (logoUrl: string) => void
}

export function LogoUpload({ currentLogo, onLogoChange }: LogoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 100)

      // Create object URL for preview (in production, upload to Firebase Storage)
      const logoUrl = URL.createObjectURL(file)
      
      setTimeout(() => {
        setUploading(false)
        onLogoChange(logoUrl)
        alert('Logo uploaded successfully!')
      }, 1000)

    } catch (error) {
      setUploading(false)
      alert('Failed to upload logo')
    }
  }

  const removeLogo = () => {
    if (currentLogo) {
      URL.revokeObjectURL(currentLogo)
    }
    onLogoChange('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
        Site Logo
      </label>
      
      <div style={{ 
        border: '2px dashed #d1d5db', 
        borderRadius: '0.5rem', 
        padding: '2rem', 
        textAlign: 'center',
        background: currentLogo ? '#f9fafb' : 'white'
      }}>
        {currentLogo ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <img 
              src={currentLogo} 
              alt="Site Logo" 
              style={{ maxHeight: '100px', maxWidth: '200px', objectFit: 'contain' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Change Logo
              </button>
              <button
                onClick={removeLogo}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🖼️</div>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Upload your site logo (PNG, JPG, SVG)
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                background: uploading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: uploading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem'
              }}
            >
              {uploading ? `Uploading... ${uploadProgress}%` : 'Choose Logo'}
            </button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
        Recommended: 200x60px, max 2MB. Supports PNG, JPG, SVG formats.
      </p>
    </div>
  )
}