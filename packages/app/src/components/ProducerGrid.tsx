'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Producer {
  id: string
  name: string
  displayName?: string
  bio?: string
  location?: string
  genres?: string[]
  profileImage?: string
  coverImage?: string
  isVerified?: boolean
  totalBeats?: number
  totalSales?: number
  featured?: boolean
}

interface ProducerGridProps {
  producers: Producer[]
  loading: boolean
  title?: string
  showFilters?: boolean
  showFeatured?: boolean
}

export default function ProducerGrid({ 
  producers, 
  loading, 
  title = 'Producers', 
  showFilters = true,
  showFeatured = true
}: ProducerGridProps) {
  const [filteredProducers, setFilteredProducers] = useState<Producer[]>([])
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const producersPerPage = 9
  
  // Extract all unique genres
  const allGenres = Array.from(
    new Set(
      producers.flatMap(producer => producer.genres || []).map(genre => genre.toLowerCase())
    )
  )
  
  // Filter producers based on active filter
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredProducers(producers)
    } else if (activeFilter === 'featured') {
      setFilteredProducers(producers.filter(producer => producer.featured))
    } else if (activeFilter === 'verified') {
      setFilteredProducers(producers.filter(producer => producer.isVerified))
    } else {
      setFilteredProducers(
        producers.filter(producer => 
          producer.genres?.some(genre => genre.toLowerCase() === activeFilter)
        )
      )
    }
    setCurrentPage(1)
  }, [activeFilter, producers])
  
  // Pagination
  const totalPages = Math.ceil(filteredProducers.length / producersPerPage)
  const startIndex = (currentPage - 1) * producersPerPage
  const currentProducers = filteredProducers.slice(startIndex, startIndex + producersPerPage)
  
  // Featured producers (first 3)
  const featuredProducers = showFeatured ? producers.filter(producer => producer.featured).slice(0, 3) : []
  
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading producers...</p>
      </div>
    )
  }
  
  if (producers.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <div className="text-5xl mb-4">👤</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Producers Available</h2>
        <p className="text-gray-600">
          Check back soon for the latest producers!
        </p>
      </div>
    )
  }
  
  return (
    <div className="space-y-10">
      {/* Featured Producers Section */}
      {featuredProducers.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Featured Producers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducers.map((producer) => (
              <motion.div 
                key={producer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl overflow-hidden shadow-md border border-indigo-100"
              >
                <div 
                  className="h-32 bg-cover bg-center"
                  style={{ 
                    backgroundImage: producer.coverImage 
                      ? `url(${producer.coverImage})` 
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                />
                
                <div className="p-6 pt-0 -mt-10 relative">
                  <div 
                    className="w-20 h-20 rounded-full border-4 border-white bg-cover bg-center mx-auto"
                    style={{ 
                      backgroundImage: producer.profileImage 
                        ? `url(${producer.profileImage})` 
                        : 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)'
                    }}
                  >
                    {!producer.profileImage && (
                      <div className="w-full h-full flex items-center justify-center text-white text-2xl">
                        {producer.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center mt-2">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-1">
                      <Link href={`/producer/${producer.id}`} className="hover:text-indigo-700 transition-colors">
                        {producer.displayName || producer.name}
                      </Link>
                      {producer.isVerified && (
                        <span className="text-blue-500 text-sm">✓</span>
                      )}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mt-1">
                      {producer.location || 'South Africa'}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 justify-center mt-3">
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Featured
                      </span>
                      {producer.genres?.slice(0, 2).map(genre => (
                        <span key={genre} className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {genre}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-center gap-6 mt-4 text-sm text-gray-500">
                      <div>
                        <span className="block font-bold text-gray-900">{producer.totalBeats || 0}</span>
                        <span>Beats</span>
                      </div>
                      <div>
                        <span className="block font-bold text-gray-900">{producer.totalSales || 0}</span>
                        <span>Sales</span>
                      </div>
                    </div>
                    
                    <Link
                      href={`/producer/${producer.id}`}
                      className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
      
      {/* Filters */}
      {showFilters && (
        <section>
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              All Producers
            </button>
            
            {showFeatured && (
              <button
                onClick={() => setActiveFilter('featured')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === 'featured'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Featured
              </button>
            )}
            
            <button
              onClick={() => setActiveFilter('verified')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === 'verified'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Verified
            </button>
            
            {allGenres.map(genre => (
              <button
                key={genre}
                onClick={() => setActiveFilter(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === genre
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </button>
            ))}
          </div>
        </section>
      )}
      
      {/* Main Grid */}
      <section>
        {title && (
          <h2 className="text-2xl font-bold mb-6 text-gray-900">{title}</h2>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProducers.map((producer, index) => (
            <motion.div 
              key={producer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div 
                className="h-24 bg-cover bg-center"
                style={{ 
                  backgroundImage: producer.coverImage 
                    ? `url(${producer.coverImage})` 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              />
              
              <div className="p-6 pt-0 -mt-8 relative">
                <div 
                  className="w-16 h-16 rounded-full border-4 border-white bg-cover bg-center"
                  style={{ 
                    backgroundImage: producer.profileImage 
                      ? `url(${producer.profileImage})` 
                      : 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)'
                  }}
                >
                  {!producer.profileImage && (
                    <div className="w-full h-full flex items-center justify-center text-white text-xl">
                      {producer.name.charAt(0)}
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-bold mt-2 text-gray-900 flex items-center gap-1">
                  <Link href={`/producer/${producer.id}`} className="hover:text-blue-700 transition-colors">
                    {producer.displayName || producer.name}
                  </Link>
                  {producer.isVerified && (
                    <span className="text-blue-500 text-sm">✓</span>
                  )}
                </h3>
                
                <p className="text-gray-600 text-sm">
                  {producer.location || 'South Africa'}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {producer.featured && (
                    <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Featured
                    </span>
                  )}
                  {producer.genres?.slice(0, 2).map(genre => (
                    <span key={genre} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {genre}
                    </span>
                  ))}
                </div>
                
                {producer.bio && (
                  <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                    {producer.bio}
                  </p>
                )}
                
                <div className="flex justify-start gap-6 mt-4 text-sm text-gray-500">
                  <div>
                    <span className="block font-bold text-gray-900">{producer.totalBeats || 0}</span>
                    <span>Beats</span>
                  </div>
                  <div>
                    <span className="block font-bold text-gray-900">{producer.totalSales || 0}</span>
                    <span>Sales</span>
                  </div>
                </div>
                
                <Link
                  href={`/producer/${producer.id}`}
                  className="mt-4 inline-block bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  View Profile
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="hidden md:flex">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === page
                      ? 'bg-indigo-50 text-indigo-600 z-10'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <div className="md:hidden flex items-center px-4 border-t border-b border-gray-300 bg-white">
              <span className="text-sm text-gray-700">
                {currentPage} / {totalPages}
              </span>
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}