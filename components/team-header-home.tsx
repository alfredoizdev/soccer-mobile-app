import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

interface TeamHeaderHomeProps {
  organization: {
    id: string
    name: string
    description: string
    avatar?: string
    playerCount?: number
    createdAt: string
  }
  stats: {
    wins: number
    draws: number
    losses: number
  }
  onMenuPress: () => void
}

const TeamHeaderHome: React.FC<TeamHeaderHomeProps> = ({
  organization,
  stats,
  onMenuPress,
}) => {
  return (
    <View className='px-4 pt-4 pb-6'>
      <View className='flex-row items-center justify-between mb-6'>
        <TouchableOpacity onPress={onMenuPress}>
          <Ionicons name='menu' size={24} color='white' />
        </TouchableOpacity>

        <View className='items-center'>
          {/* Team Logo - Large and prominent with white border */}
          <View className='bg-white rounded-2xl p-3 mb-3 shadow-lg'>
            {organization.avatar ? (
              <Image
                source={{ uri: organization.avatar }}
                className='w-20 h-20 rounded-xl'
                resizeMode='cover'
              />
            ) : (
              <View className='w-20 h-20 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 items-center justify-center'>
                <Text className='text-white text-3xl font-bold'>
                  {organization.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <Text className='text-white font-bold text-xl text-center'>
            {organization.name}
          </Text>
        </View>

        <View className='w-6' />
      </View>

      {/* Team Stats */}
      <View className='bg-white/20 rounded-lg p-4 mb-6'>
        <Text className='text-white font-semibold text-lg mb-3 text-center'>
          Season Stats
        </Text>
        <View className='flex-row justify-center items-center gap-4'>
          <View className='items-center'>
            <Text className='text-white font-bold text-2xl'>{stats.wins}</Text>
            <Text className='text-white text-sm opacity-80'>Wins</Text>
          </View>
          <View className='items-center'>
            <Text className='text-white font-bold text-2xl'>{stats.draws}</Text>
            <Text className='text-white text-sm opacity-80'>Draws</Text>
          </View>
          <View className='items-center'>
            <Text className='text-white font-bold text-2xl'>
              {stats.losses}
            </Text>
            <Text className='text-white text-sm opacity-80'>Losses</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default TeamHeaderHome
