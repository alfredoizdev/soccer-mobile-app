import { create } from 'zustand'
import {
  authService,
  LoginCredentials,
  RegisterCredentials,
  User,
} from '../services/auth-service'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  isInitialized: boolean

  // Actions
  initialize: () => Promise<void>
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => Promise<void>
  clearError: () => void
  forceReloadUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,

  initialize: async () => {
    // Prevent multiple initializations
    if (get().isInitialized) {
      return
    }

    try {
      set({ isLoading: true, error: null })
      await authService.initialize()

      const currentUser = authService.getUser()
      const isAuth = authService.isAuthenticated()

      set({
        user: currentUser,
        isAuthenticated: isAuth,
        isLoading: false,
        isInitialized: true,
      })
    } catch (error) {
      console.error('Error initializing auth:', error)
      set({
        isLoading: false,
        error: 'Failed to initialize authentication',
        isInitialized: true,
      })
    }
  },

  login: async (credentials: LoginCredentials) => {
    try {
      set({ isLoading: true, error: null })
      const response = await authService.login(credentials)

      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Login failed'
      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
      })
      throw error
    }
  },

  register: async (credentials: RegisterCredentials) => {
    try {
      set({ isLoading: true, error: null })
      const response = await authService.register(credentials)

      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      console.error('Register error:', error)
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      })
      throw error
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null })
      await authService.logout()

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      console.error('Logout error:', error)
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Logout failed',
      })
      throw error
    }
  },

  updateUser: async (userData: Partial<User>) => {
    try {
      // Update user in auth service (this will also update AsyncStorage)
      await authService.updateUser(userData)

      // Update local state
      set((state) => {
        if (!state.user) {
          return state
        }
        const updatedUser = { ...state.user, ...userData }
        return { user: updatedUser }
      })
    } catch (error) {
      console.error('Error updating user:', error)
    }
  },

  clearError: () => {
    set({ error: null })
  },

  // Force reload user from AsyncStorage
  forceReloadUser: async () => {
    try {
      await authService.initialize()

      const currentUser = authService.getUser()
      const isAuth = authService.isAuthenticated()

      set({
        user: currentUser,
        isAuthenticated: isAuth,
      })
    } catch (error) {
      console.error('Error force reloading user:', error)
    }
  },
}))
