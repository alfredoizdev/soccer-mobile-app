import { Ionicons } from '@expo/vector-icons'
import { Text, View } from 'react-native'

interface EventMetricsProps {
  event: any
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function EventMetrics({ event }: EventMetricsProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
      }}
    >
      <View style={{ alignItems: 'center' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4,
          }}
        >
          <Ionicons name='time' size={16} color='#6B7280' />
          <Text style={{ fontSize: 12, color: '#6B7280', marginLeft: 4 }}>
            TIME
          </Text>
        </View>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937' }}>
          {(event as any)?.date
            ? formatTime((event as any).date)
            : (event as any)?.startDate
              ? formatTime((event as any).startDate)
              : '--:--'}
        </Text>
      </View>

      <View style={{ alignItems: 'center' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4,
          }}
        >
          <Ionicons name='calendar' size={16} color='#6B7280' />
          <Text style={{ fontSize: 12, color: '#6B7280', marginLeft: 4 }}>
            DATE
          </Text>
        </View>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937' }}>
          {(event as any)?.date
            ? formatDate((event as any).date)
            : (event as any)?.startDate
              ? formatDate((event as any).startDate)
              : 'TBD'}
        </Text>
      </View>

      <View style={{ alignItems: 'center' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4,
          }}
        >
          <Ionicons name='football' size={16} color='#6B7280' />
          <Text style={{ fontSize: 12, color: '#6B7280', marginLeft: 4 }}>
            STATUS
          </Text>
        </View>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937' }}>
          {event?.status === 'active'
            ? 'LIVE'
            : event?.status === 'inactive'
              ? 'FINISHED'
              : 'UPCOMING'}
        </Text>
      </View>
    </View>
  )
}
