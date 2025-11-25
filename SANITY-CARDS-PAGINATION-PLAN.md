# Sanity Integration for Cards & Pagination

## 1. BeatNFT Card Enhancement

### Current Implementation
- BeatNFT cards display dynamic data from Web3/Firebase
- Cover images are loaded directly from URLs
- No Sanity integration for visual styling

### Enhancement Plan

#### Create a Sanity Schema for Card Styling
```typescript
// Add to sanity/schemas/cardStyles.ts
import { defineField, defineType } from 'sanity'

export const beatCardStyle = defineType({
  name: 'beatCardStyle',
  title: 'Beat Card Style',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Style Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'isDefault',
      title: 'Default Style',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'cardBackground',
      title: 'Card Background',
      type: 'string',
      options: {
        list: [
          { title: 'White', value: 'white' },
          { title: 'Light Gray', value: 'gray-50' },
          { title: 'Dark', value: 'gray-900' }
        ]
      },
      initialValue: 'white'
    }),
    defineField({
      name: 'borderRadius',
      title: 'Border Radius',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: '0' },
          { title: 'Small', value: '0.375rem' },
          { title: 'Medium', value: '0.5rem' },
          { title: 'Large', value: '0.75rem' },
          { title: 'Extra Large', value: '1rem' }
        ]
      },
      initialValue: '0.5rem'
    }),
    defineField({
      name: 'borderColor',
      title: 'Border Color',
      type: 'string',
      initialValue: '#e5e7eb'
    }),
    defineField({
      name: 'shadowSize',
      title: 'Shadow Size',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Small', value: 'sm' },
          { title: 'Medium', value: 'md' },
          { title: 'Large', value: 'lg' }
        ]
      },
      initialValue: 'sm'
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent Color',
      type: 'string',
      initialValue: '#3b82f6'
    }),
    defineField({
      name: 'defaultCoverGradient',
      title: 'Default Cover Gradient',
      description: 'Gradient for beats without cover images',
      type: 'string',
      initialValue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }),
    defineField({
      name: 'coverImageHeight',
      title: 'Cover Image Height',
      type: 'string',
      initialValue: '200px'
    })
  ]
})
```

#### Create a Card Style Hook
```typescript
// Create src/hooks/useCardStyles.ts
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
```

#### Update BeatCard Component
```typescript
// Update BeatCard.tsx
import { useCardStyles } from '@/hooks/useCardStyles'

// Inside BeatCard component
const { beatCardStyle, getShadowClass } = useCardStyles()

// Update the card container style
<div style={{
  background: beatCardStyle.cardBackground,
  borderRadius: beatCardStyle.borderRadius,
  boxShadow: getShadowClass(beatCardStyle.shadowSize),
  border: `1px solid ${beatCardStyle.borderColor}`,
  overflow: 'hidden'
}}>
  <div style={{
    height: beatCardStyle.coverImageHeight,
    background: beat.coverImageUrl ? 'none' : beatCardStyle.defaultCoverGradient,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1.125rem',
    fontWeight: '600'
  }}>
    {/* Rest of the component */}
  </div>
</div>
```

## 2. Producer Card Enhancement

### Create a Sanity Schema for Producer Card Styling
```typescript
// Add to sanity/schemas/cardStyles.ts
export const producerCardStyle = defineType({
  name: 'producerCardStyle',
  title: 'Producer Card Style',
  type: 'document',
  fields: [
    // Same fields as beatCardStyle with different defaults
    // ...
    defineField({
      name: 'profileImageSize',
      title: 'Profile Image Size',
      type: 'string',
      initialValue: '60px'
    }),
    defineField({
      name: 'verifiedBadgeColor',
      title: 'Verified Badge Color',
      type: 'string',
      initialValue: '#059669'
    })
  ]
})
```

