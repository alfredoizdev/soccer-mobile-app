import { authService } from './auth-service'
import { API_CONFIG } from './config'

// Types
export interface Organization {
  id: string
  name: string
  description: string
  avatar?: string
  playerCount?: number
  createdAt: string
  players?: Player[]
}

export interface Player {
  id: string
  name: string
  lastName: string
  age: number
  avatar?: string
  jerseyNumber: number
  position: string
  organizationId: string
  totalGoals: number
  totalAssists: number
  totalPassesCompleted: number
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    name: string
    lastName: string
    email: string
    avatar?: string
  }
}

export interface OrganizationResponse {
  organization: Organization
  success: boolean
}

export interface ApiError {
  error: string
  success: false
}

// Event and Game Types
export interface Game {
  id: string
  title: string
  description?: string
  startDate: string
  endDate?: string
  location?: string
  status: 'active' | 'inactive' | 'completed' | 'cancelled'
  homeTeam: {
    id: string
    name: string
    score?: number
  }
  awayTeam: {
    id: string
    name: string
    score?: number
  }
  organizationId: string
  createdAt: string
  updatedAt: string
}

export interface Event {
  id: string
  title: string
  description?: string
  startDate: string
  endDate?: string
  date: string // Main date field for display
  location?: string
  latitude?: number // For map coordinates
  longitude?: number // For map coordinates
  type: 'match' | 'practice' | 'meeting' | 'tournament'
  status: 'scheduled' | 'active' | 'completed' | 'cancelled'
  organizationId: string
  homeTeam?: string // For match format
  awayTeam?: string // For match format
  notes?: string // Additional notes
  createdAt: string
  updatedAt: string
}

export interface EventsResponse {
  events: Event[]
  success: boolean
}

export interface GamesResponse {
  games: Game[]
  success: boolean
}

// Organization Service Class
class OrganizationService {
  private readonly API_BASE_URL = API_CONFIG.BASE_URL

  /**
   * Get organization by ID
   */
  async getOrganizationById(id: string): Promise<Organization> {
    try {
      const headers = authService.getAuthHeaders()


      const response = await fetch(`${this.API_BASE_URL}/organizations/${id}`, {
        method: 'GET',
        headers,
      })


      if (!response.ok) {
        const errorText = await response.text()
        console.error(`HTTP error response: ${errorText}`)
        throw new Error(
          `HTTP error! status: ${response.status}, response: ${errorText}`
        )
      }

      const data: OrganizationResponse | ApiError = await response.json()

      if (!data.success) {
        throw new Error((data as ApiError).error)
      }

      return (data as OrganizationResponse).organization
    } catch (error) {
      console.error('Error fetching organization:', error)
      throw error
    }
  }

  /**
   * Get user's organization (if user has organizationId)
   */
  async getUserOrganization(): Promise<Organization | null> {
    try {
      const user = authService.getUser()

      if (!user) {
        return null
      }

      if (!user.organizationId) {
        return null
      }

      const organization = await this.getOrganizationById(user.organizationId)
      return organization
    } catch (error) {
      console.error(
        '💥 getUserOrganization - Error fetching user organization:',
        error
      )
      throw error
    }
  }

