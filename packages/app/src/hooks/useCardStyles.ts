'use client'

import { useState, useEffect } from 'react'
import { client } from '@/lib/sanity'

export interface CardStyle {
  cardBackground: string
  borderRadius: string
  borderColor: string
  shadowSize: string
  accentColor: string
  defaultCoverGradient: string
  coverImageHeight: string
}

const DEFAULT_STYLE: CardStyle = {
  cardBackground: 'white',
  borderRadius: '0.5rem',
  borderColor: '#e5e7eb',
  shadowSize: 'sm',
  accentColor: '#3b82f6',
  defaultCoverGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  coverImageHeight: '200px'
}

export function useCardStyles() {
  const [beatCardStyle, setBeatCardStyle] = useState<CardStyle>(DEFAULT_STYLE)
  const [producerCardStyle, setProducerCardStyle] = useState<CardStyle>(DEFAULT_STYLE)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStyles() {
      try {
        if (!client) return

        // Get default beat card style
        const beatStyle = await client.fetch(`
          *[_type == "beatCardStyle" && isDefault == true][0]
        `)

        // Get default producer card style
        const producerStyle = await client.fetch(`
          *[_type == "producerCardStyle" && isDefault == true][0]
        `)

        if (beatStyle) {
          setBeatCardStyle({
            cardBackground: beatStyle.cardBackground || DEFAULT_STYLE.cardBackground,
            borderRadius: beatStyle.borderRadius || DEFAULT_STYLE.borderRadius,
            borderColor: beatStyle.borderColor || DEFAULT_STYLE.borderColor,
            shadowSize: beatStyle.shadowSize || DEFAULT_STYLE.shadowSize,
            accentColor: beatStyle.accentColor || DEFAULT_STYLE.accentColor,
            defaultCoverGradient: beatStyle.defaultCoverGradient || DEFAULT_STYLE.defaultCoverGradient,
            coverImageHeight: beatStyle.coverImageHeight || DEFAULT_STYLE.coverImageHeight
          })
        }

        if (producerStyle) {
          setProducerCardStyle({
            cardBackground: producerStyle.cardBackground || DEFAULT_STYLE.cardBackground,
            borderRadius: producerStyle.borderRadius || DEFAULT_STYLE.borderRadius,
            borderColor: producerStyle.borderColor || DEFAULT_STYLE.borderColor,
            shadowSize: producerStyle.shadowSize || DEFAULT_STYLE.shadowSize,
            accentColor: producerStyle.accentColor || DEFAULT_STYLE.accentColor,
            defaultCoverGradient: producerStyle.defaultCoverGradient || DEFAULT_STYLE.defaultCoverGradient,
            coverImageHeight: producerStyle.coverImageHeight || DEFAULT_STYLE.coverImageHeight
          })
        }
      } catch (error) {
        console.error('Error loading card styles:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStyles()
  }, [])

  return {
    beatCardStyle,
    producerCardStyle,
    loading,
    getShadowClass: (size: string) => {
      switch (size) {
        case 'sm': return 'shadow-sm'
        case 'md': return 'shadow'
        case 'lg': return 'shadow-lg'
        default: return ''
      }
    }
  }
}