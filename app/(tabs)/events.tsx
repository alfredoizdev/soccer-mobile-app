import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useState } from 'react'
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { UpcomingEvents } from '../../components/upcoming-events'
import { Game } from '../../services/organization-service'
import { useAuthStore } from '../../stores/auth-store'
import { useOrganizationStore } from '../../stores/organization-store'

export default function EventsScreen() {
  const { user, isAuthenticated } = useAuthStore()
  const { userOrganization, isLoading, error, fetchUserOrganization } =
    useOrganizationStore()
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserOrganization()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user])

  const handleRefresh = async () => {
    setRefreshing(true)
    if (isAuthenticated && user) {
      await fetchUserOrganization()
    }
    setRefreshing(false)
  }

  const handleGamePress = (game: Game) => {
    // TODO: Navigate to game details
    console.log('Game pressed:', game)
  }

  // Show loading state
  if (isLoading) {
    return (
      <LinearGradient colors={['#EF4444', '#8B5CF6']} style={{ flex: 1 }}>
        <View className='flex-1 items-center justify-center'>
          <Text className='text-white text-lg'>Loading games...</Text>
        </View>
      </LinearGradient>
    )
  }

  // Show error state
  if (error) {
    return (
      <LinearGradient colors={['#EF4444', '#8B5CF6']} style={{ flex: 1 }}>
        <View className='flex-1 items-center justify-center px-4'>
          <Text className='text-white text-lg text-center mb-4'>
            Error loading games
          </Text>
          <Text className='text-white/80 text-sm text-center mb-6'>
            {error}
          </Text>
          <TouchableOpacity
            onPress={handleRefresh}
            className='bg-white/20 px-6 py-3 rounded-lg'
          >
            <Text className='text-white font-semibold'>Try Again</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    )
  }

  // Show no team state
  if (!userOrganization) {
    return (
      <LinearGradient colors={['#EF4444', '#8B5CF6']} style={{ flex: 1 }}>
        <View className='flex-1 items-center justify-center px-4'>
          <Text className='text-white text-lg text-center mb-4'>
            No team assigned
          </Text>
          <Text className='text-white/80 text-sm text-center'>
            Contact your administrator to join a team.
          </Text>
        </View>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={['#EF4444', '#8B5CF6']} style={{ flex: 1 }}>
      <View className='flex-1'>
        {/* Header */}
        <View className='px-4 py-9'>
          <Text className='text-white text-2xl font-bold mb-2'>
            <Ionicons name='football' size={24} color='white' /> Games
          </Text>
          <Text className='text-white/80 text-sm'>
            View your upcoming and past games
          </Text>
        </View>

        {/* Games Content */}
        <ScrollView
          className='flex-1 bg-white rounded-t-3xl px-4 pt-6 pb-8'
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor='#ffffff'
              colors={['#ffffff']}
            />
          }
        >
          <UpcomingEvents
            isInWhiteContainer={true}
            organizationId={userOrganization.id}
            onGamePress={handleGamePress}
          />
        </ScrollView>
      </View>
    </LinearGradient>
  )
}
