'use client'

import Link from 'next/link'
import { urlFor } from '@/lib/sanity-client'

interface CardLink {
  text: string
  url: string
  isExternal: boolean
}

interface Card {
  title: string
  description: string
  icon?: string
  image?: any
  link?: CardLink
}

interface FeatureCardsBlockProps {
  title?: string
  subtitle?: string
  cards: Card[]
  columns?: number
  style?: 'default' | 'bordered' | 'shadowed' | 'minimal'
}

export default function FeatureCardsBlock({ 
  title, 
  subtitle, 
  cards, 
  columns = 3,
  style = 'default'
}: FeatureCardsBlockProps) {
  if (!cards || cards.length === 0) return null

  return (
    <div className="my-12">
      {/* Header */}
      {(title || subtitle) && (
        <div className="text-center mb-10">
          {title && <h2 className="text-3xl font-bold mb-3">{title}</h2>}
          {subtitle && <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>}
        </div>
      )}
      
      {/* Cards Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-${Math.min(columns, 4)} gap-8`}>
        {cards.map((card, index) => (
          <div 
            key={index} 
            className={`feature-card ${getCardClass(style)}`}
          >
            {/* Card Image */}
            {card.image && (
              <div className="mb-4">
                <img
                  src={urlFor(card.image).width(400).height(225).url()}
                  alt={card.title}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}
            
            {/* Card Icon */}
            {card.icon && !card.image && (
              <div className="text-3xl mb-4">
                {card.icon}
              </div>
            )}
            
            {/* Card Content */}
            <h3 className="text-xl font-bold mb-2">{card.title}</h3>
            <p className="text-gray-600 mb-4">{card.description}</p>
            
            {/* Card Link */}
            {card.link && (
              card.link.isExternal ? (
                <a 
                  href={card.link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {card.link.text || 'Learn more'} →
                </a>
              ) : (
                <Link 
                  href={card.link.url}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {card.link.text || 'Learn more'} →
                </Link>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper function for card styling
function getCardClass(style: string): string {
  switch (style) {
    case 'bordered':
      return 'p-6 border border-gray-200 rounded-lg hover:border-gray-300'
    case 'shadowed':
      return 'p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'
    case 'minimal':
      return 'p-4'
    default:
      return 'p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'
  }
}