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
  location?: string
  type: 'game' | 'practice' | 'meeting' | 'tournament'
  status: 'scheduled' | 'active' | 'completed' | 'cancelled'
  organizationId: string
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

      if (!user || !user.organizationId) {
        return null
      }

      return await this.getOrganizationById(user.organizationId)
    } catch (error) {
      console.error('Error fetching user organization:', error)
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

      const response = await fetch(
        `${this.API_BASE_URL}/organizations?${params.toString()}`,
        {
          method: 'GET',
          headers,
        }
      )

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      return {
        organizations: data.organizations,
        pagination: data.pagination,
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
}

// Export singleton instance
export const organizationService = new OrganizationService()
