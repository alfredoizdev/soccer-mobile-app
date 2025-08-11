import { Ionicons } from '@expo/vector-icons'
import { Image, Text, TouchableOpacity, View } from 'react-native'

export interface Player {
  id: string
  name: string
  lastName: string
  jerseyNumber: number
  position: string
  avatar?: string
}

export interface PlayerCardProps {
  player: Player
  onPress: (playerId: string) => void
}

export function PlayerCard({ player, onPress }: PlayerCardProps) {
  return (
    <TouchableOpacity onPress={() => onPress(player.id)} className='mr-4'>
      <View className='bg-white rounded-xl shadow-lg overflow-hidden w-40'>
        <View className='relative'>
          {player.avatar ? (
            <Image
              source={{ uri: player.avatar }}
              className='w-full h-48'
              resizeMode='cover'
            />
          ) : (
            <View className='w-full h-48 bg-gray-200 items-center justify-center'>
              <Ionicons name='person' size={48} color='#9CA3AF' />
            </View>
          )}
          <View className='absolute top-2 right-2 bg-gray-800 rounded-full w-8 h-8 items-center justify-center'>
            <Text className='text-white font-bold text-sm'>
              #{player.jerseyNumber}
            </Text>
          </View>
        </View>
        <View className='p-3'>
          <Text className='text-gray-800 font-bold text-sm'>
            {player.name} {player.lastName}
          </Text>
          <Text className='text-gray-500 text-xs'>{player.position}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
