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

      console.log('🔍 Auth store changed:', {
        userId: currentUser?.id,
        userOrganizationId: currentUser?.organizationId,
        currentOrgId: currentState.userOrganization?.id,
        hasUserOrg: !!currentState.userOrganization,
      })

      // If user's organizationId changed, refresh organization data
      if (currentUser?.organizationId !== currentState.userOrganization?.id) {
        console.log(
          '🔄 User organizationId changed, refreshing organization data...'
        )
        if (currentUser?.organizationId) {
          console.log(
            '📡 Fetching organization for ID:',
            currentUser.organizationId
          )
          get().fetchUserOrganization()
        } else {
          // User no longer has organization, clear it
          console.log('❌ User no longer has organization, clearing it')
          set({ userOrganization: null })
        }
      }
    })

    return unsubscribe
  },

  fetchUserOrganization: async () => {
    try {
      console.log('🚀 Starting fetchUserOrganization...')
      set({ isLoading: true, error: null, hasAttemptedFetch: true })

      const organization = await organizationService.getUserOrganization()
      console.log('📡 API response for getUserOrganization:', organization)

      if (organization) {
        console.log('✅ Organization found, updating state:', {
          id: organization.id,
          name: organization.name,
          playerCount: organization.players?.length || 0,
        })
        set({
          userOrganization: organization,
          isLoading: false,
          error: null,
          isInitialized: true,
          hasAttemptedFetch: true,
        })
      } else {
        console.log('❌ No organization found for user')
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
        console.log('🔍 Organization not found (404), handling gracefully')
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
      console.log(
        '🎯 Starting subscribeToTeam for organization:',
        organizationId
      )
      set({ isLoading: true, error: null })

      console.log('📡 Calling organizationService.subscribeToTeam...')
      await organizationService.subscribeToTeam(organizationId)
      console.log('✅ Successfully called organizationService.subscribeToTeam')

      console.log('🔄 Updating user organizationId in auth store...')
      // Update user's organizationId in auth store
      await useAuthStore.getState().updateUser({ organizationId })
      console.log('✅ Successfully updated user organizationId in auth store')

      // Verify that the organizationId was actually saved
      const updatedUser = useAuthStore.getState().user
      console.log('🔍 Verifying updated user:', {
        id: updatedUser?.id,
        name: updatedUser?.name,
        organizationId: updatedUser?.organizationId,
      })

      if (updatedUser?.organizationId !== organizationId) {
        console.error('❌ CRITICAL: organizationId was not saved correctly!')
        throw new Error('Failed to save organizationId to user')
      }

      console.log('🧹 Force complete state refresh after subscription...')
      // Force complete state refresh after subscription
      await get().forceRefreshAfterSubscription(organizationId)

      console.log('🔄 Force update all screens...')
      // Force update all screens
      get().forceUpdateAllScreens()

      set({
        isLoading: false,
        error: null,
      })

      console.log('🎉 Successfully subscribed to team and updated state')
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
      console.log(
        'Force refreshing state after subscription to:',
        organizationId
      )

      // Clear available organizations and reset loading states
      set({
        allOrganizations: [],
        isLoading: false,
        isLoadingOrganizations: false,
        error: null,
      })

      // Fetch the new user organization
      await get().fetchUserOrganization()

      console.log('State refreshed after subscription')
    } catch (error) {
      console.error('Error refreshing state after subscription:', error)
    }
  },

  // Force update all screens
  forceUpdateAllScreens: () => {
    console.log('Forcing update of all screens')
    // This will trigger re-renders in all components using this store
    set((state) => ({ ...state }))
  },

  // Force sync with auth store
  forceSyncWithAuthStore: async () => {
    try {
      console.log('🔄 Force syncing with auth store...')

      const authState = useAuthStore.getState()
      const currentUser = authState.user

      console.log('🔍 Current auth store state:', {
        userId: currentUser?.id,
        userOrganizationId: currentUser?.organizationId,
        currentOrgId: get().userOrganization?.id,
      })

      // If user has organizationId but we don't have userOrganization, fetch it
      if (currentUser?.organizationId && !get().userOrganization) {
        console.log(
          '🔄 User has organizationId but no userOrganization, fetching...'
        )
        await get().fetchUserOrganization()
      }

      // If user doesn't have organizationId but we have userOrganization, clear it
      if (!currentUser?.organizationId && get().userOrganization) {
        console.log(
          '🔄 User has no organizationId but we have userOrganization, clearing...'
        )
        set({ userOrganization: null })
      }

      console.log('✅ Force sync completed')
    } catch (error) {
      console.error('💥 Error in force sync:', error)
    }
  },

  handleOrganizationNotFound: async () => {
    console.log('Handling organization not found, clearing user organizationId')

    try {
      // Clear the invalid organizationId from the user
      await useAuthStore.getState().updateUser({ organizationId: undefined })
      console.log('Successfully cleared invalid organizationId from user')

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
