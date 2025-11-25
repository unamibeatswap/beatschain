'use client'

import { useState, useEffect } from 'react'

interface PaginatedListProps {
  data: {
    title?: string
    contentType: 'beats' | 'producers' | 'posts'
    itemsPerPage: number
    filters?: string[]
  }
}

export default function PaginatedList({ data }: PaginatedListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('')

  useEffect(() => {
    async function fetchItems() {
      setLoading(true)
      try {
        const response = await fetch(`/api/${data.contentType}?page=${currentPage}&limit=${data.itemsPerPage}&filter=${activeFilter}`)
        const result = await response.json()
        setItems(result.items || [])
      } catch (error) {
        console.error('Error fetching items:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [currentPage, activeFilter, data.contentType, data.itemsPerPage])

  return (
    <div style={{ padding: '2rem' }}>
      {data.title && (
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
          {data.title}
        </h2>
      )}

      {/* Filters */}
      {data.filters && data.filters.length > 0 && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
          <button
            onClick={() => setActiveFilter('')}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              background: activeFilter === '' ? '#3b82f6' : 'white',
              color: activeFilter === '' ? 'white' : '#374151',
            }}
          >
            All
          </button>
          {data.filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                background: activeFilter === filter ? '#3b82f6' : 'white',
                color: activeFilter === filter ? 'white' : '#374151',
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      )}

      {/* Content Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
          Loading...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {items.map((item: any, index) => (
            <div key={index} style={{
              background: 'white',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                {item.title || item.name}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                {item.description || item.genre}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            background: currentPage === 1 ? '#f3f4f6' : 'white',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          }}
        >
          Previous
        </button>
        <span style={{ padding: '0.5rem 1rem', color: '#374151' }}>
          Page {currentPage}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            background: 'white',
            cursor: 'pointer',
          }}
        >
          Next
        </button>
      </div>
    </div>
  )
}