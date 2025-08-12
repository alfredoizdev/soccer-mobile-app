import { LinearGradient } from 'expo-linear-gradient'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PlayerContact } from '../../components/player/player-contact'
import { PlayerHeader } from '../../components/player/player-header'
import { PlayerInfo } from '../../components/player/player-info'
import { PlayerPerformance } from '../../components/player/player-performance'
import { TeamMembers } from '../../components/player/team-members'
import {
  Organization,
  organizationService,
  Player,
} from '../../services/organization-service'
import { useAuthStore } from '../../stores/auth-store'

export default function PlayerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { user, isAuthenticated } = useAuthStore()
  const [player, setPlayer] = useState<Player | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchPlayerData = async () => {
    if (!id || !isAuthenticated || !user?.organizationId) return

    try {
      setError(null)
      setIsLoading(true)

      // Fetch both player and organization data
      const [playerData, orgData] = await Promise.all([
        organizationService.getPlayerById(user.organizationId, id),
        organizationService.getUserOrganization(),
      ])

      setPlayer(playerData)
      setOrganization(orgData)
    } catch (err) {
      console.error('Error fetching data:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to load data. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPlayerData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated, user])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchPlayerData()
    setRefreshing(false)
  }

  const handleBackPress = () => {
    router.push('/(tabs)')
  }

  const handleMenuPress = () => {
    // TODO: Implement menu functionality
  }

  const handlePlayerPress = (playerId: string) => {
    router.push(`/player/${playerId}`)
  }

  // Show loading state
  if (isLoading) {
    return (
      <LinearGradient colors={['#EF4444', '#8B5CF6']} style={{ flex: 1 }}>
        <View className='flex-1 items-center justify-center'>
          <Text className='text-white text-lg'>Loading player...</Text>
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
            Error loading player
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

  // Show no player state
  if (!player) {
    return (
      <LinearGradient colors={['#EF4444', '#8B5CF6']} style={{ flex: 1 }}>
        <View className='flex-1 items-center justify-center px-4'>
          <Text className='text-white text-lg text-center mb-4'>
            Player not found
          </Text>
          <TouchableOpacity
            onPress={handleBackPress}
            className='bg-white/20 px-6 py-3 rounded-lg'
          >
            <Text className='text-white font-semibold'>Go Back</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    )
  }

  // Calculate average rating (balanced calculation)
  const calculateAverageRating = () => {
    const goals = player.totalGoals || 0
    const assists = player.totalAssists || 0
    const passes = player.totalPassesCompleted || 0

    // Base rating starts low
    let rating = 1.5

    // Goals: 0.1 per goal (need 10 goals for +1.0)
    rating += goals * 0.1

    // Assists: 0.15 per assist (need 7 assists for +1.0)
    rating += assists * 0.15

    // Passes: very small impact (need 100 passes for +0.5)
    rating += (passes / 200) * 0.5

    return Math.min(5.0, Math.max(1.0, rating)).toFixed(1)
  }

  // Calculate goal conversion rate (goals per 90 minutes)
  const calculateConversionRate = () => {
    const goals = player.totalGoals || 0
    // Estimate minutes played (we can use a mock value or get from stats)
    const minutesPlayed = (player as any).minutesPlayed || 900 // Use player data or fallback

    if (minutesPlayed === 0) return 0

    // Calculate goals per 90 minutes
    const goalsPerMatch = (goals / minutesPlayed) * 90

    // Convert to percentage (max realistic is around 2 goals per match = 100%)
    const percentage = Math.min(100, (goalsPerMatch / 2) * 100)

    return Math.max(0, percentage)
  }

  const averageRating = calculateAverageRating()
  const conversionRate = calculateConversionRate()

  return (
    <LinearGradient colors={['#EF4444', '#8B5CF6']} style={{ flex: 1 }}>
      <SafeAreaView className='flex-1' edges={['left', 'right', 'bottom']}>
        <ScrollView
          className='flex-1'
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor='#ffffff'
              colors={['#ffffff']}
            />
          }
        >
          <PlayerHeader 
            onBackPress={handleBackPress} 
            onMenuPress={handleMenuPress} 
          />
          
          <PlayerInfo 
            player={player} 
            averageRating={averageRating} 
          />
          
          <PlayerPerformance 
            player={player} 
            averageRating={averageRating} 
            conversionRate={conversionRate} 
          />
          
          <PlayerContact player={player} />
          
          {organization && (
            <TeamMembers 
              organization={organization} 
              currentPlayer={player} 
              onPlayerPress={handlePlayerPress} 
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  )
}
