import { Ionicons } from '@expo/vector-icons'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Player } from '../../services/organization-service'

interface PlayerHeaderProps {
  onBackPress: () => void
  onMenuPress: () => void
}

export function PlayerHeader({ onBackPress, onMenuPress }: PlayerHeaderProps) {
  return (
    <View className='flex-row items-center justify-between px-6 pt-14 pb-6'>
      <TouchableOpacity
        onPress={onBackPress}
        className='w-10 h-10 items-center justify-center'
      >
        <Ionicons name='chevron-back' size={24} color='white' />
      </TouchableOpacity>
      <Text className='text-white text-sm font-medium tracking-wider uppercase'>
        DETAILED VIEW
      </Text>
      <TouchableOpacity 
        onPress={onMenuPress}
        className='w-10 h-10 items-center justify-center'
      >
        <Ionicons name='menu' size={24} color='white' />
      </TouchableOpacity>
    </View>
  )
}