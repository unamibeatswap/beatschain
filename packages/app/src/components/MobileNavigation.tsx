'use client'

import { useState } from 'react'
import { useUnifiedAuth } from '@/context/UnifiedAuthContext'
import { LinkComponent } from '@/components/LinkComponent'
import { useMobileOptimization } from '@/hooks/useMobileOptimization'

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated } = useUnifiedAuth()
  const { isMobile } = useMobileOptimization()

  if (!isMobile) return null

  const navItems = [
    { href: '/', label: '🏠 Home', public: true },
    { href: '/marketplace', label: '🎵 Marketplace', public: true },
    { href: '/producers', label: '👥 Producers', public: true },
    { href: '/upload', label: '📤 Upload', auth: true },
    { href: '/dashboard', label: '📊 Dashboard', auth: true },
    { href: '/manage-subscription', label: '🎫 Credits', auth: true },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)}>
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 z-50" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
            
            <nav className="space-y-4">
              {navItems.map(item => {
                if (item.auth && !isAuthenticated) return null
                if (item.public || isAuthenticated) {
                  return (
                    <LinkComponent
                      key={item.href}
                      href={item.href}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </LinkComponent>
                  )
                }
                return null
              })}
              
              {isAuthenticated && user && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center gap-3 p-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.displayName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{user.displayName}</div>
                      <div className="text-sm text-gray-500">{user.role}</div>
                    </div>
                  </div>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}