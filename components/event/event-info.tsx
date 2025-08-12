import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Text, TouchableOpacity, View } from 'react-native'
import { Game as Event } from '../../services/organization-service'

interface EventInfoProps {
  event: Event
  onNavigate: () => void
}

export function EventInfo({ event, onNavigate }: EventInfoProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const getEventTypeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return ['#EF4444', '#DC2626'] // Red gradient for active/live matches
      case 'inactive':
        return ['#10B981', '#059669'] // Green gradient for completed
      case 'scheduled':
        return ['#3B82F6', '#2563EB'] // Blue gradient for upcoming
      default:
        return ['#6B7280', '#4B5563'] // Gray gradient
    }
  }

  return (
    <View className='px-4 pb-8'>
      {/* Main Event Card */}
      <View className='bg-white rounded-2xl shadow-lg overflow-hidden mb-6'>
        {/* Event Type Header */}
        <LinearGradient
          colors={getEventTypeColor(event.status)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ paddingVertical: 16, paddingHorizontal: 20 }}
        >
          <Text className='text-white text-lg font-bold text-center uppercase tracking-wider'>
            {event.status === 'active' ? 'LIVE MATCH' : event.status === 'inactive' ? 'COMPLETED' : 'UPCOMING'}
          </Text>
        </LinearGradient>

        <View className='p-6'>
          {/* Teams vs Format */}
          <View className='mb-6'>
            <View className='flex-row items-center justify-between'>
              {/* Home Team */}
              <View className='flex-1 items-center'>
                <View className='w-16 h-16 bg-red-500 rounded-full items-center justify-center mb-3'>
                  <Text className='text-white text-xl font-bold'>
                    {event.homeTeam?.name?.charAt(0)?.toUpperCase() || 'H'}
                  </Text>
                </View>
                <Text className='text-gray-800 font-bold text-center text-sm'>
                  {event.homeTeam?.name || 'Home Team'}
                </Text>
                {event.status === 'inactive' && (
                  <Text className='text-gray-600 text-2xl font-bold mt-2'>
                    {event.team1Goals || 0}
                  </Text>
                )}
              </View>

              {/* VS or Score */}
              <View className='mx-4'>
                {event.status === 'inactive' ? (
                  <Text className='text-gray-600 font-bold text-2xl'>
                    {event.team1Goals || 0} - {event.team2Goals || 0}
                  </Text>
                ) : (
                  <Text className='text-gray-600 font-bold text-lg'>VS</Text>
                )}
              </View>

              {/* Away Team */}
              <View className='flex-1 items-center'>
                <View className='w-16 h-16 bg-blue-500 rounded-full items-center justify-center mb-3'>
                  <Text className='text-white text-xl font-bold'>
                    {event.awayTeam?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </Text>
                </View>
                <Text className='text-gray-800 font-bold text-center text-sm'>
                  {event.awayTeam?.name || 'Away Team'}
                </Text>
                {event.status === 'inactive' && (
                  <Text className='text-gray-600 text-2xl font-bold mt-2'>
                    {event.team2Goals || 0}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Date and Time */}
          <View className='mb-6'>
            <View className='flex-row items-center mb-3'>
              <View className='w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4'>
                <Ionicons name='calendar' size={20} color='#3B82F6' />
              </View>
              <View className='flex-1'>
                <Text className='text-gray-600 text-xs uppercase tracking-wider'>
                  Date
                </Text>
                <Text className='text-gray-800 text-lg font-semibold'>
                  {formatDate(event.startDate)}
                </Text>
              </View>
            </View>

            <View className='flex-row items-center'>
              <View className='w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-4'>
                <Ionicons name='time' size={20} color='#10B981' />
              </View>
              <View className='flex-1'>
                <Text className='text-gray-600 text-xs uppercase tracking-wider'>
                  Time
                </Text>
                <Text className='text-gray-800 text-lg font-semibold'>
                  {formatTime(event.startDate)}
                </Text>
              </View>
            </View>
          </View>

          {/* Location */}
          {event.location && (
            <View className='mb-6'>
              <View className='flex-row items-center'>
                <View className='w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-4'>
                  <Ionicons name='location' size={20} color='#EF4444' />
                </View>
                <View className='flex-1'>
                  <Text className='text-gray-600 text-xs uppercase tracking-wider'>
                    Location
                  </Text>
                  <Text className='text-gray-800 text-lg font-semibold'>
                    {event.location}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Navigate Button */}
          <TouchableOpacity
            onPress={onNavigate}
            activeOpacity={0.8}
            className='mb-4'
          >
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name='navigate' size={20} color='white' style={{ marginRight: 8 }} />
              <Text className='text-white font-bold text-lg'>
                Navigate to Location
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Description */}
          {event.description && (
            <View className='bg-gray-50 rounded-xl p-4'>
              <View className='flex-row items-start mb-2'>
                <Ionicons name='document-text' size={20} color='#6B7280' style={{ marginRight: 8, marginTop: 2 }} />
                <Text className='text-gray-600 text-xs uppercase tracking-wider font-semibold'>
                  Match Details
                </Text>
              </View>
              <Text className='text-gray-800 text-base leading-6'>
                {event.description}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}