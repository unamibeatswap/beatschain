'use client'

import { useState, useEffect } from 'react'
import { client } from '@/lib/sanity'

export interface PaginationStyle {
  buttonStyle: 'rounded' | 'square' | 'pill'
  activeColor: string
  inactiveColor: string
  textColor: string
  activeTextColor: string
  borderColor: string
  showPageInfo: boolean
  showItemCount: boolean
}

const DEFAULT_STYLE: PaginationStyle = {
  buttonStyle: 'rounded',
  activeColor: '#3b82f6',
  inactiveColor: 'white',
  textColor: '#374151',
  activeTextColor: 'white',
  borderColor: '#d1d5db',
  showPageInfo: true,
  showItemCount: true
}

export function usePaginationStyle() {
  const [style, setStyle] = useState<PaginationStyle>(DEFAULT_STYLE)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStyle() {
      try {
        if (!client) return

        const paginationStyle = await client.fetch(`
          *[_type == "paginationStyle" && isDefault == true][0]
        `)

        if (paginationStyle) {
          setStyle({
            buttonStyle: paginationStyle.buttonStyle || DEFAULT_STYLE.buttonStyle,
            activeColor: paginationStyle.activeColor || DEFAULT_STYLE.activeColor,
            inactiveColor: paginationStyle.inactiveColor || DEFAULT_STYLE.inactiveColor,
            textColor: paginationStyle.textColor || DEFAULT_STYLE.textColor,
            activeTextColor: paginationStyle.activeTextColor || DEFAULT_STYLE.activeTextColor,
            borderColor: paginationStyle.borderColor || DEFAULT_STYLE.borderColor,
            showPageInfo: paginationStyle.showPageInfo ?? DEFAULT_STYLE.showPageInfo,
            showItemCount: paginationStyle.showItemCount ?? DEFAULT_STYLE.showItemCount
          })
        }
      } catch (error) {
        console.error('Error loading pagination style:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStyle()
  }, [])

  const getBorderRadius = () => {
    switch (style.buttonStyle) {
      case 'pill': return '9999px'
      case 'square': return '0'
      case 'rounded':
      default: return '0.375rem'
    }
  }

  return {
    style,
    loading,
    getBorderRadius
  }
}