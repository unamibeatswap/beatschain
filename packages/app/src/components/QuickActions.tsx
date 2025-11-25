'use client'

import { useBeatNFT } from '@/hooks/useBeatNFT'

export default function QuickActions() {
  const { balance } = useBeatNFT()

  const actions = [
    {
      title: 'Upload New Beat',
      description: 'Add a new beat to your collection',
      icon: '⬆️',
      href: '/upload',
      color: 'bg-blue-600 hover:bg-blue-700',
      available: balance.credits > 0 || balance.hasProNFT
    },
    {
      title: 'Buy Credits',
      description: 'Get more upload credits',
      icon: '🎫',
      href: '/beatnft-store',
      color: 'bg-green-600 hover:bg-green-700',
      available: !balance.hasProNFT
    },
    {
      title: 'View Analytics',
      description: 'Check your beat performance',
      icon: '📊',
      href: '/dashboard/analytics',
      color: 'bg-purple-600 hover:bg-purple-700',
      available: true
    },
    {
      title: 'Manage Profile',
      description: 'Update your producer profile',
      icon: '👤',
      href: '#profile',
      color: 'bg-gray-600 hover:bg-gray-700',
      available: true,
      onClick: () => document.getElementById('profile-section')?.scrollIntoView({ behavior: 'smooth' })
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">⚡ Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.filter(action => action.available).map((action, index) => (
          <div key={index}>
            {action.onClick ? (
              <button
                onClick={action.onClick}
                className={`w-full p-4 rounded-lg text-white text-center transition-colors ${action.color}`}
              >
                <div className="text-2xl mb-2">{action.icon}</div>
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs opacity-80 mt-1">{action.description}</div>
              </button>
            ) : (
              <a
                href={action.href}
                className={`block w-full p-4 rounded-lg text-white text-center transition-colors ${action.color}`}
              >
                <div className="text-2xl mb-2">{action.icon}</div>
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs opacity-80 mt-1">{action.description}</div>
              </a>
            )}
          </div>
        ))}
      </div>
      
      {/* Credit Status */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Upload Credits:</span>
          <span className="font-medium text-gray-900">
            {balance.hasProNFT ? '♾️ Unlimited' : `${balance.credits} remaining`}
          </span>
        </div>
      </div>
    </div>
  )
}