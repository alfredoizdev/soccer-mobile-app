import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Organization } from '../services/organization-service'

interface TeamCardProps {
  organization: Organization
  onPress?: () => void
}

export function TeamCard({ organization, onPress }: TeamCardProps) {
  const playerCount =
    organization.players?.length || organization.playerCount || 0

  return (
    <TouchableOpacity
      onPress={onPress}
      className='bg-white border border-gray-200 p-4 rounded-lg shadow-sm mb-4'
      activeOpacity={0.7}
    >
      <View className='flex-row items-center mb-3'>
        {organization.avatar ? (
          <Image
            source={{ uri: organization.avatar }}
            className='w-12 h-12 rounded-full mr-3'
            resizeMode='cover'
          />
        ) : (
          <View className='w-12 h-12 rounded-full bg-gray-200 mr-3 items-center justify-center'>
            <Text className='text-gray-500 text-lg font-bold'>
              {organization.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <View className='flex-1'>
          <Text className='text-lg font-bold text-gray-800'>
            {organization.name}
          </Text>
          {organization.description && (
            <Text className='text-gray-600 text-sm' numberOfLines={2}>
              {organization.description}
            </Text>
          )}
        </View>
      </View>

      <View className='flex-row justify-between items-center'>
        <View className='flex-row items-center'>
          <View className='bg-blue-100 px-3 py-1 rounded-full mr-2'>
            <Text className='text-blue-800 text-xs font-medium'>
              {playerCount} {playerCount === 1 ? 'Player' : 'Players'}
            </Text>
          </View>

          {organization.players && organization.players.length > 0 && (
            <View className='flex-row -space-x-2'>
              {organization.players.slice(0, 3).map((player, index) => (
                <View key={player.id} className='relative'>
                  {player.avatar ? (
                    <Image
                      source={{ uri: player.avatar }}
                      className='w-6 h-6 rounded-full border-2 border-white'
                      resizeMode='cover'
                    />
                  ) : (
                    <View className='w-6 h-6 rounded-full bg-gray-300 border-2 border-white items-center justify-center'>
                      <Text className='text-gray-600 text-xs font-bold'>
                        {player.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
              {organization.players.length > 3 && (
                <View className='w-6 h-6 rounded-full bg-gray-200 border-2 border-white items-center justify-center'>
                  <Text className='text-gray-600 text-xs font-bold'>
                    +{organization.players.length - 3}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View className='items-end'>
          <Text className='text-gray-500 text-xs'>Team</Text>
          <Text className='text-gray-400 text-xs'>Tap to view details</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
