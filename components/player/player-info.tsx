import { Ionicons } from '@expo/vector-icons'
import { Image, Text, View } from 'react-native'
import { Player } from '../../services/organization-service'

interface PlayerInfoProps {
  player: Player
  averageRating: string
}

export function PlayerInfo({ player, averageRating }: PlayerInfoProps) {
  return (
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
                {averageRating}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}