import { getTeamAbbreviation } from '@/lib/helpers/team-helpers'
import { Ionicons } from '@expo/vector-icons'
import { useEffect } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Game } from '../services/organization-service'
import { useEventsStore } from '../stores/events-store'

interface UpcomingEventsProps {
  organizationId: string
  onGamePress?: (game: Game) => void
  showOnlyUpcoming?: boolean
  showOnlyPast?: boolean
  isInWhiteContainer?: boolean
}

export function UpcomingEvents({
  organizationId,
  onGamePress,
  showOnlyUpcoming = false,
  showOnlyPast = false,
  isInWhiteContainer = false,
}: UpcomingEventsProps) {
  const {
    upcomingGames,
    pastGames,
    isLoading,
    error,
    fetchUpcomingGames,
    fetchPastGames,
  } = useEventsStore()

  useEffect(() => {
    if (organizationId) {
      if (!showOnlyPast) {
        fetchUpcomingGames(organizationId)
      }
      if (!showOnlyUpcoming) {
        fetchPastGames(organizationId)
      }
    }
  }, [
    organizationId,
    fetchUpcomingGames,
    fetchPastGames,
    showOnlyUpcoming,
    showOnlyPast,
  ])

  const formatDateBox = (dateString: string) => {
    const date = new Date(dateString)
    return {
      day: date.getDate().toString(),
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'inactive':
        return 'bg-blue-500'
      case 'completed':
        return 'bg-gray-500'
      case 'cancelled':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Upcoming'
      case 'inactive':
        return 'Finished'
      case 'completed':
        return 'Completed'
      case 'cancelled':
        return 'Cancelled'
      default:
        return status
    }
  }

  // Colors based on container
  const textColor = isInWhiteContainer ? 'text-gray-800' : 'text-white'
  const cardBgColor = isInWhiteContainer ? 'bg-gray-50' : 'bg-white/10'
  const smallTextColor = isInWhiteContainer ? 'text-gray-500' : 'text-white/60'

  if (isLoading) {
    return (
      <View className={`${cardBgColor} rounded-lg p-4 mb-4`}>
        <Text className={`${textColor} text-center`}>Loading games...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View className={`${cardBgColor} rounded-lg p-4 mb-4`}>
        <Text className={`${textColor} text-center text-red-500`}>
          Error loading games: {error}
        </Text>
      </View>
    )
  }

  const hasUpcomingGames = !showOnlyPast && upcomingGames.length > 0
  const hasPastGames = !showOnlyUpcoming && pastGames.length > 0

  if (!hasUpcomingGames && !hasPastGames) {
    return (
      <View className={`${cardBgColor} rounded-lg p-4 mb-4`}>
        <Text className={`${textColor} text-center`}>
          {showOnlyUpcoming
            ? 'No upcoming games'
            : showOnlyPast
              ? 'No past games'
              : 'No games available'}
        </Text>
      </View>
    )
  }

  return (
    <View className='mb-4'>
      {/* Upcoming Games Section */}
      {hasUpcomingGames && (
        <View className='mb-4'>
          {!showOnlyUpcoming && (
            <Text className={`${textColor} font-semibold text-lg mb-2`}>
              Upcoming Games
            </Text>
          )}
          {upcomingGames.map((game) => (
            <TouchableOpacity
              key={game.id}
              onPress={() => onGamePress?.(game)}
              className={`${cardBgColor} rounded-lg p-4 mb-2`}
            >
              <View className='flex-row items-stretch'>
                {/* Left Date Box */}
                <View
                  className={`${isInWhiteContainer ? 'bg-gray-200 border border-gray-300' : 'bg-white/20 border border-white/30'} rounded-lg p-3 items-center justify-center min-w-[70px] mr-4`}
                >
                  <Text
                    className={`${isInWhiteContainer ? 'text-gray-800' : 'text-white'} font-bold text-xl leading-tight`}
                  >
                    {formatDateBox(game.startDate).day}
                  </Text>
                  <Text
                    className={`${isInWhiteContainer ? 'text-gray-600' : 'text-white/80'} text-xs font-semibold`}
                  >
                    {formatDateBox(game.startDate).month}
                  </Text>
                </View>

                {/* Right Content */}
                <View className='flex-1'>
                  <View className='flex-row items-center justify-between mb-2'>
                    <View className='flex-row items-center flex-1'>
                      <Ionicons
                        name='football'
                        size={20}
                        color='#d7b157'
                        className='mr-2'
                      />
                      <Text className={`${textColor} font-semibold flex-1`}>
                        {getTeamAbbreviation(game.homeTeam.name)} v{' '}
                        {getTeamAbbreviation(game.awayTeam.name)}
                      </Text>
                    </View>
                    <View
                      className={`px-2 py-1 rounded-full ${getStatusColor(game.status)}`}
                    >
                      <Text className='text-white text-xs font-semibold'>
                        {getStatusText(game.status)}
                      </Text>
                    </View>
                  </View>

                  <View className='flex-row items-center'>
                    {game.location && (
                      <Text className={`${smallTextColor} text-xs ml-3`}>
                        <Ionicons name='location' size={16} color='#d7b157' />{' '}
                        {game.location}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Past Games Section */}
      {hasPastGames && (
        <View>
          {!showOnlyPast && (
            <Text className={`${textColor} font-semibold text-lg mb-2`}>
              Past Games
            </Text>
          )}

          {pastGames.map((game) => (
            <TouchableOpacity
              key={game.id}
              onPress={() => onGamePress?.(game)}
              className={`${cardBgColor} rounded-lg p-4 mb-2`}
            >
              <View className='flex-row items-stretch'>
                {/* Left Date Box */}
                <View
                  className={`${isInWhiteContainer ? 'bg-gray-200 border border-gray-300' : 'bg-white/20 border border-white/30'} rounded-lg p-3 items-center justify-center min-w-[70px] mr-4`}
                >
                  <Text
                    className={`${isInWhiteContainer ? 'text-gray-800' : 'text-white'} font-bold text-xl leading-tight`}
                  >
                    {formatDateBox(game.startDate).day}
                  </Text>
                  <Text
                    className={`${isInWhiteContainer ? 'text-gray-600' : 'text-white/80'} text-xs font-semibold`}
                  >
                    {formatDateBox(game.startDate).month}
                  </Text>
                </View>

                {/* Right Content */}
                <View className='flex-1'>
                  <View className='flex-row items-center justify-between mb-2'>
                    <View className='flex-row items-center flex-1'>
                      <Ionicons
                        name='football'
                        size={20}
                        color='#d7b157'
                        className='mr-2'
                      />
                      <Text className={`${textColor} font-semibold flex-1`}>
                        {getTeamAbbreviation(game.homeTeam.name)} v{' '}
                        {getTeamAbbreviation(game.awayTeam.name)}
                      </Text>
                    </View>
                    <View
                      className={`px-2 py-1 rounded-full ${getStatusColor(game.status)}`}
                    >
                      <Text className='text-white text-xs font-semibold'>
                        {getStatusText(game.status)}
                      </Text>
                    </View>
                  </View>

                  <View className='flex-row items-center'>
                    {game.location && (
                      <Text className={`${smallTextColor} text-xs ml-3`}>
                        <Ionicons name='location' size={16} color='#d7b157' />{' '}
                        {game.location}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}
