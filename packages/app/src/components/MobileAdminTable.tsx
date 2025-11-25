'use client'

import { ReactNode } from 'react'
import { useMobileOptimization } from '@/hooks/useMobileOptimization'

interface Column {
  key: string
  label: string
  render?: (value: any, item: any) => ReactNode
}

interface MobileAdminTableProps {
  data: any[]
  columns: Column[]
  onItemClick?: (item: any) => void
  loading?: boolean
  emptyMessage?: string
}

export default function MobileAdminTable({ 
  data, 
  columns, 
  onItemClick, 
  loading = false,
  emptyMessage = 'No data available'
}: MobileAdminTableProps) {
  const { isMobile } = useMobileOptimization()

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">📊</div>
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <div 
            key={item.id || index} 
            className={`bg-white p-4 rounded-lg shadow ${onItemClick ? 'cursor-pointer hover:shadow-md' : ''}`}
            onClick={() => onItemClick?.(item)}
          >
            {columns.map(col => (
              <div key={col.key} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                <span className="font-medium text-gray-700 text-sm">{col.label}:</span>
                <span className="text-gray-900 text-sm">
                  {col.render ? col.render(item[col.key], item) : item[col.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  // Desktop table view
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(col => (
              <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr 
              key={item.id || index} 
              className={`hover:bg-gray-50 ${onItemClick ? 'cursor-pointer' : ''}`}
              onClick={() => onItemClick?.(item)}
            >
              {columns.map(col => (
                <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {col.render ? col.render(item[col.key], item) : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}