### Create a ProducerCard Component
```typescript
// Create src/components/ProducerCard.tsx
import { useState } from 'react'
import { useCardStyles } from '@/hooks/useCardStyles'

interface Producer {
  id: string
  name: string
  location?: string
  genre?: string
  totalBeats?: number
  totalSales?: number
  rating?: number
  verified?: boolean
  profileImage?: string
}

interface ProducerCardProps {
  producer: Producer
}

export default function ProducerCard({ producer }: ProducerCardProps) {
  const { producerCardStyle, getShadowClass } = useCardStyles()
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div 
      style={{
        background: producerCardStyle.cardBackground,
        borderRadius: producerCardStyle.borderRadius,
        boxShadow: isHovered ? 'rgba(0, 0, 0, 0.15) 0px 4px 12px' : getShadowClass(producerCardStyle.shadowSize),
        border: `1px solid ${producerCardStyle.borderColor}`,
        padding: '1.5rem',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)'
      }}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      {/* Producer Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{
          width: producerCardStyle.profileImageSize,
          height: producerCardStyle.profileImageSize,
          borderRadius: '50%',
          background: producer.profileImage 
            ? `url(${producer.profileImage})` 
            : producerCardStyle.defaultCoverGradient,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem'
        }}>
          {!producer.profileImage && producer.name.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              {producer.name}
            </h3>
            {producer.verified && (
              <span style={{ color: producerCardStyle.verifiedBadgeColor, fontSize: '1rem' }}>✓</span>
            )}
          </div>
          {producer.location && (
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
              {producer.location}
            </p>
          )}
        </div>
      </div>

      {/* Producer Stats */}
      <div style={{ marginBottom: '1rem' }}>
        {producer.genre && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Genres:</span>
            <span style={{ color: '#1f2937', fontSize: '0.875rem', fontWeight: '500' }}>
              {producer.genre}
            </span>
          </div>
        )}
        {producer.totalBeats !== undefined && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Total Beats:</span>
            <span style={{ color: '#1f2937', fontSize: '0.875rem', fontWeight: '500' }}>
              {producer.totalBeats}
            </span>
          </div>
        )}
        {producer.totalSales !== undefined && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Total Sales:</span>
            <span style={{ color: '#059669', fontSize: '0.875rem', fontWeight: '500' }}>
              {producer.totalSales}
            </span>
          </div>
        )}
      </div>

      {/* Rating */}
      {producer.rating && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {[...Array(5)].map((_, i) => (
              <span key={i} style={{ 
                color: i < Math.floor(producer.rating || 0) ? '#fbbf24' : '#d1d5db',
                fontSize: '0.875rem'
              }}>
                ★
              </span>
            ))}
            <span style={{ color: '#6b7280', fontSize: '0.875rem', marginLeft: '0.5rem' }}>
              {producer.rating}
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <a href={`/producer/${producer.id}`} style={{
          flex: 1,
          background: producerCardStyle.accentColor,
          color: 'white',
          padding: '0.75rem',
          border: 'none',
          borderRadius: '0.375rem',
          fontWeight: '500',
          cursor: 'pointer',
          fontSize: '0.875rem',
          textDecoration: 'none',
          textAlign: 'center',
          display: 'block'
        }}>
          View Beats
        </a>
        <button style={{
          padding: '0.75rem',
          background: 'white',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          fontSize: '0.875rem'
        }}>
          Follow
        </button>
      </div>
    </div>
  )
}
```

## 3. Enhanced Pagination Component

### Create a Sanity Schema for Pagination Styling
```typescript
// Add to sanity/schemas/uiComponents.ts
import { defineField, defineType } from 'sanity'

export const paginationStyle = defineType({
  name: 'paginationStyle',
  title: 'Pagination Style',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Style Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'isDefault',
      title: 'Default Style',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'buttonStyle',
      title: 'Button Style',
      type: 'string',
      options: {
        list: [
          { title: 'Rounded', value: 'rounded' },
          { title: 'Square', value: 'square' },
          { title: 'Pill', value: 'pill' }
        ]
      },
      initialValue: 'rounded'
    }),
    defineField({
      name: 'activeColor',
      title: 'Active Button Color',
      type: 'string',
      initialValue: '#3b82f6'
    }),
    defineField({
      name: 'inactiveColor',
      title: 'Inactive Button Color',
      type: 'string',
      initialValue: 'white'
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'string',
      initialValue: '#374151'
    }),
    defineField({
      name: 'activeTextColor',
      title: 'Active Text Color',
      type: 'string',
      initialValue: 'white'
    }),
    defineField({
      name: 'borderColor',
      title: 'Border Color',
      type: 'string',
      initialValue: '#d1d5db'
    }),
    defineField({
      name: 'showPageInfo',
      title: 'Show Page Info',
      description: 'Show "Page X of Y" text',
      type: 'boolean',
      initialValue: true
    }),
    defineField({
      name: 'showItemCount',
      title: 'Show Item Count',
      description: 'Show "Showing X to Y of Z items" text',
      type: 'boolean',
      initialValue: true
    })
  ]
})
```

