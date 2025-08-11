import { create } from 'zustand'
import {
  Game,
  organizationService,
} from '../services/organization-service'

interface EventsState {
  upcomingGames: Game[]
  pastGames: Game[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchUpcomingGames: (organizationId: string) => Promise<void>
  fetchPastGames: (organizationId: string) => Promise<void>
  clearError: () => void
}

export const useEventsStore = create<EventsState>((set, get) => ({
  upcomingGames: [],
  pastGames: [],
  isLoading: false,
  error: null,

  fetchUpcomingGames: async (organizationId: string) => {
    try {
      set({ isLoading: true, error: null })

      const games = await organizationService.getUpcomingGames(organizationId)

      set({
        upcomingGames: games,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      console.error('Error fetching upcoming games:', error)
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch upcoming games',
      })
    }
  },

  fetchPastGames: async (organizationId: string) => {
    try {
      set({ isLoading: true, error: null })

      const games = await organizationService.getPastGames(organizationId)

      set({
        pastGames: games,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      console.error('Error fetching past games:', error)
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch past games',
      })
    }
  },

  clearError: () => {
    set({ error: null })
  },
}))
