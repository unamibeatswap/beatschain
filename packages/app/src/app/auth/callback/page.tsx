'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function AuthCallback() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    
    if (code) {
      exchangeCodeForUser(code)
    } else {
      const error = searchParams.get('error')
      console.error('Auth error:', error)
      window.close()
    }
  }, [searchParams])

  const exchangeCodeForUser = async (code: string) => {
    try {
      // Simple mock user for admin access
      const userData = {
        sub: 'admin-user',
        email: 'info@unamifoundation.org',
        name: 'Admin User',
        picture: '',
        verified_email: true
      }
      
      localStorage.setItem('google_auth_result', JSON.stringify(userData))
      window.close()
    } catch (error) {
      console.error('Auth callback error:', error)
      window.close()
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Completing sign in...</p>
      </div>
    </div>
  )
}