### Create a Pagination Style Hook
```typescript
// Create src/hooks/usePaginationStyle.ts
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
```

### Enhanced Pagination Component
```typescript
// Update src/components/Pagination.tsx
import { usePaginationStyle } from '@/hooks/usePaginationStyle'

interface PaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }: PaginationProps) {
  const { style, getBorderRadius } = usePaginationStyle()
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  if (totalPages <= 1) return null

  return (
    <div className="px-6 py-4 border-t border-gray-200">
      <div className="flex items-center justify-between">
        {style.showItemCount && (
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
          </div>
        )}
        <div className="flex gap-2 items-center">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '0.5rem 1rem',
              border: `1px solid ${style.borderColor}`,
              borderRadius: getBorderRadius(),
              background: currentPage === 1 ? '#f9fafb' : style.inactiveColor,
              color: currentPage === 1 ? '#9ca3af' : style.textColor,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          
          {style.showPageInfo && (
            <span className="px-3 py-1">
              Page {currentPage} of {totalPages}
            </span>
          )}
          
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => onPageChange(i + 1)}
              style={{
                padding: '0.5rem 0.75rem',
                border: `1px solid ${currentPage === i + 1 ? style.activeColor : style.borderColor}`,
                borderRadius: getBorderRadius(),
                background: currentPage === i + 1 ? style.activeColor : style.inactiveColor,
                color: currentPage === i + 1 ? style.activeTextColor : style.textColor,
                cursor: 'pointer',
                fontWeight: currentPage === i + 1 ? '600' : '400'
              }}
            >
              {i + 1}
            </button>
          ))}
          
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '0.5rem 1rem',
              border: `1px solid ${style.borderColor}`,
              borderRadius: getBorderRadius(),
              background: currentPage === totalPages ? '#f9fafb' : style.inactiveColor,
              color: currentPage === totalPages ? '#9ca3af' : style.textColor,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
```

## 4. Update Producers Page

```typescript
// Update src/app/producers/page.tsx
import ProducerCard from '@/components/ProducerCard'
import { Pagination } from '@/components/Pagination'

// Replace the inline producer cards with the component
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: '1.5rem',
  marginBottom: '2rem'
}}>
  {currentProducers.map((producer, index) => (
    <ProducerCard key={`${producer.id}-${index}`} producer={producer} />
  ))}
</div>

// Replace the inline pagination with the component
<Pagination
  currentPage={currentPage}
  totalItems={allProducers.length}
  itemsPerPage={producersPerPage}
  onPageChange={setCurrentPage}
/>
```

## 5. Update Schema Index

```typescript
// Update sanity/schemas/index.ts
import { beatCardStyle, producerCardStyle } from './cardStyles'
import { paginationStyle } from './uiComponents'

export const schemaTypes = [
  // Existing schemas...
  
  // UI Components
  beatCardStyle,
  producerCardStyle,
  paginationStyle,
]
```

## Implementation Steps

1. **Create Schema Files**:
   - Create `cardStyles.ts` with beat and producer card schemas
   - Create `uiComponents.ts` with pagination schema
   - Update `index.ts` to include new schemas

2. **Create Style Hooks**:
   - Create `useCardStyles.ts` hook
   - Create `usePaginationStyle.ts` hook

3. **Create/Update Components**:
   - Create `ProducerCard.tsx` component
   - Update `BeatCard.tsx` to use styles from Sanity
   - Update `Pagination.tsx` to use styles from Sanity

4. **Update Pages**:
   - Update `producers/page.tsx` to use the new components

5. **Seed Initial Styles**:
   - Create default styles in Sanity Studio for immediate use

## Benefits

1. **Consistent Design**: All cards and pagination follow the same design system
2. **Easy Customization**: Change styles through Sanity without code changes
3. **Reusable Components**: Components can be used across the application
4. **Separation of Concerns**: Data from Web3, styling from Sanity