import React, { useState } from 'react'
import { useUnifiedAuth } from '@/context/UnifiedAuthContext'
import RoleSelectionModal from './RoleSelectionModal'

export function Connect() {
  const [showRoleModal, setShowRoleModal] = useState(false)
  const { isAuthenticated } = useUnifiedAuth()

  return (
    <div className="flex items-center">
      {isAuthenticated ? (
        // When authenticated, show wallet button
        <>
          <div className="hidden sm:block">
            <w3m-button label='🔗 Wallet' balance='hide' size='sm' />
          </div>
          <div className="sm:hidden">
            <w3m-button label='💳' balance='hide' size='sm' />
          </div>
        </>
      ) : (
        // When not authenticated, show unified sign up button
        <button
          onClick={() => setShowRoleModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Sign Up / Connect
        </button>
      )}

      <RoleSelectionModal 
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
      />
    </div>
  )
}
