'use client'

import DashboardLayout from '@/components/DashboardLayout'
import EnhancedBeatManagement from '@/components/EnhancedBeatManagement'

export default function BeatsPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">🎵 My Beats</h1>
        <EnhancedBeatManagement />
      </div>
    </DashboardLayout>
  )
}