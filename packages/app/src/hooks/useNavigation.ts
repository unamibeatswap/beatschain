'use client'

import { useState, useEffect } from 'react'
import { getNavigation } from '@/lib/sanity-client'
import { useUnifiedAuth } from '@/context/UnifiedAuthContext'

// Default navigation items as fallback
const defaultNavItems = [
  { label: 'BeatNFTs', link: '/beatnfts', icon: '🎫' },
  { label: 'Producers', link: '/producers', icon: '👨‍🎤' },
  { label: 'Blog', link: '/blog', icon: '📝' },
]

export function useNavigation() {
  const [mainNav, setMainNav] = useState([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useUnifiedAuth()

  useEffect(() => {
    async function fetchNavigation() {
      try {
        const data = await getNavigation(true)

        if (data?.items && data.items.length > 0) {
          // Filter items based on authentication status
          const filteredItems = data.items.filter(item => 
            !item.requiresAuth || isAuthenticated
          ).map(item => ({
            ...item,
            children: item.children?.filter(child => 
              !child.requiresAuth || isAuthenticated
            ) || []
          }))
          
          setMainNav(filteredItems)
        } else {
          // Use default navigation if Sanity data isn't available
          const authItems = isAuthenticated ? [
            { label: 'Dashboard', link: '/dashboard', icon: '📊' }
          ] : []
          
          setMainNav([...defaultNavItems, ...authItems])
        }
      } catch (error) {
        console.error('Error fetching navigation:', error)
        // Use default navigation on error
        const authItems = isAuthenticated ? [
          { label: 'Dashboard', link: '/dashboard', icon: '📊' }
        ] : []
        
        setMainNav([...defaultNavItems, ...authItems])
      } finally {
        setLoading(false)
      }
    }

    fetchNavigation()
  }, [isAuthenticated])

  return { mainNav, loading }
}