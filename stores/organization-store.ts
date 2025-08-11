import { create } from 'zustand'
import {
  Organization,
  organizationService,
} from '../services/organization-service'

interface OrganizationState {
  userOrganization: Organization | null
  isLoading: boolean
  error: string | null

  // Actions
  fetchUserOrganization: () => Promise<void>
  clearError: () => void
}

export const useOrganizationStore = create<OrganizationState>((set, get) => ({
  userOrganization: null,
  isLoading: false,
  error: null,

  fetchUserOrganization: async () => {
    try {
      set({ isLoading: true, error: null })

      const organization = await organizationService.getUserOrganization()

      set({
        userOrganization: organization,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      console.error('Error fetching user organization:', error)
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch organization',
      })
    }
  },

  clearError: () => {
    set({ error: null })
  },
}))
