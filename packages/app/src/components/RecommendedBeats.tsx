'use client'

import { useAIRecommendations } from '@/hooks/useAIRecommendations'
import { BeatCardSkeleton } from '@/components/LoadingStates'
import { useMobileOptimization } from '@/hooks/useMobileOptimization'

export default function RecommendedBeats() {
  const { recommendations, loading, trackInteraction } = useAIRecommendations()
  const { getMobileClasses } = useMobileOptimization()

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">🎯 Recommended for You</h2>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <BeatCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">🎯 Recommended for You</h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎵</div>
          <p className="text-gray-600 mb-2">No recommendations yet</p>
          <p className="text-sm text-gray-500">Interact with beats to get personalized recommendations</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">🎯 Recommended for You</h2>
        <span className="text-sm text-gray-500">AI-powered</span>
      </div>
      
      <div className={getMobileClasses('space-y-4', 'grid grid-cols-1 gap-4')}>
        {recommendations.slice(0, 5).map((beat) => (
          <div key={beat.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
            <img 
              src={beat.coverImageUrl} 
              alt={beat.title}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{beat.title}</h3>
              <p className="text-sm text-gray-500">{beat.genre} • {beat.bpm} BPM</p>
              <p className="text-sm font-medium text-green-600">{beat.price} ETH</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => trackInteraction(beat.id, 'play')}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                title="Play"
              >
                ▶️
              </button>
              <button
                onClick={() => trackInteraction(beat.id, 'like')}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
                title="Like"
              >
                ❤️
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <a 
          href="/marketplace" 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View All Beats →
        </a>
      </div>
    </div>
  )
}