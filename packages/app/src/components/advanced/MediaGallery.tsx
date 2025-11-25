'use client'

import { useState } from 'react'

interface MediaGalleryProps {
  data: {
    galleryType: 'imageGrid' | 'videoPlaylist' | 'audioPlayer'
    items: Array<{
      title: string
      media: { asset: { url: string } }
      thumbnail?: { asset: { url: string } }
    }>
  }
}

export default function MediaGallery({ data }: MediaGalleryProps) {
  const [activeItem, setActiveItem] = useState(0)

  if (data.galleryType === 'audioPlayer') {
    return (
      <div style={{ padding: '2rem', background: '#1f2937', borderRadius: '1rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
            {data.items[activeItem]?.title}
          </h3>
          <audio
            controls
            style={{ width: '100%' }}
            src={data.items[activeItem]?.media.asset.url}
          />
        </div>
        
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {data.items.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveItem(index)}
              style={{
                padding: '1rem',
                background: activeItem === index ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (data.galleryType === 'imageGrid') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', padding: '2rem' }}>
        {data.items.map((item, index) => (
          <div key={index} style={{ borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <img
              src={item.thumbnail?.asset.url || item.media.asset.url}
              alt={item.title}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <div style={{ padding: '1rem', background: 'white' }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{item.title}</h4>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <video
          controls
          style={{ width: '100%', maxHeight: '400px' }}
          src={data.items[activeItem]?.media.asset.url}
        />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        {data.items.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveItem(index)}
            style={{
              padding: '0.5rem',
              background: activeItem === index ? '#3b82f6' : 'white',
              color: activeItem === index ? 'white' : '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  )
}