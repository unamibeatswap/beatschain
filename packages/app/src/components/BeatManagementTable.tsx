'use client'

import { useState, useEffect } from 'react'
import { useUnifiedAuth } from '@/context/UnifiedAuthContext'

export default function BeatManagementTable() {
  const { user } = useUnifiedAuth()
  const [beats, setBeats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [playingId, setPlayingId] = useState<string | null>(null)

  useEffect(() => {
    if (user?.address) {
      const stored = localStorage.getItem(`producer_beats_${user.address}`)
      if (stored) {
        setBeats(JSON.parse(stored))
      }
      setLoading(false)
    }
  }, [user?.address])

  const togglePlay = (beatId: string, audioUrl: string) => {
    if (playingId === beatId) {
      setPlayingId(null)
      // Stop audio
    } else {
      setPlayingId(beatId)
      // Play audio
    }
  }

  const toggleBeatStatus = (beatId: string) => {
    const updatedBeats = beats.map(beat => 
      beat.id === beatId 
        ? { ...beat, isActive: !beat.isActive, updatedAt: new Date() }
        : beat
    )
    setBeats(updatedBeats)
    if (user?.address) {
      localStorage.setItem(`producer_beats_${user.address}`, JSON.stringify(updatedBeats))
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading beats...</div>
  }

  if (beats.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border">
        <div className="text-4xl mb-4">🎵</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No beats uploaded yet</h3>
        <p className="text-gray-600 mb-4">Start uploading beats to see them here</p>
        <a 
          href="/upload" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Upload Your First Beat
        </a>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-900">🎵 My Beats ({beats.length})</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Beat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Genre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {beats.map((beat) => (
              <tr key={beat.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden">
                      {beat.coverImageUrl ? (
                        <img src={beat.coverImageUrl} alt={beat.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">🎵</div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{beat.title}</div>
                      <div className="text-sm text-gray-500">{beat.bpm} BPM • {beat.key}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 capitalize">{beat.genre}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{beat.price} ETH</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    beat.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {beat.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {beat.audioUrl && (
                      <button
                        onClick={() => togglePlay(beat.id, beat.audioUrl)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {playingId === beat.id ? '⏸️' : '▶️'}
                      </button>
                    )}
                    <button
                      onClick={() => toggleBeatStatus(beat.id)}
                      className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                      {beat.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}