import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Text, View } from 'react-native'
import { WebView } from 'react-native-webview'

interface EventMapProps {
  location: string
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyDEGZqvZ5WwSfLI32EB2fWQBTkJraqj0kA'

const createGoogleMapsHtml = (location: string) => {
  // Clean and transform the location for Google Maps
  const cleanLocation = location
    .replace(/,\s*EE\.\s*UU\.?/i, ', USA') // Replace "EE. UU." with "USA"
    .replace(/,\s*Estados Unidos/i, ', USA') // Replace "Estados Unidos" with "USA"
    .trim()

  const encodedLocation = encodeURIComponent(cleanLocation)

  console.log('🗺️ Original location:', location)
  console.log('🧹 Cleaned location:', cleanLocation)

  // Create HTML with iframe for Google Maps
  return `
		<!DOCTYPE html>
		<html>
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<style>
					body, html { margin: 0; padding: 0; height: 100%; }
					iframe { 
						width: 100%; 
						height: 100vh; 
						border: 0; 
						margin-top: -150px;
						padding-top: 15px;
					}
				</style>
			</head>
			<body>
				<iframe
					src="https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodedLocation}&zoom=15"
					allowfullscreen>
				</iframe>
			</body>
		</html>
	`
}

export function EventMap({ location }: EventMapProps) {
  if (!location) {
    return (
      <LinearGradient
        colors={['#3B82F6', '#8B5CF6']}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <View style={{ alignItems: 'center' }}>
          <Ionicons name='location' size={60} color='white' />
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontWeight: '600',
              marginTop: 12,
            }}
          >
            No location available
          </Text>
        </View>
      </LinearGradient>
    )
  }

  return (
    <WebView
      style={{ flex: 1 }}
      source={{ html: createGoogleMapsHtml(location) }}
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      startInLoadingState={true}
      onLoad={() => console.log('✅ WebView loaded successfully')}
      onError={(error) => console.error('❌ WebView error:', error.nativeEvent)}
      onHttpError={(error) =>
        console.error('🌐 HTTP error:', error.nativeEvent)
      }
      renderLoading={() => (
        <LinearGradient
          colors={['#3B82F6', '#8B5CF6']}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Ionicons name='location' size={60} color='white' />
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontWeight: '600',
                marginTop: 12,
              }}
            >
              Loading map...
            </Text>
          </View>
        </LinearGradient>
      )}
      renderError={() => (
        <LinearGradient
          colors={['#EF4444', '#8B5CF6']}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Ionicons name='warning' size={60} color='white' />
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontWeight: '600',
                marginTop: 12,
              }}
            >
              Error loading map
            </Text>
          </View>
        </LinearGradient>
      )}
    />
  )
}
