'use client'

import { LinkComponent } from './LinkComponent'
import { useUnifiedAuth } from '@/context/UnifiedAuthContext'
import { useContentCreator } from '@/hooks/useContentCreator'

export default function DashboardSidebar() {
  const { user } = useUnifiedAuth()
  const { isCreator } = useContentCreator()
  
  if (!user) return null
  
  // Common links for all users
  const commonLinks = [
    { icon: "👤", label: "Profile", path: "/profile" },
    { icon: "🎫", label: "BeatNFT Store", path: "/beatnft-store" },
  ]
  
  // Music lover links
  const musicLinks = [
    { icon: "🎧", label: "Music Dashboard", path: "/music-dashboard" },
    { icon: "🔍", label: "Discover", path: "/browse" },
    { icon: "❤️", label: "Favorites", path: "/music-dashboard#favorites" },
  ]
  
  // Role-specific links
  let roleLinks = []
  
  if (user.role === 'admin' || user.role === 'super_admin') {
    roleLinks = [
      { icon: "👥", label: "Users", path: "/admin/users" },
      { icon: "🎵", label: "Beats", path: "/admin/beats" },
      { icon: "💰", label: "Transactions", path: "/admin/transactions" },
      { icon: "📊", label: "Analytics", path: "/admin/analytics" },
      { icon: "⚙️", label: "Settings", path: "/admin/settings" },
    ]
  } else if (isCreator) {
    roleLinks = [
      { icon: "🎨", label: "My Licenses", path: "/creator-dashboard/licenses" },
      { icon: "🔍", label: "Find Beats", path: "/creator-dashboard/discover" },
      { icon: "📈", label: "Content Stats", path: "/creator-dashboard/stats" },
      { icon: "🤝", label: "Negotiations", path: "/creator-dashboard/negotiations" },
    ]
  } else if (user.role === 'producer') {
    // Producer links
    roleLinks = [
      { icon: "🎵", label: "My Beats", path: "/dashboard/beats" },
      { icon: "📊", label: "Analytics", path: "/dashboard/analytics" },
      { icon: "💰", label: "Earnings", path: "/dashboard/earnings" },
      { icon: "🤝", label: "Negotiations", path: "/dashboard/negotiations" },
      { icon: "⛓️", label: "Blockchain", path: "/dashboard/blockchain" },
    ]
  } else {
    // Music lover/general user links
    roleLinks = musicLinks
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {user.role === 'admin' || user.role === 'super_admin' 
            ? 'Admin Dashboard' 
            : isCreator 
              ? 'Creator Dashboard' 
              : user.role === 'producer'
                ? 'Producer Dashboard'
                : 'Music Dashboard'}
        </h2>
      </div>
      
      <div className="space-y-1">
        {/* Common Links */}
        {commonLinks.map(link => (
          <LinkComponent
            key={link.path}
            href={link.path}
            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </LinkComponent>
        ))}
        
        <div className="border-t border-gray-200 my-4"></div>
        
        {/* Role-specific Links */}
        {roleLinks.map(link => (
          <LinkComponent
            key={link.path}
            href={link.path}
            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </LinkComponent>
        ))}
      </div>
    </div>
  )
}