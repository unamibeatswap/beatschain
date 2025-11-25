'use client'

import { Beat } from '@/types/data'
import Web3AudioPlayer from '@/components/Web3AudioPlayer'
import { useUnifiedAuth } from '@/context/UnifiedAuthContext'

interface DashboardAudioPlayerProps {
  beat: Beat
  variant?: 'dashboard' | 'admin' | 'profile' | 'analytics'
  showWaveform?: boolean
  enableEdit?: boolean
  showModeration?: boolean
  showOwnership?: boolean
  showMetrics?: boolean
  className?: string
  onEdit?: (beat: Beat) => void
  onApprove?: (beat: Beat) => void
  onReject?: (beat: Beat) => void
}

export default function DashboardAudioPlayer({
  beat,
  variant = 'dashboard',
  showWaveform = false,
  enableEdit = false,
  showModeration = false,
  showOwnership = false,
  showMetrics = false,
  className = '',
  onEdit,
  onApprove,
  onReject
}: DashboardAudioPlayerProps) {
  const { user } = useUnifiedAuth()
  
  // Determine user permissions
  const isProducer = user?.address === beat.producerId
  const isAdmin = user?.role === 'admin'
  const canEdit = enableEdit && isProducer
  const canModerate = showModeration && isAdmin

  return (
    <div className={`dashboard-audio-player ${className}`}>
      <Web3AudioPlayer 
        beat={beat}
        showWaveform={showWaveform}
        className="mb-4"
      />
      
      {/* Dashboard-specific controls */}
      <div className="dashboard-controls flex justify-between items-center">
        <div className="beat-info">
          {showOwnership && (
            <div className="ownership-badge bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
              ✓ Owned
            </div>
          )}
          
          {showMetrics && (
            <div className="metrics flex gap-4 text-sm text-gray-600">
              <span>👁️ {beat.views || 0} views</span>
              <span>▶️ {beat.plays || 0} plays</span>
              <span>💰 {beat.sales || 0} sales</span>
            </div>
          )}
        </div>
        
        <div className="action-buttons flex gap-2">
          {canEdit && (
            <button
              onClick={() => onEdit?.(beat)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              ✏️ Edit
            </button>
          )}
          
          {canModerate && (
            <>
              <button
                onClick={() => onApprove?.(beat)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
              >
                ✓ Approve
              </button>
              <button
                onClick={() => onReject?.(beat)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                ✗ Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}