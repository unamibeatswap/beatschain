'use client'

import { ReactNode } from 'react'
import { useMobileOptimization } from '@/hooks/useMobileOptimization'
import MobileNavigation from './MobileNavigation'
import { Header } from './Header'
import { Footer } from './Footer'

interface ResponsiveLayoutProps {
  children: ReactNode
  variant?: 'default' | 'dashboard' | 'admin'
}

export default function ResponsiveLayout({ children, variant = 'default' }: ResponsiveLayoutProps) {
  const { isMobile, isTablet, getMobileClasses } = useMobileOptimization()

  if (variant === 'dashboard' || variant === 'admin') {
    return (
      <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-16' : ''}`}>
        {!isMobile && <Header />}
        
        <main className={getMobileClasses(
          'container mx-auto px-6 py-4',
          'px-4 py-2'
        )}>
          {children}
        </main>
        
        {isMobile ? (
          <MobileNavigation />
        ) : (
          <Footer />
        )}
      </div>
    )
  }

  return (
    <div className={`flex flex-col min-h-screen ${isMobile ? 'pb-16' : ''}`}>
      {!isMobile && <Header />}
      
      <main className={`grow ${getMobileClasses(
        'px-4 container max-w-full mx-auto',
        'px-2 py-1'
      )}`}>
        {children}
      </main>
      
      {isMobile ? (
        <MobileNavigation />
      ) : (
        <Footer />
      )}
    </div>
  )
}