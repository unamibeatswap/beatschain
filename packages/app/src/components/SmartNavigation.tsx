'use client'

import { useState } from 'react'
import { LinkComponent } from './LinkComponent'
import { useUnifiedAuth } from '@/context/UnifiedAuthContext'
import { useContentCreator } from '@/hooks/useContentCreator'
import NotificationCenter from './NotificationCenter'

export default function SmartNavigation() {
  const { user, isAuthenticated } = useUnifiedAuth()
  const { isCreator } = useContentCreator()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Core navigation links that appear for all users
  const coreLinks = [
    { name: 'BeatNFTs', href: '/beatnfts', icon: '🎫' },
    { name: 'Producers', href: '/producers', icon: '👨‍🎤' },
  ]

  // Role-based dashboard links
  const getDashboardLink = () => {
    if (!user) return null
    
    if (user.role === 'admin' || user.role === 'super_admin') {
      return { name: 'Admin', href: '/admin', icon: '⚙️' }
    }
    
    if (isCreator) {
      return { name: 'Creator Dashboard', href: '/creator-dashboard', icon: '🎨' }
    }
    
    return { name: 'Dashboard', href: '/dashboard', icon: '📊' }
  }

  // Secondary links that appear in a separate section
  const secondaryLinks = [
    { name: 'BeatNFT Store', href: '/beatnft-store', icon: '🎫' },
    { name: 'Guide', href: '/guide', icon: '📖' },
    { name: 'Blog', href: '/blog', icon: '📝' },
  ]

  // Get dashboard link if user is logged in
  const dashboardLink = getDashboardLink()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Desktop Navigation - Core Links */}
          <div className="hidden md:flex items-center space-x-6">
            {coreLinks.map((item) => (
              <LinkComponent
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </LinkComponent>
            ))}
            
            {/* Dashboard link (role-based) */}
            {dashboardLink && (
              <LinkComponent
                href={dashboardLink.href}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <span>{dashboardLink.icon}</span>
                <span>{dashboardLink.name}</span>
              </LinkComponent>
            )}
          </div>

          {/* Secondary Links */}
          <div className="hidden md:flex items-center space-x-6">
            {secondaryLinks.map((item) => (
              <LinkComponent
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </LinkComponent>
            ))}
            
            {/* Notifications */}
            {isAuthenticated && <NotificationCenter />}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-8 h-8 text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-2">
              {/* Core Links */}
              {coreLinks.map((item) => (
                <LinkComponent
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </LinkComponent>
              ))}
              
              {/* Dashboard Link */}
              {dashboardLink && (
                <LinkComponent
                  href={dashboardLink.href}
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{dashboardLink.icon}</span>
                  <span>{dashboardLink.name}</span>
                </LinkComponent>
              )}
              
              <div className="border-t my-2"></div>
              
              {/* Secondary Links */}
              {secondaryLinks.map((item) => (
                <LinkComponent
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </LinkComponent>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}