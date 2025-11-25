'use client'

interface AuthState {
  address?: string
  isAuthenticated: boolean
  role?: string
  timestamp: number
}

class AuthStateManager {
  private currentState: AuthState | null = null
  private stateChangeCallbacks = new Set<(state: AuthState | null) => void>()
  
  setState(state: AuthState | null) {
    // Only update if state actually changed
    if (this.hasStateChanged(state)) {
      this.currentState = state
      this.notifyCallbacks()
    }
  }
  
  private hasStateChanged(newState: AuthState | null): boolean {
    if (!this.currentState && !newState) return false
    if (!this.currentState || !newState) return true
    
    return (
      this.currentState.address !== newState.address ||
      this.currentState.isAuthenticated !== newState.isAuthenticated ||
      this.currentState.role !== newState.role
    )
  }
  
  private notifyCallbacks() {
    this.stateChangeCallbacks.forEach(callback => {
      try {
        callback(this.currentState)
      } catch (error) {
        console.error('Auth state callback error:', error)
      }
    })
  }
  
  subscribe(callback: (state: AuthState | null) => void) {
    this.stateChangeCallbacks.add(callback)
    
    // Return unsubscribe function
    return () => {
      this.stateChangeCallbacks.delete(callback)
    }
  }
  
  getState(): AuthState | null {
    return this.currentState
  }
  
  clear() {
    this.currentState = null
    this.stateChangeCallbacks.clear()
  }
}

export const authStateManager = new AuthStateManager()