import { create } from 'zustand'
import {
  Organization,
  organizationService,
} from '../services/organization-service'
import { useAuthStore } from './auth-store'

interface OrganizationState {
  userOrganization: Organization | null
  allOrganizations: Organization[]
  isLoading: boolean
  isLoadingOrganizations: boolean
  error: string | null
  isInitialized: boolean
  hasAttemptedFetch: boolean

  // Actions
  subscribeToUserChanges: () => () => void
  fetchUserOrganization: () => Promise<void>
  fetchAllOrganizations: (
    page?: number,
    limit?: number,
    search?: string
  ) => Promise<void>
  subscribeToTeam: (organizationId: string) => Promise<void>
  unsubscribeFromTeam: () => Promise<void>
  clearError: () => void
  clearOrganizationState: () => void
  refreshAndClearAvailable: () => void
  forceRefreshAfterSubscription: (organizationId: string) => Promise<void>
  forceUpdateAllScreens: () => void
  forceSyncWithAuthStore: () => Promise<void>
  handleOrganizationNotFound: () => Promise<void>
}

export const useOrganizationStore = create<OrganizationState>((set, get) => ({
  userOrganization: null,
  allOrganizations: [],
  isLoading: false,
  isLoadingOrganizations: false,
  error: null,
  isInitialized: false,
  hasAttemptedFetch: false,

  // Subscribe to user changes and auto-refresh organization
  subscribeToUserChanges: () => {
    const unsubscribe = useAuthStore.subscribe((state) => {
      const currentUser = state.user
      const currentState = get()


      // If user's organizationId changed, refresh organization data
      if (currentUser?.organizationId !== currentState.userOrganization?.id) {
        if (currentUser?.organizationId) {
          get().fetchUserOrganization()
        } else {
          // User no longer has organization, clear it
          set({ userOrganization: null })
        }
      }
    })

    return unsubscribe
  },

  fetchUserOrganization: async () => {
    try {
      set({ isLoading: true, error: null, hasAttemptedFetch: true })

      const organization = await organizationService.getUserOrganization()

      if (organization) {
        set({
          userOrganization: organization,
          isLoading: false,
          error: null,
          isInitialized: true,
          hasAttemptedFetch: true,
        })
      } else {
        // User is not subscribed to any organization
        set({
          userOrganization: null,
          isLoading: false,
          error: null,
          isInitialized: true,
          hasAttemptedFetch: true,
        })
      }
    } catch (error) {
      console.error('💥 Error fetching user organization:', error)

      // Check if it's a 404 error (organization not found)
      if (error instanceof Error && error.message.includes('404')) {
        await get().handleOrganizationNotFound()
        return
      }

      set({
        isLoading: false,
        error: 'Failed to fetch organization',
        isInitialized: true,
        hasAttemptedFetch: true,
      })
    }
  },

  fetchAllOrganizations: async (page = 1, limit = 20, search?: string) => {
    try {
      set({ isLoadingOrganizations: true, error: null })

      const result = await organizationService.getOrganizations(
        page,
        limit,
        search
      )

      set({
        allOrganizations: result.organizations,
        isLoadingOrganizations: false,
        error: null,
      })
    } catch (error) {
      console.error('Error fetching all organizations:', error)
      set({
        isLoadingOrganizations: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch organizations',
      })
    }
  },

  subscribeToTeam: async (organizationId: string) => {
    try {
      set({ isLoading: true, error: null })

      await organizationService.subscribeToTeam(organizationId)

      // Update user's organizationId in auth store
      await useAuthStore.getState().updateUser({ organizationId })

      // Verify that the organizationId was actually saved
      const updatedUser = useAuthStore.getState().user

      if (updatedUser?.organizationId !== organizationId) {
        console.error('❌ CRITICAL: organizationId was not saved correctly!')
        throw new Error('Failed to save organizationId to user')
      }

      // Force complete state refresh after subscription
      await get().forceRefreshAfterSubscription(organizationId)

      // Force update all screens
      get().forceUpdateAllScreens()

      set({
        isLoading: false,
        error: null,
      })

    } catch (error) {
      console.error('💥 Error subscribing to team:', error)
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to subscribe to team',
      })
    }
  },

  unsubscribeFromTeam: async () => {
    try {
      set({ isLoading: true, error: null })

      await organizationService.unsubscribeFromTeam()

      // Update user's organizationId in auth store
      await useAuthStore.getState().updateUser({ organizationId: undefined })

      // Clear user organization after unsubscription
      set({
        userOrganization: null,
        isLoading: false,
        error: null,
      })

      // Fetch all available organizations after unsubscription
      await get().fetchAllOrganizations()
    } catch (error) {
      console.error('Error unsubscribing from team:', error)
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to unsubscribe from team',
      })
    }
  },

  clearError: () => {
    set({ error: null })
  },

  clearOrganizationState: () => {
    set({
      userOrganization: null,
      allOrganizations: [],
      isLoading: false,
      error: null,
      isInitialized: false,
      hasAttemptedFetch: false,
    })
  },

  // Force refresh and clear available organizations when user is subscribed
  refreshAndClearAvailable: () => {
    set({
      allOrganizations: [],
      isLoading: false,
      error: null,
    })
  },

  // Force complete state refresh after subscription
  forceRefreshAfterSubscription: async (organizationId: string) => {
    try {

      // Clear available organizations and reset loading states
      set({
        allOrganizations: [],
        isLoading: false,
        isLoadingOrganizations: false,
        error: null,
      })

      // Fetch the new user organization
      await get().fetchUserOrganization()

    } catch (error) {
      console.error('Error refreshing state after subscription:', error)
    }
  },

  // Force update all screens
  forceUpdateAllScreens: () => {
    // This will trigger re-renders in all components using this store
    set((state) => ({ ...state }))
  },

  // Force sync with auth store
  forceSyncWithAuthStore: async () => {
    try {

      const authState = useAuthStore.getState()
      const currentUser = authState.user


      // If user has organizationId but we don't have userOrganization, fetch it
      if (currentUser?.organizationId && !get().userOrganization) {
        await get().fetchUserOrganization()
      }

      // If user doesn't have organizationId but we have userOrganization, clear it
      if (!currentUser?.organizationId && get().userOrganization) {
        set({ userOrganization: null })
      }

    } catch (error) {
      console.error('💥 Error in force sync:', error)
    }
  },

  handleOrganizationNotFound: async () => {

    try {
      // Clear the invalid organizationId from the user
      await useAuthStore.getState().updateUser({ organizationId: undefined })

      // Clear organization state
      set({
        userOrganization: null,
        isLoading: false,
        error: null,
        isInitialized: true,
        hasAttemptedFetch: true,
      })
    } catch (error) {
      console.error('Error handling organization not found:', error)
      set({
        isLoading: false,
        error: 'Failed to clear invalid team assignment',
        isInitialized: true,
        hasAttemptedFetch: true,
      })
    }
  },
}))
