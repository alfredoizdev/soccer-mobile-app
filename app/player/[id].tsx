import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
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
          {/* Header */}
          <View className='flex-row items-center justify-between px-6 pt-14 pb-6'>
            <TouchableOpacity
              onPress={handleBackPress}
              className='w-10 h-10 items-center justify-center'
            >
              <Ionicons name='chevron-back' size={24} color='white' />
            </TouchableOpacity>
            <Text className='text-white text-sm font-medium tracking-wider uppercase'>
              DETAILED VIEW
            </Text>
            <TouchableOpacity className='w-10 h-10 items-center justify-center'>
              <Ionicons name='menu' size={24} color='white' />
            </TouchableOpacity>
          </View>

          {/* Player Info Section */}
          <View className='px-6 mb-8'>
            <View className='flex-row items-start'>
              {/* Player Photo */}
              <View className='mr-6'>
                {player.avatar ? (
                  <Image
                    source={{ uri: player.avatar }}
                    className='w-32 h-40 rounded-2xl'
                    resizeMode='cover'
                  />
                ) : (
                  <View className='w-32 h-40 rounded-2xl bg-gray-600 items-center justify-center'>
                    <Ionicons name='person' size={48} color='#9CA3AF' />
                  </View>
                )}
              </View>

              {/* Player Details */}
              <View className='flex-1'>
                <Text className='text-white text-3xl font-bold mb-1'>
                  {player.name}
                </Text>
                <Text className='text-white text-3xl font-bold mb-4'>
                  {player.lastName}
                </Text>

                {/* Team Badge */}
                <View className='flex-row items-center mb-6'>
                  <View className='w-8 h-8 bg-gray-700 rounded mr-3 items-center justify-center'>
                    <Text className='text-white text-xs font-bold'>
                      #{player.jerseyNumber}
                    </Text>
                  </View>
                </View>

                {/* Stats Row */}
                <View className='flex-row justify-between'>
                  <View className='items-center'>
                    <Text className='text-white text-xs mb-1'>AGE</Text>
                    <Text className='text-white text-lg font-bold'>
                      {player.age}
                    </Text>
                  </View>
                  <View className='items-center'>
                    <Text className='text-white text-xs mb-1'>POSITION</Text>
                    <Text className='text-white text-lg font-bold'>
                      {player.position?.toUpperCase()}
                    </Text>
                  </View>
                  <View className='items-center'>
                    <Text className='text-white text-xs mb-1'>RATING</Text>
                    <Text className='text-white text-lg font-bold'>
                      {calculateAverageRating()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Performance Section */}
          <View className='px-6 mb-8'>
            <View className='flex-row items-center justify-between mb-6'>
              {/* Average Rating Circle */}
              <View className='items-center'>
                <View className='relative w-32 h-32 items-center justify-center mb-8'>
                  {/* Background circle */}
                  <View className='absolute w-32 h-32 rounded-full border-8 border-gray-700' />

                  {/* Progress circle based on average rating */}
                  <View
                    className='absolute w-32 h-32 rounded-full border-8'
                    style={{
                      borderTopColor: '#10B981', // Green color
                      borderRightColor:
                        parseFloat(calculateAverageRating()) > 1.5
                          ? '#10B981'
                          : '#374151',
                      borderBottomColor:
                        parseFloat(calculateAverageRating()) > 3.0
                          ? '#10B981'
                          : '#374151',
                      borderLeftColor:
                        parseFloat(calculateAverageRating()) > 4.5
                          ? '#10B981'
                          : '#374151',
                    }}
                  />

                  <View className='items-center'>
                    <Text className='text-white text-xs mb-1'>AVERAGE</Text>
                    <Text className='text-white text-4xl font-bold'>
                      {calculateAverageRating()}
                    </Text>
                  </View>
                </View>

                {/* Goal Conversion Rate Circle - Below Average */}
                <View className='relative w-32 h-32 items-center justify-center'>
                  {/* Background circle */}
                  <View className='absolute w-32 h-32 rounded-full border-8 border-gray-700' />

                  {/* Progress circle based on conversion rate */}
                  <View
                    className='absolute w-32 h-32 rounded-full border-8'
                    style={{
                      borderTopColor: '#d7b157', // Yellow color
                      borderRightColor:
                        calculateConversionRate() > 25 ? '#d7b157' : '#374151',
                      borderBottomColor:
                        calculateConversionRate() > 50 ? '#d7b157' : '#374151',
                      borderLeftColor:
                        calculateConversionRate() > 75 ? '#d7b157' : '#374151',
                    }}
                  />

                  <View className='items-center'>
                    <Text className='text-white text-xs mb-1'>CONVERSION</Text>
                    <Text className='text-white text-4xl font-bold'>
                      {calculateConversionRate().toFixed(0)}%
                    </Text>
                  </View>
                </View>
              </View>

              {/* Stats Column */}
              <View className='flex-1 ml-8'>
                {/* Goals */}
                <View className='mb-4'>
                  <Text className='text-white text-xs mb-2'>GOALS</Text>
                  <View className='flex-row items-center'>
                    <View className='flex-1 h-2 bg-gray-600 rounded-full mr-3'>
                      <View
                        className='h-2 bg-green-400 rounded-full'
                        style={{
                          width: `${Math.min(100, (player.totalGoals || 0) * 5)}%`,
                        }}
                      />
                    </View>
                    <View className='w-8 h-6 bg-green-400 rounded items-center justify-center'>
                      <Text className='text-white text-xs font-bold'>
                        {player.totalGoals || 0}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Assists */}
                <View className='mb-4'>
                  <Text className='text-white text-xs mb-2'>ASSISTS</Text>
                  <View className='flex-row items-center'>
                    <View className='flex-1 h-2 bg-gray-600 rounded-full mr-3'>
                      <View
                        className='h-2 bg-green-400 rounded-full'
                        style={{
                          width: `${Math.min(100, (player.totalAssists || 0) * 8)}%`,
                        }}
                      />
                    </View>
                    <View className='w-8 h-6 bg-green-400 rounded items-center justify-center'>
                      <Text className='text-white text-xs font-bold'>
                        {player.totalAssists || 0}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Passes */}
                <View className='mb-4'>
                  <Text className='text-white text-xs mb-2'>PASSES</Text>
                  <View className='flex-row items-center'>
                    <View className='flex-1 h-2 bg-gray-600 rounded-full mr-3'>
                      <View
                        className='h-2 bg-yellow-400 rounded-full'
                        style={{
                          width: `${Math.min(100, (player.totalPassesCompleted || 0) * 2)}%`,
                        }}
                      />
                    </View>
                    <View className='w-8 h-6 bg-yellow-400 rounded items-center justify-center'>
                      <Text className='text-black text-xs font-bold'>
                        {player.totalPassesCompleted || 0}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Performance Rating */}
                <View className='mb-4'>
                  <Text className='text-white text-xs mb-2'>PERFORMANCE</Text>
                  <View className='flex-row items-center'>
                    <View className='flex-1 h-2 bg-gray-600 rounded-full mr-3'>
                      <View
                        className='h-2 bg-green-400 rounded-full'
                        style={{
                          width: `${parseFloat(calculateAverageRating()) * 20}%`,
                        }}
                      />
                    </View>
                    <View className='w-8 h-6 bg-green-400 rounded items-center justify-center'>
                      <Text className='text-white text-xs font-bold'>
                        {Math.round(parseFloat(calculateAverageRating()) * 20)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Additional Information */}
          <View className='px-6 pb-8'>
            <View className='bg-gray-800/50 rounded-2xl p-6'>
              <Text className='text-white text-lg font-bold mb-4'>
                Contact Information
              </Text>

              {/* Contact Information (if available) */}
              {player.user ? (
                <View className='flex-row items-center'>
                  <View className='bg-gray-200 rounded-full p-2 mr-4'>
                    <Ionicons name='mail' size={16} color='#6b7280' />
                  </View>
                  <View className='flex-1'>
                    <Text className='text-white text-xs'>EMAIL</Text>
                    <Text className='text-white text-sm font-semibold'>
                      {player.user.email}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text className='text-gray-400 text-center py-4'>
                  No contact information available
                </Text>
              )}
            </View>
          </View>

          {/* Team Members Section */}
          {organization?.players && organization.players.length > 1 && (
            <View className='px-6 pb-8'>
              <View className='bg-gray-800/50 rounded-2xl p-6'>
                <Text className='text-white text-lg font-bold mb-6'>
                  Team Members
                </Text>

                <View className='flex-row flex-wrap justify-between'>
                  {organization.players
                    .filter((teamPlayer) => teamPlayer.id !== player?.id)
                    .map((teamPlayer, index) => (
                      <TouchableOpacity
                        key={teamPlayer.id}
                        className='w-[48%] mb-4 items-center'
                        onPress={() => router.push(`/player/${teamPlayer.id}`)}
                        activeOpacity={0.7}
                      >
                        {/* Player Avatar */}
                        <View className='relative mb-3'>
                          {teamPlayer.avatar ? (
                            <Image
                              source={{ uri: teamPlayer.avatar }}
                              className='w-16 h-16 rounded-full'
                              resizeMode='cover'
                            />
                          ) : (
                            <View className='w-16 h-16 rounded-full bg-gray-600 items-center justify-center'>
                              <Ionicons
                                name='person'
                                size={24}
                                color='#9CA3AF'
                              />
                            </View>
                          )}

                          {/* Jersey Number Badge */}
                          <View className='absolute -top-2 -right-2 w-6 h-6 bg-gray-800 rounded-full items-center justify-center border border-white'>
                            <Text className='text-white text-xs font-bold'>
                              #{teamPlayer.jerseyNumber}
                            </Text>
                          </View>
                        </View>

                        {/* Player Name */}
                        <Text
                          className='text-white text-sm font-semibold text-center'
                          numberOfLines={2}
                        >
                          {teamPlayer.name} {teamPlayer.lastName}
                        </Text>

                        {/* Position */}
                        <Text className='text-gray-300 text-xs text-center mt-1'>
                          {teamPlayer.position}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  )
}
