import { ScrollView, Text, View } from 'react-native'
import { Player, PlayerCard } from './player-card'
import { UpcomingEvents } from './upcoming-events'

export interface PlayersSectionProps {
  players?: Player[]
  isLoading: boolean
  onPlayerPress: (playerId: string) => void
  organizationId?: string
  onGamePress?: (game: any) => void
}

export function PlayersSection({
  players,
  isLoading,
  onPlayerPress,
  organizationId,
  onGamePress,
}: PlayersSectionProps) {
  return (
    <View className='px-4'>
      <Text className='text-gray-800 font-bold text-xl mb-4'>Our Players</Text>

      {players && players.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className='mb-6'
          style={{ height: 240 }}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onPress={onPlayerPress}
            />
          ))}
        </ScrollView>
      ) : (
        <View className='bg-gray-50 rounded-lg p-6 mb-6'>
          <Text className='text-gray-600 text-center'>
            No players found for this team.
          </Text>
        </View>
      )}

      {/* Active Games Section */}
      {organizationId && (
        <View className='mb-6'>
          <UpcomingEvents
            organizationId={organizationId}
            onGamePress={onGamePress}
            showOnlyUpcoming={true}
            isInWhiteContainer={true}
          />
        </View>
      )}
    </View>
  )
}
