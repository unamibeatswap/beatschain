'use client'

import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import type { CmsHeroSection } from '@/lib/sanity/types'

interface HeroSectionProps {
  data: CmsHeroSection
}

export default function CmsHeroSection({ data }: HeroSectionProps) {
  if (!data || !data.headline) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>BeatsChain</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>Content loading...</p>
        </div>
      </div>
    )
  }
  
  const { headline, subheadline, backgroundImage, style, ctaButtons, badges } = data

  const getBackgroundStyle = () => {
    try {
      switch (style) {
        case 'image':
          if (backgroundImage) {
            const imageUrl = urlFor(backgroundImage).url()
            return imageUrl 
              ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
          }
          return { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
        case 'gradient':
        default:
          return { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
      }
    } catch (error) {
      return { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
    }
  }

  return (
    <div style={{
      ...getBackgroundStyle(),
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }}></div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '1.5rem', lineHeight: '1.1' }}>
            {headline}
          </h1>
          {subheadline && (
            <p style={{ fontSize: '1.5rem', marginBottom: '3rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 3rem' }}>
              {subheadline}
            </p>
          )}
          
          {badges && badges.length > 0 && (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {badges.map((badge, index) => (
                <div key={index} style={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '2rem', 
                  border: '1px solid rgba(255,255,255,0.2)' 
                }}>
                  {badge}
                </div>
              ))}
            </div>
          )}
          
          {ctaButtons && ctaButtons.length > 0 && (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {ctaButtons.map((button, index) => {
                if (!button || !button.text) return null
                return (
                  <a
                    key={index}
                    href={button.url || '#'}
                    style={{
                      background: button.style === 'primary' ? '#fbbf24' : 'rgba(255,255,255,0.2)',
                      color: button.style === 'primary' ? '#1f2937' : 'white',
                      padding: '1rem 2rem',
                      borderRadius: '0.5rem',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '1.125rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      border: button.style === 'secondary' ? '2px solid rgba(255,255,255,0.3)' : 'none'
                    }}
                  >
                    {button.text}
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}