'use client'

import { useState } from 'react'
import { useEnhancedToast } from '@/hooks/useToast.enhanced'

interface SignInButtonProps {
  signIn: () => Promise<void>
}

export default function SignInButton({ signIn }: SignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { success, error: showError } = useEnhancedToast()

  const handleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      await signIn()
      success('Successfully signed in!', { 
        throttleKey: 'signin-success',
        throttleMs: 10000,
        once: true
      })
      
      // If sign-in is successful, reload the page after a short delay
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (err: any) {
      console.error('Sign-in failed:', err)
      const errorMessage = err?.message || 'Failed to sign in. Please try again.'
      setError(errorMessage)
      showError(errorMessage, { 
        throttleKey: 'signin-error',
        throttleMs: 10000,
        once: true
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleSignIn}
        disabled={isLoading}
        style={{
          background: 'white',
          color: '#1d4ed8',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          fontWeight: 'bold',
          fontSize: '1rem',
          border: 'none',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: isLoading ? 0.7 : 1
        }}
      >
        {isLoading ? (
          <>
            <span style={{ 
              display: 'inline-block',
              width: '16px',
              height: '16px',
              border: '2px solid #1d4ed8',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></span>
            Signing...
          </>
        ) : (
          <>
            <span>✍️</span> Sign Message
          </>
        )}
      </button>
      
      {error && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          borderRadius: '0.5rem',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}
      
      <div style={{
        marginTop: '1rem',
        fontSize: '0.875rem',
        color: 'rgba(255, 255, 255, 0.7)'
      }}>
        Having trouble? Try refreshing the page or reconnecting your wallet.
      </div>
    </div>
  )
}