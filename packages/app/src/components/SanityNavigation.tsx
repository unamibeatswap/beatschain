'use client'

import { useState } from 'react'
import { LinkComponent } from './LinkComponent'
import { useNavigation } from '@/hooks/useNavigation'
import { usePathname } from 'next/navigation'
import { useUnifiedAuth } from '@/context/UnifiedAuthContext'

export default function SanityNavigation() {
  const { mainNav, loading } = useNavigation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useUnifiedAuth()

  // Fallback navigation items if Sanity data isn't available
  const fallbackNavItems = user ? [
    { label: 'BeatNFTs', link: '/beatnfts', icon: '🎫' },
    { label: 'Producers', link: '/producers', icon: '👨‍🎤' },
    { label: 'Dashboard', link: '/dashboard', icon: '📊' },
  ] : [
    { label: 'BeatNFTs', link: '/beatnfts', icon: '🎫' },
    { label: 'Producers', link: '/producers', icon: '👨‍🎤' },
  ]

  // Use Sanity navigation or fallback
  const navigationItems = mainNav?.length > 0 ? mainNav : fallbackNavItems

  if (loading) return <div className="h-16 bg-white border-b border-gray-200"></div>

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigationItems.map((item) => (
                <div key={item.label} className="relative group">
                  {item.isExternal ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                        pathname === item.link
                          ? 'border-indigo-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } text-sm font-medium`}
                    >
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.label}
                    </a>
                  ) : (
                    <LinkComponent
                      href={item.link}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                        pathname === item.link
                          ? 'border-indigo-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } text-sm font-medium`}
                    >
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.label}
                    </LinkComponent>
                  )}

                  {/* Dropdown for items with children */}
                  {item.children && item.children.length > 0 && (
                    <div className="absolute z-10 hidden group-hover:block pt-2 w-48">
                      <div className="bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                        {item.children.map((child) => (
                          <div key={child.label}>
                            {child.isExternal ? (
                              <a
                                href={child.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                {child.label}
                              </a>
                            ) : (
                              <LinkComponent
                                href={child.link}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                {child.label}
                              </LinkComponent>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <div key={item.label}>
                {item.isExternal ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block pl-3 pr-4 py-2 border-l-4 ${
                      pathname === item.link
                        ? 'border-indigo-500 text-indigo-700 bg-indigo-50'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                    } text-base font-medium`}
                  >
                    {item.label}
                  </a>
                ) : (
                  <LinkComponent
                    href={item.link}
                    className={`block pl-3 pr-4 py-2 border-l-4 ${
                      pathname === item.link
                        ? 'border-indigo-500 text-indigo-700 bg-indigo-50'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                    } text-base font-medium`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </LinkComponent>
                )}
                
                {/* Mobile dropdown */}
                {item.children && item.children.length > 0 && (
                  <div className="pl-6 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <div key={child.label}>
                        {child.isExternal ? (
                          <a
                            href={child.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block pl-3 pr-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                          >
                            {child.label}
                          </a>
                        ) : (
                          <LinkComponent
                            href={child.link}
                            className="block pl-3 pr-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {child.label}
                          </LinkComponent>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}