  /**
   * Get all organizations
   */
  async getOrganizations(
    page = 1,
    limit = 20,
    search?: string
  ): Promise<{
    organizations: Organization[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }> {
    try {
      const headers = authService.getAuthHeaders()

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })

      if (search) {
        params.append('search', search)
      }

      const url = `${this.API_BASE_URL}/organizations?${params.toString()}`

      const response = await fetch(url, {
        method: 'GET',
        headers,
      })


      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Organizations HTTP error response: ${errorText}`)
        throw new Error(
          `HTTP error! status: ${response.status}, response: ${errorText}`
        )
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }


      return {
        organizations: data.organizations || [],
        pagination: data.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
      throw error
    }
  }

  /**
   * Get upcoming events for an organization
   */
  async getUpcomingEvents(organizationId: string): Promise<Event[]> {
    try {
      const headers = authService.getAuthHeaders()

      const response = await fetch(
        `${this.API_BASE_URL}/organizations/${organizationId}/events?status=scheduled&status=active&limit=10`,
        {
          method: 'GET',
          headers,
        }
      )

      const data: EventsResponse | ApiError = await response.json()

      if (!data.success) {
        throw new Error((data as ApiError).error)
      }

      return (data as EventsResponse).events
    } catch (error) {
      console.error('Error fetching upcoming events:', error)
      throw error
    }
  }

  /**
   * Get upcoming games for an organization (active status)
   */
  async getUpcomingGames(organizationId: string): Promise<Game[]> {
    try {
      const headers = authService.getAuthHeaders()

      const response = await fetch(
        `${this.API_BASE_URL}/matches?status=active&limit=10`,
        {
          method: 'GET',
          headers,
        }
      )

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      // Transform matches to Game format
      return data.matches.map((match: any) => ({
        id: match.id,
        title: `${match.team1?.name || 'Team 1'} vs ${match.team2?.name || 'Team 2'}`,
        description: match.notes,
        startDate: match.date,
        endDate: match.date,
        location: match.location,
        status: match.status,
        homeTeam: {
          id: match.team1Id,
          name: match.team1?.name || 'Team 1',
          score: match.team1Goals,
        },
        awayTeam: {
          id: match.team2Id,
          name: match.team2?.name || 'Team 2',
          score: match.team2Goals,
        },
        organizationId,
        createdAt: match.date,
        updatedAt: match.date,
      }))
    } catch (error) {
      console.error('Error fetching upcoming games:', error)
      throw error
    }
  }

  /**
   * Get past games for an organization (inactive status)
   */
  async getPastGames(organizationId: string): Promise<Game[]> {
    try {
      const headers = authService.getAuthHeaders()

      const response = await fetch(
        `${this.API_BASE_URL}/matches?status=inactive&limit=10`,
        {
          method: 'GET',
          headers,
        }
      )

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      // Transform matches to Game format
      return data.matches.map((match: any) => ({
        id: match.id,
        title: `${match.team1?.name || 'Team 1'} vs ${match.team2?.name || 'Team 2'}`,
        description: match.notes,
        startDate: match.date,
        endDate: match.date,
        location: match.location,
        status: match.status,
        homeTeam: {
          id: match.team1Id,
          name: match.team1?.name || 'Team 1',
          score: match.team1Goals,
        },
        awayTeam: {
          id: match.team2Id,
          name: match.team2?.name || 'Team 2',
          score: match.team2Goals,
        },
        organizationId,
        createdAt: match.date,
        updatedAt: match.date,
      }))
    } catch (error) {
      console.error('Error fetching past games:', error)
      throw error
    }
  }

  /**
   * Get player by ID
   */
  async getPlayerById(
    organizationId: string,
    playerId: string
  ): Promise<Player> {
    try {
      const headers = authService.getAuthHeaders()

      const response = await fetch(`${this.API_BASE_URL}/players/${playerId}`, {
        method: 'GET',
        headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response')
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch player')
      }

      return data.player
    } catch (error) {
      console.error('Error fetching player:', error)
      if (error instanceof Error) {
        throw error
      } else {
        throw new Error(
          'An unexpected error occurred while fetching player data'
        )
      }
    }
  }

  /**
   * Subscribe to a team
   */
  async subscribeToTeam(organizationId: string): Promise<void> {
    try {

      const headers = authService.getAuthHeaders()
      const user = authService.getUser()

      if (!user) {
        throw new Error('User not authenticated')
      }


      // Use the correct subscribe endpoint from the API documentation
      const response = await fetch(`${this.API_BASE_URL}/users/subscribe`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          userId: user.id,
          organizationId,
        }),
      })


      if (!response.ok) {
        const errorText = await response.text()
        console.error(
          `💥 OrganizationService.subscribeToTeam - HTTP error response: ${errorText}`
        )
        throw new Error(
          `HTTP error! status: ${response.status}, response: ${errorText}`
        )
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to subscribe to team')
      }

    } catch (error) {
      console.error(
        '💥 OrganizationService.subscribeToTeam - Error subscribing to team:',
        error
      )
      throw error
    }
  }

  /**
   * Check current subscription status
   */
  async checkSubscriptionStatus(): Promise<{
    isSubscribed: boolean
    organizationId: string | null
  }> {
    try {
      const headers = authService.getAuthHeaders()
      const user = authService.getUser()

      if (!user) {
        throw new Error('User not authenticated')
      }

      const response = await fetch(
        `${this.API_BASE_URL}/users/unsubscribe?userId=${user.id}`,
        {
          method: 'GET',
          headers,
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to check subscription status')
      }

      return {
        isSubscribed: data.isSubscribed,
        organizationId: data.organizationId,
      }
    } catch (error) {
      console.error('Error checking subscription status:', error)
      throw error
    }
  }

  /**
   * Check if user can join a team
   */
  async checkTeamJoinEligibility(organizationId: string): Promise<boolean> {
    try {
      const headers = authService.getAuthHeaders()
      const user = authService.getUser()

      if (!user) {
        throw new Error('User not authenticated')
      }

      const response = await fetch(
        `${this.API_BASE_URL}/users/subscribe?userId=${user.id}&organizationId=${organizationId}`,
        {
          method: 'GET',
          headers,
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to check eligibility')
      }

      return data.canJoin
    } catch (error) {
      console.error('Error checking team join eligibility:', error)
      throw error
    }
  }

  /**
   * Unsubscribe from current team
   */
  async unsubscribeFromTeam(): Promise<void> {
    try {
      const headers = authService.getAuthHeaders()
      const user = authService.getUser()

      if (!user) {
        throw new Error('User not authenticated')
      }

      // Use the correct unsubscribe endpoint from the API documentation
      const response = await fetch(`${this.API_BASE_URL}/users/unsubscribe`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ userId: user.id }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to unsubscribe from team')
      }
    } catch (error) {
      console.error('Error unsubscribing from team:', error)
      throw error
    }
  }
}

// Export singleton instance
export const organizationService = new OrganizationService()
