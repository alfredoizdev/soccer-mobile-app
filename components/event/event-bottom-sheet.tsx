import { Ionicons } from '@expo/vector-icons'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { EventMetrics } from './event-metrics'
import { EventScore } from './event-score'
import { EventTeamsInfo } from './event-teams-info'

interface EventBottomSheetProps {
  event: any
  onNavigateToLocation: () => void
}

export function EventBottomSheet({
  event,
  onNavigateToLocation,
}: EventBottomSheetProps) {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      {/* Handle Bar */}
      <View
        style={{
          width: 40,
          height: 4,
          backgroundColor: '#E5E7EB',
          borderRadius: 2,
          alignSelf: 'center',
          marginBottom: 16,
        }}
      />

      {/* Match Info */}
      <View style={{ paddingHorizontal: 20 }}>
        {/* Team Names with Avatars */}
        <EventTeamsInfo event={event} />

        {/* Location */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          <Ionicons name='location' size={16} color='#EF4444' />
          <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 6 }}>
            {event?.location || 'Match Location'}
          </Text>
        </View>

        {/* Metrics Row */}
        <EventMetrics event={event} />

        {/* Event Notes */}
        {event?.notes && (
          <View
            style={{
              backgroundColor: '#F9FAFB',
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
              borderLeftWidth: 4,
              borderLeftColor: '#EF4444',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Ionicons name='document-text' size={20} color='#6B7280' />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#1F2937',
                  marginLeft: 8,
                }}
              >
                Match Notes
              </Text>
            </View>
            <Text style={{ fontSize: 14, color: '#4B5563', lineHeight: 20 }}>
              {event.notes}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: '#F3F4F6',
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#6B7280' }}>
              Share
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onNavigateToLocation}
            style={{
              flex: 2,
              backgroundColor: '#EF4444',
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: 'center',
              shadowColor: '#EF4444',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>
              Start Navigate
            </Text>
          </TouchableOpacity>
        </View>

        {/* Teams Score (if completed) */}
        <EventScore event={event} />
      </View>

      <SafeAreaView edges={['bottom']} />
    </View>
  )
}
