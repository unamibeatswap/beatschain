'use client'

import DashboardLayout from '@/components/DashboardLayout'
import BeatAnalytics from '@/components/BeatAnalytics'

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">📊 Analytics</h1>
        <BeatAnalytics />
      </div>
    </DashboardLayout>
  )
}