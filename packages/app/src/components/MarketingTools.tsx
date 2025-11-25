'use client'

import { useState, useEffect } from 'react'
import { useUnifiedAuth } from '@/context/UnifiedAuthContext'
import { useWeb3Data } from '@/context/Web3DataContext'
import { toast } from 'react-toastify'

interface Campaign {
  id: string
  name: string
  beatId: string
  discount: number
  startDate: Date
  endDate: Date
  active: boolean
  uses: number
  maxUses: number
}

export default function MarketingTools() {
  const { user } = useUnifiedAuth()
  const { beats } = useWeb3Data()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [showNewCampaign, setShowNewCampaign] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    beatId: '',
    discount: 10,
    duration: 7
  })
  const [baseUrl, setBaseUrl] = useState('')

  // Set baseUrl on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin)
    }
  }, [])

  const myBeats = beats.filter(beat => 
    beat.producerId?.toLowerCase() === user?.address?.toLowerCase()
  ) || []

  const createCampaign = () => {
    if (!newCampaign.name || !newCampaign.beatId) {
      toast.error('Please fill all fields')
      return
    }

    const campaign: Campaign = {
      id: `campaign-${Date.now()}`,
      name: newCampaign.name,
      beatId: newCampaign.beatId,
      discount: newCampaign.discount,
      startDate: new Date(),
      endDate: new Date(Date.now() + newCampaign.duration * 24 * 60 * 60 * 1000),
      active: true,
      uses: 0,
      maxUses: 100
    }

    setCampaigns(prev => [campaign, ...prev])
    toast.success('🎯 Campaign created!')
    
    setNewCampaign({ name: '', beatId: '', discount: 10, duration: 7 })
    setShowNewCampaign(false)
  }

  const toggleCampaign = (id: string) => {
    setCampaigns(prev => prev.map(c => 
      c.id === id ? { ...c, active: !c.active } : c
    ))
  }
  
  const generateShareLink = (beatId: string, campaignId?: string) => {
    const siteUrl = baseUrl || 'https://beatschain.app' // Fallback URL
    const params = campaignId ? `?campaign=${campaignId}` : ''
    return `${siteUrl}/marketplace?beat=${beatId}${params}`
  }

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
      toast.success('📋 Link copied!')
    } else {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      try {
        document.execCommand('copy')
        toast.success('📋 Link copied!')
      } catch (err) {
        toast.error('Failed to copy link')
      }
      
      document.body.removeChild(textArea)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">🎯 Marketing Tools</h2>
          <button
            onClick={() => setShowNewCampaign(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 text-sm"
          >
            New Campaign
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Quick Share Links */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">📤 Quick Share</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myBeats.slice(0, 4).map(beat => (
              <div key={beat.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{beat.title}</p>
                    <p className="text-xs text-gray-500">{beat.price} ETH</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(generateShareLink(beat.id))}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={() => window.open(`https://twitter.com/intent/tweet?text=Check out my new beat: ${beat.title}&url=${generateShareLink(beat.id)}`, '_blank')}
                      className="text-blue-400 hover:text-blue-600 text-sm"
                    >
                      🐦 Tweet
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Campaigns */}
        {campaigns.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">🎯 Active Campaigns</h3>
            <div className="space-y-3">
              {campaigns.map(campaign => {
                const beat = myBeats.find(b => b.id === campaign.beatId)
                const isExpired = campaign.endDate < new Date()
                
                return (
                  <div key={campaign.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{campaign.name}</h4>
                        <p className="text-sm text-gray-600">
                          Beat: {beat?.title} • {campaign.discount}% off
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {campaign.uses}/{campaign.maxUses} uses • 
                          Expires: {campaign.endDate.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          campaign.active && !isExpired
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {isExpired ? 'Expired' : campaign.active ? 'Active' : 'Paused'}
                        </span>
                        <button
                          onClick={() => toggleCampaign(campaign.id)}
                          disabled={isExpired}
                          className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
                        >
                          {campaign.active ? 'Pause' : 'Resume'}
                        </button>
                        <button
                          onClick={() => copyToClipboard(generateShareLink(campaign.beatId, campaign.id))}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          📋 Share
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Social Media Templates */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">📱 Social Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">🐦 Twitter Template</h4>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <p>🎵 New beat drop! "{myBeats[0]?.title || 'Your Beat'}" is now live on @BeatsChain</p>
                <p className="mt-2">🔥 Genre: {myBeats[0]?.genre || 'Hip Hop'}</p>
                <p>⚡ BPM: {myBeats[0]?.bpm || '140'}</p>
                <p>💰 Price: {myBeats[0]?.price || '0.05'} ETH</p>
                <p className="mt-2">#BeatNFT #Web3Music #Blockchain</p>
              </div>
              <button
                onClick={() => {
                  const beat = myBeats[0]
                  if (beat) {
                    const text = `🎵 New beat drop! "${beat.title}" is now live on @BeatsChain\n\n🔥 Genre: ${beat.genre}\n⚡ BPM: ${beat.bpm}\n💰 Price: ${beat.price} ETH\n\n#BeatNFT #Web3Music #Blockchain`
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${generateShareLink(beat.id)}`, '_blank')
                  }
                }}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                🐦 Tweet This
              </button>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">📸 Instagram Template</h4>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <p>🎵 Fresh beats incoming!</p>
                <p className="mt-2">Just dropped "{myBeats[0]?.title || 'Your Beat'}" on the blockchain 🔥</p>
                <p className="mt-2">Own it as an NFT and support independent producers 💪</p>
                <p className="mt-2">#BeatNFT #Web3Music #IndependentArtist</p>
              </div>
              <button
                onClick={() => copyToClipboard(`🎵 Fresh beats incoming!\n\nJust dropped "${myBeats[0]?.title || 'Your Beat'}" on the blockchain 🔥\n\nOwn it as an NFT and support independent producers 💪\n\n#BeatNFT #Web3Music #IndependentArtist`)}
                className="mt-2 text-pink-600 hover:text-pink-800 text-sm"
              >
                📋 Copy Caption
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* New Campaign Modal */}
      {showNewCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Create Marketing Campaign</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                  placeholder="Summer Sale 2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Beat
                </label>
                <select
                  value={newCampaign.beatId}
                  onChange={(e) => setNewCampaign({...newCampaign, beatId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select a beat...</option>
                  {myBeats.map(beat => (
                    <option key={beat.id} value={beat.id}>{beat.title}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount (%)
                </label>
                <input
                  type="number"
                  value={newCampaign.discount}
                  onChange={(e) => setNewCampaign({...newCampaign, discount: parseInt(e.target.value)})}
                  min="5"
                  max="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (days)
                </label>
                <input
                  type="number"
                  value={newCampaign.duration}
                  onChange={(e) => setNewCampaign({...newCampaign, duration: parseInt(e.target.value)})}
                  min="1"
                  max="30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewCampaign(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={createCampaign}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}