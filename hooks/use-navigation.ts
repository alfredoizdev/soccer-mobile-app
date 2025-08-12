import { Linking, Platform } from 'react-native'
import { ToastService } from '../services/toast-service'

export function useNavigation() {
  const handleNavigateToLocation = async (location: string) => {
    if (!location) {
      ToastService.error('Location not available')
      return
    }

    try {
      if (Platform.OS === 'ios') {
        const url = `maps://app?daddr=${location}&dirflg=d`
        const supported = await Linking.canOpenURL(url)

        if (supported) {
          await Linking.openURL(url)
        } else {
          // Fallback to Apple Maps web
          await Linking.openURL(
            `http://maps.apple.com/?daddr=${location}&dirflg=d`
          )
        }
      } else {
        // Android - Google Maps
        const url = `google.navigation:q=${location}&mode=d`
        const supported = await Linking.canOpenURL(url)

        if (supported) {
          await Linking.openURL(url)
        } else {
          // Fallback to Google Maps web
          await Linking.openURL(
            `https://www.google.com/maps/dir/?api=1&destination=${location}&travelmode=driving`
          )
        }
      }
    } catch (error) {
      console.error('Error opening maps:', error)
      ToastService.error('Could not open navigation app')
    }
  }

  return {
    handleNavigateToLocation,
  }
}
