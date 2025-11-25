'use client'

import { useState } from 'react'

interface ProfessionalServicesProps {
  audioFile: File | null
  formData: any
  onServicesComplete: (services: ProfessionalServices) => void
}

interface ProfessionalServices {
  isrc?: { code: string; generated: boolean }
  audioAnalysis?: { metadata: any; analyzed: boolean }
  aiLicense?: { type: string; generated: boolean }
  sponsorContent?: { enabled: boolean; revenue: number }
}

export default function ProfessionalServices({ audioFile, formData, onServicesComplete }: ProfessionalServicesProps) {
  const [services, setServices] = useState<ProfessionalServices>({})
  const [activeService, setActiveService] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const generateISRC = async () => {
    setProcessing(true)
    setActiveService('isrc')
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MCP_SERVER_URL}/api/professional/isrc/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackTitle: formData.title,
          artistName: formData.stageName || 'Unknown Artist'
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        const updatedServices = {
          ...services,
          isrc: { code: result.isrc, generated: true }
        }
        setServices(updatedServices)
        onServicesComplete(updatedServices)
      }
    } catch (error) {
      console.error('ISRC generation failed:', error)
    } finally {
      setProcessing(false)
      setActiveService(null)
    }
  }

  const analyzeAudio = async () => {
    if (!audioFile) return
    
    setProcessing(true)
    setActiveService('audio')
    
    try {
      // Client-side audio analysis
      const metadata = await extractAudioMetadata(audioFile)
      const updatedServices = {
        ...services,
        audioAnalysis: { metadata, analyzed: true }
      }
      setServices(updatedServices)
      onServicesComplete(updatedServices)
    } catch (error) {
      console.error('Audio analysis failed:', error)
    } finally {
      setProcessing(false)
      setActiveService(null)
    }
  }

  const generateLicense = async () => {
    setProcessing(true)
    setActiveService('license')
    
    try {
      // Simulate AI license generation
      await new Promise(resolve => setTimeout(resolve, 1500))
      const updatedServices = {
        ...services,
        aiLicense: { type: 'EXCLUSIVE', generated: true }
      }
      setServices(updatedServices)
      onServicesComplete(updatedServices)
    } catch (error) {
      console.error('License generation failed:', error)
    } finally {
      setProcessing(false)
      setActiveService(null)
    }
  }

  const enableSponsorContent = () => {
    const updatedServices = {
      ...services,
      sponsorContent: { enabled: true, revenue: 2.50 }
    }
    setServices(updatedServices)
    onServicesComplete(updatedServices)
  }

  const extractAudioMetadata = async (file: File) => {
    const format = file.name.split('.').pop()?.toUpperCase()
    return {
      format,
      size: file.size,
      supportsISRCEmbedding: ['MP3', 'WAV'].includes(format || ''),
      hasEmbeddedISRC: false, // Would extract in real implementation
      extractedISRC: null
    }
  }

  return (
    <div style={{ 
      background: '#f8fafc', 
      border: '1px solid #e2e8f0', 
      borderRadius: '0.5rem', 
      padding: '1.5rem',
      marginBottom: '2rem'
    }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
        🎯 Professional Services (Optional)
      </h3>
      
      <div style={{ display: 'grid', gap: '1rem' }}>
        
        {/* ISRC Generation */}
        <div style={{ 
          background: services.isrc ? '#f0fdf4' : 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.375rem',
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                🎵 Professional ISRC Code
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                {services.isrc ? `Generated: ${services.isrc.code}` : 'International Standard Recording Code for global distribution'}
              </p>
            </div>
            <button
              onClick={generateISRC}
              disabled={processing || services.isrc?.generated}
              style={{
                background: services.isrc ? '#10b981' : '#3b82f6',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                cursor: processing ? 'not-allowed' : 'pointer',
                opacity: processing && activeService === 'isrc' ? 0.7 : 1
              }}
            >
              {services.isrc ? '✓ Generated' : processing && activeService === 'isrc' ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>

        {/* Audio Analysis */}
        <div style={{ 
          background: services.audioAnalysis ? '#f0f9ff' : 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.375rem',
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                🏷️ Enhanced Audio Analysis
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                {services.audioAnalysis ? 
                  `Format: ${services.audioAnalysis.metadata.format} • ${(services.audioAnalysis.metadata.size / (1024 * 1024)).toFixed(1)}MB` :
                  'Extract metadata, format analysis, and ISRC detection'
                }
              </p>
            </div>
            <button
              onClick={analyzeAudio}
              disabled={processing || !audioFile || services.audioAnalysis?.analyzed}
              style={{
                background: services.audioAnalysis ? '#3b82f6' : '#6366f1',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                cursor: processing || !audioFile ? 'not-allowed' : 'pointer',
                opacity: processing && activeService === 'audio' ? 0.7 : 1
              }}
            >
              {services.audioAnalysis ? '✓ Analyzed' : processing && activeService === 'audio' ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>

        {/* AI License */}
        <div style={{ 
          background: services.aiLicense ? '#fef3c7' : 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.375rem',
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                📄 AI-Generated License
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                {services.aiLicense ? 
                  `${services.aiLicense.type} license with professional terms` :
                  'Instant professional licensing with customizable terms'
                }
              </p>
            </div>
            <button
              onClick={generateLicense}
              disabled={processing || services.aiLicense?.generated}
              style={{
                background: services.aiLicense ? '#f59e0b' : '#8b5cf6',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                cursor: processing ? 'not-allowed' : 'pointer',
                opacity: processing && activeService === 'license' ? 0.7 : 1
              }}
            >
              {services.aiLicense ? '✓ Generated' : processing && activeService === 'license' ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>

        {/* Sponsor Content */}
        <div style={{ 
          background: services.sponsorContent ? '#ecfdf5' : 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.375rem',
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                💰 Sponsored Content Revenue
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                {services.sponsorContent ? 
                  `+$${services.sponsorContent.revenue} revenue per mint` :
                  'Earn additional revenue with sponsor placements'
                }
              </p>
            </div>
            <button
              onClick={enableSponsorContent}
              style={{
                background: services.sponsorContent ? '#10b981' : '#059669',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              {services.sponsorContent ? '✓ Enabled' : 'Enable'}
            </button>
          </div>
        </div>
      </div>

      {Object.keys(services).length > 0 && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '0.75rem', 
          background: '#f0fdf4', 
          borderRadius: '0.375rem',
          border: '1px solid #bbf7d0'
        }}>
          <p style={{ fontSize: '0.875rem', color: '#059669', margin: 0, fontWeight: '500' }}>
            ✓ {Object.keys(services).length} professional service{Object.keys(services).length > 1 ? 's' : ''} configured
          </p>
        </div>
      )}
    </div>
  )
}