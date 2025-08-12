import { router, useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'
import { EventBottomSheet } from '../../components/event/event-bottom-sheet'
import { EventHeader } from '../../components/event/event-header'
import { EventMap } from '../../components/event/event-map'
import { EventStates } from '../../components/event/event-states'
import { useEvent } from '../../hooks/use-event'
import { useNavigation } from '../../hooks/use-navigation'

function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { event, isLoading, error, refetch } = useEvent(id)
  const { handleNavigateToLocation } = useNavigation()

  const handleBackPress = () => {
    router.back()
  }

  const handleNavigate = () => {
    if (event?.location) {
      handleNavigateToLocation(event.location)
    }
  }

  // Show loading, error, or no event states
  const stateComponent = EventStates({
    isLoading,
    error,
    onRetry: refetch,
    onBack: handleBackPress,
  })

  if (stateComponent) {
    return stateComponent
  }

  if (!event) {
    return null
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Full Screen Google Maps */}
      <EventMap location={event.location} />

      {/* Header Overlay */}
      <EventHeader location={event.location} onBackPress={handleBackPress} />

      {/* Bottom Sheet */}
      <EventBottomSheet event={event} onNavigateToLocation={handleNavigate} />
    </View>
  )
}

export default EventDetailScreen
