'use client'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'purple' | 'green' | 'gray'
}

export function LoadingSpinner({ size = 'md', color = 'blue' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }
  
  const colorClasses = {
    blue: 'border-blue-600',
    purple: 'border-purple-600',
    green: 'border-green-600',
    gray: 'border-gray-600'
  }
  
  return (
    <div className={`${sizeClasses[size]} border-2 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`}></div>
  )
}

interface SkeletonProps {
  className?: string
  lines?: number
}

export function Skeleton({ className = '', lines = 1 }: SkeletonProps) {
  return (
    <div className="animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`bg-gray-200 rounded ${className} ${i > 0 ? 'mt-2' : ''}`}></div>
      ))}
    </div>
  )
}

export function BeatCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-4 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  )
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

interface TransactionStatusProps {
  status: 'pending' | 'confirmed' | 'failed'
  hash?: string
}

export function TransactionStatus({ status, hash }: TransactionStatusProps) {
  const statusConfig = {
    pending: {
      icon: <LoadingSpinner size="sm" color="blue" />,
      text: 'Transaction Pending',
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    confirmed: {
      icon: '✅',
      text: 'Transaction Confirmed',
      color: 'text-green-600 bg-green-50 border-green-200'
    },
    failed: {
      icon: '❌',
      text: 'Transaction Failed',
      color: 'text-red-600 bg-red-50 border-red-200'
    }
  }
  
  const config = statusConfig[status]
  
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${config.color}`}>
      {config.icon}
      <span className="text-sm font-medium">{config.text}</span>
      {hash && (
        <a 
          href={`https://sepolia.etherscan.io/tx/${hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs underline ml-2"
        >
          View
        </a>
      )}
    </div>
  )
}