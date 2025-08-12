import { Ionicons } from '@expo/vector-icons'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface EventHeaderProps {
  location: string
  onBackPress: () => void
}

export function EventHeader({ location, onBackPress }: EventHeaderProps) {
  return (
    <SafeAreaView
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingTop: 10,
        }}
      >
        <TouchableOpacity
          onPress={onBackPress}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#EF4444',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name='chevron-back' size={24} color='white' />
        </TouchableOpacity>

        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>
            📍 Event Location
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
            {location || 'Match Location'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}
