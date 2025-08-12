import React from 'react'
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'
import { useOrganizationStore } from '../stores/organization-store'

interface TeamHeaderProps {
  organization: {
    id: string
    name: string
    description: string
    avatar?: string
    playerCount?: number
    createdAt: string
  }
}

const TeamHeader: React.FC<TeamHeaderProps> = ({ organization }) => {
  const { unsubscribeFromTeam, isLoading } = useOrganizationStore()

  const handleUnsubscribe = () => {
    Alert.alert(
      'Unsubscribe from Team',
      `Are you sure you want to unsubscribe from ${organization.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Unsubscribe',
          style: 'destructive',
          onPress: unsubscribeFromTeam,
        },
      ]
    )
  }

  return (
    <View className='bg-white rounded-2xl p-6 mb-6 shadow-xl border border-gray-100'>
      <View className='flex-row items-center mb-6'>
        {/* Team Logo - Large and prominent */}
        {organization.avatar ? (
          <Image
            source={{ uri: organization.avatar }}
            className='w-28 h-28 rounded-3xl mr-6'
            resizeMode='cover'
          />
        ) : (
          <View className='w-28 h-28 rounded-3xl bg-gradient-to-br from-red-500 to-pink-600 mr-6 items-center justify-center shadow-xl'>
            <Text className='text-white text-5xl font-bold'>
              {organization.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <View className='flex-1'>
          <Text className='text-3xl font-bold text-gray-800 mb-3'>
            {organization.name}
          </Text>
          <Text className='text-gray-600 text-lg leading-7 mb-4'>
            {organization.description}
          </Text>
          {organization.playerCount && (
            <View className='flex-row items-center'>
              <View className='bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-3 rounded-full'>
                <Text className='text-white text-base font-bold'>
                  {organization.playerCount}{' '}
                  {organization.playerCount === 1 ? 'Player' : 'Players'}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Unsubscribe Button */}
      <TouchableOpacity
        onPress={handleUnsubscribe}
        disabled={isLoading}
        className='bg-gradient-to-r from-red-500 to-pink-600 py-5 px-8 rounded-xl items-center shadow-lg'
        activeOpacity={0.8}
      >
        <Text className='text-white font-bold text-xl'>
          {isLoading ? 'Unsubscribing...' : 'Unsubscribe from Team'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default TeamHeader
