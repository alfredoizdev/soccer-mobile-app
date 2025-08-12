import { apiService } from './api-service'
import { API_CONFIG } from './config'

// Match interface based on API documentation for /api/matches/{id}
export interface Match {
  id: string
  date: string         // Fecha y hora del partido
  team1Id: string
  team2Id: string
  team1Goals: number
  team2Goals: number
  duration: number     // Duración en segundos
  status: 'active' | 'inactive'
  location: string     // Ubicación donde se juega
  notes: string        // Notas adicionales
  team1: {
    id: string
    name: string
    avatar?: string
  }
  team2: {
    id: string
    name: string
    avatar?: string
  }
  liveScore?: {
    team1Goals: number
    team2Goals: number
    isLive: boolean
  }
}

// Event interface for consistency (alias for Match)
export interface Event extends Match {}

export interface EventsResponse {
  events: Event[]
  success: boolean
}

// Events Service Class (using matches API)
class EventsService {
  private readonly API_BASE_URL = API_CONFIG.BASE_URL

  /**
   * Get match/event by ID
   */
  async getEventById(organizationId: string, eventId: string): Promise<Event> {
    try {
      const response = await apiService.get(`/matches/${eventId}`)
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch match')
      }

      return response.match as Event
    } catch (error) {
      console.error('Error fetching match by ID:', error)
      throw error
    }
  }

  /**
   * Get all events for an organization
   */
  async getEvents(organizationId: string): Promise<Event[]> {
    try {
      const response = await apiService.get(`/organizations/${organizationId}/events`)
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch events')
      }

      return (response.events || []) as Event[]
    } catch (error) {
      console.error('Error fetching events:', error)
      throw error
    }
  }

  /**
   * Get upcoming events for an organization
   */
  async getUpcomingEvents(organizationId: string): Promise<Event[]> {
    try {
      const response = await apiService.get(`/organizations/${organizationId}/events/upcoming`)
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch upcoming events')
      }

      return (response.events || []) as Event[]
    } catch (error) {
      console.error('Error fetching upcoming events:', error)
      throw error
    }
  }

  /**
   * Create a new event
   */
  async createEvent(organizationId: string, eventData: Partial<Event>): Promise<Event> {
    try {
      const response = await apiService.post(`/organizations/${organizationId}/events`, eventData)
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to create event')
      }

      return response.event as Event
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  }

  /**
   * Update an event
   */
  async updateEvent(organizationId: string, eventId: string, eventData: Partial<Event>): Promise<Event> {
    try {
      const response = await apiService.put(`/organizations/${organizationId}/events/${eventId}`, eventData)
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to update event')
      }

      return response.event as Event
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  }

  /**
   * Delete an event
   */
  async deleteEvent(organizationId: string, eventId: string): Promise<boolean> {
    try {
      const response = await apiService.delete(`/organizations/${organizationId}/events/${eventId}`)
      
      return response.success || false
    } catch (error) {
      console.error('Error deleting event:', error)
      throw error
    }
  }
}

export const eventsService = new EventsService()