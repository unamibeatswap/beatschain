'use client'

import { usePlatformStats } from '@/hooks/usePlatformStats'

interface StatsDisplayProps {
  layout?: 'grid' | 'row'
  showLabels?: boolean
  theme?: 'light' | 'dark'
}

export default function StatsDisplay({ 
  layout = 'grid', 
  showLabels = true,
  theme = 'light' 
}: StatsDisplayProps) {
  const { totalBeats, totalUsers, totalRevenue, isLoading } = usePlatformStats()
  
  const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white'
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const accentColor = theme === 'dark' ? 'text-yellow-400' : 'text-blue-600'
  
  return (
    <div className={`${bgColor} p-6 rounded-lg shadow-sm`}>
      <div className={`${layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'flex flex-wrap justify-around'}`}>
        <div className="text-center">
          <div className={`text-3xl font-bold ${accentColor}`}>
            {isLoading ? '...' : totalBeats}
          </div>
          {showLabels && <div className={`text-sm ${textColor} opacity-80`}>Beats Available</div>}
        </div>
        
        <div className="text-center">
          <div className={`text-3xl font-bold ${accentColor}`}>
            {isLoading ? '...' : totalUsers}
          </div>
          {showLabels && <div className={`text-sm ${textColor} opacity-80`}>Registered Users</div>}
        </div>
        
        <div className="text-center">
          <div className={`text-3xl font-bold ${accentColor}`}>
            R{isLoading ? '...' : totalRevenue.toFixed(0)}
          </div>
          {showLabels && <div className={`text-sm ${textColor} opacity-80`}>Total Revenue</div>}
        </div>
      </div>
    </div>
  )
}