'use client'

import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'

interface EnhancedMintFlowProps {
  onComplete: (data: any) => void
  audioFile: File | null
  formData: any
}

export default function EnhancedMintFlow({ onComplete, audioFile, formData }: EnhancedMintFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isrcCode, setIsrcCode] = useState('')
  const [audioMetadata, setAudioMetadata] = useState<any>(null)
  const [licenseGenerated, setLicenseGenerated] = useState(false)
  const [sponsorEnabled, setSponsorEnabled] = useState(true)
  const [processing, setProcessing] = useState(false)

  // Step 1: ISRC Generation
  const generateISRC = async () => {
    setProcessing(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MCP_SERVER_URL}/api/isrc/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackTitle: formData.title,
          artistName: formData.stageName || 'Unknown Artist'
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        setIsrcCode(result.isrc)
        setCurrentStep(2)
      }
    } catch (error) {
      console.error('ISRC generation failed:', error)
    } finally {
      setProcessing(false)
    }
  }

  // Step 2: Audio Tagging & Metadata Extraction
  const extractAudioMetadata = async () => {
    if (!audioFile) return
    
    setProcessing(true)
    try {
      // Extract embedded ISRC if exists
      const extractedISRC = await extractISRCFromAudio(audioFile)
      
      // Enhanced metadata
      const metadata = {
        format: audioFile.name.split('.').pop()?.toUpperCase(),
        size: audioFile.size,
        hasEmbeddedISRC: !!extractedISRC,
        extractedISRC,
        generatedISRC: isrcCode,
        supportsISRCEmbedding: ['MP3', 'WAV'].includes(audioFile.name.split('.').pop()?.toUpperCase() || ''),
        audioTaggingCapable: true
      }
      
      setAudioMetadata(metadata)
      setCurrentStep(3)
    } catch (error) {
      console.error('Audio metadata extraction failed:', error)
    } finally {
      setProcessing(false)
    }
  }

  // Step 3: AI License Generation
  const generateAILicense = async () => {
    setProcessing(true)
    try {
      const licenseData = {
        trackTitle: formData.title,
        artistName: formData.stageName,
        genre: formData.genre,
        price: formData.price,
        isrc: isrcCode,
        licenseType: 'EXCLUSIVE',
        royaltyPercentage: 5,
        territory: 'Worldwide',
        duration: 'Perpetual'
      }
      
      // Simulate AI license generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      setLicenseGenerated(true)
      setCurrentStep(4)
    } catch (error) {
      console.error('License generation failed:', error)
    } finally {
      setProcessing(false)
    }
  }

  // Step 4: Sponsored Content Integration
  const handleSponsoredMint = async () => {
    setProcessing(true)
    try {
      const mintData = {
        ...formData,
        isrc: isrcCode,
        audioMetadata,
        licenseGenerated,
        sponsorEnabled,
        enhancedFlow: true
      }
      
      if (sponsorEnabled) {
        // Track sponsor revenue
        await fetch(`${process.env.NEXT_PUBLIC_MCP_SERVER_URL}/api/campaigns/track-revenue`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'enhanced-mint',
            amount: 2.50,
            metadata: { isrc: isrcCode, title: formData.title }
          })
        })
      }
      
      onComplete(mintData)
    } catch (error) {
      console.error('Sponsored mint failed:', error)
    } finally {
      setProcessing(false)
    }
  }

  // Utility: Extract ISRC from audio file
  const extractISRCFromAudio = async (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const buffer = new Uint8Array(e.target?.result as ArrayBuffer)
          const format = file.name.split('.').pop()?.toUpperCase()
          
          if (format === 'MP3') {
            const isrc = parseID3v2ISRC(buffer)
            resolve(isrc)
          } else {
            resolve(null)
          }
        } catch (error) {
          resolve(null)
        }
      }
      reader.readAsArrayBuffer(file.slice(0, 8192))
    })
  }

  // Parse ID3v2 tags for ISRC
  const parseID3v2ISRC = (buffer: Uint8Array): string | null => {
    if (buffer[0] !== 0x49 || buffer[1] !== 0x44 || buffer[2] !== 0x33) {
      return null
    }

    let offset = 10
    const size = synchsafeToInt(buffer.slice(6, 10))
    const endOffset = Math.min(10 + size, buffer.length)

    while (offset < endOffset - 10) {
      const frameId = String.fromCharCode(...buffer.slice(offset, offset + 4))
      const frameSize = synchsafeToInt(buffer.slice(offset + 4, offset + 8))
      
      if (frameId === 'TSRC') {
        const textStart = offset + 11
        const textEnd = textStart + frameSize - 1
        
        if (textEnd <= buffer.length) {
          const isrcBytes = buffer.slice(textStart, textEnd)
          const isrc = String.fromCharCode(...isrcBytes).replace(/\0/g, '')
          return isrc.trim()
        }
      }
      
      offset += 10 + frameSize
    }
    
    return null
  }

  const synchsafeToInt = (bytes: Uint8Array): number => {
    return (bytes[0] << 21) | (bytes[1] << 14) | (bytes[2] << 7) | bytes[3]
  }

  return (
    <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
        🚀 Enhanced Mint Flow
      </h3>

      {/* Progress Steps */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        {[
          { step: 1, label: 'ISRC Generation', icon: '🎵' },
          { step: 2, label: 'Audio Tagging', icon: '🏷️' },
          { step: 3, label: 'AI License', icon: '📄' },
          { step: 4, label: 'Sponsored Mint', icon: '💎' }
        ].map(({ step, label, icon }) => (
          <div key={step} style={{ textAlign: 'center', flex: 1 }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: currentStep >= step ? '#10b981' : '#e5e7eb',
              color: currentStep >= step ? 'white' : '#6b7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.5rem',
              fontSize: '1.25rem'
            }}>
              {currentStep > step ? '✓' : icon}
            </div>
            <p style={{ fontSize: '0.75rem', color: currentStep >= step ? '#10b981' : '#6b7280', margin: 0 }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            Generate Professional ISRC Code
          </h4>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            International Standard Recording Code for global music distribution
          </p>
          <button
            onClick={generateISRC}
            disabled={processing}
            style={{
              background: '#10b981',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: '500',
              cursor: processing ? 'not-allowed' : 'pointer',
              opacity: processing ? 0.7 : 1
            }}
          >
            {processing ? 'Generating...' : 'Generate ISRC'}
          </button>
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            Audio Metadata & Tagging
          </h4>
          <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1rem' }}>
            <p style={{ color: '#059669', fontWeight: '500', margin: '0 0 0.5rem 0' }}>
              ✓ ISRC Generated: {isrcCode}
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
              Extracting embedded metadata and audio properties...
            </p>
          </div>
          <button
            onClick={extractAudioMetadata}
            disabled={processing}
            style={{
              background: '#3b82f6',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: '500',
              cursor: processing ? 'not-allowed' : 'pointer',
              opacity: processing ? 0.7 : 1
            }}
          >
            {processing ? 'Analyzing...' : 'Extract Metadata'}
          </button>
        </div>
      )}

      {currentStep === 3 && (
        <div>
          <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            AI-Generated License Agreement
          </h4>
          {audioMetadata && (
            <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1rem' }}>
              <p style={{ color: '#1e40af', fontWeight: '500', margin: '0 0 0.5rem 0' }}>
                ✓ Audio Analysis Complete
              </p>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                <p>Format: {audioMetadata.format} • Size: {(audioMetadata.size / (1024 * 1024)).toFixed(1)}MB</p>
                <p>ISRC Embedding: {audioMetadata.supportsISRCEmbedding ? 'Supported' : 'Not Supported'}</p>
                {audioMetadata.hasEmbeddedISRC && (
                  <p>Embedded ISRC: {audioMetadata.extractedISRC}</p>
                )}
              </div>
            </div>
          )}
          <button
            onClick={generateAILicense}
            disabled={processing}
            style={{
              background: '#8b5cf6',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: '500',
              cursor: processing ? 'not-allowed' : 'pointer',
              opacity: processing ? 0.7 : 1
            }}
          >
            {processing ? 'Generating License...' : 'Generate AI License'}
          </button>
        </div>
      )}

      {currentStep === 4 && (
        <div>
          <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            Sponsored Minting Options
          </h4>
          <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1rem' }}>
            <p style={{ color: '#d97706', fontWeight: '500', margin: '0 0 0.5rem 0' }}>
              ✓ Professional License Generated
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
              Exclusive worldwide rights with 5% royalty structure
            </p>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={sponsorEnabled}
                onChange={(e) => setSponsorEnabled(e.target.checked)}
                style={{ width: '1rem', height: '1rem' }}
              />
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                Enable sponsored content (+$2.50 revenue)
              </span>
            </label>
          </div>

          <button
            onClick={handleSponsoredMint}
            disabled={processing}
            style={{
              background: '#f59e0b',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: '500',
              cursor: processing ? 'not-allowed' : 'pointer',
              opacity: processing ? 0.7 : 1
            }}
          >
            {processing ? 'Processing...' : 'Complete Enhanced Mint'}
          </button>
        </div>
      )}
    </div>
  )
}