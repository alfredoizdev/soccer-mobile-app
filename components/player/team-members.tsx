import { Ionicons } from '@expo/vector-icons'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Organization, Player } from '../../services/organization-service'

interface TeamMembersProps {
  organization: Organization
  currentPlayer: Player
  onPlayerPress: (playerId: string) => void
}

export function TeamMembers({ organization, currentPlayer, onPlayerPress }: TeamMembersProps) {
  if (!organization?.players || organization.players.length <= 1) {
    return null
  }

  const otherPlayers = organization.players.filter((teamPlayer) => teamPlayer.id !== currentPlayer?.id)

  return (
    <View className='px-6 pb-8'>
      <View className='bg-gray-800/50 rounded-2xl p-6'>
        <Text className='text-white text-lg font-bold mb-6'>
          Team Members
        </Text>

        <View className='flex-row flex-wrap justify-between'>
          {otherPlayers.map((teamPlayer) => (
            <TouchableOpacity
              key={teamPlayer.id}
              className='w-[48%] mb-4 items-center'
              onPress={() => onPlayerPress(teamPlayer.id)}
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
  )
}