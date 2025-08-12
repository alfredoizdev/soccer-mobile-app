import { Ionicons } from '@expo/vector-icons'
import { Text, View } from 'react-native'
import { Player } from '../../services/organization-service'

interface PlayerContactProps {
  player: Player
}

export function PlayerContact({ player }: PlayerContactProps) {
  return (
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
  )
}