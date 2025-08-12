import { useEffect, useState } from 'react'
import { eventsService } from '../services/events-service'
import { useAuthStore } from '../stores/auth-store'

export function useEvent(id: string | undefined) {
  const { user, isAuthenticated } = useAuthStore()
  const [event, setEvent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEventData = async () => {
    if (!id || !isAuthenticated || !user?.organizationId) return

    try {
      setError(null)
      setIsLoading(true)

      const eventData = await eventsService.getEventById(
        user.organizationId,
        id
      )
      console.log('🏈 Event data received:', JSON.stringify(eventData, null, 2))
      setEvent(eventData)
    } catch (err) {
      console.error('Error fetching event:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to load event. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEventData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated, user])

  return {
    event,
    isLoading,
    error,
    refetch: fetchEventData,
  }
}
