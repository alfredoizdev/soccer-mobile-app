import { authService } from './auth-service'
import { API_CONFIG } from './config'

// Constants
const API_BASE_URL = API_CONFIG.BASE_URL

// Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

// API Service Class
class ApiService {
  /**
   * Make an authenticated API request
   */
  async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`
      const headers = {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
        ...options.headers,
      }

      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request error:', error)
      throw error
    }
  }

  /**
   * GET request
   */
  async get<T = any>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint
    return this.request<T>(url, { method: 'GET' })
  }

  /**
   * POST request
   */
  async post<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  /**
   * PUT request
   */
  async put<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  /**
   * PATCH request
   */
  async patch<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  /**
   * Upload file
   */
  async uploadFile<T = any>(
    endpoint: string,
    file: any,
    additionalData?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData()

      // Add file
      formData.append('file', file)

      // Add additional data
      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, value)
        })
      }

      const headers = {
        ...authService.getAuthHeaders(),
        // Remove Content-Type for FormData
      }
      delete headers['Content-Type']

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('File upload error:', error)
      throw error
    }
  }
}

// Export singleton instance
export const apiService = new ApiService()

// Convenience functions for common API operations
export const api = {
  // Users
  getUsers: (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
  }) => apiService.get('/users', params),

  getUser: (id: string) => apiService.get(`/users/${id}`),

  searchUsers: (query: string, params?: { limit?: number; status?: string }) =>
    apiService.get('/users/search', { q: query, ...params }),

  // Players
  getPlayers: (params?: {
    page?: number
    limit?: number
    search?: string
    organizationId?: string
  }) => apiService.get('/players', params),

  getPlayer: (id: string) => apiService.get(`/players/${id}`),

  // Organizations
  getOrganizations: (params?: {
    page?: number
    limit?: number
    search?: string
  }) => apiService.get('/organizations', params),

  getOrganization: (id: string) => apiService.get(`/organizations/${id}`),

  // Matches
  getMatches: (params?: {
    page?: number
    limit?: number
    status?: string
    isLive?: boolean
  }) => apiService.get('/matches', params),

  getMatch: (id: string) => apiService.get(`/matches/${id}`),

  // Posts
  getPosts: (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
  }) => apiService.get('/posts', params),

  getPost: (slug: string) => apiService.get(`/posts/${slug}`),

  // Streaming
  getActiveStreams: () => apiService.get('/streaming/active'),
}
