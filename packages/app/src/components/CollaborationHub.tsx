'use client'

import { useState } from 'react'
import { useCollaboration } from '@/hooks/useCollaboration'
import { useContentCreator } from '@/hooks/useContentCreator'

export default function CollaborationHub() {
  const { creator } = useContentCreator()
  const { matches, projects, loading, generateMatches, createProject } = useCollaboration()
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [selectedProducer, setSelectedProducer] = useState('')

  const handleCreateProject = async () => {
    if (!projectName || !selectedProducer) return
    
    const success = await createProject(
      projectName,
      [selectedProducer],
      { [selectedProducer]: 60, [creator?.walletAddress || '']: 25 } // 15% platform fee
    )
    
    if (success) {
      setShowCreateProject(false)
      setProjectName('')
      setSelectedProducer('')
    }
  }

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-gray-600 bg-gray-100'
  }

  return (
    <div className="space-y-6">
      {/* AI Producer Matches */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">🤖 AI Producer Matches</h2>
          <button
            onClick={generateMatches}
            disabled={loading}
            className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Matching...' : '🔄 Refresh'}
          </button>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🤝</div>
            <p className="text-gray-600">No matches yet</p>
            <p className="text-sm text-gray-500">AI will find compatible producers for you</p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{match.producerName}</h3>
                    <p className="text-sm text-gray-600">{match.producerAddress}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMatchColor(match.matchScore)}`}>
                    {match.matchScore}% Match
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Shared Genres</p>
                    <div className="flex flex-wrap gap-1">
                      {match.sharedGenres.map((genre) => (
                        <span key={genre} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Stats</p>
                    <p className="text-sm text-gray-600">Avg Price: ${match.avgBeatPrice}</p>
                    <p className="text-sm text-gray-600">Response Rate: {match.responseRate}%</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Why This Match?</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {match.compatibilityReasons.map((reason, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedProducer(match.producerAddress)
                      setShowCreateProject(true)
                    }}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    🤝 Start Collaboration
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50">
                    💬 Send Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Projects */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📁 Active Collaborations</h2>
        
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📁</div>
            <p className="text-gray-600">No active collaborations</p>
            <p className="text-sm text-gray-500">Start a project with a matched producer</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {project.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Participants: {project.participants.length}</p>
                  <p>Beats: {project.beatNftIds.length}</p>
                  <p>Revenue: ${project.totalRevenue}</p>
                  <p>Your Share: {project.revenueShares[creator?.walletAddress || ''] || 0}%</p>
                </div>
                
                <button className="mt-3 w-full px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                  📊 View Project
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🤝 Start Collaboration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Summer Vibes Campaign"
                />
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg text-sm">
                <h4 className="font-medium text-blue-900 mb-2">Revenue Split (15% Platform Fee)</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Producer</span>
                    <span>60%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Creator (You)</span>
                    <span>25%</span>
                  </div>
                  <div className="flex justify-between border-t pt-1">
                    <span>Platform Fee</span>
                    <span>15%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateProject(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!projectName}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}