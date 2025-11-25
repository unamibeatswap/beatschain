'use client'

import DashboardLayout from '@/components/DashboardLayout'
import EarningsOverview from '@/components/EarningsOverview'

export default function EarningsPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">💰 Earnings</h1>
        <EarningsOverview />
      </div>
    </DashboardLayout>
  )
}