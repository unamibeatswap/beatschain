import { Beat, UserProfile, Purchase } from '@/types'

// API utility functions for direct calls
export class ApiClient {
  private static async getAuthToken(): Promise<string> {
    const { auth } = await import('@/lib/firebase')
    
    if (!auth.currentUser) {
      throw new Error('User not authenticated')
    }
    
    return await auth.currentUser.getIdToken()
  }

  // Beats API
  static async getBeats(filters?: { genre?: string, producerId?: string, limit?: number }): Promise<Beat[]> {
    const params = new URLSearchParams()
    if (filters?.genre) params.append('genre', filters.genre)
    if (filters?.producerId) params.append('producerId', filters.producerId)
    if (filters?.limit) params.append('limit', filters.limit.toString())
    
    const response = await fetch(`/api/beats?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch beats: ${response.status}`)
    }
    
    const data = await response.json()
    return data.beats.map((beat: any) => ({
      ...beat,
      createdAt: new Date(beat.createdAt),
      updatedAt: new Date(beat.updatedAt)
    }))
  }

  static async getBeat(id: string): Promise<Beat> {
    const response = await fetch(`/api/beats/${id}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch beat: ${response.status}`)
    }
    
    const data = await response.json()
    return {
      ...data.beat,
      createdAt: new Date(data.beat.createdAt),
      updatedAt: new Date(data.beat.updatedAt)
    }
  }

  static async createBeat(beatData: Omit<Beat, 'id' | 'createdAt' | 'updatedAt'>): Promise<Beat> {
    const token = await this.getAuthToken()
    
    const response = await fetch('/api/beats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(beatData)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `Failed to create beat: ${response.status}`)
    }
    
    const data = await response.json()
    return {
      ...data.beat,
      createdAt: new Date(data.beat.createdAt),
      updatedAt: new Date(data.beat.updatedAt)
    }
  }

  static async updateBeat(id: string, updates: Partial<Beat>): Promise<Beat> {
    const token = await this.getAuthToken()
    
    const response = await fetch(`/api/beats/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `Failed to update beat: ${response.status}`)
    }
    
    const data = await response.json()
    return {
      ...data.beat,
      createdAt: new Date(data.beat.createdAt),
      updatedAt: new Date(data.beat.updatedAt)
    }
  }

  static async deleteBeat(id: string): Promise<void> {
    const token = await this.getAuthToken()
    
    const response = await fetch(`/api/beats/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `Failed to delete beat: ${response.status}`)
    }
  }

  // Upload API
  static async uploadFile(file: File, type: 'audio' | 'image'): Promise<string> {
    const token = await this.getAuthToken()
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `Upload failed: ${response.status}`)
    }
    
    const data = await response.json()
    return data.url
  }

  // Admin API
  static async getAdminStats(): Promise<any> {
    const token = await this.getAuthToken()
    
    const response = await fetch('/api/admin/stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `Failed to fetch stats: ${response.status}`)
    }
    
    const data = await response.json()
    return data.stats
  }

  static async getUsers(filters?: { role?: string, limit?: number }): Promise<UserProfile[]> {
    const token = await this.getAuthToken()
    
    const params = new URLSearchParams()
    if (filters?.role) params.append('role', filters.role)
    if (filters?.limit) params.append('limit', filters.limit.toString())
    
    const response = await fetch(`/api/admin/users?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `Failed to fetch users: ${response.status}`)
    }
    
    const data = await response.json()
    return data.users.map((user: any) => ({
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: user.updatedAt ? new Date(user.updatedAt) : undefined
    }))
  }

  static async createUser(userData: {
    email: string
    password: string
    displayName: string
    role?: 'user' | 'producer' | 'admin'
    isVerified?: boolean
  }): Promise<UserProfile> {
    const token = await this.getAuthToken()
    
    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `Failed to create user: ${response.status}`)
    }
    
    const data = await response.json()
    return {
      ...data.user,
      createdAt: new Date(data.user.createdAt),
      updatedAt: new Date(data.user.updatedAt)
    }
  }

  // Producer Stats API
  static async getProducerStats(producerId: string): Promise<any> {
    const response = await fetch(`/api/producer/stats?producerId=${producerId}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch producer stats: ${response.status}`)
    }
    
    const data = await response.json()
    return data.stats
  }
}