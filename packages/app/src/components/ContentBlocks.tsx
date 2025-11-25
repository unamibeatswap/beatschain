'use client'

import { urlFor } from '@/lib/sanity'
import type { CmsContentBlock } from '@/lib/sanity/types'
import PaginatedList from './advanced/PaginatedList'
import InteractiveForm from './advanced/InteractiveForm'
import MediaGallery from './advanced/MediaGallery'
import DynamicTable from './advanced/DynamicTable'
import StatsDisplay from './StatsDisplay'

interface ContentBlocksProps {
  blocks: CmsContentBlock[]
}

export default function CmsContentBlocks({ blocks }: ContentBlocksProps) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null
  }
  
  const getBackgroundColor = (color?: string) => {
    switch (color) {
      case 'gray': return '#f9fafb'
      case 'blue': return '#f0f9ff'
      case 'green': return '#f0fdf4'
      case 'yellow': return '#fefce8'
      default: return 'white'
    }
  }

  return (
    <div>
      {blocks.map((block, index) => {
        if (!block || !block.type) return null
        return (
          <div key={index} style={{ background: getBackgroundColor(block.backgroundColor), padding: '4rem 2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            
            {/* Features Block */}
            {block.type === 'features' && (
              <div>
                {block.title && (
                  <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                      {block.title}
                    </h2>
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                  {block.items?.map((item, itemIndex) => (
                    <div key={itemIndex} style={{
                      textAlign: 'center',
                      padding: '2rem',
                      background: 'white',
                      borderRadius: '1rem',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      border: '1px solid #e5e7eb'
                    }}>
                      {item.icon && (
                        <div style={{
                          background: '#f3e8ff',
                          width: '4rem',
                          height: '4rem',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 1rem',
                          fontSize: '1.5rem'
                        }}>
                          {item.icon}
                        </div>
                      )}
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                        {item.title}
                      </h3>
                      <p style={{ color: '#6b7280' }}>
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Block */}
            {block.type === 'stats' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
                {block.items?.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#fbbf24' }}>
                      {item.value}
                    </div>
                    <div style={{ fontSize: '1.125rem', opacity: 0.8 }}>{item.title}</div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Block */}
            {block.type === 'cta' && (
              <div style={{ textAlign: 'center' }}>
                {block.title && (
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                    {block.title}
                  </h2>
                )}
                {block.items?.map((item, itemIndex) => (
                  <a
                    key={itemIndex}
                    href={item.value}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      padding: '1rem 2rem',
                      borderRadius: '0.5rem',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '1.125rem',
                      display: 'inline-block',
                      margin: '0.5rem'
                    }}
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            )}

            {/* Text Block */}
            {block.type === 'text' && (
              <div style={{ textAlign: 'center' }}>
                {block.title && (
                  <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                    {block.title}
                  </h2>
                )}
                {/* Rich text content would be rendered here */}
              </div>
            )}

            {/* Web3 Stats Block */}
            {block.type === 'web3Stats' && (
              <div>
                {block.title && (
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                      {block.title}
                    </h2>
                  </div>
                )}
                <StatsDisplay 
                  layout={block.layout || 'grid'} 
                  theme={block.backgroundColor === 'dark' ? 'dark' : 'light'}
                />
              </div>
            )}
            
            {/* Advanced Content Blocks */}
            {block.type === 'paginatedList' && block.items && (
              <PaginatedList data={{
                title: block.title,
                contentType: 'beats',
                itemsPerPage: 12,
                filters: ['Hip Hop', 'Trap', 'Amapiano']
              }} />
            )}

            {block.type === 'interactiveForm' && block.items && (
              <InteractiveForm data={{
                formType: 'contact',
                fields: [
                  { name: 'Name', type: 'text', required: true },
                  { name: 'Email', type: 'email', required: true },
                  { name: 'Message', type: 'textarea', required: true }
                ]
              }} />
            )}

            {block.type === 'mediaGallery' && block.items && (
              <MediaGallery data={{
                galleryType: 'audioPlayer',
                items: block.items.map(item => ({
                  title: item.title || 'Untitled',
                  media: { asset: { url: item.value || '' } }
                }))
              }} />
            )}

            {block.type === 'dynamicTable' && block.items && (
              <DynamicTable data={{
                tableType: 'pricing',
                columns: ['Plan', 'Price', 'Features'],
                rows: block.items.map(item => ({
                  cells: [item.title || '', item.value || '', item.description || '']
                }))
              }} />
            )}

          </div>
          </div>
        )
      }).filter(Boolean)}
    </div>
  )
}