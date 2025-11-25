'use client'

import { useState, useEffect } from 'react'
import { useUnifiedAuth } from '@/context/UnifiedAuthContext'
import { useWeb3Data } from '@/context/Web3DataContext'
import { toast } from 'react-toastify'

interface CollabRequest {
  id: string
  fromProducer: string
  toProducer: string
  beatId: string
  message: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: Date
}

export default function ProducerCollaboration() {
  const { user } = useUnifiedAuth()
  const { beats } = useWeb3Data()
  const [requests, setRequests] = useState<CollabRequest[]>([])
  const [showNewRequest, setShowNewRequest] = useState(false)
  const [selectedBeat, setSelectedBeat] = useState('')
  const [targetProducer, setTargetProducer] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadCollabRequests()
  }, [user])

  const loadCollabRequests = () => {
    if (!user?.address || typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(`collab_requests_${user.address}`)
      if (stored) {
        const parsed = JSON.parse(stored).map((req: any) => ({
          ...req,
          createdAt: new Date(req.createdAt)
        }))
        setRequests(parsed)
      }
    } catch (error) {
      console.error('Failed to load collaboration requests:', error)
    }
  }

  const sendCollabRequest = async () => {
    if (!user?.address || !selectedBeat || !targetProducer || !message.trim()) {
      toast.error('Please fill all fields')
      return
    }

    try {
      const newRequest: CollabRequest = {
        id: `collab-${Date.now()}`,
        fromProducer: user.address,
        toProducer: targetProducer.toLowerCase(),
        beatId: selectedBeat,
        message: message.trim(),
        status: 'pending',
        createdAt: new Date()
      }

      // Store in sender's requests
      const senderRequests = JSON.parse(localStorage.getItem(`collab_requests_${user.address}`) || '[]')
      senderRequests.push(newRequest)
      localStorage.setItem(`collab_requests_${user.address}`, JSON.stringify(senderRequests))

      // Store in recipient's requests
      const recipientRequests = JSON.parse(localStorage.getItem(`collab_requests_${targetProducer.toLowerCase()}`) || '[]')
      recipientRequests.push(newRequest)
      localStorage.setItem(`collab_requests_${targetProducer.toLowerCase()}`, JSON.stringify(recipientRequests))

      setRequests(prev => [newRequest, ...prev])
      toast.success('🤝 Collaboration request sent!')
      
      // Reset form
      setSelectedBeat('')
      setTargetProducer('')
      setMessage('')
      setShowNewRequest(false)
    } catch (error) {
      console.error('Failed to send collaboration request:', error)
      toast.error('Failed to send request')
    }
  }

  const respondToRequest = (requestId: string, response: 'accepted' | 'declined') => {
    try {
      const updatedRequests = requests.map(req => 
        req.id === requestId ? { ...req, status: response } : req
      )
      setRequests(updatedRequests)
      
      if (user?.address) {
        localStorage.setItem(`collab_requests_${user.address}`, JSON.stringify(updatedRequests))
      }

      toast.success(`🎵 Request ${response}!`)
    } catch (error) {
      console.error('Failed to respond to request:', error)
      toast.error('Failed to respond')
    }
  }

  const myBeats = beats.filter(beat => 
    beat.producerId.toLowerCase() === user?.address?.toLowerCase()
  )

  const incomingRequests = requests.filter(req => 
    req.toProducer === user?.address?.toLowerCase() && req.status === 'pending'
  )

  const outgoingRequests = requests.filter(req => 
    req.fromProducer === user?.address?.toLowerCase()
  )

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">🤝 Producer Collaboration</h2>
          <button
            onClick={() => setShowNewRequest(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-sm"
          >
            New Request
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Incoming Requests */}
        {incomingRequests.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">📥 Incoming Requests</h3>
            <div className="space-y-3">
              {incomingRequests.map(request => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">
                        From: {request.fromProducer.slice(0, 6)}...{request.fromProducer.slice(-4)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Beat #{request.beatId}</p>
                      <p className="text-sm text-gray-700 mt-2">"{request.message}"</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => respondToRequest(request.id, 'accepted')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => respondToRequest(request.id, 'declined')}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Outgoing Requests */}
        {outgoingRequests.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">📤 Sent Requests</h3>
            <div className="space-y-3">
              {outgoingRequests.map(request => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">
                        To: {request.toProducer.slice(0, 6)}...{request.toProducer.slice(-4)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Beat #{request.beatId}</p>
                      <p className="text-sm text-gray-700 mt-2">"{request.message}"</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {requests.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🤝</div>
            <p className="text-gray-600 mb-2">No collaboration requests yet</p>
            <p className="text-sm text-gray-500">Connect with other producers to create amazing music together</p>
          </div>
        )}
      </div>

      {/* New Request Modal */}
      {showNewRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Send Collaboration Request</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Beat
                </label>
                <select
                  value={selectedBeat}
                  onChange={(e) => setSelectedBeat(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a beat...</option>
                  {myBeats.map(beat => (
                    <option key={beat.id} value={beat.id}>{beat.title}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Producer Wallet Address
                </label>
                <input
                  type="text"
                  value={targetProducer}
                  onChange={(e) => setTargetProducer(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hey! Want to collaborate on this beat?"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewRequest(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={sendCollabRequest}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}