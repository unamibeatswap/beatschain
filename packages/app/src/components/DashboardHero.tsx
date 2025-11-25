'use client'

import { useEffect, useState } from 'react'
import { getHeroSection, DEFAULT_HEROES, HeroData } from '@/lib/sanity-heroes'
import { urlFor } from '@/lib/sanity-client'

interface DashboardHeroProps {
  pageSlug: string
  fallbackTitle?: string
}

export default function DashboardHero({ pageSlug, fallbackTitle }: DashboardHeroProps) {
  const [heroData, setHeroData] = useState<HeroData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadHero() {
      try {
        // Try to get hero from Sanity first
        const sanityHero = await getHeroSection(pageSlug)
        
        if (sanityHero) {
          setHeroData(sanityHero)
        } else {
          // Use default hero for the page
          const defaultHero = DEFAULT_HEROES[pageSlug]
          if (defaultHero) {
            setHeroData(defaultHero)
          } else {
            // Fallback hero
            setHeroData({
              headline: fallbackTitle || 'Dashboard',
              subheadline: 'Manage your account and preferences',
              style: 'gradient'
            })
          }
        }
      } catch (error) {
        console.warn('Error loading hero:', error)
        // Use default on error
        setHeroData(DEFAULT_HEROES[pageSlug] || {
          headline: fallbackTitle || 'Dashboard',
          style: 'gradient'
        })
      } finally {
        setLoading(false)
      }
    }

    loadHero()
  }, [pageSlug, fallbackTitle])

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-white/20 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!heroData) return null

  const getBackgroundStyle = () => {
    if (heroData.style === 'image' && heroData.backgroundImage) {
      return {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${urlFor(heroData.backgroundImage).width(1200).height(600).url()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    }
    
    // Default gradient based on page
    const gradients = {
      'dashboard': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'creator-dashboard': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'collector-dashboard': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'music-dashboard': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    }
    
    return {
      background: gradients[pageSlug as keyof typeof gradients] || gradients.dashboard
    }
  }

  return (
    <div 
      className="text-white py-16 relative"
      style={getBackgroundStyle()}
    >
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {heroData.headline}
        </h1>
        {heroData.subheadline && (
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            {heroData.subheadline}
          </p>
        )}
        
        {heroData.badges && heroData.badges.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {heroData.badges.map((badge, index) => (
              <div 
                key={index}
                className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 text-sm font-medium"
              >
                {badge}
              </div>
            ))}
          </div>
        )}
        
        {heroData.ctaButtons && heroData.ctaButtons.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4">
            {heroData.ctaButtons.map((button, index) => (
              <a
                key={index}
                href={button.url}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  button.style === 'primary'
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : 'bg-white/20 border border-white/30 hover:bg-white/30'
                }`}
              >
                {button.text}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}