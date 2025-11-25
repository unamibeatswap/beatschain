'use client'

import { ReactNode } from 'react'
import { useMobileOptimization } from '@/hooks/useMobileOptimization'

interface MobileMetricCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  trend?: {
    value: number
    label: string
    positive?: boolean
  }
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'gray'
  loading?: boolean
}

export default function MobileMetricCard({ 
  title, 
  value, 
  icon, 
  trend, 
  color = 'blue',
  loading = false 
}: MobileMetricCardProps) {
  const { isMobile, getMobileClasses } = useMobileOptimization()

  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-900',
    green: 'from-green-50 to-green-100 border-green-200 text-green-900',
    purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-900',
    yellow: 'from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-900',
    red: 'from-red-50 to-red-100 border-red-200 text-red-900',
    gray: 'from-gray-50 to-gray-100 border-gray-200 text-gray-900'
  }

  const iconBgClasses = {
    blue: 'bg-blue-200',
    green: 'bg-green-200',
    purple: 'bg-purple-200',
    yellow: 'bg-yellow-200',
    red: 'bg-red-200',
    gray: 'bg-gray-200'
  }

  if (loading) {
    return (
      <div className={`bg-gradient-to-r ${colorClasses[color]} ${getMobileClasses('p-4', 'p-3')} rounded-lg border animate-pulse`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          </div>
          <div className={`${iconBgClasses[color]} ${getMobileClasses('p-3', 'p-2')} rounded-full`}>
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-r ${colorClasses[color]} ${getMobileClasses('p-4', 'p-3')} rounded-lg border`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`${getMobileClasses('text-sm', 'text-xs')} font-medium opacity-80`}>
            {title}
          </p>
          <p className={`${getMobileClasses('text-2xl', 'text-xl')} font-bold mt-1`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trend && (
            <div className={`flex items-center mt-2 ${getMobileClasses('text-sm', 'text-xs')}`}>
              <span className={trend.positive !== false ? 'text-green-600' : 'text-red-600'}>
                {trend.positive !== false ? '↗' : '↘'} {Math.abs(trend.value)}%
              </span>
              <span className="ml-1 opacity-70">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`${iconBgClasses[color]} ${getMobileClasses('p-3', 'p-2')} rounded-full flex-shrink-0 ml-3`}>
            <div className={getMobileClasses('text-2xl', 'text-xl')}>
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}