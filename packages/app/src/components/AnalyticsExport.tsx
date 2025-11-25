'use client'

import { useState } from 'react'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useMarketAnalytics } from '@/hooks/useMarketAnalytics'
import { useBehaviorAnalytics } from '@/hooks/useBehaviorAnalytics'

export default function AnalyticsExport() {
  const [exporting, setExporting] = useState(false)
  const [exportType, setExportType] = useState<'csv' | 'json' | 'pdf'>('csv')
  const { data: analyticsData } = useAnalytics()
  const { analytics: marketData } = useMarketAnalytics()
  const { analytics: behaviorData } = useBehaviorAnalytics()

  const exportData = async () => {
    setExporting(true)
    
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        beatPerformance: analyticsData.beatPerformance,
        marketTrends: marketData.genreTrends,
        userBehavior: behaviorData.engagement,
        creditSystem: behaviorData.creditSystemEffectiveness
      }

      if (exportType === 'json') {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
        downloadFile(blob, `beatschain-analytics-${Date.now()}.json`)
      } else if (exportType === 'csv') {
        const csv = convertToCSV(exportData)
        const blob = new Blob([csv], { type: 'text/csv' })
        downloadFile(blob, `beatschain-analytics-${Date.now()}.csv`)
      } else if (exportType === 'pdf') {
        // Simple text-based PDF export
        const text = generateReportText(exportData)
        const blob = new Blob([text], { type: 'text/plain' })
        downloadFile(blob, `beatschain-report-${Date.now()}.txt`)
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setExporting(false)
    }
  }

  const convertToCSV = (data: any) => {
    const rows = [
      ['Metric', 'Value'],
      ['Total Plays', data.beatPerformance.totalPlays],
      ['Total Sales', data.beatPerformance.totalSales],
      ['Total Revenue (ETH)', data.beatPerformance.totalRevenue],
      ['Average Price (ETH)', data.beatPerformance.averagePrice],
      ['Conversion Rate (%)', data.userBehavior.conversionRate],
      ['Session Time (s)', data.userBehavior.averageSessionTime],
      ['Bounce Rate (%)', data.userBehavior.bounceRate],
      ['Free to Pro Conversion (%)', data.creditSystem.freeToProConversion],
      ['Credit Utilization (%)', data.creditSystem.creditUtilization]
    ]
    
    return rows.map(row => row.join(',')).join('\n')
  }

  const generateReportText = (data: any) => {
    return `
BEATSCHAIN ANALYTICS REPORT
Generated: ${new Date().toLocaleString()}

BEAT PERFORMANCE
- Total Plays: ${data.beatPerformance.totalPlays.toLocaleString()}
- Total Sales: ${data.beatPerformance.totalSales}
- Total Revenue: ${data.beatPerformance.totalRevenue.toFixed(4)} ETH
- Average Price: ${data.beatPerformance.averagePrice.toFixed(4)} ETH

USER BEHAVIOR
- Conversion Rate: ${data.userBehavior.conversionRate.toFixed(1)}%
- Average Session: ${Math.round(data.userBehavior.averageSessionTime)}s
- Bounce Rate: ${data.userBehavior.bounceRate.toFixed(1)}%

BEATNFT CREDIT SYSTEM
- Free to Pro Conversion: ${data.creditSystem.freeToProConversion.toFixed(1)}%
- Credit Utilization: ${data.creditSystem.creditUtilization.toFixed(1)}%
- Average Credits/User: ${data.creditSystem.averageCreditsPerUser.toFixed(1)}

MARKET TRENDS
${data.marketTrends.map((trend: any) => 
  `- ${trend.genre}: ${trend.volume} beats (${trend.growth > 0 ? '+' : ''}${trend.growth.toFixed(1)}%)`
).join('\n')}
    `.trim()
  }

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
        📊 Export Analytics
      </h3>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>
            Export Format
          </label>
          <select
            value={exportType}
            onChange={(e) => setExportType(e.target.value as 'csv' | 'json' | 'pdf')}
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          >
            <option value="csv">CSV Spreadsheet</option>
            <option value="json">JSON Data</option>
            <option value="pdf">Text Report</option>
          </select>
        </div>
        
        <button
          onClick={exportData}
          disabled={exporting}
          style={{
            background: exporting ? '#9ca3af' : '#3b82f6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: exporting ? 'not-allowed' : 'pointer',
            marginTop: '1.5rem'
          }}
        >
          {exporting ? '📤 Exporting...' : '📤 Export Data'}
        </button>
      </div>
      
      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
        <p>Export includes:</p>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li>Beat performance metrics</li>
          <li>Market trend analysis</li>
          <li>User behavior insights</li>
          <li>BeatNFT credit system data</li>
        </ul>
      </div>
    </div>
  )
}