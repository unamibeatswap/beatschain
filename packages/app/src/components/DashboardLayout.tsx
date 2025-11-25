'use client'

import { ReactNode } from 'react'
import DashboardSidebar from './DashboardSidebar'
import MobileNavigation from './MobileNavigation'
import { useUnifiedAuth } from '@/context/UnifiedAuthContext'
import { useMobileOptimization } from '@/hooks/useMobileOptimization'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated } = useUnifiedAuth()
  const { isMobile, getMobileClasses } = useMobileOptimization()
  
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gray-50 ${isMobile ? 'px-4' : ''}`}>
        <div className="text-center">
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-medium text-gray-900 mb-4`}>
            Please connect your wallet
          </h2>
          <p className={`text-gray-600 mb-6 ${isMobile ? 'text-sm' : ''}`}>
            You need to connect your wallet to access the dashboard
          </p>
          <w3m-button label="Connect Wallet" balance="hide" />
        </div>
      </div>
    )
  }
  
  return (
    <div className={`${isMobile ? 'flex flex-col' : 'flex'} min-h-screen bg-gray-50 ${isMobile ? 'pb-16' : ''}`}>
      {!isMobile && <DashboardSidebar />}
      
      <div className={`flex-1 ${getMobileClasses('p-6', 'p-4')} overflow-x-hidden`}>
        {children}
      </div>
      
      {isMobile && <MobileNavigation />}
    </div>
  )
}