import AsyncStorage from '@react-native-async-storage/async-storage'

// Types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  lastName: string
  email: string
  password: string
  avatar?: string
}

export interface User {
  id: string
  name: string
  lastName: string
  email: string
  avatar?: string
  role: string
  organizationId?: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  success: boolean
  token: string
  user: User
}

export interface ApiError {
  error: string
  success: false
}

// Constants
const API_BASE_URL = 'https://your-domain.com/api'
const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

// Auth Service Class
class AuthService {
  private token: string | null = null
  private user: User | null = null

  /**
   * Initialize the auth service by loading stored credentials
   */
  async initialize(): Promise<void> {
    try {
      // Load token from AsyncStorage
      this.token = await AsyncStorage.getItem(TOKEN_KEY)

      // Load user data
      const userData = await AsyncStorage.getItem(USER_KEY)
      if (userData) {
        this.user = JSON.parse(userData)
      }
    } catch (error) {
      console.error('Error initializing auth service:', error)
    }
  }

  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data: AuthResponse | ApiError = await response.json()

      if (!data.success) {
        throw new Error((data as ApiError).error)
      }

      const authData = data as AuthResponse

      // Store token securely
      await this.storeToken(authData.token)
      await this.storeUser(authData.user)

      this.token = authData.token
      this.user = authData.user

      return authData
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  /**
   * Register new user
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data: AuthResponse | ApiError = await response.json()

      if (!data.success) {
        throw new Error((data as ApiError).error)
      }

      const authData = data as AuthResponse

      // Store token securely
      await this.storeToken(authData.token)
      await this.storeUser(authData.user)

      this.token = authData.token
      this.user = authData.user

      return authData
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }

  /**
   * Logout user and clear stored data
   */
  async logout(): Promise<void> {
    try {
      // Clear AsyncStorage
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY])

      this.token = null
      this.user = null
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return this.token
  }

  /**
   * Get current user
   */
  getUser(): User | null {
    return this.user
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.token !== null && this.user !== null
  }

  /**
   * Get auth headers for API requests
   */
  getAuthHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
    }
  }

  /**
   * Store token in AsyncStorage
   */
  private async storeToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token)
    } catch (error) {
      console.error('Error storing token:', error)
      throw error
    }
  }

  /**
   * Store user data in AsyncStorage
   */
  private async storeUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user))
    } catch (error) {
      console.error('Error storing user:', error)
      throw error
    }
  }

  /**
   * Refresh token (if needed in the future)
   */
  async refreshToken(): Promise<void> {
    // Implementation for token refresh if needed
    // This would call the backend to get a new token
    throw new Error('Token refresh not implemented yet')
  }

  /**
   * Validate token (check if it's expired)
   */
  isTokenValid(): boolean {
    if (!this.token) return false

    try {
      // Decode JWT token to check expiration
      const payload = JSON.parse(atob(this.token.split('.')[1]))
      const currentTime = Date.now() / 1000

      return payload.exp > currentTime
    } catch (error) {
      console.error('Error validating token:', error)
      return false
    }
  }
}

// Export singleton instance
export const authService = new AuthService()
