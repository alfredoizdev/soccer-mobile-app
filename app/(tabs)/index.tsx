import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { useEffect } from 'react'
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { PlayersSection } from '../../components/players-section'
import { TeamHeader } from '../../components/team-header'
import { useAuthStore } from '../../stores/auth-store'
import { useOrganizationStore } from '../../stores/organization-store'

// Mock stats for demonstration (in real app, this would come from API)
const getTeamStats = () => ({
  wins: 15,
  draws: 3,
  losses: 2,
})

export default function Index() {
  const { user, isAuthenticated } = useAuthStore()
  const { userOrganization, isLoading, error, fetchUserOrganization } =
    useOrganizationStore()

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserOrganization()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user])

  const handleRefresh = () => {
    if (isAuthenticated && user) {
      fetchUserOrganization()
    }
  }

  const handleMenuPress = () => {
    // TODO: Open menu
  }

  const handlePlayerPress = (playerId: string) => {
    router.push(`/player/${playerId}`)
  }

  const handleGamePress = (game: any) => {
    // TODO: Navigate to game details
    console.log('Game pressed:', game)
  }

  const teamStats = getTeamStats()

  // Show loading state
  if (isLoading) {
    return (
      <LinearGradient colors={['#EF4444', '#8B5CF6']} style={{ flex: 1 }}>
        <View className='flex-1'>
          <View className='flex-1 items-center justify-center'>
            <Text className='text-white text-lg'>
              Loading team information...
            </Text>
          </View>
        </View>
      </LinearGradient>
    )
  }

  // Show error state
  if (error) {
    return (
      <LinearGradient colors={['#EF4444', '#8B5CF6']} style={{ flex: 1 }}>
        <View className='flex-1'>
          <View className='flex-1 items-center justify-center px-4'>
            <Text className='text-white text-lg text-center mb-4'>
              Error loading team information
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
        </View>
      </LinearGradient>
    )
  }

  // Show no team state
  if (!userOrganization) {
    return (
      <LinearGradient colors={['#EF4444', '#8B5CF6']} style={{ flex: 1 }}>
        <View className='flex-1'>
          <View className='flex-1 items-center justify-center px-4'>
            <Text className='text-white text-lg text-center mb-4'>
              No team assigned
            </Text>
            <Text className='text-white/80 text-sm text-center'>
              Contact your administrator to join a team.
            </Text>
          </View>
        </View>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={['#EF4444', '#8B5CF6']} style={{ flex: 1 }}>
      <View className='flex-1'>
        <TeamHeader
          organization={userOrganization}
          stats={teamStats}
          onMenuPress={handleMenuPress}
        />

        <View className='flex-1'>
          <ScrollView
            className='flex-1 bg-white rounded-t-3xl px-4 pt-6 pb-8'
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={handleRefresh}
                tintColor='#ffffff'
                colors={['#ffffff']}
              />
            }
          >
            <PlayersSection
              players={userOrganization.players}
              isLoading={isLoading}
              onPlayerPress={handlePlayerPress}
              organizationId={userOrganization.id}
              onGamePress={handleGamePress}
            />
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  )
}
